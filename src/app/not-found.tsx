import "./globals.css";
import Link from "next/link";
import { fontVariables } from "@/app/fonts";

// 404 ROOT: dipakai untuk URL yang tidak cocok rute mana pun (di-prerender sebagai
// _not-found.html -> cepat, tanpa JS, dwibahasa). Untuk notFound() saat navigasi klien di dalam
// /[locale] dipakai src/app/[locale]/not-found.tsx (dengan navbar/footer & bahasa yang benar).
//
// PENTING: komponen ini ikut dirender saat prerender SEMUA halaman (sebagai boundary
// not-found root). Ia harus STATIS — jangan panggil headers()/cookies() di sini: itu membuat
// seluruh situs jatuh ke rendering dinamis per-request (metadata ter-stream ke <body>,
// TTFB lambat). Lihat docs/SEO-AUDIT-2026-09.md.
export default function NotFound() {
  return (
    <html lang="id">
      <body className={`${fontVariables} antialiased bg-background text-foreground`}>
        <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">404</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Halaman Tidak Ditemukan
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Mungkin halamannya sudah dipindah atau dihapus, atau ada salah ketik di alamatnya.
          </p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground" lang="en">
            The page you requested could not be found.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/id/"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/en/"
              hrefLang="en"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 font-display text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Go to English site
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
