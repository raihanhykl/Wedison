import { getSEOMetadata } from "@/app/lib/seo1";
import ShowroomPageStructure from "./components/structure";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema, showroomsSchema } from "@/lib/seo/schema";
import { dictText, loadDictionary } from "@/lib/seo/dictionary";
import { SHOWROOM_FAQ_COUNT } from "./components/faq-data";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: "/showroom" });
}

export default async function ShowroomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  // FAQPage dari teks yang sama dengan accordion yang dirender (semua jawaban ada di HTML).
  const dict = await loadDictionary(loc);
  const faq = Array.from({ length: SHOWROOM_FAQ_COUNT }, (_, i) => ({
    question: dictText(dict, `showroomPage.faq.q${i + 1}`),
    answer: dictText(dict, `showroomPage.faq.a${i + 1}`),
  }));
  return (
    <>
      {/* MotorcycleDealer/LocalBusiness per cabang (alamat, koordinat, jam buka, WhatsApp) */}
      <JsonLd
        data={[
          breadcrumbSchema(loc, [
            { name: loc === "en" ? "Home" : "Beranda", path: "/" },
            { name: "Showroom", path: "/showroom" },
          ]),
          showroomsSchema(loc),
          faqSchema(faq),
        ]}
      />
      <ShowroomPageStructure />
    </>
  );
}
