/**
 * Integration tests for custom roles & users. Runs the real Express app against the local
 * database (server/.env). Every created row is prefixed with the run id and removed afterwards.
 * The seeded super admin (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD, defaults from prisma/seed.ts)
 * must exist.
 */
import "dotenv/config";
import request from "supertest";
import bcrypt from "bcryptjs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { ALL_PERMISSIONS } from "../src/lib/permissions.js";

const app = createApp();
const RUN = `t${Date.now().toString(36)}`;
const ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL ?? "admin@wedison.co").toLowerCase();
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Wedison2026!";
const PASSWORD = "Str0ngPassw0rd!";

type Agent = ReturnType<typeof request.agent>;
async function login(email: string, password = PASSWORD): Promise<Agent> {
  const agent = request.agent(app);
  const res = await agent.post("/api/v1/auth/login").send({ email, password });
  expect(res.status, `login ${email}: ${JSON.stringify(res.body)}`).toBe(200);
  return agent;
}
const email = (slug: string) => `${RUN}-${slug}@test.wedison.local`;

let admin: Agent;
let superRoleId: string;
const createdRoleIds: string[] = [];
const createdUserIds: string[] = [];

async function createRole(agent: Agent, body: Record<string, unknown>) {
  const res = await agent.post("/api/v1/admin/roles").send({ name: `${RUN} ${body.name}`, ...body, ...(body.name ? { name: `${RUN} ${body.name}` } : {}) });
  if (res.status === 201) createdRoleIds.push(res.body.data.id);
  return res;
}
async function createUser(agent: Agent, body: Record<string, unknown>) {
  const res = await agent.post("/api/v1/admin/users").send({ name: `${RUN} user`, password: PASSWORD, ...body });
  if (res.status === 201) createdUserIds.push(res.body.data.id);
  return res;
}

beforeAll(async () => {
  admin = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
  const roles = await admin.get("/api/v1/admin/roles");
  expect(roles.status).toBe(200);
  superRoleId = roles.body.items.find((r: { key: string }) => r.key === "super_admin").id;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { endsWith: "@test.wedison.local" } } });
  await prisma.role.deleteMany({ where: { OR: [{ name: { startsWith: RUN } }, { key: { startsWith: RUN } }] } });
  await prisma.$disconnect();
});

describe("auth payload", () => {
  it("/auth/me exposes role + permissions", async () => {
    const res = await admin.get("/api/v1/auth/me");
    expect(res.status).toBe(200);
    expect(res.body.data.role).toMatchObject({ key: "super_admin", isSystem: true });
    expect(res.body.data.permissions).toEqual(["*"]);
    expect(res.body.data).not.toHaveProperty("passwordHash");
  });
});

