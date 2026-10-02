"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

/**
 * CTA penutup — kartu forest-deep ber-scrim (pola serupa "Talk to Dion" di landing).
 * Menutup halaman dengan ajakan: temukan lokasi / lihat motor.
 */
export default function SuperChargeCta() {
  const { t, language } = useLanguage();

  return (
    // Band penuh (bukan kartu) supaya tidak bertumpuk dengan section aplikasi di atasnya.
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
                {t("supercharge.finalCta.title")}
              </h2>
              <p className="mt-4 text-pretty text-white/80 sm:text-lg">
                {t("supercharge.finalCta.description")}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-on-forest-accent text-forest-deep hover:bg-white"
                >
                  <Link href={`/${language}/super-charge/locations/`}>
                    <MapPin className="h-5 w-5" />
                    {t("supercharge.finalCta.ctaPrimary")}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                >
                  <Link href={`/${language}/#lineup`}>
                    {t("supercharge.finalCta.ctaSecondary")}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
