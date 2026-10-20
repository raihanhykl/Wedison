// Bentuk data harga publik (snapshot dari GET /api/v1/public/pricing). Satu sumber untuk
// halaman produk, landing, BaaS, ojol, JSON-LD Offer, dan llms.txt. Fallback statis:
// src/data/pricing-fallback.ts (bentuk yang sama, dibuat dari seed v4).

export type ProductId = "bees" | "athena" | "victory" | "edpower";
export type Variant = "single" | "regular" | "extended";
export type SchemeKind = "purchase" | "rent_to_own" | "rental" | "b2b_credit" | "baas";
export type Audience = "all" | "ojol" | "b2b";

export type Bilingual = { id: string; en: string };
export type BilingualList = { id: string[]; en: string[] };

export type PricingRegion = {
  slug: string;
  name: Bilingual;
  priceLabel: Bilingual;
  coverage: Bilingual | null;
  salesWhatsapp: string | null;
  isDefault: boolean;
  sortOrder: number;
};

export type PricingScheme = {
  slug: string;
  kind: SchemeKind;
  name: Bilingual;
  tagline: Bilingual | null;
  description: Bilingual | null;
  audience: Audience;
  sortOrder: number;
};

export type PriceEntry = {
  region: string;
  scheme: string;
  model: ProductId;
  variant: Variant;
  otrPrice: number | null;
  discount: number | null;
  netPrice: number | null;
  dailyFee: number | null;
  downPayment: number | null;
  termMonths: number | null;
  installment24: number | null;
  installment36: number | null;
  unitPrice: number | null;
  monthlyFee: number | null;
  note: Bilingual | null;
};

export type PricingTerms = {
  region: string;
  scheme: string;
  included: BilingualList;
  terms: BilingualList;
  partners: string[];
  validFrom: string | null;
  validUntil: string | null;
  note: Bilingual | null;
};

export type PricingSettings = {
  disclaimerId: string;
  disclaimerEn: string;
  supercharge: {
    enabled: boolean;
    unitId: string;
    unitEn: string;
    tariff: Record<ProductId, number | null>;
    noteId: string | null;
    noteEn: string | null;
  };
  referral: {
    enabled: boolean;
    amount: number;
    regionSlugs: string[];
    titleId: string;
    titleEn: string;
    descriptionId: string;
    descriptionEn: string;
  };
};

export type PublicPricing = {
  regions: PricingRegion[];
  schemes: PricingScheme[];
  entries: PriceEntry[];
  terms: PricingTerms[];
  settings: PricingSettings;
  updatedAt: string;
};
