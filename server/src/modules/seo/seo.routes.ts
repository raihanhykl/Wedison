import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { requireAuth, requireModule, requireWrite } from "../../middleware/auth.js";
import { env } from "../../config/env.js";
import { runSiteAudit, type SiteAudit, type SiteAuditContext } from "../../lib/site-audit.js";
import { analyzeContent, type ContentScore } from "../../lib/content-score.js";
import { logActivity } from "../../lib/activity.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";
import { badRequest } from "../../lib/errors.js";
import { rescoreArticle } from "../../lib/content-score-db.js";

const SETTING_KEY = "site_audit";

export const seoRouter = Router();
seoRouter.use(requireAuth, requireModule("cms"));

/** Aggregate article scores from stored contentScore (published + indexable). */
async function articleContext(): Promise<SiteAuditContext["articles"]> {
  const since = new Date(Date.now() - 90 * 86400000);
  const rows = await prisma.article.findMany({
    where: { deletedAt: null, status: "PUBLISHED", noIndex: false },
    select: { publishedAt: true, authorId: true, translations: { select: { locale: true, contentScore: true } } },
  });
  const scores = rows
    .map((r) => (r.translations.find((t) => t.locale === "id") ?? r.translations[0])?.contentScore as ContentScore | null | undefined)
    .filter((s): s is ContentScore => !!s && typeof s === "object" && "seo" in s);
  const avg = (k: "seo" | "aeo" | "geo") => (scores.length ? Math.round(scores.reduce((a, s) => a + s[k].score, 0) / scores.length) : null);
  return {
    published: rows.length,
    publishedLast90d: rows.filter((r) => r.publishedAt && r.publishedAt >= since).length,
    withAuthor: rows.filter((r) => r.authorId).length,
    avgSeo: avg("seo"),
    avgAeo: avg("aeo"),
    avgGeo: avg("geo"),
  };
}

async function lastAudit(): Promise<SiteAudit | null> {
  const row = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
  return (row?.value as SiteAudit | null) ?? null;
}

let running: Promise<SiteAudit> | null = null;

// Last stored site audit + article aggregates (cheap; used by the SEO page and dashboard).
seoRouter.get("/overview", async (_req, res, next) => {
  try {
    const data = await cached("admin:seo:overview", [CacheTags.dashboard, CacheTags.articles], async () => {
      const [site, articles] = await Promise.all([lastAudit(), articleContext()]);
      // Per-article summary for the "needs attention" list
      const rows = await prisma.article.findMany({
        where: { deletedAt: null, status: { in: ["PUBLISHED", "SCHEDULED", "DRAFT"] } },
        select: { id: true, status: true, updatedAt: true, translations: { select: { locale: true, title: true, contentScore: true } } },
        orderBy: { updatedAt: "desc" },
        take: 200,
      });
      const articleScores = rows
        .map((r) => {
          const t = r.translations.find((x) => x.locale === "id") ?? r.translations[0];
          const s = t?.contentScore as ContentScore | null | undefined;
          if (!t || !s || typeof s !== "object" || !("seo" in s)) return null;
          return { id: r.id, status: r.status, title: t.title, seo: s.seo.score, aeo: s.aeo.score, geo: s.geo.score, overall: s.overall, updatedAt: r.updatedAt };
        })
        .filter((x): x is NonNullable<typeof x> => !!x)
        .sort((a, b) => a.overall - b.overall);
      return { site: site ? { ...site, pages: undefined } : null, articles, attention: articleScores.slice(0, 8), running: !!running };
    }, 60);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

seoRouter.get("/site", async (_req, res, next) => {
  try {
    const site = await lastAudit();
    res.json({ ok: true, data: site, running: !!running });
  } catch (e) {
    next(e);
  }
});

// Run a fresh crawl (takes ~10–40 s). Concurrent requests share the same run.
seoRouter.post("/site/run", requireWrite("cms"), async (req, res, next) => {
  try {
    const base = (req.body?.baseUrl as string | undefined) ?? env.SITE_AUDIT_URL ?? env.FRONTEND_URL;
    if (!/^https?:\/\//.test(base)) throw badRequest("Invalid base URL");
    if (!running) {
      running = (async () => {
        const ctx: SiteAuditContext = { articles: await articleContext() };
        const audit = await runSiteAudit(base, ctx);
        await prisma.setting.upsert({ where: { key: SETTING_KEY }, update: { value: audit as object }, create: { key: SETTING_KEY, value: audit as object } });
        invalidate([CacheTags.dashboard], { notifyFrontend: false });
        return audit;
      })().finally(() => {
        running = null;
      });
    }
    const audit = await running;
    logActivity(req, { action: "audit", entity: "seo", summary: `Ran site audit (${audit.pagesCrawled} pages, overall ${audit.overall})` });
    res.json({ ok: true, data: audit });
  } catch (e) {
    next(e);
  }
});

// Stateless analysis of an article draft (used live by the editor).
seoRouter.post("/analyze", async (req, res, next) => {
  try {
    const b = req.body ?? {};
    if (typeof b.contentHtml !== "string" || typeof b.title !== "string") throw badRequest("title and contentHtml are required");
    const data = analyzeContent({
      locale: b.locale === "en" ? "en" : "id",
      title: b.title,
      slug: b.slug ?? null,
      excerpt: b.excerpt ?? null,
      contentHtml: b.contentHtml,
      seoTitle: b.seoTitle ?? null,
      seoDescription: b.seoDescription ?? null,
      seoKeywords: b.seoKeywords ?? null,
      canonicalUrl: b.canonicalUrl ?? null,
      ogTitle: b.ogTitle ?? null,
      ogDescription: b.ogDescription ?? null,
      coverImage: b.coverImage ?? null,
      ogImage: b.ogImage ?? null,
      categoryName: b.categoryName ?? null,
      tags: Array.isArray(b.tags) ? b.tags.map(String) : [],
      authorName: b.authorName ?? req.user?.name ?? null,
      publishedAt: b.publishedAt ?? null,
      updatedAt: b.updatedAt ?? null,
      noIndex: !!b.noIndex,
      siteOrigin: env.SITE_AUDIT_PUBLIC_ORIGIN,
    });
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

// Recompute stored scores for all articles (after deploying new scoring rules).
seoRouter.post("/rescore", requireWrite("cms"), async (req, res, next) => {
  try {
    const ids = await prisma.article.findMany({ where: { deletedAt: null }, select: { id: true } });
    let translations = 0;
    for (const { id } of ids) translations += (await rescoreArticle(id)) ?? 0;
    invalidate([CacheTags.articles, CacheTags.dashboard], { notifyFrontend: false });
    logActivity(req, { action: "rescore", entity: "seo", summary: `Rescored ${ids.length} articles` });
    res.json({ ok: true, articles: ids.length, translations });
  } catch (e) {
    next(e);
  }
});
