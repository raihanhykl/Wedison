// Builder metadata SEO locale-aware untuk routing /[locale].
// Menghasilkan canonical + hreflang (id/en/x-default) + OpenGraph per-locale.
import type { Metadata } from "next";
import { seoContent, type Locale } from "./seo-strings";

// Base URL dari env supaya domain testing (ssr.wedison.co) / staging tidak bocor
// jadi canonical. Set NEXT_PUBLIC_SITE_URL saat build per-environment.
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedison.co";
const SITE_NAME = "Wedison";

// trailingSlash:true -> semua URL kanonik diakhiri "/".
function localeUrl(locale: string, path: string): string {
  const base = `${SITE}/${locale}${path === "/" ? "" : path}`;
  return base.endsWith("/") ? base : `${base}/`;
}

type Args = {
  locale: Locale;
  /** Path locale-agnostic, mis. "/", "/victory", "/corporate/about". */
  path: string;
  // Override opsional untuk halaman dinamis (mis. news/[slug]) yang tidak ada di seoContent.
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
};

export function getSEOMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  image,
}: Args): Metadata {
  const content = seoContent[path];
  const t = title ?? content?.[locale].title ?? SITE_NAME;
  const d = description ?? content?.[locale].description ?? "";
  const kw = keywords ?? content?.[locale].keywords ?? [];
  const imgPath = image ?? content?.image ?? "/default-og.jpg";
  const ogImage = imgPath.startsWith("http") ? imgPath : `${SITE}${imgPath}`;

  return {
    title: t,
    description: d,
    keywords: kw.join(", "),
    alternates: {
      canonical: localeUrl(locale, path),
      languages: {
        id: localeUrl("id", path),
        en: localeUrl("en", path),
        "x-default": localeUrl("id", path),
      },
    },
    openGraph: {
      title: t,
      description: d,
      url: localeUrl(locale, path),
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
