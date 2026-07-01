"use client";

import { useState } from "react";
import { Calendar, User, Share2, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { LinkPreview } from "@/app/lib/fetchPreview";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";

export default function NewsClient({ preview }: { preview: LinkPreview }) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background mt-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href={"/media-center"}
            className="mb-3 hover:mb-[10px]  flex items-center justify-between w-fit gap-1 text-muted-foreground hover:text-foreground hover:border-b-[2px]  border-b-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <p> Kembali ke Berita</p>
          </Link>

          {/* Header */}
          <Reveal className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight text-balance">
              {preview.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(preview.published!)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>
                  Oleh {preview.site} - {preview.author}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="ml-auto hover:scale-105 transition-transform duration-200"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </>
                )}
              </Button>
            </div>
          </Reveal>

          {/* Image */}
          <Reveal className="mb-8" y={0}>
            <Image
              width={1000}
              height={800}
              src={preview.image || "/placeholder.svg"}
              alt={preview.title}
              className="w-full h-full object-contain aspect-video shadow-lg rounded-xl bg-muted"
            />
          </Reveal>

          {/* Article */}
          <Card className="mb-8 p-0 border border-border bg-card shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-foreground leading-relaxed whitespace-pre-line">
                  {preview.headLine}
                </div>
              </div>
            </CardContent>
            <CardContent className=" px-6 sm:px-8">
              <div className="text-foreground  my-8 leading-relaxed font-bold whitespace-pre-line">
                <Link
                  href={preview.url}
                  target="_blank" rel="noopener noreferrer"
                  className="  underline flex items-center"
                >
                  {" "}
                  Baca selengkapnya di {preview.site} - {preview.title}{" "}
                  {/* <ArrowRight className=" ml-3 h-5 w-5" /> */}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="border-t border-border pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Diterbitkan pada {formatDate(preview.published!)} oleh{" "}
                  {/* {news.author} */}
                  {preview.author}
                </p>
              </div>
              {/* <Button
                variant="outline"
                className=" border-black"
                onClick={handleShare}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    URL Tersalin!
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Bagikan Artikel
                  </>
                )}
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
