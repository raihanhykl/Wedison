import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { uniqueSlug, slugify } from "../../lib/slug.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";
import { logActivity } from "../../lib/activity.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";
import { fetchPageMetadata } from "../../lib/metadata.js";
import { badRequest, notFound } from "../../lib/errors.js";

const STATUS = z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]);

const pressSchema = z.object({
  url: z.string().url(),
  title: z.string().trim().min(3).max(300),
  slug: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().max(2000).nullable().optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  imageUrl: z.string().trim().max(1000).nullable().optional(),
  siteName: z.string().trim().max(120).nullable().optional(),
  author: z.string().trim().max(120).nullable().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  status: STATUS.default("PUBLISHED"),
  sortOrder: z.coerce.number().int().default(0),
});

export const pressRouter = Router();
pressRouter.use(requireAuth);

const listQuery = paginationQuery.extend({ status: STATUS.optional() });

pressRouter.get("/", validate(listQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof listQuery>(req, "query");
    const where: Prisma.PressCoverageWhereInput = {
      ...(q.status ? { status: q.status } : {}),
      ...(q.q ? { OR: [{ title: { contains: q.q, mode: "insensitive" } }, { siteName: { contains: q.q, mode: "insensitive" } }] } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.pressCoverage.findMany({ where, orderBy: [{ publishedAt: q.order }, { createdAt: "desc" }], ...skipTake(q) }),
      prisma.pressCoverage.count({ where }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q) });
  } catch (e) {
    next(e);
  }
});

// Ambil metadata OG dari URL (dipakai tombol "Ambil dari URL" di form admin)
const fetchSchema = z.object({ url: z.string().url() });
pressRouter.post("/fetch-metadata", validate(fetchSchema), async (req, res, next) => {
  try {
    const { url } = getValidated<typeof fetchSchema>(req);
    const meta = await fetchPageMetadata(url);
    res.json({ ok: true, data: { ...meta, slug: slugify(meta.title).slice(0, 120) } });
  } catch (e) {
    next(badRequest(`Gagal mengambil metadata: ${(e as Error).message}`));
  }
});

pressRouter.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.pressCoverage.findUnique({ where: { id: req.params.id as string } });
    if (!item) throw notFound();
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

pressRouter.post("/", requireRole("ADMIN", "EDITOR"), validate(pressSchema), async (req, res, next) => {
  try {
    const data = getValidated<typeof pressSchema>(req);
    const slug = await uniqueSlug(data.slug || data.title, async (s) => !!(await prisma.pressCoverage.findUnique({ where: { slug: s } })));
    const item = await prisma.pressCoverage.create({ data: { ...data, slug, fetchedAt: new Date() } });
    invalidate([CacheTags.press, CacheTags.dashboard]);
    logActivity(req, { action: "create", entity: "press", entityId: item.id, summary: `Tambah liputan "${item.title}"` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

pressRouter.patch("/:id", requireRole("ADMIN", "EDITOR"), validate(pressSchema.partial()), async (req, res, next) => {
  try {
    const data = getValidated<typeof pressSchema>(req);
    const id = req.params.id as string;
    const item = await prisma.pressCoverage.update({ where: { id }, data: { ...data, ...(data.slug ? { slug: slugify(data.slug) } : {}) } });
    invalidate([CacheTags.press, CacheTags.dashboard]);
    logActivity(req, { action: "update", entity: "press", entityId: id, summary: `Ubah liputan "${item.title}"` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

// Refresh metadata dari sumber untuk item yang sudah ada
pressRouter.post("/:id/refresh", requireRole("ADMIN", "EDITOR"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.pressCoverage.findUnique({ where: { id } });
    if (!existing) throw notFound();
    const meta = await fetchPageMetadata(existing.url);
    const item = await prisma.pressCoverage.update({
      where: { id },
      data: {
        title: meta.title || existing.title,
        description: meta.description || existing.description,
        imageUrl: meta.image ?? existing.imageUrl,
        siteName: meta.siteName || existing.siteName,
        publishedAt: meta.publishedAt ? new Date(meta.publishedAt) : existing.publishedAt,
        author: existing.author ?? meta.author,
        fetchedAt: new Date(),
      },
    });
    invalidate([CacheTags.press]);
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

const reorderSchema = z.object({ ids: z.array(z.string()).min(1) });
pressRouter.post("/reorder", requireRole("ADMIN", "EDITOR"), validate(reorderSchema), async (req, res, next) => {
  try {
    const { ids } = getValidated<typeof reorderSchema>(req);
    await prisma.$transaction(ids.map((id, i) => prisma.pressCoverage.update({ where: { id }, data: { sortOrder: i } })));
    invalidate([CacheTags.press]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

pressRouter.delete("/:id", requireRole("ADMIN"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const item = await prisma.pressCoverage.delete({ where: { id } });
    invalidate([CacheTags.press, CacheTags.dashboard]);
    logActivity(req, { action: "delete", entity: "press", entityId: id, summary: `Hapus liputan "${item.title}"` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ─── Publik ─────────────────────────────────────────────────────────────────
export const publicPressRouter = Router();
const publicSelect = {
  id: true, slug: true, url: true, title: true, excerpt: true, description: true, imageUrl: true,
  siteName: true, author: true, publishedAt: true,
} as const;

publicPressRouter.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const items = await cached(`public:press:${limit}`, [CacheTags.press], () =>
      prisma.pressCoverage.findMany({
        where: { status: "PUBLISHED" },
        select: publicSelect,
        orderBy: [{ publishedAt: "desc" }, { sortOrder: "asc" }],
        take: limit,
      }),
    );
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});

publicPressRouter.get("/:slug", async (req, res, next) => {
  try {
    const slug = req.params.slug as string;
    const item = await cached(`public:press:slug:${slug}`, [CacheTags.press], () =>
      prisma.pressCoverage.findFirst({ where: { slug, status: "PUBLISHED" }, select: publicSelect }),
    );
    if (!item) throw notFound("Liputan tidak ditemukan");
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});
