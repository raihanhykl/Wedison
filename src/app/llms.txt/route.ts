import { CONTACT, SITE_URL } from "@/lib/seo/site";
import { PUBLISHED_SHOWROOM_LOCATIONS, showroomFullAddress } from "@/lib/seo/showrooms";
import { getPricing } from "@/lib/cms/api";
import type { PublicPricing } from "@/lib/pricing/types";
import { PRODUCT_IDS, PRODUCT_NAMES, entriesFor, pick, schemesFor, sortedRegions, superchargeTariff, variantLabel } from "@/lib/pricing/select";

// /llms.txt — ringkasan situs untuk asisten AI / mesin jawaban (GEO/AEO, spesifikasi
// llmstxt.org). Disajikan di root seperti robots.txt & sitemap.xml. Next tidak punya konvensi
// metadata untuk llms.txt (tidak ada "llms.ts"), jadi dibuat sebagai route handler statis.
// Semua link memakai URL kanonik ber-locale (/id/, /en/) dari SITE_URL agar tidak melewati
// redirect dan otomatis mengikuti domain per environment. Fakta di sini harus sama dengan
// kamus spesifikasi & halaman terkait.
export const dynamic = "force-static";
export const revalidate = 86400;

/** Baris harga resmi per wilayah × skema × model untuk AI crawler (angka dari modul Pricing). */
function pricingSummary(p: PublicPricing): string {
  const idr = (n: number) => `Rp ${new Intl.NumberFormat("en-US").format(n)}`;
  const lines: string[] = [];
  for (const region of sortedRegions(p)) {
    const label = pick(region.priceLabel, "en") || `${pick(region.name, "en")} pricing`;
    for (const model of PRODUCT_IDS) {
      for (const scheme of schemesFor(p, region.slug, model)) {
        for (const e of entriesFor(p, region.slug, scheme.slug, model)) {
          const v = e.variant === "single" ? "" : ` (${variantLabel(e.variant, "en")})`;
          let price = "";
          if (scheme.kind === "purchase" && e.netPrice != null) price = `${idr(e.netPrice)} net on-the-road${e.otrPrice != null && e.otrPrice !== e.netPrice ? ` (list ${idr(e.otrPrice)})` : ""}`;
          else if ((scheme.kind === "rent_to_own" || scheme.kind === "rental") && e.dailyFee != null) price = `${idr(e.dailyFee)} per day${e.downPayment != null ? `, down payment ${idr(e.downPayment)}` : ""}${e.termMonths != null ? `, ${e.termMonths}-month contract` : ""}`;
          else if (scheme.kind === "b2b_credit" && e.installment36 != null) price = `${e.installment24 != null ? `${idr(e.installment24)}/month over 24 months, ` : ""}${idr(e.installment36)}/month over 36 months`;
          else if (scheme.kind === "baas" && e.unitPrice != null) price = `unit ${idr(e.unitPrice)} without battery + battery subscription ${e.monthlyFee != null ? idr(e.monthlyFee) : "-"}/month`;
          const where = scheme.kind === "purchase" ? label : pick(region.name, "en");
          if (price) lines.push(`- ${PRODUCT_NAMES[model]}${v}, ${pick(scheme.name, "en")}, ${where}: ${price}.`);
        }
      }
    }
  }
  const tariff = PRODUCT_IDS.map((m) => [m, superchargeTariff(p, m)] as const).filter(([, t]) => t != null);
  if (tariff.length) lines.push(`- SuperCharge tariff ${p.settings.supercharge.unitEn}: ${tariff.map(([m, t]) => `${PRODUCT_NAMES[m]} ${idr(t!)}`).join(", ")}. Bees does not support SuperCharge.`);
  if (p.settings.referral.enabled) lines.push(`- Referral programme: ${idr(p.settings.referral.amount)} per qualified referral (${p.settings.referral.regionSlugs.join(", ")} only).`);
  lines.push(`- ${p.settings.disclaimerEn} Full details per region and scheme are shown on each product page (section "Harga").`);
  return lines.join("\n");
}

