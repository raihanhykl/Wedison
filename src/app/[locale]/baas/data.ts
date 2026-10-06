// Data komersial BaaS (Battery as a Service) — SATU sumber kebenaran untuk seluruh
// halaman /baas. Angka diambil dari "BaaS Consumer Campaign — Execution Plan" (Sep 2026).
// Aturan kampanye yang dijaga di sini:
//  · Harga unit TIDAK PERNAH tampil tanpa biaya langganan baterai di frame yang sama.
//  · Bees TIDAK termasuk skema (dan tidak mendukung SuperCharge) -> tidak ada di daftar.
//  · Servis gratis TIDAK diiklankan (interval belum ditetapkan).
//  · Program terbatas waktu & kuota -> selalu ada satu baris keterangan.
// Pure data — aman diimpor dari Server Component (metadata/JSON-LD) maupun client.

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
