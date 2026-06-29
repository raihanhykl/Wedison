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
export const metadata = getSEOMetadata({
  title: "Kontak Wedison - Hubungi Kami",
  description:
    "Hubungi Wedison untuk informasi produk, layanan purna jual, kerjasama bisnis, atau pertanyaan seputar motor listrik dan SuperCharge. Tim kami siap membantu Anda.",
  keywords: [
    "wedison",
    "kontak wedison",
    "hubungi wedison",
    "layanan pelanggan",
    "motor listrik",
    "supercharge",
    "EV",
  ],
  url: "https://wedison.co/corporate/contact/",
  image: "https://wedison.co/contact-us.webp",
  lang: "id",
});

export default function Page() {
  return (
    <>
      {/* Main content of the showroom page */}
      <ContactPage />
    </>
  );
}
