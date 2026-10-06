/**
 * Seed modul HR: divisi, lokasi, 10 lowongan lama (dulu hardcode di career/data-job.tsx),
 * dan pengaturan kontak HR default. Aman dijalankan di setiap deploy: hanya berjalan SEKALI
 * per database (penanda Setting "hr_seeded"), sehingga data yang diubah/dihapus HR tidak
 * kembali lagi. Jalankan manual: npm run db:seed:hr
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

type JobSeed = { slug: string; title: string; department: string; summary: string; responsibilities: string[]; qualifications: string[]; portals: { name: string; url: string }[] };

const DEPARTMENTS = [
  { slug: "production", nameId: "Produksi", nameEn: "Production" },
  { slug: "sales", nameId: "Penjualan", nameEn: "Sales" },
  { slug: "marketing", nameId: "Pemasaran", nameEn: "Marketing" },
  { slug: "operations", nameId: "Operasional", nameEn: "Operations" },
  { slug: "service", nameId: "Servis & Purnajual", nameEn: "Service & After-sales" },
  { slug: "engineering", nameId: "Engineering", nameEn: "Engineering" },
  { slug: "finance", nameId: "Keuangan", nameEn: "Finance" },
  { slug: "human-resources", nameId: "Sumber Daya Manusia", nameEn: "Human Resources" },
];

const LOCATIONS = [
  { slug: "jakarta", city: "Jakarta Selatan", province: "DKI Jakarta" },
  { slug: "bekasi", city: "Bekasi", province: "Jawa Barat" },
  { slug: "bandung", city: "Bandung", province: "Jawa Barat" },
  { slug: "denpasar", city: "Denpasar", province: "Bali" },
];

// Lokasi lowongan lama tidak tercatat di data lama: disimpulkan dari judul, default Jakarta (HQ).
const JOB_LOCATIONS: Record<string, string[]> = {
  "sales-manager-bandung-shop": ["bandung"],
  "sales-jakarta-bandung": ["jakarta", "bandung"],
};

async function main() {
  const done = await prisma.setting.findUnique({ where: { key: "hr_seeded" } });
  if (done) {
    console.log("HR seed already applied, skipping");
    return;
  }

  for (const [i, d] of DEPARTMENTS.entries()) {
    await prisma.jobDepartment.upsert({ where: { slug: d.slug }, update: {}, create: { ...d, sortOrder: i } });
  }
  for (const [i, l] of LOCATIONS.entries()) {
    await prisma.jobLocation.upsert({ where: { slug: l.slug }, update: {}, create: { ...l, sortOrder: i } });
  }
  const depts = await prisma.jobDepartment.findMany();
  const locs = await prisma.jobLocation.findMany();

  const existingJobs = await prisma.job.count();
  let created = 0;
  if (existingJobs === 0) {
    const jobs = JSON.parse(readFileSync(path.join(__dirname, "seed-data", "jobs.json"), "utf8")) as JobSeed[];
    for (const [i, j] of jobs.entries()) {
      const dept = depts.find((d) => d.nameEn?.toLowerCase().startsWith(j.department.toLowerCase()) || d.slug === j.department.toLowerCase());
      const locSlugs = JOB_LOCATIONS[j.slug] ?? ["jakarta"];
      await prisma.job.create({
        data: {
          slug: j.slug,
          status: "PUBLISHED",
          publishedAt: new Date(),
          departmentId: dept?.id ?? null,
          employmentType: "FULL_TIME",
          workplaceType: "ONSITE",
          portals: j.portals,
          sortOrder: i,
          locations: { connect: locs.filter((l) => locSlugs.includes(l.slug)).map((l) => ({ id: l.id })) },
          // Konten lama berbahasa Inggris -> disimpan sebagai versi EN (halaman /id memakai fallback EN).
          translations: { create: [{ locale: "en", title: j.title, summary: j.summary, responsibilities: j.responsibilities, qualifications: j.qualifications }] },
        },
      });
      created++;
    }
  }

  await prisma.setting.upsert({
    where: { key: "hr_settings" },
    update: {},
    create: {
      key: "hr_settings",
      value: {
        contactName: "Tim HR Wedison",
        contactEmail: "hr@wedison.co",
        emailSubjectId: "Lamaran Pekerjaan - {title}",
        emailSubjectEn: "Job Application - {title}",
        applicationNoteId: "Hanya kandidat yang lolos seleksi administrasi yang akan kami hubungi.",
        applicationNoteEn: "Only shortlisted candidates will be contacted.",
        openApplicationEnabled: true,
        companyPortals: [],
      },
    },
  });
  await prisma.setting.create({ data: { key: "hr_seeded", value: { at: new Date().toISOString(), jobs: created } } });
  console.log(`✔ HR seed: ${DEPARTMENTS.length} divisions, ${LOCATIONS.length} locations, ${created} jobs`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
