// JSON-LD halaman produk (Product + Motorcycle + BreadcrumbList) dari kamus spesifikasi,
// dipanggil di Server Component page.tsx tiap model. Nilai spesifikasi diambil apa adanya
// dari kamus (sumber yang sama dengan tabel Bandingkan) agar schema = konten halaman.
import "server-only";
import type { Locale } from "@/app/lib/locale";
import { seoContent } from "@/app/lib/seo-strings";
import { dictText, loadDictionary } from "./dictionary";
import { breadcrumbSchema, productSchema, type JsonLdObject } from "./schema";

export const PRODUCT_IDS = ["bees", "athena", "victory", "edpower"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];
export const PRODUCT_NAMES: Record<ProductId, string> = {
  bees: "Bees",
  athena: "Athena",
  victory: "Victory",
  edpower: "EdPower",
};

const SPEC_KEYS: [category: string, key: string][] = [
  ["engine", "motorType"],
  ["engine", "motorPower"],
  ["engine", "topSpeed"],
  ["battery", "batteryType"],
  ["battery", "batteryCapacity"],
  ["battery", "voltage"],
  ["battery", "chargingTimeSuperCharge"],
  ["battery", "chargingTimeHome"],
  ["battery", "range"],
  ["dimension", "weight"],
  ["dimension", "seatHeight"],
];

export function productsBreadcrumb(locale: Locale) {
  return [
    { name: locale === "en" ? "Home" : "Beranda", path: "/" },
    { name: locale === "en" ? "Electric Motorcycles" : "Motor Listrik", path: "/products" },
  ];
}

export async function productPageJsonLd(locale: Locale, id: ProductId): Promise<JsonLdObject[]> {
  const dict = await loadDictionary(locale);
  const path = `/products/${id}`;
  const seo = seoContent[path][locale];

  const specs = SPEC_KEYS.map(([cat, key]) => ({
    label: dictText(dict, `specs.category.${cat}.${key}`),
    value: dictText(dict, `${id}.specs.${cat}.${key}`),
  })).filter((s) => s.label && s.value && s.value !== "-");

  const topSpeed = parseInt(dictText(dict, `${id}.specs.engine.topSpeed`), 10);

  return [
    productSchema({
      locale,
      path,
      name: `Wedison ${PRODUCT_NAMES[id]}`,
      description: seo.description,
      images: [`/og/${id}.jpg`, `/${id}/${id}-product-hero.webp`, `/navbar-product/${id}.webp`],
      specs,
      topSpeedKmh: Number.isFinite(topSpeed) ? topSpeed : undefined,
    }),
    breadcrumbSchema(locale, [...productsBreadcrumb(locale), { name: PRODUCT_NAMES[id], path }]),
  ];
}
