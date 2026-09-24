import React from "react";
import { getSEOMetadata } from "@/app/lib/seo1";
import { fetchAllPreviews, type LinkPreview } from "@/app/lib/fetchPreview";
import MediaCenterClient from "./mediaCenterClient";
import { PRESS_URLS } from "@public/data/press-urls";
import { INSTAGRAM_POSTS, fetchAllInstagramPosts, type InstagramPostData } from "./components/fetchInstagram";
import { getArticles, getPress, getSocialPosts } from "@/lib/cms/api";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: "/media-center" });
}

// Konten dari CMS (backend Express) dengan cache ISR bertag; fallback ke data statis lama
// bila backend belum berisi data / tidak terjangkau, agar halaman tidak pernah kosong.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;

  const [press, social, articles] = await Promise.all([getPress(60), getSocialPosts(12), getArticles({ locale: loc, limit: 12 })]);

  let previews: LinkPreview[];
  if (press.length) {
    previews = press.map((p) => ({
      url: p.url,
      title: p.title,
      headLine: p.excerpt ?? "",
      slug: p.slug,
      description: p.description ?? undefined,
      image: p.imageUrl,
      site: p.siteName ?? undefined,
      published: p.publishedAt ?? undefined,
      author: p.author ?? undefined,
    }));
  } else {
    previews = (await fetchAllPreviews(PRESS_URLS)).sort((a, b) => {
      const da = a.published ? new Date(a.published).getTime() : 0;
      const db = b.published ? new Date(b.published).getTime() : 0;
      return db - da;
    });
  }

  let instagramPosts: InstagramPostData[];
  const withThumb = social.filter((s) => s.thumbnailUrl);
  if (withThumb.length) {
    instagramPosts = withThumb.map((s) => ({ url: s.url, thumbnail: s.thumbnailUrl!, caption: s.caption ?? "" }));
  } else {
    instagramPosts = await fetchAllInstagramPosts(INSTAGRAM_POSTS);
  }

  return <MediaCenterClient previews={previews} instagramPosts={instagramPosts} articles={articles.items} locale={loc} />;
}
