"use client";

import { Check, Minus } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

const ROWS = [1, 2, 3, 4, 5] as const;

/**
 * BaaS vs beli biasa — tabel dua kolom, kolom BaaS disorot. Isi sel dari kamus (baas.compare.*).
 * Baris "biaya bulanan" sengaja ada: kejujuran soal langganan adalah bagian dari pesan.
 */
export default function BaasCompare() {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="main-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              {t("baas.compare.kicker")}
            </p>
            <h2 className="mt-4 max-w-[20ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("baas.compare.title")}
            </h2>
            <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-muted-foreground">
              {t("baas.compare.note")}
            </p>
          </Reveal>

          <Reveal y={24}>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)]">
              <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-border text-xs font-semibold uppercase tracking-[0.12em] sm:text-sm">
                <div className="p-4 sm:p-5" />
                <div className="p-4 text-muted-foreground sm:p-5">{t("baas.compare.col.regular")}</div>
                <div className="bg-primary p-4 text-primary-foreground sm:p-5">{t("baas.compare.col.baas")}</div>
              </div>
              <Stagger>
                {ROWS.map((n) => (
                  <StaggerItem
                    key={n}
                    className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-border text-sm last:border-b-0"
                  >
                    <div className="p-4 font-semibold text-foreground sm:p-5">{t(`baas.compare.${n}.label`)}</div>
                    <div className="flex items-start gap-2 p-4 text-muted-foreground sm:p-5">
                      <Minus className="mt-0.5 hidden h-4 w-4 shrink-0 sm:block" aria-hidden />
                      <span>{t(`baas.compare.${n}.regular`)}</span>
                    </div>
                    <div className="flex items-start gap-2 bg-primary/[0.06] p-4 font-medium text-foreground sm:p-5">
                      <Check className="mt-0.5 hidden h-4 w-4 shrink-0 text-primary sm:block" aria-hidden />
                      <span>{t(`baas.compare.${n}.baas`)}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
