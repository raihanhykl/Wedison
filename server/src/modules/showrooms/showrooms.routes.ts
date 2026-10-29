import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import type { Prisma, Showroom } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireModule, requireWrite, requireDelete } from "../../middleware/auth.js";
import { has } from "../../lib/permissions.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";
import { logActivity } from "../../lib/activity.js";
import { badRequest, conflict, notFound } from "../../lib/errors.js";
import { syncLinkedTeasers } from "./showroom.data.js";
import {
  ID_RE, closuresOf, isBookable, isVisible, nowInTimeZone, showroomCreateSchema, showroomInputSchema, tzLabel,
  type ShowroomInput,
} from "./showroom.rules.js";

// Modul Showrooms (admin /admin/showrooms): satu sumber data cabang untuk booking, halaman
// /showroom, Kontak, JSON-LD, llms.txt, Google Calendar, dan Opening Teasers.
//
// Kode showroom (id, mis. "jakarta") tidak bisa diubah setelah dibuat karena disimpan di
// Booking.showroom. Showroom yang punya riwayat booking tidak bisa dihapus: ubah status ke
// "Closed" (tutup permanen) agar hilang dari situs tetapi riwayat leads tetap utuh.

const RESERVED_IDS = new Set(["new", "admin", "api", "all", "preview"]);
const ACTIVE_BOOKING = ["NEW", "CONTACTED", "CONFIRMED"] as const;

function bust() {
  invalidate([CacheTags.showrooms]);
}

function toData(input: ShowroomInput) {
  return { ...input, hours: input.hours as Prisma.InputJsonValue, closures: input.closures as Prisma.InputJsonValue };
}

/** Bentuk admin + angka booking. */
function serialize(s: Showroom, stats: { total: number; upcoming: number } = { total: 0, upcoming: 0 }, teasers = 0) {
  return { ...s, tzLabel: tzLabel(s.timeZone), bookableNow: isBookable(s), visible: isVisible(s), bookings: stats, teasers };
}

async function bookingStats(ids: string[]) {
  if (!ids.length) return new Map<string, { total: number; upcoming: number }>();
  const now = new Date();
  const [total, upcoming] = await Promise.all([
    prisma.booking.groupBy({ by: ["showroom"], where: { showroom: { in: ids } }, _count: true }),
    prisma.booking.groupBy({ by: ["showroom"], where: { showroom: { in: ids }, startAt: { gte: now }, status: { in: [...ACTIVE_BOOKING] } }, _count: true }),
  ]);
  const up = new Map(upcoming.map((r) => [r.showroom, r._count]));
  return new Map(total.map((r) => [r.showroom, { total: r._count, upcoming: up.get(r.showroom) ?? 0 }]));
}

async function assertIdFree(id: string) {
  if (RESERVED_IDS.has(id)) throw badRequest(`"${id}" is reserved, choose another code`, [{ path: "id", message: "reserved" }]);
  const hit = await prisma.showroom.findUnique({ where: { id }, select: { name: true } });
  if (hit) throw conflict(`The code "${id}" is already used by ${hit.name}`);
}

// ─── Admin ──────────────────────────────────────────────────────────────────
export const showroomsRouter = Router();
showroomsRouter.use(requireAuth, requireModule("showrooms"));

showroomsRouter.get("/permissions", (req, res) => {
  const u = req.user!;
  res.json({ ok: true, data: { write: has(u, "showrooms.write"), delete: has(u, "showrooms.delete"), teasers: has(u, "teasers.write") } });
});

showroomsRouter.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.showroom.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], include: { _count: { select: { teasers: true } } } });
    const stats = await bookingStats(items.map((s) => s.id));
    res.json({ ok: true, items: items.map(({ _count, ...s }) => serialize(s, stats.get(s.id), _count.teasers)) });
  } catch (e) {
    next(e);
  }
});

