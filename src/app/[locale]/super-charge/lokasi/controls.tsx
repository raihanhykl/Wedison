"use client";

import { useState } from "react";
import { Search, Navigation, Loader2 } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Filters, SiteStatus, SiteTier, LatLng } from "./types";

const TIERS: (SiteTier | "all")[] = ["all", "hub", "showroom", "mitra"];
const STATUSES: (SiteStatus | "all")[] = [
  "all",
  "operational",
  "coming_soon",
  "maintenance",
];

type Props = {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onNearMe: (loc: LatLng) => void;
  resultCount: number;
};

export default function Controls({
  filters,
  setFilters,
  onNearMe,
  resultCount,
}: Props) {
  const { t } = useLanguage();
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const nearMe = () => {
    setGeoError(null);
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeoError(t("supercharge.locator.geoError"));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onNearMe({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? t("supercharge.locator.geoDenied")
            : t("supercharge.locator.geoError"),
        );
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder={t("supercharge.locator.searchPlaceholder")}
            aria-label={t("supercharge.locator.searchPlaceholder")}
            className="pl-9"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={nearMe}
          disabled={locating}
          aria-busy={locating}
        >
          {locating ? (
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation aria-hidden className="h-4 w-4" />
          )}
          {t("supercharge.locator.nearMe")}
        </Button>
      </div>

      {geoError && (
        <p role="alert" className="text-sm text-destructive">
          {geoError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {TIERS.map((tier) => (
          <Chip
            key={tier}
            active={filters.tier === tier}
            onClick={() => setFilters({ ...filters, tier })}
          >
            {tier === "all"
              ? t("supercharge.locator.filter.allTiers")
              : t(`supercharge.locator.tier.${tier}`)}
          </Chip>
        ))}
        <span className="mx-1 hidden h-4 w-px bg-border sm:block" aria-hidden />
        {STATUSES.map((s) => (
          <Chip
            key={s}
            active={filters.status === s}
            onClick={() => setFilters({ ...filters, status: s })}
          >
            {s === "all"
              ? t("supercharge.locator.filter.allStatus")
              : t(`supercharge.locator.status.${s}`)}
          </Chip>
        ))}
        <span
          role="status"
          aria-live="polite"
          className="ml-auto text-sm text-muted-foreground"
        >
          {resultCount} {t("supercharge.locator.results")}
        </span>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
