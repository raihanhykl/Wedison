"use client";

import { Tag, BatteryWarning } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";

/**
 * Mengapa BaaS — dua hambatan pembeli (harga di awal; baterai menurun) dan jawabannya.
 * Dua kartu kontras (putih & forest) supaya "alasan kedua" (garansi seumur hidup) terasa
 * sebagai pesan utama, bukan sekadar pasangan.
 */
export default function BaasWhy() {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="main-container">
        <Reveal className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {t("baas.why.kicker")}
          </p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("baas.why.title")}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 sm:mt-14">
          <Reveal>
            <article className="group h-full rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-9">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-muted text-primary">
                <Tag className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-6 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {t("baas.why.1.label")}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">
                {t("baas.why.1.title")}
              </h3>
              <p className="mt-3 max-w-[48ch] text-pretty leading-relaxed text-muted-foreground">
                {t("baas.why.1.desc")}
              </p>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="group h-full rounded-2xl bg-forest p-7 text-forest-foreground shadow-[var(--shadow-md)] transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-9">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-on-forest-accent">
                <BatteryWarning className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-6 text-xs uppercase tracking-[0.14em] text-forest-muted">
                {t("baas.why.2.label")}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
                {t("baas.why.2.title")}
              </h3>
              <p className="mt-3 max-w-[48ch] text-pretty leading-relaxed text-forest-foreground/85">
                {t("baas.why.2.desc")}
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
