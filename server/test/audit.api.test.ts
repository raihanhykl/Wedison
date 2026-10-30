/**
 * "Who" auditing across modules + user soft delete. Real Express app + local DB.
 * Everything created here carries the run id and is removed afterwards.
 */
import "dotenv/config";
import request from "supertest";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { asSystem, runAsUser } from "../src/lib/audit.js";

const app = createApp();
const RUN = `t${Date.now().toString(36)}`;
const UP = RUN.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-8);
const ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL ?? "admin@wedison.co").toLowerCase();
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Wedison2026!";
const PASSWORD = "Str0ngPassw0rd!";
const DOMAIN = "@audit.wedison.local";
type Agent = ReturnType<typeof request.agent>;

async function login(email: string, password = PASSWORD): Promise<Agent> {
  const agent = request.agent(app);
  const res = await agent.post("/api/v1/auth/login").send({ email, password });
  expect(res.status, `login ${email}: ${JSON.stringify(res.body)}`).toBe(200);
  return agent;
}

let admin: Agent;
let adminId: string;
let editorRoleId: string;
let editor: { id: string; email: string };
let editorAgent: Agent;
const mediaIds: string[] = [];

beforeAll(async () => {
  admin = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
  adminId = (await prisma.user.findUniqueOrThrow({ where: { email: ADMIN_EMAIL } })).id;
  editorRoleId = (await prisma.role.create({
    data: { key: `${RUN}_ed`, name: `${RUN} Editor`, permissions: ["dashboard.view", "cms.view", "cms.write", "cms.delete", "supercharge.view", "supercharge.write", "leads.view", "leads.write"] },
  })).id;
  editor = await prisma.user.create({ data: { email: `${RUN}-ed${DOMAIN}`, name: `${RUN} Editor Person`, roleId: editorRoleId, passwordHash: await bcrypt.hash(PASSWORD, 4) } });
  editorAgent = await login(editor.email);
});

afterAll(async () => {
  await prisma.category.deleteMany({ where: { slug: { startsWith: RUN } } });
  await prisma.tag.deleteMany({ where: { slug: { startsWith: RUN } } });
  await prisma.station.deleteMany({ where: { name: { startsWith: RUN } } });
  await prisma.pressCoverage.deleteMany({ where: { url: { contains: RUN } } });
  await prisma.article.deleteMany({ where: { translations: { some: { slug: { startsWith: RUN } } } } });
  await prisma.contactSubmission.deleteMany({ where: { email: { endsWith: DOMAIN } } });
  await prisma.media.deleteMany({ where: { OR: [{ id: { in: mediaIds } }, { originalName: { startsWith: RUN } }] } });
  await prisma.user.deleteMany({ where: { email: { endsWith: DOMAIN } } });
  await prisma.role.deleteMany({ where: { key: { startsWith: RUN } } });
  await prisma.$disconnect();
});

