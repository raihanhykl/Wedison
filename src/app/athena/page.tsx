import React from "react";
import ProductPageComponent from "../testing-product/structure";
import { getSEOMetadata } from "../lib/seo1";
export const metadata = getSEOMetadata({
  title: "Athena - Motor Listrik Premium Indonesia",
  description:
    "Athena adalah motor listrik premium dari Wedison, dengan teknologi SuperCharge, baterai tahan lama, dan desain modern. Lihat fitur, spesifikasi, dan keunggulannya di sini.",
  keywords: [
    "wedison",
    "motor listrik",
    "athena",
    "kendaraan listrik",
    "EV",
    "supercharge",
    "motor listrik terbaik",
    "electric motorcycle",
  ],
  url: "https://wedison.co/athena",
  image: "https://wedison.co/athena-product-hero.webp",
  lang: "id",
});
export default function Page() {
  return (
    <div>
      <ProductPageComponent motorType="athena" />
    </div>
  );
}
