// Pesan WhatsApp prefilled + URL wa.me, memakai nomor cabang dari registry showroom.
import { SHOWROOMS, type ShowroomId } from "./showrooms";
import { displayPhone, type BookingPurpose } from "./schema";
import { formatLongDate } from "./slots";

export type WhatsappBookingInput = {
  showroom: ShowroomId;
  purpose: BookingPurpose;
  purposeLabel: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  note?: string;
  locale: "id" | "en";
};

export function buildWhatsappMessage(b: WhatsappBookingInput): string {
  const s = SHOWROOMS[b.showroom];
  const when = `${formatLongDate(b.date, b.locale)}, ${b.time} ${s.tzLabel}`;
  const phone = displayPhone(b.phone);

  if (b.locale === "en") {
    const lines = [
      `Hello ${s.name} 👋`,
      `I'd like to book a *${b.purposeLabel}* at your showroom.`,
      "",
      `Name: ${b.name}`,
      `Phone: ${phone}`,
      ...(b.email ? [`Email: ${b.email}`] : []),
      `Schedule: ${when}`,
      ...(b.note ? [`Note: ${b.note}`] : []),
      "",
      "Please confirm my appointment. Thank you 🙏",
      "_Sent from the booking form at wedison.co_",
    ];
    return lines.join("\n");
  }

  const lines = [
    `Halo ${s.name} 👋`,
    `Saya ingin booking *${b.purposeLabel}* di showroom.`,
    "",
    `Nama: ${b.name}`,
    `No. HP: ${phone}`,
    ...(b.email ? [`Email: ${b.email}`] : []),
    `Jadwal: ${when}`,
    ...(b.note ? [`Catatan: ${b.note}`] : []),
    "",
    "Mohon konfirmasi jadwalnya ya. Terima kasih 🙏",
    "_Dikirim dari form booking wedison.co_",
  ];
  return lines.join("\n");
}

export function buildWhatsappUrl(b: WhatsappBookingInput): string {
  const number = SHOWROOMS[b.showroom].whatsapp;
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsappMessage(b))}`;
}
