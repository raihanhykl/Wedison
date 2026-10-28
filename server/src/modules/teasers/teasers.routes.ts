import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import type { Prisma, ShowroomTeaser } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireModule, requirePermission, requireWrite, requireDelete } from "../../middleware/auth.js";
import { has } from "../../lib/permissions.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";
import { logActivity } from "../../lib/activity.js";
import { badRequest, conflict, forbidden, notFound } from "../../lib/errors.js";
import {
  SLUG_RE,
  teaserInputSchema,
  teaserIssues,
  utcToZonedParts,
  zonedToUtc,
  type TeaserContent,
  type TeaserInput,
} from "./teaser.schema.js";

// Modul Showroom Teaser: landing page pembukaan showroom yang dikelola dari admin
// (/admin/teasers). Halaman publik: /[locale]/showroom/<slug>.
//
// Status: DRAFT (hanya preview admin) -> PUBLISHED (tayang) -> ARCHIVED (dialihkan ke /showroom/).
// Mengubah teaser yang sedang tayang = langsung tampil di situs, jadi butuh izin teasers.publish
// dan datanya harus tetap lengkap (tidak boleh membuat halaman live jadi setengah jadi).

/** Slug sumber pesan di Leads > Contact Messages. Pakai id (stabil walau slug diganti). */
export const teaserSource = (id: string) => `teaser-${id}`;

/** Path yang tak boleh dipakai sebagai slug (bentrok dengan URL lain di bawah /showroom/). */
const RESERVED_SLUGS = new Set(["new", "preview", "admin", "api"]);

function toData(input: TeaserInput) {
  const { startDate, startTime, endDate, endTime, ...rest } = input;
  return {
    ...rest,
    startAt: zonedToUtc(startDate, startTime, input.timeZone),
    endAt: zonedToUtc(endDate, endTime, input.timeZone),
    images: rest.images as Prisma.InputJsonValue,
    content: rest.content as unknown as Prisma.InputJsonValue,
  };
}

/** Bentuk respons admin: + jadwal dalam zona showroom, daftar kekurangan, jumlah inquiry. */
function serialize(t: ShowroomTeaser, inquiries = 0) {
  const start = utcToZonedParts(t.startAt, t.timeZone);
  const end = utcToZonedParts(t.endAt, t.timeZone);
  return {
    ...t,
    startDate: start.ymd,
    startTime: start.hhmm,
    endDate: end.ymd,
    endTime: end.hhmm,
    source: teaserSource(t.id),
    inquiries,
    issues: teaserIssues({ ...t, content: t.content as unknown as { id: TeaserContent; en: TeaserContent } }),
  };
}

async function inquiryCounts(ids: string[]) {
  if (!ids.length) return new Map<string, number>();
  const rows = await prisma.contactSubmission.groupBy({ by: ["source"], where: { source: { in: ids.map(teaserSource) } }, _count: true });
  return new Map(rows.map((r) => [r.source!.replace(/^teaser-/, ""), r._count]));
}

async function assertSlugFree(slug: string, exceptId?: string) {
  if (RESERVED_SLUGS.has(slug)) throw badRequest(`"${slug}" is reserved, choose another URL`, [{ path: "slug", message: "reserved" }]);
  const hit = await prisma.showroomTeaser.findFirst({ where: { slug, ...(exceptId ? { NOT: { id: exceptId } } : {}) }, select: { city: true } });
  if (hit) throw conflict(`The URL /showroom/${slug} is already used by the ${hit.city} teaser`);
}

function bust() {
  invalidate([CacheTags.teasers]);
}

function canPublish(req: { user?: { permissions: readonly string[] } }) {
  return !!req.user && has(req.user, "teasers.publish");
}

// ─── Admin ──────────────────────────────────────────────────────────────────
export const teasersRouter = Router();
teasersRouter.use(requireAuth, requireModule("teasers"));

teasersRouter.get("/permissions", (req, res) => {
  const u = req.user!;
  res.json({ ok: true, data: { write: has(u, "teasers.write"), publish: has(u, "teasers.publish"), delete: has(u, "teasers.delete") } });
});

const listQuery = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  q: z.string().trim().max(100).optional(),
});

teasersRouter.get("/", validate(listQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof listQuery>(req, "query");
    const items = await prisma.showroomTeaser.findMany({
      where: {
        ...(q.status ? { status: q.status } : {}),
        ...(q.q ? { OR: [{ city: { contains: q.q, mode: "insensitive" } }, { showroomName: { contains: q.q, mode: "insensitive" } }, { slug: { contains: q.q.toLowerCase() } }] } : {}),
      },
      orderBy: [{ startAt: "desc" }],
    });
    const counts = await inquiryCounts(items.map((t) => t.id));
    const all = await prisma.showroomTeaser.groupBy({ by: ["status"], _count: true });
    res.json({
      ok: true,
      items: items.map((t) => serialize(t, counts.get(t.id) ?? 0)),
      byStatus: Object.fromEntries(all.map((s) => [s.status, s._count])),
    });
  } catch (e) {
    next(e);
  }
});

