// Konstanta situs untuk SEO/GEO: origin kanonik, mode noindex, identitas organisasi.
// Dipakai oleh metadata (seo1.ts), robots.ts, sitemap.ts, llms.txt, dan JSON-LD.
// Semua nilai NEXT_PUBLIC_* di-inline saat build per environment (lihat .github/workflows).

import { LOCALES, type Locale } from "@/app/lib/locale";

function trimSlash(u: string) {
  return u.replace(/\/+$/, "");
}

export const SITE_URL = trimSlash(process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedison.co");
export const SITE_NAME = "Wedison";
export const PRODUCTION_HOST = "wedison.co";

function hostOf(u: string): string {
  try {
    return new URL(u).hostname;
  } catch {
    return "";
  }
}

/** true hanya bila build ditujukan untuk domain produksi (wedison.co). */
export const IS_PRODUCTION_SITE = hostOf(SITE_URL) === PRODUCTION_HOST;

/**
 * Mode noindex: staging (ssr.wedison.tech), preview, dan dev TIDAK boleh diindeks agar
 * tidak bersaing dengan wedison.co (duplicate content). Override eksplisit lewat
 * NEXT_PUBLIC_ROBOTS_NOINDEX=true|false; default = noindex kecuali domain produksi.
 */
export const NOINDEX =
  process.env.NEXT_PUBLIC_ROBOTS_NOINDEX === "true" ||
  (process.env.NEXT_PUBLIC_ROBOTS_NOINDEX !== "false" && !IS_PRODUCTION_SITE);

/**
 * Mode audit staging (sementara): bila diisi (mis. "Screaming Frog SEO Spider"), robots.txt
 * hanya mengizinkan user-agent ini; semua crawler lain (Googlebot, Bing, AI) tetap Disallow: /.
 * Dipakai bersama NEXT_PUBLIC_ROBOTS_NOINDEX=false lewat workflow_dispatch deploy-ssr.yml.
 */
export const ROBOTS_ALLOW_ONLY = (process.env.NEXT_PUBLIC_ROBOTS_ALLOW_ONLY ?? "").trim();

/** Absolutkan path relatif ke origin situs. URL absolut diteruskan apa adanya. */
export function absUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** URL kanonik per locale; trailingSlash:true -> selalu diakhiri "/". */
export function localeUrl(locale: string, path: string): string {
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  return `${SITE_URL}/${locale}${clean}/`;
}

export function isSupportedLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/wedison.id/",
  "https://www.tiktok.com/@wedison.id",
  "https://www.youtube.com/channel/UCePP1fIil61GyQF4XFWGB2g",
  "https://www.facebook.com/people/wedisonid/61562726390879/",
] as const;

export const CONTACT = {
  /** format tampilan */
  phoneDisplay: "(+62) 852-8612-6550",
  /** format E.164 untuk tel: dan schema */
  phoneE164: "+6285286126550",
  whatsapp: "6285286126550",
  email: "support@wedison.co",
  hrEmail: "hr@wedison.co",
} as const;

/** Werigo: layanan sewa motor listrik Wedison di Bali (situs & brand terpisah). */
export const WERIGO_URL = "https://werigo.co";

/** Tautan WhatsApp kontak utama (opsional dengan pesan pembuka). Satu sumber untuk semua CTA WA umum. */
export const whatsappUrl = (text?: string) =>
  `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** Kantor pusat = showroom Jakarta (Pondok Indah). */
export const HQ_ADDRESS = {
  streetAddress: "Jl. Arteri Pondok Indah No. 30 A-C, Kebayoran Lama Selatan",
  addressLocality: "Jakarta Selatan",
  addressRegion: "DKI Jakarta",
  postalCode: "12240",
  addressCountry: "ID",
} as const;

export const ORG_DESCRIPTION: Record<Locale, string> = {
  id: "Wedison adalah perusahaan motor listrik pengisian cepat pertama di Indonesia: motor listrik Athena, Bees, Victory, EdPower, dan jaringan pengisian SuperCharge (10% ke 80% dalam 15 menit).",
  en: "Wedison is Indonesia's first fast-charging electric motorcycle company: the Athena, Bees, Victory and EdPower electric motorcycles plus the SuperCharge charging network (10% to 80% in 15 minutes).",
};

export const LOGO_URL = `${SITE_URL}/logo/wedison-logo.png`;
export const DEFAULT_OG_IMAGE = "/og/default.jpg";
