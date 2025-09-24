import React from "react";
import MediaCenterstructure from "./structure";
import { notFound } from "next/navigation";
import { getSEOMetadata } from "../lib/seo1";
// import Baru from "./components/baru";
export const metadata = getSEOMetadata({
  title: "Media Center - Berita & Update Wedison",
  description:
    "Ikuti berita terbaru, siaran pers, dan liputan media tentang Wedison. Dapatkan update seputar inovasi, produk baru, serta aktivitas perusahaan.",
  keywords: [
    "wedison",
    "media center",
    "berita wedison",
    "press release",
    "liputan media",
    "update motor listrik",
    "inovasi kendaraan listrik",
  ],
  url: "https://wedison.co/media-center/",
  image: "https://wedison.co/media-center-banner.webp",
  lang: "id",
});
export default function Page() {
  const dev = true;
  if (!dev) return notFound();
  return (
    <div>
      <div className=" ">
        <MediaCenterstructure />
      </div>
      {/* <Baru /> */}
    </div>
  );
}
