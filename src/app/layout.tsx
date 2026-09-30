// Root layout = shell tipis (locale-agnostic).
// <html>/<body>, fonts, providers, Navbar/Footer dipindah ke src/app/[locale]/layout.tsx
// karena <html lang> harus mengikuti locale dari URL. Root cukup meneruskan children.
// (Pola standar Next.js App Router untuk routing [locale].)
import type { Metadata, Viewport } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { robotsFor } from "@/app/lib/seo1";

// Metadata default site-wide (fallback). Tiap halaman [locale] meng-override
// via generateMetadata (canonical/hreflang/OG per-locale di seo1.ts).
// metadataBase membuat URL relatif (OG/alternates) ter-resolve ke origin yang benar.
// robots: noindex otomatis di staging/preview (lihat src/lib/seo/site.ts).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Wedison – Motor Listrik & SuperCharge Indonesia",
  description:
    "Motor listrik Wedison: Athena, Bees, Victory, dan EdPower. Isi daya 10% ke 80% dalam 15 menit di jaringan SuperCharge, garansi baterai 3 tahun. Jadwalkan test ride.",
  applicationName: SITE_NAME,
  robots: robotsFor(),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E5B40",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
