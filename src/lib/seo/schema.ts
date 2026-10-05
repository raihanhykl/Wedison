// Builder JSON-LD (schema.org) untuk SEO/AEO/GEO. Semua fungsi murni (tanpa React) agar
// bisa dipakai di Server Component (page.tsx / layout.tsx) lewat <JsonLd data={...} />.
// Prinsip: hanya klaim yang tampil di halaman (Google: structured data harus mewakili
// konten yang terlihat), tanpa harga (harga tidak ditampilkan di situs -> tanpa Offer).

import type { Locale } from "@/app/lib/locale";
import {
  CONTACT,
  HQ_ADDRESS,
  LOGO_URL,
  ORG_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
  WERIGO_URL,
  absUrl,
  localeUrl,
} from "./site";
import {
  PUBLISHED_SHOWROOM_LOCATIONS,
  SHOWROOM_OPENING_HOURS,
  type ShowroomLocation,
} from "./showrooms";

export type JsonLdObject = Record<string, unknown>;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const langTag = (locale: Locale) => (locale === "en" ? "en-US" : "id-ID");

export function organizationSchema(locale: Locale): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: "Wedison",
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: LOGO_URL, width: 2084, height: 2084 },
    image: LOGO_URL,
    description: ORG_DESCRIPTION[locale],
    email: CONTACT.email,
    telephone: CONTACT.phoneE164,
    address: { "@type": "PostalAddress", ...HQ_ADDRESS },
    areaServed: { "@type": "Country", name: "Indonesia" },
    sameAs: [...SOCIAL_PROFILES],
    // Werigo ditautkan di footer setiap halaman -> klaim ini terlihat di konten.
    subOrganization: {
      "@type": "Organization",
      name: "Werigo",
      url: WERIGO_URL,
      description:
        locale === "en"
          ? "Wedison's electric motorcycle rental service in Bali."
          : "Layanan sewa motor listrik Wedison di Bali.",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: CONTACT.phoneE164,
        email: CONTACT.email,
        areaServed: "ID",
        availableLanguage: ["Indonesian", "English"],
      },
    ],
  };
}

export function webSiteSchema(locale: Locale): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: langTag(locale),
    publisher: { "@id": ORG_ID },
  };
}

export type BreadcrumbItem = { name: string; path: string };

/** Breadcrumb: `path` locale-agnostic ("/products/athena"); item terakhir = halaman ini. */
export function breadcrumbSchema(locale: Locale, items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: localeUrl(locale, it.path),
    })),
  };
}

export type ProductSchemaInput = {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  images: string[];
  /** Nilai spesifikasi apa adanya dari kamus (mis. "120 km") */
  specs: { label: string; value: string }[];
  topSpeedKmh?: number;
};

export function productSchema(p: ProductSchemaInput): JsonLdObject {
  const speed = p.topSpeedKmh
    ? { speed: { "@type": "QuantitativeValue", maxValue: p.topSpeedKmh, unitCode: "KMH" } }
    : {};
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Motorcycle"],
    "@id": `${localeUrl(p.locale, p.path)}#product`,
    name: p.name,
    description: p.description,
    image: p.images.map(absUrl),
    url: localeUrl(p.locale, p.path),
    brand: { "@type": "Brand", name: SITE_NAME },
    manufacturer: { "@id": ORG_ID },
    category: p.locale === "en" ? "Electric motorcycle" : "Motor listrik",
    fuelType: "Electric",
    vehicleEngine: { "@type": "EngineSpecification", engineType: "Brushless DC electric motor" },
    ...speed,
    additionalProperty: p.specs
      .filter((s) => s.value && s.value !== "-")
      .map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
  };
}

