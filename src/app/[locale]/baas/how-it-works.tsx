"use client";

import * as m from "motion/react-m";
import { Bike, CreditCard, BatteryCharging } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { EASE_OUT_EXPO } from "@/components/motion/config";

const STEPS = [
  { n: 1, Icon: Bike },
  { n: 2, Icon: CreditCard },
  { n: 3, Icon: BatteryCharging },
] as const;

const PARTNERS = [
  { name: "Kredivo", segment: "b2c" },
  { name: "WOM Finance", segment: "b2c" },
  { name: "Mandiri", segment: "b2b" },
] as const;

/**
 * Cara kerja — tiga langkah dengan garis penghubung yang "tergambar" saat terlihat,
 * ditutup daftar mitra pembiayaan (teks, belum ada aset logo resmi).
 */
export default function BaasHowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="main-container">
        <Reveal className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {t("baas.how.kicker")}
          </p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("baas.how.title")}
          </h2>
        </Reveal>

        <div className="relative mt-12 sm:mt-16">
          {/* Garis penghubung (desktop) — tumbuh dari kiri ke kanan. */}
          <m.div
            aria-hidden
            className="absolute left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] top-6 hidden h-px origin-left bg-border md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.2 }}
          />
          <Stagger className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map(({ n, Icon }) => (
              <StaggerItem key={n} className="relative md:text-center">
                <span className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-primary shadow-[var(--shadow-sm)]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-foreground">
                  {t(`baas.how.${n}.title`)}
                </h3>
                <p className="mt-2 max-w-[38ch] text-pretty leading-relaxed text-muted-foreground md:mx-auto">
                  {t(`baas.how.${n}.desc`)}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal className="mt-14 sm:mt-20">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <p className="text-sm font-semibold text-foreground">{t("baas.how.partners")}</p>
            <ul className="flex flex-wrap gap-2">
              {PARTNERS.map((p) => (
                <li
                  key={p.name}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm"
                >
                  <span className="font-display font-semibold text-foreground">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{t(`baas.how.partners.${p.segment}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
