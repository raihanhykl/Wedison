import { getSEOMetadata } from "@/app/lib/seo1";
import { SITES } from "@/data/supercharge-sites";
import { getStations } from "@/lib/cms/api";
import Locator from "./structure";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({
    locale: locale as "id" | "en",
    path: "/super-charge/lokasi",
  });
}

// Sumber data: backend (tabel Station, dikelola di admin > SuperCharge). Cache ISR tag
// "stations". Fallback ke GeoJSON statis bila backend belum siap.
export default async function LokasiPage() {
  const remote = await getStations();
  const sites = remote?.features.length ? remote.features : SITES.features;
  return <Locator sites={sites} />;
}
