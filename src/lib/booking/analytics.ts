// Event dataLayer untuk GTM. Semua event booking memakai prefix "booking_" supaya
// gampang dibuat trigger "Custom Event" di container GTM.
//
//   booking_open     -> modal dibuka  { booking_source, booking_purpose?, booking_showroom? }
//   booking_success  -> submit sukses { booking_purpose, booking_showroom, booking_date, booking_source }
//   booking_error    -> submit gagal  { booking_reason }
//
// booking_success sekaligus dipakai sebagai "halaman terima kasih" virtual (page_path)
// agar bisa dijadikan konversi Google Ads / Meta lewat GTM tanpa halaman terpisah.

type DataLayerEvent = Record<string, string | number | boolean | undefined> & {
  event: string;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function pushDataLayer(payload: DataLayerEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

export function trackBookingOpen(p: {
  source: string;
  purpose?: string;
  showroom?: string;
  locale: string;
}) {
  pushDataLayer({
    event: "booking_open",
    booking_source: p.source,
    booking_purpose: p.purpose,
    booking_showroom: p.showroom,
    booking_locale: p.locale,
  });
}

export function trackBookingSuccess(p: {
  source: string;
  purpose: string;
  showroom: string;
  date: string;
  locale: string;
  calendar: string;
}) {
  pushDataLayer({
    event: "booking_success",
    booking_source: p.source,
    booking_purpose: p.purpose,
    booking_showroom: p.showroom,
    booking_date: p.date,
    booking_locale: p.locale,
    booking_calendar: p.calendar,
    page_path: `/${p.locale}/booking/thank-you/`,
    page_title: "Booking Thank You",
  });
}

export function trackBookingError(reason: string) {
  pushDataLayer({ event: "booking_error", booking_reason: reason });
}
