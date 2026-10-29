import { z } from "zod";
import type { Showroom } from "../../lib/prisma.js";

// Aturan & validasi showroom. Dipakai modul Showrooms (CRUD), Leads (booking: slot, WA, kalender),
// dan Opening Teasers (salin alamat/kontak). Mirror tipe di frontend: src/lib/showrooms/showroom.ts.

export const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const; // index = getUTCDay()
export type DayKey = (typeof DAY_KEYS)[number];
export const TIME_ZONES = ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"] as const;
export const TZ_LABEL: Record<string, string> = { "Asia/Jakarta": "WIB", "Asia/Makassar": "WITA", "Asia/Jayapura": "WIT" };
export const tzLabel = (tz: string) => TZ_LABEL[tz] ?? "WIB";

export const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const YMD = /^\d{4}-\d{2}-\d{2}$/;
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export type DayHours = { open: string; close: string } | null;
export type WeekHours = Record<DayKey | "holiday", DayHours>;
export type Closure = { from: string; to: string; note: string };

// ─── Slot booking (aturan yang sama dengan src/lib/booking/slots.ts) ───────

export const SLOT_DURATION_MIN = 60;
export const SLOT_STEP_MIN = 30;
export const MIN_LEAD_MIN = 60;
export const MAX_DAYS_AHEAD = 60;

