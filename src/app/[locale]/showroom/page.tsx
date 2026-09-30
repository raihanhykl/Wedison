import { getSEOMetadata } from "@/app/lib/seo1";
import ShowroomPageStructure from "./components/structure";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, showroomsSchema } from "@/lib/seo/schema";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: "/showroom" });
}

export default async function ShowroomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
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
        ]}
      />
      <ShowroomPageStructure />
    </>
  );
}
