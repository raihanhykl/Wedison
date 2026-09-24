import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { env, isProd } from "../config/env.js";

// Prisma 7 wajib driver adapter. Satu pool `pg` untuk seluruh proses.
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({
  adapter,
  log: isProd ? ["error"] : ["warn", "error"],
});

export type { Prisma } from "../generated/prisma/client.js";
