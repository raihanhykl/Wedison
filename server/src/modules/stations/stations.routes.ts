import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { uniqueSlug } from "../../lib/slug.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";
import { logActivity } from "../../lib/activity.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";
import { notFound } from "../../lib/errors.js";

// Modul SuperCharge — fondasi API (CRUD). UI admin menyusul di iterasi berikutnya.
const STATUS = z.enum(["OPERATIONAL", "COMING_SOON", "MAINTENANCE", "CLOSED"]);
const TIER = z.enum(["HUB", "SHOWROOM", "MITRA"]);

const stationSchema = z.object({
  id: z.string().trim().regex(/^[A-Z0-9-]{3,20}$/, "Format kode: huruf besar/angka, mis. ST0045").optional(),
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
stationsRouter.use(requireAuth);

const listQuery = paginationQuery.extend({ status: STATUS.optional(), tier: TIER.optional(), province: z.string().optional() });

stationsRouter.get("/", validate(listQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof listQuery>(req, "query");
    const where: Prisma.StationWhereInput = {
      ...(q.status ? { status: q.status } : {}),
      ...(q.tier ? { tier: q.tier } : {}),
      ...(q.province ? { province: q.province } : {}),
      ...(q.q ? { OR: [{ name: { contains: q.q, mode: "insensitive" } }, { city: { contains: q.q, mode: "insensitive" } }, { id: { contains: q.q.toUpperCase() } }] } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.station.findMany({ where, orderBy: { [q.sort === "name" ? "name" : "updatedAt"]: q.order }, ...skipTake(q) }),
      prisma.station.count({ where }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q) });
  } catch (e) {
    next(e);
  }
});

stationsRouter.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.station.findUnique({ where: { id: req.params.id as string } });
    if (!item) throw notFound("Lokasi tidak ditemukan");
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

stationsRouter.post("/", requireRole("ADMIN", "EDITOR"), validate(stationSchema), async (req, res, next) => {
  try {
    const data = getValidated<typeof stationSchema>(req);
    const id = data.id ?? (await nextStationId());
    const slug = await uniqueSlug(data.slug || data.name, async (s) => !!(await prisma.station.findUnique({ where: { slug: s } })));
    const item = await prisma.station.create({ data: { ...data, id, slug } });
    invalidate([CacheTags.stations, CacheTags.dashboard]);
    logActivity(req, { action: "create", entity: "station", entityId: item.id, summary: `Tambah lokasi ${item.id} ${item.name}` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

stationsRouter.patch("/:id", requireRole("ADMIN", "EDITOR"), validate(stationSchema.partial()), async (req, res, next) => {
  try {
    const { id: _id, ...data } = getValidated<typeof stationSchema>(req);
    const id = req.params.id as string;
    const item = await prisma.station.update({ where: { id }, data });
    invalidate([CacheTags.stations, CacheTags.dashboard]);
    logActivity(req, { action: "update", entity: "station", entityId: id, summary: `Ubah lokasi ${id}` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

stationsRouter.delete("/:id", requireRole("ADMIN"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    await prisma.station.delete({ where: { id } });
    invalidate([CacheTags.stations, CacheTags.dashboard]);
    logActivity(req, { action: "delete", entity: "station", entityId: id, summary: `Hapus lokasi ${id}` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ─── Publik: GeoJSON FeatureCollection (bentuk yang dikonsumsi halaman /super-charge/lokasi) ───
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
