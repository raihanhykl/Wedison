"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Send } from "lucide-react";
import { id as dfId } from "date-fns/locale/id";
import { toast } from "sonner";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecaptchaCheckbox, type RecaptchaHandle } from "@/components/recaptcha-checkbox";
import { cn } from "@/lib/utils";
import { SHOWROOM_LIST, SHOWROOMS, type ShowroomId } from "@/lib/booking/showrooms";
import {
  BOOKING_PURPOSES,
  createBookingSchema,
  normalizePhone,
  type BookingPurpose,
} from "@/lib/booking/schema";
import {
  MAX_DAYS_AHEAD,
  availableSlots,
  dateFromYmd,
  formatLongDate,
  isDateBookable,
  ymdFromLocalDate,
} from "@/lib/booking/slots";
import { buildWhatsappUrl } from "@/lib/booking/whatsapp";
import { trackBookingError, trackBookingSuccess } from "@/lib/booking/analytics";
import type { BookingPrefill } from "./booking-context";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

type FormValues = {
  showroom: ShowroomId | "";
  purpose: BookingPurpose | "";
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  note: string;
  website: string; // honeypot
};

export type BookingResult = {
  showroom: ShowroomId;
  purpose: BookingPurpose;
  purposeLabel: string;
  name: string;
  date: string;
  time: string;
  whatsappUrl: string;
  whatsappOpened: boolean;
  calendar: string;
};

type Props = {
  prefill: BookingPrefill;
  onSubmittingChange: (submitting: boolean) => void;
  onSuccess: (result: BookingResult) => void;
};