describe("Prisma audit extension", () => {
  it("stamps every write operation for audited models, and only with a user in context", async () => {
    const t = await runAsUser(adminId, () => prisma.tag.create({ data: { slug: `${RUN}-x`, name: `${RUN} x` } }));
    expect(t).toMatchObject({ createdById: adminId, updatedById: adminId });

    const up = await runAsUser(editor.id, () => prisma.tag.update({ where: { id: t.id }, data: { name: `${RUN} x2` } }));
    expect(up).toMatchObject({ createdById: adminId, updatedById: editor.id });

    await runAsUser(adminId, () => prisma.tag.createMany({ data: [{ slug: `${RUN}-m1`, name: `${RUN} m1` }, { slug: `${RUN}-m2`, name: `${RUN} m2` }] }));
    const many = await prisma.tag.findMany({ where: { slug: { in: [`${RUN}-m1`, `${RUN}-m2`] } } });
    expect(many.every((x) => x.createdById === adminId && x.updatedById === adminId)).toBe(true);

    await runAsUser(editor.id, () => prisma.tag.updateMany({ where: { slug: { startsWith: `${RUN}-m` } }, data: { name: `${RUN} m` } }));
    expect((await prisma.tag.findMany({ where: { slug: { startsWith: `${RUN}-m` } } })).every((x) => x.updatedById === editor.id && x.createdById === adminId)).toBe(true);

    const ups = await runAsUser(editor.id, () => prisma.tag.upsert({ where: { slug: `${RUN}-u` }, create: { slug: `${RUN}-u`, name: "u" }, update: { name: "u2" } }));
    expect(ups).toMatchObject({ createdById: editor.id, updatedById: editor.id });
    const ups2 = await runAsUser(adminId, () => prisma.tag.upsert({ where: { slug: `${RUN}-u` }, create: { slug: `${RUN}-u`, name: "u" }, update: { name: "u3" } }));
    expect(ups2).toMatchObject({ createdById: editor.id, updatedById: adminId });

    // Explicit values win; no user (system / public) stamps nothing and keeps the last editor.
    const ex = await runAsUser(adminId, () => prisma.tag.create({ data: { slug: `${RUN}-e`, name: "e", createdById: editor.id } }));
    expect(ex.createdById).toBe(editor.id);
    const sys = await asSystem(() => prisma.tag.update({ where: { id: t.id }, data: { name: `${RUN} sys` } }));
    expect(sys.updatedById).toBe(editor.id);
    const none = await prisma.tag.create({ data: { slug: `${RUN}-n`, name: "n" } });
    expect(none).toMatchObject({ createdById: null, updatedById: null });

    // Interactive transactions keep the context.
    const tx = await runAsUser(editor.id, () => prisma.$transaction(async (c) => c.tag.create({ data: { slug: `${RUN}-tx`, name: "tx" } })));
    expect(tx.createdById).toBe(editor.id);
  });
});

