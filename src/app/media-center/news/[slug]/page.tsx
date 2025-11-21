// import React from "react";
// import { PRESS_URLS } from "../../../../public/data/press-urls";
// import NewsClient from "./pageClient";
// import { fetchPreview } from "@/app/lib/fetchPreview";

// import { notFound } from "next/navigation";

// export const dynamic = "error"; // cegah fallback dinamis
// export const fetchCache = "only-cache";
// export function generateStaticParams() {
//   return PRESS_URLS.map((data) => {
//     return {
//       slug: data.slug,
//     };
//   });
// }

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;
//   const getNewsBySlug = (slug: string) => {
//     const data = PRESS_URLS.find((item) => item.slug === slug);
//     if (!data) return false;
//     return data;
//   };
//   const newsData = getNewsBySlug(slug);
//   if (newsData === false) {
//     notFound();
//   }
//   const preview = await fetchPreview(newsData);
//   return (
//     <div>
//       <NewsClient preview={preview} />
//     </div>
//   );
// }
import React from "react";
// import { PRESS_URLS } from "../../../../public/data/press-urls";
import NewsClient from "./pageClient";
import { fetchPreview } from "@/app/lib/fetchPreview";
import { notFound } from "next/navigation";
import { PRESS_URLS } from "../../../../../public/data/press-urls";

// export const dynamic = "error";
// export const fetchCache = "only-cache";
export const dynamicParams = false; // <— WAJIB agar slug di luar daftar jadi 404

export function generateStaticParams() {
  return PRESS_URLS.map((data) => ({ slug: data.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const newsData = PRESS_URLS.find((item) => item.slug === slug);
  if (!newsData) notFound(); // langsung 404

  const preview = await fetchPreview(newsData); // pastikan ter-cache build-time

  return <NewsClient preview={preview} />;
}