const idQuery = z.object({ id: z.string().trim().toLowerCase().max(40) });
showroomsRouter.get("/check-id", validate(idQuery, "query"), async (req, res, next) => {
  try {
    const { id } = getValidated<typeof idQuery>(req, "query");
    if (!ID_RE.test(id) || id.length < 2) return res.json({ ok: true, data: { available: false, reason: "Use lowercase letters, numbers and dashes" } });
    if (RESERVED_IDS.has(id)) return res.json({ ok: true, data: { available: false, reason: "This word is reserved" } });
    const hit = await prisma.showroom.findUnique({ where: { id }, select: { name: true } });
    res.json({ ok: true, data: { available: !hit, reason: hit ? `Already used by ${hit.name}` : null } });
  } catch (e) {
    next(e);
  }
});

showroomsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const s = await prisma.showroom.findUnique({ where: { id } });
    if (!s) throw notFound("Showroom not found");
    const today = nowInTimeZone(s.timeZone).ymd;
    const [stats, teasers, byDate] = await Promise.all([
      bookingStats([id]),
      prisma.showroomTeaser.findMany({ where: { showroomId: id }, select: { id: true, city: true, slug: true, status: true, startAt: true }, orderBy: { startAt: "desc" } }),
      // Booking aktif per tanggal: dipakai editor untuk memperingatkan tanggal tutup yang bentrok.
      prisma.booking.groupBy({ by: ["date"], where: { showroom: id, date: { gte: today }, status: { in: [...ACTIVE_BOOKING] } }, _count: true, orderBy: { date: "asc" } }),
    ]);
    res.json({
      ok: true,
      data: { ...serialize(s, stats.get(id), teasers.length), linkedTeasers: teasers, upcomingBookingDates: byDate.map((r) => ({ date: r.date, count: r._count })) },
    });
  } catch (e) {
    next(e);
  }
});

showroomsRouter.post("/", requireWrite("showrooms"), validate(showroomCreateSchema), async (req, res, next) => {
  try {
    const input = getValidated<typeof showroomCreateSchema>(req);
    await assertIdFree(input.id);
    const s = await prisma.showroom.create({ data: toData(input) as Prisma.ShowroomCreateInput });
    bust();
    logActivity(req, { action: "create", entity: "showroom", entityId: s.id, summary: `Added showroom ${s.name}` });
    res.status(201).json({ ok: true, data: { ...serialize(s), linkedTeasers: [], upcomingBookingDates: [] } });
  } catch (e) {
    next(e);
  }
});

showroomsRouter.put("/:id", requireWrite("showrooms"), validate(showroomInputSchema), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const input = getValidated<typeof showroomInputSchema>(req);
    const before = await prisma.showroom.findUnique({ where: { id }, select: { status: true } });
    if (!before) throw notFound("Showroom not found");
    const s = await prisma.showroom.update({ where: { id }, data: toData(input) });
    bust();
    const synced = await syncLinkedTeasers(s);
    logActivity(req, {
      action: "update", entity: "showroom", entityId: id,
      summary: `Updated showroom ${s.name}${before.status !== s.status ? ` (${before.status} → ${s.status})` : ""}`,
      meta: { syncedTeasers: synced },
    });
    const stats = await bookingStats([id]);
    const teasers = await prisma.showroomTeaser.findMany({ where: { showroomId: id }, select: { id: true, city: true, slug: true, status: true, startAt: true }, orderBy: { startAt: "desc" } });
    const today = nowInTimeZone(s.timeZone).ymd;
    const byDate = await prisma.booking.groupBy({ by: ["date"], where: { showroom: id, date: { gte: today }, status: { in: [...ACTIVE_BOOKING] } }, _count: true, orderBy: { date: "asc" } });
    res.json({
      ok: true,
      data: { ...serialize(s, stats.get(id), teasers.length), linkedTeasers: teasers, upcomingBookingDates: byDate.map((r) => ({ date: r.date, count: r._count })), syncedTeasers: synced },
    });
  } catch (e) {
    next(e);
  }
});

