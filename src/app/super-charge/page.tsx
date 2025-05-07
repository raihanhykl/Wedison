import FeatureSection2 from "@/app/components/feature-section";
import HeroSection from "../components/hero-section";
import { generateSeoMetadata } from "../lib/seo";
const { metadata, jsonLd } = generateSeoMetadata({
  title: "Super Charge - Wedison",
  description:
    "Super Charge is a cutting-edge electric motorcycle charging station designed for fast and efficient charging. Super Charge can charge Wedison Bikes from 10% to 80% in just 20 minutes. With its sleek design and advanced technology, Super Charge is the perfect solution for electric vehicle owners looking for a reliable and convenient charging option.",
  path: "/super-charge",
  image: "/supercharge-hero.webp",
  type: "website",
  jsonLdType: "product",
});

export { metadata };

export default function EdmaxPage() {
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <main className="min-h-screen bg-white">
        <HeroSection
          name="supercharge"
          imageAlt="Super Charge Charging Station"
          theme="light"
          imageStyle=" md:object-[0%_40%] 2xl:object-[0%_60%] "
        />
        <FeatureSection2
          page="supercharge"
          feature={1}
          alt="man riding dash electric motorcycle"
          image="/supercharge-chip.webp"
          style="bg-gray-100"
          // style="bg-gradient-to-bl  from-[#1E1F22] from-60% to-[#3A3B3F]"
          titleColor="text-black"
          descColor="text-gray-600"
          tagStyle="border-teal-200 bg-teal-50 text-teal-600"
        />
        <FeatureSection2
          page="supercharge"
          feature={2}
          alt="Victory in the golden hour"
          image="/supercharge-location.webp"
          style="bg-white object-[100%_0%] object-cover"
          titleColor="text-black"
          descColor="text-gray-600"
          tagStyle="border-teal-200 bg-teal-50 text-teal-600"
        />
        <FeatureSection2
          page="supercharge"
          feature={3}
          alt="Victory in the golden hour"
          image="/edmax-charging.webp"
          style="bg-gray-100"
          titleColor="text-black"
          descColor="text-gray-600"
          tagStyle="border-teal-200 bg-teal-50 text-teal-600"
        />
      </main>
    </>
  );
}
