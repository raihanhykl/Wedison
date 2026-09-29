import React from "react";
import AboutPage from "./structure";
import { getSEOMetadata } from "@/app/lib/seo1";
// import { generateSeoMetadata } from "../../lib/seo";
// const { metadata, jsonLd } = generateSeoMetadata({
//   title: "About Us - Wedison",
//   description:
//     "Learn more about Wedison, our company, and how we're committed to driving innovation in the electric vehicle industry.",
//   path: "/corporate/about",
//   image: "/about-us.webp",
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
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/corporate/about" });
}

export default function Page() {
  return (
    <>
      {/* Main content of the showroom page */}
      <AboutPage />;
    </>
  );
}
