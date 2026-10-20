/**
 * Seed awal: super admin + kategori default + data lama (liputan pers, post Instagram,
 * 85 lokasi SuperCharge) yang sebelumnya hardcoded di frontend. Idempotent (upsert).
 * Jalankan: npm run db:seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { fetchPageMetadata } from "../src/lib/metadata.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const read = <T>(f: string): T => JSON.parse(readFileSync(path.join(__dirname, "seed-data", f), "utf8")) as T;

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

type PressSeed = { url: string; slug: string; author: string | null; excerpt: string };
type PricingSeed = {
  regions: { slug: string; nameId: string; nameEn: string; priceLabelId: string; priceLabelEn: string; coverageId?: string | null; coverageEn?: string | null; salesWhatsapp?: string | null; isDefault: boolean; sortOrder: number }[];
  schemes: { slug: string; kind: "PURCHASE" | "RENT_TO_OWN" | "RENTAL" | "B2B_CREDIT" | "BAAS"; nameId: string; nameEn: string; taglineId?: string | null; taglineEn?: string | null; descriptionId?: string | null; descriptionEn?: string | null; audience: "ALL" | "OJOL" | "B2B"; isPublic: boolean; sortOrder: number }[];
  entries: { region: string; scheme: string; model: "BEES" | "ATHENA" | "VICTORY" | "EDPOWER"; variant?: "SINGLE" | "REGULAR" | "EXTENDED"; otrPrice?: number; discount?: number; netPrice?: number; dailyFee?: number; downPayment?: number; termMonths?: number; installment24?: number; installment36?: number; unitPrice?: number; monthlyFee?: number }[];
  terms: { region: string; scheme: string; includedId: string[]; includedEn: string[]; termsId: string[]; termsEn: string[]; partners: string[]; validFrom: string | null; validUntil: string | null; noteId: string | null; noteEn: string | null }[];
};
type StationSeed = {
  id: string; slug: string; name: string; status: string; address: string; city: string; province: string;
  piles_total: number; power_kw: number; hours: string; type_tier: string; lat: number; lng: number; amenities?: string[]; photo?: string;
};

async function main() {
  // 1) Super admin
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@wedison.co").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Wedison2026!";
  // Role bawaan dibuat oleh migrasi `custom_roles`; pastikan super_admin ada (DB baru).
  const superRole = await prisma.role.upsert({
    where: { key: "super_admin" },
    update: { permissions: ["*"], isSystem: true },
    create: { id: "role_super_admin", key: "super_admin", name: "Super Admin", description: "Full access to every module, including users and roles.", color: "emerald", permissions: ["*"], isSystem: true },
  });
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: process.env.SEED_ADMIN_NAME ?? "Super Admin", roleId: superRole.id, passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`✔ admin: ${admin.email}`);

  // 2) Kategori default
  const categories = [
    { slug: "berita", nameId: "Berita", nameEn: "News", sortOrder: 0 },
    { slug: "produk", nameId: "Produk", nameEn: "Products", sortOrder: 1 },
    { slug: "supercharge", nameId: "SuperCharge", nameEn: "SuperCharge", sortOrder: 2 },
    { slug: "event", nameId: "Event", nameEn: "Events", sortOrder: 3 },
    { slug: "tips", nameId: "Tips & Panduan", nameEn: "Tips & Guides", sortOrder: 4 },
  ];
  for (const c of categories) await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  console.log(`✔ ${categories.length} kategori`);

  // 3) Liputan pers (scrape metadata bila online; kalau gagal tetap disimpan dengan judul dari slug)
  const press = read<PressSeed[]>("press.json");
  for (const p of press) {
    const exists = await prisma.pressCoverage.findUnique({ where: { url: p.url } });
    if (exists) continue;
    let meta: Awaited<ReturnType<typeof fetchPageMetadata>> | null = null;
    try {
      meta = await fetchPageMetadata(p.url, 12000);
    } catch (e) {
      console.warn(`  ! metadata gagal untuk ${p.url}: ${(e as Error).message}`);
    }
    await prisma.pressCoverage.create({
      data: {
        url: p.url,
        slug: p.slug,
        title: meta?.title || p.slug.replace(/-/g, " "),
        excerpt: p.excerpt,
        description: meta?.description || null,
        imageUrl: meta?.image ?? null,
        siteName: meta?.siteName || new URL(p.url).hostname.replace(/^www\./, ""),
        author: p.author ?? meta?.author ?? null,
        publishedAt: meta?.publishedAt ? new Date(meta.publishedAt) : null,
        status: "PUBLISHED",
        fetchedAt: meta ? new Date() : null,
      },
    });
  }
  console.log(`✔ ${press.length} liputan pers`);

  // 4) Post Instagram (thumbnail diambil lewat tombol "Refresh" di admin agar seed cepat)
  const social = read<string[]>("social.json");
  for (const [i, url] of social.entries()) {
    const shortcode = url.match(/\/(p|reel)\/([^/?#]+)/)?.[2] ?? null;
    await prisma.socialPost.upsert({
      where: { url },
      update: {},
      create: { platform: "INSTAGRAM", url, externalId: shortcode, sortOrder: i, isActive: true, thumbnailUrl: shortcode ? `/instagram/${shortcode}.jpg` : null },
    });
  }
  console.log(`✔ ${social.length} post Instagram`);

  // 5) Lokasi SuperCharge
  const stations = read<StationSeed[]>("stations.json");
  for (const s of stations) {
    await prisma.station.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        slug: s.slug,
        name: s.name,
        status: s.status.toUpperCase() as "OPERATIONAL" | "COMING_SOON" | "MAINTENANCE" | "CLOSED",
        tier: s.type_tier.toUpperCase() as "HUB" | "SHOWROOM" | "MITRA",
        address: s.address,
        city: s.city,
        province: s.province,
        lat: s.lat,
        lng: s.lng,
        pilesTotal: s.piles_total,
        powerKw: s.power_kw,
        hours: s.hours,
        amenities: s.amenities ?? [],
        photoUrl: s.photo ?? null,
      },
    });
  }
  console.log(`✔ ${stations.length} lokasi SuperCharge`);

  // 6) Harga & skema (wilayah × skema × model × varian + S&K). Idempotent: baris yang sudah ada
  //    tidak ditimpa, supaya perubahan dari admin tidak hilang saat seed dijalankan ulang.
  const pricing = read<PricingSeed>("pricing.json");
  for (const r of pricing.regions) await prisma.priceRegion.upsert({ where: { slug: r.slug }, update: {}, create: r });
  for (const sc of pricing.schemes) await prisma.pricingScheme.upsert({ where: { slug: sc.slug }, update: {}, create: sc });
  const regionId = Object.fromEntries((await prisma.priceRegion.findMany({ select: { id: true, slug: true } })).map((r) => [r.slug, r.id]));
  const schemeId = Object.fromEntries((await prisma.pricingScheme.findMany({ select: { id: true, slug: true } })).map((s) => [s.slug, s.id]));
  for (const e of pricing.entries) {
    const { region, scheme, ...data } = e;
    const key = { regionId: regionId[region], schemeId: schemeId[scheme], model: data.model, variant: data.variant ?? "SINGLE" };
    await prisma.priceEntry.upsert({ where: { regionId_schemeId_model_variant: key }, update: {}, create: { ...data, ...key } });
  }
  for (const t of pricing.terms) {
    const { region, scheme, validFrom, validUntil, ...data } = t;
    const key = { regionId: regionId[region], schemeId: schemeId[scheme] };
    await prisma.pricingTerms.upsert({
      where: { regionId_schemeId: key },
      update: {},
      create: { ...data, ...key, validFrom: validFrom ? new Date(validFrom) : null, validUntil: validUntil ? new Date(validUntil) : null },
    });
  }
  console.log(`✔ harga: ${pricing.regions.length} wilayah, ${pricing.schemes.length} skema, ${pricing.entries.length} baris, ${pricing.terms.length} S&K`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
