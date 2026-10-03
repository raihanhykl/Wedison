"use client";

import * as m from "motion/react-m";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

// Angka perbandingan dari spesifikasi produk (kamus *.specs.battery.chargingTime*):
// SuperCharge 10–80% = 15 menit; isi di rumah 0–100% Athena/Victory baterai Regular = 5 jam.
const SUPERCHARGE_MIN = 15;
const HOME_MIN = 5 * 60;

/**
 * Cara kerja — menggabungkan section Kecepatan, Video, dan "Lima Belas Menit, Bukan Lima
 * Jam" yang dulu mengulang pesan yang sama tiga kali. Satu klaim (15 menit), dibuktikan
 * dengan perbandingan waktu + video + tiga langkah.
 */
export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="cara-kerja" className="scroll-mt-16 bg-background py-16 sm:py-24">
      <div className="main-container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <Reveal>
            <h2 className="max-w-[14ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("supercharge.feature1.title")}
            </h2>
            <p className="mt-5 max-w-[48ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("supercharge.feature1.description")}
            </p>

            <dl className="mt-10 space-y-6">
              <CompareRow
                label={t("supercharge.how.compare.super")}
                range="10% → 80%"
                value={t("supercharge.how.compare.superValue")}
                ratio={SUPERCHARGE_MIN / HOME_MIN}
                strong
              />
              <CompareRow
                label={t("supercharge.how.compare.home")}
                range="0% → 100%"
                value={t("supercharge.how.compare.homeValue")}
                ratio={1}
              />
            </dl>
            <p className="mt-5 max-w-[52ch] text-xs leading-relaxed text-muted-foreground">
              {t("supercharge.how.compare.note")}
            </p>
          </Reveal>

          <Reveal y={24} amount={0.3}>
            <video
              width={1280}
              height={720}
              controls
              muted
              preload="metadata"
              playsInline
              poster="/super-charge/overview-supercharge-poster.jpg"
              aria-label={t("supercharge.video.title")}
              className="aspect-video w-full rounded-2xl bg-forest-deep object-cover shadow-[var(--shadow-lg)]"
            >
              {/* WebM (lebih ringan) diprioritaskan; MP4 H.264 fallback lintas-browser */}
              <source src="/super-charge/overview-supercharge.webm" type="video/webm" />
              <source src="/super-charge/overview-supercharge.mp4" type="video/mp4" />
            </video>
            <p className="mt-3 text-sm text-muted-foreground">{t("supercharge.video.description")}</p>
          </Reveal>
        </div>

        {/* Tiga langkah — urutan nyata di stasiun */}
        <Stagger className="mt-16 grid gap-10 sm:mt-20 md:grid-cols-3 md:gap-8">
          {[1, 2, 3].map((n) => (
            <StaggerItem key={n} className="border-t border-border pt-6">
              <span className="font-mono text-sm text-primary">{String(n).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-foreground">
                {t(`supercharge.how.step${n}.title`)}
              </h3>
              <p className="mt-2 max-w-[38ch] text-pretty leading-relaxed text-muted-foreground">
                {t(`supercharge.how.step${n}.desc`)}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function CompareRow({
  label,
  range,
  value,
  ratio,
  strong = false,
}: {
  label: string;
  range: string;
  value: string;
  ratio: number;
  strong?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-sm text-foreground">
          <span className="font-semibold">{label}</span>{" "}
          <span className="text-muted-foreground">({range})</span>
        </dt>
        <dd
          className={
            strong
              ? "font-mono text-lg font-semibold text-primary"
              : "font-mono text-lg text-muted-foreground"
          }
        >
          {value}
        </dd>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden>
        {/* Bar tumbuh saat terlihat; minimum 3% supaya 15 menit tetap tampak. */}
        <m.div
          className={strong ? "h-full rounded-full bg-primary" : "h-full rounded-full bg-muted-foreground/40"}
          style={{ width: `${Math.max(ratio * 100, 3)}%`, transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: strong ? 0.5 : 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
