/**
 * Integration tests for the Showrooms module (admin CRUD, quick actions, public list) and the
 * booking rules that now read from the Showroom table (bookable flag, opening hours, closures).
 * Runs the real Express app against the local database; rows are prefixed with the run id.
 */
import "dotenv/config";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { teaserPayload } from "./teasers.fixture.js";

const app = createApp();
const RUN = `t${Date.now().toString(36)}`;
const ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL ?? "admin@wedison.co").toLowerCase();
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Wedison2026!";
const PASSWORD = "Str0ngPassw0rd!";
const BASE = "/api/v1/admin/showrooms";

type Agent = ReturnType<typeof request.agent>;
async function login(email: string, password = PASSWORD): Promise<Agent> {
  const agent = request.agent(app);
  const res = await agent.post("/api/v1/auth/login").send({ email, password });
  expect(res.status, `login ${email}: ${JSON.stringify(res.body)}`).toBe(200);
  return agent;
}
const userEmail = (slug: string) => `${RUN}-${slug}@test.wedison.local`;

/** Tanggal "YYYY-MM-DD" di WIB, n hari dari sekarang. */
function ymdIn(days: number) {
  const d = new Date(Date.now() + days * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}
const dayKey = (ymd: string) => ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date(`${ymd}T00:00:00Z`).getUTCDay()];

const OPEN_DAY = ymdIn(10);
const CLOSED_DAY = ymdIn(12); // tanggal tutup khusus
const WEEKLY_OFF = ymdIn(13); // hari libur mingguan (jam = null)
const ALL_DAYS = { open: "09:00", close: "17:00" };

function hours() {
  const h: Record<string, { open: string; close: string } | null> = { sun: ALL_DAYS, mon: ALL_DAYS, tue: ALL_DAYS, wed: ALL_DAYS, thu: ALL_DAYS, fri: ALL_DAYS, sat: ALL_DAYS, holiday: null };
  h[dayKey(WEEKLY_OFF)] = null;
  return h;
}

function payload(over: Record<string, unknown> = {}) {
  return {
    id: `${RUN}-sby`,
    name: "Wedison Surabaya",
    city: "Surabaya",
    status: "OPEN",
    isPublic: true,
    bookable: true,
    sortOrder: 50,
    streetAddress: "Jl. Raya Darmo No. 1",
    addressLocality: "Surabaya",
    addressRegion: "Jawa Timur",
    postalCode: "60241",
    lat: -7.29,
    lng: 112.73,
    mapsUrl: "https://maps.app.goo.gl/example",
    whatsapp: "0812-3456-7890",
    phone: "",
    email: "Surabaya@Wedison.co",
    timeZone: "Asia/Jakarta",
    hours: hours(),
    closures: [
      { from: CLOSED_DAY, to: CLOSED_DAY, note: "Renovasi" },
      { from: "2020-01-01", to: "2020-01-02", note: "Sudah lewat" },
    ],
    hasWorkshop: true,
    hasSupercharge: false,
    photoUrl: "",
    ...over,
  };
}

const booking = (showroom: string, date: string, time = "10:00", ip = "203.0.113.41") =>
  request(app).post("/api/v1/public/leads/bookings").set("x-forwarded-for", ip).send({
    showroom, purpose: "testRide", name: "Tes Showroom", phone: "081234567890", date, time, locale: "id", source: "other",
  });

let admin: Agent;
const roleIds: string[] = [];
async function userWith(name: string, permissions: string[]) {
  const role = await admin.post("/api/v1/admin/roles").send({ name: `${RUN} ${name}`, permissions });
  expect(role.status, JSON.stringify(role.body)).toBe(201);
  roleIds.push(role.body.data.id);
  const u = await admin.post("/api/v1/admin/users").send({ name: `${RUN} ${name}`, email: userEmail(name), password: PASSWORD, roleId: role.body.data.id });
  expect(u.status, JSON.stringify(u.body)).toBe(201);
  return login(userEmail(name));
}

beforeAll(async () => {
  admin = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
});

afterAll(async () => {
  await prisma.booking.deleteMany({ where: { showroom: { startsWith: RUN } } });
  await prisma.showroomTeaser.deleteMany({ where: { slug: { startsWith: RUN } } });
  await prisma.showroom.deleteMany({ where: { id: { startsWith: RUN } } });
  await prisma.user.deleteMany({ where: { email: { endsWith: "@test.wedison.local" } } });
  await prisma.role.deleteMany({ where: { id: { in: roleIds } } });
  await prisma.$disconnect();
});