export function itemListSchema(
  locale: Locale,
  name: string,
  items: { name: string; path: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: localeUrl(locale, it.path),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

function dealerSchema(locale: Locale, s: ShowroomLocation): JsonLdObject {
  return {
    "@type": ["MotorcycleDealer", "LocalBusiness"],
    "@id": `${SITE_URL}/#showroom-${s.id}`,
    name: s.name,
    url: localeUrl(locale, "/showroom"),
    image: absUrl("/og/showroom.jpg"),
    telephone: `+${s.whatsapp}`,
    address: { "@type": "PostalAddress", ...s.address, addressCountry: s.country },
    geo: { "@type": "GeoCoordinates", latitude: s.geo.latitude, longitude: s.geo.longitude },
    hasMap: s.mapsUrl,
    parentOrganization: { "@id": ORG_ID },
    brand: { "@type": "Brand", name: SITE_NAME },
    currenciesAccepted: "IDR",
    openingHoursSpecification: SHOWROOM_OPENING_HOURS.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...h.days],
      opens: h.opens,
      closes: h.closes,
    })),
  };
}

/** Semua showroom (Jakarta, Bekasi, Bandung, Bali) sebagai satu graph. */
export function showroomsSchema(locale: Locale): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@graph": PUBLISHED_SHOWROOM_LOCATIONS.map((s) => dealerSchema(locale, s)),
  };
}

export type ArticleSchemaInput = {
  locale: Locale;
  url: string;
  headline: string;
  description?: string;
  images: string[];
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  section?: string;
  keywords?: string;
};

export function newsArticleSchema(a: ArticleSchemaInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.headline,
    description: a.description,
    image: a.images.map(absUrl),
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    author: a.authorName ? { "@type": "Person", name: a.authorName } : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": a.url },
    inLanguage: langTag(a.locale),
    keywords: a.keywords,
    articleSection: a.section,
  };
}

// ─── JobPosting (Google for Jobs) ────────────────────────────────────────────
export type JobPostingInput = {
  locale: Locale;
  url: string;
  id: string;
  title: string;
  descriptionHtml: string;
  datePosted?: string | null;
  validThrough?: string | null;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
  workplaceType: "ONSITE" | "HYBRID" | "REMOTE";
  department?: string | null;
  openings?: number;
  locations: { city: string; province: string | null; countryCode: string }[];
  salary?: { min: number | null; max: number | null; currency: string } | null;
};

const EMPLOYMENT_SCHEMA: Record<JobPostingInput["employmentType"], string> = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACTOR",
  INTERNSHIP: "INTERN",
  FREELANCE: "CONTRACTOR",
};

/** Hanya untuk lowongan yang masih dibuka (lowongan tertutup tidak boleh membawa JobPosting). */
export function jobPostingSchema(j: JobPostingInput): JsonLdObject {
  const remote = j.workplaceType === "REMOTE";
  const countries = [...new Set(j.locations.map((l) => l.countryCode))];
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.title,
    description: j.descriptionHtml,
    identifier: { "@type": "PropertyValue", name: SITE_NAME, value: j.id },
    url: j.url,
    datePosted: j.datePosted ?? undefined,
    validThrough: j.validThrough ?? undefined,
    employmentType: EMPLOYMENT_SCHEMA[j.employmentType],
    occupationalCategory: j.department ?? undefined,
    totalJobOpenings: j.openings && j.openings > 1 ? j.openings : undefined,
    inLanguage: langTag(j.locale),
    directApply: false,
    hiringOrganization: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, sameAs: SITE_URL, logo: LOGO_URL },
    ...(remote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: countries.map((c) => ({ "@type": "Country", name: c })),
        }
      : {}),
    jobLocation: j.locations.map((l) => ({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: l.city,
        ...(l.province ? { addressRegion: l.province } : {}),
        addressCountry: l.countryCode,
      },
    })),
    ...(j.salary && (j.salary.min || j.salary.max)
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: j.salary.currency,
            value: {
              "@type": "QuantitativeValue",
              ...(j.salary.min ? { minValue: j.salary.min } : {}),
              ...(j.salary.max ? { maxValue: j.salary.max } : {}),
              unitText: "MONTH",
            },
          },
        }
      : {}),
  };
}
