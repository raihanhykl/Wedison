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

      {/* Filter: di mobile tiap grup jadi satu baris ber-label yang bisa di-scroll
          horizontal (tidak menumpuk); di desktop dua grup sejajar. */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-8">
        <FilterGroup label={t("supercharge.locator.filter.tierLabel")}>
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
        </FilterGroup>

        <FilterGroup label={t("supercharge.locator.filter.statusLabel")}>
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
        </FilterGroup>

        <span
          role="status"
          aria-live="polite"
          className="text-sm text-muted-foreground lg:ml-auto lg:self-end lg:pb-1"
        >
          {resultCount} {t("supercharge.locator.results")}
        </span>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div
        role="group"
        aria-label={label}
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible"
      >
        {children}
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
        "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
