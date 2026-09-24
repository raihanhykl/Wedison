import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { getSEOMetadata } from "@/app/lib/seo1";
import { getArticle } from "@/lib/cms/api";
import { Reveal } from "@/components/motion/reveal";
import type { Locale } from "@/app/lib/locale";

// Artikel dari CMS: render on-demand + cache ISR (tag "articles"), disegarkan lewat webhook admin.
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const a = await getArticle(loc, slug);
  if (!a) return {};
  return getSEOMetadata({
    locale: loc,
    path: `/media-center/artikel/${slug}`,
    title: a.seoTitle ?? a.title,
    description: a.seoDescription ?? a.excerpt ?? undefined,
    image: a.coverImage?.url,
  });
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

  return (
    <div className="min-h-screen bg-background mt-14">
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
              {date && <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{date}</span>}
              {a.author && <span className="flex items-center gap-2"><User className="h-4 w-4" />{a.author.name}</span>}
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{a.readingTime} {loc === "en" ? "min read" : "menit baca"}</span>
            </div>
          </Reveal>

          {a.coverImage && (
            <Reveal className="mb-10" y={0}>
              <Image
                src={a.coverImage.url}
                alt={a.coverImage.alt ?? a.title}
                width={a.coverImage.width ?? 1600}
                height={a.coverImage.height ?? 900}
                className="w-full h-auto rounded-xl bg-muted shadow-lg"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
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
