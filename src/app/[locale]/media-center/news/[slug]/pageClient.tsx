"use client";

import { useState } from "react";
import { Calendar, User, Share2, ArrowLeft, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { LinkPreview } from "@/app/lib/fetchPreview";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/app/lib/language-context";

const COPY = {
  id: {
    back: "Kembali ke Media Center",
    by: "Oleh",
    copied: "Tersalin!",
    share: "Bagikan",
    summary: "Ringkasan liputan",
    readMore: "Baca selengkapnya di",
    publishedOn: "Diterbitkan pada",
    publishedBy: "oleh",
  },
  en: {
    back: "Back to Media Center",
    by: "By",
    copied: "Copied!",
    share: "Share",
    summary: "Coverage summary",
    readMore: "Read the full story at",
    publishedOn: "Published on",
    publishedBy: "by",
  },
} as const;

export default function NewsClient({ preview }: { preview: LinkPreview }) {
  const { language } = useLanguage();
  const c = COPY[language === "en" ? "en" : "id"];
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const published = formatDate(preview.published);

  return (
    <div className="min-h-screen bg-background mt-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href={`/${language}/media-center/`}
            className="mb-3 flex w-fit items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>{c.back}</span>
          </Link>

          {/* Header */}
          <Reveal className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight text-balance">
              {preview.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              {published && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={preview.published}>{published}</time>
                </div>
              )}
              {(preview.site || preview.author) && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>
                    {c.by} {[preview.site, preview.author].filter(Boolean).join(" - ")}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="ml-auto hover:scale-105 transition-transform duration-200"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {c.copied}
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    {c.share}
                  </>
                )}
              </Button>
            </div>
          </Reveal>

          {/* Image */}
          {preview.image && (
            <Reveal className="mb-8" y={0}>
              <Image
                width={1000}
                height={800}
                src={preview.image}
                alt={preview.title}
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="w-full h-full object-contain aspect-video shadow-lg rounded-xl bg-muted"
              />
            </Reveal>
          )}

          {/* Article */}
          <Card className="mb-8 p-0 border border-border bg-card shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <h2 className="mb-4 font-display text-xl font-bold tracking-tight text-foreground">
                {c.summary}
              </h2>
              <div className="prose prose-lg max-w-none">
                <div className="text-foreground leading-relaxed whitespace-pre-line">
                  {preview.headLine}
                </div>
              </div>
            </CardContent>
            <CardContent className="px-6 sm:px-8">
              <p className="my-8 font-bold leading-relaxed text-foreground">
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 underline underline-offset-4"
                >
                  <span>
                    {c.readMore} {preview.site ?? preview.url}
                    {preview.site ? ` – ${preview.title}` : ""}
                  </span>
                  <ExternalLink className="mt-1 h-4 w-4 shrink-0" aria-hidden />
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          {(published || preview.author) && (
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                {published ? `${c.publishedOn} ${published}` : ""}
                {preview.author ? ` ${c.publishedBy} ${preview.author}` : ""}
              </p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
