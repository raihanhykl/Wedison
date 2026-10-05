// Data terstruktur showroom (alamat terpisah komponen, koordinat, tautan peta) untuk
// halaman /showroom, JSON-LD MotorcycleDealer, dan llms.txt. Nomor WhatsApp & jam buka
// tetap dari src/lib/booking/showrooms.ts (sumber tunggal untuk fitur booking).

import { SHOWROOMS, type ShowroomId } from "@/lib/booking/showrooms";

/**
 * Negara jaringan showroom. Negara dengan `published: false` TIDAK tampil di mana pun
 * (halaman /showroom, JSON-LD, llms.txt) — dipakai untuk menyiapkan ekspansi yang belum
 * diumumkan. Cara menambah negara baru:
 *   1. Tambah kode di CountryCode + entri di COUNTRIES (published: false dulu).
 *   2. Cabang yang sudah buka: daftarkan di src/lib/booking/showrooms.ts (WA, zona waktu,
 *      jam; juga registry server/src/modules/leads) lalu di SHOWROOM_LOCATIONS dengan
 *      `country` yang sesuai. Cabang yang belum buka: cukup di UPCOMING_SHOWROOMS.
 *   3. Saat siap diumumkan, ubah `published` negara itu jadi true.
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

/**
 * Cabang yang segera buka: sengaja HANYA kota (teaser) — tanpa alamat, kontak, koordinat,
 * atau tautan booking sampai cabang resmi dibuka.
 */
export type UpcomingShowroom = {
  id: string;
  city: string;
  country: CountryCode;
};

export const UPCOMING_SHOWROOMS: UpcomingShowroom[] = [
  { id: "medan", city: "Medan", country: "ID" },
  { id: "surabaya", city: "Surabaya", country: "ID" },
];

export type ShowroomLocation = {
  id: ShowroomId;
  country: CountryCode;
  /** Nama tampil (tidak dilokalisasi; kunci kamus tetap dipakai UI) */
  name: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
  };
  geo: { latitude: number; longitude: number };
  mapsUrl: string;
  whatsapp: string;
};

export const SHOWROOM_LOCATIONS: ShowroomLocation[] = [
  {
    id: "jakarta",
    country: "ID",
    name: "Wedison Jakarta",
    address: {
      streetAddress: "Jl. Arteri Pondok Indah No. 30 A-C, Kebayoran Lama Selatan",
      addressLocality: "Jakarta Selatan",
      addressRegion: "DKI Jakarta",
      postalCode: "12240",
    },
    geo: { latitude: -6.2484, longitude: 106.781 },
    mapsUrl:
      "https://www.google.com/maps/place/Wedison+Showroom/@-6.248464,106.7806209,19z/data=!4m10!1m2!2m1!1swedison+showroom!3m6!1s0x2e69f10019a26049:0xa59abd5e111a8a10!8m2!3d-6.248447!4d106.7810459!15sChB3ZWRpc29uIHNob3dyb29tWhIiEHdlZGlzb24gc2hvd3Jvb22SARplbGVjdHJpY19tb3RvcmN5Y2xlX2RlYWxlcqoBOBABMh4QASIa377C9bwSIpBp7hHS_qeMc_QbuBNmgIsWHu0yFBACIhB3ZWRpc29uIHNob3dyb29t4AEA!16s%2Fg%2F11x1nqm1sg!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoASAFQAw%3D%3D",
    whatsapp: SHOWROOMS.jakarta.whatsapp,
  },
  {
    id: "bekasi",
    country: "ID",
    name: "Wedison Bekasi",
    address: {
      streetAddress: "Jl. HM. Joyo Martono, RT.003/RW.021, Margahayu, Bekasi Timur",
      addressLocality: "Kota Bekasi",
      addressRegion: "Jawa Barat",
      postalCode: "17113",
    },
    geo: { latitude: -6.2597989, longitude: 107.0199037 },
    mapsUrl: "https://maps.app.goo.gl/DXB6csamG8R78XoP9",
    whatsapp: SHOWROOMS.bekasi.whatsapp,
  },
  {
    id: "bandung",
    country: "ID",
    name: "Wedison Bandung",
    address: {
      streetAddress: "Jl. Raya Gadobangkong No. 154, Gadobangkong, Ngamprah",
      addressLocality: "Kabupaten Bandung Barat",
      addressRegion: "Jawa Barat",
      postalCode: "40552",
    },
    geo: { latitude: -6.86542, longitude: 107.514505 },
    mapsUrl: "https://maps.app.goo.gl/T86DfRuAkHFBmhMs8",
    whatsapp: SHOWROOMS.bandung.whatsapp,
  },
  {
    id: "bali",
    country: "ID",
    name: "Wedison Bali",
    address: {
      streetAddress: "Jl. Gatot Subroto Tengah No. 93, Dangin Puri Kaja, Denpasar Utara",
      addressLocality: "Kota Denpasar",
      addressRegion: "Bali",
      postalCode: "80118",
    },
    geo: { latitude: -8.6359263, longitude: 115.2213254 },
    mapsUrl: "https://maps.app.goo.gl/og4ovnG2FgCAQAWt8",
    whatsapp: SHOWROOMS.bali.whatsapp,
  },
];

const PUBLISHED_COUNTRIES = new Set(COUNTRIES.filter((c) => c.published).map((c) => c.code));

/** Cabang buka di negara yang sudah dipublikasikan — dipakai halaman, JSON-LD, dan llms.txt. */
export const PUBLISHED_SHOWROOM_LOCATIONS = SHOWROOM_LOCATIONS.filter((s) =>
  PUBLISHED_COUNTRIES.has(s.country),
);

export type CountryNetwork = {
  country: Country;
  open: ShowroomLocation[];
  upcoming: UpcomingShowroom[];
};

/** Jaringan per negara (hanya negara published), urut sesuai COUNTRIES. */
export function showroomNetwork(): CountryNetwork[] {
  return COUNTRIES.filter((c) => c.published).map((country) => ({
    country,
    open: SHOWROOM_LOCATIONS.filter((s) => s.country === country.code),
    upcoming: UPCOMING_SHOWROOMS.filter((u) => u.country === country.code),
  }));
}

/** Jam buka (sama semua cabang): Sen–Jum 10:00–19:00, Sab–Min 10:00–17:00 (waktu setempat). */
export const SHOWROOM_OPENING_HOURS = [
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "19:00" },
  { days: ["Saturday", "Sunday"], opens: "10:00", closes: "17:00" },
] as const;

export function showroomFullAddress(s: ShowroomLocation): string {
  const a = s.address;
  return `${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`;
}
