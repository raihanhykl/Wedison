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
export const metadata = getSEOMetadata({
  title: "Tentang Wedison - Produsen Motor Listrik Indonesia",
  description:
    "Wedison adalah produsen motor listrik terkemuka di Indonesia yang berkomitmen menghadirkan solusi kendaraan listrik ramah lingkungan. Ketahui visi, misi, dan sejarah perusahaan kami.",
  keywords: [
    "wedison",
    "tentang wedison",
    "tentang kami",
    "motor listrik",
    "kendaraan listrik",
    "perusahaan EV",
    "visi misi",
    "produsen motor listrik",
  ],
  url: "https://wedison.co/corporate/about/",
  image: "https://wedison.co/about-us.webp",
  lang: "id",
});

export default function Page() {
  return (
    <>
      {/* Main content of the showroom page */}
      <AboutPage />;
    </>
  );
}
