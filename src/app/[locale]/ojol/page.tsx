import React from "react";
import OjolClient from "./client";
import { getSEOMetadata } from "@/app/lib/seo1";

export const metadata = getSEOMetadata({
  title: "Sewa Motor Listrik untuk Ojol | Wedison",
  description:
    "Solusi sewa motor listrik Wedison untuk mitra ojek online — hemat biaya operasional, ramah lingkungan, dan didukung jaringan SuperCharge.",
  keywords: [
    "wedison",
    "sewa motor listrik",
    "ojol",
    "ojek online",
    "motor listrik ojol",
    "rental motor listrik",
  ],
  url: "https://wedison.co/ojol/",
  image: "https://wedison.co/wedison-sidebyside.png",
  lang: "id",
});

export default function OjolPage() {
  return (
    <div>
      <OjolClient />
    </div>
  );
}
