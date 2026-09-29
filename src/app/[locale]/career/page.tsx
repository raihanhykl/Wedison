import { getSEOMetadata } from "@/app/lib/seo1";
import CareerClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/career" });
}

export default function CareerPage() {
  return <CareerClient />;
}
