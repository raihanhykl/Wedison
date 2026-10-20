import { Router } from "express";
import { createHash } from "node:crypto";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { validate, getValidated } from "../../middleware/validate.js";
import { requireAuth, requirePermission } from "../../middleware/auth.js";

// Bukti persetujuan cookie dari banner di situs publik (akuntabilitas UU PDP No. 27/2022).
// Yang disimpan: pilihan per kategori + versi kebijakan + waktu. Tanpa identitas pribadi:
// consentId = UUID acak dari cookie browser, IP hanya disimpan sebagai hash bersalt.

/** Log lebih tua dari ini dihapus otomatis oleh scheduler. */
export const CONSENT_RETENTION_DAYS = 730;

const consentSchema = z.object({
  consentId: z.string().uuid(),
  version: z.coerce.number().int().min(1).max(1000),
  action: z.enum(["ACCEPT_ALL", "REJECT_ALL", "CUSTOM"]),
  analytics: z.boolean(),
  marketing: z.boolean(),
  locale: z.enum(["id", "en"]).optional(),
  path: z.string().trim().max(300).optional(),
});

const consentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { ok: false, code: "RATE_LIMIT", message: "Too many requests." },
});

function hashIp(ip: string | undefined) {
  if (!ip) return null;
  return createHash("sha256").update(`${env.CONSENT_IP_SALT ?? env.JWT_SECRET}:${ip}`).digest("hex");
}

// ── Publik: dipanggil browser (navigator.sendBeacon / fetch keepalive) ──
export const publicConsentRouter = Router();

publicConsentRouter.post("/", consentLimiter, validate(consentSchema), async (req, res, next) => {
  try {
    const body = getValidated<typeof consentSchema>(req);
    await prisma.consentLog.create({
      data: {
        ...body,
        ipHash: hashIp(req.ip),
        userAgent: req.get("user-agent")?.slice(0, 300) ?? null,
      },
    });
    res.setHeader("Cache-Control", "no-store");
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ── Admin: ringkasan untuk audit (tanpa mengekspos ipHash/userAgent) ──
export const consentRouter = Router();
consentRouter.use(requireAuth, requirePermission("consent.view"));

const statsQuery = z.object({ days: z.coerce.number().int().min(1).max(730).default(30) });

consentRouter.get("/stats", validate(statsQuery, "query"), async (req, res, next) => {
  try {
    const { days } = getValidated<typeof statsQuery>(req, "query");
    const since = new Date(Date.now() - days * 86_400_000);
    const where = { createdAt: { gte: since } };
    const [total, byAction, analytics, marketing] = await Promise.all([
      prisma.consentLog.count({ where }),
      prisma.consentLog.groupBy({ by: ["action"], where, _count: { _all: true } }),
      prisma.consentLog.count({ where: { ...where, analytics: true } }),
      prisma.consentLog.count({ where: { ...where, marketing: true } }),
    ]);
    res.json({
      ok: true,
      data: {
        days,
        total,
        byAction: Object.fromEntries(byAction.map((a) => [a.action, a._count._all])),
        analyticsGranted: analytics,
        marketingGranted: marketing,
      },
    });
  } catch (err) {
    next(err);
  }
});

/** Hapus log di luar masa retensi. Dipanggil scheduler. */
export async function purgeOldConsentLogs(): Promise<number> {
  const cutoff = new Date(Date.now() - CONSENT_RETENTION_DAYS * 86_400_000);
  const { count } = await prisma.consentLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
  return count;
}
