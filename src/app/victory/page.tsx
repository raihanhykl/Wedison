import ProductPicker, { ProductColor } from "../components/product-pick";
import FeatureSection2 from "../components/feature-section";
import HeroSection from "../components/hero-section";
import SpecificationsSection from "../components/specifications-section";
import { getSEOMetadata } from "../lib/seo1";

// const { metadata, jsonLd } = generateSeoMetadata({
//   title: "Victory - Own The Street With Victory",
//   description:
//     "Victory is a versatile electric scooter with a sleek design, built for city rides and modern urban style. Enjoy the thrill of the open road with its powerful motor and sleek design. Experience the future of transportation with Victory.",
//   path: "/victory",
//   image: "/victory-hero.webp",
//   type: "website",
//   jsonLdType: "product",
//   productName: "Victory",
// });

// export { metadata };
export const metadata = getSEOMetadata({
  title: "Victory - Motor Listrik Urban Modern | Wedison",
  description:
    "Victory adalah motor listrik urban dari Wedison, didesain untuk mobilitas kota yang efisien, ramah lingkungan, dan hemat energi. Temukan spesifikasi, fitur, dan keunggulannya di sini.",
  keywords: [
    "wedison",
    "motor listrik",
    "victory",
    "motor listrik urban",
    "kendaraan listrik",
    "EV",
    "motor listrik hemat energi",
    "electric motorcycle",
  ],
  url: "https://wedison.co/victory",
  image: "https://wedison.co/victory-hero.webp",
  lang: "id",
});

export default function EdmaxPage() {
  const product: ProductColor[] = [
    {
      name: "black",
      hex: "#000000",
      alt: "Black Edmax Electric Motorcycle",
    },
    {
      name: "grey",
      hex: "#808080",
      alt: "Grey Edmax Electric Motorcycle",
    },
    {
      name: "red",
      hex: "#FF0000",
      alt: "Red Edmax Electric Motorcycle",
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-white">
        <HeroSection
          name="victory"
          imageAlt="victory motorcycle"
          theme="dark"
        />
        <FeatureSection2
          page="victory"
          feature={1}
          alt="man riding dash electric motorcycle"
          image="/victory-feature1.webp"
          style="bg-gradient-to-r from-[#1E1F22] from-0% to-black"
          titleColor="text-white"
          descColor="text-gray-300"
        />
        <FeatureSection2
          page="victory"
          feature={2}
          alt="Victory in the golden hour"
          image="/victory-feature2.webp"
          style="bg-gradient-to-l from-[#1E1F22] from-0% to-black"
          titleColor="text-white"
          descColor="text-gray-300"
        />
        <ProductPicker
          productName="victory"
          productColor={product}
          // style="bg-gradient-to-b from-[#1E1F22] from-0% to-black"
          style="bg-whitek"
          titleColor="text-blac"
          descColor="text-gray-800"
        />
        <SpecificationsSection name="victory" />
      </main>
    </>
  );
}
