import FeatureSection2 from "../components/feature-section";
import HeroSection from "../components/hero-section";
import SpecificationsSection from "../components/specifications-section";
import ProductPicker, { ProductColor } from "../components/product-pick";
import { getSEOMetadata } from "../lib/seo1";

export const metadata = getSEOMetadata({
  title: "Mini - Motor Listrik Compact & Praktis | Wedison",
  description:
    "Mini adalah motor listrik compact dari Wedison, cocok untuk kebutuhan harian, desain praktis dan mudah digunakan. Lihat keunggulan dan spesifikasi lengkapnya di sini.",
  keywords: [
    "wedison",
    "motor listrik",
    "mini",
    "motor listrik compact",
    "kendaraan listrik",
    "EV",
    "motor listrik praktis",
    "electric motorcycle",
  ],
  url: "https://wedison.co/mini",
  image: "https://wedison.co/mini-hero.webp",
  lang: "id",
});

// const { metadata, jsonLd } = generateSeoMetadata({
//   title: "Mini - Affordable Mobility for Every Ride",
//   description: "Mini is the most agile bike from wedison. it's ",
//   path: "/mini",
//   image: "/mini-hero.webp",
//   type: "website",
//   jsonLdType: "product",
//   productName: "Mini",
// });

// export { metadata };

export default function MiniPage() {
  const product: ProductColor[] = [
    {
      name: "black",
      hex: "#000000",
      alt: "black",
    },
    {
      name: "grey",
      hex: "#808080",
      alt: "grey",
    },
    {
      name: "red",
      hex: "#FF0000",
      alt: "red",
    },
    {
      name: "smoke",
      hex: "#a0a0a0",
      alt: "smoke",
    },
    {
      name: "white",
      hex: "#FFFFFF",
      alt: "white",
    },
  ];
  return (
    <>
      <main className="min-h-screen bg-white">
        <HeroSection
          name="mini"
          imageAlt="Mini Side Look"
          theme="dark"
          imageStyle=" lg:object-[0%_100%] object-[65%_0%] "
        />

        <FeatureSection2
          page="mini"
          feature={1}
          alt="mini in street"
          image="/mini-feature1.webp"
          style="bg-gradient-to-r from-black from-0% via-[#151517] to-[#234445]"
          // style="bg-gradient-to-bl  from-[#1E1F22] from-60% to-[#3A3B3F]"
          titleColor="text-white"
          descColor="text-gray-300"
        />
        <FeatureSection2
          page="mini"
          feature={2}
          alt="mini in street"
          image="/mini-feature2.webp"
          style="bg-gradient-to-l from-black from-10% via-[#151517] to-[#234445]"
          titleColor="text-white"
          descColor="text-gray-300"
        />
        <ProductPicker
          productName="mini"
          productColor={product}
          // style="bg-gradient-to-b from-[#1E1F22] from-0% to-black"
          style="bg-whitek"
          titleColor="text-blac"
          descColor="text-gray-800"
        />
        <SpecificationsSection name="mini" />
      </main>
    </>
  );
}