describe("seed + list", () => {
  it("has the four migrated showrooms with the confirmed Jakarta address", async () => {
    const res = await admin.get(BASE);
    expect(res.status).toBe(200);
    const ids = res.body.items.map((s: { id: string }) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["jakarta", "bekasi", "bandung", "bali"]));
    const jkt = res.body.items.find((s: { id: string }) => s.id === "jakarta");
    expect(jkt.streetAddress).toMatch(/Sultan Iskandar Muda/);
    expect(jkt).toMatchObject({ status: "OPEN", isPublic: true, bookable: true, bookableNow: true, tzLabel: "WIB" });
    expect(res.body.items.find((s: { id: string }) => s.id === "bali")).toMatchObject({ timeZone: "Asia/Makassar", tzLabel: "WITA", hasSupercharge: false });
  });
});

describe("create + validation", () => {
  it("creates a showroom and normalizes contacts", async () => {
    const res = await admin.post(BASE).send(payload());
    expect(res.status, JSON.stringify(res.body)).toBe(201);
    expect(res.body.data).toMatchObject({ id: `${RUN}-sby`, whatsapp: "6281234567890", email: "surabaya@wedison.co", phone: null, photoUrl: null, bookableNow: true });
    // Editor langsung memakai respons ini (regresi: crash bila daftar teaser tidak ada).
    expect(res.body.data).toMatchObject({ linkedTeasers: [], upcomingBookingDates: [] });
  });

  it("rejects invalid input with field details", async () => {
    const cases: [Record<string, unknown>, string][] = [
      [{ id: "Surabaya Baru" }, "id"],
      [{ id: `${RUN}-x`, whatsapp: "123" }, "whatsapp"],
      [{ id: `${RUN}-x`, email: "nope" }, "email"],
      [{ id: `${RUN}-x`, mapsUrl: "http://x.example" }, "mapsUrl"],
      [{ id: `${RUN}-x`, lat: 40 }, "lat"],
      [{ id: `${RUN}-x`, hours: { ...hours(), mon: { open: "10:00", close: "10:30" } } }, "hours.mon.close"],
      [{ id: `${RUN}-x`, closures: [{ from: "2030-02-02", to: "2030-02-01", note: "" }] }, "closures.0.to"],
      [{ id: `${RUN}-x`, streetAddress: "" }, "streetAddress"],
      [{ id: `${RUN}-x`, lat: null }, "lat"],
      [{ id: `${RUN}-x`, hours: Object.fromEntries(["sun", "mon", "tue", "wed", "thu", "fri", "sat", "holiday"].map((d) => [d, null])) }, "hours"],
    ];
    for (const [over, path] of cases) {
      const res = await admin.post(BASE).send(payload(over));
      expect(res.status, `${path}: ${JSON.stringify(res.body)}`).toBe(400);
      expect(res.body.details.map((d: { path: string }) => d.path)).toContain(path);
    }
  });

  it("a hidden coming-soon showroom only needs a name, city and WhatsApp", async () => {
    const res = await admin.post(BASE).send(payload({ id: `${RUN}-mdn`, name: "Wedison Medan", city: "Medan", status: "COMING_SOON", isPublic: false, streetAddress: "", addressLocality: "", lat: null, lng: null }));
    expect(res.status, JSON.stringify(res.body)).toBe(201);
    expect(res.body.data.bookableNow).toBe(false);
  });

  it("rejects duplicate and reserved codes; check-id reports availability", async () => {
    expect((await admin.post(BASE).send(payload())).status).toBe(409);
    expect((await admin.post(BASE).send(payload({ id: "new" }))).status).toBe(400);
    expect((await admin.get(`${BASE}/check-id`).query({ id: "jakarta" })).body.data.available).toBe(false);
    expect((await admin.get(`${BASE}/check-id`).query({ id: `${RUN}-free` })).body.data.available).toBe(true);
  });

  it("the code cannot be changed on update", async () => {
    const res = await admin.put(`${BASE}/${RUN}-sby`).send({ ...payload(), id: "something-else", name: "Wedison Surabaya Darmo" });
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ id: `${RUN}-sby`, name: "Wedison Surabaya Darmo" });
  });
});

