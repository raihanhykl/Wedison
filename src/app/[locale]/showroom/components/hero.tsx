"use client";

import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { ArtDirectedImage } from "@/components/art-directed-image";
import { BookingTrigger } from "@/components/booking/booking-trigger";

/**
 * SEMENTARA: foto jajaran motor. Ganti dengan aset final ASET-S01 (hero showroom; desktop
 * 16:9 + mobile 9:16, area bawah 40% tenang untuk teks).
 */
const HERO = {
  desktop: "/new-looks/HERO 1.webp",
  mobile: "/new-looks/HERO 1.webp",
};

export default function ShowroomHero() {
  const { t } = useLanguage();
  const facts = ["fact1", "fact2", "fact3"].map((k) => t(`showroomPage.hero.${k}`));

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-forest-deep">
      <ArtDirectedImage
        desktop={HERO.desktop}
        mobile={HERO.mobile}
        alt={t("showroomPage.hero.imageAlt")}
        priority
        className="object-cover object-[60%_center]"
      />
      {/* Scrim: kuat di bawah (teks), tipis di atas (navbar) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

      <div className="absolute inset-0 flex flex-col justify-end pb-20 sm:pb-24">
        <div className="main-container">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-on-forest-accent">
            {t("showroom.tag")}
          </p>
          <h1 className="mt-4 max-w-[14ch] text-balance font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-7xl">
            {t("showroomPage.hero.title")}
          </h1>
          <p className="mt-5 max-w-[52ch] text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
            {t("showroomPage.hero.desc")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BookingTrigger asChild purpose="testRide" source="showroom-hero">
              <Button size="lg" className="bg-white text-foreground hover:bg-white/90">
                {t("showroomPage.hero.ctaPrimary")}
              </Button>
            </BookingTrigger>
            <Button
              asChild
              size="lg"
              className="border border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              <a href="#lokasi">{t("showroomPage.hero.ctaSecondary")}</a>
            </Button>
          </div>

          {/* Tiga hal yang paling sering ditanyakan, dijawab sebelum orang bertanya */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/20 pt-5 text-sm text-white/85">
            {facts.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-on-forest-accent" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ChevronDown
        className="absolute bottom-6 left-1/2 hidden h-6 w-6 -translate-x-1/2 animate-float text-white/60 sm:block"
        aria-hidden
      />
    </section>
  );
}
