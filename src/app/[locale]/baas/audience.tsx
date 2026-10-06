"use client";

import { Building2, Sparkles, Store } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

const SEGMENTS = [
  { n: 1, Icon: Building2 },
  { n: 2, Icon: Sparkles },
  { n: 3, Icon: Store },
] as const;

/** Untuk siapa — tiga segmen kampanye (komuter, pembeli pertama, usaha kecil). */
export default function BaasAudience() {
  const { t } = useLanguage();

  return (
    <section className="bg-muted py-16 sm:py-24">
      <div className="main-container">
        <Reveal className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {t("baas.audience.kicker")}
          </p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("baas.audience.title")}
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-3">
          {SEGMENTS.map(({ n, Icon }) => (
            <StaggerItem key={n}>
              <article className="group h-full rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-muted text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-foreground">
                  {t(`baas.audience.${n}.title`)}
                </h3>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                  {t(`baas.audience.${n}.desc`)}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
