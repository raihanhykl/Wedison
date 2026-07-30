"use client";

import { useEffect, useRef } from "react";
import { X, Navigation, Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Site } from "./types";
import { STATUS_META, TIER_META, routeGoogle, routeWaze } from "./lib";

const TITLE_ID = "sc-station-detail-title";

export default function StationDetail({
  site,
  onClose,
}: {
  site: Site;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);
  const p = site.properties;
  const st = STATUS_META[p.status];
  const [lng, lat] = site.geometry.coordinates;

  // Fokus pindah ke panel saat dibuka/berganti site (a11y keyboard/SR).
  useEffect(() => {
    panelRef.current?.focus();
  }, [p.id]);

  // Escape menutup panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby={TITLE_ID}
      tabIndex={-1}
      // Elevasi via style inline: kelas shadow arbitrary bernilai negatif tidak ter-generate.
      style={{ boxShadow: "0 -10px 34px rgba(20,31,24,0.22)" }}
      className={cn(
        "z-40 flex flex-col overflow-hidden outline-none",
        // Warna sengaja BEDA dari kartu list (bg-card putih) supaya jelas ini pop-up:
        // permukaan sage muda + border hijau + elevasi kuat.
        "border-primary/25 bg-accent",
        // mobile: bottom-sheet ringkas (peek) — tidak menutup setengah layar
        "fixed inset-x-0 bottom-0 max-h-[62svh] rounded-t-2xl border-t",
        // desktop: panel melayang di dalam kolom peta
        "lg:absolute lg:inset-x-auto lg:bottom-4 lg:left-4 lg:max-h-[calc(100%-2rem)] lg:w-[360px] lg:rounded-2xl lg:border lg:shadow-soft-lg",
      )}
    >
      {/* drag handle (mobile) */}
      <div className="flex shrink-0 items-center justify-center pt-2.5 lg:hidden">
        <span className="h-1.5 w-10 rounded-full bg-primary/30" aria-hidden />
      </div>

      <div className="flex items-start justify-between gap-3 px-5 pt-3 lg:pt-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                st.bg,
                st.text,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />
              {t(st.labelKey)}
            </span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
              {t(TIER_META[p.type_tier].labelKey)}
            </span>
          </div>
          <h2
            id={TITLE_ID}
            className="mt-2 font-display text-lg font-bold leading-tight text-foreground"
          >
            {p.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("supercharge.locator.close")}
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X aria-hidden className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 pt-3">
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {p.address}, {p.city}, {p.province}
          </span>
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-border bg-card p-3 text-center lg:mt-4">
          <div>
            <div className="font-display text-xl font-bold text-foreground">
              {p.piles_total}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {t("supercharge.locator.piles")}
            </div>
          </div>

          <div>
            <div className="font-display text-xl font-bold text-foreground">
              {p.power_kw}
            </div>
            <div className="text-[11px] text-muted-foreground">kW</div>
          </div>
          <div>
            <div className="font-display text-xl font-bold text-primary">
              {p.charger_available}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {t("supercharge.locator.charger")}
            </div>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-2 text-sm text-foreground lg:mt-4">
          <Clock aria-hidden className="h-4 w-4 text-primary" /> {p.hours}
        </p>

        {p.amenities && p.amenities.length > 0 && (
          <div className="mt-3 lg:mt-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t("supercharge.locator.amenities")}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-secondary-foreground"
                >
                  {t(`supercharge.locator.amenity.${a}`)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-primary/15 p-4">
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <a
              href={routeGoogle(lat, lng)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation aria-hidden className="h-4 w-4" /> Google Maps
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a
              href={routeWaze(lat, lng)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Waze
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
