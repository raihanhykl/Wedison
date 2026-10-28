import { z } from "zod";

// Skema & aturan modul Showroom Teaser (landing pembukaan cabang).
// Desain halaman tetap di kode (src/app/[locale]/showroom/[slug]); di sini hanya data yang
// boleh diubah admin: wording per bahasa, jadwal, gambar, dan titik kontak.
// Mirror tipe di frontend: src/lib/teasers/teaser.ts (jaga agar sinkron).

export const TEASER_LOCALES = ["id", "en"] as const;
export type TeaserLocale = (typeof TEASER_LOCALES)[number];

export const MODEL_KEYS = ["athena", "bees", "victory", "edpower"] as const;
export const IMAGE_SLOTS = ["heroDesktop", "heroMobile", "event", "experienceMain", "experienceLounge", "promo", "og"] as const;

/** Zona waktu Indonesia yang didukung (tanpa DST). */
export const TIME_ZONES = ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"] as const;

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const YMD = /^\d{4}-\d{2}-\d{2}$/;
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Teks bebas: boleh kosong saat draf (dicek saat publish), dibatasi panjangnya. */
const txt = (max: number) => z.string().trim().max(max).default("");

const linkHref = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "Link must start with / (page on this site) or https://")
  .default("");

const contentSchema = z.object({
  seo: z.object({
    title: txt(70),
    description: txt(170),
    keywords: z.array(z.string().trim().min(1).max(60)).max(15).default([]),
  }),
  hero: z.object({ eyebrow: txt(60), title: txt(120), desc: txt(320), ctaPrimary: txt(40), ctaSecondary: txt(40), imageAlt: txt(160) }),
  countdown: z.object({ label: txt(80), days: txt(20), hours: txt(20), minutes: txt(20), seconds: txt(20), open: txt(160) }),
  event: z.object({
    title: txt(80),
    desc: txt(320),
    dateLabel: txt(30),
    timeLabel: txt(30),
    locationLabel: txt(30),
    entryLabel: txt(30),
    entryValue: txt(80),
    addToCalendar: txt(40),
    directions: txt(40),
    calendarTitle: txt(120),
    calendarDetails: txt(500),
    imageAlt: txt(160),
  }),
  experience: z.object({
    title: txt(80),
    desc: txt(320),
    items: z.array(z.object({ title: txt(80), desc: txt(300), linkLabel: txt(60), linkHref })).max(6).default([]),
    imageMainAlt: txt(160),
    imageLoungeAlt: txt(160),
  }),
  promo: z.object({
    title: txt(80),
    desc: txt(320),
    items: z.array(z.object({ title: txt(80), desc: txt(300) })).max(6).default([]),
    terms: txt(400),
    cta: txt(40),
    imageAlt: txt(160),
  }),
  models: z.object({
    title: txt(80),
    desc: txt(320),
    detail: txt(30),
    taglines: z.object(Object.fromEntries(MODEL_KEYS.map((k) => [k, txt(60)])) as Record<(typeof MODEL_KEYS)[number], ReturnType<typeof txt>>),
  }),
  inquiry: z.object({ title: txt(80), desc: txt(320), directTitle: txt(80), directDesc: txt(200), whatsappLabel: txt(40), whatsappText: txt(300), emailLabel: txt(30) }),
  faq: z.object({ title: txt(80), items: z.array(z.object({ q: txt(200), a: txt(800) })).max(12).default([]) }),
});
export type TeaserContent = z.infer<typeof contentSchema>;

const imageUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v.startsWith("/") || /^https:\/\//.test(v), "Image must be an uploaded file or an https:// URL")
  .nullable()
  .default(null);

/** Nomor WA: terima "0852…", "+62 852-…", "62852…" -> "62852…". */
export function normalizeWhatsapp(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

export const teaserInputSchema = z
  .object({
    slug: z.string().trim().toLowerCase().max(60).regex(SLUG_RE, "Use lowercase letters, numbers and dashes, e.g. surabaya"),
    city: z.string().trim().min(2, "City is required").max(60),
    showroomName: z.string().trim().min(3, "Showroom name is required").max(120),
    noIndex: z.boolean().default(false),
    timeZone: z.enum(TIME_ZONES).default("Asia/Jakarta"),
    startDate: z.string().regex(YMD, "Pick the opening date"),
    startTime: z.string().regex(HHMM, "Start time must be HH:MM"),
    endDate: z.string().regex(YMD, "Pick the end date"),
    endTime: z.string().regex(HHMM, "End time must be HH:MM"),
    showCountdown: z.boolean().default(true),
    streetAddress: z.string().trim().max(200).default(""),
    addressLocality: z.string().trim().max(80).default(""),
    addressRegion: z.string().trim().max(80).default(""),
    postalCode: z.string().trim().max(10).default(""),
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
    email: z.string().trim().toLowerCase().email("Enter a valid email address").max(120),
    models: z.array(z.enum(MODEL_KEYS)).max(MODEL_KEYS.length).default([...MODEL_KEYS]),
    images: z.object(Object.fromEntries(IMAGE_SLOTS.map((k) => [k, imageUrl])) as Record<(typeof IMAGE_SLOTS)[number], typeof imageUrl>).default({} as never),
    content: z.object({ id: contentSchema, en: contentSchema }),
  })
  .refine((v) => new Set(v.models).size === v.models.length, { message: "Each model can be shown once", path: ["models"] });

export type TeaserInput = z.infer<typeof teaserInputSchema>;

// ─── Zona waktu ──────────────────────────────────────────────────────────────

/** Tanggal+jam lokal di zona `timeZone` -> instan UTC (zona Indonesia tanpa DST). */
export function zonedToUtc(ymd: string, hhmm: string, timeZone: string): Date {
  const [y, mo, d] = ymd.split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi, 0);
  const wall = utcToZonedParts(new Date(guess), timeZone);
  const wallMs = Date.UTC(Number(wall.ymd.slice(0, 4)), Number(wall.ymd.slice(5, 7)) - 1, Number(wall.ymd.slice(8, 10)), Number(wall.hhmm.slice(0, 2)), Number(wall.hhmm.slice(3, 5)), 0);
  return new Date(guess - (wallMs - guess));
}

