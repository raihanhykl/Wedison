// State editor teaser + konversi ke payload API. Jadwal diedit dalam zona waktu SHOWROOM
// (bukan zona browser admin), sama seperti yang disimpan server.

import { CONTACT } from "@/lib/seo/site";
import { cloneTemplate } from "@/lib/teasers/template";
import {
  IMAGE_SLOTS, MODEL_KEYS, teaserFacts,
  type ImageSlot, type ModelKey, type TeaserContent, type TeaserFacts, type TeaserLocale,
} from "@/lib/teasers/teaser";
import type { AdminTeaser } from "@/lib/admin/types";

export type TeaserFormState = {
  slug: string;
  city: string;
  showroomName: string;
  noIndex: boolean;
  timeZone: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  showCountdown: boolean;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  mapsUrl: string;
  whatsapp: string;
  email: string;
  models: ModelKey[];
  images: Record<ImageSlot, string | null>;
  content: Record<TeaserLocale, TeaserContent>;
};

const ymdPlusDays = (days: number) => {
  const d = new Date(Date.now() + days * 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function initialState(t?: AdminTeaser): TeaserFormState {
  const emptyImages = Object.fromEntries(IMAGE_SLOTS.map((k) => [k, null])) as Record<ImageSlot, string | null>;
  if (!t) {
    const date = ymdPlusDays(30);
    return {
      slug: "",
      city: "",
      showroomName: "",
      noIndex: false,
      timeZone: "Asia/Jakarta",
      startDate: date,
      startTime: "10:00",
      endDate: date,
      endTime: "17:00",
      showCountdown: true,
      streetAddress: "",
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      mapsUrl: "",
      whatsapp: CONTACT.whatsapp,
      email: CONTACT.email,
      models: [...MODEL_KEYS],
      images: emptyImages,
      content: cloneTemplate(),
    };
  }
  return {
    slug: t.slug,
    city: t.city,
    showroomName: t.showroomName,
    noIndex: t.noIndex,
    timeZone: t.timeZone,
    startDate: t.startDate,
    startTime: t.startTime,
    endDate: t.endDate,
    endTime: t.endTime,
    showCountdown: t.showCountdown,
    streetAddress: t.streetAddress,
    addressLocality: t.addressLocality,
    addressRegion: t.addressRegion,
    postalCode: t.postalCode,
    mapsUrl: t.mapsUrl ?? "",
    whatsapp: t.whatsapp,
    email: t.email,
    models: t.models,
    images: { ...emptyImages, ...t.images } as Record<ImageSlot, string | null>,
    content: structuredClone(t.content),
  };
}

const trimDeep = <T,>(v: T): T => {
  if (typeof v === "string") return v.trim() as T;
  if (Array.isArray(v)) return v.map(trimDeep) as T;
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, trimDeep(x)])) as T;
  return v;
};

export function toPayload(s: TeaserFormState) {
  return trimDeep({ ...s, mapsUrl: s.mapsUrl.trim() || null });
}

/** Tanggal+jam lokal di zona `timeZone` -> ISO UTC (zona Indonesia tanpa DST). null = input belum lengkap. */
export function zonedIso(ymd: string, hhmm: string, timeZone: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd) || !/^\d{2}:\d{2}$/.test(hhmm)) return null;
  const [y, mo, d] = ymd.split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi, 0);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(guess));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const wall = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), 0);
  return new Date(guess - (wall - guess)).toISOString();
}

/** Nilai token ({date}, {time}, …) dari isi form saat ini, untuk pratinjau teks. */
export function formFacts(s: TeaserFormState, locale: TeaserLocale): TeaserFacts {
  const startAt = zonedIso(s.startDate, s.startTime, s.timeZone);
  const endAt = zonedIso(s.endDate, s.endTime, s.timeZone);
  const address = { streetAddress: s.streetAddress, addressLocality: s.addressLocality, addressRegion: s.addressRegion, postalCode: s.postalCode };
  const base = { city: s.city || "[city]", showroomName: s.showroomName || "[showroom]", timeZone: s.timeZone, address };
  if (!startAt || !endAt) return { city: base.city, showroom: base.showroomName, date: "[date]", time: "[time]", address: "" };
  const f = teaserFacts({ ...base, startAt, endAt }, locale);
  return { ...f, address: f.address || "[address]" };
}

/** Nomor WA yang akan disimpan server (0852… -> 62852…), untuk ditampilkan. */
export function normalizeWhatsapp(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

/** Props bersama tab-tab editor. */
export type EditorProps = {
  s: TeaserFormState;
  set: <K extends keyof TeaserFormState>(key: K, value: TeaserFormState[K]) => void;
  /** ubah konten satu bahasa (draf hasil structuredClone, boleh dimutasi) */
  edit: (locale: TeaserLocale, fn: (c: TeaserContent) => void) => void;
  readOnly: boolean;
  facts: Record<TeaserLocale, TeaserFacts>;
  /** id teaser (edit) untuk cek slug; undefined = teaser baru */
  teaserId?: string;
};
