/**
 * HR: multiple To/CC recipients (settings + per job), created/updated-by audit, job list sort &
 * date filters, and overview filters. Real Express app + local DB; everything created here is
 * prefixed with the run id and removed afterwards; HR settings are restored.
 */
import "dotenv/config";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { invalidate, CacheTags } from "../src/lib/cache.js";

const app = createApp();
const RUN = `t${Date.now().toString(36)}`;
const ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL ?? "admin@wedison.co").toLowerCase();
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Wedison2026!";
const PASSWORD = "Str0ngPassw0rd!";
type Agent = ReturnType<typeof request.agent>;

async function login(email: string, password = PASSWORD): Promise<Agent> {
  const agent = request.agent(app);
  const res = await agent.post("/api/v1/auth/login").send({ email, password });
  expect(res.status, JSON.stringify(res.body)).toBe(200);
  return agent;
}

let admin: Agent;
let adminId: string;
let savedSettings: unknown;
let hadSettings = false;
let deptA: string;
let deptB: string;
let locId: string;
const jobIds: string[] = [];

const tr = (title: string) => [{ locale: "id", title, summary: "Ringkasan lowongan untuk pengujian otomatis.", responsibilities: ["Tugas"], qualifications: ["Syarat"] }];
async function createJob(agent: Agent, body: Record<string, unknown>) {
  const res = await agent.post("/api/v1/admin/hr/jobs").send({ translations: tr(`${RUN} job`), locationIds: [locId], ...body });
  if (res.status === 201) jobIds.push(res.body.data.id);
  return res;
}

beforeAll(async () => {
  admin = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
  adminId = (await prisma.user.findUniqueOrThrow({ where: { email: ADMIN_EMAIL } })).id;
  const row = await prisma.setting.findUnique({ where: { key: "hr_settings" } });
  hadSettings = !!row;
  savedSettings = row?.value;
  deptA = (await prisma.jobDepartment.create({ data: { slug: `${RUN}-a`, nameId: `${RUN} Divisi A` } })).id;
  deptB = (await prisma.jobDepartment.create({ data: { slug: `${RUN}-b`, nameId: `${RUN} Divisi B` } })).id;
  locId = (await prisma.jobLocation.create({ data: { slug: `${RUN}-jkt`, city: `${RUN} Jakarta`, country: "Indonesia", countryCode: "ID" } })).id;
});

afterAll(async () => {
  await prisma.job.deleteMany({ where: { OR: [{ id: { in: jobIds } }, { slug: { startsWith: RUN } }] } });
  await prisma.jobDepartment.deleteMany({ where: { slug: { startsWith: RUN } } });
  await prisma.jobLocation.deleteMany({ where: { slug: { startsWith: RUN } } });
  await prisma.user.deleteMany({ where: { email: { endsWith: "@hrtest.wedison.local" } } });
  await prisma.role.deleteMany({ where: { key: { startsWith: RUN } } });
  if (hadSettings) await prisma.setting.update({ where: { key: "hr_settings" }, data: { value: savedSettings as object } });
  else await prisma.setting.deleteMany({ where: { key: "hr_settings" } });
  invalidate([CacheTags.jobs], { notifyFrontend: false });
  await prisma.$disconnect();
});

