import { joinCities, listedShowrooms } from "@/lib/seo/showrooms";
import { dayName, dotTime, hoursRows, type PublicShowroom } from "@/lib/showrooms/showroom";

/**
 * Jumlah pertanyaan FAQ showroom (kunci kamus showroomPage.faq.q1..qN / a1..aN). Modul
 * biasa (bukan "use client") supaya bisa dibaca page.tsx untuk JSON-LD FAQPage.
 */
export const SHOWROOM_FAQ_COUNT = 6;

type L = "id" | "en";

/**
 * Jawaban yang bergantung pada data showroom (admin › Showrooms) dibuat dari data, bukan kamus,
 * agar tidak basi saat cabang ditambah/diubah: a5 = servis & SuperCharge, a6 = jam buka.
 * null = pakai teks kamus.
 */
export function showroomFaqAnswer(n: number, all: PublicShowroom[], l: L): string | null {
  const listed = listedShowrooms(all);
  if (!listed.length) return null;
  if (n === 5) {
    const workshop = listed.filter((s) => s.hasWorkshop).map((s) => s.city);
    const charge = listed.filter((s) => s.hasSupercharge).map((s) => s.city);
    const noCharge = listed.filter((s) => !s.hasSupercharge).map((s) => s.city);
    const allWorkshop = workshop.length === listed.length;
    if (l === "en") {
      return [
        workshop.length
          ? `Servicing, yes: ${allWorkshop ? "every Wedison showroom is" : `the ${joinCities(workshop, "en")} showroom${workshop.length > 1 ? "s are" : " is"}`} an official Wedison service centre.`
          : "Servicing is handled by official Wedison service centres.",
        charge.length ? `SuperCharge stations are available at the ${joinCities(charge, "en")} showroom${charge.length > 1 ? "s" : ""}.` : "",
        charge.length && noCharge.length ? `The ${joinCities(noCharge, "en")} showroom${noCharge.length > 1 ? "s do" : " does"} not have a SuperCharge station yet.` : "",
      ].filter(Boolean).join(" ");
    }
    return [
      workshop.length
        ? `Bisa untuk servis: ${allWorkshop ? "semua showroom Wedison adalah" : `showroom ${joinCities(workshop, "id")} adalah`} bengkel resmi Wedison.`
        : "Servis dilayani di bengkel resmi Wedison.",
      charge.length ? `Stasiun SuperCharge tersedia di showroom ${joinCities(charge, "id")}.` : "",
      charge.length && noCharge.length ? `Showroom ${joinCities(noCharge, "id")} belum memiliki stasiun SuperCharge.` : "",
    ].filter(Boolean).join(" ");
  }
  if (n === 6) {
    const key = (s: PublicShowroom) => JSON.stringify(s.hours);
    const same = listed.every((s) => key(s) === key(listed[0]));
    if (!same) {
      return l === "en"
        ? "Opening hours differ per showroom and are shown on each location card above, in local time. Special closure dates are shown on the card too."
        : "Jam buka berbeda di tiap showroom dan tercantum di kartu lokasi di atas, mengikuti waktu setempat. Tanggal tutup khusus juga tercantum di kartu.";
    }
    const s = listed[0];
    const rows = hoursRows(s).filter((r) => r.hours);
    const first = (r: (typeof rows)[number]) => dayName(r.days[0], l, true);
    const last = (r: (typeof rows)[number]) => dayName(r.days[r.days.length - 1], l, true);
    const day = (r: (typeof rows)[number]) =>
      r.days.length === 1 ? first(r) : `${first(r)} ${r.days.length === 2 ? (l === "en" ? "and" : "dan") : l === "en" ? "to" : "sampai"} ${last(r)}`;
    // Format jam situs: ID "10.00", EN "10:00".
    const time = (h: { open: string; close: string }) => (l === "en" ? `${h.open}–${h.close}` : `${dotTime(h.open)}–${dotTime(h.close)}`);
    const parts = rows.map((r) => (l === "en" ? `${day(r)} ${time(r.hours!)}` : `${day(r)} pukul ${time(r.hours!)}`));
    if (s.hours.holiday) parts.push(l === "en" ? `public holidays ${time(s.hours.holiday)}` : `hari libur nasional pukul ${time(s.hours.holiday)}`);
    return l === "en"
      ? `${joinCities(parts, "en").replace(/^./, (c) => c.toUpperCase())}, local time.`
      : `${joinCities(parts, "id")}, mengikuti waktu setempat.`;
  }
  return null;
}

/** Deskripsi section lokasi: fasilitas & kota SuperCharge dari data. */
export function locationsDesc(all: PublicShowroom[], l: L): string {
  const listed = listedShowrooms(all);
  const charge = listed.filter((s) => s.hasSupercharge).map((s) => s.city);
  const allWorkshop = listed.length > 0 && listed.every((s) => s.hasWorkshop);
  if (l === "en") {
    return [
      allWorkshop ? "Every location is a showroom and an official service centre." : "Visit a Wedison showroom near you.",
      charge.length ? `SuperCharge stations are available in ${joinCities(charge, "en")}.` : "",
      "Pick a card to see it on the map.",
    ].filter(Boolean).join(" ");
  }
  return [
    allWorkshop ? "Setiap lokasi adalah showroom sekaligus bengkel resmi." : "Kunjungi showroom Wedison terdekat.",
    charge.length ? `Stasiun SuperCharge tersedia di ${joinCities(charge, "id")}.` : "",
    "Pilih kartu untuk melihat lokasinya di peta.",
  ].filter(Boolean).join(" ");
}