describe("HTTP: created/updated by across modules", () => {
  it("category: creator kept, editor recorded, names resolved in responses", async () => {
    const c = await admin.post("/api/v1/admin/topics").send({ nameId: `${RUN} Topik`, slug: `${RUN}-topik` });
    expect(c.status, JSON.stringify(c.body)).toBe(201);
    expect(c.body.data).toMatchObject({ createdById: adminId, updatedById: adminId, createdBy: { id: adminId, deleted: false } });
    const u = await editorAgent.patch(`/api/v1/admin/topics/${c.body.data.id}`).send({ nameId: `${RUN} Topik 2` });
    expect(u.status).toBe(200);
    expect(u.body.data).toMatchObject({ createdById: adminId, updatedById: editor.id, updatedBy: { name: `${RUN} Editor Person` } });
    const list = await admin.get("/api/v1/admin/topics");
    const row = (list.body.items ?? list.body.data).find((x: { id: string }) => x.id === c.body.data.id);
    expect(row.createdBy.id).toBe(adminId);
    expect(row.updatedBy.id).toBe(editor.id);
    expect(row.createdBy).not.toHaveProperty("passwordHash");
  });

  it("station: create + bulk update record the acting user", async () => {
    const s = await editorAgent.post("/api/v1/admin/stations").send({ id: `T${UP}`, name: `${RUN} Station`, address: "Jl. Uji Coba 1", city: "Jakarta", province: "DKI Jakarta", lat: -6.2, lng: 106.8 });
    expect(s.status, JSON.stringify(s.body)).toBe(201);
    expect(s.body.data.createdById).toBe(editor.id);
    const bulk = await admin.post("/api/v1/admin/stations/bulk").send({ ids: [s.body.data.id], action: "deactivate" });
    expect(bulk.status, JSON.stringify(bulk.body)).toBe(200);
    expect((await prisma.station.findUniqueOrThrow({ where: { id: s.body.data.id } })).updatedById).toBe(adminId);
  });

  it("public submissions have no creator; the admin who handles them is recorded", async () => {
    const pub = await request(app).post("/api/v1/public/leads/contacts").send({ name: "Audit Tes", email: `${RUN}-c${DOMAIN}`, phone: "081234567890", topic: "Tes", message: `Pesan ${RUN}` });
    expect(pub.status).toBe(201);
    const row = await prisma.contactSubmission.findUniqueOrThrow({ where: { id: pub.body.id } });
    expect(row).toMatchObject({ createdById: null, updatedById: null });
    const h = await editorAgent.patch(`/api/v1/admin/leads/contacts/${pub.body.id}`).send({ isHandled: true });
    expect(h.status).toBe(200);
    expect(h.body.data).toMatchObject({ updatedById: editor.id, createdById: null, createdBy: null });
  });

  it("multipart routes (multer) keep the user: media upload", async () => {
    const png = await sharp({ create: { width: 40, height: 40, channels: 3, background: "#225533" } }).png().toBuffer();
    const up = await editorAgent.post("/api/v1/admin/media/upload").field("folder", "tests").attach("files", png, `${RUN}.png`);
    expect(up.status, JSON.stringify(up.body)).toBe(201);
    const m = (up.body.items ?? up.body.data)[0];
    mediaIds.push(m.id);
    const row = await prisma.media.findUniqueOrThrow({ where: { id: m.id } });
    expect(row.createdById).toBe(editor.id);
    expect(row.uploadedById).toBe(editor.id);
  });

  it("auto-publish triggered by opening the list is not attributed to the viewer", async () => {
    const a = await runAsUser(editor.id, () => prisma.article.create({
      data: { status: "SCHEDULED", publishedAt: new Date(Date.now() - 60_000), authorId: editor.id, translations: { create: { locale: "id", title: `${RUN} terjadwal`, slug: `${RUN}-terjadwal`, content: {}, contentHtml: "<p>x</p>" } } },
    }));
    expect((await admin.get("/api/v1/admin/articles")).status).toBe(200);
    const after = await prisma.article.findUniqueOrThrow({ where: { id: a.id } });
    expect(after.status).toBe("PUBLISHED");
    expect(after.updatedById).toBe(editor.id); // not the admin who opened the page
  });

  it("signing in does not change a user's updatedAt", async () => {
    const before = await prisma.user.findUniqueOrThrow({ where: { id: editor.id } });
    await new Promise((r) => setTimeout(r, 20));
    await login(editor.email);
    const after = await prisma.user.findUniqueOrThrow({ where: { id: editor.id } });
    expect(after.updatedAt.toISOString()).toBe(before.updatedAt.toISOString());
    expect(after.lastLoginAt!.getTime()).toBeGreaterThan(before.lastLoginAt?.getTime() ?? 0);
  });
});