describe("HR settings: multiple recipients", () => {
  it("saves several To and CC addresses, normalized", async () => {
    const res = await admin.put("/api/v1/admin/hr/settings").send({
      contactEmails: ["HR@wedison.co", "recruitment@wedison.co", "hr@wedison.co"],
      ccEmails: ["Lead@wedison.co", "ops@wedison.co"],
    });
    expect(res.status, JSON.stringify(res.body)).toBe(200);
    expect(res.body.data.contactEmails).toEqual(["hr@wedison.co", "recruitment@wedison.co"]);
    expect(res.body.data.ccEmails).toEqual(["lead@wedison.co", "ops@wedison.co"]);
    expect((await admin.get("/api/v1/admin/hr/settings")).body.data.ccEmails).toEqual(["lead@wedison.co", "ops@wedison.co"]);
  });

  it("rejects empty To, invalid addresses and To/CC overlap", async () => {
    expect((await admin.put("/api/v1/admin/hr/settings").send({ contactEmails: [] })).status).toBe(400);
    expect((await admin.put("/api/v1/admin/hr/settings").send({ contactEmails: ["nope"] })).status).toBe(400);
    const both = await admin.put("/api/v1/admin/hr/settings").send({ contactEmails: ["a@wedison.co"], ccEmails: ["A@wedison.co"] });
    expect(both.status).toBe(400);
    expect(JSON.stringify(both.body)).toMatch(/already an application email/);
  });

  it("reads legacy single-address settings and never fails on bad stored data", async () => {
    await prisma.setting.upsert({ where: { key: "hr_settings" }, update: { value: { contactEmail: "legacy@wedison.co", ccEmail: "cc@wedison.co" } }, create: { key: "hr_settings", value: { contactEmail: "legacy@wedison.co", ccEmail: "cc@wedison.co" } } });
    let res = await admin.get("/api/v1/admin/hr/settings");
    expect(res.body.data).toMatchObject({ contactEmails: ["legacy@wedison.co"], ccEmails: ["cc@wedison.co"] });

    // Overlap stored directly in the DB: dropped from CC instead of a 500 on the careers page.
    await prisma.setting.update({ where: { key: "hr_settings" }, data: { value: { contactEmails: ["x@wedison.co"], ccEmails: ["x@wedison.co", "y@wedison.co"], emailSubjectId: 12345 } } });
    invalidate([CacheTags.jobs], { notifyFrontend: false });
    res = await admin.get("/api/v1/admin/hr/settings");
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ contactEmails: ["x@wedison.co"], ccEmails: ["y@wedison.co"], emailSubjectId: "Lamaran Pekerjaan - {title}" });
    const pub = await request(app).get("/api/v1/public/careers").query({ locale: "id" });
    expect(pub.status).toBe(200);
    expect(pub.body.settings).toMatchObject({ contactEmails: ["x@wedison.co"], ccEmails: ["y@wedison.co"], contactEmail: "x@wedison.co" });
  });
});