// Aksi cepat dari daftar: ubah status / tampil di situs / bisa di-booking. Divalidasi ulang dengan
// aturan lengkap (mis. tidak bisa ditampilkan tanpa alamat & titik peta).
const quickSchema = z
  .object({
    status: z.enum(["OPEN", "COMING_SOON", "TEMPORARILY_CLOSED", "CLOSED"]).optional(),
    isPublic: z.boolean().optional(),
    bookable: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "Nothing to change");

showroomsRouter.patch("/:id", requireWrite("showrooms"), validate(quickSchema), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const patch = getValidated<typeof quickSchema>(req);
    const cur = await prisma.showroom.findUnique({ where: { id } });
    if (!cur) throw notFound("Showroom not found");
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = cur;
    const check = showroomInputSchema.safeParse({ ...rest, ...patch, email: rest.email ?? "", phone: rest.phone ?? "", mapsUrl: rest.mapsUrl ?? "", photoUrl: rest.photoUrl ?? "" });
    if (!check.success) throw badRequest("Complete the showroom first", check.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })));
    const s = await prisma.showroom.update({ where: { id }, data: patch });
    bust();
    await syncLinkedTeasers(s);
    logActivity(req, { action: "update", entity: "showroom", entityId: id, summary: `Updated showroom ${s.name}: ${Object.entries(patch).map(([k, v]) => `${k}=${v}`).join(", ")}` });
    const stats = await bookingStats([id]);
    res.json({ ok: true, data: serialize(s, stats.get(id)) });
  } catch (e) {
    next(e);
  }
});

showroomsRouter.delete("/:id", requireDelete("showrooms"), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const s = await prisma.showroom.findUnique({ where: { id }, select: { name: true } });
    if (!s) throw notFound("Showroom not found");
    const bookings = await prisma.booking.count({ where: { showroom: id } });
    if (bookings) throw conflict(`${s.name} has ${bookings} booking(s) in Leads. Set its status to Closed instead so the history stays intact.`);
    await prisma.showroom.delete({ where: { id } }); // teaser terkait: showroomId -> null
    bust();
    invalidate([CacheTags.teasers]);
    logActivity(req, { action: "delete", entity: "showroom", entityId: id, summary: `Deleted showroom ${s.name}` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ─── Publik (dikonsumsi Next.js: form booking, /showroom, Kontak, JSON-LD, llms.txt) ───

export function publicShowroom(s: Showroom) {
  const today = nowInTimeZone(s.timeZone).ymd;
  return {
    id: s.id,
    name: s.name,
    city: s.city,
    status: s.status,
    bookable: isBookable(s),
    country: s.country,
    address: { streetAddress: s.streetAddress, addressLocality: s.addressLocality, addressRegion: s.addressRegion, postalCode: s.postalCode },
    lat: s.lat,
    lng: s.lng,
    mapsUrl: s.mapsUrl,
    whatsapp: s.whatsapp,
    phone: s.phone,
    email: s.email,
    timeZone: s.timeZone,
    tzLabel: tzLabel(s.timeZone),
    hours: s.hours,
    // Hanya tanggal tutup yang belum lewat.
    closures: closuresOf(s).filter((c) => c.to >= today),
    hasWorkshop: s.hasWorkshop,
    hasSupercharge: s.hasSupercharge,
    photoUrl: s.photoUrl,
    updatedAt: s.updatedAt.toISOString(),
  };
}

export const publicShowroomsRouter = Router();
publicShowroomsRouter.get("/", async (_req, res, next) => {
  try {
    const items = await cached("public:showrooms", [CacheTags.showrooms], async () => {
      const rows = await prisma.showroom.findMany({ where: { isPublic: true, status: { not: "CLOSED" } }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
      return rows.map(publicShowroom);
    });
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});
