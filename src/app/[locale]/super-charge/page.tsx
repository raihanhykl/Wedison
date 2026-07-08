import SuperChargeHero from "./hero";
import SuperChargeSpeed from "./speed";
import SuperChargeNetwork from "./network";
import SuperChargeFeature from "./features";
import SuperChargeCta from "./cta";
import VideoSection from "./videoSection";
import AppSection from "./app-section";
import { getSEOMetadata } from "@/app/lib/seo1";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/super-charge" });
}

export default function SuperChargePage() {
  return (
    <main className="bg-background">
      {/* 1 — Hero (gelap) */}
      <SuperChargeHero />

      {/* 2 — Kecepatan: angka bahasa-manusia (terang) */}
      <SuperChargeSpeed />

      {/* 3 — Video overview (terang) */}
      <VideoSection />

      {/* 4 — Living Network: peta + counter (forest, signature #1) */}
      <SuperChargeNetwork />

      {/* 5 — Teknologi charging */}
      <div id="teknologi" className="scroll-mt-16">
        <SuperChargeFeature
          feature={1}
          icon="Zap"
          image="/super-charge/supercharge-chip-1.webp"
          alt="Modul pengisian cepat Wedison SuperCharge"
          bg="bg-muted"
          reverse
        />
        <SuperChargeFeature
          feature={2}
          icon="MapPin"
          image="/super-charge/supercharge-location-1.webp"
          alt="Motor listrik Wedison di stasiun SuperCharge"
          bg="bg-background"
          imagePosition="object-[70%_25%]"
        />
        <SuperChargeFeature
          feature={3}
          icon="ShieldCheck"
          image="/super-charge/supercharge-charging.webp"
          alt="Proses pengisian daya di stasiun Wedison SuperCharge"
          bg="bg-muted"
          reverse
          imagePosition="object-[30%_75%]"
        />
      </div>

      {/* 6 — App: scrollytelling (signature #2) */}
      <AppSection />

      {/* 7 — CTA penutup (forest-deep) */}
      <SuperChargeCta />
    </main>
  );
}
