// Isi dialog program ojol (Sewa Milik = Rent To Own, Sewa Harian = Rental) dari snapshot modul
// Pricing, wilayah default (Jabodetabek). Dibangun di server (page.tsx) dalam dua bahasa supaya
// toggle bahasa di client tetap bekerja tanpa fetch ulang. null = pakai teks kamus (fallback).
import type { PriceEntry, PublicPricing } from "@/lib/pricing/types";
import { defaultRegion, entriesFor, pick, pickList, rupiah, schemesOfKind, termsFor, PRODUCT_NAMES, type Locale } from "@/lib/pricing/select";

export type OjolProgramContent = {
  scheme: { label: string; value: string }[];
  benefits: string[];
  terms: string[];
};
export type OjolProgram = Record<Locale, OjolProgramContent>;
export type OjolPrograms = { milik: OjolProgram | null; harian: OjolProgram | null };

const MODEL_ORDER = ["bees", "athena", "victory", "edpower"] as const;

function groupLabel(rows: PriceEntry[], locale: Locale): { label: string; value: string }[] {
  // Gabungkan model dengan angka sama per varian: "Athena/Victory Regular".
  const byKey = new Map<string, { models: string[]; variant: PriceEntry["variant"]; fee: number }>();
  for (const e of rows) {
    if (e.dailyFee == null) continue;
    const key = `${e.variant}:${e.dailyFee}`;
    const g = byKey.get(key) ?? { models: [], variant: e.variant, fee: e.dailyFee };
    g.models.push(PRODUCT_NAMES[e.model]);
    byKey.set(key, g);
  }
  const perDay = locale === "en" ? "/day" : "/hari";
  const variant = (v: PriceEntry["variant"]) => (v === "regular" ? " Regular" : v === "extended" ? " Extended" : "");
  return [...byKey.values()].map((g) => ({ label: `${g.models.join("/")}${variant(g.variant)}`, value: `${rupiah(g.fee, locale)}${perDay}` }));
}

function build(p: PublicPricing, kind: "rent_to_own" | "rental", locale: Locale): OjolProgramContent | null {
  const region = defaultRegion(p);
  const scheme = schemesOfKind(p, kind)[0];
  if (!region || !scheme) return null;
  const rows = MODEL_ORDER.flatMap((m) => entriesFor(p, region.slug, scheme.slug, m));
  if (rows.length === 0) return null;
  const dps = rows.map((e) => e.downPayment).filter((n): n is number => n != null);
  const scheme_ = groupLabel(rows, locale);
  if (dps.length > 0) {
    const lo = Math.min(...dps);
    const hi = Math.max(...dps);
    scheme_.push({ label: locale === "en" ? "Down payment" : "Uang muka", value: lo === hi ? rupiah(lo, locale) : `${rupiah(lo, locale)} - ${rupiah(hi, locale)}` });
  }
  const terms = termsFor(p, region.slug, scheme.slug);
  const description = pick(scheme.description, locale);
  return {
    scheme: scheme_,
    benefits: pickList(terms?.included, locale),
    terms: [...(description ? [description] : []), ...pickList(terms?.terms, locale)],
  };
}

export function ojolProgramsFrom(p: PublicPricing): OjolPrograms {
  const pair = (kind: "rent_to_own" | "rental"): OjolProgram | null => {
    const id = build(p, kind, "id");
    const en = build(p, kind, "en");
    return id && en ? { id, en } : null;
  };
  return { milik: pair("rent_to_own"), harian: pair("rental") };
}
