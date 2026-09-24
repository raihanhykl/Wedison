import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";
import { logActivity } from "../../lib/activity.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";
import { fetchSocialMetadata, normalizeInstagramUrl, instagramShortcode } from "../../lib/metadata.js";
import { badRequest, notFound } from "../../lib/errors.js";

const PLATFORM = z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE", "X", "FACEBOOK", "LINKEDIN"]);

const socialSchema = z.object({
  platform: PLATFORM.default("INSTAGRAM"),
  url: z.string().url(),
  caption: z.string().trim().max(2200).nullable().optional(),
  thumbnailUrl: z.string().trim().max(1000).nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  publishedAt: z.coerce.date().nullable().optional(),
});

export const socialRouter = Router();
socialRouter.use(requireAuth);

const listQuery = paginationQuery.extend({ platform: PLATFORM.optional(), active: z.coerce.boolean().optional() });

socialRouter.get("/", validate(listQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof listQuery>(req, "query");
    const where: Prisma.SocialPostWhereInput = {
      ...(q.platform ? { platform: q.platform } : {}),
      ...(q.active !== undefined ? { isActive: q.active } : {}),
      ...(q.q ? { caption: { contains: q.q, mode: "insensitive" } } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.socialPost.findMany({ where, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], ...skipTake(q) }),
      prisma.socialPost.count({ where }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q) });
  } catch (e) {
    next(e);
  }
});

const fetchSchema = z.object({ url: z.string().url() });
socialRouter.post("/fetch-metadata", validate(fetchSchema), async (req, res, next) => {
  try {
    const { url } = getValidated<typeof fetchSchema>(req);
    const meta = await fetchSocialMetadata(url);
    res.json({ ok: true, data: meta });
  } catch (e) {
    next(badRequest(`Gagal mengambil metadata: ${(e as Error).message}`));
  }
});

socialRouter.post("/", requireRole("ADMIN", "EDITOR"), validate(socialSchema), async (req, res, next) => {
  try {
    const data = getValidated<typeof socialSchema>(req);
    const url = data.platform === "INSTAGRAM" ? normalizeInstagramUrl(data.url) : data.url;
    const item = await prisma.socialPost.create({
      data: { ...data, url, externalId: data.platform === "INSTAGRAM" ? instagramShortcode(url) : null, fetchedAt: data.thumbnailUrl ? new Date() : null },
    });
    invalidate([CacheTags.social, CacheTags.dashboard]);
    logActivity(req, { action: "create", entity: "social", entityId: item.id, summary: `Tambah post ${item.platform}` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

socialRouter.patch("/:id", requireRole("ADMIN", "EDITOR"), validate(socialSchema.partial()), async (req, res, next) => {
  try {
    const data = getValidated<typeof socialSchema>(req);
    const id = req.params.id as string;
    const item = await prisma.socialPost.update({ where: { id }, data });
    invalidate([CacheTags.social, CacheTags.dashboard]);
    logActivity(req, { action: "update", entity: "social", entityId: id, summary: `Ubah post ${item.platform}` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

socialRouter.post("/:id/refresh", requireRole("ADMIN", "EDITOR"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.socialPost.findUnique({ where: { id } });
    if (!existing) throw notFound();
    const meta = await fetchSocialMetadata(existing.url);
    const item = await prisma.socialPost.update({
      where: { id },
      data: {
        caption: meta.caption || existing.caption,
        thumbnailUrl: meta.thumbnailUrl ?? existing.thumbnailUrl,
        externalId: meta.externalId ?? existing.externalId,
        publishedAt: meta.publishedAt ? new Date(meta.publishedAt) : existing.publishedAt,
        fetchedAt: new Date(),
      },
    });
    invalidate([CacheTags.social]);
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

const reorderSchema = z.object({ ids: z.array(z.string()).min(1) });
socialRouter.post("/reorder", requireRole("ADMIN", "EDITOR"), validate(reorderSchema), async (req, res, next) => {
  try {
    const { ids } = getValidated<typeof reorderSchema>(req);
    await prisma.$transaction(ids.map((id, i) => prisma.socialPost.update({ where: { id }, data: { sortOrder: i } })));
    invalidate([CacheTags.social]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

socialRouter.delete("/:id", requireRole("ADMIN"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    await prisma.socialPost.delete({ where: { id } });
    invalidate([CacheTags.social, CacheTags.dashboard]);
    logActivity(req, { action: "delete", entity: "social", entityId: id, summary: "Hapus post sosial media" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ─── Publik ─────────────────────────────────────────────────────────────────
export const publicSocialRouter = Router();
publicSocialRouter.get("/", async (req, res, next) => {
  try {
    const platform = PLATFORM.optional().catch(undefined).parse(req.query.platform);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
    const items = await cached(`public:social:${platform ?? "all"}:${limit}`, [CacheTags.social], () =>
      prisma.socialPost.findMany({
        where: { isActive: true, ...(platform ? { platform } : {}) },
        select: { id: true, platform: true, url: true, caption: true, thumbnailUrl: true, publishedAt: true },
        orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
        take: limit,
      }),
    );
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});