describe("user soft delete", () => {
  let victim: { id: string; email: string };
  let victimAgent: Agent;
  let catId: string;
  let tempRole: string;

  beforeAll(async () => {
    tempRole = (await prisma.role.create({ data: { key: `${RUN}_tmp`, name: `${RUN} Temp`, permissions: ["cms.view", "cms.write"] } })).id;
    const res = await admin.post("/api/v1/admin/users").send({ email: `${RUN}-v${DOMAIN}`, name: `${RUN} Victim`, password: PASSWORD, roleId: tempRole });
    expect(res.status, JSON.stringify(res.body)).toBe(201);
    expect(res.body.data.createdBy).toMatchObject({ id: adminId });
    victim = res.body.data;
    victimAgent = await login(victim.email);
    const c = await victimAgent.post("/api/v1/admin/topics").send({ nameId: `${RUN} Jejak`, slug: `${RUN}-jejak` });
    catId = c.body.data.id;
  });

  it("deletes softly: no sign-in, hidden by default, history keeps the name", async () => {
    const del = await admin.delete(`/api/v1/admin/users/${victim.id}`);
    expect(del.status, JSON.stringify(del.body)).toBe(200);
    expect(del.body.data).toMatchObject({ isActive: false, deletedById: adminId, deletedBy: { id: adminId } });
    expect(del.body.data.deletedAt).toBeTruthy();

    expect((await victimAgent.get("/api/v1/auth/me")).status).toBe(401);
    expect((await request(app).post("/api/v1/auth/login").send({ email: victim.email, password: PASSWORD })).status).toBe(401);

    const live = await admin.get("/api/v1/admin/users").query({ q: RUN, limit: 50 });
    expect(live.body.items.some((u: { id: string }) => u.id === victim.id)).toBe(false);
    expect(live.body.deletedCount).toBeGreaterThanOrEqual(1);
    const gone = await admin.get("/api/v1/admin/users").query({ q: RUN, status: "deleted" });
    expect(gone.body.items.map((u: { id: string }) => u.id)).toContain(victim.id);

    const cat = await admin.get("/api/v1/admin/topics");
    const row = (cat.body.items ?? cat.body.data).find((x: { id: string }) => x.id === catId);
    expect(row.createdBy).toMatchObject({ id: victim.id, name: `${RUN} Victim`, deleted: true });
    expect(await prisma.user.findUnique({ where: { id: victim.id } })).not.toBeNull();

    // Role member counts ignore deleted users.
    const roles = await admin.get("/api/v1/admin/roles");
    expect(roles.body.items.find((r: { id: string }) => r.id === tempRole)._count.users).toBe(0);
  });

  it("blocks editing, double delete, self delete and re-using the email; restore brings it back", async () => {
    expect((await admin.patch(`/api/v1/admin/users/${victim.id}`).send({ name: "x y" })).status).toBe(404);
    expect((await admin.delete(`/api/v1/admin/users/${victim.id}`)).status).toBe(409);
    expect((await admin.delete(`/api/v1/admin/users/${adminId}`)).status).toBe(400);
    const dup = await admin.post("/api/v1/admin/users").send({ email: victim.email, name: "Clone", password: PASSWORD, roleId: tempRole });
    expect(dup.status).toBe(409);
    expect(dup.body).toMatchObject({ code: "USER_DELETED", details: { userId: victim.id } });

    const r = await admin.post(`/api/v1/admin/users/${victim.id}/restore`).send({});
    expect(r.status, JSON.stringify(r.body)).toBe(200);
    expect(r.body.data).toMatchObject({ deletedAt: null, isActive: true, role: { id: tempRole } });
    await login(victim.email);
    expect((await admin.post(`/api/v1/admin/users/${victim.id}/restore`).send({})).status).toBe(409);
  });

  it("a role whose only members are deleted can be deleted; restore then requires a new role", async () => {
    expect((await admin.delete(`/api/v1/admin/roles/${tempRole}`)).status).toBe(409); // live member
    expect((await admin.delete(`/api/v1/admin/users/${victim.id}`)).status).toBe(200);
    expect((await admin.delete(`/api/v1/admin/roles/${tempRole}`)).status).toBe(200);
    expect((await prisma.user.findUniqueOrThrow({ where: { id: victim.id } })).roleId).toBeNull();
    expect((await admin.get("/api/v1/admin/users").query({ status: "deleted", q: RUN })).status).toBe(200);

    expect((await admin.post(`/api/v1/admin/users/${victim.id}/restore`).send({})).status).toBe(400);
    expect((await admin.post(`/api/v1/admin/users/${victim.id}/restore`).send({ roleId: "nope" })).status).toBe(400);
    const ok = await admin.post(`/api/v1/admin/users/${victim.id}/restore`).send({ roleId: editorRoleId, isActive: false });
    expect(ok.status).toBe(200);
    expect(ok.body.data).toMatchObject({ isActive: false, role: { id: editorRoleId } });
  });

  it("deleting another manager works while the actor remains a live manager (lockout guard counts live users only)", async () => {
    const mgrRole = await prisma.role.create({ data: { key: `${RUN}_mgr`, name: `${RUN} Mgr`, permissions: ["users.manage"] } });
    const mgr = await prisma.user.create({ data: { email: `${RUN}-mgr${DOMAIN}`, name: `${RUN} Mgr`, roleId: mgrRole.id, passwordHash: await bcrypt.hash(PASSWORD, 4) } });
    const others = await prisma.user.findMany({ where: { isActive: true, deletedAt: null, id: { not: mgr.id }, role: { permissions: { hasSome: ["*", "users.manage"] } } }, select: { id: true } });
    const mgrAgent = await login(mgr.email);
    // Leave one other manager (the target) and make it the only other one.
    const target = await prisma.user.create({ data: { email: `${RUN}-mgr2${DOMAIN}`, name: `${RUN} Mgr2`, roleId: mgrRole.id, passwordHash: await bcrypt.hash(PASSWORD, 4) } });
    await prisma.user.updateMany({ where: { id: { in: others.map((o) => o.id) } }, data: { isActive: false } });
    try {
      expect((await mgrAgent.delete(`/api/v1/admin/users/${target.id}`)).status).toBe(200); // the actor remains a manager
      await prisma.user.update({ where: { id: mgr.id }, data: { isActive: false } });
      const adm = await prisma.user.findMany({ where: { id: { in: others.map((o) => o.id) } } });
      expect(adm.every((u) => !u.isActive)).toBe(true);
    } finally {
      await prisma.user.updateMany({ where: { id: { in: others.map((o) => o.id) } }, data: { isActive: true } });
      await prisma.user.deleteMany({ where: { roleId: mgrRole.id } });
      await prisma.role.delete({ where: { id: mgrRole.id } });
    }
  });
});

