import { getSEOMetadata } from "@/app/lib/seo1";
import CareerClient from "./client";
import CareersBoard from "./careers-board";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getCareers } from "@/lib/cms/api";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: "/career" });
}

// Lowongan dikelola tim HR di admin (modul HR) dan dibaca dari backend dengan cache ISR
// bertag "jobs". Bila backend tidak terjangkau, tampilkan daftar statis lama (fail-soft).
export default async function CareerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const data = await getCareers(loc);
  return (
    <>
      <JsonLd
        data={breadcrumbSchema(loc, [
          { name: loc === "en" ? "Home" : "Beranda", path: "/" },
          { name: loc === "en" ? "Careers" : "Karier", path: "/career" },
        ])}
      />
      {data ? <CareersBoard data={data} locale={loc} /> : <CareerClient />}
    </>
  );
}
