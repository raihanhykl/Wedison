"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
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
import { cn } from "@/lib/utils";
import { CheckCircle2, Send, AlertCircle } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  ContactFormData,
  contactFormSchema,
  FORM_TOPICS,
  type FormTopic,
} from "@/lib/contact-schema";
import { EmailService } from "@/service/email-service";
import { Checkbox } from "@/components/ui/checkbox";
import { pushDataLayer } from "@/lib/booking/analytics";

type Props = {
  /** Topik yang dipilih dari luar (mis. baris "Kemitraan" di halaman Kontak). */
  topic?: FormTopic | null;
  /** Prefix ID elemen form (stabil untuk trigger GTM), mis. "sby-inquiry" -> #sby-inquiry-submit. */
  idPrefix?: string;
  /** Slug halaman asal; disimpan di admin (Leads > Contact Messages) untuk filter. */
  source?: string;
  /** Subset topik yang ditawarkan (default: semua). */
  topics?: readonly FormTopic[];
  /** Awalan subjek email notifikasi tim, mis. "[Teaser Surabaya] ". */
  emailTopicPrefix?: string;
  /** Preview admin: validasi jalan, tetapi tidak ada yang dikirim/disimpan. */
  dryRun?: boolean;
};

export default function Contact({
  topic = null,
  idPrefix = "contact-form",
  source = "contact-page",
  topics = FORM_TOPICS,
  emailTopicPrefix = "",
  dryRun = false,
}: Props) {
  const fid = (name: string) => `${idPrefix}-${name}`;
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Honeypot: field tersembunyi yang hanya diisi bot
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Throttle anti-spam sisi client (1 kirim / 10 detik) + tolak headless browser
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_EMAIL_CONFIG_publicKey;
    if (publicKey) {
      emailjs.init({
        publicKey,
        blockHeadless: true,
        limitRate: { id: "contact_form", throttle: 10000 },
      });
    }
  }, []);


  // Initialize react-hook-form with Zod validation
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      title: "",
      agreePrivacy: false,
      otherTitle: "",
      message: "",
    },
    mode: "onChange", // Validate on change for better UX
    shouldUnregister: false,
  });

  useEffect(() => {
    if (topic) form.setValue("title", t(`form.title.${topic}.value`), { shouldValidate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const selectedTitle = form.watch("title");
  const isOtherSelected = selectedTitle === t("form.title.other.value");

  useEffect(() => {
    if (!isOtherSelected) {
      form.setValue("otherTitle", "");
    }
  }, [isOtherSelected, form]);

  const handleFormSubmit = async (data: ContactFormData) => {
    // Honeypot: bila terisi, kemungkinan besar bot -> abaikan diam-diam
    if (honeypotRef.current?.value) {
      form.reset();
      return;
    }

    if (isSubmitting) return;
    if (dryRun) {
      toast("Preview mode", { description: "The form is valid. Nothing was sent: messages are only saved on the live page.", position: "top-center" });
      return;
    }
    setIsSubmitting(true);
    const topicValue =
      data.title.includes("Judul Lainnya: ") && data.otherTitle
        ? data.title + data.otherTitle
        : data.title;
    try {
      // Sumber kebenaran = database (muncul di admin Leads > Contact Messages). Hanya bila
      // penyimpanan ini berhasil, pengguna diberi tahu "terkirim". Server menolak kiriman
      // ulang dengan isi sama dalam 15 menit (idempoten), jadi klik ganda tidak menduplikasi.
      const res = await fetch("/api/v1/public/leads/contacts/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          topic: topicValue,
          message: data.message,
          source,
          locale: language,
        }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (res.ok && json?.ok) {
        // Notifikasi email ke tim (EmailJS) bersifat tambahan: kegagalannya tidak boleh
        // membuat pengguna mengira pesannya gagal, karena pesan sudah tersimpan.
        void EmailService.sendContactEmail({ ...data, title: emailTopicPrefix + data.title }).then((r) => {
          if (!r.success) console.warn("Contact email notification failed:", r.message);
        });
        // Konversi untuk GTM (Custom Event): hanya setelah pesan benar-benar tersimpan.
        pushDataLayer({
          event: "contact_submit_success",
          contact_source: source,
          contact_topic: topicValue,
          contact_locale: language,
        });
        form.reset();
        toast(t("form.sending.success.title"), {
          description: t("form.sending.success.description"),
          descriptionClassName: "text-black/90",
          icon: <CheckCircle2 className="text-primary mr-2" />,
          duration: 4000,
          position: "top-center",
          style: {
            backgroundColor: "white",
            color: "black",
            gap: "1rem",
          },
        });
      } else {
        throw new Error(json?.message ?? `Request failed (${res.status})`);
      }
    } catch (error) {
      console.error("Form submission error:", error);

      toast(t("form.sending.error.title"), {
        description: t("form.sending.error.description"),
        icon: <AlertCircle className="text-red-500 mr-2" />,
        duration: 4000,
        position: "top-center",
        style: {
          backgroundColor: "white",
          color: "black",
          gap: "1rem",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Pembungkus netral: judul & latar diatur halaman pemakainya.
    <div id={fid("container")}>
      <div id={fid("inner")}>
        <div id={fid("card")} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] md:p-8">
          <Form {...form}>
            <form
              id={idPrefix}
              name={idPrefix}
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Name and Email Row */}
              <div id={fid("row-name-email")} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem id={fid("field-name")} controlId={fid("name")}>
                      <FormLabel id={fid("label-name")}>{t("contact.name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("contact.name")}
                          {...field}
                          disabled={isSubmitting}
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
                    <FormItem id={fid("field-email")} controlId={fid("email")}>
                      <FormLabel id={fid("label-email")}>{t("contact.email")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("contact.email")}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem id={fid("field-phone")} controlId={fid("phone")}>
                    <FormLabel id={fid("label-phone")}>{t("contact.phone")}</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subject/Topic Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem id={fid("field-topic")} controlId={fid("topic")}>
                    <FormLabel id={fid("label-topic")}>{t("contact.subject")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("form.title.placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem
                            key={topic}
                            id={fid(`topic-option-${topic}`)}
                            value={t(`form.title.${topic}.value`)}
                          >
                            {t(`form.title.${topic}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Other Title Field (Conditional) */}
              {isOtherSelected && (
                <FormField
                  control={form.control}
                  name="otherTitle"
                  render={({ field }) => (
                    <FormItem id={fid("field-topic-other")} controlId={fid("topic-other")}>
                      <FormLabel id={fid("label-topic-other")}>Other Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("contact.subjectPlaceholder")}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Message Field */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem id={fid("field-message")} controlId={fid("message")}>
                    <FormLabel id={fid("label-message")}>{t("contact.message")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("contact.messagePlaceholder")}
                        className="min-h-[120px] resize-none"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* checkbox field */}
              <FormField
                control={form.control}
                name="agreePrivacy"
                render={({ field }) => (
                  <FormItem
                    id={fid("field-agree-privacy")}
                    controlId={fid("agree-privacy")}
                    className="flex items-center space-3"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div id={fid("agree-privacy-text")}>
                      <FormDescription>
                        {t("form.agreePrivacy.description")}
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Honeypot anti-bot: tersembunyi dari user, hanya diisi bot */}
              <div
                id={fid("hp")}
                aria-hidden="true"
                className="absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden"
              >
                <input
                  id={fid("hp-company")}
                  type="text"
                  ref={honeypotRef}
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <Button
                id={fid("submit")}
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className={cn(
                  "w-full bg-primary hover:bg-[var(--primary-dark)] text-white group transition-all duration-300",
                  !isSubmitting && "hover:-translate-y-1"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div id={fid("submit-spinner")} className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t("form.sending.sending")}
                  </>
                ) : (
                  <>
                    {t("contact.send")}
                    <Send id={fid("submit-icon")} className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
