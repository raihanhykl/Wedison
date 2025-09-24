import React from "react";
import ProductPageComponent from "../testing-product/structure";
import { getSEOMetadata } from "../lib/seo1";
export const metadata = getSEOMetadata({
  title: "EdPower - Motor Listrik Premium Indonesia | Wedison",
  description:
    "EdPower adalah motor listrik premium dari Wedison, dengan teknologi SuperCharge, baterai tahan lama, dan desain modern. Lihat fitur, spesifikasi, dan keunggulannya di sini.",
  keywords: [
    "wedison",
    "motor listrik",
    "edpower",
    "kendaraan listrik",
    "EV",
    "supercharge",
    "motor listrik premium",
    "electric motorcycle",
  ],
  url: "https://wedison.co/edpower",
  image: "https://wedison.co/edpower-product-hero.webp",
  lang: "id",
});
export default function Page() {
  return (
    <div>
      <ProductPageComponent motorType="edpower" />
    </div>
  );
}
