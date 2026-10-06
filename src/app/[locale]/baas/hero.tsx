"use client";

import Link from "next/link";
import * as m from "motion/react-m";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { ShrinkHero } from "@/components/motion/shrink-hero";
import { Reveal } from "@/components/motion/reveal";
import { ArtDirectedImage } from "@/components/art-directed-image";
import { EASE_OUT_EXPO } from "@/components/motion/config";
import { whatsappUrl } from "@/lib/seo/site";
import { BAAS_MODELS, perDay, rupiah } from "./data";

/**
 * Hero BaaS — pesan #1 kampanye: "Baterai bukan lagi urusan Anda" (garansi seumur hidup).
 * Full-bleed foto produk + scrim forest, konten kiri-bawah, strip tiga fakta di bawahnya.
 * SEMENTARA: foto hero produk Victory sebagai placeholder sampai aset khusus BaaS tersedia.
 */
export default function BaasHero() {
  const { t, language } = useLanguage();
  const victory = BAAS_MODELS[0];
  const cheapest = Math.min(...BAAS_MODELS.flatMap((mo) => mo.plans.map((p) => p.monthly)));

  const stats = [
    { label: t("baas.hero.stat.warranty"), value: t("baas.hero.stat.warrantyValue") },
    {
      label: t("baas.hero.stat.daily"),
      value: `≈ ${rupiah(perDay(cheapest), language)}`,
      suffix: t("baas.hero.stat.dailySuffix"),
    },
    { label: t("baas.hero.stat.vehicle"), value: t("baas.hero.stat.vehicleValue") },
  ];

  return (
    <ShrinkHero>
      <section className="relative flex min-h-[92svh] w-full items-end overflow-hidden bg-forest-deep md:min-h-screen">
        {/* Foto masuk dengan zoom-out halus — satu momen entrance, lalu diam. */}
        <m.div
          className="absolute inset-0"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
        >
          <ArtDirectedImage
            desktop={victory.image}
            mobile={victory.imageMobile}
            alt={t("baas.hero.imageAlt")}
            priority
            className="object-cover object-[70%_center] sm:object-[center_45%]"
          />
        </m.div>
        {/* Scrim: gelap di bawah untuk keterbacaan, subjek tetap tampak di kanan-atas. */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/55 to-forest-deep/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/70 via-forest-deep/20 to-transparent" />

        <div className="main-container relative z-10 pb-10 pt-36 sm:pb-14">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-on-forest-accent">
              {t("baas.hero.tag")}
            </p>
            <h1 className="mt-4 max-w-[14ch] text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t("baas.hero.title")}{" "}
              <span className="text-on-forest-accent">{t("baas.hero.titleHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-[46ch] text-pretty text-base text-white/85 sm:text-lg">
              {t("baas.hero.description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-forest hover:bg-white/90">
                <Link href="#hitung">
                  {t("baas.hero.ctaPrimary")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              >
                <a
                  href={whatsappUrl(
                    language === "en"
                      ? "Hello Wedison, I would like to know more about the BaaS programme."
                      : "Halo Wedison, saya ingin tahu lebih lanjut tentang program BaaS.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  {t("baas.hero.ctaSecondary")}
                </a>
              </Button>
            </div>
          </Reveal>

          {/* Strip fakta: tiga klaim yang boleh dikatakan, tanpa harga unit yang berdiri sendiri. */}
          <Reveal delay={0.25} className="mt-12 sm:mt-16">
            <dl className="grid grid-cols-1 gap-4 border-t border-white/15 pt-6 sm:grid-cols-3 sm:gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-[0.14em] text-forest-muted">{s.label}</dt>
                  <dd className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {s.value}
                    {s.suffix ? (
                      <span className="ml-1 text-base font-medium text-forest-muted">{s.suffix}</span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </ShrinkHero>
  );
}
