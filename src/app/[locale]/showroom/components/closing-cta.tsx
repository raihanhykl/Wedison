"use client";

import Image from "next/image";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { BookingTrigger } from "@/components/booking/booking-trigger";

/** SEMENTARA: foto pengendara. Ganti dengan ASET-S05 (band CTA penutup, 21:9 + 4:5). */
const CTA_IMAGE = "/new-looks/Banner Footer.webp";

export default function ShowroomClosingCta() {
  const { t } = useLanguage();
  return (
    <section className="relative isolate overflow-hidden bg-forest-deep">
      <Image
        src={CTA_IMAGE}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-10 object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep via-forest-deep/80 to-forest-deep/10" />
      <div className="main-container py-20 sm:py-28">
        <Reveal className="max-w-xl">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {t("showroomPage.cta.title")}
          </h2>
          <p className="mt-4 max-w-[44ch] text-pretty text-base leading-relaxed text-forest-foreground/85 sm:text-lg">
            {t("showroomPage.cta.desc")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BookingTrigger asChild purpose="testRide" source="showroom-cta">
              <Button size="lg" className="bg-on-forest-accent text-forest-deep hover:bg-white">
                {t("showroomPage.hero.ctaPrimary")}
              </Button>
            </BookingTrigger>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
            >
              <a href="#lokasi">{t("showroomPage.hero.ctaSecondary")}</a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
