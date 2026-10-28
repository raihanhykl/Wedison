// Mirror teaserIssues() di server/src/modules/teasers/teaser.schema.ts: checklist "siap tayang"
// yang dihitung langsung di editor. Server tetap penentu akhir (publish ditolak bila ada isu).

import type { TeaserContent, TeaserLocale } from "./teaser";

export type TeaserIssue = { path: string; message: string };

type Checkable = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  streetAddress: string;
  addressLocality: string;
  models: readonly string[];
  content: Record<TeaserLocale, TeaserContent>;
};

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

const PLACEHOLDER_RE = /\[[^\]\n]{2,}\]/;

/** Daftar teks yang masih berisi penanda "[ … ]" (contoh dari template), untuk ditunjukkan ke admin. */
export function placeholders(v: unknown, path = ""): string[] {
  if (typeof v === "string") return PLACEHOLDER_RE.test(v) ? [path] : [];
  if (Array.isArray(v)) return v.flatMap((x, i) => placeholders(x, `${path}.${i}`));
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => placeholders(x, path ? `${path}.${k}` : k));
  return [];
}

export function teaserIssues(t: Checkable): TeaserIssue[] {
  const out: TeaserIssue[] = [];
  const start = `${t.startDate}T${t.startTime}`;
  const end = `${t.endDate}T${t.endTime}`;
  if (!t.startDate || !t.endDate || !(end > start)) out.push({ path: "schedule", message: "End time must be after the start time" });
  if (!t.streetAddress.trim()) out.push({ path: "streetAddress", message: "Street address is empty" });
  if (!t.addressLocality.trim()) out.push({ path: "addressLocality", message: "City (address) is empty" });
  if (!t.models.length) out.push({ path: "models", message: "Choose at least one model to show" });
  for (const l of ["id", "en"] as TeaserLocale[]) {
    const c = t.content[l];
    const L = l.toUpperCase();
    for (const [path, label, get] of REQUIRED) if (!get(c).trim()) out.push({ path: `content.${l}.${path}`, message: `${L}: ${label} is empty` });
    if (!c.promo.items.length) out.push({ path: `content.${l}.promo.items`, message: `${L}: add at least one promotion` });
    if (c.promo.items.some((p) => !p.title.trim())) out.push({ path: `content.${l}.promo.items`, message: `${L}: a promotion has no title` });
    if (c.experience.items.some((p) => !p.title.trim())) out.push({ path: `content.${l}.experience.items`, message: `${L}: an item in “What you can do” has no title` });
    if (c.faq.items.some((f) => !f.q.trim() || !f.a.trim())) out.push({ path: `content.${l}.faq.items`, message: `${L}: a FAQ item is missing its question or answer` });
    const ph = placeholders(c);
    if (ph.length) out.push({ path: `content.${l}.${ph[0]}`, message: `${L}: ${ph.length} text${ph.length > 1 ? "s" : ""} still contain a [placeholder]` });
  }
  return out;
}

/** Tab editor tempat sebuah isu diperbaiki. */
export function issueTab(path: string): "event" | "text" | "images" | "seo" {
  if (path.startsWith("content.") && path.split(".")[2] === "seo") return "seo";
  if (path.startsWith("content.")) return "text";
  return "event";
}
