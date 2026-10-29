/**
 * Integration tests for the Showroom Teaser module (admin CRUD, publish workflow, permissions,
 * public endpoints, inquiry attribution). Runs the real Express app against the local database
 * (server/.env). Every row is prefixed with the run id and removed afterwards.
 */
import "dotenv/config";
import request from "supertest";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { content, teaserPayload } from "./teasers.fixture.js";

const app = createApp();
const RUN = `t${Date.now().toString(36)}`;
const ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL ?? "admin@wedison.co").toLowerCase();
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Wedison2026!";
const PASSWORD = "Str0ngPassw0rd!";
const BASE = "/api/v1/admin/teasers";

type Agent = ReturnType<typeof request.agent>;
async function login(email: string, password = PASSWORD): Promise<Agent> {
  const agent = request.agent(app);
  const res = await agent.post("/api/v1/auth/login").send({ email, password });
  expect(res.status, `login ${email}: ${JSON.stringify(res.body)}`).toBe(200);
  return agent;
}
const userEmail = (slug: string) => `${RUN}-${slug}@test.wedison.local`;

const payload = (over: Record<string, unknown> = {}) => ({ ...teaserPayload(`${RUN}-sby`), city: `${RUN} Surabaya`, ...over });

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
  const teasers = await prisma.showroomTeaser.findMany({ where: { slug: { startsWith: RUN } }, select: { id: true } });
  await prisma.contactSubmission.deleteMany({ where: { OR: [{ source: { in: teasers.map((t) => `teaser-${t.id}`) } }, { email: { endsWith: "@test.wedison.local" } }] } });
  await prisma.showroomTeaser.deleteMany({ where: { slug: { startsWith: RUN } } });
  await prisma.user.deleteMany({ where: { email: { endsWith: "@test.wedison.local" } } });
  await prisma.role.deleteMany({ where: { id: { in: roleIds } } });
  await prisma.$disconnect();
});

describe("create + validation", () => {
  it("creates a draft, normalizes WhatsApp/email and keeps the schedule in the showroom time zone", async () => {
    const res = await admin.post(BASE).send(payload());
    expect(res.status, JSON.stringify(res.body)).toBe(201);
    const t = res.body.data;
    expect(t).toMatchObject({ status: "DRAFT", whatsapp: "6285286126550", email: "support@wedison.co", startDate: "2030-11-28", startTime: "10:00", endTime: "17:00", inquiries: 0 });
    expect(new Date(t.startAt).toISOString()).toBe("2030-11-28T03:00:00.000Z"); // 10:00 WIB = 03:00 UTC
    expect(t.source).toBe(`teaser-${t.id}`);
    expect(t.issues).toEqual([]);
    // Slot gambar yang tidak dikirim = null (default di halaman publik)
    expect(t.images).toMatchObject({ heroDesktop: "/api/uploads/hero.webp", promo: null });
  });

  it("converts WITA correctly", async () => {
    const res = await admin.post(BASE).send(payload({ slug: `${RUN}-mks`, timeZone: "Asia/Makassar", startTime: "09:30", endTime: "12:00" }));
    expect(res.status).toBe(201);
    expect(new Date(res.body.data.startAt).toISOString()).toBe("2030-11-28T01:30:00.000Z");
    const again = await admin.get(`${BASE}/${res.body.data.id}`);
    expect(again.body.data).toMatchObject({ startTime: "09:30", timeZone: "Asia/Makassar" });
  });

  it("rejects bad input with field details", async () => {
    const cases: [Record<string, unknown>, string][] = [
      [{ slug: "Surabaya Baru" }, "slug"],
      [{ slug: `${RUN}-x`, whatsapp: "12345" }, "whatsapp"],
      [{ slug: `${RUN}-x`, email: "nope" }, "email"],
      [{ slug: `${RUN}-x`, startTime: "25:00" }, "startTime"],
      [{ slug: `${RUN}-x`, mapsUrl: "http://insecure.example" }, "mapsUrl"],
      [{ slug: `${RUN}-x`, images: { hero: "x", heroDesktop: "javascript:alert(1)" } }, "images.heroDesktop"],
      [{ slug: `${RUN}-x`, models: ["athena", "athena"] }, "models"],
      [{ slug: `${RUN}-x`, timeZone: "Europe/London" }, "timeZone"],
    ];
    for (const [over, path] of cases) {
      const res = await admin.post(BASE).send(payload(over));
      expect(res.status, `${path}: ${JSON.stringify(res.body)}`).toBe(400);
      expect(res.body.details.map((d: { path: string }) => d.path)).toContain(path);
    }
  });

  it("rejects duplicate and reserved slugs; check-slug reports availability", async () => {
    const dup = await admin.post(BASE).send(payload());
    expect(dup.status).toBe(409);
    expect((await admin.post(BASE).send(payload({ slug: "preview" }))).status).toBe(400);
    const taken = await admin.get(`${BASE}/check-slug`).query({ slug: `${RUN}-sby` });
    expect(taken.body.data).toMatchObject({ available: false });
    const free = await admin.get(`${BASE}/check-slug`).query({ slug: `${RUN}-free` });
    expect(free.body.data).toMatchObject({ available: true });
    const bad = await admin.get(`${BASE}/check-slug`).query({ slug: "Bad Slug" });
    expect(bad.body.data.available).toBe(false);
  });

  it("allows an incomplete draft but lists what blocks publishing", async () => {
    const c = content("ID");
    c.hero.title = "";
    c.promo.items = [{ title: "Diskon [Rp X.XXX.XXX]", desc: "x" }];
    const res = await admin.post(BASE).send(payload({ slug: `${RUN}-draft`, streetAddress: "", endTime: "09:00", models: [], content: { id: c, en: content("EN") } }));
    expect(res.status).toBe(201);
    const paths = res.body.data.issues.map((i: { path: string }) => i.path);
    expect(paths).toEqual(expect.arrayContaining(["schedule", "streetAddress", "models", "content.id.hero.title", "content.id"]));
    const pub = await admin.post(`${BASE}/${res.body.data.id}/transition`).send({ action: "publish" });
    expect(pub.status).toBe(400);
    expect(pub.body.details.length).toBeGreaterThanOrEqual(5);
  });
});

