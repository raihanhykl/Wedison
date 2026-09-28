// Util tanggal/jam untuk booking. Sengaja tanpa library TZ: cukup Intl bawaan.
// Semua tanggal direpresentasikan sebagai string "YYYY-MM-DD" dan jam "HH:mm"
// dalam zona waktu SHOWROOM (bukan zona waktu browser/server).

import { SHOWROOMS, type ShowroomId } from "./showrooms";

/** Durasi default satu sesi kunjungan (menit). Dipakai untuk event kalender. */
export const SLOT_DURATION_MIN = 60;
/** Jarak antar slot yang ditawarkan (menit). */
export const SLOT_STEP_MIN = 30;
/** Booking hari ini minimal X menit dari sekarang (beri waktu tim bersiap). */
export const MIN_LEAD_MIN = 60;
/** Seberapa jauh ke depan boleh booking (hari). */
export const MAX_DAYS_AHEAD = 60;

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function minutesToTime(min: number): string {
  return `${pad2(Math.floor(min / 60))}:${pad2(min % 60)}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** "YYYY-MM-DD" -> Date pada 00:00 UTC (aman dari pergeseran zona waktu). */
export function dateFromYmd(ymd: string): Date {
  return new Date(`${ymd}T00:00:00Z`);
}

/** Date -> "YYYY-MM-DD" memakai komponen LOKAL (untuk hasil pilihan kalender di browser). */
export function ymdFromLocalDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Sabtu/Minggu? Dihitung dari kalender UTC (tanggal "murni"). */
export function isWeekend(ymd: string): boolean {
  const day = dateFromYmd(ymd).getUTCDay();
  return day === 0 || day === 6;
}

export function addDaysYmd(ymd: string, days: number): string {
  const d = dateFromYmd(ymd);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Waktu sekarang di zona waktu tertentu -> { ymd, minutes }. */
export function nowInTimeZone(timeZone: string, now: Date = new Date()): {
  ymd: string;
  minutes: number;
} {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    ymd: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/**
 * Daftar slot ("HH:mm") yang bisa dipilih untuk showroom + tanggal tertentu.
 * - mengikuti jam buka weekday/weekend
 * - slot terakhir = tutup - durasi sesi
 * - untuk hari ini: buang slot yang kurang dari MIN_LEAD_MIN dari sekarang
 */
export function availableSlots(
  showroomId: ShowroomId,
  ymd: string,
  now: Date = new Date(),
): string[] {
  const showroom = SHOWROOMS[showroomId];
  const hours = isWeekend(ymd) ? showroom.hours.weekend : showroom.hours.weekday;
  const current = nowInTimeZone(showroom.timeZone, now);

  if (ymd < current.ymd) return [];
  if (ymd > addDaysYmd(current.ymd, MAX_DAYS_AHEAD)) return [];

  const slots: string[] = [];
  for (let m = hours.open; m + SLOT_DURATION_MIN <= hours.close; m += SLOT_STEP_MIN) {
    if (ymd === current.ymd && m < current.minutes + MIN_LEAD_MIN) continue;
    slots.push(minutesToTime(m));
  }
  return slots;
}

/** Tanggal yang masih punya minimal satu slot. Dipakai untuk men-disable hari di kalender. */
export function isDateBookable(showroomId: ShowroomId, ymd: string, now: Date = new Date()): boolean {
  return availableSlots(showroomId, ymd, now).length > 0;
}

/** Format tanggal panjang per bahasa, mis. "Rabu, 1 Oktober 2026". */
export function formatLongDate(ymd: string, locale: "id" | "en"): string {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(dateFromYmd(ymd));
}
