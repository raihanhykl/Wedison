"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/lib/language-context";

// 404 di dalam segmen /[locale]: dirender di dalam layout locale (navbar, footer, bahasa
// sesuai URL) oleh boundary not-found Next saat notFound() dipicu (mis. artikel/berita yang
// tidak ada) — terutama pada navigasi sisi klien. URL yang tidak cocok rute mana pun dilayani
// 404 statis root (src/app/not-found.tsx).
const COPY = {
  en: {
    title: "Page Not Found",
    description: "The page you requested could not be found.",
    suggestion: "It may have been moved or removed, or the address may contain an error.",
    homeButton: "Back to Home",
    exploreButton: "Explore Our Models",
  },
  id: {
    title: "Halaman Tidak Ditemukan",
    description: "Halaman yang kamu cari tidak ketemu.",
    suggestion:
      "Mungkin halamannya sudah dipindah atau dihapus, atau ada salah ketik di alamatnya.",
    homeButton: "Kembali ke Beranda",
    exploreButton: "Jelajahi Model Kami",
  },
} as const;

export default function LocaleNotFound() {
  const { language } = useLanguage();
  const text = COPY[language === "en" ? "en" : "id"];

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-6 pb-16 pt-32 text-center">
      <div className="relative mb-6">
        <div className="font-display text-9xl font-bold text-primary opacity-15 md:text-[12rem]">
          404
        </div>
        <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {text.title}
          </h1>
        </div>
      </div>

      <div className="mb-8 flex justify-center" aria-hidden>
        <div className="relative h-40 w-40 md:h-52 md:w-52">
          <div className="absolute inset-0 rounded-full bg-secondary opacity-40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-16 w-16 text-primary opacity-60" />
          </div>
        </div>
      </div>

      <p className="mb-2 text-xl text-foreground">{text.description}</p>
      <p className="mb-8 max-w-md text-muted-foreground">{text.suggestion}</p>

      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button asChild className="group w-full sm:w-auto">
          <Link href={`/${language}/`}>
            <Home className="mr-2 h-5 w-5" />
            {text.homeButton}
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/${language}/products/`}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            {text.exploreButton}
          </Link>
        </Button>
      </div>
    </div>
  );
}
