import AboutPage from "./structure";
import { getSEOMetadata } from "@/app/lib/seo1";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: "/corporate/about" });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  return (
    <>
      <JsonLd
        data={breadcrumbSchema(loc, [
          { name: loc === "en" ? "Home" : "Beranda", path: "/" },
          { name: loc === "en" ? "About Wedison" : "Tentang Wedison", path: "/corporate/about" },
        ])}
      />
      <AboutPage />
    </>
  );
}
