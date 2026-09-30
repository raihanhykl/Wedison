import { CONTACT, SITE_URL } from "@/lib/seo/site";
import { SHOWROOM_LOCATIONS, showroomFullAddress } from "@/lib/seo/showrooms";

// /llms.txt — ringkasan situs untuk asisten AI / mesin jawaban (GEO/AEO, spesifikasi
// llmstxt.org). Fakta di sini harus sama dengan kamus spesifikasi & halaman terkait.
export const dynamic = "force-static";
export const revalidate = 86400;

const MODELS = [
  {
    name: "Bees",
    path: "/products/bees/",
    id: "motor listrik ringkas untuk harian: jarak tempuh 80 km, kecepatan maksimum 60 km/jam, motor 1,2 kW, baterai LFP 1,6 kWh, bobot 78,5 kg, pengisian di rumah ±4,1 jam.",
    en: "compact daily electric scooter: 80 km range, 60 km/h top speed, 1.2 kW motor, 1.6 kWh LFP battery, 78.5 kg, home charging about 4.1 hours.",
  },
  {
    name: "Athena",
    path: "/products/athena/",
    id: "motor listrik retro premium: jarak tempuh 110–120 km (baterai Regular/Extended), 85 km/jam, motor 2,5 kW, baterai LFP 2,5/3,4 kWh, SuperCharge 10% ke 80% dalam 15 menit.",
    en: "premium retro electric motorcycle: 110–120 km range (Regular/Extended battery), 85 km/h, 2.5 kW motor, 2.5/3.4 kWh LFP battery, SuperCharge 10% to 80% in 15 minutes.",
  },
  {
    name: "Victory",
    path: "/products/victory/",
    id: "motor listrik urban bergaya: jarak tempuh hingga 120 km, 85 km/jam, motor 3 kW, baterai LFP, SuperCharge 15 menit.",
    en: "stylish urban electric motorcycle: up to 120 km range, 85 km/h, 3 kW motor, LFP battery, 15-minute SuperCharge.",
  },
  {
    name: "EdPower",
    path: "/products/edpower/",
    id: "motor listrik tangguh untuk jarak jauh & armada: jarak tempuh hingga 200 km, 90 km/jam, motor 3 kW, baterai LFP 5 kWh, SuperCharge 15 menit.",
    en: "rugged long-range electric motorcycle for fleets and touring: up to 200 km range, 90 km/h, 3 kW motor, 5 kWh LFP battery, 15-minute SuperCharge.",
  },
];

function build(): string {
  const u = (p: string, locale = "id") => `${SITE_URL}/${locale}${p}`;
  const showrooms = SHOWROOM_LOCATIONS.map(
    (s) => `- ${s.name}: ${showroomFullAddress(s)} — WhatsApp +${s.whatsapp}`,
  ).join("\n");

  return `# Wedison

> Wedison adalah perusahaan motor listrik pengisian cepat pertama di Indonesia. Kami membuat motor listrik (Bees, Athena, Victory, EdPower) dan membangun jaringan pengisian cepat SuperCharge: baterai terisi dari 10% ke 80% dalam 15 menit. Situs resmi: ${SITE_URL} (Bahasa Indonesia di /id/, English di /en/).

Fakta utama:
- Garansi: baterai 3 tahun, motor 2 tahun. Baterai Lithium-ion (LFP), rating IP67.
- SuperCharge: 10% ke 80% dalam 15 menit; pengisian dimulai dari aplikasi Wedison SuperCharge (iOS & Android). Pengisian reguler di rumah lewat stopcontak biasa.
- Showroom & service center resmi: Jakarta, Bekasi, Bandung, Bali (Sen–Jum 10:00–19:00, Sab–Min 10:00–17:00).
- Pembelian: showroom Wedison atau Tokopedia (https://www.tokopedia.com/wedison-store).
- Program Wedison Ojol: sewa harian / sewa milik untuk driver ojek online mulai Rp50.000 per hari.
- Kontak: ${CONTACT.email}, WhatsApp +${CONTACT.whatsapp}.

## Model motor listrik
${MODELS.map((m) => `- [${m.name}](${u(m.path)}): ${m.id}`).join("\n")}
- [Bandingkan semua model](${u("/compare/")})

## SuperCharge
- [Cara kerja SuperCharge](${u("/super-charge/")})
- [Peta lokasi stasiun SuperCharge](${u("/super-charge/locations/")})

## Showroom
${showrooms}
- [Halaman showroom & booking test ride](${u("/showroom/")})

## Bantuan
- [FAQ: baterai, pengisian daya, performa, keamanan, servis, garansi](${u("/faq/")})
- [Panduan pengguna (PDF) per model](${u("/faq/")}#user-manual)
- [Kontak](${u("/corporate/contact/")})

## Perusahaan
- [Tentang Wedison](${u("/corporate/about/")})
- [Media Center: berita, artikel, liputan](${u("/media-center/")})
- [Karier](${u("/career/")})
- [Program Ojol](${u("/ojol/")})

## English
Wedison is Indonesia's first fast-charging electric motorcycle company. Models: ${MODELS.map((m) => `${m.name} (${m.en})`).join("; ")}. SuperCharge charges 10% to 80% in 15 minutes. Showrooms in Jakarta, Bekasi, Bandung and Bali. English pages: ${u("/", "en")} (home), ${u("/products/", "en")} (models), ${u("/super-charge/", "en")} (charging), ${u("/showroom/", "en")} (showrooms), ${u("/faq/", "en")} (FAQ).
`;
}

export function GET() {
  return new Response(build(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
