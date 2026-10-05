import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireModule, requireWrite, requireDelete } from "../../middleware/auth.js";
import { canDelete } from "../../lib/permissions.js";
import { uniqueSlug } from "../../lib/slug.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";
import { logActivity } from "../../lib/activity.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";
import { notFound, conflict, badRequest } from "../../lib/errors.js";

// Modul SuperCharge — CRUD + aksi massal untuk halaman admin /admin/supercharge/stations.
const STATUS = z.enum(["OPERATIONAL", "COMING_SOON", "MAINTENANCE", "CLOSED"]);
const TIER = z.enum(["HUB", "SHOWROOM", "MITRA"]);

const stationSchema = z.object({
  id: z.string().trim().regex(/^[A-Z0-9-]{3,20}$/, "Code format: uppercase letters/digits, e.g. ST0045").optional(),
  slug: z.string().trim().max(160).optional(),
  name: z.string().trim().min(3).max(160),
  status: STATUS.default("COMING_SOON"),
  tier: TIER.default("MITRA"),
  address: z.string().trim().min(5).max(400),
  city: z.string().trim().min(2).max(80),
  province: z.string().trim().min(2).max(80),
  lat: z.coerce.number().min(-11).max(6),
  lng: z.coerce.number().min(95).max(141),
  pilesTotal: z.coerce.number().int().min(1).max(100).default(1),
  powerKw: z.coerce.number().int().min(1).max(1000).default(40),
  hours: z.string().trim().max(60).default("24 jam"),
  amenities: z.array(z.string().trim().max(30)).default([]),
  photoUrl: z.string().trim().max(1000).nullable().optional(),
  notes: z.string().trim().max(1000).nullable().optional(),
  isActive: z.boolean().default(true),
});

async function nextStationId() {
  const last = await prisma.station.findFirst({ where: { id: { startsWith: "ST" } }, orderBy: { id: "desc" }, select: { id: true } });
  const n = last ? parseInt(last.id.replace(/\D/g, ""), 10) + 1 : 1;
  return `ST${String(n).padStart(4, "0")}`;
}

export const stationsRouter = Router();
stationsRouter.use(requireAuth, requireModule("supercharge"));

const listQuery = paginationQuery.extend({
  status: STATUS.optional(),
  tier: TIER.optional(),
  province: z.string().optional(),
  active: z.enum(["true", "false"]).optional(),
});
const SORTABLE = new Set(["name", "id", "updatedAt", "status", "tier", "city"]);

stationsRouter.get("/", validate(listQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof listQuery>(req, "query");
    const where: Prisma.StationWhereInput = {
      ...(q.status ? { status: q.status } : {}),
      ...(q.tier ? { tier: q.tier } : {}),
      ...(q.province ? { province: q.province } : {}),
      ...(q.active ? { isActive: q.active === "true" } : {}),
      ...(q.q
        ? { OR: [{ name: { contains: q.q, mode: "insensitive" } }, { city: { contains: q.q, mode: "insensitive" } }, { address: { contains: q.q, mode: "insensitive" } }, { id: { contains: q.q.toUpperCase() } }] }
        : {}),
    };
    const sort = q.sort && SORTABLE.has(q.sort) ? q.sort : "updatedAt";
    const [items, total] = await Promise.all([
      prisma.station.findMany({ where, orderBy: { [sort]: q.order }, ...skipTake(q) }),
      prisma.station.count({ where }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q) });
  } catch (e) {
    next(e);
  }
});

// Nilai unik untuk filter/datalist di admin (provinsi & kota) + ringkasan jumlah per status.
stationsRouter.get("/meta", async (_req, res, next) => {
  try {
    const [provinces, cities, byStatus, total, inactive] = await Promise.all([
      prisma.station.findMany({ distinct: ["province"], select: { province: true }, orderBy: { province: "asc" } }),
      prisma.station.findMany({ distinct: ["city"], select: { city: true, province: true }, orderBy: { city: "asc" } }),
      prisma.station.groupBy({ by: ["status"], where: { isActive: true }, _count: true }),
      prisma.station.count(),
      prisma.station.count({ where: { isActive: false } }),
    ]);
    res.json({
      ok: true,
      data: {
        provinces: provinces.map((p) => p.province),
        cities: cities.map((c) => ({ city: c.city, province: c.province })),
        byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
        total,
        inactive,
      },
    });
  } catch (e) {
    next(e);
  }
});

