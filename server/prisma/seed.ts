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
type StationSeed = {
  id: string; slug: string; name: string; status: string; address: string; city: string; province: string;
  piles_total: number; power_kw: number; hours: string; type_tier: string; lat: number; lng: number; amenities?: string[]; photo?: string;
};

async function main() {
  // 1) Super admin
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@wedison.co").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Wedison2026!";
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: process.env.SEED_ADMIN_NAME ?? "Super Admin", role: "SUPER_ADMIN", passwordHash: await bcrypt.hash(password, 12) },
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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
