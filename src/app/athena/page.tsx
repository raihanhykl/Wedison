import ProductPicker, { ProductColor } from "../components/product-pick";
import HeroSection from "../components/hero-section";
import SpecificationsSection from "../components/specifications-section";
import FeatureSection2 from "../components/feature-section";
import { generateSeoMetadata } from "../lib/seo";

const { metadata, jsonLd } = generateSeoMetadata({
  title: "Athena - The Future of Retro Electric Scooter",
  description:
    "Athena is a combination of a retro with a futuristic scooter. It has a retro and timeless design, combined with advanced technology.",
  path: "/athena",
  image: "/athena-hero.webp",
  type: "website",
  jsonLdType: "product",
  productName: "Athena",
});

export { metadata };
export default function EdmaxPage() {
  const product: ProductColor[] = [
    {
      name: "blue",
      hex: "#00BFFF",
      alt: "Athena in Blue Color",
    },
    {
      name: "slate",
      hex: "#6c788f",
      alt: "Athena in Slate Color",
    },
    {
      name: "tosca",
      hex: "#5ad7af",
      alt: "Athena in Tosca Color",
    },
    {
      name: "black",
      hex: "#000000",
      alt: "Athena in Black Color",
    },
    {
      name: "white",
      hex: "#FFFFFF",
      alt: "Athena in White Color",
    },
    {
      name: "beige",
      hex: "#F5F5DC",
      alt: "Athena in Beige Color",
    },
  ];

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <main className="min-h-screen bg-white">
        <HeroSection name="athena" imageAlt="Athena Front Look" theme="dark" />
        <FeatureSection2
          page="athena"
          feature={1}
          alt="man riding dash electric motorcycle"
          image="/athena-feature1.webp"
          style="md:bg-gradient-to-r md:from-black md:from-0% md:via-[#151517] md:to-[#f73399]/30 bg-black"
          titleColor="text-white"
          descColor="text-gray-300"
        />
        <FeatureSection2
          page="athena"
          feature={2}
          alt="Victory in the golden hour"
          image="/athena-feature2.webp"
          // style="md:bg-gradient-to-l from-black from-10% via-[#151517] to-[#f73399]/30"
          style="md:bg-gradient-to-l md:from-black md:from-0% md:via-[#151517] md:to-[#f73399]/30 bg-black"
          titleColor="text-white"
          descColor="text-gray-300"
        />
        <ProductPicker
          productColor={product}
          productName="athena"
          style="bg-white"
          titleColor="text-black"
          descColor="text-gray-800"
        />
        <SpecificationsSection name="athena" />
      </main>
    </>
  );
}
