"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { MapPin, Activity, Zap, Check } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import StoreBadges from "@/components/store-badges";

/**
 * AppSection — satu section kohesif menggantikan AppShowcase (5 sub-section -> 1).
 * Scrollytelling: di desktop panel kiri (HP + label beat + dots) DI-PIN & di-CENTER
 * ke viewport secara konsisten lintas zoom (sticky top-0 h-[100svh] + HP diukur TINGGI),
 * layar HP cross-fade KONTINU mengikuti scroll (useTransform, bukan step-function),
 * dan tiap beat di kanan pakai scroll-snap `proximity` (lembut). Di mobile jadi tumpukan
 * biasa (HP inline per beat). Rasio layar 922/1920 dipertahankan.
 */

type Beat = { key: string; screen: string; Icon: typeof MapPin };

const BEATS: Beat[] = [
  { key: "1", screen: "Screen-01", Icon: MapPin }, // Temukan stasiun terdekat
  { key: "2", screen: "Screen-04", Icon: Activity }, // Status pengisian real-time
  { key: "3", screen: "Screen-02", Icon: Zap }, // Pengisian mudah, satu ketukan
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Bingkai HP minimal — TANPA lebar default. Caller mengatur ukuran (mobile: lebar; desktop: tinggi). */
function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[922/1920] overflow-hidden rounded-[2rem] border-4 border-foreground/90 bg-foreground shadow-[0_24px_60px_rgba(20,31,24,0.28)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function AppSection() {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Progress track -> HP di-pin di TENGAH viewport, jadi offset "center".
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start center", "end center"],
  });

  // Cross-fade KONTINU per layar (scrub mulus, bukan patah 3 langkah). Swap di ~seam antar-beat.
  const op0 = useTransform(scrollYProgress, [0.0, 0.3, 0.4], [1, 1, 0]);
  const op1 = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.6, 0.7, 1.0], [0, 1, 1]);
  const ops = [op0, op1, op2];

  // Indeks beat aktif (untuk highlight dots + label). Turunan dari progress yang sama.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(
      Math.min(BEATS.length - 1, Math.max(0, Math.floor(p * BEATS.length))),
    );
  });

  // Aktifkan scroll-snap HANYA selama halaman ini termount (scoped, tak bocor ke route lain).
  useEffect(() => {
    const el = document.documentElement;
    el.classList.add("snap-beats");
    return () => el.classList.remove("snap-beats");
  }, []);

  const goToBeat = (i: number) =>
    document
      .getElementById(`app-beat-${i}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <section id="app" className="scroll-mt-16 bg-card py-16 sm:py-24">
      <div className="main-container">
        {/* Header pengantar section */}
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {t("supercharge.app.tag")}
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("supercharge.app.hero.title")}{" "}
            <span className="text-primary">
              {t("supercharge.app.hero.titleHighlight")}
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("supercharge.app.hero.description")}
          </p>
        </Reveal>

        {/* Track scrollytelling */}
        <div
          ref={trackRef}
          className="mt-10 grid grid-cols-1 gap-0 lg:mt-4 lg:grid-cols-2 lg:gap-16"
        >
          {/* ── KIRI: panel device DI-PIN & center-viewport (desktop) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-0 h-[100svh]">
              {/* HP TRUE-CENTER viewport (sejajar dgn teks beat yang juga snap-center),
                  diukur TINGGI (viewport-relative) -> center konsisten lintas zoom, tak overflow */}
              <div className="flex h-full items-center justify-center">
                <PhoneFrame className="h-[46svh] max-h-[520px] w-auto">
                  {BEATS.map((b, i) => (
                    <m.div
                      key={b.screen}
                      style={{ opacity: ops[i] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={`/super-charge/app/${b.screen}.webp`}
                        alt=""
                        aria-hidden
                        fill
                        sizes="260px"
                        className="object-cover"
                      />
                    </m.div>
                  ))}
                </PhoneFrame>
              </div>

              {/* Label beat aktif + dots dipin di bawah (absolute) -> TIDAK menggeser HP dari center,
                  panel tetap terasa "disengaja", konteks tak pernah hilang */}
              <div className="absolute inset-x-0 bottom-[7vh] flex flex-col items-center gap-3 text-center">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                    {pad(active + 1)} / {pad(BEATS.length)}
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-foreground">
                    {t(`supercharge.app.feature${BEATS[active].key}.title`)}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  {BEATS.map((b, i) => (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => goToBeat(i)}
                      aria-label={t(`supercharge.app.feature${b.key}.title`)}
                      aria-current={i === active}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        i === active
                          ? "w-7 bg-primary"
                          : "w-2 bg-foreground/20 hover:bg-foreground/40",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── KANAN: beats yang scroll + snap ── */}
          <div>
            {BEATS.map((b, i) => {
              const key = `supercharge.app.feature${b.key}`;
              const bullets = [1, 2, 3].map((n) => t(`${key}.bullet${n}`));
              return (
                <div
                  id={`app-beat-${i}`}
                  key={b.key}
                  className="flex flex-col justify-center py-12 lg:min-h-[100svh] lg:snap-center lg:py-0"
                >
                  {/* HP inline (mobile saja) */}
                  <div className="mb-8 flex justify-center lg:hidden">
                    <PhoneFrame className="w-[240px]">
                      <Image
                        src={`/super-charge/app/${b.screen}.webp`}
                        alt={`Tampilan ${t(`${key}.title`)} pada aplikasi Wedison SuperCharge`}
                        fill
                        sizes="240px"
                        className="object-cover"
                      />
                    </PhoneFrame>
                  </div>

                  <Reveal>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                      <b.Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {t(`${key}.title`)}
                    </h3>
                    <p className="mt-2 text-lg font-semibold text-primary">
                      {t(`${key}.subtitle`)}
                    </p>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {t(`${key}.description`)}
                    </p>
                    <Stagger className="mt-6 space-y-3">
                      {bullets.map((bullet, idx) => (
                        <StaggerItem
                          key={idx}
                          className="flex items-start gap-3 text-sm text-muted-foreground sm:text-base"
                        >
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span>{bullet}</span>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unduh — satu blok badges */}
        <Reveal
          className="mt-16 flex flex-col items-center rounded-3xl bg-muted px-6 py-14 text-center sm:mt-20 sm:px-10"
          amount={0.2}
        >
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {t("supercharge.app.cta.title")}{" "}
            <span className="text-primary">
              {t("supercharge.app.cta.titleHighlight")}
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("supercharge.app.cta.description")}
          </p>
          <div className="mt-8">
            <StoreBadges size="lg" className="justify-center" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
