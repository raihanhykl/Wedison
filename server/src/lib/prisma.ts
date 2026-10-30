import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { env, isProd } from "../config/env.js";
import { auditExtension } from "./audit.js";

// Prisma 7 wajib driver adapter. Satu pool `pg` untuk seluruh proses.
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

const base = new PrismaClient({
  adapter,
  log: isProd ? ["error"] : ["warn", "error"],
});

/** Client with the audit extension: createdById / updatedById are stamped automatically. */
export const prisma = base.$extends(auditExtension);

export type { Prisma, Showroom, ShowroomTeaser } from "../generated/prisma/client.js";
