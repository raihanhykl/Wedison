"use client";

import { MapPin, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";
import type { Site, LatLng } from "./types";
import { STATUS_META, TIER_META, haversineKm, siteLatLng } from "./lib";

type Props = {
  site: Site;
  active: boolean;
  userLocation: LatLng | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
};

export default function StationCard({
  site,
  active,
  userLocation,
  onSelect,
  onHover,
}: Props) {
  const { t } = useLanguage();
  const p = site.properties;
  const st = STATUS_META[p.status];
  const dist = userLocation ? haversineKm(userLocation, siteLatLng(site)) : null;

  return (
    <button
      type="button"
      onClick={() => onSelect(p.id)}
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(p.id)}
      onBlur={() => onHover(null)}
      aria-pressed={active}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition-colors",
        active
          ? "border-primary bg-secondary/50"
          : "border-border bg-card hover:bg-muted",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold leading-tight text-foreground">
          {p.name}
        </h3>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
            st.bg,
            st.text,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />
          {t(st.labelKey)}
        </span>
      </div>

      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0" />
        <span>{p.city}</span>
        {dist != null && (
          <span className="text-muted-foreground">
            · {dist < 1 ? "<1" : Math.round(dist)} km
          </span>
        )}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <Zap aria-hidden className="h-4 w-4 text-primary" />
          {p.charger_available} {t("supercharge.locator.charger")}
        </span>
        <span className="text-muted-foreground">{p.power_kw} kW</span>
        <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          {t(TIER_META[p.type_tier].labelKey)}
        </span>
      </div>
    </button>
  );
}
