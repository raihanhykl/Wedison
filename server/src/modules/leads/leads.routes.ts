import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { logActivity } from "../../lib/activity.js";
import { logger } from "../../lib/logger.js";
import { env } from "../../config/env.js";
import { paginationQuery, paginate, skipTake } from "../../lib/pagination.js";
import { HttpError, notFound } from "../../lib/errors.js";
import {
  SHOWROOM_IDS, SHOWROOMS, PURPOSE_FROM_FORM, PURPOSE_LABEL, DATE_RE, TIME_RE, PHONE_RE,
  normalizePhone, canonicalPhone, availableSlots, zonedToUtc, type ShowroomId,
} from "./booking-rules.js";
import { createBookingEvent, deleteBookingEvent, isCalendarConfigured } from "./google-calendar.js";

// Modul Leads: booking showroom (Test Ride / kunjungan) + pesan form kontak.
// - Publik : POST /public/leads/bookings, POST /public/leads/contacts (rate limit + honeypot)
// - Admin  : /admin/leads/stats, /admin/leads/bookings[...], /admin/leads/contacts[...]

const BOOKING_STATUS = z.enum(["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]);
const BOOKING_PURPOSE = z.enum(["TEST_RIDE", "CONSULTATION", "FINANCING", "SERVICE", "OTHER"]);
const ADMIN_TZ = "Asia/Jakarta";

const clientIp = (req: { ip?: string; headers: Record<string, unknown> }) =>
  ((req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() || req.ip || null);

// ─────────────────────────── Google Calendar sync (fail-soft) ───────────────────────────

async function syncBookingToCalendar(id: string) {
  const b = await prisma.booking.findUnique({ where: { id } });
  if (!b) return null;
  if (b.calendarEventId) return b; // sudah ada event
  const showroom = b.showroom as ShowroomId;
  if (!isCalendarConfigured(showroom)) {
    return prisma.booking.update({ where: { id }, data: { calendarStatus: "SKIPPED", calendarError: null } });
  }
  try {
    const ev = await createBookingEvent({
      showroom, purposeLabel: PURPOSE_LABEL[b.purpose], name: b.name, phone: b.phone, email: b.email,
      date: b.date, time: b.time, note: b.note, locale: b.locale, source: b.source, bookingId: b.id,
    });
    return prisma.booking.update({
      where: { id },
      data: { calendarStatus: "SAVED", calendarEventId: ev.id, calendarLink: ev.htmlLink ?? null, calendarError: null },
    });
  } catch (err) {
    logger.error({ err, bookingId: id }, "gagal sinkron booking ke Google Calendar");
    const message = err instanceof Error ? err.message.slice(0, 500) : "unknown error";
    return prisma.booking.update({ where: { id }, data: { calendarStatus: "FAILED", calendarError: message } });
  }
}

async function removeCalendarEvent(b: { showroom: string; calendarEventId: string | null }) {
  if (!b.calendarEventId) return;
  try {
    await deleteBookingEvent(b.showroom as ShowroomId, b.calendarEventId);
  } catch (err) {
    logger.warn({ err }, "gagal menghapus event Google Calendar");
  }
}

async function verifyRecaptcha(token: string | undefined, ip: string | null): Promise<boolean> {
  if (!env.RECAPTCHA_SECRET_KEY) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: env.RECAPTCHA_SECRET_KEY, response: token, ...(ip ? { remoteip: ip } : {}) }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

// ─────────────────────────── Publik ───────────────────────────

const publicLimiter = (limit: number) =>
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { ok: false, code: "RATE_LIMIT", message: "Too many submissions. Please try again in a few minutes." },
  });

const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .default("")
  .refine((v) => v === "" || z.string().email().safeParse(v).success, "Invalid email address");

const bookingBody = z.object({
  showroom: z.enum(SHOWROOM_IDS),
  purpose: z.enum(["testRide", "consultation", "financing", "service", "other"]),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().transform(normalizePhone).refine((v) => PHONE_RE.test(v), "Invalid phone number"),
  email: optionalEmail,
  date: z.string().regex(DATE_RE),
  time: z.string().regex(TIME_RE),
  note: z.string().trim().max(500).default(""),
  website: z.string().max(200).optional(), // honeypot
  source: z.string().trim().max(40).optional(),
  locale: z.enum(["id", "en"]).optional(),
  recaptchaToken: z.string().max(5000).optional(),
});

const contactBody = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().min(6).max(24),
  topic: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(2000),
  locale: z.enum(["id", "en"]).optional(),
  website: z.string().max(200).optional(), // honeypot
});

