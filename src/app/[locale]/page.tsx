import React from "react";
import Landing from "@/app/_home/landing";
import { getSEOMetadata } from "@/app/lib/seo1";

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
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/" });
}

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
