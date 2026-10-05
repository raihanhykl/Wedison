import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

/** HR contact & application settings, stored in the Setting table (key "hr_settings"). */
export const portalSchema = z.object({
  name: z.string().trim().min(1).max(40),
  url: z.string().trim().url().max(500),
  enabled: z.boolean().default(true),
});

export const hrSettingsSchema = z.object({
  contactName: z.string().trim().max(80).default("Tim HR Wedison"),
  contactEmail: z.string().trim().email().default("hr@wedison.co"),
  ccEmail: z.string().trim().email().nullable().optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  whatsapp: z.string().trim().max(30).nullable().optional(),
  /** {title} dan {department} diganti otomatis di tautan email lamaran. */
  emailSubjectId: z.string().trim().max(150).default("Lamaran Pekerjaan - {title}"),
  emailSubjectEn: z.string().trim().max(150).default("Job Application - {title}"),
  /** Catatan di halaman lowongan, mis. "Hanya kandidat terpilih yang akan dihubungi." */
  applicationNoteId: z.string().trim().max(400).nullable().optional(),
  applicationNoteEn: z.string().trim().max(400).nullable().optional(),
  /** Lamaran umum (talent pool) saat tidak ada posisi yang cocok. */
  openApplicationEnabled: z.boolean().default(true),
  /** Portal default (profil perusahaan), tampil di halaman karier. */
  companyPortals: z.array(portalSchema).max(10).default([]),
});
export type HrSettings = z.infer<typeof hrSettingsSchema>;

const KEY = "hr_settings";

export async function getHrSettings(): Promise<HrSettings> {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  return hrSettingsSchema.parse((row?.value as object | undefined) ?? {});
}

export async function saveHrSettings(value: HrSettings) {
  await prisma.setting.upsert({ where: { key: KEY }, update: { value: value as object }, create: { key: KEY, value: value as object } });
  return value;
}
