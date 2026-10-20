// Data komersial BaaS (Battery as a Service) — SATU sumber kebenaran untuk seluruh
// halaman /baas. Angka diambil dari "BaaS Consumer Campaign — Execution Plan" (Sep 2026).
// Aturan kampanye yang dijaga di sini:
//  · Harga unit TIDAK PERNAH tampil tanpa biaya langganan baterai di frame yang sama.
//  · Bees TIDAK termasuk skema (dan tidak mendukung SuperCharge) -> tidak ada di daftar.
//  · Servis gratis TIDAK diiklankan (interval belum ditetapkan).
//  · Program terbatas waktu & kuota -> selalu ada satu baris keterangan.
// Pure data — aman diimpor dari Server Component (metadata/JSON-LD) maupun client.

import type { PublicPricing } from "@/lib/pricing/types";

export type PlanId = "standard" | "extended";
export type ModelId = "victory" | "athena" | "edpower";

export type BaasPlan = {
  id: PlanId;
  /** Biaya langganan baterai per bulan (Rp). */
  monthly: number;
};

export type BaasModel = {
  id: ModelId;
  name: string;
  /** Harga unit motor (Rp), tanpa baterai. */
  unitPrice: number;
  plans: BaasPlan[];
  /** Foto produk (sementara pakai aset halaman produk; ganti dengan aset BaaS bila ada). */
  image: string;
  imageMobile: string;
  href: string;
};

/** Fallback statis (kampanye Sep 2026). Sumber aktif: modul Pricing, lihat baasModelsFrom(). */
export const BAAS_MODELS: BaasModel[] = [
  {
    id: "victory",
    name: "Victory",
    unitPrice: 22_000_000,
    plans: [
      { id: "standard", monthly: 390_000 },
      { id: "extended", monthly: 490_000 },
    ],
    image: "/victory/victory-product-hero.webp",
    imageMobile: "/victory/victory-product-hero-mobile.webp",
    href: "/products/victory/",
  },
  {
    id: "athena",
    name: "Athena",
    unitPrice: 24_000_000,
    plans: [{ id: "standard", monthly: 390_000 }],
    image: "/athena/athena-product-hero.webp",
    imageMobile: "/athena/athena-product-hero-mobile.webp",
    href: "/products/athena/",
  },
  {
    id: "edpower",
    name: "EdPower",
    unitPrice: 33_000_000,
    plans: [{ id: "standard", monthly: 750_000 }],
    image: "/edpower/edpower-product-hero.webp",
    imageMobile: "/edpower/edpower-product-hero-mobile.webp",
    href: "/products/edpower/",
  },
];

const BAAS_ORDER: ModelId[] = ["victory", "athena", "edpower"];

/**
 * Bangun daftar model BaaS dari snapshot modul Pricing (skema kind "baas"). Varian regular ->
 * paket "standard", extended -> "extended". Model tanpa baris harga di-skip; kalau snapshot tidak
 * punya skema BaaS sama sekali, pakai BAAS_MODELS statis.
 */
export function baasModelsFrom(pricing: PublicPricing): BaasModel[] {
  const schemes = pricing.schemes.filter((s) => s.kind === "baas").map((s) => s.slug);
  if (schemes.length === 0) return BAAS_MODELS;
  const rows = pricing.entries.filter((e) => schemes.includes(e.scheme) && e.unitPrice != null && e.monthlyFee != null);
  const models = BAAS_ORDER.flatMap((id) => {
    const mine = rows.filter((e) => e.model === id);
    if (mine.length === 0) return [];
    const base = BAAS_MODELS.find((m) => m.id === id)!;
    const plans: BaasPlan[] = [];
    const std = mine.find((e) => e.variant === "regular" || e.variant === "single");
    const ext = mine.find((e) => e.variant === "extended");
    if (std) plans.push({ id: "standard", monthly: std.monthlyFee! });
    if (ext) plans.push({ id: "extended", monthly: ext.monthlyFee! });
    if (plans.length === 0) return [];
    return [{ ...base, unitPrice: (std ?? ext)!.unitPrice!, plans }];
  });
  return models.length > 0 ? models : BAAS_MODELS;
}

export const DEFAULT_MODEL: ModelId = "victory";
export const DEFAULT_PLAN: PlanId = "standard";

/** Nilai adapter pengisian yang digratiskan (Rp). */
export const ADAPTER_VALUE = 1_700_000;
/** Insentif pengisian daya per unit (Rp). */
export const CHARGING_INCENTIVE = 2_000_000;

export function isModelId(v: string | null | undefined): v is ModelId {
  return BAAS_MODELS.some((m) => m.id === v);
}
export function isPlanId(v: string | null | undefined): v is PlanId {
  return v === "standard" || v === "extended";
}

/** Setara harian: bulanan / 30, dibulatkan ke ribuan terdekat (390.000 -> 13.000). */
export function perDay(monthly: number): number {
  return Math.round(monthly / 30 / 1000) * 1000;
}

/** Format rupiah: "Rp 22.000.000" (id) / "Rp 22,000,000" (en). */
export function rupiah(value: number, locale: "id" | "en" = "id"): string {
  const n = new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    maximumFractionDigits: 0,
  }).format(value);
  return `Rp ${n}`;
}

/** "Rp 22 juta" / "Rp 22 million" untuk ringkasan pendek. */
export function rupiahShort(value: number, locale: "id" | "en" = "id"): string {
  const juta = value / 1_000_000;
  const n = new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    maximumFractionDigits: 1,
  }).format(juta);
  return locale === "id" ? `Rp ${n} juta` : `Rp ${n} million`;
}
