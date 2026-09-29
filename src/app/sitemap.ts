import type { MetadataRoute } from "next";
import { seoContent } from "@/app/lib/seo-strings";
import { LOCALES } from "@/app/lib/locale";
import { PRESS_URLS } from "@public/data/press-urls";

// Sitemap multi-locale (menggantikan next-sitemap). Tiap path diemit untuk
// /id & /en, masing-masing dengan hreflang alternates (xhtml:link).
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedison.co";

function ts(u: string): string {
  return u.endsWith("/") ? u : `${u}/`;
}
function localeUrl(locale: string, path: string): string {
  return ts(`${SITE}/${locale}${path === "/" ? "" : path}`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...Object.keys(seoContent),
    ...PRESS_URLS.map((p) => `/media-center/news/${p.slug}`),
  ];

  return paths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: localeUrl(locale, path),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: {
          id: localeUrl("id", path),
          en: localeUrl("en", path),
        },
      },
    })),
  );
}
