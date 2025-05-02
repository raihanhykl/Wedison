import { generateSeoMetadata } from "../lib/seo";
import ShowroomPageStructure from "./components/structure";
const { metadata, jsonLd } = generateSeoMetadata({
  title: "Showroom - Wedison",
  description:
    "Explore our showroom, where you can test ride our electric motorcycles, consult with our experts, and learn about financing options. Experience the future of transportation with Wedison Motors.",
  path: "/showroom",
  image: "/Showroom-Receptionist.webp",
  type: "website",
  jsonLdType: "organization",
});

export { metadata };

export default function ShowroomPage() {
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      {/* Main content of the showroom page */}
      <ShowroomPageStructure />;
    </>
  );
}
