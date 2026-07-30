import { getSEOMetadata } from "@/app/lib/seo1";
import { SITES } from "@/data/supercharge-sites";
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

export default function LokasiPage() {
  return <Locator sites={SITES.features} />;
}
