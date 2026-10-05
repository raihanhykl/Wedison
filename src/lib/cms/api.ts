/**
 * Client CMS untuk halaman PUBLIK (Server Components). Memanggil backend Express langsung
 * (API_INTERNAL_URL) dengan cache Next.js bertag: `revalidate` sebagai jaring pengaman +
 * on-demand revalidate lewat webhook /api/revalidate ketika admin mengubah data.
 * Semua fungsi "fail-soft": backend mati -> kembalikan data kosong, halaman tetap render.
 */
import "server-only";
import type { SiteCollection } from "@/app/[locale]/super-charge/locations/types";

const API = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:4000";
const REVALIDATE = Number(process.env.CMS_REVALIDATE_SECONDS ?? 300);

export type Locale = "id" | "en";

export type PublicArticle = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string | null;
  readingTime: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  noIndex: boolean;
  ogImage: { url: string; alt: string | null; width: number | null; height: number | null } | null;
  updatedAt: string;
  publishedAt: string | null;
  isFeatured: boolean;
  coverImage: { url: string; alt: string | null; width: number | null; height: number | null } | null;
  category: { slug: string; name: string } | null;
  tags: { slug: string; name: string }[];
  author: { name: string; avatarUrl: string | null } | null;
  availableLocales: { locale: Locale; slug: string }[];
  contentHtml?: string;
};

export type PublicPress = {
  id: string;
  slug: string;
  url: string;
  title: string;
  excerpt: string | null;
  description: string | null;
  imageUrl: string | null;
  siteName: string | null;
  author: string | null;
  publishedAt: string | null;
};

export type PublicSocial = {
  id: string;
  platform: string;
  url: string;
  caption: string | null;
  thumbnailUrl: string | null;
  publishedAt: string | null;
};

export type Paginated<T> = { items: T[]; meta: { page: number; limit: number; total: number; totalPages: number } };

async function get<T>(path: string, tags: string[], fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: REVALIDATE, tags },
      headers: { accept: "application/json" },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

const emptyPage = { items: [], meta: { page: 1, limit: 0, total: 0, totalPages: 1 } };

export async function getArticles(params: { locale: Locale; page?: number; limit?: number; category?: string; tag?: string; featured?: boolean }) {
  const q = new URLSearchParams({ locale: params.locale });
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.category) q.set("category", params.category);
  if (params.tag) q.set("tag", params.tag);
  if (params.featured !== undefined) q.set("featured", String(params.featured));
  return get<Paginated<PublicArticle>>(`/api/v1/public/articles?${q}`, ["articles"], emptyPage);
}

export async function getArticle(locale: Locale, slug: string) {
  const res = await get<{ ok: boolean; data: PublicArticle } | null>(
    `/api/v1/public/articles/${encodeURIComponent(slug)}?locale=${locale}`,
    ["articles"],
    null,
  );
  return res?.ok ? res.data : null;
}

export async function getPress(limit = 50) {
  const res = await get<{ items: PublicPress[] }>(`/api/v1/public/press?limit=${limit}`, ["press"], { items: [] });
  return res.items;
}

export async function getPressBySlug(slug: string) {
  const res = await get<{ ok: boolean; data: PublicPress } | null>(`/api/v1/public/press/${encodeURIComponent(slug)}`, ["press"], null);
  return res?.ok ? res.data : null;
}

export async function getSocialPosts(limit = 12) {
  const res = await get<{ items: PublicSocial[] }>(`/api/v1/public/social?limit=${limit}`, ["social"], { items: [] });
  return res.items;
}

export async function getStations(): Promise<SiteCollection | null> {
  const res = await get<SiteCollection | null>(`/api/v1/public/stations`, ["stations"], null);
  return res && res.type === "FeatureCollection" ? res : null;
}

// ─── Careers (modul HR) ─────────────────────────────────────────────────────
export type PublicJob = {
  id: string;
  slug: string;
  status: "PUBLISHED" | "CLOSED";
  locale: Locale;
  title: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  niceToHave: string[];
  benefits: string[];
  department: { slug: string; name: string } | null;
  locations: { slug: string; city: string; province: string | null; country: string; countryCode: string }[];
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
  workplaceType: "ONSITE" | "HYBRID" | "REMOTE";
  experienceLevel: "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "MANAGER" | null;
  openings: number;
  salary: { min: number | null; max: number | null; currency: string } | null;
  isUrgent: boolean;
  applyEmail: string | null;
  portals: { name: string; url: string }[];
  publishedAt: string | null;
  closesAt: string | null;
  updatedAt: string;
};

export type CareerSettings = {
  contactName: string;
  contactEmail: string;
  ccEmail: string | null;
  phone: string | null;
  whatsapp: string | null;
  emailSubject: string;
  applicationNote: string | null;
  openApplicationEnabled: boolean;
  companyPortals: { name: string; url: string }[];
};

export type CareersResponse = {
  items: PublicJob[];
  filters: {
    departments: { slug: string; name: string }[];
    locations: { slug: string; city: string; country: string; countryCode: string }[];
  };
  settings: CareerSettings;
};

/** null = backend unreachable (the page then falls back to the legacy static list). */
export async function getCareers(locale: Locale): Promise<CareersResponse | null> {
  const res = await get<(CareersResponse & { ok: boolean }) | null>(`/api/v1/public/careers?locale=${locale}`, ["jobs"], null);
  return res?.ok ? { items: res.items, filters: res.filters, settings: res.settings } : null;
}

export async function getCareer(locale: Locale, slug: string) {
  const res = await get<{ ok: boolean; data: { job: PublicJob; settings: CareerSettings } } | null>(
    `/api/v1/public/careers/${encodeURIComponent(slug)}?locale=${locale}`,
    ["jobs"],
    null,
  );
  return res?.ok ? res.data : null;
}
