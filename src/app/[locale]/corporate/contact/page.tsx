import React from "react";
// import { generateSeoMetadata } from "../../lib/seo";
import ContactPage from "./structure";
import { getSEOMetadata } from "@/app/lib/seo1";

// const { metadata, jsonLd } = generateSeoMetadata({
//   title: "Contact Us - Wedison",
//   description:
//     "Get in touch with Wedison for inquiries, support, or feedback. We're here to help you with all your electric motorcycle needs.",
//   path: "/corporate/contact",
//   image: "/contact-us.webp",
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
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/corporate/contact" });
}

export default function Page() {
  return (
    <>
      {/* Main content of the showroom page */}
      <ContactPage />
    </>
  );
}
