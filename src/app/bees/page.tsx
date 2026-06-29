import React from "react";
import ProductPageComponent from "../_product/structure";
import { getSEOMetadata } from "../lib/seo1";
export const metadata = getSEOMetadata({
  title: "Bees - Motor Listrik Compact & Praktis | Wedison",
  description:
    "Bees adalah motor listrik compact dari Wedison, cocok untuk kebutuhan harian, desain praktis dan mudah digunakan. Lihat keunggulan dan spesifikasi lengkapnya di sini.",
  keywords: [
    "wedison",
    "motor listrik",
    "bees",
    "motor listrik compact",
    "kendaraan listrik",
    "EV",
    "motor listrik praktis",
    "electric motorcycle",
  ],
  url: "https://wedison.co/bees/",
  image: "https://wedison.co/bees-product-hero.webp",
  lang: "id",
});
export default function Page() {
  return (
    <div>
      <ProductPageComponent motorType="bees" />
    </div>
  );
}
