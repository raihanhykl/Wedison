// Aturan booking di sisi server. Data cabang (nama, alamat, WA, zona waktu, jam buka, tanggal
// tutup) kini dari tabel Showroom (modul admin Showrooms) — lihat ../showrooms/showroom.rules.ts.
// Slot & util waktu di-re-export dari sana agar hanya ada satu implementasi.
import type { BookingPurpose } from "../../generated/prisma/enums.js";
export {
  SLOT_DURATION_MIN, SLOT_STEP_MIN, MIN_LEAD_MIN, MAX_DAYS_AHEAD,
  minutesToTime, timeToMinutes, nowInTimeZone, availableSlots, tzLabel,
} from "../showrooms/showroom.rules.js";

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

const dateFromYmd = (ymd: string) => new Date(`${ymd}T00:00:00Z`);

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
