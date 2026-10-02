import SuperChargeHero from "./hero";
import HowItWorks from "./how-it-works";
import SuperChargeNetwork, { type NetworkStats } from "./network";
import SuperChargeSafety from "./safety";
import SuperChargeCta from "./cta";
import AppSection from "./app-section";
import { getSEOMetadata } from "@/app/lib/seo1";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITES } from "@/data/supercharge-sites";
import { getStations } from "@/lib/cms/api";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: "/super-charge" });
}

/** Statistik jaringan dari data stasiun yang sama dengan halaman Lokasi (fallback statis). */
async function networkStats(): Promise<NetworkStats> {
  const remote = await getStations();
  const sites = remote?.features.length ? remote.features : SITES.features;
  const live = sites.filter((s) => s.properties.status === "operational");
  return {
    stations: live.length,
    cities: new Set(live.map((s) => s.properties.city.trim().toLowerCase())).size,
    upcoming: sites.filter((s) => s.properties.status === "coming_soon").length,
    // Semua titik yang tidak tutup tampil di peta; yang beroperasi ditandai `live`.
    points: sites
      .filter((s) => s.properties.status === "operational" || s.properties.status === "coming_soon")
      .map((s) => [
        s.geometry.coordinates[1],
        s.geometry.coordinates[0],
        s.properties.status === "operational",
      ]),
  };
}

export default async function SuperChargePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const stats = await networkStats();

  return (
    // Bukan <main>: landmark <main> tunggal disediakan layout locale (#konten).
    // Alur: janji (hero) -> bukti 15 menit (cara kerja) -> di mana (jaringan) -> bisa dipercaya
    // (keamanan) -> cara memakainya (aplikasi) -> satu ajakan penutup.
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema(loc, [
          { name: loc === "en" ? "Home" : "Beranda", path: "/" },
          { name: "SuperCharge", path: "/super-charge" },
        ])}
      />
      <SuperChargeHero />
      <HowItWorks />
      <SuperChargeNetwork stats={stats} />
      <SuperChargeSafety />
      <AppSection />
      <SuperChargeCta />
    </div>
  );
}
