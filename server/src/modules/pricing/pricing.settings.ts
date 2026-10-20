import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

/**
 * Pengaturan global modul Pricing, disimpan di tabel Setting (key "pricing_settings"):
 * disclaimer, tarif SuperCharge per model, dan program referral. Semua angka yang tampil di
 * situs diambil dari sini + tabel PriceEntry/PricingTerms (tidak ada angka hardcode di FE).
 */
const money = z.number().int().min(0).max(1_000_000_000);

export const pricingSettingsSchema = z.object({
  disclaimerId: z
    .string()
    .trim()
    .max(400)
    .default("Harga dan promo dapat berubah sewaktu-waktu, terbatas waktu dan kuota. Penawaran tertulis diberikan di showroom."),
  disclaimerEn: z
    .string()
    .trim()
    .max(400)
    .default("Prices and promotions may change at any time and are limited by time and quota. Written offers are provided at the showroom."),
  supercharge: z
    .object({
      enabled: z.boolean().default(true),
      unitId: z.string().trim().max(60).default("per sekali charge"),
      unitEn: z.string().trim().max(60).default("per charging session"),
      tariff: z
        .object({
          bees: money.nullable().default(null),
          athena: money.nullable().default(16500),
          victory: money.nullable().default(16500),
          edpower: money.nullable().default(27000),
        })
        .default({ bees: null, athena: 16500, victory: 16500, edpower: 27000 }),
      noteId: z.string().trim().max(240).nullable().default("±15 menit dari 10% ke 80%. Tarif sama di semua stasiun SuperCharge."),
      noteEn: z.string().trim().max(240).nullable().default("About 15 minutes from 10% to 80%. The same tariff applies at every SuperCharge station."),
    })
    .default({}),
  referral: z
    .object({
      enabled: z.boolean().default(true),
      amount: money.default(300000),
      regionSlugs: z.array(z.string().trim().max(60)).default(["jabodetabek"]),
      titleId: z.string().trim().max(120).default("Program Referral"),
      titleEn: z.string().trim().max(120).default("Referral Programme"),
      descriptionId: z
        .string()
        .trim()
        .max(400)
        .default("Bonus Rp 300.000 untuk setiap orang yang Anda referensikan dan memenuhi syarat. Siapa saja boleh ikut, tidak harus pengguna Wedison. Dicairkan maksimal 2 minggu setelah serah terima unit."),
      descriptionEn: z
        .string()
        .trim()
        .max(400)
        .default("A Rp 300,000 bonus for every person you refer who qualifies. Anyone can take part, not only Wedison owners. Paid out within 2 weeks of unit handover."),
    })
    .default({}),
});
export type PricingSettings = z.infer<typeof pricingSettingsSchema>;

const KEY = "pricing_settings";

export async function getPricingSettings(): Promise<PricingSettings> {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  return pricingSettingsSchema.parse((row?.value as object | undefined) ?? {});
}

export async function savePricingSettings(value: PricingSettings) {
  await prisma.setting.upsert({ where: { key: KEY }, update: { value: value as object }, create: { key: KEY, value: value as object } });
  return value;
}
