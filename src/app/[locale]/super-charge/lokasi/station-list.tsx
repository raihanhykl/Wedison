"use client";

import { useLanguage } from "@/app/lib/language-context";
import type { Site, LatLng } from "./types";
import StationCard from "./station-card";

type Props = {
  sites: Site[];
  selectedId: string | null;
  userLocation: LatLng | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
};

export default function StationList({
  sites,
  selectedId,
  userLocation,
  onSelect,
  onHover,
}: Props) {
  const { t } = useLanguage();

  if (sites.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm font-semibold text-foreground">
          {t("supercharge.locator.empty.title")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("supercharge.locator.empty.desc")}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3" aria-label={t("supercharge.locator.listHeading")}>
      {sites.map((s) => (
        <li key={s.properties.id} id={`station-${s.properties.id}`}>
          <StationCard
            site={s}
            active={s.properties.id === selectedId}
            userLocation={userLocation}
            onSelect={onSelect}
            onHover={onHover}
          />
        </li>
      ))}
    </ul>
  );
}
