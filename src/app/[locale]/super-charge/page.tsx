import { Suspense } from "react";
import FeatureSection2 from "@/components/feature-section";
import HeroSection from "@/components/hero-section";
import VideoSection from "./videoSection";
import AppShowcase from "./app-showcase";
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
    <>
      <main className="min-h-screen bg-background">
        <HeroSection
          name="supercharge"
          imageAlt="SuperCharge Charging Station"
          theme="dark"
          imageStyle="object-[90%_10%] md:object-[100%_40%] 2xl:object-[0%_100%] "
          noButton={true}
        />

        <Suspense fallback={<p>Loading video...</p>}>
          <VideoSection />
        </Suspense>
        <FeatureSection2
          page="supercharge"
          feature={1}
          alt="man riding dash electric motorcycle"
          image="/super-charge/supercharge-chip-1.webp"
          style="bg-muted"
          titleColor="text-foreground"
          descColor="text-muted-foreground"
          tagStyle="border-border bg-secondary text-primary"
        />
        <FeatureSection2
          page="supercharge"
          feature={2}
          alt="Victory in the golden hour"
          image="/super-charge/supercharge-location-1.webp"
          style="bg-background object-[100%_0%] object-cover"
          titleColor="text-foreground"
          descColor="text-muted-foreground"
          tagStyle="border-border bg-secondary text-primary"
        />
        <FeatureSection2
          page="supercharge"
          feature={3}
          alt="Victory in the golden hour"
          image="/super-charge/supercharge-charging.webp"
          imageStyle="object-[10%_100%]"
          style="bg-muted"
          titleColor="text-foreground"
          descColor="text-muted-foreground"
          tagStyle="border-border bg-secondary text-primary"
        />

        {/* SuperCharge App Showcase */}
        <AppShowcase />
      </main>
    </>
  );
}