describe("publish workflow + public endpoints", () => {
  let id: string;
  const slug = `${RUN}-sby`;

  beforeAll(async () => {
    const list = await admin.get(BASE).query({ q: `${RUN}-sby` });
    id = list.body.items.find((t: { slug: string }) => t.slug === slug).id;
  });

  it("drafts are invisible publicly but available to the admin preview", async () => {
    expect((await request(app).get(`/api/v1/public/teasers/${slug}`)).status).toBe(404);
    const preview = await admin.get(`${BASE}/by-slug/${slug}`);
    expect(preview.status).toBe(200);
    expect(preview.body.data).toMatchObject({ status: "DRAFT", slug, source: `teaser-${id}` });
    expect((await request(app).get(`${BASE}/by-slug/${slug}`)).status).toBe(401);
  });

  it("publishes, shows publicly and in the public list", async () => {
    const res = await admin.post(`${BASE}/${id}/transition`).send({ action: "publish" });
    expect(res.status, JSON.stringify(res.body)).toBe(200);
    expect(res.body.data.status).toBe("PUBLISHED");
    expect(res.body.data.publishedAt).toBeTruthy();
    const pub = await request(app).get(`/api/v1/public/teasers/${slug}`);
    expect(pub.status).toBe(200);
    expect(pub.body.data).toMatchObject({ status: "PUBLISHED", city: `${RUN} Surabaya`, models: ["athena", "victory"], whatsapp: "6285286126550" });
    expect(pub.body.data.content.id.hero.title).toBe("ID hero title");
    expect(pub.body.data).not.toHaveProperty("id");
    const list = await request(app).get("/api/v1/public/teasers");
    expect(list.body.items.map((t: { slug: string }) => t.slug)).toContain(slug);
    expect(list.body.items.map((t: { slug: string }) => t.slug)).not.toContain(`${RUN}-draft`);
  });

  it("a live teaser must stay complete; edits go live immediately", async () => {
    const broken = payload({ streetAddress: "" });
    const bad = await admin.put(`${BASE}/${id}`).send(broken);
    expect(bad.status).toBe(400);
    expect(bad.body.details.map((d: { path: string }) => d.path)).toContain("streetAddress");
    const c = content("ID");
    c.hero.title = "Judul baru";
    const ok = await admin.put(`${BASE}/${id}`).send(payload({ content: { id: c, en: content("EN") } }));
    expect(ok.status).toBe(200);
    // cache publik dibuang saat teaser live diubah
    const pub = await request(app).get(`/api/v1/public/teasers/${slug}`);
    expect(pub.body.data.content.id.hero.title).toBe("Judul baru");
  });

  it("refuses invalid transitions and deleting a live teaser", async () => {
    expect((await admin.post(`${BASE}/${id}/transition`).send({ action: "publish" })).status).toBe(400);
    expect((await admin.post(`${BASE}/${id}/transition`).send({ action: "restore" })).status).toBe(400);
    expect((await admin.post(`${BASE}/${id}/transition`).send({ action: "explode" })).status).toBe(400);
    expect((await admin.delete(`${BASE}/${id}`)).status).toBe(400);
  });

  it("counts inquiries sent from the teaser and labels the source in Leads", async () => {
    const post = (msg: string) =>
      request(app).post("/api/v1/public/leads/contacts").set("x-forwarded-for", "203.0.113.88").send({
        name: "Tes Teaser", email: userEmail("lead"), phone: "081234567890", topic: "Informasi Produk", message: `${RUN} ${msg}`, locale: "id", source: `teaser-${id}`,
      });
    expect((await post("one")).status).toBe(201);
    expect((await post("two")).status).toBe(201);
    const t = await admin.get(`${BASE}/${id}`);
    expect(t.body.data.inquiries).toBe(2);
    const sources = await admin.get("/api/v1/admin/leads/contacts/sources");
    expect(sources.status).toBe(200);
    expect(sources.body.items).toEqual(expect.arrayContaining([expect.objectContaining({ value: `teaser-${id}`, label: `Teaser: ${RUN} Surabaya`, count: 2 })]));
    expect(sources.body.items[0].value).toBe("contact-page");
    const filtered = await admin.get("/api/v1/admin/leads/contacts").query({ source: `teaser-${id}` });
    expect(filtered.body.meta.total).toBe(2);
  });

  it("unpublish hides it, archive redirects, restore returns to draft, then delete", async () => {
    expect((await admin.post(`${BASE}/${id}/transition`).send({ action: "unpublish" })).body.data.status).toBe("DRAFT");
    expect((await request(app).get(`/api/v1/public/teasers/${slug}`)).status).toBe(404);
    expect((await admin.post(`${BASE}/${id}/transition`).send({ action: "archive" })).body.data.status).toBe("ARCHIVED");
    const archived = await request(app).get(`/api/v1/public/teasers/${slug}`);
    expect(archived.status).toBe(200);
    expect(archived.body.data).toEqual({ status: "ARCHIVED", slug });
    expect((await admin.post(`${BASE}/${id}/transition`).send({ action: "restore" })).body.data.status).toBe("DRAFT");
  });

  it("duplicates as a draft with a free slug", async () => {
    const a = await admin.post(`${BASE}/${id}/duplicate`);
    expect(a.status).toBe(201);
    expect(a.body.data).toMatchObject({ status: "DRAFT", slug: `${slug}-copy`, publishedAt: null, inquiries: 0 });
    expect(a.body.data.content).toEqual((await admin.get(`${BASE}/${id}`)).body.data.content);
    const b = await admin.post(`${BASE}/${id}/duplicate`);
    expect(b.body.data.slug).toBe(`${slug}-copy-2`);
  });

  it("lists with status counts and filters", async () => {
    const res = await admin.get(BASE).query({ q: RUN, status: "DRAFT" });
    expect(res.status).toBe(200);
    expect(res.body.items.every((t: { status: string }) => t.status === "DRAFT")).toBe(true);
    expect(res.body.byStatus.DRAFT).toBeGreaterThanOrEqual(1);
  });
});

