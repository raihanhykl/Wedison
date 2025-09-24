import React from "react";
import { notFound } from "next/navigation";
import FaqStructure from "./structure";
import { getSEOMetadata } from "../lib/seo1";
// import Baru from "./components/baru";

export const metadata = getSEOMetadata({
  title: "FAQ - Pertanyaan Umum Motor Listrik | Wedison",
  description:
    "Temukan jawaban dari pertanyaan umum seputar motor listrik Wedison. Mulai dari cara pengisian daya, perawatan, garansi, hingga informasi pembelian.",
  keywords: [
    "wedison",
    "faq motor listrik",
    "pertanyaan umum",
    "motor listrik",
    "cara isi daya motor listrik",
    "garansi motor listrik",
    "perawatan kendaraan listrik",
  ],
  url: "https://wedison.co/faq/",
  image: "https://wedison.co/faq-banner.webp",
  lang: "id",
});

export default function Page() {
  const dev = true;
  if (!dev) return notFound();
  return (
    <div>
      <div className=" ">
        <FaqStructure />
      </div>
      {/* <Baru /> */}
    </div>
  );
}
