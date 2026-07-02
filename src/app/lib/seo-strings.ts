// Sumber tunggal copy SEO per-halaman per-locale (id + en).
// Dipisah dari komponen agar bisa diimpor Server Component (generateMetadata)
// dan app/sitemap.ts. JANGAN ambil string SEO dari translations.tsx — file itu
// berisi JSX (next/link, AlertDialog) dan client-only; di sini harus string murni.

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
};

// Key = path locale-agnostic ("/", "/victory", "/corporate/about", ...).
export const seoContent: Record<string, PageSEO> = {
  "/": {
    image: "/wedison-sidebyside.png",
    id: {
      title: "Wedison - Motor Listrik & SuperCharge Terdepan di Indonesia",
      description:
        "Wedison adalah produsen motor listrik terbaik di Indonesia dengan teknologi SuperCharge. Temukan produk motor listrik premium, stasiun pengisian cepat, dan solusi kendaraan listrik masa depan.",
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
      title: "Wedison - Indonesia's Leading Electric Motorcycle & SuperCharge",
      description:
        "Wedison is Indonesia's premier electric motorcycle manufacturer, powered by SuperCharge technology. Discover premium electric motorbikes, fast-charging stations, and the future of electric mobility.",
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
    image: "/about-us.webp",
    id: {
      title: "Tentang Wedison - Produsen Motor Listrik Indonesia",
      description:
        "Wedison adalah produsen motor listrik terkemuka di Indonesia yang berkomitmen menghadirkan solusi kendaraan listrik ramah lingkungan. Ketahui visi, misi, dan sejarah perusahaan kami.",
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
      title: "About Wedison - Indonesian Electric Motorcycle Manufacturer",
      description:
        "Wedison is a leading electric motorcycle manufacturer in Indonesia committed to eco-friendly electric mobility solutions. Learn about our vision, mission, and company history.",
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
    image: "/contact-us.webp",
    id: {
      title: "Kontak Wedison - Hubungi Kami",
      description:
        "Hubungi Wedison untuk informasi produk, layanan purna jual, kerjasama bisnis, atau pertanyaan seputar motor listrik dan SuperCharge. Tim kami siap membantu Anda.",
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
      title: "Contact Wedison - Get in Touch",
      description:
        "Contact Wedison for product information, after-sales service, business partnerships, or any questions about electric motorcycles and SuperCharge. Our team is ready to help you.",
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

  "/athena": {
    image: "/athena-product-hero.webp",
    id: {
      title: "Athena - Motor Listrik Premium Indonesia",
      description:
        "Athena adalah motor listrik premium dari Wedison, dengan teknologi SuperCharge, baterai tahan lama, dan desain modern. Lihat fitur, spesifikasi, dan keunggulannya di sini.",
      keywords: [
        "wedison",
        "motor listrik",
        "athena",
        "kendaraan listrik",
        "EV",
        "supercharge",
        "motor listrik terbaik",
        "electric motorcycle",
      ],
    },
    en: {
      title: "Athena - Premium Electric Motorcycle Indonesia",
      description:
        "Athena is Wedison's premium electric motorcycle featuring SuperCharge technology, a long-lasting battery, and a modern design. Explore its features, specifications, and highlights here.",
      keywords: [
        "wedison",
        "electric motorcycle",
        "athena",
        "electric vehicle",
        "EV",
        "supercharge",
        "best electric motorcycle",
      ],
    },
  },

  "/bees": {
    image: "/bees-product-hero.webp",
    id: {
      title: "Bees - Motor Listrik Compact & Praktis | Wedison",
      description:
        "Bees adalah motor listrik compact dari Wedison, cocok untuk kebutuhan harian, desain praktis dan mudah digunakan. Lihat keunggulan dan spesifikasi lengkapnya di sini.",
      keywords: [
        "wedison",
        "motor listrik",
        "bees",
        "motor listrik compact",
        "kendaraan listrik",
        "EV",
        "motor listrik praktis",
        "electric motorcycle",
      ],
    },
    en: {
      title: "Bees - Compact & Practical Electric Motorcycle | Wedison",
      description:
        "Bees is Wedison's compact electric motorcycle, perfect for daily use with a practical, easy-to-ride design. See its highlights and full specifications here.",
      keywords: [
        "wedison",
        "electric motorcycle",
        "bees",
        "compact electric motorcycle",
        "electric vehicle",
        "EV",
        "practical electric motorcycle",
      ],
    },
  },

  "/victory": {
    image: "/victory-product-hero.webp",
    id: {
      title: "Victory - Motor Listrik Urban Modern | Wedison",
      description:
        "Victory adalah motor listrik urban dari Wedison, didesain untuk mobilitas kota yang efisien, ramah lingkungan, dan hemat energi. Temukan spesifikasi, fitur, dan keunggulannya di sini.",
      keywords: [
        "wedison",
        "motor listrik",
        "victory",
        "motor listrik urban",
        "kendaraan listrik",
        "EV",
        "motor listrik hemat energi",
        "electric motorcycle",
      ],
    },
    en: {
      title: "Victory - Modern Urban Electric Motorcycle | Wedison",
      description:
        "Victory is Wedison's urban electric motorcycle, designed for efficient, eco-friendly, and energy-saving city mobility. Discover its specifications, features, and highlights here.",
      keywords: [
        "wedison",
        "electric motorcycle",
        "victory",
        "urban electric motorcycle",
        "electric vehicle",
        "EV",
        "energy-saving electric motorcycle",
      ],
    },
  },

  "/edpower": {
    image: "/edpower-product-hero.webp",
    id: {
      title: "EdPower - Motor Listrik Premium Indonesia | Wedison",
      description:
        "EdPower adalah motor listrik premium dari Wedison, dengan teknologi SuperCharge, baterai tahan lama, dan desain modern. Lihat fitur, spesifikasi, dan keunggulannya di sini.",
      keywords: [
        "wedison",
        "motor listrik",
        "edpower",
        "kendaraan listrik",
        "EV",
        "supercharge",
        "motor listrik premium",
        "electric motorcycle",
      ],
    },
    en: {
      title: "EdPower - Premium Electric Motorcycle Indonesia | Wedison",
      description:
        "EdPower is Wedison's premium electric motorcycle featuring SuperCharge technology, a long-lasting battery, and a modern design. Explore its features, specifications, and highlights here.",
      keywords: [
        "wedison",
        "electric motorcycle",
        "edpower",
        "electric vehicle",
        "EV",
        "supercharge",
        "premium electric motorcycle",
      ],
    },
  },

  "/super-charge": {
    image: "/super-charge/supercharge-testing.webp",
    id: {
      title: "SuperCharge - Stasiun Pengisian Cepat Motor Listrik | Wedison",
      description:
        "SuperCharge adalah teknologi stasiun pengisian super cepat dari Wedison, solusi terbaik untuk mengisi daya motor listrik dalam waktu singkat. Lihat lokasi dan keunggulan SuperCharge di sini.",
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
      title:
        "SuperCharge - Fast Charging Stations for Electric Motorcycles | Wedison",
      description:
        "SuperCharge is Wedison's ultra-fast charging station technology — the best way to charge your electric motorcycle in minutes. See SuperCharge locations and benefits here.",
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

  "/compare": {
    image: "/wedison-sidebyside.png",
    id: {
      title: "Bandingkan Motor Listrik Wedison - Spesifikasi Lengkap",
      description:
        "Bandingkan spesifikasi lengkap motor listrik Wedison (Bees, Athena, Victory, EdPower) berdampingan: performa, baterai, jarak tempuh, dimensi, dan pengereman. Temukan yang paling pas untukmu.",
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
      title: "Compare Wedison Electric Motorcycles - Full Specs",
      description:
        "Compare full specifications of Wedison electric motorcycles (Bees, Athena, Victory, EdPower) side by side: performance, battery, range, dimensions, and brakes. Find the one that fits you.",
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
    image: "/Showroom-Receptionist.webp",
    id: {
      title: "Showroom Wedison - Lihat & Test Motor Listrik Terbaru",
      description:
        "Kunjungi showroom Wedison untuk melihat dan mencoba motor listrik terbaru serta teknologi SuperCharge. Dapatkan informasi lokasi, jam buka, dan fasilitas lengkap di sini.",
      keywords: [
        "wedison",
        "showroom motor listrik",
        "test ride motor listrik",
        "motor listrik terbaru",
        "kendaraan listrik",
        "supercharge",
        "EV",
      ],
    },
    en: {
      title: "Wedison Showroom - See & Test the Latest Electric Motorcycles",
      description:
        "Visit a Wedison showroom to see and test-ride the latest electric motorcycles and SuperCharge technology. Find location details, opening hours, and facilities here.",
      keywords: [
        "wedison",
        "electric motorcycle showroom",
        "test ride electric motorcycle",
        "latest electric motorcycle",
        "electric vehicle",
        "supercharge",
        "EV",
      ],
    },
  },

  "/faq": {
    image: "/wedison-sidebyside.png",
    id: {
      title: "FAQ - Pertanyaan Umum Motor Listrik | Wedison",
      description:
        "Temukan jawaban dari pertanyaan umum seputar motor listrik Wedison. Mulai dari cara pengisian daya, perawatan, garansi, hingga informasi pembelian.",
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
      title: "FAQ - Common Electric Motorcycle Questions | Wedison",
      description:
        "Find answers to common questions about Wedison electric motorcycles — from charging and maintenance to warranty and purchasing information.",
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
    image: "/wedison-sidebyside.png",
    id: {
      title: "Karier - Bergabung dengan Wedison | Lowongan Kerja",
      description:
        "Temukan lowongan kerja terbaru di Wedison. Bergabunglah dengan tim yang membangun masa depan kendaraan listrik di Indonesia.",
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
      title: "Careers - Join Wedison | Job Openings",
      description:
        "Explore the latest job openings at Wedison. Join the team building the future of electric mobility in Indonesia.",
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
    image: "/wedison-sidebyside.png",
    id: {
      title: "Sewa Motor Listrik untuk Ojol | Wedison",
      description:
        "Solusi sewa motor listrik Wedison untuk mitra ojek online — hemat biaya operasional, ramah lingkungan, dan didukung jaringan SuperCharge.",
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
      title: "Electric Motorcycle Rental for Ride-Hailing | Wedison",
      description:
        "Wedison electric motorcycle rental for ride-hailing (ojol) partners — lower operating costs, eco-friendly, and backed by the SuperCharge network.",
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
    image: "/wedison-sidebyside.png",
    id: {
      title: "Media Center - Berita & Update Wedison",
      description:
        "Ikuti berita terbaru, siaran pers, dan liputan media tentang Wedison. Dapatkan update seputar inovasi, produk baru, serta aktivitas perusahaan.",
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
      title: "Media Center - Wedison News & Updates",
      description:
        "Follow the latest news, press releases, and media coverage about Wedison. Get updates on innovations, new products, and company activities.",
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
