import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requireModule, requireWrite, requireDelete } from "../../middleware/auth.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";
import { logActivity } from "../../lib/activity.js";
import { notFound, conflict, badRequest } from "../../lib/errors.js";
import { getPricingSettings, pricingSettingsSchema, savePricingSettings } from "./pricing.settings.js";

/**
 * Modul Pricing — wilayah × skema × model × varian + S&K + pengaturan (tarif SuperCharge,
 * referral, disclaimer). Admin: /admin/pricing. Publik: /public/pricing (snapshot untuk ISR).
 */
const MODEL = z.enum(["BEES", "ATHENA", "VICTORY", "EDPOWER"]);
const VARIANT = z.enum(["SINGLE", "REGULAR", "EXTENDED"]);
const KIND = z.enum(["PURCHASE", "RENT_TO_OWN", "RENTAL", "B2B_CREDIT", "BAAS"]);
const AUDIENCE = z.enum(["ALL", "OJOL", "B2B"]);
const slug = z.string().trim().regex(/^[a-z0-9-]{2,60}$/, "lowercase letters, digits and dashes");
const money = z.coerce.number().int().min(0).max(1_000_000_000).nullable().optional();
const lines = z.array(z.string().trim().max(300)).max(40);
const text = (max: number) => z.string().trim().max(max);
const optText = (max: number) => z.string().trim().max(max).nullable().optional();

