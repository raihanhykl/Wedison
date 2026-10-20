/**
 * Integration tests for the Pricing module. Runs the real Express app against the local
 * database (server/.env). Rows created here are prefixed with the run id and removed afterwards.
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

type Agent = ReturnType<typeof request.agent>;
let admin: Agent;
let regionId = "";
let schemeId = "";

beforeAll(async () => {
  admin = request.agent(app);
  const res = await admin.post("/api/v1/auth/login").send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  expect(res.status, JSON.stringify(res.body)).toBe(200);
});

afterAll(async () => {
  await prisma.priceRegion.deleteMany({ where: { slug: { startsWith: RUN } } });
  await prisma.pricingScheme.deleteMany({ where: { slug: { startsWith: RUN } } });
  invalidate([CacheTags.pricing], { notifyFrontend: false });
  await prisma.$disconnect();
});

describe("pricing admin", () => {
  it("requires login", async () => {
    const res = await request(app).get("/api/v1/admin/pricing");
    expect(res.status).toBe(401);
  });

  it("returns everything in one call", async () => {
    const res = await admin.get("/api/v1/admin/pricing");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("regions");
    expect(res.body.data).toHaveProperty("schemes");
    expect(res.body.data).toHaveProperty("entries");
    expect(res.body.data).toHaveProperty("terms");
    expect(res.body.data.settings.supercharge.tariff).toHaveProperty("athena");
  });

  it("creates a region and a scheme", async () => {
    const r = await admin.post("/api/v1/admin/pricing/regions").send({ slug: `${RUN}-surabaya`, nameId: "Surabaya", nameEn: "Surabaya", priceLabelId: "Harga OTR Surabaya", priceLabelEn: "OTR price, Surabaya", sortOrder: 50 });
    expect(r.status, JSON.stringify(r.body)).toBe(201);
    regionId = r.body.data.id;
    const dup = await admin.post("/api/v1/admin/pricing/regions").send({ slug: `${RUN}-surabaya`, nameId: "Surabaya", nameEn: "Surabaya" });
    expect(dup.status).toBe(409);

    const s = await admin.post("/api/v1/admin/pricing/schemes").send({ slug: `${RUN}-promo`, kind: "PURCHASE", nameId: "Promo Tes", nameEn: "Test Promo", audience: "ALL", isPublic: false, sortOrder: 50 });
    expect(s.status, JSON.stringify(s.body)).toBe(201);
    schemeId = s.body.data.id;
  });

  it("rejects purchase rows where net != OTR - discount", async () => {
    const res = await admin.put("/api/v1/admin/pricing/entries").send({ regionId, schemeId, rows: [{ model: "BEES", variant: "SINGLE", otrPrice: 21900000, discount: 2400000, netPrice: 1 }] });
    expect(res.status).toBe(400);
  });

  it("upserts price rows and terms", async () => {
    const res = await admin.put("/api/v1/admin/pricing/entries").send({
      regionId,
      schemeId,
      rows: [
        { model: "BEES", variant: "SINGLE", otrPrice: 21900000, discount: 2400000, netPrice: 19500000 },
        { model: "ATHENA", variant: "REGULAR", otrPrice: 36900000, discount: 3300000, netPrice: 33600000 },
      ],
    });
    expect(res.status, JSON.stringify(res.body)).toBe(200);
    expect(res.body.items).toHaveLength(2);

    // Upsert again with a changed number -> same row count, new value.
    const again = await admin.put("/api/v1/admin/pricing/entries").send({ regionId, schemeId, rows: [{ model: "BEES", variant: "SINGLE", otrPrice: 21900000, discount: 2900000, netPrice: 19000000 }] });
    expect(again.status).toBe(200);
    const rows = await prisma.priceEntry.findMany({ where: { regionId, schemeId } });
    expect(rows).toHaveLength(2);
    expect(rows.find((r) => r.model === "BEES")?.netPrice).toBe(19000000);

    const terms = await admin.put("/api/v1/admin/pricing/terms").send({ regionId, schemeId, includedId: ["2x Kunci mekanik"], includedEn: ["2x Mechanical keys"], termsId: ["Promo terbatas."], termsEn: ["Limited promo."], partners: ["Kredivo"], validFrom: "2026-10-01T00:00:00.000Z" });
    expect(terms.status, JSON.stringify(terms.body)).toBe(200);
    expect(terms.body.data.partners).toEqual(["Kredivo"]);
  });

  it("hides non-public schemes from the public snapshot and exposes public ones", async () => {
    const hidden = await request(app).get("/api/v1/public/pricing/");
    expect(hidden.status).toBe(200);
    expect(hidden.body.schemes.some((s: { slug: string }) => s.slug === `${RUN}-promo`)).toBe(false);

    const pub = await admin.patch(`/api/v1/admin/pricing/schemes/${schemeId}`).send({ isPublic: true });
    expect(pub.status).toBe(200);
    const shown = await request(app).get("/api/v1/public/pricing/");
    const scheme = shown.body.schemes.find((s: { slug: string }) => s.slug === `${RUN}-promo`);
    expect(scheme).toMatchObject({ kind: "purchase", audience: "all" });
    const entry = shown.body.entries.find((e: { region: string; scheme: string; model: string }) => e.scheme === `${RUN}-promo` && e.model === "bees");
    expect(entry).toMatchObject({ region: `${RUN}-surabaya`, variant: "single", netPrice: 19000000 });
    expect(shown.body.settings.supercharge.tariff.edpower).toBeGreaterThan(0);
  });

  it("saves settings with validation", async () => {
    const current = await admin.get("/api/v1/admin/pricing/settings");
    expect(current.status).toBe(200);
    const bad = await admin.put("/api/v1/admin/pricing/settings").send({ ...current.body.data, supercharge: { ...current.body.data.supercharge, tariff: { ...current.body.data.supercharge.tariff, athena: -1 } } });
    expect(bad.status).toBe(400);
    const ok = await admin.put("/api/v1/admin/pricing/settings").send(current.body.data);
    expect(ok.status).toBe(200);
  });

  it("deletes the test region and scheme (cascade)", async () => {
    const r = await admin.delete(`/api/v1/admin/pricing/regions/${regionId}`);
    expect(r.status).toBe(200);
    const s = await admin.delete(`/api/v1/admin/pricing/schemes/${schemeId}`);
    expect(s.status).toBe(200);
    expect(await prisma.priceEntry.count({ where: { regionId } })).toBe(0);
  });
});