describe("public list + booking rules", () => {
  it("lists visible showrooms with only upcoming closures", async () => {
    const res = await request(app).get("/api/v1/public/showrooms");
    expect(res.status).toBe(200);
    const sby = res.body.items.find((s: { id: string }) => s.id === `${RUN}-sby`);
    expect(sby).toMatchObject({ bookable: true, tzLabel: "WIB", address: { addressLocality: "Surabaya" } });
    expect(sby.closures).toEqual([{ from: CLOSED_DAY, to: CLOSED_DAY, note: "Renovasi" }]);
    expect(res.body.items.map((s: { id: string }) => s.id)).not.toContain(`${RUN}-mdn`); // tersembunyi
  });

  it("accepts a booking on an open day and stores the showroom code", async () => {
    const res = await booking(`${RUN}-sby`, OPEN_DAY, "10:00");
    expect(res.status, JSON.stringify(res.body)).toBe(201);
    const b = await prisma.booking.findUnique({ where: { id: res.body.id } });
    expect(b).toMatchObject({ showroom: `${RUN}-sby`, date: OPEN_DAY, time: "10:00" });
    expect(b!.startAt.toISOString()).toBe(new Date(`${OPEN_DAY}T03:00:00Z`).toISOString()); // 10:00 WIB
  });

  it("refuses closure dates, weekly days off, out-of-hours slots and unknown/unbookable showrooms", async () => {
    const ip = "203.0.113.42";
    expect((await booking(`${RUN}-sby`, CLOSED_DAY, "10:00", ip)).body.code).toBe("SLOT_UNAVAILABLE");
    expect((await booking(`${RUN}-sby`, WEEKLY_OFF, "10:00", ip)).body.code).toBe("SLOT_UNAVAILABLE");
    expect((await booking(`${RUN}-sby`, OPEN_DAY, "16:30", ip)).body.code).toBe("SLOT_UNAVAILABLE"); // sesi 60 mnt melewati jam tutup
    expect((await booking("tidak-ada", OPEN_DAY, "10:00", ip)).body.code).toBe("SHOWROOM_UNAVAILABLE");
    expect((await booking(`${RUN}-mdn`, OPEN_DAY, "10:00", ip)).body.code).toBe("SHOWROOM_UNAVAILABLE");
  });

  it("editor sees bookings per closure date and per showroom", async () => {
    const res = await admin.get(`${BASE}/${RUN}-sby`);
    expect(res.status).toBe(200);
    expect(res.body.data.bookings).toEqual({ total: 1, upcoming: 1 });
    expect(res.body.data.upcomingBookingDates).toEqual([{ date: OPEN_DAY, count: 1 }]);
    const leads = await admin.get("/api/v1/admin/leads/bookings").query({ showroom: `${RUN}-sby` });
    expect(leads.body.meta.total).toBe(1);
  });
});

