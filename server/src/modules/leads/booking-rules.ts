// Aturan booking di sisi server. CERMIN dari src/lib/booking/{showrooms,slots}.ts di Next
// (server/ tidak bisa mengimpor dari src/ karena rootDir & build terpisah). Jika mengubah jam
// buka, nomor WA, atau zona waktu: ubah di KEDUA tempat.
import type { BookingPurpose } from "../../generated/prisma/enums.js";

export const SHOWROOM_IDS = ["jakarta", "bekasi", "bandung", "bali"] as const;
export type ShowroomId = (typeof SHOWROOM_IDS)[number];

type Hours = { open: number; close: number }; // menit sejak 00:00
const HOURS = { weekday: { open: 10 * 60, close: 19 * 60 }, weekend: { open: 10 * 60, close: 17 * 60 } };

export type Showroom = {
  id: ShowroomId;
  name: string;
  address: string;
  whatsapp: string;
  timeZone: "Asia/Jakarta" | "Asia/Makassar";
  tzLabel: "WIB" | "WITA";
  hours: { weekday: Hours; weekend: Hours };
};

export const SHOWROOMS: Record<ShowroomId, Showroom> = {
  jakarta: {
    id: "jakarta",
    name: "Wedison Jakarta",
    address: "Jl. Arteri Pondok Indah No 30 A-C, Kebayoran Lama Selatan, Jakarta Selatan, DKI Jakarta 12240",
    whatsapp: "6285286126550",
    timeZone: "Asia/Jakarta",
    tzLabel: "WIB",
    hours: HOURS,
  },
  bekasi: {
    id: "bekasi",
    name: "Wedison Bekasi",
    address: "Jl. HM. Joyo Martono, RT.003/RW.021, Margahayu, Bekasi Timur, Kota Bekasi, Jawa Barat 17113",
    whatsapp: "6285286126550",
    timeZone: "Asia/Jakarta",
    tzLabel: "WIB",
    hours: HOURS,
  },
  bandung: {
    id: "bandung",
    name: "Wedison Bandung",
    address: "Jl. Raya Gadobangkong No.154, Gadobangkong, Kec. Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552",
    whatsapp: "6285286126558",
    timeZone: "Asia/Jakarta",
    tzLabel: "WIB",
    hours: HOURS,
  },
  bali: {
    id: "bali",
    name: "Wedison Bali",
    address: "Jl. Gatot Subroto Tengah No.93, Dangin Puri Kaja, Denpasar Utara, Kota Denpasar, Bali 80118",
    whatsapp: "6285801011969",
    timeZone: "Asia/Makassar",
    tzLabel: "WITA",
    hours: HOURS,
  },
};

/** Kunci tujuan yang dikirim form publik -> enum DB. */
export const PURPOSE_FROM_FORM = {
  testRide: "TEST_RIDE",
  consultation: "CONSULTATION",
  financing: "FINANCING",
  service: "SERVICE",
  other: "OTHER",
} as const satisfies Record<string, BookingPurpose>;
export type FormPurpose = keyof typeof PURPOSE_FROM_FORM;

export const PURPOSE_LABEL: Record<BookingPurpose, string> = {
  TEST_RIDE: "Test Ride",
  CONSULTATION: "Konsultasi Produk",
  FINANCING: "Simulasi Pembiayaan",
  SERVICE: "Servis",
  OTHER: "Kunjungan Showroom",
};

export const SLOT_DURATION_MIN = 60;
export const SLOT_STEP_MIN = 30;
export const MIN_LEAD_MIN = 60;
export const MAX_DAYS_AHEAD = 60;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
export const PHONE_RE = /^(?:\+?62|0)8\d{7,12}$/;

export function normalizePhone(raw: string): string {
  return raw.replace(/[\s\-().]/g, "");
}
/** Bentuk kanonik untuk disimpan: selalu diawali "08". */
export function canonicalPhone(raw: string): string {
  const p = normalizePhone(raw);
  if (p.startsWith("+62")) return `0${p.slice(3)}`;
  if (p.startsWith("62")) return `0${p.slice(2)}`;
  return p;
}
/** Nomor untuk wa.me: 628xxxxxxxxx. */
export function waPhone(canonical: string): string {
  return canonical.replace(/^0/, "62");
}

const pad2 = (n: number) => String(n).padStart(2, "0");
export const minutesToTime = (m: number) => `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
export const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const dateFromYmd = (ymd: string) => new Date(`${ymd}T00:00:00Z`);
const isWeekend = (ymd: string) => [0, 6].includes(dateFromYmd(ymd).getUTCDay());
function addDaysYmd(ymd: string, days: number) {
  const d = dateFromYmd(ymd);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function nowInTimeZone(timeZone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return { ymd: `${get("year")}-${get("month")}-${get("day")}`, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function availableSlots(showroomId: ShowroomId, ymd: string, now = new Date()): string[] {
  const s = SHOWROOMS[showroomId];
  const hours = isWeekend(ymd) ? s.hours.weekend : s.hours.weekday;
  const cur = nowInTimeZone(s.timeZone, now);
  if (ymd < cur.ymd || ymd > addDaysYmd(cur.ymd, MAX_DAYS_AHEAD)) return [];
  const out: string[] = [];
  for (let m = hours.open; m + SLOT_DURATION_MIN <= hours.close; m += SLOT_STEP_MIN) {
    if (ymd === cur.ymd && m < cur.minutes + MIN_LEAD_MIN) continue;
    out.push(minutesToTime(m));
  }
  return out;
}

/**
 * Konversi tanggal+jam lokal di zona waktu tertentu -> instan UTC, tanpa library.
 * Aman untuk zona tanpa DST (Indonesia). Teknik: tebak UTC, ukur wall-clock zona pada
 * tebakan itu, koreksi selisihnya.
 */
export function zonedToUtc(ymd: string, hhmm: string, timeZone: string): Date {
  const [y, mo, d] = ymd.split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi, 0);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(guess));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const wall = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), 0);
  return new Date(guess - (wall - guess));
}

export function formatLongDateId(ymd: string): string {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(dateFromYmd(ymd));
}
