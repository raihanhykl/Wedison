// Root layout = shell tipis (locale-agnostic).
// <html>/<body>, fonts, providers, Navbar/Footer dipindah ke src/app/[locale]/layout.tsx
// karena <html lang> harus mengikuti locale dari URL. Root cukup meneruskan children.
// (Pola standar Next.js App Router untuk routing [locale].)
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedison.co";

// Metadata default site-wide (fallback). Tiap halaman [locale] meng-override
// via generateMetadata (canonical/hreflang/OG per-locale di seo1.ts).
// metadataBase membuat URL relatif (OG/alternates) ter-resolve ke origin yang benar.
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Wedison - Motor Listrik & SuperCharge Indonesia",
  description:
    "Wedison adalah produsen motor listrik dan teknologi supercharger terdepan di Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
