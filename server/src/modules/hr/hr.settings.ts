import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { emailList, overlap } from "../../lib/email-list.js";
import { logger } from "../../lib/logger.js";

/** HR contact & application settings, stored in the Setting table (key "hr_settings"). */
export const portalSchema = z.object({
  name: z.string().trim().min(1).max(40),
  url: z.string().trim().url().max(500),
  enabled: z.boolean().default(true),
});

const settingsObject = z.object({
  contactName: z.string().trim().max(80).default("Tim HR Wedison"),
  /** Penerima lamaran (To). Minimal satu. */
  contactEmails: emailList({ min: 1, label: "Application email" }).default(["hr@wedison.co"]),
  /** CC untuk setiap lamaran (opsional). */
  ccEmails: emailList({ label: "CC" }).default([]),
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

function legacyMap(v: unknown) {
  if (!v || typeof v !== "object") return v;
  const o = { ...(v as Record<string, unknown>) };
  if (o.contactEmails === undefined && typeof o.contactEmail === "string" && o.contactEmail.trim()) o.contactEmails = [o.contactEmail];
  if (o.ccEmails === undefined && typeof o.ccEmail === "string" && o.ccEmail.trim()) o.ccEmails = [o.ccEmail];
  delete o.contactEmail;
  delete o.ccEmail;
  return o;
}

/**
 * Settings dulu menyimpan satu `contactEmail` dan satu `ccEmail`. Nilai lama dipetakan ke daftar
 * baru saat dibaca/disimpan, jadi data lama di tabel Setting tidak perlu dimigrasi manual.
 */
export const hrSettingsSchema = z
  .preprocess(legacyMap, settingsObject)
  .superRefine((v, ctx) => {
    const both = overlap(v.contactEmails, v.ccEmails);
    if (both.length) ctx.addIssue({ code: "custom", path: ["ccEmails"], message: `${both.join(", ")} is already an application email; remove it from CC` });
  });
export type HrSettings = z.infer<typeof hrSettingsSchema>;

/** Same mapping without the To/CC overlap rule and with per-field fallbacks (reading only). */
const hrSettingsLenient = z.unknown().transform((v) => {
  const mapped = legacyMap(v) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, field] of Object.entries(settingsObject.shape)) {
    const r = (field as z.ZodTypeAny).safeParse(mapped?.[k]);
    out[k] = r.success ? r.data : (field as z.ZodTypeAny).parse(undefined);
  }
  return settingsObject.parse(out);
});

const KEY = "hr_settings";

/**
 * Read settings. Never throws on bad stored data (the public careers page depends on this):
 * an address that is both To and CC is dropped from CC, and anything unparseable falls back
 * to the defaults field by field.
 */
export async function getHrSettings(): Promise<HrSettings> {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  const raw = (row?.value as object | undefined) ?? {};
  const strict = hrSettingsSchema.safeParse(raw);
  if (strict.success) return strict.data;
  const lenient = hrSettingsLenient.safeParse(raw);
  if (lenient.success) {
    const to = new Set(lenient.data.contactEmails);
    return { ...lenient.data, ccEmails: lenient.data.ccEmails.filter((e) => !to.has(e)) };
  }
  logger.warn({ issues: strict.error.issues }, "hr_settings tidak valid, memakai default");
  return hrSettingsSchema.parse({});
}

export async function saveHrSettings(value: HrSettings) {
  await prisma.setting.upsert({ where: { key: KEY }, update: { value: value as object }, create: { key: KEY, value: value as object } });
  return value;
}
