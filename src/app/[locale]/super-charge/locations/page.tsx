import { getSEOMetadata } from "@/app/lib/seo1";
import { SITES } from "@/data/supercharge-sites";
import { getStations } from "@/lib/cms/api";
import Locator from "./structure";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: "/super-charge/locations" });
}

// Sumber data: backend (tabel Station, dikelola di admin > SuperCharge). Cache ISR tag
// "stations". Fallback ke GeoJSON statis bila backend belum siap.
export default async function LokasiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const remote = await getStations();
  const sites = remote?.features.length ? remote.features : SITES.features;
  return (
    <>
      <JsonLd
        data={breadcrumbSchema(loc, [
          { name: loc === "en" ? "Home" : "Beranda", path: "/" },
          { name: "SuperCharge", path: "/super-charge" },
          { name: loc === "en" ? "Locations" : "Lokasi", path: "/super-charge/locations" },
        ])}
      />
      <Locator sites={sites} />
    </>
  );
}
