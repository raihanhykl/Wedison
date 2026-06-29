// Root layout = shell tipis (locale-agnostic).
// <html>/<body>, fonts, providers, Navbar/Footer dipindah ke src/app/[locale]/layout.tsx
// karena <html lang> harus mengikuti locale dari URL. Root cukup meneruskan children.
// (Pola standar Next.js App Router untuk routing [locale].)
import { getSEOMetadata } from "./lib/seo1";

// Metadata default site-wide (di-override per-locale di Fase 4 via generateMetadata).
export const metadata = getSEOMetadata({
  title: "Wedison - Motor Listrik & SuperCharge Indonesia",
  description:
    "Wedison adalah produsen motor listrik dan teknologi supercharger terdepan di Indonesia. Temukan produk, spesifikasi, dan solusi kendaraan listrik modern di sini.",
  keywords: [
    "wedison",
    "motor listrik",
    "supercharge",
    "kendaraan listrik",
    "EV",
  ],
  url: "https://wedison.co",
  image: "https://wedison.co/wedison-sidebyside.png",
  lang: "id",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
