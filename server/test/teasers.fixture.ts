// Payload teaser lengkap (semua teks terisi) untuk tes integrasi.
/** Konten lengkap satu bahasa (semua teks terisi) — `tag` membedakan ID/EN. */
export function content(tag: string) {
  const s = (k: string) => `${tag} ${k}`;
  return {
    seo: { title: s("SEO title"), description: s("SEO description for the teaser page"), keywords: ["wedison", "surabaya"] },
    hero: { eyebrow: s("eyebrow"), title: s("hero title"), desc: s("hero desc"), ctaPrimary: s("ask"), ctaSecondary: s("promo"), imageAlt: s("hero alt") },
    countdown: { label: s("countdown"), days: "D", hours: "H", minutes: "M", seconds: "S", open: s("now open") },
    event: {
      title: s("event"), desc: s("event desc"), dateLabel: "Date", timeLabel: "Time", locationLabel: "Location", entryLabel: "Entry",
      entryValue: "Free", addToCalendar: "Add", directions: "Directions", calendarTitle: s("calendar"), calendarDetails: s("details"), imageAlt: s("facade"),
    },
    experience: { title: s("experience"), desc: s("exp desc"), items: [{ title: s("test ride"), desc: s("free"), linkLabel: "", linkHref: "" }, { title: s("consult"), desc: s("baas"), linkLabel: "BaaS", linkHref: "/baas/" }], imageMainAlt: "a", imageLoungeAlt: "b" },
    promo: { title: s("promo"), desc: s("promo desc"), items: [{ title: s("price"), desc: s("discount") }], terms: s("terms"), cta: s("ask promo"), imageAlt: s("promo alt") },
    models: { title: s("models"), desc: s("models desc"), detail: "Details", taglines: { athena: "A", bees: "B", victory: "V", edpower: "E" } },
    inquiry: { title: s("inquiry"), desc: s("inquiry desc"), directTitle: s("chat"), directDesc: s("chat desc"), whatsappLabel: "WhatsApp", whatsappText: s("hello"), emailLabel: "Email" },
    faq: { title: s("faq"), items: [{ q: s("when?"), a: s("on {date}") }] },
  };
}

export function teaserPayload(slug: string, over: Record<string, unknown> = {}) {
  return {
    slug,
    city: `${slug} Surabaya`,
    showroomName: "Wedison Experience Center Surabaya",
    timeZone: "Asia/Jakarta",
    startDate: "2030-11-28",
    startTime: "10:00",
    endDate: "2030-11-28",
    endTime: "17:00",
    streetAddress: "Jl. Tunjungan No. 1",
    addressLocality: "Surabaya",
    addressRegion: "Jawa Timur",
    postalCode: "60261",
    mapsUrl: "https://maps.app.goo.gl/example",
    whatsapp: "0852-8612-6550",
    email: "Support@Wedison.co",
    models: ["athena", "victory"],
    images: { heroDesktop: "/api/uploads/hero.webp" },
    content: { id: content("ID"), en: content("EN") },
    ...over,
  };
}
