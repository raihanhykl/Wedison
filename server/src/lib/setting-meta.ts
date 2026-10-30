import { prisma } from "./prisma.js";

/** Who / when for a row in the Setting table (resolved to names by attachAuditUsers). */
export async function settingMeta(key: string) {
  return prisma.setting.findUnique({ where: { key }, select: { createdAt: true, updatedAt: true, createdById: true, updatedById: true } });
}
