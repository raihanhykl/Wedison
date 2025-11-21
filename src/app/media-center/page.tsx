import React from "react";
import { notFound } from "next/navigation";
import { getSEOMetadata } from "../lib/seo1";
import { fetchAllPreviews } from "../lib/fetchPreview";
import MediaCenterClient from "./mediaCenterClient";
import { PRESS_URLS } from "../../../public/data/press-urls";
// import { PRESS_URLS } from "../../../public/data/press-urls";
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
  image: "https://wedison.co/wedison-sidebyside.png",
  lang: "id",
});
export default async function Page() {
  // const previews = await fetchAllPreviews(PRESS_URLS);
  const previews = (await fetchAllPreviews(PRESS_URLS)).sort((a, b) => {
    const da = a.published ? new Date(a.published).getTime() : 0;
    const db = b.published ? new Date(b.published).getTime() : 0;
    return db - da; // terbaru duluan
  });

  const dev = true;
  if (!dev) return notFound();
  return (
    <div>
      <div className=" ">
        <MediaCenterClient previews={previews} />
      </div>
      {/* <Baru /> */}
    </div>
  );
}
