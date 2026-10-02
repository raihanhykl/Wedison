"use client";

import Image from "next/image";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";

/**
 * Keamanan & keandalan — pengganti section "Dibangun untuk Dipakai Bertahun-tahun".
 * Satu foto + empat fakta ringkas (semuanya dari klaim yang sudah ada), bukan blok
 * gambar-teks penuh lagi. Foto SEMENTARA: ganti dengan ASET-C03 (close-up stasiun).
 */
export default function SuperChargeSafety() {
  const { t } = useLanguage();
  const facts = [1, 2, 3, 4];

  return (
    <section className="bg-muted py-16 sm:py-24">
      <div className="main-container grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal y={0} className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[4/5]">
          <Image
            src="/super-charge/supercharge-chip-1.webp"
            alt={t("supercharge.safety.imageAlt")}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-center"
          />
        </Reveal>

        <div>
          <Reveal>
            <h2 className="max-w-[18ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("supercharge.feature3.title")}
            </h2>
            <p className="mt-4 max-w-[48ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("supercharge.feature3.subtitle")}.
            </p>
          </Reveal>

          <dl className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {facts.map((n) => (
              <Reveal key={n} delay={n * 0.05} className="border-t border-border py-5">
                <dt className="font-display text-lg font-semibold tracking-tight text-foreground">
                  {t(`supercharge.safety.fact${n}.title`)}
                </dt>
                <dd className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {t(`supercharge.safety.fact${n}.desc`)}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
