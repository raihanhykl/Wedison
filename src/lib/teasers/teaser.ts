// Tipe + aturan bersama modul Showroom Teaser (halaman publik /[locale]/showroom/[slug] dan
// editor admin /admin/teasers). Mirror skema backend: server/src/modules/teasers/teaser.schema.ts.
//
// Wording boleh memakai token yang diisi otomatis saat tampil:
//   {city} {showroom} {date} {time} {address}
// sehingga mengganti tanggal/alamat tidak perlu menyunting ulang setiap kalimat.

export type TeaserLocale = "id" | "en";
export type TeaserStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export const MODEL_KEYS = ["athena", "bees", "victory", "edpower"] as const;
export type ModelKey = (typeof MODEL_KEYS)[number];

export const MODEL_CATALOG: Record<ModelKey, { name: string; href: string; image: string }> = {
  athena: { name: "Athena", href: "/products/athena/", image: "/navbar-product/athena.webp" },
  bees: { name: "Bees", href: "/products/bees/", image: "/navbar-product/bees.webp" },
  victory: { name: "Victory", href: "/products/victory/", image: "/navbar-product/victory.webp" },
  edpower: { name: "EdPower", href: "/products/edpower/", image: "/navbar-product/edpower.webp" },
};

export const TIME_ZONES = [
  { value: "Asia/Jakarta", label: "WIB", name: "WIB · Jakarta, Surabaya, Bandung, Medan" },
  { value: "Asia/Makassar", label: "WITA", name: "WITA · Bali, Makassar, Balikpapan" },
  { value: "Asia/Jayapura", label: "WIT", name: "WIT · Jayapura, Ambon" },
] as const;
export type TeaserTimeZone = (typeof TIME_ZONES)[number]["value"];
export const tzLabel = (tz: string) => TIME_ZONES.find((z) => z.value === tz)?.label ?? "WIB";

export const IMAGE_SLOTS = ["heroDesktop", "heroMobile", "event", "experienceMain", "experienceLounge", "promo", "og"] as const;
export type ImageSlot = (typeof IMAGE_SLOTS)[number];
export type TeaserImages = Partial<Record<ImageSlot, string | null>>;

/** Spesifikasi tiap slot gambar: dipakai editor (panduan + cek rasio) dan halaman (default). */
export const IMAGE_SLOT_SPEC: Record<ImageSlot, { label: string; where: string; ratio: number; ratioLabel: string; size: string; fallback: string; hint: string }> = {
  heroDesktop: {
    label: "Hero · desktop",
    where: "Full-screen background at the top of the page (tablet & desktop).",
    ratio: 16 / 9, ratioLabel: "16:9", size: "2400 × 1350 px",
    fallback: "/new-looks/HERO 1.webp",
    hint: "Keep the left 55% and bottom 45% dark and calm: the headline sits there in white.",
  },
  heroMobile: {
    label: "Hero · mobile",
    where: "Hero background on phones. Empty = the desktop image is used.",
    ratio: 4 / 5, ratioLabel: "4:5", size: "1080 × 1350 px",
    fallback: "",
    hint: "Subject in the top 45%; keep the bottom 55% dark for the text.",
  },
  event: {
    label: "Event details",
    where: "Next to the date, time and address (“Save the date”).",
    ratio: 4 / 3, ratioLabel: "4:3", size: "1600 × 1200 px",
    fallback: "/ShowRoom-Receptionist.webp",
    hint: "Ideally the front of the new showroom. No text on the image.",
  },
  experienceMain: {
    label: "Showroom interior",
    where: "Tall image beside the “what you can do” list.",
    ratio: 4 / 5, ratioLabel: "4:5", size: "1080 × 1350 px",
    fallback: "/advantages/Showroom Skuter Listrik WEDISON.webp",
    hint: "Interior with the line-up of motorcycles.",
  },
  experienceLounge: {
    label: "Lounge / secondary",
    where: "Wide image under the “what you can do” list.",
    ratio: 3 / 2, ratioLabel: "3:2", size: "1500 × 1000 px",
    fallback: "/showroom-waitingroom.webp",
    hint: "Waiting area, service bay or customers at the showroom.",
  },
  promo: {
    label: "Promotion visual",
    where: "Beside the promotion list on the dark green section.",
    ratio: 4 / 5, ratioLabel: "4:5", size: "1080 × 1350 px",
    fallback: "/athena/athena-landing-card-mobile.webp",
    hint: "No prices or text on the image: promotion details are written in the page text.",
  },
  og: {
    label: "Share image (Open Graph)",
    where: "Preview when the link is shared on WhatsApp, Facebook, LinkedIn or X.",
    ratio: 1200 / 630, ratioLabel: "1.91:1", size: "1200 × 630 px",
    fallback: "/og/showroom.jpg",
    hint: "May include the title, date and logo. Keep text inside the centre 1080 × 566 px.",
  },
};

/** Gambar efektif: slot kosong -> default (hero mobile kosong -> hero desktop). */
export function resolveImages(images: TeaserImages | null | undefined): Record<ImageSlot, string> {
  const i = images ?? {};
  const pick = (k: ImageSlot) => i[k] || IMAGE_SLOT_SPEC[k].fallback;
  const heroDesktop = pick("heroDesktop");
  return {
    heroDesktop,
    heroMobile: i.heroMobile || heroDesktop,
    event: pick("event"),
    experienceMain: pick("experienceMain"),
    experienceLounge: pick("experienceLounge"),
    promo: pick("promo"),
    og: pick("og"),
  };
}

