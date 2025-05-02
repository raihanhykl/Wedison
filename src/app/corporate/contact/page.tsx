import React from "react";
import { generateSeoMetadata } from "../../lib/seo";
import ContactPage from "./structure";

const { metadata, jsonLd } = generateSeoMetadata({
  title: "Contact Us - Wedison",
  description:
    "Get in touch with Wedison for inquiries, support, or feedback. We're here to help you with all your electric motorcycle needs.",
  path: "/corporate/contact",
  image: "/contact-us.webp",
  type: "website",
  jsonLdType: "organization",
});

export { metadata };
export default function Page() {
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      {/* Main content of the showroom page */}
      <ContactPage />
    </>
  );
}
