import BaasHero from "./hero";
import BaasWhy from "./why";
import BaasConfigurator from "./configurator";
import BaasHowItWorks from "./how-it-works";
import BaasIncluded from "./included";
import BaasCompare from "./compare";
import BaasAudience from "./audience";
import BaasCharging from "./charging";
import BaasFaq, { FAQ_COUNT } from "./faq";
import BaasCta from "./cta";
import { getSEOMetadata } from "@/app/lib/seo1";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: "/baas" });
}

export default async function BaasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  // Kamus dimuat di server hanya untuk FAQPage schema (string murni dari kunci baas.faq.*).
  const dict = (
    loc === "en"
      ? (await import("@/app/lib/dictionaries/en")).en
      : (await import("@/app/lib/dictionaries/id")).id
  ) as unknown as Record<string, string>;
  const faq = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: dict[`baas.faq.${i + 1}.q`],
    answer: dict[`baas.faq.${i + 1}.a`],
  }));

  return (
    // Bukan <main>: landmark <main> tunggal disediakan layout locale (#konten).
    // Alur: janji (hero) -> mengapa (dua hambatan) -> hitung sendiri (konfigurator) ->
    // cara kerja -> yang didapat -> BaaS vs biasa -> untuk siapa -> pengisian -> FAQ -> CTA.
    <div className="bg-background">
      <JsonLd
        data={[
          breadcrumbSchema(loc, [
            { name: loc === "en" ? "Home" : "Beranda", path: "/" },
            { name: "Battery as a Service", path: "/baas" },
          ]),
          faqSchema(faq),
        ]}
      />
      <BaasHero />
      <BaasWhy />
      <BaasConfigurator />
      <BaasHowItWorks />
      <BaasIncluded />
      <BaasCompare />
      <BaasAudience />
      <BaasCharging />
      <BaasFaq />
      <BaasCta />
    </div>
  );
}
