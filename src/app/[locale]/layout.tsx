import { fontVariables } from "@/app/fonts";
import "@/app/globals.css";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { LanguageProvider } from "@/app/lib/language-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { notFound } from "next/navigation";
import { LOCALES, isLocale } from "@/app/lib/locale";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Next 15: params adalah Promise -> wajib di-await.
  const { locale } = await params;
  if (!isLocale(locale)) notFound(); // notFound() -> never, locale ter-narrow ke Locale

  // Muat kamus locale AKTIF di server (import dinamis) -> modul kamus locale lain
  // TIDAK pernah ikut ke client. Kamus dikirim sebagai prop lewat RSC (data + sedikit
  // elemen JSX statis) dan tetap ter-render ke HTML untuk SEO/no-JS.
  const dictionary =
    locale === "en"
      ? (await import("@/app/lib/dictionaries/en")).en
      : (await import("@/app/lib/dictionaries/id")).id;

  return (
    <html lang={locale}>
      <body className={`${fontVariables} antialiased`}>
        {/* Tanpa JS/observer, konten yang dibungkus <Reveal>/<StaggerItem> harus tetap terlihat
            (motion menulis opacity:0 ke HTML SSR). noscript ini memaksa visible saat scripting mati. */}
        <noscript>
          <style>{`.reveal-init{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/* locale dari URL = sumber kebenaran bahasa (bukan localStorage lagi) */}
        <LanguageProvider locale={locale} dictionary={dictionary}>
          <Navbar />
          <LazyMotionProvider>
            <div>{children}</div>
          </LazyMotionProvider>
          <Footer />
        </LanguageProvider>
        <Toaster
          toastOptions={{
            classNames: {
              description: "!text-gray-500",
            },
          }}
        />
      </body>
    </html>
  );
}
