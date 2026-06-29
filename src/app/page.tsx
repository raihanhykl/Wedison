import React from "react";
import Landing from "./_home/landing";
import { getSEOMetadata } from "./lib/seo1";

// const { metadata, jsonLd } = generateSeoMetadata({
//   title: "Wedison – Ride The Future With Wedison",
//   description:
//     "Wedison is a leading electric motorcycle brand with the latest Super Charge Technology. Our electric motorcycles are designed for urban commuting, offering a perfect blend of performance, style, and sustainability. Experience the future of transportation with Wedison.",
//   path: "/",
//   image: "/wedison-sidebyside.png",
//   type: "website",
//   jsonLdType: "organization",
// });

// export { metadata };
export const metadata = getSEOMetadata({
  title: "Wedison - Motor Listrik & SuperCharge Terdepan di Indonesia",
  description:
    "Wedison adalah produsen motor listrik terbaik di Indonesia dengan teknologi SuperCharge. Temukan produk motor listrik premium, stasiun pengisian cepat, dan solusi kendaraan listrik masa depan.",
  keywords: [
    "wedison",
    "motor listrik",
    "kendaraan listrik",
    "EV",
    "supercharge",
    "motor listrik terbaik",
    "electric motorcycle",
    "charging station",
    "otomotif",
  ],
  url: "https://wedison.co/",
  image: "https://wedison.co/wedison-sidebyside.png",
  lang: "id",
});

export default function Page() {
  return (
    <>
      <div className="">
        {/* <div id="hero">
          <Hero />
        </div>
        <div id="features">
          <Features />
        </div>
        <div id="products">
          <Products />
        </div>
        <div>
          <ExpenseComparisonTable />
        </div>
        <div id="contact">
          <ContactForm />
        </div> */}
        <Landing />
      </div>
    </>
  );
}
