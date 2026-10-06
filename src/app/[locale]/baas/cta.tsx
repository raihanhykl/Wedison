"use client";

import Image from "next/image";
import { MessageCircle, CalendarCheck } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { BookingTrigger } from "@/components/booking/booking-trigger";
import { whatsappUrl } from "@/lib/seo/site";

/** CTA penutup — band forest-deep: minta penawaran (WhatsApp) atau jadwalkan test ride (modal booking). */
export default function BaasCta() {
  const { t, language } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden bg-forest-deep">
      <Image
        src="/new-looks/HERO 3.webp"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-20"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest-deep/85 to-forest-deep/70" />
      <div className="main-container py-20 text-center sm:py-28">
        <Reveal>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {t("baas.cta.title")}
            </h2>
            <p className="mt-4 text-pretty text-white/80 sm:text-lg">{t("baas.cta.description")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-on-forest-accent text-forest-deep hover:bg-white">
                <a
                  href={whatsappUrl(
                    language === "en"
                      ? "Hello Wedison, I would like a quotation for the BaaS programme."
                      : "Halo Wedison, saya ingin minta penawaran program BaaS.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  {t("baas.cta.primary")}
                </a>
              </Button>
              <BookingTrigger asChild purpose="testRide" source="baas-cta">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                >
                  <CalendarCheck className="h-5 w-5" />
                  {t("baas.cta.secondary")}
                </Button>
              </BookingTrigger>
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-forest-muted">
              {t("baas.cta.limited")}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
