import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { slugify, uniqueSlug } from "../../lib/slug.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";
import { logActivity } from "../../lib/activity.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";
import { sanitizeArticleHtml, stripHtml, readingTimeMinutes } from "../../lib/sanitize.js";
import { notFound, badRequest } from "../../lib/errors.js";
import { promoteScheduled } from "../../lib/scheduler.js";

const STATUS = z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]);
const LOCALE = z.enum(["id", "en"]);

const translationSchema = z.object({
  locale: LOCALE,
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().max(160).optional(),
  excerpt: z.string().trim().max(500).nullable().optional(),
  content: z.any(), // Tiptap JSON
  contentHtml: z.string().default(""),
  seoTitle: z.string().trim().max(70).nullable().optional(),
  seoDescription: z.string().trim().max(170).nullable().optional(),
  seoKeywords: z.string().trim().max(300).nullable().optional(),
  canonicalUrl: z.string().trim().url().nullable().optional().or(z.literal("").transform(() => null)),
  ogTitle: z.string().trim().max(100).nullable().optional(),
  ogDescription: z.string().trim().max(200).nullable().optional(),
});

const articleSchema = z.object({
  status: STATUS.default("DRAFT"),
  isFeatured: z.boolean().default(false),
  publishedAt: z.coerce.date().nullable().optional(),
  scheduledAt: z.coerce.date().nullable().optional(),
  coverImageId: z.string().nullable().optional(),
  ogImageId: z.string().nullable().optional(),
  noIndex: z.boolean().default(false),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).default([]),
  translations: z.array(translationSchema).min(1, "At least one language (ID) is required"),
});

const adminInclude = {
  coverImage: true,
  ogImage: true,
  category: true,
  tags: true,
  author: { select: { id: true, name: true, email: true, avatarUrl: true } },
  translations: true,
} satisfies Prisma.ArticleInclude;

async function buildTranslations(
  articleId: string | null,
  items: z.infer<typeof translationSchema>[],
) {
  const out: Prisma.ArticleTranslationCreateWithoutArticleInput[] = [];
  for (const t of items) {
    const html = sanitizeArticleHtml(t.contentHtml ?? "");
    const text = stripHtml(html);
    const slug = await uniqueSlug(t.slug || t.title, async (s) => {
      const found = await prisma.articleTranslation.findUnique({ where: { locale_slug: { locale: t.locale, slug: s } } });
      return !!found && found.articleId !== articleId;
    });
    out.push({
      locale: t.locale,
      title: t.title,
      slug,
      excerpt: t.excerpt ?? (text ? text.slice(0, 220) : null),
      content: (t.content ?? { type: "doc", content: [] }) as Prisma.InputJsonValue,
      contentHtml: html,
      seoTitle: t.seoTitle ?? null,
      seoDescription: t.seoDescription ?? null,
      seoKeywords: t.seoKeywords ?? null,
      canonicalUrl: t.canonicalUrl ?? null,
      ogTitle: t.ogTitle ?? null,
      ogDescription: t.ogDescription ?? null,
      readingTime: readingTimeMinutes(text),
    });
  }
  return out;
}

function resolvePublishedAt(data: { status: string; publishedAt?: Date | null; scheduledAt?: Date | null }, existing?: Date | null) {
  if (data.status === "PUBLISHED") return data.publishedAt ?? existing ?? new Date();
  if (data.status === "SCHEDULED") {
    if (!data.scheduledAt) throw badRequest("A schedule date is required for the Scheduled status");
    return data.scheduledAt;
  }
  return data.publishedAt ?? existing ?? null;
}

// ─── Admin ──────────────────────────────────────────────────────────────────
export const articlesRouter = Router();
articlesRouter.use(requireAuth);

const listQuery = paginationQuery.extend({
  status: STATUS.optional(),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  locale: LOCALE.optional(),
  trashed: z.coerce.boolean().default(false),
});

articlesRouter.get("/", validate(listQuery, "query"), async (req, res, next) => {
  try {
    await promoteScheduled();
    const q = getValidated<typeof listQuery>(req, "query");
    const where: Prisma.ArticleWhereInput = {
      deletedAt: q.trashed ? { not: null } : null,
      ...(q.status ? { status: q.status } : {}),
      ...(q.categoryId ? { categoryId: q.categoryId } : {}),
      ...(q.tagId ? { tags: { some: { id: q.tagId } } } : {}),
      ...(q.q ? { translations: { some: { title: { contains: q.q, mode: "insensitive" } } } } : {}),
    };
    const sortField = (["createdAt", "updatedAt", "publishedAt", "viewCount"] as const).includes(q.sort as never)
      ? (q.sort as "createdAt" | "updatedAt" | "publishedAt" | "viewCount")
      : "updatedAt";
    const [items, total] = await Promise.all([
      prisma.article.findMany({ where, include: adminInclude, orderBy: { [sortField]: q.order }, ...skipTake(q) }),
      prisma.article.count({ where }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q) });
  } catch (e) {
    next(e);
  }
});