describe("job recipients + audit", () => {
  it("stores per-job To and CC lists and validates them", async () => {
    const ok = await createJob(admin, { applyEmails: ["Team@wedison.co", "team@wedison.co", "lead@wedison.co"], ccEmails: ["boss@wedison.co"] });
    expect(ok.status, JSON.stringify(ok.body)).toBe(201);
    expect(ok.body.data.applyEmails).toEqual(["team@wedison.co", "lead@wedison.co"]);
    expect(ok.body.data.ccEmails).toEqual(["boss@wedison.co"]);
    expect((await createJob(admin, { applyEmails: ["bad"] })).status).toBe(400);
    expect((await createJob(admin, { applyEmails: ["a@wedison.co"], ccEmails: ["a@wedison.co"] })).status).toBe(400);
    expect((await createJob(admin, { ccEmails: Array.from({ length: 11 }, (_, i) => `c${i}@wedison.co`) })).status).toBe(400);
    const none = await createJob(admin, {});
    expect(none.body.data).toMatchObject({ applyEmails: [], ccEmails: [] });
  });

  it("records createdBy/updatedBy across edit, transition, duplicate and user deletion", async () => {
    const role = await prisma.role.create({ data: { key: `${RUN}_hr`, name: `${RUN} HR`, permissions: ["hr.view", "hr.jobs.write", "hr.jobs.publish"] } });
    const bcrypt = (await import("bcryptjs")).default;
    const other = await prisma.user.create({ data: { email: `${RUN}@hrtest.wedison.local`, name: `${RUN} Recruiter`, roleId: role.id, passwordHash: await bcrypt.hash(PASSWORD, 4) } });
    const recruiter = await login(other.email);

    const created = await createJob(admin, { departmentId: deptA });
    const id = created.body.data.id;
    expect(created.body.data.createdBy).toMatchObject({ id: adminId });
    expect(created.body.data.updatedBy).toMatchObject({ id: adminId });
    expect(created.body.data.createdBy).not.toHaveProperty("passwordHash");

    const edited = await recruiter.put(`/api/v1/admin/hr/jobs/${id}`).send({ translations: tr(`${RUN} job edited`), locationIds: [locId], departmentId: deptA });
    expect(edited.status, JSON.stringify(edited.body)).toBe(200);
    expect(edited.body.data.createdBy.id).toBe(adminId);
    expect(edited.body.data.updatedBy.id).toBe(other.id);
    expect(new Date(edited.body.data.updatedAt) >= new Date(created.body.data.updatedAt)).toBe(true);

    const pub = await admin.post(`/api/v1/admin/hr/jobs/${id}/transition`).send({ action: "publish" });
    expect(pub.status, JSON.stringify(pub.body)).toBe(200);
    expect(pub.body.data.updatedBy.id).toBe(adminId);

    const dup = await recruiter.post(`/api/v1/admin/hr/jobs/${id}/duplicate`);
    expect(dup.status).toBe(201);
    jobIds.push(dup.body.data.id);
    expect(dup.body.data.createdBy.id).toBe(other.id);

    // Public payload never exposes who edited the job.
    invalidate([CacheTags.jobs], { notifyFrontend: false });
    const detail = await request(app).get(`/api/v1/public/careers/${pub.body.data.slug}`).query({ locale: "id" });
    expect(detail.status).toBe(200);
    expect(JSON.stringify(detail.body)).not.toMatch(/createdBy|updatedBy|hrtest\.wedison\.local/);

    // Deleting the user keeps the job and clears the reference.
    await prisma.user.delete({ where: { id: other.id } });
    const after = await admin.get(`/api/v1/admin/hr/jobs/${dup.body.data.id}`);
    expect(after.status).toBe(200);
    expect(after.body.data.createdBy).toBeNull();
    expect(after.body.data.createdById).toBeNull();
  });

  it("public careers exposes job recipients", async () => {
    const j = await createJob(admin, { applyEmails: ["pub@wedison.co"], ccEmails: ["pubcc@wedison.co"] });
    await admin.post(`/api/v1/admin/hr/jobs/${j.body.data.id}/transition`).send({ action: "publish" });
    invalidate([CacheTags.jobs], { notifyFrontend: false });
    const res = await request(app).get(`/api/v1/public/careers/${j.body.data.slug}`).query({ locale: "id" });
    const job = res.body.data?.job ?? res.body.job ?? res.body.data;
    expect(job).toMatchObject({ applyEmails: ["pub@wedison.co"], ccEmails: ["pubcc@wedison.co"], applyEmail: "pub@wedison.co" });
  });
});

describe("job list: sort and date filters", () => {
  const ids: string[] = [];
  beforeAll(async () => {
    const dates = ["2025-01-10T02:00:00Z", "2025-03-10T02:00:00Z", "2025-06-10T02:00:00Z"];
    for (const [i, d] of dates.entries()) {
      const r = await createJob(admin, { departmentId: deptB, translations: tr(`${RUN} sorted ${i}`) });
      ids.push(r.body.data.id);
      await prisma.$executeRaw`UPDATE "Job" SET "createdAt" = ${new Date(d)}, "viewCount" = ${(i + 1) * 10} WHERE "id" = ${r.body.data.id}`;
    }
  });
  const list = (query: Record<string, string>) => admin.get("/api/v1/admin/hr/jobs").query({ departmentId: deptB, limit: "50", ...query });

  it("sorts by createdAt and viewCount in both directions", async () => {
    expect((await list({ sort: "createdAt", order: "asc" })).body.items.map((j: { id: string }) => j.id)).toEqual(ids);
    expect((await list({ sort: "createdAt", order: "desc" })).body.items.map((j: { id: string }) => j.id)).toEqual([...ids].reverse());
    expect((await list({ sort: "viewCount", order: "desc" })).body.items.map((j: { id: string }) => j.id)).toEqual([...ids].reverse());
    expect((await list({ sort: "applyClicks", order: "desc" })).status).toBe(200);
    expect((await list({ sort: "closesAt", order: "asc" })).status).toBe(200);
  });

  it("filters by a date-time range on the chosen field (inclusive)", async () => {
    const r = await list({ dateField: "createdAt", from: "2025-03-10T02:00:00Z", to: "2025-06-10T02:00:00Z", sort: "createdAt", order: "asc" });
    expect(r.body.items.map((j: { id: string }) => j.id)).toEqual(ids.slice(1));
    const hour = await list({ dateField: "createdAt", from: "2025-03-10T01:00:00Z", to: "2025-03-10T01:59:59Z" });
    expect(hour.body.items).toHaveLength(0);
    expect((await list({ from: "2025-06-01T00:00:00Z", to: "2025-01-01T00:00:00Z" })).status).toBe(400);
    expect((await list({ sort: "password" })).status).toBe(400);
    expect((await list({ dateField: "deletedAt", from: "2025-01-01T00:00:00Z" })).status).toBe(400);
    expect((await list({ from: "not-a-date" })).status).toBe(400);
  });
});

