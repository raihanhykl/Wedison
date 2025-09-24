import React from "react";
import ProductPageComponent from "../testing-product/structure";
import { getSEOMetadata } from "../lib/seo1";
export const metadata = getSEOMetadata({
  title: "Mini - Motor Listrik Compact & Praktis | Wedison",
  description:
    "Mini adalah motor listrik compact dari Wedison, cocok untuk kebutuhan harian, desain praktis dan mudah digunakan. Lihat keunggulan dan spesifikasi lengkapnya di sini.",
  keywords: [
    "wedison",
    "motor listrik",
    "mini",
    "motor listrik compact",
    "kendaraan listrik",
    "EV",
    "motor listrik praktis",
    "electric motorcycle",
  ],
  url: "https://wedison.co/mini",
  image: "https://wedison.co/mini-product-hero.webp",
  lang: "id",
});
export default function Page() {
  return (
    <div>
      <ProductPageComponent motorType="mini" />
    </div>
  );
}
