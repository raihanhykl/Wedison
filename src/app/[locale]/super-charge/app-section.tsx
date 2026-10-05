"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import StoreBadges from "@/components/store-badges";

/**
 * Aplikasi Wedison — satu section ringkas: tiga tab (cari stasiun, pantau sesi, mulai
 * pengisian) mengganti layar HP, plus badge unduh di section yang sama. Menggantikan
 * scrollytelling 3x tinggi layar + blok unduh terpisah yang menumpuk dengan CTA penutup.
 */
const TABS = [
  { key: "1", screen: "Screen-01" }, // Temukan stasiun terdekat
  { key: "2", screen: "Screen-04" }, // Pantau pengisian
  { key: "3", screen: "Screen-02" }, // Mulai dengan satu ketukan
] as const;

export default function AppSection() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const key = `supercharge.app.feature${TABS[active].key}`;

  // Pola tab ARIA: panah kiri/kanan berpindah tab, fokus ikut.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="app" className="scroll-mt-16 bg-background py-16 sm:py-24">
      <div className="main-container grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <Reveal>
            <h2 className="max-w-[18ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("supercharge.app.hero.title")} {t("supercharge.app.hero.titleHighlight")}
            </h2>
            <p className="mt-5 max-w-[52ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("supercharge.app.hero.description")}
            </p>
          </Reveal>

          <div
            role="tablist"
            aria-label={t("supercharge.app.tag")}
            onKeyDown={onKeyDown}
            className="mt-10 flex gap-1 overflow-x-auto rounded-full border border-border bg-muted p-1 [scrollbar-width:none] sm:w-fit"
          >
            {TABS.map((tab, i) => (
              <button
                key={tab.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`app-tab-${tab.key}`}
                aria-selected={i === active}
                aria-controls="app-tabpanel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                  i === active
                    ? "bg-card text-foreground shadow-[var(--shadow-sm)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(`supercharge.app.feature${tab.key}.title`)}
              </button>
            ))}
          </div>

          <div
            id="app-tabpanel"
            role="tabpanel"
            aria-labelledby={`app-tab-${TABS[active].key}`}
            className="mt-8 min-h-[13rem]"
          >
            <p className="font-display text-xl font-semibold tracking-tight text-foreground">
              {t(`${key}.subtitle`)}
            </p>
            <p className="mt-3 max-w-[52ch] text-pretty leading-relaxed text-muted-foreground">
              {t(`${key}.description`)}
            </p>
            <ul className="mt-5 space-y-2.5">
              {[1, 2, 3].map((n) => (
                <li key={n} className="flex items-start gap-3 text-sm text-foreground sm:text-base">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {t(`${key}.bullet${n}`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <p className="mb-4 text-sm text-muted-foreground">{t("supercharge.app.cta.description")}</p>
            <StoreBadges size="lg" />
          </div>
        </div>

        {/* HP: layar silang-pudar mengikuti tab */}
        <Reveal y={24} className="flex justify-center lg:justify-end">
          <div className="relative aspect-[922/1920] w-[230px] overflow-hidden rounded-[2rem] border-4 border-foreground/90 bg-foreground shadow-[0_24px_60px_rgba(20,31,24,0.28)] sm:w-[270px]">
            {TABS.map((tab, i) => (
              <Image
                key={tab.screen}
                src={`/super-charge/app/${tab.screen}.webp`}
                alt={
                  i === active
                    ? t("supercharge.app.screenAlt").replace(
                        "{feature}",
                        t(`supercharge.app.feature${tab.key}.title`),
                      )
                    : ""
                }
                aria-hidden={i !== active}
                fill
                sizes="270px"
                className={cn(
                  "object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
