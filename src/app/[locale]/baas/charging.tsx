"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

/**
 * Pengisian daya — jawaban untuk pertanyaan "di mana saya mengisi?": rumah untuk harian,
 * SuperCharge untuk bepergian. Diposisikan pada kecepatan, bukan klaim cakupan nasional.
 */
export default function BaasCharging() {
  const { t, language } = useLanguage();

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="main-container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal y={24} amount={0.3} className="order-last lg:order-first">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest shadow-[var(--shadow-md)]">
              <Image
                src="/super-charge/supercharge-charging.webp"
                alt={t("baas.charging.imageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
              />
            </div>
          </Reveal>
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              {t("baas.charging.kicker")}
            </p>
            <h2 className="mt-4 max-w-[18ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("baas.charging.title")}
            </h2>
            <p className="mt-5 max-w-[50ch] text-pretty leading-relaxed text-muted-foreground sm:text-lg">
              {t("baas.charging.desc")}
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href={`/${language}/super-charge/locations/`}>
                <MapPin className="h-5 w-5" />
                {t("baas.charging.cta")}
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
