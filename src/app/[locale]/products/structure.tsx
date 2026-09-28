"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GitCompareArrows, MapPin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { getSpecificationValue } from "@/service/specifications";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

// Urutan sama dengan navbar (nav-config.ts) agar konsisten di seluruh situs.
const PRODUCTS = [
  { id: "bees", name: "Bees" },
  { id: "athena", name: "Athena" },
  { id: "victory", name: "Victory" },
  { id: "edpower", name: "EdPower" },
] as const;

const WHATSAPP = "https://wa.me/6282124657804";

/**
 * Nilai jarak tempuh di dictionary bisa berupa "110 km (Baterai Regular) / 120 km
 * (Baterai Extended)". Untuk kartu ringkas cukup rentangnya: "110–120 km".
 */
function compactRange(value: string): string {
  const nums = [...value.matchAll(/(\d+(?:[.,]\d+)?)\s*km/gi)].map((m) => m[1]);
  if (nums.length === 0) return value;
  if (nums.length === 1) return `${nums[0]} km`;
  return `${nums[0]}–${nums[nums.length - 1]} km`;
}

export default function ProductsStructure() {
  const { t, language } = useLanguage();

  return (
    <div>
      {/* ===================== HEADER ===================== */}
      <section className="border-b border-border bg-muted/40">
        <div className="main-container pb-14 pt-28 text-center sm:pb-20 sm:pt-36">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("products.tag")}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("products.title")}{" "}
              <span className="text-primary">{t("products.titleHighlight")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t("products.description")}
            </p>
            <Link
              href={`/${language}/compare/`}
              className="group mt-6 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-primary"
            >
              <GitCompareArrows className="h-4 w-4" />
              {t("nav.models.compare")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===================== GRID PRODUK ===================== */}
      <section className="main-container py-12 sm:py-20">
        <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {PRODUCTS.map((p) => {
            const specs = [
              {
                label: t("products.topSpeed"),
                value: getSpecificationValue(p.id, "engine", "topSpeed", t),
              },
              {
                label: t("products.range"),
                value: compactRange(
                  getSpecificationValue(p.id, "battery", "range", t),
                ),
              },
              {
                label: t("products.power"),
                value: getSpecificationValue(p.id, "engine", "motorPower", t),
              },
            ];
            return (
              <StaggerItem key={p.id} className="h-full">
                <Link
                  href={`/${language}/products/${p.id}/`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-primary/40"
                >
                  <div className="relative aspect-[4/3] bg-muted/60">
                    <Image
                      src={`/navbar-product/${p.id}.webp`}
                      alt={`Wedison ${p.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-3 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04] sm:p-5"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                      {p.name}
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                      {t(`nav.model.${p.id}.tagline`)}
                    </p>

                    <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-5">
                      {specs.map((s) => (
                        <div key={s.label} className="flex flex-col justify-between">
                          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                            {s.label}
                          </dt>
                          <dd className="mt-1 font-display text-base font-semibold text-foreground sm:text-lg">
                            {s.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-display text-sm font-semibold text-primary">
                      {t("products.learnMore")}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ===================== BANTUAN MEMILIH ===================== */}
      <section className="bg-forest-deep text-forest-foreground">
        <div className="main-container py-16 text-center sm:py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t("compare.help.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-forest-muted">
              {t("compare.help.subtitle")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-on-forest-accent px-6 py-3 font-semibold text-forest-deep transition-transform duration-200 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" />
                {t("compare.help.whatsapp")}
              </Link>
              <Link
                href={`/${language}/showroom/`}
                className="inline-flex items-center gap-2 rounded-full border border-forest-foreground/30 px-6 py-3 font-semibold text-forest-foreground transition-colors duration-200 hover:bg-forest-foreground/10"
              >
                <MapPin className="h-5 w-5" />
                {t("compare.help.showroom")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
