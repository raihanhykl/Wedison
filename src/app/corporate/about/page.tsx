import React from "react";
import AboutPage from "./structure";
import { generateSeoMetadata } from "../../lib/seo";
const { metadata, jsonLd } = generateSeoMetadata({
  title: "About Us - Wedison",
  description:
    "Learn more about Wedison, our company, and how we're committed to driving innovation in the electric vehicle industry.",
  path: "/corporate/about",
  image: "/about-us.webp",
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
      <AboutPage />;
    </>
  );
}
