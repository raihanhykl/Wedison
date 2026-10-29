import { prisma } from "./prisma.js";
import { analyzeContent } from "./content-score.js";
import { env } from "../config/env.js";

/**
 * Recompute and store the SEO/AEO/GEO score of every translation of an article.
 * Called after create/update (cheap: pure string analysis) and by the bulk rescore endpoint.
 */
export async function rescoreArticle(articleId: string) {
  const a = await prisma.article.findUnique({
    where: { id: articleId },
    include: { coverImage: true, ogImage: true, category: true, tags: true, author: true, translations: true },
  });
  if (!a) return null;
  for (const t of a.translations) {
    const score = analyzeContent({
      locale: t.locale,
      title: t.title,
      slug: t.slug,
      excerpt: t.excerpt,
      contentHtml: t.contentHtml,
      seoTitle: t.seoTitle,
      seoDescription: t.seoDescription,
      seoKeywords: t.seoKeywords,
      canonicalUrl: t.canonicalUrl,
      ogTitle: t.ogTitle,
      ogDescription: t.ogDescription,
      coverImage: a.coverImage ? { url: a.coverImage.url, alt: a.coverImage.alt } : null,
      ogImage: a.ogImage ? { url: a.ogImage.url, alt: a.ogImage.alt } : null,
      categoryName: t.locale === "en" ? (a.category?.nameEn ?? a.category?.nameId ?? null) : (a.category?.nameId ?? null),
      tags: a.tags.map((x) => x.name),
      authorName: a.author?.name ?? null,
      publishedAt: a.publishedAt,
      updatedAt: a.updatedAt,
      noIndex: a.noIndex,
      siteOrigin: env.SITE_AUDIT_PUBLIC_ORIGIN,
    });
    // Skor = data turunan, bukan suntingan: SQL langsung agar `updatedAt` terjemahan tidak bergeser
    // (mis. saat "Rescore all" di SEO & AI Readiness).
    await prisma.$executeRaw`UPDATE "ArticleTranslation" SET "contentScore" = ${JSON.stringify(score)}::jsonb WHERE "id" = ${t.id}`;
  }
  return a.translations.length;
}