function build(pricingLines: string): string {
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
- Standard warranty: battery, motor, and frame 3 years or 100,000 km (whichever comes first), counted from unit handover; other components 1 to 2 years per the official list. Covers manufacturing defects.
- Lifetime battery warranty applies only to motorcycles under Battery as a Service (BaaS).
- Batteries use LFP (lithium iron phosphate) cells and are rated IP67.
- Official showrooms and service centers: Jakarta, Bekasi, Bandung Barat, and Bali. SuperCharge stations are at the Jakarta, Bandung Barat, and Bekasi showrooms (not yet in Bali).
- Wedison motorcycles are sold through official Wedison showrooms.
- Official contact: ${CONTACT.email}, WhatsApp +${CONTACT.whatsapp}.
- Official Wedison information should be used for current specifications, pricing, warranty, availability, and commercial programs.

## Start here

### English

- [Homepage](${en()}): Official Wedison website.
- [Electric Motorcycles](${en("/products/")}): Official Wedison motorcycle lineup.
- [Compare Models](${en("/compare/")}): Compare specifications across Wedison motorcycles.
- [SuperCharge](${en("/super-charge/")}): Official Wedison fast-charging network.
- [Battery as a Service](${en("/baas/")}): Buy the bike, subscribe to the battery, lifetime battery warranty.
- [Showrooms](${en("/showroom/")}): Official showrooms, service centers, and test ride booking.
- [FAQ](${en("/faq/")}): Battery, charging, warranty, servicing, safety, and ownership information.
- [About Wedison](${en("/corporate/about/")}): Company and brand information.
- [Contact](${en("/corporate/contact/")}): Official customer and business contact.

### Bahasa Indonesia

- [Beranda](${id()}): Situs resmi Wedison dalam Bahasa Indonesia.
- [Motor Listrik](${id("/products/")}): Jajaran motor listrik Wedison.
- [Bandingkan Model](${id("/compare/")}): Perbandingan spesifikasi motor listrik Wedison.
- [SuperCharge](${id("/super-charge/")}): Jaringan pengisian cepat Wedison.
- [Battery as a Service](${id("/baas/")}): Beli motornya, langganan baterainya, garansi baterai seumur hidup.
- [Showroom](${id("/showroom/")}): Showroom resmi, service center, dan booking test ride.
- [FAQ](${id("/faq/")}): Informasi baterai, pengisian daya, garansi, servis, keselamatan, dan kepemilikan.
- [Tentang Wedison](${id("/corporate/about/")}): Informasi perusahaan dan brand.
- [Hubungi Kami](${id("/corporate/contact/")}): Kontak resmi Wedison.

## Electric Motorcycles

- [Wedison Bees](${en("/products/bees/")}): Compact and agile electric motorcycle for urban mobility. 1.2 kW motor, 55 km/h top speed, and up to 90 km claimed range. 1.6 kWh LFP battery, 78.5 kg, home charging in 4 to 6 hours. Not SuperCharge compatible.

- [Wedison Athena](${en("/products/athena/")}): Retro-style electric motorcycle focused on comfort and urban riding. 2.5 kW motor, 75 km/h top speed, and up to 120 km claimed range with the Extended Battery. 2.5 kWh (Regular) or 3.4 kWh (Extended) LFP battery, home charging in 4 to 6 hours. SuperCharge compatible.

- [Wedison Victory](${en("/products/victory/")}): Sporty and versatile electric motorcycle for everyday urban riding. 3 kW motor, 80 km/h top speed, and up to 120 km claimed range with the Extended Battery. 2.5 kWh (Regular) or 3.4 kWh (Extended) LFP battery, home charging in 4 to 6 hours. SuperCharge compatible.

- [Wedison EdPower](${en("/products/edpower/")}): Premium long-range electric motorcycle for longer journeys. 3 kW motor, 85 km/h top speed, and up to 200 km claimed range. 5 kWh LFP battery, home charging in 8 to 10 hours, suited to touring and fleet use. SuperCharge compatible.

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
- SuperCharge stations are available at the Jakarta, Bandung Barat, and Bekasi showrooms and at partner locations.
- [SuperCharge station map](${en("/super-charge/locations/")}): Current list and map of SuperCharge stations.
- Charging sessions are started and tracked from the Wedison app.

### Bahasa Indonesia

- [SuperCharge](${id("/super-charge/")}): Jaringan pengisian cepat Wedison.
- Model yang kompatibel: Athena, Victory, dan EdPower.
- Pengisian daya dari 10% hingga 80% membutuhkan sekitar 15 menit.
- Stasiun SuperCharge tersedia di showroom Jakarta, Bandung Barat, dan Bekasi serta lokasi mitra.
- [Peta stasiun SuperCharge](${id("/super-charge/locations/")}): Daftar dan peta lokasi stasiun SuperCharge terkini.
- Sesi pengisian dimulai dan dipantau dari aplikasi Wedison.

## Showrooms

Official Wedison showrooms and service centers (sales, test rides, servicing). Opening hours: Monday–Friday 10:00–19:00, Saturday–Sunday 10:00–17:00, public holidays 10:00–16:00 (local time).

${showrooms}

- [Showrooms & test ride booking (English)](${en("/showroom/")})
- [Showroom & booking test ride (Bahasa Indonesia)](${id("/showroom/")})

## Battery & Ownership

- [FAQ English](${en("/faq/")}): Official information about battery, charging, warranty, maintenance, safety, and ownership.
- [FAQ Indonesia](${id("/faq/")}): Informasi resmi tentang baterai, pengisian daya, garansi, perawatan, keselamatan, dan kepemilikan.
- Wedison supports both SuperCharge and home charging depending on the motorcycle model.
- Standard warranty (regular purchase): battery, motor, and frame 3 years or 100,000 km, whichever comes first; handlebar and stands 2 years or 20,000 km; electrical components 1 year or 10,000 km. Covers manufacturing defects.
- Home charging uses a standard household power outlet.
- User manuals (PDF) for each model are available on the [FAQ page](${en("/faq/")}#user-manual).
- Current battery and warranty terms should always be confirmed from the latest official Wedison information.

## Pricing (official, from the Wedison pricing module)

${pricingLines}

## BaaS

- [Battery as a Service (English)](${en("/baas/")}): Buy the bike, subscribe to the battery. Prices, plans, inclusions and FAQ.
- [Battery as a Service (Bahasa Indonesia)](${id("/baas/")}): Beli motornya, langganan baterainya. Harga, paket, yang termasuk, dan tanya jawab.
- Battery as a Service (BaaS) separates the battery from the motorcycle purchase to reduce the upfront ownership cost.
- Core BaaS proposition: the battery is no longer the rider's problem.
- Lifetime battery warranty is the primary BaaS benefit. It applies only to BaaS; regular purchases carry the standard 3-year or 100,000 km battery warranty.
- Current BaaS campaign models: Victory, Athena, and EdPower.
- BaaS pricing, subscription terms, eligibility, availability, and promotional limits should be confirmed from the latest official Wedison commercial information.

## Wedison Ojol

- [Wedison Ojol (English)](${en("/ojol/")}): Electric motorcycle program for online ride-hailing (ojol) drivers, with a Rent To Own scheme (ojol drivers only, from Rp35,000 per day) and a daily rental scheme (from Rp50,000 per day) in Jabodetabek; Rent To Own is also available in Bali.
- [Wedison Ojol (Bahasa Indonesia)](${id("/ojol/")}): Program motor listrik untuk driver ojek online, skema Rent To Own (khusus driver ojol, mulai Rp35.000 per hari) dan sewa harian (mulai Rp50.000 per hari) di Jabodetabek; Rent To Own juga tersedia di Bali.

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

export async function GET() {
  const pricing = await getPricing();
  return new Response(build(pricingSummary(pricing)), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
