import { getSEOMetadata } from "@/app/lib/seo1";
import ProductsStructure from "./structure";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/products" });
}

export default function ProductsPage() {
  return <ProductsStructure />;
}
