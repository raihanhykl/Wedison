// "use client";
import React from "react";
import Hero from "./components/hero2";
import Features from "./components/features2";
import Products from "./components/products3";
import ContactForm from "./components/contact";
import KalkulatorPenghematan from "./components/calculator/calculator";
import { generateSeoMetadata } from "./lib/seo";

const { metadata, jsonLd } = generateSeoMetadata({
  title: "Wedison – Ride The Future With Wedison",
  description:
    "Wedison is a leading electric motorcycle brand with the latest Super Charge Technology. Our electric motorcycles are designed for urban commuting, offering a perfect blend of performance, style, and sustainability. Experience the future of transportation with Wedison.",
  path: "/",
  image: "/wedison-sidebyside.png",
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

      <div className="min-h-screen">
        <div id="hero">
          <Hero />
        </div>
        <div id="features">
          <Features />
        </div>
        <div id="products">
          <Products />
        </div>
        <div>
          <KalkulatorPenghematan />
        </div>
        <div id="contact">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
