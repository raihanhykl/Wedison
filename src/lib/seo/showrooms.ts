// Pengelompokan showroom untuk halaman /showroom, JSON-LD, dan llms.txt. Data showroom sendiri
// (alamat, koordinat, WA, jam buka, tanggal tutup, status) dikelola di admin › Showrooms ›
// Locations dan datang dari API publik (getShowrooms()).

import { isListed, type PublicShowroom } from "@/lib/showrooms/showroom";

/**
 * Negara jaringan showroom. Negara dengan `published: false` TIDAK tampil di mana pun
 * (halaman /showroom, JSON-LD, llms.txt) — untuk menyiapkan ekspansi yang belum diumumkan.
 * Showroom di negara baru dibuat di admin dengan kode negara ini.
 */
export type CountryCode = "ID";

export type Country = {
  code: CountryCode;
  name: { id: string; en: string };
  published: boolean;
};

export const COUNTRIES: Country[] = [
  { code: "ID", name: { id: "Indonesia", en: "Indonesia" }, published: true },
];

const PUBLISHED_COUNTRIES = new Set<string>(COUNTRIES.filter((c) => c.published).map((c) => c.code));

/** Showroom yang tampil sebagai lokasi lengkap (buka / tutup sementara) di negara yang dipublikasikan. */
export function listedShowrooms(all: PublicShowroom[]) {
  return all.filter((s) => isListed(s) && PUBLISHED_COUNTRIES.has(s.country));
}

export type CountryNetwork = {
  country: Country;
  /** lokasi lengkap: peta + kartu */
  open: PublicShowroom[];
  /** "Segera hadir": hanya nama kota (admin mengaktifkan "tampil di situs") */
  upcoming: PublicShowroom[];
};

/** Jaringan per negara (hanya negara published), urut sesuai COUNTRIES. */
export function showroomNetwork(all: PublicShowroom[]): CountryNetwork[] {
  return COUNTRIES.filter((c) => c.published)
    .map((country) => ({
      country,
      open: all.filter((s) => s.country === country.code && isListed(s)),
      upcoming: all.filter((s) => s.country === country.code && s.status === "COMING_SOON"),
    }))
    .filter((n) => n.open.length || n.upcoming.length);
}

/** "Jakarta, Bekasi, dan Bali" / "Jakarta, Bekasi, and Bali" (gaya koma yang sama dengan copy situs). */
export function joinCities(cities: string[], locale: "id" | "en") {
  const and = locale === "en" ? "and" : "dan";
  if (cities.length <= 1) return cities[0] ?? "";
  if (cities.length === 2) return `${cities[0]} ${and} ${cities[1]}`;
  return `${cities.slice(0, -1).join(", ")}, ${and} ${cities[cities.length - 1]}`;
}
