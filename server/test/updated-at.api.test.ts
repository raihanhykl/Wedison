/**
 * Regresi: membuka artikel / lowongan di situs publik menambah viewCount TANPA mengubah
 * updatedAt (kolom "Updated" di admin, lastmod sitemap, dateModified artikel). Sebelumnya
 * prisma.update() menyetel @updatedAt setiap halaman di-render ulang (ISR / deploy).
 */
import "dotenv/config";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { invalidate, CacheTags } from "../src/lib/cache.js";

const app = createApp();
const RUN = `t${Date.now().toString(36)}`;
const OLD = new Date("2026-01-15T03:00:00.000Z");

afterAll(async () => {
  await prisma.article.deleteMany({ where: { translations: { some: { slug: { startsWith: RUN } } } } });
  await prisma.job.deleteMany({ where: { slug: { startsWith: RUN } } });
  await prisma.$disconnect();
});

describe("public views do not touch updatedAt", () => {
  it("article detail increments views only", async () => {
    const a = await prisma.article.create({
      data: {
        status: "PUBLISHED",
        publishedAt: OLD,
        translations: { create: { locale: "id", title: `${RUN} artikel`, slug: `${RUN}-artikel`, content: {}, contentHtml: "<p>Isi</p>" } },
      },
    });
    // Tetapkan updatedAt lama lewat SQL (Prisma akan menimpanya bila lewat update()).
    await prisma.$executeRaw`UPDATE "Article" SET "updatedAt" = ${OLD} WHERE "id" = ${a.id}`;
    invalidate([CacheTags.articles], { notifyFrontend: false });

    for (let i = 0; i < 3; i++) expect((await request(app).get(`/api/v1/public/articles/${RUN}-artikel`).query({ locale: "id" })).status).toBe(200);
    await new Promise((r) => setTimeout(r, 300)); // increment fire-and-forget
    const after = await prisma.article.findUniqueOrThrow({ where: { id: a.id } });
    expect(after.viewCount).toBe(3);
    expect(after.updatedAt.toISOString()).toBe(OLD.toISOString());
  });

  it("job detail increments views only", async () => {
    const j = await prisma.job.create({
      data: {
        slug: `${RUN}-lowongan`,
        status: "PUBLISHED",
        publishedAt: OLD,
        translations: { create: { locale: "id", title: `${RUN} lowongan`, summary: "Ringkasan lowongan uji." } },
      },
    });
    await prisma.$executeRaw`UPDATE "Job" SET "updatedAt" = ${OLD} WHERE "id" = ${j.id}`;
    invalidate([CacheTags.jobs], { notifyFrontend: false });

    for (let i = 0; i < 2; i++) expect((await request(app).get(`/api/v1/public/careers/${RUN}-lowongan`).query({ locale: "id" })).status).toBe(200);
    await new Promise((r) => setTimeout(r, 300));
    const after = await prisma.job.findUniqueOrThrow({ where: { id: j.id } });
    expect(after.viewCount).toBe(2);
    expect(after.updatedAt.toISOString()).toBe(OLD.toISOString());
  });
});
