// Registry showroom untuk fitur booking (Test Ride / Book a Visit).
// Satu sumber kebenaran untuk: label i18n, nomor WhatsApp per cabang, zona waktu,
// alamat (untuk event Google Calendar), dan jam buka.
//
// Nomor WhatsApp WAJIB mengikuti cabang:
//   Jakarta & Bekasi -> 6285286126550 | Bandung -> 6285286126558 | Bali -> 6285801011969

export const SHOWROOM_IDS = ["jakarta", "bekasi", "bandung", "bali"] as const;
export type ShowroomId = (typeof SHOWROOM_IDS)[number];

export type OpeningHours = {
  /** menit sejak 00:00, mis. 10:00 -> 600 */
  open: number;
  close: number;
};

export type Showroom = {
  id: ShowroomId;
  /** kunci kamus untuk nama tampil, mis. "showroom.bekasi.name" */
  nameKey: string;
  /** kunci kamus untuk alamat tampil */
  addressKey: string;
  /** nama internal (dipakai di kalender/WA, tidak dilokalisasi) */
  name: string;
  /** alamat internal (dipakai di field `location` Google Calendar) */
  address: string;
  /** nomor WhatsApp cabang, format internasional tanpa "+" */
  whatsapp: string;
  /** zona waktu IANA cabang (Bali = WITA) */
  timeZone: "Asia/Jakarta" | "Asia/Makassar";
  /** singkatan zona waktu untuk UI/pesan */
  tzLabel: "WIB" | "WITA";
  hours: { weekday: OpeningHours; weekend: OpeningHours };
};

const HOURS = {
  weekday: { open: 10 * 60, close: 19 * 60 },
  weekend: { open: 10 * 60, close: 17 * 60 },
} as const;

export const SHOWROOMS: Record<ShowroomId, Showroom> = {
  jakarta: {
    id: "jakarta",
    nameKey: "showroom.jakarta.name",
    addressKey: "showroom.jakarta.address",
    name: "Wedison Jakarta",
    address:
      "Jl. Arteri Pondok Indah No 30 A-C, Kebayoran Lama Selatan, Jakarta Selatan, DKI Jakarta 12240",
    whatsapp: "6285286126550",
    timeZone: "Asia/Jakarta",
    tzLabel: "WIB",
    hours: HOURS,
  },
  bekasi: {
    id: "bekasi",
    nameKey: "showroom.bekasi.name",
    addressKey: "showroom.bekasi.address",
    name: "Wedison Bekasi",
    address:
      "Jl. HM. Joyo Martono, RT.003/RW.021, Margahayu, Bekasi Timur, Kota Bekasi, Jawa Barat 17113",
    whatsapp: "6285286126550",
    timeZone: "Asia/Jakarta",
    tzLabel: "WIB",
    hours: HOURS,
  },
  bandung: {
    id: "bandung",
    nameKey: "showroom.bandung.name",
    addressKey: "showroom.bandung.address",
    name: "Wedison Bandung",
    address:
      "Jl. Raya Gadobangkong No.154, Gadobangkong, Kec. Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552",
    whatsapp: "6285286126558",
    timeZone: "Asia/Jakarta",
    tzLabel: "WIB",
    hours: HOURS,
  },
  bali: {
    id: "bali",
    nameKey: "showroom.bali.name",
    addressKey: "showroom.bali.address",
    name: "Wedison Bali",
    address:
      "Jl. Gatot Subroto Tengah No.93, Dangin Puri Kaja, Denpasar Utara, Kota Denpasar, Bali 80118",
    whatsapp: "6285801011969",
    timeZone: "Asia/Makassar",
    tzLabel: "WITA",
    hours: HOURS,
  },
};

export const SHOWROOM_LIST: Showroom[] = SHOWROOM_IDS.map((id) => SHOWROOMS[id]);

export function isShowroomId(value: unknown): value is ShowroomId {
  return typeof value === "string" && (SHOWROOM_IDS as readonly string[]).includes(value);
}
