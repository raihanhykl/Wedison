import type {
  Site,
  SiteStatus,
  SiteTier,
  Filters,
  LatLng,
} from "./types";

/**
 * Meta status — warna SENGAJA berbeda dari deep-green brand (#1E5B40) agar status
 * tidak tertukar dengan identitas. `marker` = warna pin di peta (nilai hex untuk SVG),
 * `dot/text/bg` = utilitas Tailwind untuk badge di card/detail. `labelKey` = i18n.
 */
export const STATUS_META: Record<
  SiteStatus,
  { labelKey: string; marker: string; dot: string; text: string; bg: string }
> = {
  operational: {
    labelKey: "supercharge.locator.status.operational",
    marker: "var(--primary)", // operational = hijau brand (state dominan)
    dot: "bg-primary",
    text: "text-primary",
    bg: "bg-primary/10",
  },
  coming_soon: {
    labelKey: "supercharge.locator.status.coming_soon",
    // indigo — sengaja beda hue dari biru "lokasi saya" (bg-sky-500) agar tak tertukar
    marker: "#4F46E5",
    dot: "bg-indigo-500",
    text: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  maintenance: {
    labelKey: "supercharge.locator.status.maintenance",
    marker: "#D97706",
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
  },
  closed: {
    labelKey: "supercharge.locator.status.closed",
    marker: "#71717A",
    dot: "bg-zinc-400",
    text: "text-zinc-600",
    bg: "bg-zinc-100",
  },
};

export const TIER_META: Record<SiteTier, { labelKey: string }> = {
  hub: { labelKey: "supercharge.locator.tier.hub" },
  showroom: { labelKey: "supercharge.locator.tier.showroom" },
  mitra: { labelKey: "supercharge.locator.tier.mitra" },
};

/** Jarak great-circle (km) antara dua koordinat. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const siteLatLng = (s: Site): LatLng => ({
  lat: s.geometry.coordinates[1],
  lng: s.geometry.coordinates[0],
});

/** Deep-link navigasi (Google Maps + Waze — Waze dominan di Indonesia). */
export const routeGoogle = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
export const routeWaze = (lat: number, lng: number) =>
  `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

/** Filter (status/tier/query) + urut jarak bila lokasi user diketahui. */
export function applyFilters(
  sites: Site[],
  filters: Filters,
  userLoc?: LatLng | null,
): Site[] {
  const q = filters.query.trim().toLowerCase();
  const out = sites.filter((s) => {
    const p = s.properties;
    if (filters.status !== "all" && p.status !== filters.status) return false;
    if (filters.tier !== "all" && p.type_tier !== filters.tier) return false;
    if (q) {
      const hay = `${p.name} ${p.city} ${p.province} ${p.address}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (userLoc) {
    return [...out].sort(
      (a, b) =>
        haversineKm(userLoc, siteLatLng(a)) -
        haversineKm(userLoc, siteLatLng(b)),
    );
  }
  return out;
}
