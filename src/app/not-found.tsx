import "./globals.css";
import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

// Satu-satunya halaman 404 untuk seluruh app.
// CATATAN PENTING: di Next.js App Router, `not-found.tsx` di dalam segmen dinamis
// ([locale]) TIDAK terdaftar sebagai boundary yang andal — yang selalu dipakai
// untuk SEMUA 404 (URL tak-cocok maupun notFound()) adalah ROOT not-found ini.
// Karena root layout = passthrough (tanpa <html>/<body>), halaman ini menyediakan
// dokumennya sendiri + import globals.css.
//
// Locale dibaca dari request header `x-locale` yang di-set middleware. Ini server
// component async (pakai headers()) -> dirender per-request dengan bahasa yang
// benar (tanpa flash / hydration mismatch, dan benar untuk crawler).
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

export default async function NotFound() {
  const h = await headers();
  const locale = h.get("x-locale") === "en" ? "en" : "id";
  const text = translations[locale];

  return (
    <html lang={locale}>
      <body className="antialiased">
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
                    <Link href={`/${locale}/`}>
                      <Button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white group transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto">
                        <Home className="mr-2 h-5 w-5" />
                        {text.homeButton}
                      </Button>
                    </Link>
                    <Link href={`/${locale}/`}>
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
      </body>
    </html>
  );
}
