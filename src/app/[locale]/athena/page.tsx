import React from "react";
import ProductPageComponent from "@/app/_product/structure";
import { getSEOMetadata } from "@/app/lib/seo1";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/athena" });
}
export default function Page() {
  return (
    <div>
      <ProductPageComponent motorType="athena" />
    </div>
  );
}
