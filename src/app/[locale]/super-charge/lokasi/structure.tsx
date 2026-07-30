"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { applyFilters } from "./lib";
import type { Site, Filters, LatLng } from "./types";
import MapClient from "./map-client";
import StationList from "./station-list";
import StationDetail from "./station-detail";
import Controls from "./controls";

export default function Locator({ sites }: { sites: Site[] }) {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    tier: "all",
    query: "",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  const filtered = useMemo(
    () => applyFilters(sites, filters, userLocation),
    [sites, filters, userLocation],
  );
  // Selalu dari `filtered` supaya panel detail auto-tutup bila site ter-filter keluar
  // (menghindari detail "yatim" saat marker & kartunya hilang).
  const selected = useMemo(
    () => filtered.find((s) => s.properties.id === selectedId) ?? null,
    [filtered, selectedId],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (typeof document !== "undefined") {
      const reduced = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document.getElementById(`station-${id}`)?.scrollIntoView({
        block: "nearest",
        behavior: reduced ? "auto" : "smooth",
      });
    }
  };

  // Tutup detail + kembalikan fokus ke kartu pemicu (a11y keyboard).
  const handleClose = () => {
    const id = selectedId;
    setSelectedId(null);
    if (id && typeof document !== "undefined") {
      requestAnimationFrame(() => {
        (
          document.querySelector(`#station-${id} button`) as HTMLElement | null
        )?.focus();
      });
    }
  };

  return (
    <section className="bg-background">
      {/* Header + kontrol */}
      <div className="border-b border-border bg-muted/40">
        <div className="main-container py-8 sm:py-10">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {t("supercharge.locator.kicker")}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("supercharge.locator.title")}
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {t("supercharge.locator.subtitle")}
            </p>
          </Reveal>
          <div className="mt-6">
            <Controls
              filters={filters}
              setFilters={setFilters}
              onNearMe={setUserLocation}
              resultCount={filtered.length}
            />
          </div>
        </div>
      </div>

      {/* Body: split list + peta */}
      <div className="main-container py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(340px,38%)_1fr]">
          {/* List (SSR -> LCP & fallback) */}
          <div className="order-2 lg:order-1 lg:max-h-[72vh] lg:overflow-y-auto lg:pr-1">
            <h2 className="sr-only">{t("supercharge.locator.listHeading")}</h2>
            <StationList
              sites={filtered}
              selectedId={selectedId}
              userLocation={userLocation}
              onSelect={handleSelect}
              onHover={setHoveredId}
            />
          </div>

          {/* Peta (lazy, client-only) */}
          <div className="relative order-1 h-[55vh] overflow-hidden rounded-2xl border border-border lg:order-2 lg:sticky lg:top-20 lg:h-[72vh]">
            <MapClient
              sites={filtered}
              selectedId={selectedId}
              hoveredId={hoveredId}
              userLocation={userLocation}
              onSelect={handleSelect}
              onHover={setHoveredId}
            />
            {selected && (
              <StationDetail site={selected} onClose={handleClose} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
