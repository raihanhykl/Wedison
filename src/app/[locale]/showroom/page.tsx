import { getSEOMetadata } from "@/app/lib/seo1";
import ShowroomPageStructure from "./components/structure";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema, showroomsSchema } from "@/lib/seo/schema";
import { dictText, loadDictionary } from "@/lib/seo/dictionary";
import { getShowrooms } from "@/lib/cms/api";
import { joinCities, listedShowrooms } from "@/lib/seo/showrooms";
import { SHOWROOM_FAQ_COUNT, showroomFaqAnswer } from "./components/faq-data";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  // Daftar kota dari admin › Showrooms, agar deskripsi tidak basi saat cabang bertambah.
  const cities = joinCities(listedShowrooms(await getShowrooms()).map((s) => s.city), loc);
  const description = cities
    ? loc === "en"
      ? `Visit Wedison showrooms in ${cities}: electric motorcycle test rides, consultation, financing and official service. Book a visit.`
      : `Kunjungi showroom Wedison di ${cities}: test ride motor listrik, konsultasi, pembiayaan, dan servis resmi. Booking kunjungan.`
    : undefined;
  return getSEOMetadata({
    locale: loc,
    path: "/showroom",
    // Deskripsi panjang (banyak kota) -> pakai teks bawaan seo-strings (≤155 karakter).
    description: description && description.length <= 160 ? description : undefined,
  });
}

export default async function ShowroomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const [dict, showrooms] = await Promise.all([loadDictionary(loc), getShowrooms()]);
  // FAQPage dari teks yang sama dengan accordion yang dirender (semua jawaban ada di HTML).
  const faq = Array.from({ length: SHOWROOM_FAQ_COUNT }, (_, i) => ({
    question: dictText(dict, `showroomPage.faq.q${i + 1}`),
    answer: showroomFaqAnswer(i + 1, showrooms, loc) ?? dictText(dict, `showroomPage.faq.a${i + 1}`),
  }));
  return (
    <>
      {/* MotorcycleDealer/LocalBusiness per cabang (alamat, koordinat, jam buka, tanggal tutup, WhatsApp) */}
      <JsonLd
        data={[
          breadcrumbSchema(loc, [
            { name: loc === "en" ? "Home" : "Beranda", path: "/" },
            { name: "Showroom", path: "/showroom" },
          ]),
          showroomsSchema(loc, showrooms),
          faqSchema(faq),
        ]}
      />
      <ShowroomPageStructure />
    </>
  );
}
