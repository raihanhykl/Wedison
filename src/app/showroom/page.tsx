// import { generateSeoMetadata } from "../lib/seo";
import { getSEOMetadata } from "../lib/seo1";
import ShowroomPageStructure from "./components/structure";
// const { metadata, jsonLd } = generateSeoMetadata({
//   title: "Showroom - Wedison",
//   description:
//     "Explore our showroom, where you can test ride our electric motorcycles, consult with our experts, and learn about financing options. Experience the future of transportation with Wedison Motors.",
//   path: "/showroom",
//   image: "/Showroom-Receptionist.webp",
//   type: "website",
//   jsonLdType: "organization",
// });

// export { metadata };
export const metadata = getSEOMetadata({
  title: "Showroom Wedison - Lihat & Test Motor Listrik Terbaru",
  description:
    "Kunjungi showroom Wedison untuk melihat dan mencoba motor listrik terbaru serta teknologi SuperCharge. Dapatkan informasi lokasi, jam buka, dan fasilitas lengkap di sini.",
  keywords: [
    "wedison",
    "showroom motor listrik",
    "test ride motor listrik",
    "motor listrik terbaru",
    "kendaraan listrik",
    "supercharge",
    "EV",
  ],
  url: "https://wedison.co/showroom/",
  image: "https://wedison.co/Showroom-Receptionist.webp",
  lang: "id",
});

export default function ShowroomPage() {
  return (
    <>
      {/* {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )} */}
      {/* Main content of the showroom page */}
      <ShowroomPageStructure />;
    </>
  );
}
