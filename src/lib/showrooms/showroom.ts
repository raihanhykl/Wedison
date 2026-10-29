// Tipe + aturan showroom di frontend (form booking, /showroom, Kontak, JSON-LD, llms.txt).
// Data dikelola di admin (Showrooms › Locations) dan dikirim API publik /public/showrooms.
// Mirror aturan backend: server/src/modules/showrooms/showroom.rules.ts (jaga agar sinkron).

export const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const; // index = getUTCDay()
export type DayKey = (typeof DAY_KEYS)[number];
export type DayHours = { open: string; close: string } | null;
export type WeekHours = Record<DayKey | "holiday", DayHours>;
export type Closure = { from: string; to: string; note: string };
export type ShowroomStatus = "OPEN" | "COMING_SOON" | "TEMPORARILY_CLOSED" | "CLOSED";

/** Showroom seperti dikirim API publik (hanya yang tampil di situs). */
export type PublicShowroom = {
  id: string;
  name: string;
  city: string;
  status: ShowroomStatus;
  /** bisa dipilih di form booking (OPEN + tampil + booking aktif) */
  bookable: boolean;
  country: string;
  address: { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string };
  lat: number | null;
  lng: number | null;
  mapsUrl: string | null;
  whatsapp: string;
  phone: string | null;
  email: string | null;
  timeZone: string;
  tzLabel: string;
  hours: WeekHours;
  /** tanggal tutup khusus yang belum lewat */
  closures: Closure[];
  hasWorkshop: boolean;
  hasSupercharge: boolean;
  photoUrl: string | null;
  updatedAt: string;
};

export const DEFAULT_PHOTO = "/ShowRoom-Receptionist.webp";

export function addressLine(s: Pick<PublicShowroom, "address">) {
  const a = s.address;
  return [a.streetAddress, a.addressLocality, a.addressRegion, a.postalCode].filter(Boolean).join(", ");
}

/** Lokasi lengkap (kartu + pin peta), bukan teaser "Segera hadir". */
export const isListed = (s: PublicShowroom) => s.status === "OPEN" || s.status === "TEMPORARILY_CLOSED";

const pad2 = (n: number) => String(n).padStart(2, "0");
export const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
export const fromMinutes = (m: number) => `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
const dateFromYmd = (ymd: string) => new Date(`${ymd}T00:00:00Z`);
export const dayKeyOf = (ymd: string): DayKey => DAY_KEYS[dateFromYmd(ymd).getUTCDay()];

export function closureOn(s: Pick<PublicShowroom, "closures">, ymd: string): Closure | null {
  return s.closures.find((c) => c.from <= ymd && ymd <= c.to) ?? null;
}

/** Jam buka (menit) pada tanggal tertentu; null = tutup (libur mingguan atau tanggal tutup khusus). */
export function hoursOn(s: Pick<PublicShowroom, "hours" | "closures">, ymd: string): { open: number; close: number } | null {
  if (closureOn(s, ymd)) return null;
  const h = s.hours[dayKeyOf(ymd)];
  return h ? { open: toMinutes(h.open), close: toMinutes(h.close) } : null;
}

/** Waktu sekarang di zona waktu tertentu -> { ymd, minutes }. */
export function nowIn(timeZone: string, now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return { ymd: `${get("year")}-${get("month")}-${get("day")}`, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function addDays(ymd: string, days: number) {
  const d = dateFromYmd(ymd);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type OpenStatus =
  | { kind: "open"; until: string }
  | { kind: "closed"; nextDay: DayKey | "today" | "tomorrow"; at: string }
  | { kind: "closedToday"; note: string }
  | { kind: "temporarilyClosed" };

/**
 * Status buka/tutup menurut jam & zona waktu cabang sendiri. "closedToday" = tanggal tutup
 * khusus hari ini (catatan admin, mis. "Libur Lebaran").
 */
export function openStatusAt(s: PublicShowroom, now: Date): OpenStatus {
  if (s.status === "TEMPORARILY_CLOSED") return { kind: "temporarilyClosed" };
  const { ymd, minutes } = nowIn(s.timeZone, now);
  const closure = closureOn(s, ymd);
  if (closure) return { kind: "closedToday", note: closure.note };
  const today = hoursOn(s, ymd);
  if (today && minutes >= today.open && minutes < today.close) return { kind: "open", until: fromMinutes(today.close) };
  if (today && minutes < today.open) return { kind: "closed", nextDay: "today", at: fromMinutes(today.open) };
  for (let i = 1; i <= 14; i++) {
    const d = addDays(ymd, i);
    const h = hoursOn(s, d);
    if (h) return { kind: "closed", nextDay: i === 1 ? "tomorrow" : dayKeyOf(d), at: fromMinutes(h.open) };
  }
  return { kind: "temporarilyClosed" };
}

/** Baris jam buka ringkas untuk kartu: hari berurutan dengan jam sama digabung ("Sen–Jum"). */
export function hoursRows(s: Pick<PublicShowroom, "hours">): { days: DayKey[]; hours: DayHours }[] {
  const order: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const rows: { days: DayKey[]; hours: DayHours }[] = [];
  for (const d of order) {
    const h = s.hours[d];
    const last = rows[rows.length - 1];
    if (last && JSON.stringify(last.hours) === JSON.stringify(h)) last.days.push(d);
    else rows.push({ days: [d], hours: h });
  }
  return rows;
}

const DAY_NAMES: Record<"id" | "en", Record<DayKey, string>> = {
  id: { mon: "Sen", tue: "Sel", wed: "Rab", thu: "Kam", fri: "Jum", sat: "Sab", sun: "Min" },
  en: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
};
const DAY_LONG: Record<"id" | "en", Record<DayKey, string>> = {
  id: { mon: "Senin", tue: "Selasa", wed: "Rabu", thu: "Kamis", fri: "Jumat", sat: "Sabtu", sun: "Minggu" },
  en: { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" },
};
export const dayName = (d: DayKey, l: "id" | "en", long = false) => (long ? DAY_LONG : DAY_NAMES)[l][d];
export const dayRange = (days: DayKey[], l: "id" | "en") =>
  days.length === 1 ? dayName(days[0], l) : `${dayName(days[0], l)}–${dayName(days[days.length - 1], l)}`;
export const dotTime = (hhmm: string) => hhmm.replace(":", ".");

/** "10 Apr 2026" atau "10–15 Apr 2026" untuk tanggal tutup. */
export function closureRange(c: Closure, l: "id" | "en") {
  const fmt = (ymd: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(l === "en" ? "en-GB" : "id-ID", { ...opts, timeZone: "UTC" }).format(dateFromYmd(ymd));
  if (c.from === c.to) return fmt(c.from, { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(c.from, { day: "numeric", month: "short" })} – ${fmt(c.to, { day: "numeric", month: "short", year: "numeric" })}`;
}
