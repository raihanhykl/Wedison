import FeatureSection2 from "@/app/components/feature-section";
import HeroSection from "../components/hero-section";
import { getSEOMetadata } from "../lib/seo1";
import VideoSection from "./videoSection";
import { Suspense } from "react";
// import { generateSeoMetadata } from "../lib/seo";
// const { metadata, jsonLd } = generateSeoMetadata({
//   title: "Super Charge - Wedison",
//   description:
//     "Super Charge is a cutting-edge electric motorcycle charging station designed for fast and efficient charging. Super Charge can charge Wedison Bikes from 10% to 80% in just 20 minutes. With its sleek design and advanced technology, Super Charge is the perfect solution for electric vehicle owners looking for a reliable and convenient charging option.",
//   path: "/super-charge",
//   image: "/supercharge-hero.webp",
//   type: "website",
//   jsonLdType: "product",
//   productName: "Super Charge",
// });

// export { metadata };
export const metadata = getSEOMetadata({
  title: "SuperCharge - Stasiun Pengisian Cepat Motor Listrik | Wedison",
  description:
    "SuperCharge adalah teknologi stasiun pengisian super cepat dari Wedison, solusi terbaik untuk mengisi daya motor listrik dalam waktu singkat. Lihat lokasi dan keunggulan SuperCharge di sini.",
  keywords: [
    "wedison",
    "supercharge",
    "charging station",
    "pengisian motor listrik",
    "stasiun pengisian",
    "motor listrik",
    "EV",
    "teknologi pengisian cepat",
  ],
  url: "https://wedison.co/super-charge/",
  image: "https://wedison.co/supercharge-hero.webp",
  lang: "id",
});

export default function EdmaxPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
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
          style="bg-gray-100"
          // style="bg-gradient-to-bl  from-[#1E1F22] from-60% to-[#3A3B3F]"
          titleColor="text-black"
          descColor="text-gray-600"
          tagStyle="border-[var(--primary-lighter)] bg-[var(--secondary-light)] text-[var(--primary-dark)]"
        />
        <FeatureSection2
          page="supercharge"
          feature={2}
          alt="Victory in the golden hour"
          image="/super-charge/supercharge-location-1.webp"
          style="bg-white object-[100%_0%] object-cover"
          titleColor="text-black"
          descColor="text-gray-600"
          tagStyle="border-[var(--primary-lighter)] bg-[var(--secondary-light)] text-[var(--primary-dark)]"
        />
        <FeatureSection2
          page="supercharge"
          feature={3}
          alt="Victory in the golden hour"
          image="/super-charge/supercharge-charging.webp"
          imageStyle="object-[10%_100%]"
          style="bg-gray-100"
          titleColor="text-black"
          descColor="text-gray-600"
          tagStyle="border-[var(--primary-lighter)] bg-[var(--secondary-light)] text-[var(--primary-dark)]"
        />
      </main>
    </>
  );
}
