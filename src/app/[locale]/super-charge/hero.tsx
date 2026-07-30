"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { ShrinkHero } from "@/components/motion/shrink-hero";
import { Reveal } from "@/components/motion/reveal";

/**
 * Hero SuperCharge — page-local (menggantikan HeroSection generik lama).
 * Full-bleed foto stasiun + scrim, konten kiri-bawah. Reuse ShrinkHero (Ather-style inset
 * saat scroll) agar konsisten dengan landing. Token Sage+Ink, motion.dev (Reveal, SSR-safe).
 */
export default function SuperChargeHero() {
  const { t, language } = useLanguage();

  return (
    <ShrinkHero>
      <section className="relative flex min-h-[90svh] w-full items-end overflow-hidden md:min-h-screen">
        <Image
          src="/super-charge/supercharge-hero-1.webp"
          alt="Stasiun pengisian daya Wedison SuperCharge"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        {/* Scrim: gelap di bawah untuk keterbacaan teks, subjek tetap tampak di atas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/25" />

        <div className="main-container relative z-10 pb-20 pt-32 sm:pb-24">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-on-forest-accent">
              {t("supercharge.hero.tag")}
            </p>
            <h1 className="mt-4 max-w-[16ch] text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t("supercharge.hero.title")}{" "}
              <span className="text-on-forest-accent">
                {t("supercharge.hero.titleHighlight")}
              </span>
            </h1>
            <p className="mt-5 max-w-[46ch] text-base text-white/85 sm:text-lg">
              {t("supercharge.hero.description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-forest hover:bg-white/90"
              >
                <Link href={`/${language}/super-charge/lokasi/`}>
                  <MapPin className="h-5 w-5" />
                  {t("supercharge.hero.ctaPrimary")}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              >
                <Link href="#teknologi">
                  {t("supercharge.hero.ctaSecondary")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </ShrinkHero>
  );
}
