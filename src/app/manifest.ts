import type { MetadataRoute } from "next";

// Web app manifest (dipasang otomatis sebagai <link rel="manifest">). Ikon dari logogram resmi.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wedison – Motor Listrik & SuperCharge",
    short_name: "Wedison",
    description:
      "Motor listrik Wedison (Athena, Bees, Victory, EdPower) dan jaringan pengisian cepat SuperCharge.",
    id: "/id/",
    start_url: "/id/",
    scope: "/",
    display: "minimal-ui",
    lang: "id",
    background_color: "#FAFAF7",
    theme_color: "#1E5B40",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
