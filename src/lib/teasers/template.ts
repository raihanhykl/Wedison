// Template wording untuk teaser baru (dipakai editor admin saat "New teaser" dan "Reset section").
// Kalimat ditulis generik dengan token ({city}, {date}, …) sehingga untuk kota baru cukup
// mengisi fakta acara. Teks dalam "[ … ]" adalah contoh yang WAJIB diganti; server menolak
// publish selama masih ada penanda itu.

import type { TeaserContent, TeaserLocale } from "./teaser";

export const TEASER_TEMPLATE: Record<TeaserLocale, TeaserContent> = {
  id: {
    seo: {
      title: "Showroom Motor Listrik Wedison {city} – Grand Opening",
      description: "Experience Center Wedison segera dibuka di {city}. Catat tanggal pembukaan, nikmati promo khusus, coba test ride gratis, dan tanya langsung ke tim kami.",
      keywords: ["wedison {city}", "showroom motor listrik {city}", "dealer motor listrik {city}", "grand opening wedison", "promo motor listrik {city}"],
    },
    hero: {
      eyebrow: "Grand Opening · {city}",
      title: "Experience Center Wedison segera hadir di {city}.",
      desc: "Lihat, coba, dan miliki motor listrik Wedison tanpa perlu ke luar kota. Datang di hari pembukaan dan nikmati promo khusus untuk warga {city}.",
      ctaPrimary: "Tanya Tim Kami",
      ctaSecondary: "Lihat Promo",
      imageAlt: "Motor listrik Wedison di {city}",
    },
    countdown: {
      label: "Hitung mundur menuju pembukaan",
      days: "Hari",
      hours: "Jam",
      minutes: "Menit",
      seconds: "Detik",
      open: "Experience Center {city} sudah dibuka. Sampai jumpa di showroom!",
    },
    event: {
      title: "Catat tanggalnya.",
      desc: "Acara pembukaan terbuka untuk umum. Ajak keluarga atau teman yang juga penasaran dengan motor listrik.",
      dateLabel: "Tanggal",
      timeLabel: "Waktu",
      locationLabel: "Lokasi",
      entryLabel: "Tiket masuk",
      entryValue: "Gratis, terbuka untuk umum",
      addToCalendar: "Simpan ke Kalender",
      directions: "Petunjuk Arah",
      calendarTitle: "Grand Opening {showroom}",
      calendarDetails: "Pembukaan showroom motor listrik Wedison di {city}.",
      imageAlt: "Tampak depan {showroom}",
    },
    experience: {
      title: "Satu tempat untuk mengenal Wedison.",
      desc: "Experience Center {city} dirancang seperti showroom kami di kota lain: tenang, lapang, dan tanpa tekanan untuk membeli.",
      items: [
        { title: "Test ride gratis", desc: "Coba setiap model di sekitar showroom bersama tim kami. Tidak perlu membawa KTP atau SIM.", linkLabel: "", linkHref: "" },
        { title: "Semua model dalam satu ruangan", desc: "Athena, Bees, Victory, dan EdPower bisa Anda lihat, sentuh, dan bandingkan langsung.", linkLabel: "", linkHref: "" },
        { title: "Konsultasi pembelian", desc: "Bandingkan pembelian tunai, kredit, atau Battery as a Service: beli motornya, langganan baterainya.", linkLabel: "Pelajari Battery as a Service", linkHref: "/baas/" },
        { title: "Servis resmi", desc: "Showroom sekaligus bengkel resmi Wedison untuk servis berkala dan suku cadang asli.", linkLabel: "", linkHref: "" },
      ],
      imageMainAlt: "Interior showroom Wedison dengan jajaran motor listrik",
      imageLoungeAlt: "Area tunggu showroom Wedison yang terang dan nyaman",
    },
    promo: {
      title: "Promo khusus pembukaan.",
      desc: "Berlaku selama periode pembukaan di Experience Center {city}, selama kuota masih tersedia.",
      items: [
        { title: "Harga spesial pembukaan", desc: "Potongan [Rp X.XXX.XXX] untuk pembelian unit Wedison selama [periode promo]." },
        { title: "Hadiah untuk [N] pembeli pertama", desc: "[Nama merchandise atau aksesori] eksklusif untuk [N] pembeli pertama di hari pembukaan." },
        { title: "Test ride berhadiah", desc: "Coba motornya di hari pembukaan dan dapatkan [souvenir] dari Wedison." },
      ],
      terms: "Syarat dan ketentuan berlaku. Detail promo dapat berubah; tanyakan ketersediaannya kepada tim kami.",
      cta: "Tanyakan Promo",
      imageAlt: "Visual promo pembukaan Wedison {city}",
    },
    models: {
      title: "Model yang bisa Anda coba.",
      desc: "Empat karakter untuk kebutuhan yang berbeda, dari harian di dalam kota sampai perjalanan jauh.",
      detail: "Lihat detail",
      taglines: { athena: "Klasik dan nyaman", bees: "Ringkas dan lincah", victory: "Sporty dan bertenaga", edpower: "Tangguh untuk jarak jauh" },
    },
    inquiry: {
      title: "Ada yang ingin ditanyakan?",
      desc: "Tanyakan promo, jadwal pembukaan, atau model yang cocok untuk Anda. Tim kami akan menghubungi Anda melalui email atau WhatsApp.",
      directTitle: "Lebih suka chat langsung?",
      directDesc: "Tim kami juga siap menjawab lewat WhatsApp pada jam kerja.",
      whatsappLabel: "Chat WhatsApp",
      whatsappText: "Halo Wedison, saya ingin bertanya tentang pembukaan showroom {city}.",
      emailLabel: "Email",
    },
    faq: {
      title: "Pertanyaan seputar pembukaan",
      items: [
        { q: "Kapan Experience Center Wedison {city} dibuka?", a: "Pembukaan dijadwalkan pada {date}, pukul {time}, di {address}." },
        { q: "Apakah acara pembukaan dipungut biaya?", a: "Tidak. Acara pembukaan terbuka untuk umum tanpa biaya masuk." },
        { q: "Promo apa saja yang tersedia saat pembukaan?", a: "Ada harga spesial pembukaan, hadiah untuk pembeli pertama, dan test ride berhadiah. Syarat dan ketentuan berlaku; tanyakan detailnya melalui formulir di halaman ini." },
        { q: "Apakah saya bisa test ride di showroom {city}?", a: "Bisa. Test ride gratis, didampingi tim Wedison di sekitar showroom, dan tidak perlu membawa KTP atau SIM." },
        { q: "Bagaimana cara bertanya sebelum showroom dibuka?", a: "Isi formulir pertanyaan di halaman ini atau hubungi tim kami lewat WhatsApp. Kami akan membalas pada jam kerja." },
      ],
    },
  },
  en: {
    seo: {
      title: "Wedison {city} Showroom – Grand Opening",
      description: "Wedison is opening an Experience Center in {city}. Save the opening date, enjoy opening promotions and free test rides, and ask our team anything.",
      keywords: ["wedison {city}", "electric motorcycle showroom {city}", "electric motorcycle dealer {city}", "wedison grand opening"],
    },
    hero: {
      eyebrow: "Grand Opening · {city}",
      title: "The Wedison Experience Center is coming to {city}.",
      desc: "See, ride and own a Wedison electric motorcycle without leaving the city. Join us on opening day for promotions made for {city}.",
      ctaPrimary: "Ask Our Team",
      ctaSecondary: "See the Promotions",
      imageAlt: "Wedison electric motorcycle in {city}",
    },
    countdown: {
      label: "Countdown to the opening",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      open: "The {city} Experience Center is now open. See you at the showroom!",
    },
    event: {
      title: "Save the date.",
      desc: "The opening is open to the public. Bring family or friends who are curious about electric motorcycles.",
      dateLabel: "Date",
      timeLabel: "Time",
      locationLabel: "Location",
      entryLabel: "Entry",
      entryValue: "Free, open to the public",
      addToCalendar: "Add to Calendar",
      directions: "Get Directions",
      calendarTitle: "Grand Opening: {showroom}",
      calendarDetails: "Opening of the Wedison electric motorcycle showroom in {city}.",
      imageAlt: "Front view of the {showroom}",
    },
    experience: {
      title: "One place to get to know Wedison.",
      desc: "The {city} Experience Center follows our showrooms in other cities: calm, spacious, and no pressure to buy.",
      items: [
        { title: "Free test rides", desc: "Ride any model around the showroom with our team. No ID card or licence needed.", linkLabel: "", linkHref: "" },
        { title: "Every model under one roof", desc: "See, touch and compare the Athena, Bees, Victory and EdPower side by side.", linkLabel: "", linkHref: "" },
        { title: "Purchase consultation", desc: "Compare cash, credit, or Battery as a Service: buy the bike, subscribe to the battery.", linkLabel: "Learn about Battery as a Service", linkHref: "/baas/" },
        { title: "Official service", desc: "The showroom is also an official Wedison workshop for scheduled service and genuine parts.", linkLabel: "", linkHref: "" },
      ],
      imageMainAlt: "Wedison showroom interior with a line-up of electric motorcycles",
      imageLoungeAlt: "Bright, comfortable waiting area at a Wedison showroom",
    },
    promo: {
      title: "Opening promotions.",
      desc: "Valid during the opening period at the {city} Experience Center, while quotas last.",
      items: [
        { title: "Opening price", desc: "[Rp X,XXX,XXX] off any Wedison purchase during [promo period]." },
        { title: "A gift for the first [N] buyers", desc: "Exclusive [merchandise or accessory] for the first [N] buyers on opening day." },
        { title: "Test ride and take home a gift", desc: "Take a test ride on opening day and receive a [souvenir] from Wedison." },
      ],
      terms: "Terms and conditions apply. Promotion details may change; ask our team about availability.",
      cta: "Ask About the Promotions",
      imageAlt: "Wedison {city} opening promotion visual",
    },
    models: {
      title: "Models you can ride.",
      desc: "Four characters for different needs, from daily city trips to long distances.",
      detail: "View details",
      taglines: { athena: "Premium and comfortable", bees: "Compact and agile", victory: "Style and power", edpower: "Tough, long range" },
    },
    inquiry: {
      title: "Have a question?",
      desc: "Ask about the promotions, the opening schedule, or which model suits you. Our team will get back to you by email or WhatsApp.",
      directTitle: "Prefer to chat?",
      directDesc: "Our team also answers on WhatsApp during business hours.",
      whatsappLabel: "Chat on WhatsApp",
      whatsappText: "Hi Wedison, I have a question about the {city} showroom opening.",
      emailLabel: "Email",
    },
    faq: {
      title: "About the opening",
      items: [
        { q: "When does the Wedison Experience Center {city} open?", a: "The opening is scheduled for {date}, {time}, at {address}." },
        { q: "Is there an entry fee for the opening?", a: "No. The opening is open to the public free of charge." },
        { q: "What promotions are available at the opening?", a: "An opening price, a gift for the first buyers, and a gift for test riders. Terms and conditions apply; ask for details using the form on this page." },
        { q: "Can I take a test ride at the {city} showroom?", a: "Yes. Test rides are free, accompanied by the Wedison team around the showroom, and no ID card or licence is needed." },
        { q: "How can I ask questions before the showroom opens?", a: "Fill in the inquiry form on this page or message our team on WhatsApp. We reply during business hours." },
      ],
    },
  },
};

export const cloneTemplate = (): Record<TeaserLocale, TeaserContent> => structuredClone(TEASER_TEMPLATE);
