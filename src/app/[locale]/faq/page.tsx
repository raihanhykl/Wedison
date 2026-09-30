import FaqStructure from "./structure";
import { FAQ_CATEGORIES } from "./questions";
import { getSEOMetadata } from "@/app/lib/seo1";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { dictText, loadDictionary } from "@/lib/seo/dictionary";
import type { Locale } from "@/app/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as Locale, path: "/faq" });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;

  // FAQPage JSON-LD (AEO/GEO): SEMUA tanya-jawab dari kamus locale aktif — sama persis dengan
  // yang dirender FaqStructure (seluruh kategori ada di HTML, bukan hanya tab aktif).
  const dict = await loadDictionary(loc);
  const items: { question: string; answer: string }[] = [];
  for (const cat of FAQ_CATEGORIES) {
    for (let i = 0; ; i++) {
      const question = dictText(dict, `faq.${cat}.questions.${i}.question`);
      if (!question) break;
      const answer = dictText(dict, `faq.${cat}.questions.${i}.answer`);
      if (answer) items.push({ question, answer });
    }
  }

  return (
    <div>
      <JsonLd
        data={[
          breadcrumbSchema(loc, [
            { name: loc === "en" ? "Home" : "Beranda", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqSchema(items),
        ]}
      />
      <FaqStructure />
    </div>
  );
}