// Aksi massal dari tabel admin: ubah status / aktif-nonaktif / hapus (hapus hanya ADMIN).
const bulkSchema = z.object({
  ids: z.array(z.string()).min(1).max(500),
  action: z.enum(["status", "activate", "deactivate", "delete"]),
  status: STATUS.optional(),
});

stationsRouter.post("/bulk", requireWrite("supercharge"), validate(bulkSchema), async (req, res, next) => {
  try {
    const { ids, action, status } = getValidated<typeof bulkSchema>(req);
    if (action === "delete" && !canDelete(req.user!.role, "supercharge")) throw badRequest("Your role cannot delete stations");
    if (action === "status" && !status) throw badRequest("status is required for the status action");
    const where = { id: { in: ids } };
    let count = 0;
    switch (action) {
      case "status": count = (await prisma.station.updateMany({ where, data: { status } })).count; break;
      case "activate": count = (await prisma.station.updateMany({ where, data: { isActive: true } })).count; break;
      case "deactivate": count = (await prisma.station.updateMany({ where, data: { isActive: false } })).count; break;
      case "delete": count = (await prisma.station.deleteMany({ where })).count; break;
    }
    invalidate([CacheTags.stations, CacheTags.dashboard]);
    logActivity(req, { action: action === "delete" ? "delete" : "update", entity: "station", summary: `Bulk ${action}${status ? ` → ${status}` : ""} on ${count} station(s)`, meta: { ids, action, status } });
    res.json({ ok: true, count });
  } catch (e) {
    next(e);
  }
});

stationsRouter.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.station.findUnique({ where: { id: req.params.id as string } });
    if (!item) throw notFound("Station not found");
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

stationsRouter.post("/", requireWrite("supercharge"), validate(stationSchema), async (req, res, next) => {
  try {
    const data = getValidated<typeof stationSchema>(req);
    const id = data.id ?? (await nextStationId());
    if (await prisma.station.findUnique({ where: { id }, select: { id: true } })) throw conflict(`Station code ${id} already exists`);
    const slug = await uniqueSlug(data.slug || data.name, async (s) => !!(await prisma.station.findUnique({ where: { slug: s } })));
    const item = await prisma.station.create({ data: { ...data, id, slug } });
    invalidate([CacheTags.stations, CacheTags.dashboard]);
    logActivity(req, { action: "create", entity: "station", entityId: item.id, summary: `Added station ${item.id} ${item.name}` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

stationsRouter.patch("/:id", requireWrite("supercharge"), validate(stationSchema.partial()), async (req, res, next) => {
  try {
    const { id: _id, ...data } = getValidated<typeof stationSchema>(req);
    const id = req.params.id as string;
    // Slug baru harus unik di luar stasiun ini sendiri; kosong = biarkan slug lama.
    if (data.slug !== undefined) {
      if (!data.slug) delete data.slug;
      else data.slug = await uniqueSlug(data.slug, async (s) => !!(await prisma.station.findFirst({ where: { slug: s, NOT: { id } }, select: { id: true } })));
    }
    const item = await prisma.station.update({ where: { id }, data });
    invalidate([CacheTags.stations, CacheTags.dashboard]);
    logActivity(req, { action: "update", entity: "station", entityId: id, summary: `Updated station ${id}` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

stationsRouter.delete("/:id", requireDelete("supercharge"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    await prisma.station.delete({ where: { id } });
    invalidate([CacheTags.stations, CacheTags.dashboard]);
    logActivity(req, { action: "delete", entity: "station", entityId: id, summary: `Deleted station ${id}` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ─── Publik: GeoJSON FeatureCollection (bentuk yang dikonsumsi halaman /super-charge/locations) ───
export const publicStationsRouter = Router();
publicStationsRouter.get("/", async (_req, res, next) => {
  try {
    const data = await cached("public:stations:geojson", [CacheTags.stations], async () => {
      const rows = await prisma.station.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
      return {
        type: "FeatureCollection" as const,
        features: rows.map((s) => ({
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [s.lng, s.lat] as [number, number] },
          properties: {
            id: s.id,
            slug: s.slug,
            name: s.name,
            status: s.status.toLowerCase(),
            address: s.address,
            city: s.city,
            province: s.province,
            piles_total: s.pilesTotal,
            charger_available: s.pilesTotal * 2,
            power_kw: s.powerKw,
            hours: s.hours,
            amenities: s.amenities,
            photo: s.photoUrl ?? undefined,
            type_tier: s.tier.toLowerCase(),
          },
        })),
      };
    });
    res.json(data);
  } catch (e) {
    next(e);
  }
});