describe("dashboard modules follow the role", () => {
  it("returns summaries only for accessible modules and hides other modules' numbers from /stats", async () => {
    // editor role: dashboard + cms + supercharge + leads (no hr, users, activity, pricing…)
    const r = await editorAgent.get("/api/v1/admin/dashboard/modules");
    expect(r.status, JSON.stringify(r.body)).toBe(200);
    expect(r.body.data.modules.map((m: { module: string }) => m.module).sort()).toEqual(["cms", "leads", "supercharge"]);
    expect(r.body.data.canWriteArticles).toBe(true);
    for (const m of r.body.data.modules) for (const s of m.stats) expect(typeof s.value).toBe("number");

    const all = await admin.get("/api/v1/admin/dashboard/modules");
    expect(all.body.data.modules.map((m: { module: string }) => m.module)).toEqual(expect.arrayContaining(["cms", "hr", "users", "activity", "pricing", "showrooms", "teasers"]));

    const st = await editorAgent.get("/api/v1/admin/dashboard/stats");
    expect(st.status).toBe(200);
    expect(st.body.data.recentActivity).toEqual([]); // no activity.view
    expect(st.body.data.access).toMatchObject({ cms: true, leads: true, supercharge: true, activity: false });

    const leadsOnlyRole = await prisma.role.create({ data: { key: `${RUN}_lo`, name: `${RUN} Leads only`, permissions: ["dashboard.view", "leads.view"] } });
    await prisma.user.create({ data: { email: `${RUN}-lo${DOMAIN}`, name: `${RUN} Leads`, roleId: leadsOnlyRole.id, passwordHash: await bcrypt.hash(PASSWORD, 4) } });
    const lo = await login(`${RUN}-lo${DOMAIN}`);
    const lst = await lo.get("/api/v1/admin/dashboard/stats");
    expect(lst.body.data.counts).toMatchObject({ articles: 0, press: 0, stations: 0 });
    expect(lst.body.data.recentArticles).toEqual([]);
    const lmod = await lo.get("/api/v1/admin/dashboard/modules");
    expect(lmod.body.data.modules.map((m: { module: string }) => m.module)).toEqual(["leads"]);
    expect(lmod.body.data.canWriteArticles).toBe(false);
  });

  it("settings responses carry who/when metadata", async () => {
    const before = await admin.get("/api/v1/admin/hr/settings");
    expect(before.status).toBe(200);
    expect(before.body).toHaveProperty("meta");
    const p = await admin.get("/api/v1/admin/pricing/settings");
    expect(p.status).toBe(200);
    expect(p.body).toHaveProperty("meta");
    if (p.body.meta) expect(p.body.meta).toHaveProperty("updatedAt");
  });
});
