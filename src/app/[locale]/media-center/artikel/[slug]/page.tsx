import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { getSEOMetadata } from "@/app/lib/seo1";
import { getArticle } from "@/lib/cms/api";
import { Reveal } from "@/components/motion/reveal";
import type { Locale } from "@/app/lib/locale";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedison.co";
const abs = (u: string) => (u.startsWith("http") ? u : `${SITE}${u}`);

// Artikel dari CMS: render on-demand + cache ISR (tag "articles"), disegarkan lewat webhook admin.
// SEO per artikel: title/description/keywords, canonical (override dari admin), robots noindex,
// OG/Twitter (gambar khusus share bila diisi), hreflang hanya ke locale yang tersedia, JSON-LD Article.
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const a = await getArticle(loc, slug);
  if (!a) return {};

  const base = getSEOMetadata({
    locale: loc,
    path: `/media-center/artikel/${slug}`,
    title: a.seoTitle ?? a.title,
    description: a.seoDescription ?? a.excerpt ?? undefined,
    keywords: a.seoKeywords ? a.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    image: a.ogImage?.url ?? a.coverImage?.url,
  });

  const languages: Record<string, string> = {};
  for (const l of a.availableLocales) languages[l.locale] = `${SITE}/${l.locale}/media-center/artikel/${l.slug}/`;
  languages["x-default"] = languages.id ?? languages[loc];

  const ogTitle = a.ogTitle ?? a.seoTitle ?? a.title;
  const ogDescription = a.ogDescription ?? a.seoDescription ?? a.excerpt ?? undefined;
  const shareImage = a.ogImage ?? a.coverImage;

  return {
    ...base,
    alternates: {
      canonical: a.canonicalUrl ?? base.alternates?.canonical,
      languages,
    },
    robots: a.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      ...base.openGraph,
      type: "article",
      title: ogTitle,
      description: ogDescription,
      publishedTime: a.publishedAt ?? undefined,
      modifiedTime: a.updatedAt,
      authors: a.author ? [a.author.name] : undefined,
      section: a.category?.name,
      tags: a.tags.map((t) => t.name),
      images: shareImage
        ? [{ url: abs(shareImage.url), width: shareImage.width ?? 1200, height: shareImage.height ?? 630, alt: shareImage.alt ?? ogTitle }]
        : base.openGraph?.images,
    },
    twitter: { ...base.twitter, title: ogTitle, description: ogDescription },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const a = await getArticle(loc, slug);
  if (!a) notFound();

  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString(loc === "en" ? "en-US" : "id-ID", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const other = a.availableLocales.find((l) => l.locale !== loc);
  const url = `${SITE}/${loc}/media-center/artikel/${a.slug}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.seoDescription ?? a.excerpt ?? undefined,
    image: [a.ogImage?.url, a.coverImage?.url].filter(Boolean).map((u) => abs(u!)),
    datePublished: a.publishedAt ?? undefined,
    dateModified: a.updatedAt,
    author: a.author ? { "@type": "Person", name: a.author.name } : { "@type": "Organization", name: "Wedison" },
    publisher: { "@type": "Organization", name: "Wedison", logo: { "@type": "ImageObject", url: `${SITE}/logo/wedison-logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": a.canonicalUrl ?? url },
    inLanguage: loc === "en" ? "en-US" : "id-ID",
    keywords: a.seoKeywords ?? undefined,
    articleSection: a.category?.name,
  };

  return (
    <div className="min-h-screen bg-background mt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="max-w-3xl mx-auto">
          <div className="mb-4 flex items-center justify-between gap-4">
            <Link href={`/${loc}/media-center/`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>{loc === "en" ? "Back to Media Center" : "Kembali ke Media Center"}</span>
            </Link>
            {other && (
              <Link href={`/${other.locale}/media-center/artikel/${other.slug}/`} className="font-mono text-xs uppercase tracking-wider text-primary hover:underline">
                {other.locale === "en" ? "Read in English" : "Baca dalam Bahasa Indonesia"}
              </Link>
            )}
          </div>

          <Reveal className="mb-8">
            {a.category && <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-primary">{a.category.name}</p>}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-5 leading-tight text-balance">{a.title}</h1>
            {a.excerpt && <p className="text-lg text-muted-foreground leading-relaxed">{a.excerpt}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {date && <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /><time dateTime={a.publishedAt ?? undefined}>{date}</time></span>}
              {a.author && <span className="flex items-center gap-2"><User className="h-4 w-4" />{a.author.name}</span>}
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{a.readingTime} {loc === "en" ? "min read" : "menit baca"}</span>
            </div>
          </Reveal>

          {a.coverImage && (
            <Reveal className="mb-10" y={0}>
              <figure>
                <Image
                  src={a.coverImage.url}
                  alt={a.coverImage.alt ?? a.title}
                  width={a.coverImage.width ?? 1600}
                  height={a.coverImage.height ?? 900}
                  className="w-full h-auto rounded-xl bg-muted shadow-lg"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </figure>
            </Reveal>
          )}

          <div className="article-prose" dangerouslySetInnerHTML={{ __html: a.contentHtml ?? "" }} />

          {a.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {a.tags.map((t) => (
                <span key={t.slug} className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">#{t.name}</span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