describe("overview filters", () => {
  let jobA: string;
  let jobB: string;
  beforeAll(async () => {
    jobA = (await createJob(admin, { departmentId: deptA, translations: tr(`${RUN} overview A`) })).body.data.id;
    jobB = (await createJob(admin, { departmentId: deptB, employmentType: "INTERNSHIP", translations: tr(`${RUN} overview B`) })).body.data.id;
    await prisma.jobApplyClick.createMany({
      data: [
        { jobId: jobA, channel: "email", createdAt: new Date("2025-05-01T03:00:00Z") },
        { jobId: jobA, channel: "email", createdAt: new Date("2025-05-02T20:00:00Z") }, // 03:00 WIB on 3 May
        { jobId: jobA, channel: "LinkedIn", createdAt: new Date("2025-05-20T03:00:00Z") },
        { jobId: jobB, channel: "email", createdAt: new Date("2025-05-02T03:00:00Z") },
      ],
    });
  });
  const ov = (query: Record<string, string>) => admin.get("/api/v1/admin/hr/overview").query(query);

  it("counts apply clicks inside the range and per WIB day", async () => {
    const r = await ov({ from: "2025-05-01T00:00:00+07:00", to: "2025-05-03T23:59:59+07:00", departmentId: deptA });
    expect(r.status, JSON.stringify(r.body)).toBe(200);
    expect(r.body.data.applyClicks).toBe(2);
    expect(r.body.data.clicksByChannel).toEqual([{ channel: "email", count: 2 }]);
    const days = Object.fromEntries(r.body.data.clicksPerDay.map((d: { day: string; value: number }) => [d.day, d.value]));
    expect(days).toEqual({ "2025-05-01": 1, "2025-05-02": 0, "2025-05-03": 1 });
    expect(r.body.data.clicksPerDay.reduce((s: number, d: { value: number }) => s + d.value, 0)).toBe(r.body.data.applyClicks);
    const row = r.body.data.jobs.find((j: { id: string }) => j.id === jobA);
    expect(row).toMatchObject({ applyClicks: 2, createdBy: expect.any(String) });
    expect(r.body.data.jobs.some((j: { id: string }) => j.id === jobB)).toBe(false);
  });

  it("applies job filters to clicks and rejects bad input", async () => {
    const intern = await ov({ from: "2025-05-01T00:00:00Z", to: "2025-05-31T00:00:00Z", employmentType: "INTERNSHIP", departmentId: deptB });
    expect(intern.body.data.applyClicks).toBe(1);
    expect((await ov({ from: "2025-06-01T00:00:00Z", to: "2025-05-01T00:00:00Z" })).status).toBe(400);
    expect((await ov({ employmentType: "SLAVE" })).status).toBe(400);
    expect((await ov({ from: "garbage" })).status).toBe(400);
  });

  it("all time starts at the first record; default is the last 30 days", async () => {
    const all = await ov({ allTime: "true", departmentId: deptA });
    expect(all.body.data.applyClicks).toBe(3);
    expect(new Date(all.body.data.range.from) <= new Date("2025-05-01T03:00:00Z")).toBe(true);
    const def = await ov({ departmentId: deptA });
    expect(def.status).toBe(200);
    expect(def.body.data.applyClicks).toBe(0);
    expect(def.body.data.clicksPerDay.length).toBeGreaterThanOrEqual(30);
  });
});
