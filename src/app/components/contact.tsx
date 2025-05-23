"use client";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import Image from "next/image";
import emailjs from "@emailjs/browser";
import { FormEvent, useRef, useState } from "react";

export default function Contact() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [sending, setSending] = useState(false);

  const form = useRef<HTMLFormElement | null>(null);

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();

    if (!form.current) return;
    setSending(true);
    emailjs
      .sendForm(
        "service_35o1hsl", // Ganti dengan ID dari EmailJS
        "template_1hpwz9j", // Ganti dengan ID dari EmailJS
        form.current,
        "9jljMROO6YYwm1088" // Ganti dengan Public Key dari EmailJS
      )
      .then(
        (result) => {
          console.log("Email sent:", result.text);
          alert("Pesan berhasil dikirim!");
        },
        (error) => {
          console.error("Email error:", error.text);
          alert("Gagal mengirim pesan.");
        }
      )
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <section
      ref={ref}
      className="py-16 md:py-20 lg:py-24 bg-gray-50"
      id="contact"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block px-4 py-1 mb-4 border border-[var(--primary-lighter)] rounded-full bg-[var(--secondary-light)] text-[var(--primary-dark)]">
            <span className="text-sm font-medium">{t("contact.tag")}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            {t("contact.title")}{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent relative">
              {t("contact.titleHighlight")}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--primary-light)]"></span>
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t("contact.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Form */}
          <div
            className={cn(
              "bg-white rounded-xl shadow-soft p-5 md:p-8 transition-all duration-700 transform",
              inView ? "opacity-100 animate-slide-in-left" : "opacity-0"
            )}
            style={{ animationFillMode: "both" }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
                {t("contact.sendMessage")}
              </span>
            </h3>

            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("contact.name")}
                  </label>
                  <Input
                    name="name"
                    id="name"
                    placeholder={t("contact.name")}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("contact.email")}
                  </label>
                  <Input
                    name="email"
                    id="email"
                    type="email"
                    placeholder={t("contact.email")}
                    className="w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.subject")}
                </label>
                <Input
                  name="title"
                  id="title"
                  placeholder={t("contact.subjectPlaceholder")}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.message")}
                </label>
                <Textarea
                  name="message"
                  id="message"
                  placeholder={t("contact.messagePlaceholder")}
                  className="w-full min-h-[120px]"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white group transition-all duration-300 hover:-translate-y-1"
              >
                {sending ? "Sending..." : t("contact.send")}
                <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div
            className={cn(
              "bg-white rounded-xl shadow-soft p-8 transition-all duration-700 transform",
              inView ? "opacity-100 animate-slide-in-right" : "opacity-0"
            )}
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
                {t("contact.contactInfo")}
              </span>
            </h3>

            <div className="space-y-6">
              {/* Headquarters */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center group-hover:bg-[var(--secondary)] transition-colors duration-300">
                    <MapPin className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--primary-dark)] transition-colors duration-300">
                    {t("contact.headquarters")}
                  </h4>
                  <p className="text-gray-600 mt-1">
                    Jl. Arteri Pondok Indah, No. 30 A-C
                    <br />
                    Kel. Kebayoran Lama Selatan, Jakarta Selatan. 12240
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center group-hover:bg-[var(--secondary)] transition-colors duration-300">
                    <Phone className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--primary-dark)] transition-colors duration-300">
                    {t("contact.phone")}
                  </h4>
                  <p className="text-gray-600 mt-1">{"(+62) 821-2465-7804"}</p>
                  <p className="text-gray-500 text-sm">
                    {t("contact.phoneHours")}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center group-hover:bg-[var(--secondary)] transition-colors duration-300">
                    <Mail className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--primary-dark)] transition-colors duration-300">
                    {t("contact.emailLabel")}
                  </h4>
                  <p className="text-gray-600 mt-1">support@wedison.co</p>
                  <p className="text-gray-500 text-sm">
                    {t("contact.emailResponse")}
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="mt-6 md:mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {t("contact.followUs")}
              </h4>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61562726390879"
                  target="_blank"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[var(--secondary-light)] text-gray-600 hover:text-[var(--primary)] transition-colors duration-300"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/wedison.id/"
                  target="_blank"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[var(--secondary-light)] text-gray-600 hover:text-[var(--primary)] transition-colors duration-300"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.25-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                {/* tiktok */}
                <a href="https://www.tiktok.com/@wedison.id" target="_blank">
                  <Image
                    src="/logo-tiktok-svgrepo-com.svg"
                    alt="tiktok"
                    width={80}
                    height={80}
                    className="h-10 w-10 p-2.5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[var(--secondary-light)] text-gray-600 hover:text-[var(--primary)] transition-colors duration-300"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
