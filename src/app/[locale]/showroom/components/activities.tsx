"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Foto per aktivitas. SEMENTARA foto yang ada — ganti dengan ASET-S04a–d (4:5, satu
 * per aktivitas: test ride, konsultasi, pembiayaan, servis).
 */
const ITEMS = [
  { key: "testRide", image: "/new-looks/test image.webp" },
  { key: "consultation", image: "/new-looks/HERO 1.webp" },
  { key: "financing", image: "/showroom-waitingroom.webp" },
  { key: "service", image: "/super-charge/supercharge-charging.webp" },
] as const;

/**
 * Daftar layanan di showroom: judul besar sebagai pilihan, deskripsi terbuka untuk yang aktif,
 * foto berganti mengikuti pilihan. Pengganti grid 4 kartu ikon.
 */
export default function ShowroomActivities() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="main-container grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <Reveal>
            <h2 className="max-w-[16ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("showroomPage.activities.title")}
            </h2>
            <p className="mt-4 max-w-[52ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("showroomPage.activities.desc")}
            </p>
          </Reveal>

          <ul className="mt-10 border-t border-border">
            {ITEMS.map((item, i) => {
              const on = i === active;
              const panelId = `activity-${item.key}`;
              return (
                <li key={item.key} className="border-b border-border">
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={panelId}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className="flex w-full cursor-pointer py-5 text-left"
                  >
                    <span
                      className={cn(
                        "font-display text-2xl font-bold tracking-tight transition-colors duration-300 sm:text-3xl",
                        on ? "text-foreground" : "text-foreground/45 hover:text-foreground/70",
                      )}
                    >
                      {t(`showroom.${item.key}.title`)}
                    </span>
                  </button>
                  {/* grid-rows 0fr->1fr: tinggi beranimasi tanpa mengukur DOM */}
                  <div
                    id={panelId}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none",
                      on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[48ch] pb-6 text-pretty text-base leading-relaxed text-muted-foreground">
                        {t(`showroom.${item.key}.description`)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Foto: semua ditumpuk, yang aktif saja yang terlihat (silang-pudar) */}
        <Reveal y={0} className="relative order-first aspect-[4/3] overflow-hidden rounded-2xl bg-muted sm:aspect-[16/10] lg:order-none lg:aspect-[4/5]">
          {ITEMS.map((item, i) => (
            <Image
              key={item.key}
              src={item.image}
              alt={t(`showroom.${item.key}.title`)}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className={cn(
                "object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none",
                i === active ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
