// import React from "react";
// import { PRESS_URLS } from "@public/data/press-urls";
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
// import { PRESS_URLS } from "@public/data/press-urls";
import NewsClient from "./pageClient";
import { fetchPreview } from "@/app/lib/fetchPreview";
import { notFound } from "next/navigation";
import { PRESS_URLS } from "@public/data/press-urls";
import { LOCALES } from "@/app/lib/locale";
import { getSEOMetadata } from "@/app/lib/seo1";

// export const dynamic = "error";
// export const fetchCache = "only-cache";
export const dynamicParams = false; // <— WAJIB agar slug di luar daftar jadi 404

export function generateStaticParams() {
  // Nested [locale] x [slug] -> WAJIB cross-product, kalau tidak separuh kombinasi 404.
  return LOCALES.flatMap((locale) =>
    PRESS_URLS.map((data) => ({ locale, slug: data.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const newsData = PRESS_URLS.find((item) => item.slug === slug);
  if (!newsData) return {};
  // Judul/deskripsi/gambar diambil dari preview (string), bukan headLine (JSX).
  const preview = await fetchPreview(newsData);
  return getSEOMetadata({
    locale: locale as "id" | "en",
    path: `/media-center/news/${slug}`,
    title: preview.title,
    description: preview.description || undefined,
    image: preview.image || undefined,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  const newsData = PRESS_URLS.find((item) => item.slug === slug);
  if (!newsData) notFound(); // langsung 404

  const preview = await fetchPreview(newsData); // pastikan ter-cache build-time

  return <NewsClient preview={preview} />;
}