describe("roles CRUD + validation", () => {
  it("lists the catalog", async () => {
    const res = await admin.get("/api/v1/admin/roles/catalog");
    expect(res.status).toBe(200);
    expect(res.body.data.modules.map((m: { key: string }) => m.key)).toContain("cms");
    expect(res.body.data.colors).toContain("emerald");
  });

  it("creates a role with implied permissions, auto key, and rejects duplicates", async () => {
    const res = await createRole(admin, { name: "Finance Team", permissions: ["cms.delete", "leads.view"], color: "amber" });
    expect(res.status, JSON.stringify(res.body)).toBe(201);
    expect(res.body.data.key).toBe(`${RUN}_finance_team`);
    expect(res.body.data.permissions).toEqual(["cms.view", "cms.write", "cms.delete", "leads.view"]);
    expect(res.body.data._count.users).toBe(0);

    const dupName = await createRole(admin, { name: "finance team", permissions: [] });
    expect(dupName.status).toBe(409);
    const dupKey = await createRole(admin, { name: "Finance 2", key: `${RUN}_finance_team`, permissions: [] });
    expect(dupKey.status).toBe(409);
  });

  it("rejects unknown permissions, wildcard, reserved key, bad key, short name", async () => {
    expect((await createRole(admin, { name: "Bad perm", permissions: ["cms.view", "nope.x"] })).status).toBe(400);
    expect((await createRole(admin, { name: "Wild", permissions: ["*"] })).status).toBe(400);
    expect((await createRole(admin, { name: "Reserved", key: "super_admin", permissions: [] })).status).toBe(400);
    expect((await createRole(admin, { name: "BadKey", key: "Bad Key!", permissions: [] })).status).toBe(400);
    expect((await admin.post("/api/v1/admin/roles").send({ name: "x", permissions: [] })).status).toBe(400);
    expect((await createRole(admin, { name: "BadColor", color: "neon", permissions: [] })).status).toBe(400);
  });

  it("key is immutable, name uniqueness is case-insensitive on update", async () => {
    const a = await createRole(admin, { name: "Alpha", permissions: ["dashboard.view"] });
    const b = await createRole(admin, { name: "Beta", permissions: [] });
    expect((await admin.patch(`/api/v1/admin/roles/${a.body.data.id}`).send({ key: "other_key" })).status).toBe(400);
    expect((await admin.patch(`/api/v1/admin/roles/${a.body.data.id}`).send({ key: a.body.data.key, description: "same key is fine" })).status).toBe(200);
    expect((await admin.patch(`/api/v1/admin/roles/${a.body.data.id}`).send({ name: `${RUN} BETA` })).status).toBe(409);
    expect((await admin.patch(`/api/v1/admin/roles/${b.body.data.id}`).send({ name: `${RUN} Beta` })).status).toBe(200); // own name
  });

  it("system role cannot be edited or deleted", async () => {
    expect((await admin.patch(`/api/v1/admin/roles/${superRoleId}`).send({ name: "Hacked" })).status).toBe(403);
    expect((await admin.patch(`/api/v1/admin/roles/${superRoleId}`).send({ permissions: ["cms.view"] })).status).toBe(403);
    expect((await admin.delete(`/api/v1/admin/roles/${superRoleId}`)).status).toBe(403);
    const still = await prisma.role.findUnique({ where: { id: superRoleId } });
    expect(still?.permissions).toEqual(["*"]);
  });

  it("duplicate copies permissions; duplicating super admin yields every catalog permission", async () => {
    const src = await createRole(admin, { name: "Dup Src", permissions: ["hr.jobs.publish"], color: "teal", description: "d" });
    const copy = await admin.post(`/api/v1/admin/roles/${src.body.data.id}/duplicate`).send({});
    expect(copy.status).toBe(201);
    createdRoleIds.push(copy.body.data.id);
    expect(copy.body.data.name).toBe(`${RUN} Dup Src (copy)`);
    expect(copy.body.data.permissions).toEqual(src.body.data.permissions);
    expect(copy.body.data.isSystem).toBe(false);

    const copy2 = await admin.post(`/api/v1/admin/roles/${src.body.data.id}/duplicate`).send({});
    expect(copy2.status).toBe(201);
    createdRoleIds.push(copy2.body.data.id);
    expect(copy2.body.data.name).toBe(`${RUN} Dup Src (copy 2)`);

    const su = await admin.post(`/api/v1/admin/roles/${superRoleId}/duplicate`).send({ name: `${RUN} Not super` });
    expect(su.status).toBe(201);
    createdRoleIds.push(su.body.data.id);
    expect(su.body.data.isSystem).toBe(false);
    expect(su.body.data.permissions).toEqual(ALL_PERMISSIONS);
    expect(su.body.data.permissions).not.toContain("*");
  });

  it("404 for unknown role ids", async () => {
    expect((await admin.get("/api/v1/admin/roles/does-not-exist")).status).toBe(404);
    expect((await admin.patch("/api/v1/admin/roles/does-not-exist").send({ name: "x y" })).status).toBe(404);
    expect((await admin.delete("/api/v1/admin/roles/does-not-exist")).status).toBe(404);
  });
});