articlesRouter.get("/:id", async (req, res, next) => {
  try {
    await promoteScheduled();
    const item = await prisma.article.findUnique({ where: { id: req.params.id as string }, include: adminInclude });
    if (!item) throw notFound("Article not found");
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

articlesRouter.post("/", requireRole("ADMIN", "EDITOR"), validate(articleSchema), async (req, res, next) => {
  try {
    const data = getValidated<typeof articleSchema>(req);
    const translations = await buildTranslations(null, data.translations);
    const item = await prisma.article.create({
      data: {
        status: data.status,
        isFeatured: data.isFeatured,
        publishedAt: resolvePublishedAt(data),
        scheduledAt: data.scheduledAt ?? null,
        coverImageId: data.coverImageId ?? null,
        ogImageId: data.ogImageId ?? null,
        noIndex: data.noIndex,
        categoryId: data.categoryId ?? null,
        authorId: req.user!.id,
        tags: { connect: data.tagIds.map((id) => ({ id })) },
        translations: { create: translations },
      },
      include: adminInclude,
    });
    invalidate([CacheTags.articles, CacheTags.dashboard]);
    logActivity(req, { action: "create", entity: "article", entityId: item.id, summary: `Created article "${translations[0].title}"` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

articlesRouter.put("/:id", requireRole("ADMIN", "EDITOR"), validate(articleSchema), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = getValidated<typeof articleSchema>(req);
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) throw notFound("Article not found");
    const translations = await buildTranslations(id, data.translations);
    const keepLocales = translations.map((t) => t.locale);

    const item = await prisma.$transaction(async (tx) => {
      await tx.articleTranslation.deleteMany({ where: { articleId: id, locale: { notIn: keepLocales } } });
      for (const t of translations) {
        await tx.articleTranslation.upsert({
          where: { articleId_locale: { articleId: id, locale: t.locale } },
          update: t,
          create: { ...t, articleId: id },
        });
      }
      return tx.article.update({
        where: { id },
        data: {
          status: data.status,
          isFeatured: data.isFeatured,
          publishedAt: resolvePublishedAt(data, existing.publishedAt),
          scheduledAt: data.scheduledAt ?? null,
          coverImageId: data.coverImageId ?? null,
          ogImageId: data.ogImageId ?? null,
          noIndex: data.noIndex,
          categoryId: data.categoryId ?? null,
          tags: { set: data.tagIds.map((tid) => ({ id: tid })) },
        },
        include: adminInclude,
      });
    });
    invalidate([CacheTags.articles, CacheTags.dashboard]);
    logActivity(req, { action: "update", entity: "article", entityId: id, summary: `Updated article "${translations[0].title}"` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

const statusSchema = z.object({ status: STATUS, scheduledAt: z.coerce.date().nullable().optional() });

articlesRouter.patch("/:id/status", requireRole("ADMIN", "EDITOR"), validate(statusSchema), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const { status, scheduledAt } = getValidated<typeof statusSchema>(req);
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) throw notFound("Article not found");
    const item = await prisma.article.update({
      where: { id },
      data: { status, scheduledAt: scheduledAt ?? existing.scheduledAt, publishedAt: resolvePublishedAt({ status, scheduledAt: scheduledAt ?? existing.scheduledAt }, existing.publishedAt) },
      include: adminInclude,
    });
    invalidate([CacheTags.articles, CacheTags.dashboard]);
    logActivity(req, { action: status === "PUBLISHED" ? "publish" : "update", entity: "article", entityId: id, summary: `Article status -> ${status}` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

const bulkSchema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(["publish", "draft", "archive", "trash", "restore", "delete"]),
});

articlesRouter.post("/bulk", requireRole("ADMIN", "EDITOR"), validate(bulkSchema), async (req, res, next) => {
  try {
    const { ids, action } = getValidated<typeof bulkSchema>(req);
    if (action === "delete" && req.user!.role === "EDITOR") throw badRequest("Editors cannot delete permanently");
    const where = { id: { in: ids } };
    let count = 0;
    switch (action) {
      case "publish": count = (await prisma.article.updateMany({ where, data: { status: "PUBLISHED", publishedAt: new Date() } })).count; break;
      case "draft": count = (await prisma.article.updateMany({ where, data: { status: "DRAFT" } })).count; break;
      case "archive": count = (await prisma.article.updateMany({ where, data: { status: "ARCHIVED" } })).count; break;
      case "trash": count = (await prisma.article.updateMany({ where, data: { deletedAt: new Date() } })).count; break;
      case "restore": count = (await prisma.article.updateMany({ where, data: { deletedAt: null } })).count; break;
      case "delete": count = (await prisma.article.deleteMany({ where })).count; break;
    }
    invalidate([CacheTags.articles, CacheTags.dashboard]);
    logActivity(req, { action, entity: "article", summary: `Bulk ${action} on ${count} articles`, meta: { ids } });
    res.json({ ok: true, count });
  } catch (e) {
    next(e);
  }
});

// soft delete -> tempat sampah; ?force=true hapus permanen (ADMIN)
articlesRouter.delete("/:id", requireRole("ADMIN", "EDITOR"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const force = req.query.force === "true";
    if (force && req.user!.role === "EDITOR") throw badRequest("Editors cannot delete permanently");
    if (force) await prisma.article.delete({ where: { id } });
    else await prisma.article.update({ where: { id }, data: { deletedAt: new Date() } });
    invalidate([CacheTags.articles, CacheTags.dashboard]);
    logActivity(req, { action: "delete", entity: "article", entityId: id, summary: force ? "Permanently deleted article" : "Moved article to trash" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

articlesRouter.post("/:id/restore", requireRole("ADMIN", "EDITOR"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    await prisma.article.update({ where: { id }, data: { deletedAt: null } });
    invalidate([CacheTags.articles, CacheTags.dashboard]);
    logActivity(req, { action: "restore", entity: "article", entityId: id, summary: "Restored article from trash" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ─── Publik ─────────────────────────────────────────────────────────────────
export const publicArticlesRouter = Router();

const publicQuery = z.object({
  locale: LOCALE.default("id"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().optional(),
  tag: z.string().optional(),
  featured: z.coerce.boolean().optional(),
});

function publicWhere(locale: "id" | "en", extra: Prisma.ArticleWhereInput = {}): Prisma.ArticleWhereInput {
  return {
    deletedAt: null,
    translations: { some: { locale } },
    OR: [
      { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      { status: "SCHEDULED", publishedAt: { lte: new Date() } }, // jadwal sudah lewat = tayang
    ],
    ...extra,
  };
}

function toPublic(a: Prisma.ArticleGetPayload<{ include: typeof adminInclude }>, locale: "id" | "en") {
  const t = a.translations.find((x) => x.locale === locale) ?? a.translations[0];
  return {
    id: a.id,
    slug: t.slug,
    locale: t.locale,
    title: t.title,
    excerpt: t.excerpt,
    readingTime: t.readingTime,
    seoTitle: t.seoTitle,
    seoDescription: t.seoDescription,
    seoKeywords: t.seoKeywords,
    canonicalUrl: t.canonicalUrl,
    ogTitle: t.ogTitle,
    ogDescription: t.ogDescription,
    noIndex: a.noIndex,
    ogImage: a.ogImage ? { url: a.ogImage.url, alt: a.ogImage.alt, width: a.ogImage.width, height: a.ogImage.height } : null,
    updatedAt: a.updatedAt,
    publishedAt: a.publishedAt,
    isFeatured: a.isFeatured,
    coverImage: a.coverImage ? { url: a.coverImage.url, alt: a.coverImage.alt, width: a.coverImage.width, height: a.coverImage.height } : null,
    category: a.category ? { slug: a.category.slug, name: locale === "en" ? (a.category.nameEn ?? a.category.nameId) : a.category.nameId } : null,
    tags: a.tags.map((x) => ({ slug: x.slug, name: x.name })),
    author: a.author ? { name: a.author.name, avatarUrl: a.author.avatarUrl } : null,
    availableLocales: a.translations.map((x) => ({ locale: x.locale, slug: x.slug })),
  };
}

publicArticlesRouter.get("/", validate(publicQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof publicQuery>(req, "query");
    const key = `public:articles:${JSON.stringify(q)}`;
    const data = await cached(key, [CacheTags.articles], async () => {
      const where = publicWhere(q.locale, {
        ...(q.category ? { category: { slug: q.category } } : {}),
        ...(q.tag ? { tags: { some: { slug: q.tag } } } : {}),
        ...(q.featured !== undefined ? { isFeatured: q.featured } : {}),
      });
      const [items, total] = await Promise.all([
        prisma.article.findMany({ where, include: adminInclude, orderBy: { publishedAt: "desc" }, ...skipTake(q) }),
        prisma.article.count({ where }),
      ]);
      return paginate(items.map((a) => toPublic(a, q.locale)), total, q);
    });
    res.json({ ok: true, ...data });
  } catch (e) {
    next(e);
  }
});

publicArticlesRouter.get("/:slug", async (req, res, next) => {
  try {
    const locale = LOCALE.catch("id").parse(req.query.locale);
    const slug = req.params.slug as string;
    const key = `public:article:${locale}:${slug}`;
    const data = await cached(key, [CacheTags.articles], async () => {
      const t = await prisma.articleTranslation.findUnique({
        where: { locale_slug: { locale, slug } },
        include: { article: { include: adminInclude } },
      });
      if (!t) return null;
      const a = t.article;
      const visible = a.deletedAt === null && (a.status === "PUBLISHED" || a.status === "SCHEDULED") && !!a.publishedAt && a.publishedAt <= new Date();
      if (!visible) return null;
      return { ...toPublic(a, locale), contentHtml: t.contentHtml };
    });
    if (!data) throw notFound("Article not found");
    // view count: fire-and-forget, tidak ikut cache
    prisma.article.update({ where: { id: data.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});
