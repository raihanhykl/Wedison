import ProductPageComponent from "@/app/_product/structure";
import { getSEOMetadata } from "@/app/lib/seo1";
import { JsonLd } from "@/components/seo/json-ld";
import { productPageJsonLd } from "@/lib/seo/product-page";
import { getPricing } from "@/lib/cms/api";
import type { Locale } from "@/app/lib/locale";

const ID = "bees" as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: `/products/${ID}` });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const pricing = await getPricing();
  return (
    <div>
      <JsonLd data={await productPageJsonLd(loc, ID, pricing)} />
      <ProductPageComponent motorType={ID} pricing={pricing} />
    </div>
  );
}