describe("permissions", () => {
  let viewer: Agent;
  let writer: Agent;
  let publisher: Agent;
  let outsider: Agent;
  let draftId: string;
  let liveId: string;

  beforeAll(async () => {
    viewer = await userWith("tviewer", ["teasers.view"]);
    writer = await userWith("twriter", ["teasers.write"]);
    publisher = await userWith("tpublisher", ["teasers.publish"]);
    outsider = await userWith("toutsider", ["cms.view"]);
    draftId = (await admin.post(BASE).send(payload({ slug: `${RUN}-perm-draft` }))).body.data.id;
    liveId = (await admin.post(BASE).send(payload({ slug: `${RUN}-perm-live` }))).body.data.id;
    expect((await admin.post(`${BASE}/${liveId}/transition`).send({ action: "publish" })).status).toBe(200);
  });

  it("module access requires teasers.view", async () => {
    expect((await outsider.get(BASE)).status).toBe(403);
    expect((await viewer.get(BASE)).status).toBe(200);
    expect((await viewer.get(`${BASE}/permissions`)).body.data).toEqual({ write: false, publish: false, delete: false });
  });

  it("viewer cannot change anything", async () => {
    expect((await viewer.post(BASE).send(payload({ slug: `${RUN}-v` }))).status).toBe(403);
    expect((await viewer.put(`${BASE}/${draftId}`).send(payload({ slug: `${RUN}-perm-draft` }))).status).toBe(403);
    expect((await viewer.post(`${BASE}/${draftId}/duplicate`)).status).toBe(403);
  });

  it("writer edits drafts but cannot publish or touch a live teaser", async () => {
    expect((await writer.get(`${BASE}/permissions`)).body.data).toEqual({ write: true, publish: false, delete: false });
    expect((await writer.put(`${BASE}/${draftId}`).send(payload({ slug: `${RUN}-perm-draft`, city: "Writer edit" }))).status).toBe(200);
    expect((await writer.post(`${BASE}/${draftId}/transition`).send({ action: "publish" })).status).toBe(403);
    expect((await writer.put(`${BASE}/${liveId}`).send(payload({ slug: `${RUN}-perm-live` }))).status).toBe(403);
    expect((await writer.delete(`${BASE}/${draftId}`)).status).toBe(403);
  });

  it("publisher edits live teasers and changes status but cannot delete", async () => {
    expect((await publisher.put(`${BASE}/${liveId}`).send(payload({ slug: `${RUN}-perm-live`, city: "Publisher edit" }))).status).toBe(200);
    expect((await publisher.post(`${BASE}/${liveId}/transition`).send({ action: "archive" })).status).toBe(200);
    expect((await publisher.delete(`${BASE}/${draftId}`)).status).toBe(403);
  });

  it("teaser roles can browse and upload to the media library, but not edit it", async () => {
    expect((await viewer.get("/api/v1/admin/media")).status).toBe(200);
    const png = await sharp({ create: { width: 40, height: 30, channels: 3, background: "#1e5b40" } }).png().toBuffer();
    expect((await viewer.post("/api/v1/admin/media/upload").attach("files", png, "v.png").field("folder", "teasers")).status).toBe(403);
    const up = await writer.post("/api/v1/admin/media/upload").attach("files", png, `${RUN}.png`).field("folder", "teasers");
    expect(up.status, JSON.stringify(up.body)).toBe(201);
    const mediaId = up.body.items[0].id;
    expect(up.body.items[0].url).toMatch(/^\/api\/uploads\//);
    expect((await writer.patch(`/api/v1/admin/media/${mediaId}`).send({ alt: "x" })).status).toBe(403);
    expect((await writer.delete(`/api/v1/admin/media/${mediaId}`)).status).toBe(403);
    expect((await admin.delete(`/api/v1/admin/media/${mediaId}`)).status).toBe(200);
  });

  it("delete permission removes non-live teasers", async () => {
    const deleter = await userWith("tdeleter", ["teasers.delete"]);
    expect((await deleter.delete(`${BASE}/${draftId}`)).status).toBe(200);
    expect((await admin.get(`${BASE}/${draftId}`)).status).toBe(404);
    expect((await deleter.delete(`${BASE}/${draftId}`)).status).toBe(404);
  });
});