export const publicLeadsRouter = Router();

publicLeadsRouter.post("/bookings", publicLimiter(5), validate(bookingBody), async (req, res, next) => {
  try {
    const b = getValidated<typeof bookingBody>(req);
    // Honeypot terisi = bot -> balas "sukses" palsu tanpa menyimpan apa pun.
    if (b.website) return res.json({ ok: true, id: null, calendar: "skipped" });

    const ip = clientIp(req);
    if (!(await verifyRecaptcha(b.recaptchaToken, ip))) {
      throw new HttpError(400, "reCAPTCHA verification failed", "RECAPTCHA");
    }
    if (!availableSlots(b.showroom, b.date).includes(b.time)) {
      throw new HttpError(400, "That time slot is not available", "SLOT_UNAVAILABLE");
    }

    const created = await prisma.booking.create({
      data: {
        showroom: b.showroom,
        purpose: PURPOSE_FROM_FORM[b.purpose],
        name: b.name,
        phone: canonicalPhone(b.phone),
        email: b.email || null,
        date: b.date,
        time: b.time,
        startAt: zonedToUtc(b.date, b.time, SHOWROOMS[b.showroom].timeZone),
        note: b.note || null,
        source: b.source ?? null,
        locale: b.locale ?? null,
        ip,
        userAgent: (req.headers["user-agent"] ?? "").toString().slice(0, 300) || null,
      },
    });
    const synced = (await syncBookingToCalendar(created.id)) ?? created;
    logger.info({ bookingId: created.id, showroom: b.showroom, calendar: synced.calendarStatus }, "booking baru");
    res.status(201).json({ ok: true, id: created.id, calendar: synced.calendarStatus.toLowerCase() });
  } catch (e) {
    next(e);
  }
});

publicLeadsRouter.post("/contacts", publicLimiter(5), validate(contactBody), async (req, res, next) => {
  try {
    const c = getValidated<typeof contactBody>(req);
    if (c.website) return res.json({ ok: true, id: null });
    const created = await prisma.contactSubmission.create({
      data: { name: c.name, email: c.email, phone: c.phone, topic: c.topic, message: c.message, locale: c.locale ?? null, ip: clientIp(req) },
    });
    res.status(201).json({ ok: true, id: created.id });
  } catch (e) {
    next(e);
  }
});

// ─────────────────────────── Admin ───────────────────────────

export const leadsRouter = Router();
leadsRouter.use(requireAuth);

const ymdOpt = z.string().regex(DATE_RE).optional();

