import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { LanguageProvider } from "@/app/lib/language-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { notFound } from "next/navigation";
import { LOCALES, isLocale } from "@/app/lib/locale";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

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

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* locale dari URL = sumber kebenaran bahasa (bukan localStorage lagi) */}
        <LanguageProvider locale={locale}>
          <Navbar />
          <div className="">{children}</div>
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
