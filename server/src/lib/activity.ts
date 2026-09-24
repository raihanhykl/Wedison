import type { Request } from "express";
import { prisma } from "./prisma.js";
import { logger } from "./logger.js";

/** Catat aktivitas admin (fire-and-forget; jangan gagalkan request utama). */
export function logActivity(
  req: Request,
  data: { action: string; entity: string; entityId?: string | null; summary?: string; meta?: unknown },
) {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.ip;
  prisma.activityLog
    .create({
      data: {
        userId: req.user?.id ?? null,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId ?? null,
        summary: data.summary,
        meta: data.meta === undefined ? undefined : (JSON.parse(JSON.stringify(data.meta)) as object),
        ip: ip ?? null,
      },
    })
    .catch((err) => logger.warn({ err }, "gagal mencatat activity log"));
}
