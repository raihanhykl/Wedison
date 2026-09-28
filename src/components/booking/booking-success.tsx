"use client";

import { CalendarCheck, CheckCircle2, MapPin, MessageCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/lib/language-context";
import { SHOWROOMS } from "@/lib/booking/showrooms";
import { formatLongDate } from "@/lib/booking/slots";
import type { BookingResult } from "./booking-form";

type Props = { result: BookingResult; onClose: () => void };

/**
 * Tampilan "Terima kasih" di dalam modal (setelah submit sukses). Event GTM `booking_success`
 * sudah didorong ke dataLayer oleh form; tampilan ini menampilkan ringkasan + tombol WhatsApp
 * cadangan bila tab WA tidak terbuka otomatis (popup blocker / iOS).
 */
export function BookingSuccess({ result, onClose }: Props) {
  const { t, language } = useLanguage();
  const showroom = SHOWROOMS[result.showroom];

  const rows = [
    { Icon: MapPin, label: t("booking.field.showroom"), value: t(showroom.nameKey) },
    { Icon: Tag, label: t("booking.field.purpose"), value: result.purposeLabel },
    {
      Icon: CalendarCheck,
      label: t("booking.success.schedule"),
      value: `${formatLongDate(result.date, language)} · ${result.time} ${showroom.tzLabel}`,
    },
  ];

  return (
    <div className="space-y-5" data-booking-success>
      <div className="flex items-center gap-3 rounded-lg bg-secondary/60 p-4 text-sm text-foreground">
        <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" aria-hidden />
        <p>{result.whatsappOpened ? t("booking.success.opened") : t("booking.success.popupBlocked")}</p>
      </div>

      <dl className="divide-y divide-border rounded-lg border border-border">
        {rows.map(({ Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 px-4 py-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium text-foreground">{value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("booking.success.close")}
        </Button>
        <Button asChild>
          <a href={result.whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            {t("booking.success.whatsapp")}
          </a>
        </Button>
      </div>
    </div>
  );
}
