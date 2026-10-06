import { z } from "zod";
import { SHOWROOM_IDS } from "./showrooms";
import { DATE_RE, TIME_RE } from "./slots";

// Tujuan booking = aktivitas yang tersedia di showroom (lihat section "Yang Bisa Kamu Lakukan").
export const BOOKING_PURPOSES = [
  "testRide",
  "consultation",
  "financing",
  "service",
  "other",
] as const;
export type BookingPurpose = (typeof BOOKING_PURPOSES)[number];

export function isBookingPurpose(value: unknown): value is BookingPurpose {
  return typeof value === "string" && (BOOKING_PURPOSES as readonly string[]).includes(value);
}

/** Dari mana modal dibuka (untuk analytics), bebas tapi dibatasi panjangnya. */
export const BOOKING_SOURCES = [
  "navbar",
  "nav-sheet",
  "landing-hero",
  "showroom-card",
  "product-hero",
  "product-subnav",
  "showroom-hero",
  "showroom-steps",
  "showroom-cta",
  "contact-page",
  "baas-cta",
  "other",
] as const;
export type BookingSource = (typeof BOOKING_SOURCES)[number];

// Nomor Indonesia: 08xxxxxxxxxx / 628xxxxxxxxx / +628xxxxxxxxx (8-13 digit setelah prefix).
export const PHONE_RE = /^(?:\+?62|0)8\d{7,12}$/;

/** Hilangkan spasi/strip/kurung supaya "0812-3456 7890" tetap lolos. */
export function normalizePhone(raw: string): string {
  return raw.replace(/[\s\-().]/g, "");
}

/** Bentuk kanonik untuk ditampilkan/dicatat: selalu diawali "08". */
export function displayPhone(raw: string): string {
  const p = normalizePhone(raw);
  if (p.startsWith("+62")) return `0${p.slice(3)}`;
  if (p.startsWith("62")) return `0${p.slice(2)}`;
  return p;
}

export type BookingMessages = {
  showroom: string;
  name: string;
  nameMax: string;
  phone: string;
  email: string;
  purpose: string;
  date: string;
  time: string;
  note: string;
};

// Pesan default (dipakai server). Client mengirim pesan terjemahan lewat createBookingSchema(t).
const DEFAULT_MESSAGES: BookingMessages = {
  showroom: "Please choose a showroom",
  name: "Please enter your full name",
  nameMax: "Name is too long",
  phone: "Please enter a valid Indonesian phone number",
  email: "Please enter a valid email address",
  purpose: "Please choose the purpose of your visit",
  date: "Please choose a date",
  time: "Please choose a time",
  note: "Note is too long",
};

export function createBookingSchema(m: Partial<BookingMessages> = {}) {
  const msg = { ...DEFAULT_MESSAGES, ...m };
  return z.object({
    showroom: z.enum(SHOWROOM_IDS, { errorMap: () => ({ message: msg.showroom }) }),
    name: z.string().trim().min(2, msg.name).max(80, msg.nameMax),
    phone: z
      .string()
      .trim()
      .transform(normalizePhone)
      .refine((v) => PHONE_RE.test(v), msg.phone),
    // Opsional: string kosong dianggap tidak diisi.
    email: z
      .string()
      .trim()
      .max(120, msg.email)
      .refine((v) => v === "" || z.string().email().safeParse(v).success, msg.email)
      .optional()
      .or(z.literal("")),
    purpose: z.enum(BOOKING_PURPOSES, { errorMap: () => ({ message: msg.purpose }) }),
    date: z.string().regex(DATE_RE, msg.date),
    time: z.string().regex(TIME_RE, msg.time),
    note: z.string().trim().max(500, msg.note).optional().or(z.literal("")),
    // Honeypot: manusia tidak melihat field ini. Tidak divalidasi di sini agar bot yang
    // mengisinya tetap dibalas "sukses" palsu oleh route (dicek di /api/booking).
    website: z.string().max(200).optional(),
    source: z.enum(BOOKING_SOURCES).optional(),
    locale: z.enum(["id", "en"]).optional(),
    recaptchaToken: z.string().optional(),
  });
}

export const bookingSchema = createBookingSchema();
/** Nilai SETELAH transform/parse (phone sudah dinormalisasi). */
export type BookingData = z.infer<typeof bookingSchema>;
/** Nilai form mentah (sebelum transform) untuk react-hook-form. */
export type BookingFormValues = z.input<typeof bookingSchema>;
