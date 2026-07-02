import { getSEOMetadata } from "@/app/lib/seo1";
import CompareStructure from "./structure";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/compare" });
}

export default function ComparePage() {
  return <CompareStructure />;
}