export type TeaserContent = {
  seo: { title: string; description: string; keywords: string[] };
  hero: { eyebrow: string; title: string; desc: string; ctaPrimary: string; ctaSecondary: string; imageAlt: string };
  countdown: { label: string; days: string; hours: string; minutes: string; seconds: string; open: string };
  event: {
    title: string; desc: string; dateLabel: string; timeLabel: string; locationLabel: string; entryLabel: string; entryValue: string;
    addToCalendar: string; directions: string; calendarTitle: string; calendarDetails: string; imageAlt: string;
  };
  experience: { title: string; desc: string; items: { title: string; desc: string; linkLabel: string; linkHref: string }[]; imageMainAlt: string; imageLoungeAlt: string };
  promo: { title: string; desc: string; items: { title: string; desc: string }[]; terms: string; cta: string; imageAlt: string };
  models: { title: string; desc: string; detail: string; taglines: Record<ModelKey, string> };
  inquiry: { title: string; desc: string; directTitle: string; directDesc: string; whatsappLabel: string; whatsappText: string; emailLabel: string };
  faq: { title: string; items: { q: string; a: string }[] };
};

export type TeaserAddress = { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string };

/** Data teaser seperti dikirim API publik (dan preview admin). */
export type PublicTeaser = {
  status: TeaserStatus;
  slug: string;
  city: string;
  showroomName: string;
  noIndex: boolean;
  timeZone: string;
  startAt: string;
  endAt: string;
  showCountdown: boolean;
  address: TeaserAddress;
  mapsUrl: string | null;
  whatsapp: string;
  email: string;
  models: ModelKey[];
  images: TeaserImages;
  content: Record<TeaserLocale, TeaserContent>;
  /** slug sumber pesan untuk Leads > Contact Messages */
  source: string;
  updatedAt: string;
};

// ─── Jadwal & token ─────────────────────────────────────────────────────────

export type TeaserFacts = { city: string; showroom: string; date: string; time: string; address: string };

export function addressLine(a: TeaserAddress) {
  return [a.streetAddress, a.addressLocality, a.addressRegion, a.postalCode].filter(Boolean).join(", ");
}

/** Tanggal & jam acara dalam bahasa halaman, di zona waktu showroom (bukan zona pengunjung). */
export function teaserFacts(
  t: Pick<PublicTeaser, "city" | "showroomName" | "timeZone" | "startAt" | "endAt" | "address">,
  locale: TeaserLocale,
): TeaserFacts {
  const tag = locale === "en" ? "en-GB" : "id-ID";
  const tz = t.timeZone;
  const start = new Date(t.startAt);
  const end = new Date(t.endAt);
  const longDate = (d: Date) => new Intl.DateTimeFormat(tag, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: tz }).format(d);
  const shortDate = (d: Date) => new Intl.DateTimeFormat(tag, { day: "numeric", month: "short", timeZone: tz }).format(d);
  const hm = (d: Date) => new Intl.DateTimeFormat(tag, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(d).replace(":", ".");
  const sameDay = longDate(start) === longDate(end);
  return {
    city: t.city,
    showroom: t.showroomName,
    date: sameDay ? longDate(start) : `${longDate(start)} – ${longDate(end)}`,
    time: sameDay ? `${hm(start)}–${hm(end)} ${tzLabel(tz)}` : `${shortDate(start)} ${hm(start)} – ${shortDate(end)} ${hm(end)} ${tzLabel(tz)}`,
    address: addressLine(t.address),
  };
}

export const TOKENS: { token: string; desc: string }[] = [
  { token: "{city}", desc: "City name" },
  { token: "{showroom}", desc: "Showroom name" },
  { token: "{date}", desc: "Opening date, e.g. Sabtu, 28 November 2026" },
  { token: "{time}", desc: "Opening hours, e.g. 10.00–17.00 WIB" },
  { token: "{address}", desc: "Full address on one line" },
];

export function fillTokens(text: string, f: TeaserFacts) {
  return text
    .replaceAll("{city}", f.city)
    .replaceAll("{showroom}", f.showroom)
    .replaceAll("{date}", f.date)
    .replaceAll("{time}", f.time)
    .replaceAll("{address}", f.address);
}

/** Isi token di seluruh konten (rekursif, hanya string). */
export function fillContent<T>(value: T, f: TeaserFacts): T {
  if (typeof value === "string") return fillTokens(value, f) as T;
  if (Array.isArray(value)) return value.map((v) => fillContent(v, f)) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillContent(v, f)])) as T;
  return value;
}

/** Ambil konten satu bahasa yang sudah diisi tokennya. */
export function teaserCopy(t: PublicTeaser, locale: TeaserLocale) {
  return fillContent(t.content[locale], teaserFacts(t, locale));
}

/** Tautan template Google Calendar (tanpa API). */
export function googleCalendarUrl(t: Pick<PublicTeaser, "startAt" | "endAt" | "timeZone" | "address">, title: string, details: string) {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(t.startAt)}/${fmt(t.endAt)}`,
    location: addressLine(t.address),
    details,
    ctz: t.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Href untuk tautan item: path internal diberi prefix locale, URL luar dibiarkan. */
export function localizeHref(href: string, locale: TeaserLocale) {
  if (!href) return "";
  if (href.startsWith("/")) return `/${locale}${href.endsWith("/") || /[?#]/.test(href) ? href : `${href}/`}`;
  return href;
}

/** Slug sumber -> id teaser. */
export const TEASER_SOURCE_PREFIX = "teaser-";
