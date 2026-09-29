import "dotenv/config";
import { z } from "zod";

// Validasi env di startup: gagal cepat dengan pesan jelas daripada error misterius saat runtime.
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().default("127.0.0.1"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_NAME: z.string().default("wd_admin_token"),
  COOKIE_SECURE: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  REVALIDATE_SECRET: z.string().optional(),
  // Base URL Next untuk webhook revalidate; boleh beberapa, pisahkan koma (mis. instance
  // utama + cadangan di prod). Kosong = FRONTEND_URL. Di VPS pakai http://127.0.0.1:<port>
  // supaya tidak bergantung DNS publik (sebelum cutover, domain prod masih ke hosting lama).
  REVALIDATE_URL: z.string().optional(),
  UPLOAD_DIR: z.string().default("uploads"),
  UPLOAD_PUBLIC_PATH: z.string().default("/api/uploads"),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(10),
  CACHE_TTL_PUBLIC: z.coerce.number().int().positive().default(300),
  LOG_LEVEL: z.string().default("info"),
  // Salt hash IP di log persetujuan cookie (opsional; fallback ke JWT_SECRET).
  CONSENT_IP_SALT: z.string().min(16).optional(),
  SEED_ADMIN_EMAIL: z.string().email().default("admin@wedison.co"),
  SEED_ADMIN_PASSWORD: z.string().min(8).default("Wedison2026!"),
  SEED_ADMIN_NAME: z.string().default("Super Admin"),
  // Booking form -> Google Calendar (service account). Semua opsional: tanpa ini booking tetap
  // tersimpan di DB, hanya tidak disinkronkan ke kalender (calendarStatus = SKIPPED).
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().optional(),
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().optional(),
  GOOGLE_SERVICE_ACCOUNT_JSON_BASE64: z.string().optional(),
  GOOGLE_CALENDAR_ID: z.string().optional(),
  GOOGLE_CALENDAR_ID_JAKARTA: z.string().optional(),
  GOOGLE_CALENDAR_ID_BEKASI: z.string().optional(),
  GOOGLE_CALENDAR_ID_BANDUNG: z.string().optional(),
  GOOGLE_CALENDAR_ID_BALI: z.string().optional(),
  // Verifikasi reCAPTCHA v2 server-side untuk form booking (secret key). Kosong = tidak diverifikasi.
  RECAPTCHA_SECRET_KEY: z.string().optional(),
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
