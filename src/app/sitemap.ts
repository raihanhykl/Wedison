import type { MetadataRoute } from "next";
import { seoContent } from "@/app/lib/seo-strings";
import { LOCALES, type Locale } from "@/app/lib/locale";
import { PRESS_URLS } from "@public/data/press-urls";
import { getArticles, getPress } from "@/lib/cms/api";
import { localeUrl } from "@/lib/seo/site";

// Sitemap multi-locale. Halaman statis dari seoContent (id + en dengan hreflang), liputan pers
// (hanya /id — kontennya berbahasa Indonesia dan versi /en di-canonical-kan ke /id), dan artikel
// CMS per locale (hanya yang terindeks). Disegarkan tiap jam + webhook revalidate ("articles").
export const revalidate = 3600;

const BUILD_TIME = new Date();

function alternates(path: string, locales: readonly Locale[] = LOCALES) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localeUrl(l, path);
  languages["x-default"] = languages.id ?? languages[locales[0]];
  return { languages };
}

async function articleEntries(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    let page = 1;
    let totalPages = 1;
    do {
      const res = await getArticles({ locale, page, limit: 50 });
      totalPages = res.meta.totalPages || 1;
      for (const a of res.items) {
        if (a.noIndex) continue;
        const path = `/media-center/articles/${a.slug}`;
        const languages: Record<string, string> = {};
        for (const l of a.availableLocales) {
          languages[l.locale] = localeUrl(l.locale, `/media-center/articles/${l.slug}`);
        }
        languages["x-default"] = languages.id ?? localeUrl(locale, path);
        const modified = a.updatedAt ?? a.publishedAt;
        out.push({
          url: localeUrl(locale, path),
          lastModified: modified ? new Date(modified) : undefined,
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: { languages },
        });
      }
      page += 1;
    } while (page <= totalPages && page <= 20);
  }
  return out;
}

async function pressEntries(): Promise<MetadataRoute.Sitemap> {
  const press = await getPress(100);
  const items = press.length
    ? press.map((p) => ({ slug: p.slug, date: p.publishedAt ?? undefined }))
    : PRESS_URLS.map((p) => ({ slug: p.slug, date: undefined as string | undefined }));
  return items.map(({ slug, date }) => {
    const path = `/media-center/news/${slug}`;
    return {
      url: localeUrl("id", path),
      lastModified: date ? new Date(date) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: alternates(path, ["id"]),
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = Object.entries(seoContent).flatMap(([path, seo]) =>
    LOCALES.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: BUILD_TIME,
      changeFrequency: seo.changeFrequency ?? "monthly",
      priority: seo.priority ?? 0.5,
      alternates: alternates(path),
    })),
  );

  const [press, articles] = await Promise.all([pressEntries(), articleEntries()]);
  return [...staticEntries, ...press, ...articles];
}
