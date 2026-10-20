import React from "react";
import Landing from "@/app/_home/landing";
import { getSEOMetadata } from "@/app/lib/seo1";
import { getPricing, getStations } from "@/lib/cms/api";
import { startingPrices } from "@/lib/pricing/select";
import { SITES } from "@/data/supercharge-sites";

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

// Data stasiun untuk peta ringkas di beranda: backend (ISR, tag "stations") dengan
// fallback GeoJSON statis — sama seperti /super-charge/locations. Halaman tetap statis/ISR.
// Harga "mulai dari" per model dari modul Pricing (ISR, fallback snapshot statis).
export default async function Page() {
  const [remote, pricing] = await Promise.all([getStations(), getPricing()]);
  const sites = remote?.features.length ? remote.features : SITES.features;
  const prices = startingPrices(pricing);
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
        <Landing sites={sites} prices={prices} />
      </div>
    </>
  );
}