// Cek ketersediaan slug saat mengetik di form (tanpa menyimpan).
const slugQuery = z.object({ slug: z.string().trim().toLowerCase().max(60), id: z.string().optional() });
teasersRouter.get("/check-slug", validate(slugQuery, "query"), async (req, res, next) => {
  try {
    const { slug, id } = getValidated<typeof slugQuery>(req, "query");
    if (!SLUG_RE.test(slug)) return res.json({ ok: true, data: { available: false, reason: "Use lowercase letters, numbers and dashes" } });
    if (RESERVED_SLUGS.has(slug)) return res.json({ ok: true, data: { available: false, reason: "This word is reserved" } });
    const hit = await prisma.showroomTeaser.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) }, select: { city: true } });
    res.json({ ok: true, data: { available: !hit, reason: hit ? `Already used by the ${hit.city} teaser` : null } });
  } catch (e) {
    next(e);
  }
});

// Untuk preview draf di halaman publik (draft mode Next.js): status apa pun.
teasersRouter.get("/by-slug/:slug", async (req, res, next) => {
  try {
    const t = await prisma.showroomTeaser.findUnique({ where: { slug: String(req.params.slug) } });
    if (!t) throw notFound("Teaser not found");
    res.json({ ok: true, data: { ...publicShape(t), status: t.status } });
  } catch (e) {
    next(e);
  }
});

teasersRouter.get("/:id", async (req, res, next) => {
  try {
    const t = await prisma.showroomTeaser.findUnique({ where: { id: String(req.params.id) } });
    if (!t) throw notFound("Teaser not found");
    const counts = await inquiryCounts([t.id]);
    res.json({ ok: true, data: serialize(t, counts.get(t.id) ?? 0) });
  } catch (e) {
    next(e);
  }
});

teasersRouter.post("/", requireWrite("teasers"), validate(teaserInputSchema), async (req, res, next) => {
  try {
    const input = getValidated<typeof teaserInputSchema>(req);
    await assertSlugFree(input.slug);
    const t = await prisma.showroomTeaser.create({ data: toData(input) });
    logActivity(req, { action: "create", entity: "teaser", entityId: t.id, summary: `Created showroom teaser ${t.city}` });
    res.status(201).json({ ok: true, data: serialize(t) });
  } catch (e) {
    next(e);
  }
});

teasersRouter.put("/:id", requireWrite("teasers"), validate(teaserInputSchema), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const input = getValidated<typeof teaserInputSchema>(req);
    const current = await prisma.showroomTeaser.findUnique({ where: { id }, select: { status: true } });
    if (!current) throw notFound("Teaser not found");
    if (current.status === "PUBLISHED") {
      if (!canPublish(req)) throw forbidden("This teaser is live. Only roles that can publish teasers may edit it.");
      const data = toData(input);
      const issues = teaserIssues({ ...input, startAt: data.startAt, endAt: data.endAt });
      if (issues.length) throw badRequest("This teaser is live, so it must stay complete. Fix these first or unpublish it.", issues);
    }
    await assertSlugFree(input.slug, id);
    const t = await prisma.showroomTeaser.update({ where: { id }, data: toData(input) });
    if (t.status !== "DRAFT") bust();
    logActivity(req, { action: "update", entity: "teaser", entityId: id, summary: `Updated showroom teaser ${t.city}` });
    const counts = await inquiryCounts([id]);
    res.json({ ok: true, data: serialize(t, counts.get(id) ?? 0) });
  } catch (e) {
    next(e);
  }
});

const transitionSchema = z.object({ action: z.enum(["publish", "unpublish", "archive", "restore"]) });
const TRANSITIONS = {
  publish: { from: ["DRAFT", "ARCHIVED"], to: "PUBLISHED" },
  unpublish: { from: ["PUBLISHED"], to: "DRAFT" },
  archive: { from: ["DRAFT", "PUBLISHED"], to: "ARCHIVED" },
  restore: { from: ["ARCHIVED"], to: "DRAFT" },
} as const;

