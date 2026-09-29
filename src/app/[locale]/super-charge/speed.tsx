"use client";

import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { NumberTicker } from "@/components/ui/number-ticker";

// TODO(data-real): ganti dengan kecepatan pengisian sebenarnya.
const CHARGE_MINUTES = 15;

/**
 * Kecepatan — angka dalam bahasa manusia (bukan "kW"). Pernyataan editorial, bukan
 * grid-statistik, agar menghindari template "hero-metric". Terang (napas setelah hero gelap).
 */
export default function SuperChargeSpeed() {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="main-container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {t("supercharge.speed.kicker")}
          </p>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            {t("supercharge.speed.lead")}
          </p>
          <div className="mt-3 flex items-baseline justify-center gap-3">
            <span className="font-display text-6xl font-extrabold tracking-tight text-primary sm:text-8xl">
              <NumberTicker value={CHARGE_MINUTES} className="text-primary" />
            </span>
            <span className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              {t("supercharge.speed.unit")}
            </span>
          </div>
          <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("supercharge.speed.caption")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
