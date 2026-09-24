import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { slugify, uniqueSlug } from "../../lib/slug.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";
import { logActivity } from "../../lib/activity.js";

// ─── Kategori ───────────────────────────────────────────────────────────────
export const categoriesRouter = Router();
categoriesRouter.use(requireAuth);

const categorySchema = z.object({
  nameId: z.string().trim().min(2).max(80),
  nameEn: z.string().trim().max(80).nullable().optional(),
  slug: z.string().trim().max(120).optional(),
  description: z.string().trim().max(500).nullable().optional(),
  color: z.string().trim().max(30).nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

categoriesRouter.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { nameId: "asc" }],
      include: { _count: { select: { articles: { where: { deletedAt: null } } } } },
    });
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});

categoriesRouter.post("/", requireRole("ADMIN", "EDITOR"), validate(categorySchema), async (req, res, next) => {
  try {
    const data = getValidated<typeof categorySchema>(req);
    const slug = await uniqueSlug(data.slug || data.nameId, async (s) => !!(await prisma.category.findUnique({ where: { slug: s } })));
    const item = await prisma.category.create({ data: { ...data, slug } });
    invalidate([CacheTags.categories, CacheTags.articles]);
    logActivity(req, { action: "create", entity: "category", entityId: item.id, summary: `Tambah kategori "${item.nameId}"` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

categoriesRouter.patch("/:id", requireRole("ADMIN", "EDITOR"), validate(categorySchema.partial()), async (req, res, next) => {
  try {
    const data = getValidated<typeof categorySchema>(req);
    const id = req.params.id as string;
    const item = await prisma.category.update({
      where: { id },
      data: { ...data, ...(data.slug ? { slug: slugify(data.slug) } : {}) },
    });
    invalidate([CacheTags.categories, CacheTags.articles]);
    logActivity(req, { action: "update", entity: "category", entityId: id, summary: `Ubah kategori "${item.nameId}"` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

categoriesRouter.delete("/:id", requireRole("ADMIN"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const item = await prisma.category.delete({ where: { id } });
    invalidate([CacheTags.categories, CacheTags.articles]);
    logActivity(req, { action: "delete", entity: "category", entityId: id, summary: `Hapus kategori "${item.nameId}"` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ─── Tag ────────────────────────────────────────────────────────────────────
export const tagsRouter = Router();
tagsRouter.use(requireAuth);

const tagSchema = z.object({ name: z.string().trim().min(1).max(50) });

tagsRouter.get("/", async (req, res, next) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const items = await prisma.tag.findMany({
      where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
      orderBy: { name: "asc" },
      include: { _count: { select: { articles: true } } },
      take: 200,
    });
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});

tagsRouter.post("/", requireRole("ADMIN", "EDITOR"), validate(tagSchema), async (req, res, next) => {
  try {
    const { name } = getValidated<typeof tagSchema>(req);
    const slug = slugify(name);
    // upsert by slug: tag yang sama tidak perlu dobel
    const item = await prisma.tag.upsert({ where: { slug }, update: {}, create: { name, slug } });
    invalidate([CacheTags.tags]);
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

tagsRouter.patch("/:id", requireRole("ADMIN", "EDITOR"), validate(tagSchema), async (req, res, next) => {
  try {
    const { name } = getValidated<typeof tagSchema>(req);
    const item = await prisma.tag.update({ where: { id: req.params.id as string }, data: { name, slug: slugify(name) } });
    invalidate([CacheTags.tags, CacheTags.articles]);
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

tagsRouter.delete("/:id", requireRole("ADMIN"), async (req, res, next) => {
  try {
    await prisma.tag.delete({ where: { id: req.params.id as string } });
    invalidate([CacheTags.tags, CacheTags.articles]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ─── Publik ─────────────────────────────────────────────────────────────────
export const publicTaxonomyRouter = Router();
publicTaxonomyRouter.get("/categories", async (_req, res, next) => {
  try {
    const items = await cached("public:categories", [CacheTags.categories], () =>
      prisma.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { nameId: "asc" }],
        select: { id: true, slug: true, nameId: true, nameEn: true, color: true },
      }),
    );
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});
