import FeatureSection2 from "../components/feature-section";
import HeroSection from "../components/hero-section";
import SpecificationsSection from "../components/specifications-section";
import { generateSeoMetadata } from "../lib/seo";

const { metadata, jsonLd } = generateSeoMetadata({
  title: "Dash - Accelerate Your Delivery With Dash",
  description:
    "Dash is a sleek and efficient electric scooter with a powerful motor and sleek design. It's perfect for urban delivery and city commuting. Experience the future of transportation with Dash.",
  path: "/dash",
  image: "/dash-hero.webp",
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
        <HeroSection name="dash" imageAlt="dash side look" theme="dark" />
        <FeatureSection2
          page="dash"
          feature={1}
          alt="man riding dash electric motorcycle"
          image="/dash-feature1.webp"
          style="bg-gradient-to-t  from-black from-60% to-[#493c14]"
          titleColor="text-white"
          descColor="text-gray-300"
        />
        <FeatureSection2
          page="dash"
          feature={2}
          alt="Edmax super fast charge"
          image="/dash-feature2.webp"
          style="bg-gradient-to-b  from-black from-60% to-[#493c14]"
          titleColor="text-white"
          descColor="text-gray-300"
        />
        <SpecificationsSection name="dash" />
      </main>
    </>
  );
}
