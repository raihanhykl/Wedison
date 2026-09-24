import "dotenv/config";
import { z } from "zod";

// Validasi env di startup: gagal cepat dengan pesan jelas daripada error misterius saat runtime.
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().default("127.0.0.1"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET minimal 32 karakter"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_NAME: z.string().default("wd_admin_token"),
  COOKIE_SECURE: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  REVALIDATE_SECRET: z.string().optional(),
  UPLOAD_DIR: z.string().default("uploads"),
  UPLOAD_PUBLIC_PATH: z.string().default("/api/uploads"),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(10),
  CACHE_TTL_PUBLIC: z.coerce.number().int().positive().default(300),
  LOG_LEVEL: z.string().default("info"),
  SEED_ADMIN_EMAIL: z.string().email().default("admin@wedison.co"),
  SEED_ADMIN_PASSWORD: z.string().min(8).default("Wedison2026!"),
  SEED_ADMIN_NAME: z.string().default("Super Admin"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  // eslint-disable-next-line no-console
  console.error(`[env] Konfigurasi tidak valid:\n${issues}`);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