const pad2 = (n: number) => String(n).padStart(2, "0");
export const minutesToTime = (m: number) => `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
export const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const dateFromYmd = (ymd: string) => new Date(`${ymd}T00:00:00Z`);
export function addDaysYmd(ymd: string, days: number) {
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

type SlotSource = Pick<Showroom, "timeZone" | "hours" | "closures">;

export const weekHours = (s: Pick<Showroom, "hours">) => s.hours as unknown as WeekHours;
export const closuresOf = (s: Pick<Showroom, "closures">) => (s.closures as unknown as Closure[]) ?? [];

/** Tanggal tutup khusus yang mencakup `ymd` (mis. libur Lebaran, renovasi), atau null. */
export function closureOn(s: Pick<Showroom, "closures">, ymd: string): Closure | null {
  return closuresOf(s).find((c) => c.from <= ymd && ymd <= c.to) ?? null;
}

/** Jam buka pada tanggal tertentu (menit), null = tutup (hari libur mingguan / tutup khusus). */
export function hoursOn(s: SlotSource, ymd: string): { open: number; close: number } | null {
  if (closureOn(s, ymd)) return null;
  const h = weekHours(s)[DAY_KEYS[dateFromYmd(ymd).getUTCDay()]];
  return h ? { open: timeToMinutes(h.open), close: timeToMinutes(h.close) } : null;
}

/** Slot "HH:mm" yang bisa di-booking untuk showroom + tanggal (zona waktu showroom). */
export function availableSlots(s: SlotSource, ymd: string, now = new Date()): string[] {
  const cur = nowInTimeZone(s.timeZone, now);
  if (ymd < cur.ymd || ymd > addDaysYmd(cur.ymd, MAX_DAYS_AHEAD)) return [];
  const h = hoursOn(s, ymd);
  if (!h) return [];
  const out: string[] = [];
  for (let m = h.open; m + SLOT_DURATION_MIN <= h.close; m += SLOT_STEP_MIN) {
    if (ymd === cur.ymd && m < cur.minutes + MIN_LEAD_MIN) continue;
    out.push(minutesToTime(m));
  }
  return out;
}

/** Bisa dipilih di form booking publik. */
export const isBookable = (s: Pick<Showroom, "status" | "isPublic" | "bookable">) => s.status === "OPEN" && s.isPublic && s.bookable;

/** Tampil di situs (kartu showroom / kartu "Segera hadir"). Tutup permanen tidak pernah tampil. */
export const isVisible = (s: Pick<Showroom, "status" | "isPublic">) => s.isPublic && s.status !== "CLOSED";

export function addressLine(s: Pick<Showroom, "streetAddress" | "addressLocality" | "addressRegion" | "postalCode">) {
  return [s.streetAddress, s.addressLocality, s.addressRegion, s.postalCode].filter(Boolean).join(", ");
}

// ─── Validasi input admin ────────────────────────────────────────────────────

/** "0852…", "+62 852-…", "62852…" -> "62852…". */
export function normalizeWhatsapp(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

const dayHours = z
  .object({ open: z.string().regex(HHMM, "Use HH:MM"), close: z.string().regex(HHMM, "Use HH:MM") })
  .refine((h) => timeToMinutes(h.close) - timeToMinutes(h.open) >= SLOT_DURATION_MIN, {
    message: `Closing time must be at least ${SLOT_DURATION_MIN} minutes after opening`,
    path: ["close"],
  })
  .nullable();

const hoursSchema = z.object(Object.fromEntries([...DAY_KEYS, "holiday"].map((k) => [k, dayHours])) as Record<DayKey | "holiday", typeof dayHours>);

const closureSchema = z
  .object({ from: z.string().regex(YMD, "Pick a date"), to: z.string().regex(YMD, "Pick a date"), note: z.string().trim().max(120).default("") })
  .refine((c) => c.to >= c.from, { message: "The end date must be on or after the start date", path: ["to"] });

const optionalText = (max: number) => z.string().trim().max(max).default("");

export const showroomInputSchema = z
  .object({
    name: z.string().trim().min(3, "Name is required").max(80),
    city: z.string().trim().min(2, "City is required").max(60),
    status: z.enum(["OPEN", "COMING_SOON", "TEMPORARILY_CLOSED", "CLOSED"]).default("OPEN"),
    isPublic: z.boolean().default(false),
    bookable: z.boolean().default(true),
    country: z.enum(["ID"]).default("ID"),
    sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
    streetAddress: optionalText(200),
    addressLocality: optionalText(80),
    addressRegion: optionalText(80),
    postalCode: z.string().trim().max(10).regex(/^\d*$/, "Digits only").default(""),
    lat: z.coerce.number().min(-11).max(6).nullable().default(null),
    lng: z.coerce.number().min(95).max(141).nullable().default(null),
    mapsUrl: z
      .string()
      .trim()
      .max(1000)
      .refine((v) => v === "" || /^https:\/\//.test(v), "Maps link must start with https://")
      .transform((v) => v || null)
      .nullable()
      .default(null),
    whatsapp: z
      .string()
      .trim()
      .transform(normalizeWhatsapp)
      .refine((v) => /^62\d{8,13}$/.test(v), "WhatsApp number must be an Indonesian number, e.g. 0852 8612 6550"),
    phone: z
      .string()
      .trim()
      .max(24)
      .refine((v) => v === "" || /^\+?[\d\s\-().]{6,24}$/.test(v), "Enter a valid phone number")
      .transform((v) => v || null)
      .nullable()
      .default(null),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(120)
      .refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email address")
      .transform((v) => v || null)
      .nullable()
      .default(null),
    timeZone: z.enum(TIME_ZONES).default("Asia/Jakarta"),
    hours: hoursSchema,
    closures: z.array(closureSchema).max(60).default([]),
    hasWorkshop: z.boolean().default(true),
    hasSupercharge: z.boolean().default(false),
    photoUrl: z
      .string()
      .trim()
      .max(1000)
      .refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "Photo must be an uploaded image or an https:// URL")
      .transform((v) => v || null)
      .nullable()
      .default(null),
  })
  // Showroom yang tampil sebagai lokasi lengkap (bukan teaser "Segera hadir") butuh alamat dan titik peta.
  .superRefine((v, ctx) => {
    const listed = v.isPublic && (v.status === "OPEN" || v.status === "TEMPORARILY_CLOSED");
    if (!listed) return;
    if (!v.streetAddress) ctx.addIssue({ code: "custom", path: ["streetAddress"], message: "Street address is required for a showroom shown on the site" });
    if (!v.addressLocality) ctx.addIssue({ code: "custom", path: ["addressLocality"], message: "City (address) is required for a showroom shown on the site" });
    if (v.lat == null || v.lng == null) ctx.addIssue({ code: "custom", path: ["lat"], message: "Pin the location on the map: it is shown on the Showroom page" });
    if (v.status === "OPEN" && ![...DAY_KEYS].some((d) => v.hours[d])) ctx.addIssue({ code: "custom", path: ["hours"], message: "An open showroom needs at least one opening day" });
  });

export const showroomCreateSchema = showroomInputSchema.and(
  z.object({ id: z.string().trim().toLowerCase().min(2).max(40).regex(ID_RE, "Use lowercase letters, numbers and dashes, e.g. surabaya") }),
);

export type ShowroomInput = z.infer<typeof showroomInputSchema>;
