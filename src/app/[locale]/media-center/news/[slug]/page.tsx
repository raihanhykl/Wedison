import React from "react";
import { notFound } from "next/navigation";
import NewsClient from "./pageClient";
import { fetchPreview, type LinkPreview } from "@/app/lib/fetchPreview";
import { PRESS_URLS } from "@public/data/press-urls";
import { getSEOMetadata } from "@/app/lib/seo1";
import { getPressBySlug } from "@/lib/cms/api";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
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

/** Judul/deskripsi liputan bisa berupa URL mentah atau terlalu panjang -> rapikan untuk snippet. */
function snippetTitle(preview: LinkPreview): string {
  const t = preview.title?.trim() ?? "";
  if (!t || /^https?:\/\//i.test(t)) return `Liputan media: ${preview.site ?? "Wedison"}`;
  return t.length > 60 ? `${t.slice(0, 57).trimEnd()}…` : t;
}

function snippetDescription(preview: LinkPreview): string | undefined {
  // headLine dari data statis lama bisa berupa JSX -> hanya pakai bila string.
  const headLine = typeof preview.headLine === "string" ? preview.headLine.trim() : "";
  const desc = preview.description?.trim() ?? "";
  // Deskripsi dari situs sumber kadang terlalu pendek (<70 karakter) -> pakai teks yang lebih
  // informatif, atau lengkapi dengan konteks liputan.
  let d = desc.length >= 70 ? desc : headLine.length > desc.length ? headLine : desc;
  if (d && d.length < 70) {
    d = `${d.replace(/[.\s]+$/, "")}. Liputan ${preview.site ?? "media"} tentang motor listrik Wedison.`;
  }
  if (!d) return undefined;
  return d.length > 155 ? `${d.slice(0, 152).trimEnd()}…` : d;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const preview = await loadPreview(slug);
  if (!preview) return {};
  // Isi liputan pers berbahasa Indonesia dan identik di /id maupun /en -> satu versi kanonik
  // (/id) agar tidak dihitung duplikat; hreflang hanya ke versi itu.
  return getSEOMetadata({
    locale: locale as Locale,
    path: `/media-center/news/${slug}`,
    title: snippetTitle(preview),
    description: snippetDescription(preview),
    image: preview.image || undefined,
    canonicalLocale: "id",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const preview = await loadPreview(slug);
  if (!preview) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema(loc, [
          { name: loc === "en" ? "Home" : "Beranda", path: "/" },
          { name: "Media Center", path: "/media-center" },
          { name: snippetTitle(preview), path: `/media-center/news/${slug}` },
        ])}
      />
      <NewsClient preview={preview} />
    </>
  );
}
