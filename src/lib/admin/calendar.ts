// Google Calendar "Booking Showroom" yang di-embed di /admin/leads/calendar.
// ID kalender bukan secret (ada di URL embed), tapi bisa di-override lewat env publik.
export const BOOKING_CALENDAR_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_ID ||
  "2f99738ca12b04fca39d28b3852325e34ad63ecc8b28f0ad697c6ec0b40bc4b0@group.calendar.google.com";

export type CalendarMode = "MONTH" | "WEEK" | "AGENDA";

/** URL embed resmi Google dengan chrome seminimal mungkin (judul/tab/print disembunyikan). */
export function calendarEmbedUrl(opts: { mode: CalendarMode; timeZone: string; bgcolor?: string }) {
  const p = new URLSearchParams({
    src: BOOKING_CALENDAR_ID,
    ctz: opts.timeZone,
    mode: opts.mode,
    bgcolor: opts.bgcolor ?? "#ffffff",
    showTitle: "0",
    showPrint: "0",
    showTabs: "0",
    showCalendars: "0",
    showTz: "0",
    showNav: "1",
    showDate: "1",
    wkst: "2", // minggu mulai Senin
  });
  return `https://calendar.google.com/calendar/embed?${p.toString()}`;
}

/** Buka kalender di Google Calendar (akun yang punya akses). */
export const calendarOpenUrl = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(BOOKING_CALENDAR_ID)}`;
