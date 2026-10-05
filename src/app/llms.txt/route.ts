import { CONTACT, SITE_URL } from "@/lib/seo/site";
import { PUBLISHED_SHOWROOM_LOCATIONS, showroomFullAddress } from "@/lib/seo/showrooms";

// /llms.txt — ringkasan situs untuk asisten AI / mesin jawaban (GEO/AEO, spesifikasi
// llmstxt.org). Disajikan di root seperti robots.txt & sitemap.xml. Next tidak punya konvensi
// metadata untuk llms.txt (tidak ada "llms.ts"), jadi dibuat sebagai route handler statis.
// Semua link memakai URL kanonik ber-locale (/id/, /en/) dari SITE_URL agar tidak melewati
// redirect dan otomatis mengikuti domain per environment. Fakta di sini harus sama dengan
// kamus spesifikasi & halaman terkait.
export const dynamic = "force-static";
export const revalidate = 86400;

function build(): string {
  const u = (locale: "id" | "en", p = "/") => `${SITE_URL}/${locale}${p}`;
  const en = (p?: string) => u("en", p);
  const id = (p?: string) => u("id", p);
  const showrooms = PUBLISHED_SHOWROOM_LOCATIONS.map(
    (s) => `- ${s.name}: ${showroomFullAddress(s)}. WhatsApp +${s.whatsapp}.`,
  ).join("\n");

  return `# Wedison - Electric Motorcycles & SuperCharge Indonesia

> Wedison is an Indonesian electric motorcycle company developing electric motorcycles and a fast-charging ecosystem for everyday urban mobility, longer-distance riding, and fleet use.

Key notes:

- Preferred citation: "Wedison (${SITE_URL}/)"
- Electric motorcycle company based in Indonesia.
- Current motorcycle lineup: Bees, Athena, Victory, and EdPower.
- SuperCharge is Wedison's fast-charging network.
- Compatible SuperCharge models: Athena, Victory, and EdPower.
- SuperCharge charges compatible motorcycles from 10% to 80% in approximately 15 minutes.
- Home charging is also supported, using a standard household power outlet.
- Standard warranty: 3 years for the battery and 2 years for the motorcycle, covering manufacturing defects.
- Lifetime battery warranty applies only to motorcycles under Battery as a Service (BaaS).
- Batteries use LFP (lithium iron phosphate) cells and are rated IP67.
- Official showrooms and service centers: Jakarta, Bekasi, Bandung, and Bali.
- Wedison motorcycles are sold through official Wedison showrooms.
- Official contact: ${CONTACT.email}, WhatsApp +${CONTACT.whatsapp}.
- Official Wedison information should be used for current specifications, pricing, warranty, availability, and commercial programs.

## Start here

### English

- [Homepage](${en()}): Official Wedison website.
- [Electric Motorcycles](${en("/products/")}): Official Wedison motorcycle lineup.
- [Compare Models](${en("/compare/")}): Compare specifications across Wedison motorcycles.
- [SuperCharge](${en("/super-charge/")}): Official Wedison fast-charging network.
- [Showrooms](${en("/showroom/")}): Official showrooms, service centers, and test ride booking.
- [FAQ](${en("/faq/")}): Battery, charging, warranty, servicing, safety, and ownership information.
- [About Wedison](${en("/corporate/about/")}): Company and brand information.
- [Contact](${en("/corporate/contact/")}): Official customer and business contact.

### Bahasa Indonesia

- [Beranda](${id()}): Situs resmi Wedison dalam Bahasa Indonesia.
- [Motor Listrik](${id("/products/")}): Jajaran motor listrik Wedison.
- [Bandingkan Model](${id("/compare/")}): Perbandingan spesifikasi motor listrik Wedison.
- [SuperCharge](${id("/super-charge/")}): Jaringan pengisian cepat Wedison.
- [Showroom](${id("/showroom/")}): Showroom resmi, service center, dan booking test ride.
- [FAQ](${id("/faq/")}): Informasi baterai, pengisian daya, garansi, servis, keselamatan, dan kepemilikan.
- [Tentang Wedison](${id("/corporate/about/")}): Informasi perusahaan dan brand.
- [Hubungi Kami](${id("/corporate/contact/")}): Kontak resmi Wedison.

## Electric Motorcycles

- [Wedison Bees](${en("/products/bees/")}): Compact and agile electric motorcycle for urban mobility. 1.2 kW motor, 60 km/h top speed, and up to 80 km claimed range. 1.6 kWh LFP battery, 78.5 kg, home charging in about 4.1 hours. Not SuperCharge compatible.

- [Wedison Athena](${en("/products/athena/")}): Retro-style electric motorcycle focused on comfort and urban riding. 2.5 kW motor, 85 km/h top speed, and up to 120 km claimed range with the Extended Battery. 2.5 kWh (Regular) or 3.4 kWh (Extended) LFP battery. SuperCharge compatible.

- [Wedison Victory](${en("/products/victory/")}): Sporty and versatile electric motorcycle for everyday urban riding. 3 kW motor, 85 km/h top speed, and up to 120 km claimed range with the Extended Battery. LFP battery. SuperCharge compatible.

- [Wedison EdPower](${en("/products/edpower/")}): Premium long-range electric motorcycle for longer journeys. 3 kW motor, 90 km/h top speed, and up to 200 km claimed range. 5 kWh LFP battery, suited to touring and fleet use. SuperCharge compatible.

### Indonesian product pages

- [Wedison Bees](${id("/products/bees/")}): Motor listrik kompak untuk mobilitas sehari-hari.
- [Wedison Athena](${id("/products/athena/")}): Motor listrik bergaya retro dengan fokus pada kenyamanan.
- [Wedison Victory](${id("/products/victory/")}): Motor listrik sporty untuk penggunaan sehari-hari.
- [Wedison EdPower](${id("/products/edpower/")}): Motor listrik premium dengan jarak tempuh hingga 200 km.

## SuperCharge

### English

- [SuperCharge](${en("/super-charge/")}): Wedison's fast-charging network.
- Compatible models: Athena, Victory, and EdPower.
- Charging from 10% to 80% takes approximately 15 minutes.
- SuperCharge stations are available through Wedison showrooms and partner locations.
- [SuperCharge station map](${en("/super-charge/locations/")}): Current list and map of SuperCharge stations.
- Charging sessions are started and tracked from the Wedison app.

### Bahasa Indonesia

- [SuperCharge](${id("/super-charge/")}): Jaringan pengisian cepat Wedison.
- Model yang kompatibel: Athena, Victory, dan EdPower.
- Pengisian daya dari 10% hingga 80% membutuhkan sekitar 15 menit.
- Stasiun SuperCharge tersedia di showroom Wedison dan lokasi mitra.
- [Peta stasiun SuperCharge](${id("/super-charge/locations/")}): Daftar dan peta lokasi stasiun SuperCharge terkini.
- Sesi pengisian dimulai dan dipantau dari aplikasi Wedison.

## Showrooms

Official Wedison showrooms and service centers (sales, test rides, servicing). Opening hours: Monday–Friday 10:00–19:00, Saturday–Sunday 10:00–17:00 (local time).

${showrooms}

- [Showrooms & test ride booking (English)](${en("/showroom/")})
- [Showroom & booking test ride (Bahasa Indonesia)](${id("/showroom/")})

## Battery & Ownership

- [FAQ English](${en("/faq/")}): Official information about battery, charging, warranty, maintenance, safety, and ownership.
- [FAQ Indonesia](${id("/faq/")}): Informasi resmi tentang baterai, pengisian daya, garansi, perawatan, keselamatan, dan kepemilikan.
- Wedison supports both SuperCharge and home charging depending on the motorcycle model.
- Standard warranty (regular purchase): battery 3 years, motorcycle 2 years, covering manufacturing defects.
- Home charging uses a standard household power outlet.
- User manuals (PDF) for each model are available on the [FAQ page](${en("/faq/")}#user-manual).
- Current battery and warranty terms should always be confirmed from the latest official Wedison information.

## BaaS

- Battery as a Service (BaaS) separates the battery from the motorcycle purchase to reduce the upfront ownership cost.
- Core BaaS proposition: the battery is no longer the rider's problem.
- Lifetime battery warranty is the primary BaaS benefit. It applies only to BaaS; regular purchases carry the standard 3-year battery warranty.
- Current BaaS campaign models: Victory, Athena, and EdPower.
- BaaS pricing, subscription terms, eligibility, availability, and promotional limits should be confirmed from the latest official Wedison commercial information.

## Wedison Ojol

- [Wedison Ojol (English)](${en("/ojol/")}): Electric motorcycle program for online ride-hailing (ojol) drivers, with daily rental and rent-to-own schemes starting from Rp50,000 per day.
- [Wedison Ojol (Bahasa Indonesia)](${id("/ojol/")}): Program motor listrik untuk driver ojek online, skema sewa harian dan sewa milik mulai Rp50.000 per hari.

## Company

### English

- [About Wedison](${en("/corporate/about/")}): Wedison company, technology, mission, and electric mobility ecosystem.
- [Contact](${en("/corporate/contact/")}): Official Wedison contact information.
- [Media Center](${en("/media-center/")}): News, articles, and press coverage.
- [Careers](${en("/career/")}): Open positions at Wedison.

### Bahasa Indonesia

- [Tentang Wedison](${id("/corporate/about/")}): Profil, visi, misi, teknologi, dan ekosistem mobilitas listrik Wedison.
- [Hubungi Kami](${id("/corporate/contact/")}): Informasi kontak resmi Wedison.
- [Media Center](${id("/media-center/")}): Berita, artikel, dan liputan media.
- [Karier](${id("/career/")}): Lowongan kerja di Wedison.

### Contact

- Email: ${CONTACT.email}
- WhatsApp: +${CONTACT.whatsapp}

## Related Brand

- [Werigo](https://werigo.co/): Wedison-connected electric motorcycle rental and mobility service in Bali.
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
