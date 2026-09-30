// Sumber tunggal copy SEO per-halaman per-locale (id + en).
// Dipisah dari komponen agar bisa diimpor Server Component (generateMetadata)
// dan app/sitemap.ts. JANGAN ambil string SEO dari kamus (dictionaries/*.tsx) —
// file itu berisi JSX (next/link, AlertDialog) dan client-only; di sini harus string murni.
//
// Aturan panjang (audit SEO 2026-09): title <= 60 karakter, description 120–155 karakter,
// klaim angka (jarak, kecepatan, waktu charging) HARUS sama dengan kamus spesifikasi.
// Gambar OG: 1200x630 di /public/og (dibuat dari aset resmi; lihat docs/SEO-AUDIT-2026-09.md).

export type Locale = "id" | "en";

export type LocaleSEO = {
  title: string;
  description: string;
  keywords: string[];
};

export type PageSEO = {
  id: LocaleSEO;
  en: LocaleSEO;
  /** Path gambar OG relatif terhadap origin (di-prefix SITE di seo1.ts). */
  image?: string;
  /** Prioritas & frekuensi untuk sitemap.xml */
  priority?: number;
  changeFrequency?: "daily" | "weekly" | "monthly" | "yearly";
};

// Key = path locale-agnostic ("/", "/products/victory", "/corporate/about", ...).
export const seoContent: Record<string, PageSEO> = {
  "/": {
    image: "/og/default.jpg",
    priority: 1,
    changeFrequency: "weekly",
    id: {
      title: "Wedison – Motor Listrik & SuperCharge Indonesia",
      description:
        "Motor listrik Wedison: Athena, Bees, Victory, dan EdPower. SuperCharge 10% ke 80% dalam 15 menit, garansi baterai 3 tahun. Jadwalkan test ride di showroom.",
      keywords: [
        "wedison",
        "motor listrik",
        "kendaraan listrik",
        "EV",
        "supercharge",
        "motor listrik terbaik",
        "electric motorcycle",
        "charging station",
        "otomotif",
      ],
    },
    en: {
      title: "Wedison – Electric Motorcycles & SuperCharge Indonesia",
      description:
        "Wedison electric motorcycles: Athena, Bees, Victory and EdPower. SuperCharge 10% to 80% in 15 minutes, 3-year battery warranty. Book a test ride.",
      keywords: [
        "wedison",
        "electric motorcycle",
        "electric vehicle",
        "EV",
        "supercharge",
        "best electric motorcycle",
        "charging station",
        "automotive",
      ],
    },
  },

  "/corporate/about": {
    image: "/og/about.jpg",
    priority: 0.5,
    changeFrequency: "monthly",
    id: {
      title: "Tentang Wedison – Produsen Motor Listrik Indonesia",
      description:
        "Kenali Wedison, produsen motor listrik Indonesia dengan jaringan SuperCharge: visi, misi, nilai perusahaan, dan komitmen pada mobilitas bersih.",
      keywords: [
        "wedison",
        "tentang wedison",
        "tentang kami",
        "motor listrik",
        "kendaraan listrik",
        "perusahaan EV",
        "visi misi",
        "produsen motor listrik",
      ],
    },
    en: {
      title: "About Wedison – Electric Motorcycle Maker, Indonesia",
      description:
        "Get to know Wedison, the Indonesian electric motorcycle maker behind the SuperCharge network: our vision, mission, values and commitment to clean mobility.",
      keywords: [
        "wedison",
        "about wedison",
        "about us",
        "electric motorcycle",
        "electric vehicle",
        "EV company",
        "vision mission",
        "electric motorcycle manufacturer",
      ],
    },
  },

  "/corporate/contact": {
    image: "/og/default.jpg",
    priority: 0.5,
    changeFrequency: "monthly",
    id: {
      title: "Hubungi Wedison – Kontak, Showroom & Layanan",
      description:
        "Hubungi tim Wedison via WhatsApp, email, atau formulir kontak untuk info produk, layanan purna jual, dan kerja sama bisnis. Kantor pusat: Jakarta Selatan.",
      keywords: [
        "wedison",
        "kontak wedison",
        "hubungi wedison",
        "layanan pelanggan",
        "motor listrik",
        "supercharge",
        "EV",
      ],
    },
    en: {
      title: "Contact Wedison – Sales, Support & Partnerships",
      description:
        "Reach the Wedison team via WhatsApp, email or the contact form for product info, after-sales service and partnerships. Head office in South Jakarta.",
      keywords: [
        "wedison",
        "contact wedison",
        "customer service",
        "electric motorcycle",
        "supercharge",
        "EV",
      ],
    },
  },

  "/cookie-policy": {
    image: "/og/default.jpg",
    priority: 0.2,
    changeFrequency: "yearly",
    id: {
      title: "Kebijakan Cookie Wedison – Privasi & Persetujuan",
      description:
        "Cookie apa saja yang dipakai wedison.co, tujuannya, masa simpannya, dan cara mengatur atau mencabut persetujuan cookie analitik dan marketing kapan saja.",
      keywords: ["wedison", "kebijakan cookie", "privasi", "persetujuan cookie"],
    },
    en: {
      title: "Wedison Cookie Policy – Privacy & Consent",
      description:
        "Which cookies wedison.co uses, why we use them, how long they are kept, and how to manage or withdraw your analytics and marketing consent at any time.",
      keywords: ["wedison", "cookie policy", "privacy", "cookie consent"],
    },
  },

  "/products": {
    image: "/og/default.jpg",
    priority: 0.9,
    changeFrequency: "monthly",
    id: {
      title: "Motor Listrik Wedison – Bees, Athena, Victory, EdPower",
      description:
        "Jajaran motor listrik Wedison: Bees, Athena, Victory, dan EdPower. Bandingkan kecepatan, jarak tempuh, dan daya motor, lalu pilih yang paling pas untukmu.",
      keywords: [
        "wedison",
        "produk wedison",
        "motor listrik",
        "wedison bees",
        "wedison athena",
        "wedison victory",
        "wedison edpower",
        "harga motor listrik",
      ],
    },
    en: {
      title: "Wedison Electric Motorcycles – Bees, Athena & More",
      description:
        "The Wedison lineup: Bees, Athena, Victory and EdPower electric motorcycles. Compare top speed, range and motor power, then pick the model that fits you.",
      keywords: [
        "wedison",
        "wedison products",
        "electric motorcycle",
        "wedison bees",
        "wedison athena",
        "wedison victory",
        "wedison edpower",
        "electric scooter indonesia",
      ],
    },
  },

  "/products/athena": {
    image: "/og/athena.jpg",
    priority: 0.9,
    changeFrequency: "monthly",
    id: {
      title: "Wedison Athena – Motor Listrik Retro, 120 km, SuperCharge",
      description:
        "Athena, motor listrik retro premium Wedison: jarak tempuh hingga 120 km, 85 km/jam, SuperCharge 10% ke 80% dalam 15 menit. Lihat spesifikasi lengkapnya.",
      keywords: [
        "wedison",
        "motor listrik",
        "athena",
        "wedison athena",
        "motor listrik retro",
        "kendaraan listrik",
        "supercharge",
        "electric motorcycle",
      ],
    },
    en: {
      title: "Wedison Athena – Retro Electric Motorcycle, 120 km Range",
      description:
        "Athena, Wedison's premium retro electric motorcycle: up to 120 km range, 85 km/h top speed, SuperCharge 10% to 80% in 15 minutes. See full specifications.",
      keywords: [
        "wedison",
        "electric motorcycle",
        "athena",
        "wedison athena",
        "retro electric motorcycle",
        "electric vehicle",
        "supercharge",
      ],
    },
  },

  "/products/bees": {
    image: "/og/bees.jpg",
    priority: 0.9,
    changeFrequency: "monthly",
    id: {
      title: "Wedison Bees – Motor Listrik Ringkas, 80 km, 60 km/jam",
      description:
        "Bees, motor listrik ringkas dan lincah dari Wedison untuk harian: jarak tempuh 80 km, kecepatan 60 km/jam, bobot 78,5 kg. Lihat spesifikasi lengkapnya.",
      keywords: [
        "wedison",
        "motor listrik",
        "bees",
        "wedison bees",
        "motor listrik compact",
        "kendaraan listrik",
        "motor listrik harian",
        "electric motorcycle",
      ],
    },
    en: {
      title: "Wedison Bees – Compact Electric Scooter, 80 km Range",
      description:
        "Bees, Wedison's compact and agile electric scooter for daily rides: 80 km range, 60 km/h top speed and just 78.5 kg. See the specifications and highlights.",
      keywords: [
        "wedison",
        "electric motorcycle",
        "bees",
        "wedison bees",
        "compact electric motorcycle",
        "electric vehicle",
        "electric scooter",
      ],
    },
  },

  "/products/victory": {
    image: "/og/victory.jpg",
    priority: 0.9,
    changeFrequency: "monthly",
    id: {
      title: "Wedison Victory – Motor Listrik Urban, 120 km, 85 km/jam",
      description:
        "Victory, motor listrik urban Wedison dengan gaya dan tenaga: jarak hingga 120 km, 85 km/jam, motor 3 kW, SuperCharge 15 menit. Lihat spesifikasinya.",
      keywords: [
        "wedison",
        "motor listrik",
        "victory",
        "wedison victory",
        "motor listrik urban",
        "kendaraan listrik",
        "supercharge",
        "electric motorcycle",
      ],
    },
    en: {
      title: "Wedison Victory – Urban Electric Motorcycle, 120 km",
      description:
        "Victory, Wedison's urban electric motorcycle with style and power: up to 120 km range, 85 km/h, 3 kW motor, 15-minute SuperCharge. See full specifications.",
      keywords: [
        "wedison",
        "electric motorcycle",
        "victory",
        "wedison victory",
        "urban electric motorcycle",
        "electric vehicle",
        "supercharge",
      ],
    },
  },

  "/products/edpower": {
    image: "/og/edpower.jpg",
    priority: 0.9,
    changeFrequency: "monthly",
    id: {
      title: "Wedison EdPower – Motor Listrik Jarak Jauh, 200 km",
      description:
        "EdPower, motor listrik Wedison untuk jarak jauh dan armada: jarak hingga 200 km, 90 km/jam, baterai 5 kWh, SuperCharge 15 menit. Lihat spesifikasinya.",
      keywords: [
        "wedison",
        "motor listrik",
        "edpower",
        "wedison edpower",
        "motor listrik jarak jauh",
        "motor listrik armada",
        "supercharge",
        "electric motorcycle",
      ],
    },
    en: {
      title: "Wedison EdPower – Long-Range Electric Motorcycle, 200 km",
      description:
        "EdPower, Wedison's rugged long-range electric motorcycle for fleets and touring: up to 200 km range, 90 km/h, 5 kWh battery, 15-minute SuperCharge.",
      keywords: [
        "wedison",
        "electric motorcycle",
        "edpower",
        "wedison edpower",
        "long range electric motorcycle",
        "fleet electric motorcycle",
        "supercharge",
      ],
    },
  },

  "/super-charge": {
    image: "/og/supercharge.jpg",
    priority: 0.8,
    changeFrequency: "monthly",
    id: {
      title: "SuperCharge Wedison – Isi Daya Motor Listrik 15 Menit",
      description:
        "SuperCharge, jaringan pengisian cepat Wedison: baterai 10% ke 80% dalam 15 menit, mulai dari aplikasi, tersebar di banyak kota. Pelajari cara kerjanya.",
      keywords: [
        "wedison",
        "supercharge",
        "charging station",
        "pengisian motor listrik",
        "stasiun pengisian",
        "motor listrik",
        "EV",
        "teknologi pengisian cepat",
      ],
    },
    en: {
      title: "Wedison SuperCharge – 15-Minute Fast Charging Network",
      description:
        "SuperCharge, Wedison's fast-charging network: 10% to 80% in 15 minutes, started from the app, available across Indonesian cities. See how it works.",
      keywords: [
        "wedison",
        "supercharge",
        "charging station",
        "electric motorcycle charging",
        "ev charging",
        "electric motorcycle",
        "EV",
        "fast charging technology",
      ],
    },
  },

  "/super-charge/locations": {
    image: "/og/supercharge.jpg",
    priority: 0.8,
    changeFrequency: "weekly",
    id: {
      title: "Lokasi SuperCharge Wedison – Peta Stasiun Pengisian",
      description:
        "Cari stasiun SuperCharge Wedison terdekat di peta interaktif: jumlah charger, daya, jam operasional, dan fasilitas di tiap titik pengisian motor listrik.",
      keywords: [
        "wedison",
        "supercharge",
        "lokasi charging",
        "peta stasiun pengisian",
        "SPKLU motor listrik",
        "charging station",
        "EV",
      ],
    },
    en: {
      title: "Wedison SuperCharge Locations – Charging Station Map",
      description:
        "Find the nearest Wedison SuperCharge station on the interactive map: number of chargers, power, opening hours and amenities at every charging point.",
      keywords: [
        "wedison",
        "supercharge",
        "charging locations",
        "charging map",
        "ev charging station",
        "electric motorcycle",
        "EV",
      ],
    },
  },

  "/compare": {
    image: "/og/default.jpg",
    priority: 0.7,
    changeFrequency: "monthly",
    id: {
      title: "Bandingkan Motor Listrik Wedison – Spesifikasi Lengkap",
      description:
        "Bandingkan Bees, Athena, Victory, dan EdPower berdampingan: performa, baterai, jarak tempuh, dimensi, dan pengereman. Temukan yang paling pas untukmu.",
      keywords: [
        "bandingkan motor listrik",
        "spesifikasi wedison",
        "wedison bees",
        "wedison athena",
        "wedison victory",
        "wedison edpower",
        "perbandingan motor listrik",
      ],
    },
    en: {
      title: "Compare Wedison Electric Motorcycles – Full Specs",
      description:
        "Compare Bees, Athena, Victory and EdPower side by side: performance, battery, range, dimensions and brakes. Find the electric motorcycle that fits you.",
      keywords: [
        "compare electric motorcycle",
        "wedison specs",
        "wedison bees",
        "wedison athena",
        "wedison victory",
        "wedison edpower",
        "electric motorcycle comparison",
      ],
    },
  },

  "/showroom": {
    image: "/og/showroom.jpg",
    priority: 0.8,
    changeFrequency: "monthly",
    id: {
      title: "Showroom Wedison – Test Ride Motor Listrik & Servis",
      description:
        "Kunjungi showroom Wedison di Jakarta, Bekasi, Bandung, dan Bali: test ride motor listrik, konsultasi, pembiayaan, dan servis resmi. Booking kunjungan.",
      keywords: [
        "wedison",
        "showroom motor listrik",
        "test ride motor listrik",
        "showroom wedison jakarta",
        "showroom wedison bandung",
        "showroom wedison bali",
        "service center motor listrik",
      ],
    },
    en: {
      title: "Wedison Showrooms – Test Rides & Official Service",
      description:
        "Visit Wedison showrooms in Jakarta, Bekasi, Bandung and Bali: electric motorcycle test rides, consultation, financing and official service. Book a visit.",
      keywords: [
        "wedison",
        "electric motorcycle showroom",
        "test ride electric motorcycle",
        "wedison showroom jakarta",
        "wedison showroom bali",
        "electric motorcycle service center",
      ],
    },
  },

  "/faq": {
    image: "/og/default.jpg",
    priority: 0.6,
    changeFrequency: "monthly",
    id: {
      title: "FAQ Motor Listrik Wedison – Baterai, Charging, Garansi",
      description:
        "Jawaban pertanyaan umum seputar motor listrik Wedison: baterai dan garansi, cara isi daya, performa, keamanan, servis, fitur pintar, dan ban.",
      keywords: [
        "wedison",
        "faq motor listrik",
        "pertanyaan umum",
        "motor listrik",
        "cara isi daya motor listrik",
        "garansi motor listrik",
        "perawatan kendaraan listrik",
      ],
    },
    en: {
      title: "Wedison FAQ – Battery, Charging, Warranty & Service",
      description:
        "Answers to common questions about Wedison electric motorcycles: battery and warranty, charging, performance, safety, servicing, smart features and tyres.",
      keywords: [
        "wedison",
        "electric motorcycle faq",
        "frequently asked questions",
        "electric motorcycle",
        "how to charge electric motorcycle",
        "electric motorcycle warranty",
        "EV maintenance",
      ],
    },
  },

  "/career": {
    image: "/og/career.jpg",
    priority: 0.4,
    changeFrequency: "weekly",
    id: {
      title: "Karier di Wedison – Lowongan Kerja Motor Listrik",
      description:
        "Lowongan kerja terbaru di Wedison. Bergabung dengan tim yang membangun motor listrik dan jaringan pengisian cepat SuperCharge untuk jalanan Indonesia.",
      keywords: [
        "wedison",
        "karier",
        "lowongan kerja",
        "loker wedison",
        "kerja di wedison",
        "motor listrik",
      ],
    },
    en: {
      title: "Careers at Wedison – Electric Mobility Jobs",
      description:
        "The latest job openings at Wedison. Join the team building electric motorcycles and the SuperCharge fast-charging network for Indonesian roads.",
      keywords: [
        "wedison",
        "careers",
        "jobs",
        "wedison jobs",
        "work at wedison",
        "electric motorcycle",
      ],
    },
  },

  "/ojol": {
    image: "/og/ojol.jpg",
    priority: 0.7,
    changeFrequency: "monthly",
    id: {
      title: "Wedison Ojol – Sewa Motor Listrik Driver Ojek Online",
      description:
        "Program sewa motor listrik Wedison untuk driver ojol: sewa harian atau sewa milik mulai Rp50.000 per hari, tanpa antre BBM, didukung jaringan SuperCharge.",
      keywords: [
        "wedison",
        "sewa motor listrik",
        "ojol",
        "ojek online",
        "motor listrik ojol",
        "rental motor listrik",
      ],
    },
    en: {
      title: "Wedison Ojol – Electric Motorcycle Rental for Drivers",
      description:
        "Wedison electric motorcycle rental for ride-hailing drivers: daily rental or rent-to-own from Rp50,000 per day, no fuel queues, backed by SuperCharge.",
      keywords: [
        "wedison",
        "electric motorcycle rental",
        "ojol",
        "ride-hailing",
        "ojol electric motorcycle",
        "motorcycle rental",
      ],
    },
  },

  "/media-center": {
    image: "/og/media-center.jpg",
    priority: 0.6,
    changeFrequency: "daily",
    id: {
      title: "Media Center Wedison – Berita, Artikel & Liputan",
      description:
        "Berita terbaru, artikel, siaran pers, dan liputan media tentang Wedison: peluncuran produk, teknologi SuperCharge, dan kegiatan perusahaan.",
      keywords: [
        "wedison",
        "media center",
        "berita wedison",
        "press release",
        "liputan media",
        "update motor listrik",
        "inovasi kendaraan listrik",
      ],
    },
    en: {
      title: "Wedison Media Center – News, Articles & Press",
      description:
        "The latest news, articles, press releases and media coverage about Wedison: product launches, SuperCharge technology and company activities.",
      keywords: [
        "wedison",
        "media center",
        "wedison news",
        "press release",
        "media coverage",
        "electric motorcycle updates",
        "electric vehicle innovation",
      ],
    },
  },
};
