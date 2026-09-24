"use client";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { PublicArticle } from "@/lib/cms/api";

export function ArticleCard({ article, locale }: { article: PublicArticle; locale: "id" | "en" }) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", { year: "numeric", month: "short", day: "2-digit" })
    : "";
  return (
    <Card className="group mx-auto h-full flex flex-col overflow-hidden rounded-xl border border-border bg-card p-0 shadow-sm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/${locale}/media-center/artikel/${article.slug}/`} className="h-full flex flex-col">
        <div className="relative w-full overflow-hidden aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/9]">
          {article.coverImage ? (
            <Image
              src={article.coverImage.url}
              alt={article.coverImage.alt ?? article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 bg-forest" aria-hidden="true" />
          )}
          {article.category && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground">
              {article.category.name}
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 p-4 gap-1 min-h-0">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Wedison{date ? ` • ${date}` : ""}{article.readingTime ? ` • ${article.readingTime} ${locale === "en" ? "min" : "mnt"}` : ""}
          </div>
          <h3 className="font-display text-base font-bold leading-snug tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          {article.excerpt && <p className="text-sm text-muted-foreground line-clamp-4">{article.excerpt}</p>}
          <div className="mt-auto" />
        </div>
      </Link>
    </Card>
  );
}
