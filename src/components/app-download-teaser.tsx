"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as m from "motion/react-m";
import { useMotionValue, useSpring, useTransform } from "motion/react";
import { MapPin, Zap, Activity, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import StoreBadges from "./store-badges";
import { cn } from "@/lib/utils";

// Screenshot aplikasi sudah ter-frame device (922x1920) -> di-cross-fade seolah "live".
const SCREENS = [
  "/super-charge/app/Screen-01.webp",
  "/super-charge/app/Screen-05.webp",
  "/super-charge/app/Screen-04.webp",
  "/super-charge/app/Screen-02.webp",
];

export default function AppDownloadTeaser() {
  const { t, language } = useLanguage();
  const [active, setActive] = useState(0);

  // Ganti layar aplikasi otomatis (cross-fade).
  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => (a + 1) % SCREENS.length),
      3200,
    );
    return () => clearInterval(id);
  }, []);

  // Parallax tilt 3D mengikuti kursor (enhancement; tanpa mouse tetap datar).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), {
    stiffness: 140,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), {
    stiffness: 140,
    damping: 18,
  });
  const stageRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const features = [
    { Icon: MapPin, label: t("supercharge.app.teaser.feature.find") },
    { Icon: Activity, label: t("supercharge.app.teaser.feature.realtime") },
    { Icon: Zap, label: t("supercharge.app.teaser.feature.charge") },
  ];

  const nearestLabel =
    language === "id" ? "Stasiun terdekat" : "Nearest station";
  const chargedLabel = language === "id" ? "Terisi" : "Charged";
  const distance = language === "id" ? "1,2 km" : "1.2 km";

  const dash = 2 * Math.PI * 15; // keliling cincin r=15

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="main-container">
        {/* Kartu rounded (lebar mengikuti container, bukan full-bleed) */}
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 shadow-lg sm:px-10 sm:py-16 lg:px-14">
          {/* tekstur titik halus */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 text-foreground opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:22px_22px]"
          />

          <div className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
            {/* ===================== TEXT ===================== */}
            <div className="text-center lg:text-left">
              <Reveal className="flex flex-col items-center lg:items-start">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                  <Zap className="h-3.5 w-3.5" />
                  Wedison SuperCharge App
                </span>
                <h2 className="mt-5 max-w-xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                  {t("supercharge.app.teaser.title")}{" "}
                  <span className="text-primary">
                    {t("supercharge.app.teaser.titleHighlight")}
                  </span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {t("supercharge.app.teaser.description")}
                </p>
              </Reveal>

              <Stagger className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                {features.map(({ Icon, label }) => (
                  <StaggerItem key={label}>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      {label}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal
                delay={0.1}
                className="mt-9 flex flex-col items-center gap-5 lg:items-start"
              >
                <StoreBadges size="md" />
                <Link
                  href={`/${language}/super-charge/`}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  {t("btn.learn.more")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>

            {/* ===================== PHONE STAGE ===================== */}
            <div
              ref={stageRef}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              className="relative flex justify-center [perspective:1200px]"
            >
              <Reveal
                y={30}
                className="relative w-[248px] sm:w-[280px] lg:w-[300px]"
              >
                <m.div
                  style={{ rotateX, rotateY }}
                  className="relative [transform-style:preserve-3d]"
                >
                  {/* stack layar aplikasi */}
                  <div className="relative aspect-[922/1920]">
                    {SCREENS.map((src, i) => (
                      <Image
                        key={src}
                        src={src}
                        alt="Aplikasi Wedison SuperCharge"
                        fill
                        sizes="(max-width: 640px) 248px, 300px"
                        loading="lazy"
                        className={cn(
                          "object-contain drop-shadow-2xl transition-opacity duration-700 ease-out",
                          i === active ? "opacity-100" : "opacity-0",
                        )}
                      />
                    ))}
                  </div>

                  {/* ---- chip: Real-Time (pulse) ---- */}
                  <m.div
                    style={{ z: 70 }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -left-4 top-14 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-lg sm:-left-9"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    {t("supercharge.app.teaser.feature.realtime")}
                  </m.div>

                  {/* ---- chip: stasiun terdekat ---- */}
                  <m.div
                    style={{ z: 95 }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4,
                    }}
                    className="absolute -right-3 top-1/3 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:-right-10"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <div className="leading-tight">
                      <div className="text-[10px] text-muted-foreground">
                        {nearestLabel}
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        {distance}
                      </div>
                    </div>
                  </m.div>

                  {/* ---- chip: cincin pengisian 82% ---- */}
                  <m.div
                    style={{ z: 80 }}
                    animate={{ y: [0, -7, 0] }}
                    transition={{
                      duration: 4.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8,
                    }}
                    className="absolute -left-3 bottom-24 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:-left-8"
                  >
                    <div className="relative h-9 w-9">
                      <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-border"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          className="text-primary"
                          strokeDasharray={dash}
                          strokeDashoffset={dash * (1 - 0.82)}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                        82%
                      </span>
                    </div>
                    <div className="leading-tight">
                      <div className="text-[10px] text-muted-foreground">
                        {chargedLabel}
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        SuperCharge
                      </div>
                    </div>
                  </m.div>
                </m.div>

                {/* bayangan lantai (halus di latar terang) */}
                <div
                  aria-hidden
                  className="absolute -bottom-4 left-1/2 h-8 w-2/3 -translate-x-1/2 rounded-[100%] bg-foreground/10 blur-xl"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