describe("quick actions, delete, teaser link", () => {
  it("toggling bookable / status updates the public site immediately", async () => {
    expect((await admin.patch(`${BASE}/${RUN}-sby`).send({ bookable: false })).body.data.bookableNow).toBe(false);
    expect((await booking(`${RUN}-sby`, OPEN_DAY, "11:00", "203.0.113.43")).body.code).toBe("SHOWROOM_UNAVAILABLE");
    await admin.patch(`${BASE}/${RUN}-sby`).send({ bookable: true, status: "TEMPORARILY_CLOSED" });
    const pub = await request(app).get("/api/v1/public/showrooms");
    expect(pub.body.items.find((s: { id: string }) => s.id === `${RUN}-sby`)).toMatchObject({ status: "TEMPORARILY_CLOSED", bookable: false });
    await admin.patch(`${BASE}/${RUN}-sby`).send({ status: "CLOSED" });
    expect((await request(app).get("/api/v1/public/showrooms")).body.items.map((s: { id: string }) => s.id)).not.toContain(`${RUN}-sby`);
    expect((await admin.patch(`${BASE}/${RUN}-sby`).send({ status: "OPEN" })).status).toBe(200);
  });

  it("quick actions keep the rules: an incomplete showroom cannot be shown", async () => {
    const res = await admin.patch(`${BASE}/${RUN}-mdn`).send({ isPublic: true, status: "OPEN" });
    expect(res.status).toBe(400);
    expect(res.body.details.map((d: { path: string }) => d.path)).toEqual(expect.arrayContaining(["streetAddress", "lat"]));
    const teaserCard = await admin.patch(`${BASE}/${RUN}-mdn`).send({ isPublic: true });
    expect(teaserCard.status).toBe(200); // "Segera hadir" boleh tampil hanya dengan nama kota
    const pub = await request(app).get("/api/v1/public/showrooms");
    expect(pub.body.items.find((s: { id: string }) => s.id === `${RUN}-mdn`)).toMatchObject({ status: "COMING_SOON", bookable: false, city: "Medan" });
  });

  it("a showroom with bookings cannot be deleted", async () => {
    const res = await admin.delete(`${BASE}/${RUN}-sby`);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/Closed/);
  });

  it("linked teasers copy the showroom's address and contacts and follow later edits", async () => {
    const t = await admin.get("/api/v1/admin/teasers/showroom-options");
    expect(t.status).toBe(200);
    expect(t.body.items.map((s: { id: string }) => s.id)).toContain(`${RUN}-mdn`);
    const base = teaserPayload(`${RUN}-teaser`);
    const created = await admin.post("/api/v1/admin/teasers").send({ ...base, showroomId: `${RUN}-mdn`, whatsapp: "0811111111111", streetAddress: "ketik manual" });
    expect(created.status, JSON.stringify(created.body)).toBe(201);
    expect(created.body.data).toMatchObject({ showroomId: `${RUN}-mdn`, showroomName: "Wedison Medan", whatsapp: "6281234567890", streetAddress: "" });

    const full = (await admin.get(`${BASE}/${RUN}-mdn`)).body.data;
    const { id: _id, createdAt: _c, updatedAt: _u, tzLabel: _t, bookableNow: _b, visible: _v, bookings: _k, teasers: _s, linkedTeasers, upcomingBookingDates: _d, ...edit } = full;
    expect(linkedTeasers).toHaveLength(1);
    const upd = await admin.put(`${BASE}/${RUN}-mdn`).send({ ...edit, whatsapp: "0899 1111 2222", streetAddress: "Jl. Gatot Subroto No. 5", addressLocality: "Medan", email: edit.email ?? "", phone: edit.phone ?? "", mapsUrl: edit.mapsUrl ?? "", photoUrl: edit.photoUrl ?? "" });
    expect(upd.status, JSON.stringify(upd.body)).toBe(200);
    expect(upd.body.data.syncedTeasers).toBe(1);
    expect(upd.body.data.linkedTeasers).toHaveLength(1);
    expect(Array.isArray(upd.body.data.upcomingBookingDates)).toBe(true);
    const teaser = await prisma.showroomTeaser.findUnique({ where: { id: created.body.data.id } });
    expect(teaser).toMatchObject({ whatsapp: "6289911112222", streetAddress: "Jl. Gatot Subroto No. 5" });

    // Hapus showroom tanpa booking: teaser tetap ada, tautannya dilepas.
    expect((await admin.delete(`${BASE}/${RUN}-mdn`)).status).toBe(200);
    expect((await prisma.showroomTeaser.findUnique({ where: { id: created.body.data.id } }))?.showroomId).toBeNull();
  });
});

describe("permissions", () => {
  it("module access, write and delete are separate; Leads and Teasers get options without the module", async () => {
    const viewer = await userWith("sviewer", ["showrooms.view"]);
    const writer = await userWith("swriter", ["showrooms.write"]);
    const leads = await userWith("sleads", ["leads.view"]);
    const teaser = await userWith("steaser", ["teasers.write"]);
    expect((await viewer.get(BASE)).status).toBe(200);
    expect((await viewer.post(BASE).send(payload({ id: `${RUN}-v` }))).status).toBe(403);
    expect((await viewer.patch(`${BASE}/${RUN}-sby`).send({ bookable: false })).status).toBe(403);
    expect((await writer.patch(`${BASE}/${RUN}-sby`).send({ bookable: true })).status).toBe(200);
    expect((await writer.delete(`${BASE}/${RUN}-sby`)).status).toBe(403);
    expect((await leads.get(BASE)).status).toBe(403);
    const opts = await leads.get("/api/v1/admin/leads/showrooms");
    expect(opts.status).toBe(200);
    expect(opts.body.items.find((s: { id: string }) => s.id === "bali")).toMatchObject({ tzLabel: "WITA" });
    expect((await teaser.get("/api/v1/admin/teasers/showroom-options")).status).toBe(200);
    expect((await teaser.get(BASE)).status).toBe(403);
  });
});