export function BookingForm({ prefill, onSubmittingChange, onSuccess }: Props) {
  const { t, language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaHandle>(null);
  const recaptchaEnabled = Boolean(RECAPTCHA_SITE_KEY);

  const schema = useMemo(
    () =>
      createBookingSchema({
        showroom: t("booking.error.showroom"),
        name: t("booking.error.name"),
        nameMax: t("booking.error.nameMax"),
        phone: t("booking.error.phone"),
        email: t("booking.error.email"),
        purpose: t("booking.error.purpose"),
        date: t("booking.error.date"),
        time: t("booking.error.time"),
        note: t("booking.error.note"),
      }),
    [t],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    mode: "onTouched",
    defaultValues: {
      showroom: prefill.showroom ?? "",
      purpose: prefill.purpose ?? "",
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      note: "",
      website: "",
    },
  });

  const showroom = form.watch("showroom");
  const date = form.watch("date");
  const time = form.watch("time");

  // Slot jam mengikuti showroom (zona waktu & jam buka) + tanggal terpilih.
  const slots = useMemo(
    () => (showroom && date ? availableSlots(showroom, date) : []),
    [showroom, date],
  );
  // Kalau showroom/tanggal berubah dan jam yang dipilih tak lagi tersedia -> kosongkan.
  useEffect(() => {
    if (time && !slots.includes(time)) form.setValue("time", "", { shouldValidate: false });
  }, [slots, time, form]);

  const tzLabel = showroom ? SHOWROOMS[showroom].tzLabel : "";
  const today = useMemo(() => new Date(), []);
  const endMonth = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + MAX_DAYS_AHEAD);
    return d;
  }, [today]);

  const purposeLabel = (p: BookingPurpose) => t(`booking.purpose.${p}`);

  const onSubmit = async (values: FormValues) => {
    if (recaptchaEnabled && !recaptchaToken) {
      toast(t("booking.error.submit.title"), { description: t("booking.error.recaptcha") });
      return;
    }
    // Nilai sudah lolos zod, jadi showroom/purpose pasti terisi.
    const showroomId = values.showroom as ShowroomId;
    const purpose = values.purpose as BookingPurpose;
    const phone = normalizePhone(values.phone);

    // Tab WhatsApp dibuka SEKARANG (masih dalam gesture klik) agar tidak kena popup blocker,
    // lalu diarahkan ke wa.me setelah server menjawab. Gagal -> tab ditutup lagi.
    const waWin = window.open("", "_blank");
    if (waWin) waWin.opener = null;

    setSubmitting(true);
    onSubmittingChange(true);
    try {
      // Backend Express (server/): validasi, simpan ke DB (tampil di admin), sinkron Google Calendar.
      const res = await fetch("/api/v1/public/leads/bookings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          phone,
          email: values.email.trim(),
          note: values.note.trim(),
          source: prefill.source,
          locale: language,
          recaptchaToken: recaptchaToken ?? undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        calendar?: string;
        id?: string | null;
      };

      if (!res.ok || !data.ok) {
        waWin?.close();
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
        const reason = data.code ?? `http_${res.status}`;
        trackBookingError(reason);
        if (reason === "SLOT_UNAVAILABLE") {
          form.setError("time", { message: t("booking.error.slot") });
          return;
        }
        toast(t("booking.error.submit.title"), {
          description:
            reason === "RATE_LIMIT"
              ? t("booking.error.rateLimited")
              : reason === "RECAPTCHA"
                ? t("booking.error.recaptcha")
                : t("booking.error.submit.desc"),
        });
        return;
      }

      const whatsappUrl = buildWhatsappUrl({
        showroom: showroomId,
        purpose,
        purposeLabel: purposeLabel(purpose),
        name: values.name.trim(),
        phone,
        email: values.email.trim() || undefined,
        date: values.date,
        time: values.time,
        note: values.note.trim() || undefined,
        locale: language,
      });

      let whatsappOpened = false;
      if (waWin && !waWin.closed) {
        try {
          waWin.location.href = whatsappUrl;
          whatsappOpened = true;
        } catch {
          waWin.close();
        }
      }

      trackBookingSuccess({
        source: prefill.source,
        purpose,
        showroom: showroomId,
        date: values.date,
        locale: language,
        calendar: data.calendar ?? "unknown",
      });

      onSuccess({
        showroom: showroomId,
        purpose,
        purposeLabel: purposeLabel(purpose),
        name: values.name.trim(),
        date: values.date,
        time: values.time,
        whatsappUrl,
        whatsappOpened,
        calendar: data.calendar ?? "unknown",
      });
    } catch (err) {
      waWin?.close();
      console.error("[booking] submit gagal:", err);
      trackBookingError("network");
      toast(t("booking.error.submit.title"), { description: t("booking.error.submit.desc") });
    } finally {
      setSubmitting(false);
      onSubmittingChange(false);
    }
  };

  const optional = (
    <span className="ml-1 font-normal text-muted-foreground">{t("booking.optional")}</span>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Honeypot: tak terlihat oleh manusia, tetap ada di DOM untuk bot */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" {...form.register("website")} />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="showroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("booking.field.showroom")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={submitting}>
                  <FormControl>
                    <SelectTrigger
                      className="w-full"
                      data-autofocus={prefill.showroom ? undefined : ""}
                    >
                      <SelectValue placeholder={t("booking.placeholder.showroom")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SHOWROOM_LIST.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {t(s.nameKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("booking.field.purpose")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={submitting}>
                  <FormControl>
                    <SelectTrigger
                      className="w-full"
                      data-autofocus={prefill.showroom && !prefill.purpose ? "" : undefined}
                    >
                      <SelectValue placeholder={t("booking.placeholder.purpose")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BOOKING_PURPOSES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {purposeLabel(p)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("booking.field.name")}</FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  placeholder={t("booking.placeholder.name")}
                  disabled={submitting}
                  data-autofocus={prefill.showroom && prefill.purpose ? "" : undefined}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("booking.field.phone")}</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="08xxxxxxxxxx"
                    disabled={submitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("booking.field.email")}
                  {optional}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    disabled={submitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("booking.field.date")}</FormLabel>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={submitting}
                        className={cn(
                          "h-9 w-full justify-start px-3 font-normal shadow-xs",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="h-4 w-4 opacity-60" />
                        <span className="truncate">
                          {field.value
                            ? formatLongDate(field.value, language)
                            : t("booking.placeholder.date")}
                        </span>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={language === "id" ? dfId : undefined}
                      selected={field.value ? localDate(field.value) : undefined}
                      onSelect={(d) => {
                        field.onChange(d ? ymdFromLocalDate(d) : "");
                        setDateOpen(false);
                      }}
                      startMonth={today}
                      endMonth={endMonth}
                      disabled={(d) => !isDateBookable(showroom || "jakarta", ymdFromLocalDate(d))}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("booking.field.time")}
                  {tzLabel && (
                    <span className="ml-1 font-normal text-muted-foreground">({tzLabel})</span>
                  )}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={submitting || !showroom || !date || slots.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          !showroom || !date
                            ? t("booking.time.pickDateFirst")
                            : slots.length === 0
                              ? t("booking.time.none")
                              : t("booking.placeholder.time")
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-64">
                    {slots.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="-mt-2 text-xs text-muted-foreground">{t("booking.hoursHint")}</p>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("booking.field.note")}
                {optional}
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder={t("booking.placeholder.note")}
                  disabled={submitting}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {recaptchaEnabled && (
          <RecaptchaCheckbox
            ref={recaptchaRef}
            siteKey={RECAPTCHA_SITE_KEY as string}
            onChange={setRecaptchaToken}
          />
        )}

        <div className="space-y-3 pt-1">
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("booking.submitting")}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t("booking.submit")}
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">{t("booking.privacy")}</p>
        </div>
      </form>
    </Form>
  );
}

/** "YYYY-MM-DD" -> Date lokal 00:00 (react-day-picker bekerja dengan tanggal lokal). */
function localDate(ymd: string): Date {
  const d = dateFromYmd(ymd);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
