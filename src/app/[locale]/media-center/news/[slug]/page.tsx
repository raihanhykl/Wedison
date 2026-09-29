import React from "react";
import { notFound } from "next/navigation";
import NewsClient from "./pageClient";
import { fetchPreview, type LinkPreview } from "@/app/lib/fetchPreview";
import { PRESS_URLS } from "@public/data/press-urls";
import { getSEOMetadata } from "@/app/lib/seo1";
import { getPressBySlug } from "@/lib/cms/api";
import type { Locale } from "@/app/lib/locale";

// Liputan pers kini dikelola di CMS (admin > Liputan Pers). Halaman dirender on-demand +
// cache ISR (tag "press"); slug baru dari admin langsung bisa diakses tanpa rebuild.
// Fallback ke daftar statis lama (PRESS_URLS + scrape) bila slug belum ada di DB.
async function loadPreview(slug: string): Promise<LinkPreview | null> {
  const p = await getPressBySlug(slug);
  if (p) {
    return {
      url: p.url,
      title: p.title,
      headLine: p.excerpt ?? p.description ?? "",
      slug: p.slug,
      description: p.description ?? undefined,
      image: p.imageUrl,
      site: p.siteName ?? undefined,
      published: p.publishedAt ?? undefined,
      author: p.author ?? undefined,
    };
  }
  const legacy = PRESS_URLS.find((item) => item.slug === slug);
  return legacy ? fetchPreview(legacy) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const preview = await loadPreview(slug);
  if (!preview) return {};
  return getSEOMetadata({
    locale: locale as Locale,
    path: `/media-center/news/${slug}`,
    title: preview.title,
    description: preview.description || undefined,
    image: preview.image || undefined,
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const preview = await loadPreview(slug);
  if (!preview) notFound();
  return <NewsClient preview={preview} />;
}
