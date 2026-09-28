// Tipe data SuperCharge Locator. Bentuk GeoJSON agar langsung dikonsumsi MapLibre &
// siap dipindah ke DB/admin CRUD nanti (UI selalu fetch bentuk yang sama).

export type SiteStatus = "operational" | "coming_soon" | "maintenance" | "closed";
export type SiteTier = "hub" | "showroom" | "mitra";

export interface SiteProperties {
  id: string;
  slug: string;
  name: string;
  /** status site level, di-set manual admin (BUKAN ketersediaan charger real-time) */
  status: SiteStatus;
  address: string;
  city: string;
  province: string;
  /** jumlah pile fisik */
  piles_total: number;
  /** kapasitas total charger (STATIS) = piles_total * 2 (1 pile = 2 charger) */
  charger_available: number;
  power_kw: number;
  hours: string;
  amenities?: string[];
  photo?: string;
  type_tier: SiteTier;
}

export interface Site {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
  properties: SiteProperties;
}

export interface SiteCollection {
  type: "FeatureCollection";
  features: Site[];
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Filters {
  status: SiteStatus | "all";
  tier: SiteTier | "all";
  /** pencarian nama/kota/provinsi */
  query: string;
}