teasersRouter.post("/:id/transition", requirePermission("teasers.publish", "Your role cannot publish or archive teasers"), validate(transitionSchema), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const { action } = getValidated<typeof transitionSchema>(req);
    const t = await prisma.showroomTeaser.findUnique({ where: { id } });
    if (!t) throw notFound("Teaser not found");
    const rule = TRANSITIONS[action];
    if (!(rule.from as readonly string[]).includes(t.status)) throw badRequest(`Cannot ${action} a teaser that is ${t.status.toLowerCase()}`);
    if (action === "publish") {
      const issues = teaserIssues({ ...t, content: t.content as unknown as { id: TeaserContent; en: TeaserContent } });
      if (issues.length) throw badRequest("Complete the teaser before publishing", issues);
    }
    const updated = await prisma.showroomTeaser.update({
      where: { id },
      data: { status: rule.to, ...(action === "publish" && !t.publishedAt ? { publishedAt: new Date() } : {}) },
    });
    bust();
    const verb = { publish: "Published", unpublish: "Unpublished", archive: "Archived", restore: "Restored" }[action];
    logActivity(req, { action: "update", entity: "teaser", entityId: id, summary: `${verb} showroom teaser ${t.city}`, meta: { from: t.status, to: rule.to } });
    const counts = await inquiryCounts([id]);
    res.json({ ok: true, data: serialize(updated, counts.get(id) ?? 0) });
  } catch (e) {
    next(e);
  }
});

teasersRouter.post("/:id/duplicate", requireWrite("teasers"), async (req, res, next) => {
  try {
    const src = await prisma.showroomTeaser.findUnique({ where: { id: String(req.params.id) } });
    if (!src) throw notFound("Teaser not found");
    let slug = `${src.slug}-copy`.slice(0, 55);
    for (let i = 2; await prisma.showroomTeaser.findUnique({ where: { slug }, select: { id: true } }); i++) slug = `${src.slug}-copy-${i}`.slice(0, 60);
    const { id: _id, createdAt: _c, updatedAt: _u, publishedAt: _p, status: _s, slug: _slug, ...rest } = src;
    const t = await prisma.showroomTeaser.create({
      data: { ...rest, slug, status: "DRAFT", images: rest.images as Prisma.InputJsonValue, content: rest.content as Prisma.InputJsonValue },
    });
    logActivity(req, { action: "create", entity: "teaser", entityId: t.id, summary: `Duplicated showroom teaser ${src.city}` });
    res.status(201).json({ ok: true, data: serialize(t) });
  } catch (e) {
    next(e);
  }
});

teasersRouter.delete("/:id", requireDelete("teasers"), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const t = await prisma.showroomTeaser.findUnique({ where: { id }, select: { city: true, status: true } });
    if (!t) throw notFound("Teaser not found");
    if (t.status === "PUBLISHED") throw badRequest("Unpublish or archive this teaser before deleting it");
    await prisma.showroomTeaser.delete({ where: { id } });
    bust();
    logActivity(req, { action: "delete", entity: "teaser", entityId: id, summary: `Deleted showroom teaser ${t.city}` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ─── Publik (dikonsumsi Next.js) ────────────────────────────────────────────

function publicShape(t: ShowroomTeaser) {
  return {
    slug: t.slug,
    city: t.city,
    showroomName: t.showroomName,
    noIndex: t.noIndex,
    timeZone: t.timeZone,
    startAt: t.startAt.toISOString(),
    endAt: t.endAt.toISOString(),
    showCountdown: t.showCountdown,
    address: { streetAddress: t.streetAddress, addressLocality: t.addressLocality, addressRegion: t.addressRegion, postalCode: t.postalCode },
    mapsUrl: t.mapsUrl,
    whatsapp: t.whatsapp,
    email: t.email,
    models: t.models,
    images: t.images,
    content: t.content,
    source: teaserSource(t.id),
    updatedAt: t.updatedAt.toISOString(),
  };
}

export const publicTeasersRouter = Router();

// Daftar yang tayang (sitemap + generateStaticParams).
publicTeasersRouter.get("/", async (_req, res, next) => {
  try {
    const items = await cached("public:teasers:list", [CacheTags.teasers], () =>
      prisma.showroomTeaser.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, noIndex: true, updatedAt: true }, orderBy: { startAt: "desc" } }),
    );
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});

publicTeasersRouter.get("/:slug", async (req, res, next) => {
  try {
    const slug = String(req.params.slug).toLowerCase();
    const t = await cached(`public:teasers:${slug}`, [CacheTags.teasers], () => prisma.showroomTeaser.findUnique({ where: { slug } }));
    if (!t || t.status === "DRAFT") throw notFound("Teaser not found");
    // Arsip: halaman publik mengalihkan ke /showroom/ (bukan 404, agar tautan lama tetap berguna).
    if (t.status === "ARCHIVED") return res.json({ ok: true, data: { status: "ARCHIVED", slug: t.slug } });
    res.json({ ok: true, data: { ...publicShape(t), status: t.status } });
  } catch (e) {
    next(e);
  }
});
