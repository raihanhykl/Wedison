import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7: URL datasource TIDAK lagi di schema.prisma, tapi di sini (dibaca dari .env).
// `prisma generate` tidak butuh DATABASE_URL -> pakai process.env langsung agar tidak throw.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/wedison_admin",
  },
});
