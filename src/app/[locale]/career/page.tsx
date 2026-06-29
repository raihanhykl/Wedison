import { getSEOMetadata } from "@/app/lib/seo1";
import CareerClient from "./client";

export const metadata = getSEOMetadata({
  title: "Karier - Bergabung dengan Wedison | Lowongan Kerja",
  description:
    "Temukan lowongan kerja terbaru di Wedison. Bergabunglah dengan tim yang membangun masa depan kendaraan listrik di Indonesia.",
  keywords: [
    "wedison",
    "karier",
    "lowongan kerja",
    "loker wedison",
    "kerja di wedison",
    "motor listrik",
  ],
  url: "https://wedison.co/career/",
  image: "https://wedison.co/wedison-sidebyside.png",
  lang: "id",
});

export default function CareerPage() {
  return <CareerClient />;
}