const regionSchema = z.object({
  slug,
  nameId: text(80).min(2),
  nameEn: text(80).min(2),
  priceLabelId: text(80).default(""),
  priceLabelEn: text(80).default(""),
  coverageId: optText(300),
  coverageEn: optText(300),
  salesWhatsapp: z.string().trim().regex(/^$|^\d{8,16}$/, "digits only, e.g. 628123456789").nullable().optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

const schemeSchema = z.object({
  slug,
  kind: KIND,
  nameId: text(80).min(2),
  nameEn: text(80).min(2),
  taglineId: optText(160),
  taglineEn: optText(160),
  descriptionId: optText(600),
  descriptionEn: optText(600),
  audience: AUDIENCE.default("ALL"),
  isPublic: z.boolean().default(true),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

const entryRow = z.object({
  model: MODEL,
  variant: VARIANT.default("SINGLE"),
  otrPrice: money,
  discount: money,
  netPrice: money,
  dailyFee: money,
  downPayment: money,
  termMonths: z.coerce.number().int().min(1).max(120).nullable().optional(),
  installment24: money,
  installment36: money,
  unitPrice: money,
  monthlyFee: money,
  noteId: optText(200),
  noteEn: optText(200),
  isActive: z.boolean().default(true),
});
const entriesSchema = z.object({ regionId: z.string().min(1), schemeId: z.string().min(1), rows: z.array(entryRow).max(40) });

const termsSchema = z.object({
  regionId: z.string().min(1),
  schemeId: z.string().min(1),
  includedId: lines.default([]),
  includedEn: lines.default([]),
  termsId: lines.default([]),
  termsEn: lines.default([]),
  partners: z.array(z.string().trim().max(80)).max(20).default([]),
  validFrom: z.string().datetime().nullable().optional(),
  validUntil: z.string().datetime().nullable().optional(),
  noteId: optText(400),
  noteEn: optText(400),
});

/** Konsistensi angka beli putus: net = OTR - diskon (kalau ketiganya diisi). */
function checkPurchaseMath(kind: string, rows: z.infer<typeof entryRow>[]) {
  if (kind !== "PURCHASE") return;
  for (const r of rows) {
    if (r.otrPrice != null && r.discount != null && r.netPrice != null && r.otrPrice - r.discount !== r.netPrice) {
      throw badRequest(`${r.model} ${r.variant}: net price must equal OTR minus discount (${r.otrPrice} - ${r.discount} = ${r.otrPrice - r.discount})`);
    }
  }
}

const bust = () => invalidate([CacheTags.pricing, CacheTags.dashboard]);

export const pricingRouter = Router();
pricingRouter.use(requireAuth, requireModule("pricing"));

// Semua data untuk halaman admin dalam satu panggilan.
pricingRouter.get("/", async (_req, res, next) => {
  try {
    const [regions, schemes, entries, terms, settings] = await Promise.all([
      prisma.priceRegion.findMany({ orderBy: [{ sortOrder: "asc" }, { nameId: "asc" }] }),
      prisma.pricingScheme.findMany({ orderBy: [{ sortOrder: "asc" }, { nameId: "asc" }] }),
      prisma.priceEntry.findMany({ orderBy: [{ model: "asc" }, { variant: "asc" }] }),
      prisma.pricingTerms.findMany(),
      getPricingSettings(),
    ]);
    res.json({ ok: true, data: { regions, schemes, entries, terms, settings } });
  } catch (e) {
    next(e);
  }
});

// ── Wilayah ──────────────────────────────────────────────────────────────
pricingRouter.post("/regions", requireWrite("pricing"), validate(regionSchema), async (req, res, next) => {
  try {
    const data = getValidated<typeof regionSchema>(req);
    if (await prisma.priceRegion.findUnique({ where: { slug: data.slug } })) throw conflict(`Region "${data.slug}" already exists`);
    if (data.isDefault) await prisma.priceRegion.updateMany({ data: { isDefault: false } });
    const item = await prisma.priceRegion.create({ data });
    bust();
    logActivity(req, { action: "create", entity: "price_region", entityId: item.id, summary: `Added price region ${item.nameId}` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

pricingRouter.patch("/regions/:id", requireWrite("pricing"), validate(regionSchema.partial()), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = getValidated<typeof regionSchema>(req);
    if (data.slug && (await prisma.priceRegion.findFirst({ where: { slug: data.slug, NOT: { id } } }))) throw conflict(`Region "${data.slug}" already exists`);
    if (data.isDefault) await prisma.priceRegion.updateMany({ where: { NOT: { id } }, data: { isDefault: false } });
    const item = await prisma.priceRegion.update({ where: { id }, data });
    bust();
    logActivity(req, { action: "update", entity: "price_region", entityId: id, summary: `Updated price region ${item.nameId}` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

pricingRouter.delete("/regions/:id", requireDelete("pricing"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const item = await prisma.priceRegion.findUnique({ where: { id } });
    if (!item) throw notFound("Region not found");
    await prisma.priceRegion.delete({ where: { id } });
    bust();
    logActivity(req, { action: "delete", entity: "price_region", entityId: id, summary: `Deleted price region ${item.nameId} (and its prices)` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ── Skema ────────────────────────────────────────────────────────────────
pricingRouter.post("/schemes", requireWrite("pricing"), validate(schemeSchema), async (req, res, next) => {
  try {
    const data = getValidated<typeof schemeSchema>(req);
    if (await prisma.pricingScheme.findUnique({ where: { slug: data.slug } })) throw conflict(`Scheme "${data.slug}" already exists`);
    const item = await prisma.pricingScheme.create({ data });
    bust();
    logActivity(req, { action: "create", entity: "pricing_scheme", entityId: item.id, summary: `Added pricing scheme ${item.nameId}` });
    res.status(201).json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

pricingRouter.patch("/schemes/:id", requireWrite("pricing"), validate(schemeSchema.partial()), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const data = getValidated<typeof schemeSchema>(req);
    if (data.slug && (await prisma.pricingScheme.findFirst({ where: { slug: data.slug, NOT: { id } } }))) throw conflict(`Scheme "${data.slug}" already exists`);
    const item = await prisma.pricingScheme.update({ where: { id }, data });
    bust();
    logActivity(req, { action: "update", entity: "pricing_scheme", entityId: id, summary: `Updated pricing scheme ${item.nameId}` });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

pricingRouter.delete("/schemes/:id", requireDelete("pricing"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const item = await prisma.pricingScheme.findUnique({ where: { id } });
    if (!item) throw notFound("Scheme not found");
    await prisma.pricingScheme.delete({ where: { id } });
    bust();
    logActivity(req, { action: "delete", entity: "pricing_scheme", entityId: id, summary: `Deleted pricing scheme ${item.nameId} (and its prices)` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ── Baris harga: upsert massal per wilayah × skema ───────────────────────
pricingRouter.put("/entries", requireWrite("pricing"), validate(entriesSchema), async (req, res, next) => {
  try {
    const { regionId, schemeId, rows } = getValidated<typeof entriesSchema>(req);
    const [region, scheme] = await Promise.all([
      prisma.priceRegion.findUnique({ where: { id: regionId } }),
      prisma.pricingScheme.findUnique({ where: { id: schemeId } }),
    ]);
    if (!region) throw notFound("Region not found");
    if (!scheme) throw notFound("Scheme not found");
    checkPurchaseMath(scheme.kind, rows);
    const seen = new Set<string>();
    for (const r of rows) {
      const k = `${r.model}:${r.variant}`;
      if (seen.has(k)) throw badRequest(`Duplicate row ${r.model} ${r.variant}`);
      seen.add(k);
    }
    const items = await prisma.$transaction(
      rows.map((r) =>
        prisma.priceEntry.upsert({
          where: { regionId_schemeId_model_variant: { regionId, schemeId, model: r.model, variant: r.variant } },
          update: { ...r },
          create: { ...r, regionId, schemeId },
        }),
      ),
    );
    bust();
    logActivity(req, { action: "update", entity: "price_entry", summary: `Saved ${items.length} price row(s): ${scheme.nameId} · ${region.nameId}`, meta: { regionId, schemeId, rows: rows.length } });
    res.json({ ok: true, items });
  } catch (e) {
    next(e);
  }
});

pricingRouter.delete("/entries/:id", requireWrite("pricing"), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const item = await prisma.priceEntry.findUnique({ where: { id } });
    if (!item) throw notFound("Price row not found");
    await prisma.priceEntry.delete({ where: { id } });
    bust();
    logActivity(req, { action: "delete", entity: "price_entry", entityId: id, summary: `Deleted price row ${item.model} ${item.variant}` });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ── S&K / bonus per wilayah × skema ──────────────────────────────────────
pricingRouter.put("/terms", requireWrite("pricing"), validate(termsSchema), async (req, res, next) => {
  try {
    const { regionId, schemeId, validFrom, validUntil, ...rest } = getValidated<typeof termsSchema>(req);
    const data = { ...rest, validFrom: validFrom ? new Date(validFrom) : null, validUntil: validUntil ? new Date(validUntil) : null };
    const item = await prisma.pricingTerms.upsert({
      where: { regionId_schemeId: { regionId, schemeId } },
      update: data,
      create: { ...data, regionId, schemeId },
    });
    bust();
    logActivity(req, { action: "update", entity: "pricing_terms", entityId: item.id, summary: "Saved pricing terms & benefits", meta: { regionId, schemeId } });
    res.json({ ok: true, data: item });
  } catch (e) {
    next(e);
  }
});

// ── Pengaturan: disclaimer, tarif SuperCharge, referral ──────────────────
pricingRouter.get("/settings", async (_req, res, next) => {
  try {
    res.json({ ok: true, data: await getPricingSettings() });
  } catch (e) {
    next(e);
  }
});

pricingRouter.put("/settings", requireWrite("pricing"), validate(pricingSettingsSchema), async (req, res, next) => {
  try {
    const value = await savePricingSettings(getValidated<typeof pricingSettingsSchema>(req));
    bust();
    logActivity(req, { action: "update", entity: "pricing_settings", summary: "Updated pricing settings (disclaimer / SuperCharge tariff / referral)" });
    res.json({ ok: true, data: value });
  } catch (e) {
    next(e);
  }
});

// ── Publik: snapshot untuk Next.js (ISR, tag "pricing") ──────────────────
const lower = <T extends string>(v: T) => v.toLowerCase();

export const publicPricingRouter = Router();
publicPricingRouter.get("/", async (_req, res, next) => {
  try {
    const data = await cached("public:pricing", [CacheTags.pricing], async () => {
      const [regions, schemes, settings] = await Promise.all([
        prisma.priceRegion.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { nameId: "asc" }] }),
        prisma.pricingScheme.findMany({ where: { isActive: true, isPublic: true }, orderBy: [{ sortOrder: "asc" }, { nameId: "asc" }] }),
        getPricingSettings(),
      ]);
      const regionIds = regions.map((r) => r.id);
      const schemeIds = schemes.map((s) => s.id);
      const [entries, terms] = await Promise.all([
        prisma.priceEntry.findMany({ where: { isActive: true, regionId: { in: regionIds }, schemeId: { in: schemeIds } }, orderBy: [{ model: "asc" }, { variant: "asc" }] }),
        prisma.pricingTerms.findMany({ where: { regionId: { in: regionIds }, schemeId: { in: schemeIds } } }),
      ]);
      const regionSlug = new Map(regions.map((r) => [r.id, r.slug]));
      const schemeSlug = new Map(schemes.map((s) => [s.id, s.slug]));
      const updatedAt = [...regions, ...schemes, ...entries, ...terms].reduce((m, x) => (x.updatedAt > m ? x.updatedAt : m), new Date(0));
      return {
        regions: regions.map((r) => ({
          slug: r.slug,
          name: { id: r.nameId, en: r.nameEn },
          priceLabel: { id: r.priceLabelId, en: r.priceLabelEn },
          coverage: r.coverageId || r.coverageEn ? { id: r.coverageId ?? "", en: r.coverageEn ?? "" } : null,
          salesWhatsapp: r.salesWhatsapp || null,
          isDefault: r.isDefault,
          sortOrder: r.sortOrder,
        })),
        schemes: schemes.map((s) => ({
          slug: s.slug,
          kind: lower(s.kind),
          name: { id: s.nameId, en: s.nameEn },
          tagline: s.taglineId || s.taglineEn ? { id: s.taglineId ?? "", en: s.taglineEn ?? "" } : null,
          description: s.descriptionId || s.descriptionEn ? { id: s.descriptionId ?? "", en: s.descriptionEn ?? "" } : null,
          audience: lower(s.audience),
          sortOrder: s.sortOrder,
        })),
        entries: entries.map((e) => ({
          region: regionSlug.get(e.regionId)!,
          scheme: schemeSlug.get(e.schemeId)!,
          model: lower(e.model),
          variant: lower(e.variant),
          otrPrice: e.otrPrice,
          discount: e.discount,
          netPrice: e.netPrice,
          dailyFee: e.dailyFee,
          downPayment: e.downPayment,
          termMonths: e.termMonths,
          installment24: e.installment24,
          installment36: e.installment36,
          unitPrice: e.unitPrice,
          monthlyFee: e.monthlyFee,
          note: e.noteId || e.noteEn ? { id: e.noteId ?? "", en: e.noteEn ?? "" } : null,
        })),
        terms: terms.map((t) => ({
          region: regionSlug.get(t.regionId)!,
          scheme: schemeSlug.get(t.schemeId)!,
          included: { id: t.includedId, en: t.includedEn },
          terms: { id: t.termsId, en: t.termsEn },
          partners: t.partners,
          validFrom: t.validFrom?.toISOString() ?? null,
          validUntil: t.validUntil?.toISOString() ?? null,
          note: t.noteId || t.noteEn ? { id: t.noteId ?? "", en: t.noteEn ?? "" } : null,
        })),
        settings,
        updatedAt: updatedAt.toISOString(),
      };
    });
    res.json(data);
  } catch (e) {
    next(e);
  }
});
