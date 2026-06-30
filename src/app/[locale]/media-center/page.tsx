import React from "react";
import { notFound } from "next/navigation";
import { getSEOMetadata } from "@/app/lib/seo1";
import { fetchAllPreviews } from "@/app/lib/fetchPreview";
import MediaCenterClient from "./mediaCenterClient";
import { PRESS_URLS } from "@public/data/press-urls";
import {
  INSTAGRAM_POSTS,
  fetchAllInstagramPosts,
} from "./components/fetchInstagram";
// import { PRESS_URLS } from "@public/data/press-urls";
// import Baru from "./components/baru";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/media-center" });
}
export default async function Page() {
  // const previews = await fetchAllPreviews(PRESS_URLS);
  const previews = (await fetchAllPreviews(PRESS_URLS)).sort((a, b) => {
    const da = a.published ? new Date(a.published).getTime() : 0;
    const db = b.published ? new Date(b.published).getTime() : 0;
    return db - da; // terbaru duluan
  });

  const instagramPosts = await fetchAllInstagramPosts(INSTAGRAM_POSTS);

  const dev = true;
  if (!dev) return notFound();
  return (
    <div>
      <div className=" ">
        <MediaCenterClient previews={previews} instagramPosts={instagramPosts} />
      </div>
      {/* <Baru /> */}
    </div>
  );
}
