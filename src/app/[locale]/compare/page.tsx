import { getSEOMetadata } from "@/app/lib/seo1";
import CompareStructure from "./structure";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: "/compare" });
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  return (
    <>
      <JsonLd
        data={breadcrumbSchema(loc, [
          { name: loc === "en" ? "Home" : "Beranda", path: "/" },
          { name: loc === "en" ? "Compare Models" : "Bandingkan Model", path: "/compare" },
        ])}
      />
      <CompareStructure />
    </>
  );
}
