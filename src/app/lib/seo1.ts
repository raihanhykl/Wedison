// Builder metadata SEO locale-aware untuk routing /[locale].
// Menghasilkan title/description, canonical + hreflang (id/en/x-default), OpenGraph/Twitter,
// dan directive robots (noindex otomatis di staging/preview, lihat src/lib/seo/site.ts).
import type { Metadata } from "next";
import { seoContent, type Locale } from "./seo-strings";
import { DEFAULT_OG_IMAGE, NOINDEX, SITE_NAME, absUrl, localeUrl } from "@/lib/seo/site";

type Args = {
  locale: Locale;
  /** Path locale-agnostic, mis. "/", "/products/victory", "/corporate/about". */
  path: string;
  // Override opsional untuk halaman dinamis (mis. news/[slug]) yang tidak ada di seoContent.
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  /** Locale yang benar-benar tersedia untuk halaman ini (default: semua). */
  availableLocales?: Locale[];
  /**
   * Locale kanonik: bila konten kedua locale sebenarnya identik (mis. liputan pers
   * berbahasa Indonesia), canonical semua versi menunjuk ke locale ini.
   */
  canonicalLocale?: Locale;
  /** noindex khusus halaman (mis. artikel CMS yang ditandai noIndex). */
  noIndex?: boolean;
};

export const ROBOTS_INDEX: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const ROBOTS_NOINDEX: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
};

export function robotsFor(noIndex?: boolean): NonNullable<Metadata["robots"]> {
  return NOINDEX || noIndex ? ROBOTS_NOINDEX : ROBOTS_INDEX;
}

export function getSEOMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  image,
  availableLocales,
  canonicalLocale,
  noIndex,
}: Args): Metadata {
  const content = seoContent[path];
  const t = title ?? content?.[locale].title ?? SITE_NAME;
  const d = description ?? content?.[locale].description ?? "";
  const kw = keywords ?? content?.[locale].keywords ?? [];
  const ogImage = absUrl(image ?? content?.image ?? DEFAULT_OG_IMAGE);

  const locales = availableLocales ?? (["id", "en"] as Locale[]);
  const canonicalLoc = canonicalLocale ?? locale;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localeUrl(l, path);
  // x-default = versi bahasa Indonesia (pasar utama), atau locale pertama yang tersedia.
  languages["x-default"] = languages.id ?? languages[locales[0]];

  return {
    title: t,
    description: d,
    keywords: kw.length ? kw.join(", ") : undefined,
    robots: robotsFor(noIndex),
    alternates: {
      canonical: localeUrl(canonicalLoc, path),
      // Bila kedua versi identik, hreflang cukup ke versi kanonik saja (hindari sinyal ganda).
      languages: canonicalLocale
        ? {
            [canonicalLocale]: localeUrl(canonicalLocale, path),
            "x-default": localeUrl(canonicalLocale, path),
          }
        : languages,
    },
    openGraph: {
      title: t,
      description: d,
      url: localeUrl(canonicalLoc, path),
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: t }],
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? ["en_US"] : ["id_ID"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t,
      description: d,
      images: [ogImage],
    },
  };
}