describe("users ↔ roles + enforcement", () => {
  let cmsRole: string;
  let hrRole: string;
  let emptyRole: string;

  beforeAll(async () => {
    cmsRole = (await createRole(admin, { name: "CMS writer", permissions: ["cms.write", "dashboard.view"] })).body.data.id;
    hrRole = (await createRole(admin, { name: "HR staff", permissions: ["hr.jobs.write"] })).body.data.id;
    emptyRole = (await createRole(admin, { name: "Nothing", permissions: [] })).body.data.id;
  });

  it("requires an existing role when creating a user", async () => {
    expect((await createUser(admin, { email: email("norole"), roleId: "missing" })).status).toBe(400);
    expect((await admin.post("/api/v1/admin/users").send({ name: "No role", email: email("norole2"), password: PASSWORD })).status).toBe(400);
  });

  it("permissions gate modules exactly, and changes apply without re-login", async () => {
    const u = await createUser(admin, { email: email("writer"), roleId: cmsRole });
    expect(u.status).toBe(201);
    expect(u.body.data.role.id).toBe(cmsRole);
    const writer = await login(email("writer"));

    expect((await writer.get("/api/v1/admin/articles")).status).toBe(200);
    expect((await writer.get("/api/v1/admin/dashboard/stats")).status).toBe(200);
    expect((await writer.get("/api/v1/admin/hr/jobs")).status).toBe(403);
    expect((await writer.get("/api/v1/admin/leads/contacts")).status).toBe(403);
    expect((await writer.get("/api/v1/admin/users")).status).toBe(403);
    expect((await writer.get("/api/v1/admin/roles")).status).toBe(403);
    expect((await writer.get("/api/v1/admin/activity")).status).toBe(403);
    // write but not delete
    expect((await writer.delete("/api/v1/admin/press/does-not-exist")).status).toBe(403);

    // Grant HR view to the role → immediately effective for the same session
    expect((await admin.patch(`/api/v1/admin/roles/${cmsRole}`).send({ permissions: ["cms.write", "dashboard.view", "hr.view"] })).status).toBe(200);
    expect((await writer.get("/api/v1/admin/hr/jobs")).status).toBe(200);
    const perms = await writer.get("/api/v1/admin/hr/permissions");
    expect(perms.body.data).toMatchObject({ write: false, publish: false, delete: false });

    // Switch the user to the HR role → CMS gone, HR write on
    expect((await admin.patch(`/api/v1/admin/users/${u.body.data.id}`).send({ roleId: hrRole })).status).toBe(200);
    expect((await writer.get("/api/v1/admin/articles")).status).toBe(403);
    expect((await writer.get("/api/v1/admin/hr/permissions")).body.data).toMatchObject({ role: `${RUN}_hr_staff`, write: true, publish: false });

    // Deactivate → every request 401
    expect((await admin.patch(`/api/v1/admin/users/${u.body.data.id}`).send({ isActive: false })).status).toBe(200);
    expect((await writer.get("/api/v1/auth/me")).status).toBe(401);
    expect((await request(app).post("/api/v1/auth/login").send({ email: email("writer"), password: PASSWORD })).status).toBe(401);
  });

  it("a role without permissions can sign in but open nothing except its own account", async () => {
    await createUser(admin, { email: email("nobody"), roleId: emptyRole });
    const nobody = await login(email("nobody"));
    const me = await nobody.get("/api/v1/auth/me");
    expect(me.status).toBe(200);
    expect(me.body.data.permissions).toEqual([]);
    expect((await nobody.get("/api/v1/admin/dashboard/stats")).status).toBe(403);
    expect((await nobody.patch("/api/v1/auth/profile").send({ name: `${RUN} renamed` })).status).toBe(200);
  });

  it("role with members cannot be deleted; after moving them it can", async () => {
    const tmpRole = (await createRole(admin, { name: "Temp", permissions: [] })).body.data.id;
    const u = await createUser(admin, { email: email("member"), roleId: tmpRole });
    const del = await admin.delete(`/api/v1/admin/roles/${tmpRole}`);
    expect(del.status).toBe(409);
    expect(del.body.message).toMatch(/member/);
    expect((await admin.patch(`/api/v1/admin/users/${u.body.data.id}`).send({ roleId: hrRole })).status).toBe(200);
    expect((await admin.delete(`/api/v1/admin/roles/${tmpRole}`)).status).toBe(200);
    expect((await admin.get(`/api/v1/admin/roles/${tmpRole}`)).status).toBe(404);
  });

  it("users.manage alone is enough to manage users & roles; self-protection rules hold", async () => {
    const mgrRole = (await createRole(admin, { name: "People Ops", permissions: ["users.manage"] })).body.data.id;
    const mgrUser = await createUser(admin, { email: email("mgr"), roleId: mgrRole });
    const mgr = await login(email("mgr"));
    expect((await mgr.get("/api/v1/admin/users")).status).toBe(200);
    expect((await mgr.get("/api/v1/admin/roles")).status).toBe(200);
    expect((await mgr.get("/api/v1/admin/dashboard/stats")).status).toBe(403);

    const myId = mgrUser.body.data.id;
    expect((await mgr.patch(`/api/v1/admin/users/${myId}`).send({ roleId: hrRole })).status).toBe(400); // own role
    expect((await mgr.patch(`/api/v1/admin/users/${myId}`).send({ isActive: false })).status).toBe(400); // self deactivate
    expect((await mgr.delete(`/api/v1/admin/users/${myId}`)).status).toBe(400); // self delete
    expect((await mgr.patch(`/api/v1/admin/users/${myId}`).send({ name: `${RUN} Manager`, roleId: mgrRole })).status).toBe(200); // same role ok
  });

  it("never leaves zero active users who can manage users (lockout guard)", async () => {
    // Build an isolated world: a manager role whose only member is the only other manager besides super admins.
    const mgrRole = (await createRole(admin, { name: "Lockout Mgr", permissions: ["users.manage", "cms.view"] })).body.data.id;
    const m = await createUser(admin, { email: email("lock-mgr"), roleId: mgrRole });
    const mgr = await login(email("lock-mgr"));

    // Temporarily deactivate every OTHER manager-capable user (super admins included) directly in the DB.
    const others = await prisma.user.findMany({
      where: { isActive: true, id: { not: m.body.data.id }, role: { permissions: { hasSome: ["*", "users.manage"] } } },
      select: { id: true },
    });
    await prisma.user.updateMany({ where: { id: { in: others.map((o) => o.id) } }, data: { isActive: false } });
    try {
      // Removing users.manage from the role of the last manager must fail and roll back.
      const strip = await mgr.patch(`/api/v1/admin/roles/${mgrRole}`).send({ permissions: ["cms.view"] });
      expect(strip.status).toBe(400);
      expect(strip.body.message).toMatch(/no active user/);
      const role = await prisma.role.findUnique({ where: { id: mgrRole } });
      expect(role?.permissions).toContain("users.manage");
      // The manager can still work (not locked out).
      expect((await mgr.get("/api/v1/admin/roles")).status).toBe(200);
      // A second manager makes the change legal again.
      expect((await createUser(mgr, { email: email("lock-mgr2"), roleId: mgrRole })).status).toBe(201);
      expect((await mgr.patch(`/api/v1/admin/roles/${mgrRole}`).send({ permissions: ["cms.view"] })).status).toBe(400); // both lose it → still zero
    } finally {
      await prisma.user.updateMany({ where: { id: { in: others.map((o) => o.id) } }, data: { isActive: true } });
    }
  });

  it("list filters by role / active and rejects bad query", async () => {
    const res = await admin.get("/api/v1/admin/users").query({ roleId: hrRole, limit: 50 });
    expect(res.status).toBe(200);
    expect(res.body.items.every((u: { role: { id: string } }) => u.role.id === hrRole)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect((await admin.get("/api/v1/admin/users").query({ active: "maybe" })).status).toBe(400);
    const inactive = await admin.get("/api/v1/admin/users").query({ active: "false", q: RUN });
    expect(inactive.body.items.every((u: { isActive: boolean }) => u.isActive === false)).toBe(true);
  });

  it("duplicate email on create/update is rejected", async () => {
    const a = await createUser(admin, { email: email("dupe-a"), roleId: hrRole });
    await createUser(admin, { email: email("dupe-b"), roleId: hrRole });
    expect((await createUser(admin, { email: email("dupe-a").toUpperCase(), roleId: hrRole })).status).toBe(400);
    expect((await admin.patch(`/api/v1/admin/users/${a.body.data.id}`).send({ email: email("dupe-b") })).status).toBe(400);
  });

  it("legacy tokens that still carry a role claim keep working (payload only needs sub)", async () => {
    const jwt = await import("jsonwebtoken");
    const { env } = await import("../src/config/env.js");
    const me = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL }, select: { id: true } });
    const token = jwt.default.sign({ sub: me!.id, role: "SUPER_ADMIN" }, env.JWT_SECRET, { expiresIn: "1h" });
    const res = await request(app).get("/api/v1/auth/me").set("authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.permissions).toEqual(["*"]);
  });
});

