import { getSEOMetadata } from "@/app/lib/seo1";
import ProductsStructure from "./structure";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { PRODUCT_IDS, PRODUCT_NAMES, productsBreadcrumb } from "@/lib/seo/product-page";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: "/products" });
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(loc, productsBreadcrumb(loc)),
          itemListSchema(
            loc,
            loc === "en" ? "Wedison electric motorcycles" : "Motor listrik Wedison",
            PRODUCT_IDS.map((id) => ({ name: `Wedison ${PRODUCT_NAMES[id]}`, path: `/products/${id}` })),
          ),
        ]}
      />
      <ProductsStructure />
    </>
  );
}