/** Rentang [from, to) dalam UTC dari tanggal admin (WIB). Default 30 hari terakhir. */
function rangeFromQuery(from?: string, to?: string) {
  const todayJkt = new Intl.DateTimeFormat("en-CA", { timeZone: ADMIN_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const toYmd = to ?? todayJkt;
  const fromYmd = from ?? (() => { const d = new Date(`${toYmd}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - 29); return d.toISOString().slice(0, 10); })();
  const start = zonedToUtc(fromYmd, "00:00", ADMIN_TZ);
  const endExclusive = new Date(zonedToUtc(toYmd, "00:00", ADMIN_TZ).getTime() + 86_400_000);
  return { fromYmd, toYmd, start, endExclusive };
}

function listYmd(fromYmd: string, toYmd: string) {
  const out: string[] = [];
  const d = new Date(`${fromYmd}T00:00:00Z`);
  const end = new Date(`${toYmd}T00:00:00Z`);
  for (let i = 0; d <= end && i < 400; i++) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

const statsQuery = z.object({ from: ymdOpt, to: ymdOpt });

leadsRouter.get("/stats", validate(statsQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof statsQuery>(req, "query");
    const r = rangeFromQuery(q.from, q.to);
    const inRange: Prisma.BookingWhereInput = { createdAt: { gte: r.start, lt: r.endExclusive } };
    const now = new Date();
    const in7d = new Date(now.getTime() + 7 * 86_400_000);

    const [
      bookingsAll, bookingsInRange, bookingsNew, upcoming7d, contactsAll, contactsInRange, contactsUnhandled,
      byPurpose, byShowroom, bySource, byStatus, byTopic, bookingsPerDay, contactsPerDay, recentBookings, upcomingBookings, recentContacts,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: inRange }),
      prisma.booking.count({ where: { status: "NEW" } }),
      prisma.booking.count({ where: { startAt: { gte: now, lt: in7d }, status: { notIn: ["CANCELLED", "NO_SHOW"] } } }),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { createdAt: { gte: r.start, lt: r.endExclusive } } }),
      prisma.contactSubmission.count({ where: { isHandled: false } }),
      prisma.booking.groupBy({ by: ["purpose"], where: inRange, _count: true }),
      prisma.booking.groupBy({ by: ["showroom"], where: inRange, _count: true }),
      prisma.booking.groupBy({ by: ["source"], where: inRange, _count: true }),
      prisma.booking.groupBy({ by: ["status"], where: inRange, _count: true }),
      prisma.contactSubmission.groupBy({ by: ["topic"], where: { createdAt: { gte: r.start, lt: r.endExclusive } }, _count: true, orderBy: { _count: { topic: "desc" } }, take: 8 }),
      prisma.$queryRaw<{ day: string; n: number }[]>`
        SELECT to_char(("createdAt" AT TIME ZONE 'Asia/Jakarta')::date, 'YYYY-MM-DD') AS day, COUNT(*)::int AS n
        FROM "Booking" WHERE "createdAt" >= ${r.start} AND "createdAt" < ${r.endExclusive} GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw<{ day: string; n: number }[]>`
        SELECT to_char(("createdAt" AT TIME ZONE 'Asia/Jakarta')::date, 'YYYY-MM-DD') AS day, COUNT(*)::int AS n
        FROM "ContactSubmission" WHERE "createdAt" >= ${r.start} AND "createdAt" < ${r.endExclusive} GROUP BY 1 ORDER BY 1`,
      prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.booking.findMany({ where: { startAt: { gte: now }, status: { notIn: ["CANCELLED", "NO_SHOW"] } }, orderBy: { startAt: "asc" }, take: 8 }),
      prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    ]);

    const bMap = new Map(bookingsPerDay.map((x) => [x.day, Number(x.n)]));
    const cMap = new Map(contactsPerDay.map((x) => [x.day, Number(x.n)]));
    const perDay = listYmd(r.fromYmd, r.toYmd).map((day) => ({ day, bookings: bMap.get(day) ?? 0, contacts: cMap.get(day) ?? 0 }));
    const toObj = <K extends string>(rows: { _count: number }[], key: (row: never) => K | null) =>
      Object.fromEntries(rows.map((row) => [key(row as never) ?? "unknown", row._count])) as Record<string, number>;

    res.json({
      ok: true,
      data: {
        range: { from: r.fromYmd, to: r.toYmd },
        totals: { bookingsAll, bookingsInRange, bookingsNew, upcoming7d, contactsAll, contactsInRange, contactsUnhandled },
        byPurpose: toObj(byPurpose, (x: { purpose: string }) => x.purpose),
        byShowroom: toObj(byShowroom, (x: { showroom: string }) => x.showroom),
        bySource: toObj(bySource, (x: { source: string | null }) => x.source),
        byStatus: toObj(byStatus, (x: { status: string }) => x.status),
        byTopic: byTopic.map((x) => ({ topic: x.topic, count: x._count })),
        perDay,
        recentBookings,
        upcomingBookings,
        recentContacts,
        calendarConfigured: isCalendarConfigured("jakarta"),
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (e) {
    next(e);
  }
});

// ── Bookings ──
const bookingListQuery = paginationQuery.extend({
  showroom: z.enum(SHOWROOM_IDS).optional(),
  purpose: BOOKING_PURPOSE.optional(),
  status: BOOKING_STATUS.optional(),
  from: ymdOpt, // rentang berdasarkan tanggal kunjungan (date)
  to: ymdOpt,
  upcoming: z.enum(["1", "true"]).optional(),
});

function bookingWhere(q: z.infer<typeof bookingListQuery>): Prisma.BookingWhereInput {
  return {
    ...(q.showroom ? { showroom: q.showroom } : {}),
    ...(q.purpose ? { purpose: q.purpose } : {}),
    ...(q.status ? { status: q.status } : {}),
    ...(q.from || q.to ? { date: { ...(q.from ? { gte: q.from } : {}), ...(q.to ? { lte: q.to } : {}) } } : {}),
    ...(q.upcoming ? { startAt: { gte: new Date() }, status: { notIn: ["CANCELLED", "NO_SHOW"] } } : {}),
    ...(q.q
      ? { OR: [{ name: { contains: q.q, mode: "insensitive" } }, { phone: { contains: normalizePhone(q.q) } }, { email: { contains: q.q, mode: "insensitive" } }] }
      : {}),
  };
}
const bookingOrder = (q: { sort?: string; order: "asc" | "desc" }): Prisma.BookingOrderByWithRelationInput =>
  q.sort === "startAt" ? { startAt: q.order } : q.sort === "name" ? { name: q.order } : { createdAt: q.order };

leadsRouter.get("/bookings", validate(bookingListQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof bookingListQuery>(req, "query");
    const where = bookingWhere(q);
    const [items, total] = await Promise.all([
      prisma.booking.findMany({ where, orderBy: bookingOrder(q), ...skipTake(q) }),
      prisma.booking.count({ where }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q) });
  } catch (e) {
    next(e);
  }
});

const csvCell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

leadsRouter.get("/bookings/export", validate(bookingListQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof bookingListQuery>(req, "query");
    const rows = await prisma.booking.findMany({ where: bookingWhere(q), orderBy: { startAt: "desc" }, take: 5000 });
    const head = ["id", "created_at", "status", "showroom", "purpose", "name", "phone", "email", "visit_date", "visit_time", "note", "source", "locale", "calendar_status", "admin_note"];
    const lines = rows.map((b) =>
      [b.id, b.createdAt.toISOString(), b.status, SHOWROOMS[b.showroom as ShowroomId]?.name ?? b.showroom, PURPOSE_LABEL[b.purpose], b.name, b.phone, b.email, b.date, b.time, b.note, b.source, b.locale, b.calendarStatus, b.adminNote]
        .map(csvCell)
        .join(","),
    );
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="bookings-${stamp}.csv"`);
    res.send(`﻿${[head.join(","), ...lines].join("\r\n")}`);
    logActivity(req, { action: "export", entity: "booking", summary: `Exported ${rows.length} bookings to CSV` });
  } catch (e) {
    next(e);
  }
});

leadsRouter.get("/bookings/:id", async (req, res, next) => {
  try {
    const item = await prisma.booking.findUnique({ where: { id: req.params.id as string } });
    if (!item) throw notFound("Booking not found");
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

const bookingPatch = z.object({ status: BOOKING_STATUS.optional(), adminNote: z.string().trim().max(1000).nullable().optional() });

leadsRouter.patch("/bookings/:id", validate(bookingPatch), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = getValidated<typeof bookingPatch>(req);
    const before = await prisma.booking.findUnique({ where: { id } });
    if (!before) throw notFound("Booking not found");
    let item = await prisma.booking.update({ where: { id }, data });
    // Dibatalkan -> hapus event kalender agar tim tidak menunggu customer yang tak datang.
    if (data.status === "CANCELLED" && before.status !== "CANCELLED" && before.calendarEventId) {
      await removeCalendarEvent(before);
      item = await prisma.booking.update({ where: { id }, data: { calendarEventId: null, calendarLink: null, calendarStatus: "SKIPPED", calendarError: "Event dihapus karena booking dibatalkan" } });
    }
    logActivity(req, { action: "update", entity: "booking", entityId: id, summary: `Updated booking ${before.name}${data.status ? ` → ${data.status}` : ""}` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

leadsRouter.post("/bookings/:id/calendar-sync", async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const item = await syncBookingToCalendar(id);
    if (!item) throw notFound("Booking not found");
    logActivity(req, { action: "sync", entity: "booking", entityId: id, summary: `Calendar sync for ${item.name}: ${item.calendarStatus}` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

leadsRouter.delete("/bookings/:id", requireRole("ADMIN"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const before = await prisma.booking.findUnique({ where: { id } });
    if (!before) throw notFound("Booking not found");
    await removeCalendarEvent(before);
    await prisma.booking.delete({ where: { id } });
    logActivity(req, { action: "delete", entity: "booking", entityId: id, summary: `Deleted booking ${before.name}` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ── Contacts ──
const contactListQuery = paginationQuery.extend({ handled: z.enum(["true", "false"]).optional(), from: ymdOpt, to: ymdOpt });

leadsRouter.get("/contacts", validate(contactListQuery, "query"), async (req, res, next) => {
  try {
    const q = getValidated<typeof contactListQuery>(req, "query");
    const where: Prisma.ContactSubmissionWhereInput = {
      ...(q.handled ? { isHandled: q.handled === "true" } : {}),
      ...(q.from || q.to
        ? { createdAt: { ...(q.from ? { gte: zonedToUtc(q.from, "00:00", ADMIN_TZ) } : {}), ...(q.to ? { lt: new Date(zonedToUtc(q.to, "00:00", ADMIN_TZ).getTime() + 86_400_000) } : {}) } }
        : {}),
      ...(q.q
        ? { OR: [{ name: { contains: q.q, mode: "insensitive" } }, { email: { contains: q.q, mode: "insensitive" } }, { phone: { contains: q.q } }, { topic: { contains: q.q, mode: "insensitive" } }, { message: { contains: q.q, mode: "insensitive" } }] }
        : {}),
    };
    const [items, total] = await Promise.all([
      prisma.contactSubmission.findMany({ where, orderBy: { createdAt: q.order }, ...skipTake(q) }),
      prisma.contactSubmission.count({ where }),
    ]);
    res.json({ ok: true, ...paginate(items, total, q) });
  } catch (e) {
    next(e);
  }
});

const contactPatch = z.object({ isHandled: z.boolean().optional(), adminNote: z.string().trim().max(1000).nullable().optional() });

leadsRouter.patch("/contacts/:id", validate(contactPatch), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = getValidated<typeof contactPatch>(req);
    const item = await prisma.contactSubmission.update({
      where: { id },
      data: { ...data, ...(data.isHandled === undefined ? {} : { handledAt: data.isHandled ? new Date() : null }) },
    });
    logActivity(req, { action: "update", entity: "contact", entityId: id, summary: `${data.isHandled === undefined ? "Updated" : data.isHandled ? "Handled" : "Reopened"} contact from ${item.name}` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

leadsRouter.delete("/contacts/:id", requireRole("ADMIN"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    await prisma.contactSubmission.delete({ where: { id } });
    logActivity(req, { action: "delete", entity: "contact", entityId: id, summary: `Deleted contact message ${id}` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