/** Instan UTC -> { ymd, hhmm } di zona `timeZone` (untuk form edit admin). */
export function utcToZonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return { ymd: `${get("year")}-${get("month")}-${get("day")}`, hhmm: `${get("hour")}:${get("minute")}` };
}

// ─── Kelengkapan sebelum tayang ─────────────────────────────────────────────

export type TeaserIssue = { path: string; message: string };

type Checkable = Pick<TeaserInput, "streetAddress" | "addressLocality" | "content"> & { models: readonly string[]; startAt: Date; endAt: Date };

const REQUIRED: [string, string, (c: TeaserContent) => string][] = [
  ["seo.title", "SEO title", (c) => c.seo.title],
  ["seo.description", "SEO description", (c) => c.seo.description],
  ["hero.title", "Hero headline", (c) => c.hero.title],
  ["hero.desc", "Hero description", (c) => c.hero.desc],
  ["hero.ctaPrimary", "Hero main button", (c) => c.hero.ctaPrimary],
  ["event.title", "Event details heading", (c) => c.event.title],
  ["experience.title", "“What you can do” heading", (c) => c.experience.title],
  ["promo.title", "Promotions heading", (c) => c.promo.title],
  ["models.title", "Models heading", (c) => c.models.title],
  ["inquiry.title", "Inquiry heading", (c) => c.inquiry.title],
  ["faq.title", "FAQ heading", (c) => c.faq.title],
];

/**
 * Hal yang WAJIB beres sebelum tayang (publish ditolak bila ada). Draf boleh tidak lengkap.
 * Teks yang masih berisi penanda "[ ... ]" (placeholder template) juga dianggap belum beres.
 */
export function teaserIssues(t: Checkable): TeaserIssue[] {
  const out: TeaserIssue[] = [];
  if (!(t.endAt > t.startAt)) out.push({ path: "schedule", message: "End time must be after the start time" });
  if (!t.streetAddress) out.push({ path: "streetAddress", message: "Street address is empty" });
  if (!t.addressLocality) out.push({ path: "addressLocality", message: "City (address) is empty" });
  if (!t.models.length) out.push({ path: "models", message: "Choose at least one model to show" });
  for (const l of TEASER_LOCALES) {
    const c = t.content[l];
    const L = l.toUpperCase();
    for (const [path, label, get] of REQUIRED) if (!get(c)) out.push({ path: `content.${l}.${path}`, message: `${L}: ${label} is empty` });
    if (!c.promo.items.length) out.push({ path: `content.${l}.promo.items`, message: `${L}: add at least one promotion` });
    if (c.promo.items.some((p) => !p.title)) out.push({ path: `content.${l}.promo.items`, message: `${L}: a promotion has no title` });
    if (c.experience.items.some((p) => !p.title)) out.push({ path: `content.${l}.experience.items`, message: `${L}: an experience item has no title` });
    if (c.faq.items.some((f) => !f.q || !f.a)) out.push({ path: `content.${l}.faq.items`, message: `${L}: a FAQ item is missing its question or answer` });
    if (hasPlaceholder(c)) out.push({ path: `content.${l}`, message: `${L}: some text still contains a [placeholder]` });
  }
  return out;
}

/** "[ ... ]" = penanda teks contoh dari template yang belum diganti. */
const PLACEHOLDER_RE = /\[[^\]\n]{2,}\]/;
function hasPlaceholder(v: unknown): boolean {
  if (typeof v === "string") return PLACEHOLDER_RE.test(v);
  if (Array.isArray(v)) return v.some(hasPlaceholder);
  if (v && typeof v === "object") return Object.values(v).some(hasPlaceholder);
  return false;
}
