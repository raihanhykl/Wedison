// Selector & format murni (tanpa React, tanpa server-only) untuk data harga publik.
// Dipakai Server Component (JSON-LD, llms.txt) maupun Client Component (section harga).
import type {
  Bilingual,
  PriceEntry,
  PricingRegion,
  PricingScheme,
  PricingTerms,
  ProductId,
  PublicPricing,
  SchemeKind,
  Variant,
} from "./types";

export type Locale = "id" | "en";

export const PRODUCT_IDS: ProductId[] = ["bees", "athena", "victory", "edpower"];
export const PRODUCT_NAMES: Record<ProductId, string> = { bees: "Bees", athena: "Athena", victory: "Victory", edpower: "EdPower" };
const VARIANT_ORDER: Record<Variant, number> = { single: 0, regular: 1, extended: 2 };

export function isProductId(v: string | null | undefined): v is ProductId {
  return (PRODUCT_IDS as string[]).includes(v ?? "");
}

export const pick = (b: Bilingual | null | undefined, locale: Locale): string => (b ? (locale === "en" ? b.en || b.id : b.id || b.en) : "");
export const pickList = (b: { id: string[]; en: string[] } | null | undefined, locale: Locale): string[] =>
  b ? (locale === "en" ? (b.en.length ? b.en : b.id) : b.id.length ? b.id : b.en) : [];

/** "Rp 19.500.000" (id) / "Rp 19,500,000" (en). */
export function rupiah(value: number, locale: Locale = "id"): string {
  const n = new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", { maximumFractionDigits: 0 }).format(value);
  return `Rp ${n}`;
}

/** "Rp 19,5 jt" (id) / "Rp 19.5M" (en) untuk kartu ringkas; di bawah 1 juta -> "Rp 350 rb" / "Rp 350K". */
export function rupiahShort(value: number, locale: Locale = "id"): string {
  if (value >= 1_000_000) {
    const juta = value / 1_000_000;
    const n = new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", { maximumFractionDigits: 1 }).format(juta);
    return locale === "id" ? `Rp ${n} jt` : `Rp ${n}M`;
  }
  const ribu = Math.round(value / 1000);
  return locale === "id" ? `Rp ${ribu} rb` : `Rp ${ribu}K`;
}

export function sortedRegions(p: PublicPricing): PricingRegion[] {
  return [...p.regions].sort((a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug));
}

export function sortedSchemes(p: PublicPricing): PricingScheme[] {
  return [...p.schemes].sort((a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug));
}

export function defaultRegion(p: PublicPricing): PricingRegion | null {
  const regions = sortedRegions(p);
  return regions.find((r) => r.isDefault) ?? regions[0] ?? null;
}

export function schemeBySlug(p: PublicPricing, slug: string): PricingScheme | null {
  return p.schemes.find((s) => s.slug === slug) ?? null;
}

export function schemesOfKind(p: PublicPricing, kind: SchemeKind): PricingScheme[] {
  return sortedSchemes(p).filter((s) => s.kind === kind);
}

/** Baris harga untuk wilayah × skema × model, urut varian (single, regular, extended). */
export function entriesFor(p: PublicPricing, region: string, scheme: string, model: ProductId): PriceEntry[] {
  return p.entries
    .filter((e) => e.region === region && e.scheme === scheme && e.model === model)
    .sort((a, b) => VARIANT_ORDER[a.variant] - VARIANT_ORDER[b.variant]);
}

export function termsFor(p: PublicPricing, region: string, scheme: string): PricingTerms | null {
  return p.terms.find((t) => t.region === region && t.scheme === scheme) ?? null;
}

/** Skema (publik) yang punya baris harga untuk model ini di wilayah tersebut, urut sortOrder. */
export function schemesFor(p: PublicPricing, region: string, model: ProductId): PricingScheme[] {
  return sortedSchemes(p).filter((s) => p.entries.some((e) => e.region === region && e.scheme === s.slug && e.model === model));
}

/** Wilayah yang punya baris harga untuk model ini (skema apa pun). */
export function regionsWithPrices(p: PublicPricing, model: ProductId): Set<string> {
  return new Set(p.entries.filter((e) => e.model === model).map((e) => e.region));
}

export type StartingPrice = { net: number; otr: number | null; region: PricingRegion; scheme: PricingScheme; variant: Variant };

/**
 * Harga "mulai dari" sebuah model: net terendah skema beli putus (audience umum) di wilayah
 * default; kalau wilayah default tidak punya, ambil terendah di wilayah mana pun.
 */
export function startingPrice(p: PublicPricing, model: ProductId): StartingPrice | null {
  const purchase = schemesOfKind(p, "purchase").filter((s) => s.audience !== "b2b");
  if (purchase.length === 0) return null;
  const def = defaultRegion(p);
  const candidates = (region?: string) =>
    p.entries
      .filter((e) => e.model === model && e.netPrice != null && purchase.some((s) => s.slug === e.scheme) && (!region || e.region === region))
      .sort((a, b) => (a.netPrice ?? 0) - (b.netPrice ?? 0));
  const best = (def ? candidates(def.slug)[0] : undefined) ?? candidates()[0];
  if (!best) return null;
  const region = p.regions.find((r) => r.slug === best.region);
  const scheme = p.schemes.find((s) => s.slug === best.scheme);
  if (!region || !scheme) return null;
  return { net: best.netPrice!, otr: best.otrPrice, region, scheme, variant: best.variant };
}

/** Semua harga "mulai dari" per model (untuk kartu landing / daftar produk). */
export function startingPrices(p: PublicPricing): Record<ProductId, StartingPrice | null> {
  return Object.fromEntries(PRODUCT_IDS.map((m) => [m, startingPrice(p, m)])) as Record<ProductId, StartingPrice | null>;
}

/** Rentang harga net beli putus (umum) sebuah model di semua wilayah, untuk AggregateOffer. */
export function purchaseRange(p: PublicPricing, model: ProductId): { low: number; high: number; count: number } | null {
  const purchase = new Set(schemesOfKind(p, "purchase").filter((s) => s.audience !== "b2b").map((s) => s.slug));
  const nets = p.entries.filter((e) => e.model === model && e.netPrice != null && purchase.has(e.scheme)).map((e) => e.netPrice!);
  if (nets.length === 0) return null;
  return { low: Math.min(...nets), high: Math.max(...nets), count: nets.length };
}

export function superchargeTariff(p: PublicPricing, model: ProductId): number | null {
  if (!p.settings.supercharge.enabled) return null;
  return p.settings.supercharge.tariff[model] ?? null;
}

/** Label varian sesuai locale. */
export function variantLabel(variant: Variant, locale: Locale): string {
  if (variant === "regular") return locale === "en" ? "Regular Battery" : "Baterai Regular";
  if (variant === "extended") return locale === "en" ? "Extended Battery" : "Baterai Extended";
  return locale === "en" ? "Single variant" : "Satu varian";
}

/** Format tanggal berlaku ("25 Sep 2026"). */
export function formatValidDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(iso));
}