describe("public contact form", () => {
  const msg = { name: "Tes Duplikat", email: email("contact"), phone: "081234567890", topic: "Test topic", message: `Pesan uji ${RUN}`, locale: "id" };
  afterAll(async () => { await prisma.contactSubmission.deleteMany({ where: { email: msg.email } }); });

  it("stores once and treats an identical resend as the same submission", async () => {
    const first = await request(app).post("/api/v1/public/leads/contacts").send(msg);
    expect(first.status).toBe(201);
    const again = await request(app).post("/api/v1/public/leads/contacts").send(msg);
    expect(again.status).toBe(200);
    expect(again.body).toMatchObject({ ok: true, id: first.body.id, duplicate: true });
    const different = await request(app).post("/api/v1/public/leads/contacts").send({ ...msg, message: `${msg.message} (edited)` });
    expect(different.status).toBe(201);
    expect(await prisma.contactSubmission.count({ where: { email: msg.email } })).toBe(2);
  });

  it("validates input and ignores honeypot", async () => {
    expect((await request(app).post("/api/v1/public/leads/contacts").send({ ...msg, email: "not-an-email" })).status).toBe(400);
    const bot = await request(app).post("/api/v1/public/leads/contacts").send({ ...msg, message: "bot", website: "http://spam" });
    expect(bot.status).toBe(200);
    expect(bot.body.id).toBeNull();
    expect(await prisma.contactSubmission.count({ where: { email: msg.email, message: "bot" } })).toBe(0);
  });
});
