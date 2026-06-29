import React from "react";
import ProductPageComponent from "../_product/structure";
import { getSEOMetadata } from "../lib/seo1";

export const metadata = getSEOMetadata({
  title: "Victory - Motor Listrik Urban Modern | Wedison",
  description:
    "Victory adalah motor listrik urban dari Wedison, didesain untuk mobilitas kota yang efisien, ramah lingkungan, dan hemat energi. Temukan spesifikasi, fitur, dan keunggulannya di sini.",
  keywords: [
    "wedison",
    "motor listrik",
    "victory",
    "motor listrik urban",
    "kendaraan listrik",
    "EV",
    "motor listrik hemat energi",
    "electric motorcycle",
  ],
  url: "https://wedison.co/victory/",
  image: "https://wedison.co/victory-product-hero.webp",
  lang: "id",
});
export default function Page() {
  return (
    <div>
      <ProductPageComponent motorType="victory" />
    </div>
  );
}
