"use client";

import Image from "next/image";
import { Zap, MapPin, ShieldCheck, BatteryCharging, Gauge } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/** Ikon dioper sebagai string dari Server Component (page.tsx) lalu di-resolve di sini. */
const ICONS = { Zap, MapPin, ShieldCheck, BatteryCharging, Gauge } as const;

type Props = {
  /** nomor fitur -> kunci i18n supercharge.feature{n}.* */
  feature: number;
  image: string;
  alt: string;
  icon: keyof typeof ICONS;
  /** true = gambar di kiri pada desktop */
  reverse?: boolean;
  /** background section, mis. "bg-muted" | "bg-background" */
  bg?: string;
  /** object-position gambar, mis. "object-[50%_30%]" */
  imagePosition?: string;
};

/**
 * Baris fitur SuperCharge — page-local (menggantikan FeatureSection2 generik lama).
 * Token Sage+Ink penuh, gambar pakai aspect-ratio + fill (CLS-safe, rasio benar),
 * ikon-in-circle (bukan eyebrow uppercase per-section), motion.dev Reveal.
 */
export default function SuperChargeFeature({
  feature,
  image,
  alt,
  icon,
  reverse = false,
  bg = "bg-background",
  imagePosition,
}: Props) {
  const { t } = useLanguage();
  const key = `supercharge.feature${feature}`;
  const Icon = ICONS[icon];

  return (
    <section className={cn(bg, "py-16 sm:py-24")}>
      <div className="main-container">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gambar */}
          <Reveal
            y={24}
            amount={0.2}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md sm:aspect-[3/2]",
              reverse ? "lg:order-2" : "lg:order-1",
            )}
          >
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={cn("object-cover", imagePosition)}
            />
          </Reveal>

          {/* Teks */}
          <Reveal
            delay={0.1}
            className={cn(reverse ? "lg:order-1" : "lg:order-2")}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {t(`${key}.title`)}
            </h2>
            <p className="mt-2 text-lg font-semibold text-primary sm:text-xl">
              {t(`${key}.subtitle`)}
            </p>
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t(`${key}.description`)}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
