"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  // 404 terlokalisasi: dirender di dalam [locale]/layout sehingga punya akses
  // LanguageProvider (bahasa mengikuti segmen locale di URL).
  const translations = {
    en: {
      title: "Page Not Found",
      description: "Sorry, we couldn't find the page you're looking for.",
      suggestion:
        "The page might have been moved, deleted, or perhaps you mistyped the URL.",
      homeButton: "Back to Home",
      exploreButton: "Explore Our Models",
    },
    id: {
      title: "Halaman Tidak Ditemukan",
      description: "Maaf, kami tidak dapat menemukan halaman yang Anda cari.",
      suggestion:
        "Halaman mungkin telah dipindahkan, dihapus, atau mungkin Anda salah mengetik URL.",
      homeButton: "Kembali ke Beranda",
      exploreButton: "Jelajahi Model Kami",
    },
  };

  const { language } = useLanguage();
  const text = translations[language];

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              {/* 404 Number */}
              <div className="relative mb-6">
                <div className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent opacity-20">
                  404
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                    {text.title}
                  </h1>
                </div>
              </div>

              {/* Illustration */}
              <div className="mb-8 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-[var(--secondary)] rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="h-24 w-24 text-[var(--primary)] opacity-50" />
                  </div>
                </div>
              </div>

              <p className="text-xl text-gray-700 mb-3">{text.description}</p>
              <p className="text-gray-600 mb-8">{text.suggestion}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/${language}/`}>
                  <Button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white group transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto">
                    <Home className="mr-2 h-5 w-5" />
                    {text.homeButton}
                  </Button>
                </Link>
                <Link href={`/${language}/`}>
                  <Button
                    variant="outline"
                    className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--secondary-light)] transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    {text.exploreButton}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
