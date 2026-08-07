// Kamus terjemahan (ID). Dipisah per-locale supaya HANYA locale aktif
// yang dibundel ke client (bukan kedua bahasa sekaligus). Dikonsumsi lewat provider per-locale.
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const id = {
  //SEO Landing
  "landing.title": "Wedison - Motor Listrik dan Pengisian SuperCharge",
  "landing.description":
    "Motor listrik Wedison dengan jaringan SuperCharge. Isi daya dari 10% ke 80% dalam 15 menit.",

  // compare table
  "compare.model": "Bandingkan Model",
  "compare.select.bike": "Pilih motor untuk dibandingkan",
  "compare.title": "Bandingkan Model Wedison",
  "compare.subtitle":
    "Sandingkan spesifikasi tiap model, lalu pilih yang paling cocok buat kamu.",
  "compare.expandAll": "Buka Semua",
  "compare.collapseAll": "Tutup Semua",
  "compare.swipeHint": "Geser untuk lihat selengkapnya",
  "compare.page.kicker": "Bandingkan Motor Listrik",
  "compare.page.addBike": "Tambah motor",
  "compare.page.remove": "Hapus",
  "compare.viewDetails": "Lihat Detail",
  "compare.help.title": "Masih bingung pilih?",
  "compare.help.subtitle":
    "Tim kami bantu carikan model yang paling cocok buat kamu.",
  "compare.help.whatsapp": "Konsultasi via WhatsApp",
  "compare.help.showroom": "Kunjungi Showroom",

  // buttons
  "btn.learn.more": "Pelajari Lebih Lanjut",
  "btn.buy.on.tokopedia": "Beli di Tokopedia",
  "btn.see.brochure": "Lihat Brosur",
  "btn.order.now": "Pesan Sekarang",

  // user manual
  "user.manual.tag": "Dokumentasi",
  "user.manual.section.title": "Buku Panduan &",
  "user.manual.section.titleHighlight": "Petunjuk Pemilik",
  "user.manual.section.description":
    "Cara pakai, isi daya, rawat, dan berkendara aman. Semuanya ada di satu dokumen resmi.",
  "user.manual.faq.section.title": "Buku Panduan untuk",
  "user.manual.faq.section.titleHighlight": "Setiap Model",
  "user.manual.faq.section.description":
    "Pilih model di bawah untuk membaca atau mengunduh panduan resminya.",
  "user.manual.btn.view": "Lihat Panduan",
  "user.manual.btn.download": "Unduh",
  "user.manual.card.bees.title": "Wedison Bees",
  "user.manual.card.bees.desc":
    "Panduan komuter ringkas: cara pakai, isi daya, dan perawatan rutin.",
  "user.manual.card.athena.title": "Wedison Athena",
  "user.manual.card.athena.desc":
    "Panduan skuter retro: fitur pintar dan cara merawat baterai.",
  "user.manual.card.victory.title": "Wedison Victory",
  "user.manual.card.victory.desc":
    "Panduan kelas sport: mode berkendara, SuperCharge, dan jadwal servis.",
  "user.manual.card.edpower.title": "Wedison EdPower",
  "user.manual.card.edpower.desc":
    "Panduan lengkap model jarak jauh, untuk harian maupun perjalanan panjang.",

  // footer support
  "footer.support": "Bantuan",
  "footer.userManual": "Buku Panduan",
  "footer.faq": "FAQ",

  // Navbar
  "nav.products": "Produk",
  "nav.discover": "Jelajahi",
  "nav.discover.leftCard.title": "Jelajahi Wedison",
  "nav.discover.leftCard.description":
    "Mampir ke Experience Center, cari jawaban di FAQ, atau ikuti kabar terbaru di Media Center.",
  "nav.experienceCenter.description":
    "Datang ke showroom Wedison dan coba sendiri pengisian 15 menit.",
  "nav.faq.description":
    "Jawaban untuk pertanyaan yang paling sering ditanyakan soal produk dan layanan kami.",
  "nav.mediaCenter.description":
    "Berita, rilis resmi, dan kabar terbaru dari Wedison.",
  "nav.ojol.description":
    "Program sewa motor listrik khusus driver ojol. Mulai 50 ribu per hari.",
  "nav.showroom": "Showroom",
  "nav.serviceLocation": "Lokasi Layanan",
  "nav.superCharge": "SuperCharge",
  "nav.corporate": "Perusahaan",
  "nav.corporate.leftCard.title": "Powering the Future",
  "nav.corporate.leftCard.description":
    "Motor listrik yang bisa diisi dalam 15 menit, didukung jaringan SuperCharge milik Wedison sendiri.",
  "nav.aboutUs": "Tentang Kami",
  "nav.aboutUs.description":
    "Siapa Wedison, apa yang kami kerjakan, dan ke mana arahnya.",
  "nav.careers": "Karier",
  "nav.careers.description":
    "Peluang berkarier di Wedison dan industri kendaraan listrik Indonesia.",

  // Career Page
  "career.banner.title": "Bergabung Bersama",
  "career.banner.titleHighlight": "Tim Wedison",
  "career.banner.description":
    "Bantu kami membangun transportasi listrik di Indonesia",
  "career.banner.badge1": "Work-Life Balance",
  "career.banner.badge2": "Gaji Kompetitif",
  "career.banner.badge3": "Jenjang Karier",
  "career.section.title": "Posisi yang Tersedia",
  "career.section.description":
    "Cari posisi yang paling sesuai dengan keahlian Anda",
  "career.card.viewDetails": "Lihat Detail",
  "career.card.previewText": "Klik untuk melihat detail posisi dan kualifikasi",
  "career.detail.jobOverview": "Job Overview",
  "career.detail.keyResponsibilities": "Key Responsibilities",
  "career.detail.qualifications": "Qualifications & Requirements",
  "career.detail.applyButton": "Lamar Posisi Ini",
  "career.portal.title": "Pilih Platform Lamaran",
  "career.portal.description":
    "Pilih portal lowongan untuk melanjutkan lamaran Anda",
  "career.portal.infoText":
    "Anda akan diarahkan ke situs pihak ketiga untuk melengkapi lamaran. Siapkan CV dan dokumen pendukung terlebih dahulu.",
  "career.apply.emailTitle": "Lamar via Email",
  "career.apply.emailSubtitle": "Kirim lamaran langsung ke hr@wedison.co",
  "career.apply.orViaPortal": "atau via Job Portal",

  "nav.contactUs": "Hubungi Kami",
  "nav.contactUs.description":
    "Ada pertanyaan atau butuh bantuan? Tim Wedison siap membantu.",
  "nav.helpCenter": "Pusat Bantuan",

  // Hero
  "hero.tag": "Masa Depan adalah Listrik",
  "hero.title": "Masa Depan",
  "hero.titleHighlight": "Mobilitas Listrik",
  "hero.description":
    "Motor listrik Wedison: tenaga yang cukup untuk harian, pengisian yang cepat, dan tanpa emisi.",
  "hero.exploreModels": "Jelajahi Model",
  "hero.bookTestRide": "Pesan Test Ride",

  // Features
  "features.tag": "Kenapa Wedison",
  "features.title": "Mengapa Memilih",
  "features.titleHighlight": "Wedison",
  "features.description":
    "Empat model, satu jaringan pengisian, dan biaya harian yang jauh lebih ringan.",
  "features.longRangeBattery": "Jarak Tempuh sampai 160 km",
  "features.longRangeBatteryDesc":
    "Sekali isi cukup untuk berhari-hari pemakaian dalam kota, tergantung model dan pilihan baterainya.",
  "features.rapidCharging": "SuperCharge dalam 15 Menit",
  "features.rapidChargingDesc":
    "Isi daya dari 10% ke 80% dalam 15 menit di jaringan SuperCharge Wedison.",
  "features.impressivePerformance": "Torsi Penuh Sejak Awal",
  "features.impressivePerformanceDesc":
    "Motor listrik mengeluarkan torsi penuh sejak putaran pertama, jadi tarikan awalnya spontan.",
  "features.zeroEmissions": "Tanpa Emisi, Udara Lebih Bersih",
  "features.zeroEmissionsDesc":
    "Tanpa knalpot, tanpa asap. Makin banyak yang beralih, makin bersih udara kota kita.",
  "features.zeroEmissionsLink":
    "https://www.sciencedirect.com/science/article/pii/S0967070X21003401",
  "features.healthBenefits": "Energi Terpakai Lebih Sedikit",
  "features.healthBenefitsDesc":
    "Untuk jarak yang sama, Wedison butuh energi jauh lebih sedikit dibanding motor bensin. Ongkos hariannya ikut turun.",
  "features.healthBenefitsLink":
    "https://www.sciencedirect.com/science/article/pii/S016041202031970X",
  "features.noiseFree": "Berkendara Tanpa Bising",
  "features.noiseFreeDesc":
    "Motor listrik nyaris tak bersuara. Jalanan lebih tenang, dan perjalananmu ikut terasa lebih santai.",
  "features.noiseFreeLink":
    "https://www.sciencedirect.com/science/article/pii/S0160412023003896",

  // Products
  "products.tag": "Jajaran Model",
  "products.title": "Motor Listrik",
  "products.titleHighlight": "Wedison",
  "products.description":
    "Empat model untuk kebutuhan yang berbeda, dari harian di gang sempit sampai perjalanan jauh.",
  "products.learnMore": "Pelajari Lebih Lanjut",
  "products.orderNow": "Pesan Sekarang",
  "products.range": "Jarak Tempuh",
  "products.topSpeed": "Kecepatan Maksimum",
  "products.miles": "km",
  "products.mph": "km/jam",

  // Testimonials
  "testimonials.tag": "Testimoni",
  "testimonials.title": "Apa Kata",
  "testimonials.titleHighlight": "Pengendara Kami",
  "testimonials.description":
    "Cerita dari mereka yang sudah beralih ke motor listrik Wedison.",

  // Contact
  "contact.tag": "Hubungi Kami",
  "contact.title": "Tetap",
  "contact.titleHighlight": "Terhubung",
  "contact.description":
    "Ada pertanyaan seputar motor listrik Wedison? Tim kami siap membantu Anda.",
  "contact.sendMessage": "Kirim Pesan Kepada Kami",
  "contact.name": "Nama",
  "contact.email": "Email",
  "contact.address": "Alamat",
  "contact.addressPlaceholder": "Alamat Anda",
  "contact.province": "Provinsi",
  "contact.provincePlaceholder": "Pilih provinsi Anda",
  "contact.city": "Kota",
  "contact.cityPlaceholder": "Pilih kota Anda",
  "contact.provinceError": "Silakan pilih provinsi terlebih dahulu.",
  "contact.subject": "Subjek",
  "contact.subjectPlaceholder": "Bagaimana kami dapat membantu Anda?",
  "contact.message": "Pesan",
  "contact.messagePlaceholder": "Pesan Anda",
  "contact.send": "Kirim Pesan",
  "contact.contactInfo": "Informasi Kontak",
  "contact.headquarters": "Kantor Pusat",
  "contact.phone": "Telepon",
  "contact.phoneHours": "Senin sampai Jumat, 09.00 hingga 18.00",
  "contact.emailLabel": "Email",
  "contact.emailResponse": "Kami balas secepat mungkin",
  "contact.followUs": "Ikuti Kami",

  // Footer
  "footer.description":
    "Motor listrik dan jaringan pengisian cepat, dirakit dan dikembangkan untuk jalanan Indonesia.",
  "footer.products": "Produk",
  "footer.experience": "Pengalaman",
  "footer.corporate": "Perusahaan",
  "footer.contact": "Hubungi Kami",
  "footer.about": "Tentang Kami",
  "footer.copyright": "© 2025 Wedison. Seluruh hak cipta dilindungi.",
  "footer.tagline": "Dirancang untuk dipakai lama, dijalankan dengan listrik.",
  "footer.privacy": "Privasi",
  "footer.terms": "Ketentuan",
  "footer.cookies": "Cookies",
  "footer.meetus": "Temukan Kami",
  "footer.career": "Karier",

  //showroom

  "showroom.title": "Kunjungi",
  "showroom.titleHighlight": "Showroom Kami",
  "showroom.description":
    "Lihat, duduki, dan coba sendiri motor listrik Wedison sebelum memutuskan.",
  "showroom.tag": "Pusat Pengalaman",
  "showroom.location": "Lokasi Kami",
  "showroom.findUs": "Temukan Kami",
  "showroom.address":
    "Jl. Arteri Pondok Indah No 30 A-C, Kelurahan Kebayoran Lama Selatan, Kecamatan Kebayoran Lama, Jakarta Selatan, DKI Jakarta. 12240",
  "showroom.jakarta.name": "Wedison Jakarta",
  "showroom.jakarta.address":
    "Jl. Arteri Pondok Indah No 30 A-C, Kelurahan Kebayoran Lama Selatan, Kecamatan Kebayoran Lama, Jakarta Selatan, DKI Jakarta. 12240",
  "showroom.bandung.name": "Wedison Bandung",
  "showroom.bandung.address":
    "Jl. Raya Gadobangkong No.154, Gadobangkong, Kec. Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552",
  "showroom.bali.name": "Wedison Bali",
  "showroom.bali.address":
    "Jl. Gatot Subroto Tengah No.93, Dangin Puri Kaja, Kec. Denpasar Utara, Kota Denpasar, Bali 80118",
  "showroom.facility.showroom": "Showroom",
  "showroom.facility.service": "Service Center",
  "showroom.viewOnMaps": "Lihat di Maps",
  "showroom.hours": "Jam Buka",
  "showroom.weekdays": "Senin - Jumat: 10:00 - 19:00",
  "showroom.weekend": "Sabtu - Minggu: 10:00 - 17:00",
  "showroom.whatYouCanDo": "Yang Bisa Kamu Lakukan di Showroom",
  "showroom.testRide.title": "Test Ride",
  "showroom.testRide.description":
    "Coba langsung di area uji kami. Rasakan sendiri tarikan dan kenyamanannya sebelum membeli.",
  "showroom.consultation.title": "Konsultasi Produk",
  "showroom.consultation.description":
    "Bingung pilih model? Ceritakan kebutuhanmu, tim kami bantu carikan yang paling cocok.",
  "showroom.financing.title": "Simulasi Pembiayaan",
  "showroom.financing.description":
    "Hitung cicilan dan lihat pilihan pembayaran yang paling masuk untuk anggaranmu.",
  "showroom.service.title": "Servis dan Purna Jual",
  "showroom.service.description":
    "Servis resmi dan suku cadang asli, ditangani teknisi yang paham motor listrik Wedison.",
  "showroom.bookVisit": "Booking Kunjungan",
  "showroom.viewModels": "Pergi ke Showroom",

  // About Us Page
  "about.tag": "Cerita Kami",
  "about.title": "Tentang",
  "about.titleHighlight": "Wedison Group",
  "about.overview.title": "Wedison: Motor Listrik dan Jaringan Pengisiannya",
  "about.overview.p1":
    "Wedison adalah perusahaan motor listrik pengisian cepat pertama di Indonesia. Kami tidak berhenti di menjual motor. Kami juga membangun jaringan pengisian yang membuat motor itu masuk akal dipakai sehari-hari.",
  "about.overview.p2":
    "Motor dan stasiun pengisian kami dirancang sebagai satu paket, supaya pengalaman pemiliknya utuh sejak hari pertama.",
  "about.mission.title": "Misi Kami",
  "about.mission.p1":
    "Membangun ekosistem kendaraan listrik yang lengkap, terjangkau, dan benar-benar bisa diandalkan.",
  "about.mission.p2":
    "Membuat motor listrik jadi pilihan yang wajar bagi rumah tangga di Indonesia dan Asia Tenggara.",
  "about.values.title": "Nilai-Nilai Inti Kami",
  "about.values.innovation.title": "Inovasi Kendaraan Listrik",
  "about.values.innovation.description":
    "Mengembangkan kendaraan listrik hemat energi dengan harga yang bisa dijangkau banyak orang, bukan hanya segelintir.",
  "about.values.partnerships.title": "Kemitraan dan Kolaborasi",
  "about.values.partnerships.description":
    "Bekerja sama lintas industri untuk mempercepat pembangunan infrastruktur pengisian dan pengembangan baterai.",
  "about.values.experience.title": "Pengalaman Pemilik yang Utuh",
  "about.values.experience.description":
    "Membuat motor yang mudah dipakai siapa saja, lengkap dengan fitur yang benar-benar terpakai sehari-hari.",
  "about.projects.title": "Proyek Kami",
  "about.projects.future.title": "Menekan Emisi Transportasi Kota",
  "about.projects.future.description":
    "Memakai energi terbarukan untuk menurunkan emisi karbon, sekaligus memperluas pasar kendaraan listrik supaya transportasi bersih makin terjangkau.",
  "about.projects.charging.title": "Pengisian SuperCharge",
  "about.projects.charging.description":
    "Membangun jaringan pengisian yang andal, supaya pemilik motor listrik tidak perlu menghitung sisa daya setiap hari.",
  "about.offers.title": "Apa yang Kami Tawarkan",
  "about.offers.motorcycles.title": "Model Motor Listrik",
  "about.offers.motorcycles.description":
    "Beberapa model dengan karakter berbeda, dari komuter ringkas sampai maxi-scooter jarak jauh.",
  "about.offers.charging.title": "Stasiun Pengisian SuperCharge",
  "about.offers.charging.description":
    "Stasiun pengisian cepat yang mengisi baterai dari 10% ke 80% dalam 15 menit, jadi waktu berhenti tidak lama.",
  "about.joinUs": "Bergabunglah dengan Misi Kami",
  "about.joinUsDescription":
    "Kami sedang membangun transportasi listrik yang layak dipakai jangka panjang di Indonesia. Mari kerjakan bersama.",
  "about.contactUs": "Hubungi Kami",

  // Contact Page
  "contact.page.description":
    "Ada pertanyaan atau butuh bantuan? Hubungi kami lewat salah satu cara di bawah ini.",
  "contact.page.findUs": "Temukan Kami",
  "contact.page.openInMaps": "Buka di Google Maps",
  "contact.page.hours": "Jam Kerja",
  "contact.page.business.hours": "Senin - Jumat: 09.00 AM - 06.00 PM",
  "contact.page.faqTitle": "Pertanyaan yang Sering Diajukan",
  "contact.page.thankYou": "Terima Kasih!",
  "contact.page.messageReceived":
    "Pesan Anda sudah kami terima. Tim kami akan segera menghubungi Anda.",
  "contact.page.sendAnother": "Kirim Pesan Lain",
  "contact.page.sending": "Mengirim...",
  "contact.page.faq.q1": "Bagaimana cara ikut test ride motor Wedison?",
  "contact.page.faq.a1":
    "Datang langsung ke showroom kami, atau buat janji lebih dulu lewat situs ini. Tim kami akan mendampingi Anda selama test ride.",
  "contact.page.faq.q2": "Garansi apa yang didapat pembeli motor Wedison?",
  "contact.page.faq.a2":
    "Setiap motor Wedison bergaransi 2 tahun, dan baterainya bergaransi 3 tahun. Garansi ini mencakup cacat produksi.",
  "contact.page.faq.q3": "Berapa lama waktu pengisian motor Wedison?",
  "contact.page.faq.a3":
    "Di stasiun SuperCharge, sebagian besar model terisi dari 10% ke 80% dalam 15 menit. Kalau memakai colokan rumah, pengisian penuh butuh sekitar 4 sampai 10 jam, tergantung model dan kapasitas baterainya.",
  "contact.page.faq.q4": "Apakah ada pilihan cicilan?",
  "contact.page.faq.a4":
    "Ada. Kami menyediakan beberapa skema cicilan, dan tim kami bisa membantu Anda memilih yang paling sesuai dengan anggaran.",

  //calculator
  "calculator.page.tag": "Kalkulator Penghematan",
  "calculator.page.title": "Hitung ",
  "calculator.page.titleHighlight": "Penghematanmu Sekarang",
  "calculator.page.description":
    "Geser slidernya, bandingkan pengeluaran bulanan motor bensin dengan motor listrik Wedison, dan lihat sendiri selisihnya.",
  "calculator.page.battery": "Baterai",
  "calculator.page.monthlyTitle": "Pengeluaran Bulanan",
  "calculator.page.monthlyCostType": "Jenis Biaya",
  "calculator.page.monthlyElectricityCost": "Biaya Listrik",
  "calculator.page.monthlyMaintenanceCost": "Biaya Perawatan",
  "calculator.page.monthlyFuelCost": "Biaya Bahan Bakar",
  "calculator.page.monthlyTotalExpenses": "Total Pengeluaran",
  "calculator.page.savingTitle": "Penghematan dengan Wedison",
  "calculator.page.savingMonthlySavings": "Penghematan Bulanan",
  "calculator.page.savingAnnualSavings": "Penghematan Tahunan",
  "calculator.page.distance": "Jarak Tempuh Harianmu",
  "calculator.page.tnc1":
    "*Biaya perawatan mencakup servis rutin, tidak termasuk penggantian ban depan dan belakang",
  "calculator.page.tnc2":
    "**Harga bahan bakar Pertalite mengacu pada harga per Desember 2024",
  "calculator.page.cta": "Buktikan Sendiri",

  // specifications accordion
  "specs.category.engine": "Mesin",
  "specs.category.engine.motorType": "Tipe Motor",
  "specs.category.engine.motorPower": "Daya Motor (rata-rata)",
  "specs.category.engine.topSpeed": "Kecepatan Maksimum",
  "specs.category.engine.acceleration": "Akselerasi (0-50 km/j)",

  "specs.category.battery": "Baterai",
  "specs.category.battery.batteryType": "Tipe Baterai",
  "specs.category.battery.batteryCapacity": "Kapasitas Baterai",
  "specs.category.battery.voltage": "Tegangan Baterai (Volt)",
  "specs.category.battery.chargingTimeSuperCharge":
    "Waktu Pengisian dengan SuperCharge (10-80%)",
  "specs.category.battery.chargingTimeHome":
    "Waktu Pengisian dengan Home Charging (0-100%)",
  "specs.category.battery.range": "Jarak Tempuh",

  "specs.category.brake": "Rem",
  "specs.category.brake.frontBrake": "Rem Depan",
  "specs.category.brake.rearBrake": "Rem Belakang",
  "specs.category.brake.cbsSupport": "CBS",

  "specs.category.dimension": "Dimensi",
  "specs.category.dimension.length": "Panjang",
  "specs.category.dimension.width": "Lebar",
  "specs.category.dimension.height": "Tinggi",
  "specs.category.dimension.wheelbase": "Jarak Sumbu Roda (Wheelbase)",
  "specs.category.dimension.groundClearance":
    "Jarak Terendah ke Tanah (Ground Clearance)",
  "specs.category.dimension.seatHeight": "Tinggi Jok",
  "specs.category.dimension.weight": "Berat",

  "specs.category.tire": "Ban",
  "specs.category.tire.frontTire": "Ban Depan",
  "specs.category.tire.rearTire": "Ban Belakang",

  "specs.category.suspension": "Suspensi",
  "specs.category.suspension.frontSuspension": "Suspensi Depan",
  "specs.category.suspension.rearSuspension": "Suspensi Belakang",

  //edmax
  "edmax.title": "Edmax – Motor Listrik Canggih dan Bertenaga dari Wedison",
  "edmax.description":
    "Edmax adalah motor listrik flagship dari Wedison dengan top speed 86km/jam, headunit canggih (CarPlay & Android Auto), dan mendukung SuperCharge.",

  "edmax.hero.tag": "Model Unggulan",
  "edmax.hero.title": "Melaju ke Masa Depan dengan",
  "edmax.hero.titleHighlight": "EdPower",
  "edmax.hero.description":
    "Bertenaga, cepat diisi, dan sepenuhnya listrik. Dibuat untuk kamu yang sering menempuh jarak jauh.",
  "edmax.hero.orderNow": "Pesan Sekarang",
  "edmax.hero.downloadBrochure": "Unduh Brosur",

  "edmax.feature1.tag": "Smart Display",
  "edmax.feature1.title": "Layar Sentuh yang Terhubung ke Ponselmu",
  "edmax.feature1.subtitle":
    "Wireless Apple CarPlay & Android Auto, Full Layar Touch Screen",
  "edmax.feature1.description":
    "Navigasi, musik, dan panggilan tampil langsung di layar sentuh berwarna. Apple CarPlay dan Android Auto tersambung tanpa kabel.",
  "edmax.feature1.range": "Jarak Tempuh",
  "edmax.feature1.efficient": "Efisien",
  "edmax.feature1.energyUse": "Penggunaan Energi",
  "edmax.feature1.realtime": "Waktu Nyata",
  "edmax.feature1.rangeIndicator": "Indikator Jarak",

  "edmax.feature2.tag": "Pengisian Super Cepat",
  "edmax.feature2.title": "Isi Daya dalam Hitungan Menit",
  "edmax.feature2.subtitle": "Teknologi Pengisian Super Cepat",
  "edmax.feature2.description":
    "Dari 10% ke 80% dalam 15 menit. Cukup untuk sekali ngopi, lalu lanjut jalan.",
  "edmax.feature2.charge": "Pengisian 10-80%",
  "edmax.feature2.universal": "Universal",
  "edmax.feature2.chargingPort": "Port Pengisian",
  "edmax.feature2.smart": "Pintar",
  "edmax.feature2.chargingApp": "Aplikasi Pengisian",

  "edmax.feature3.title": "Dirancang untuk Menarik Perhatian",
  "edmax.feature3.subtitle": "Tajam. Sporty. Ikonik.",
  "edmax.feature3.description":
    "Garis bodi yang tegas dan sudut yang tajam membuat EdPower gampang dikenali dari jauh.",
  "edmax.feature3.aerodynamic": "Aerodinamis",
  "edmax.feature3.design": "Desain",
  "edmax.feature3.led": "LED",
  "edmax.feature3.lighting": "Pencahayaan",
  "edmax.feature3.premium": "Premium",
  "edmax.feature3.materials": "Material",

  "edmax.color.title": "Tentukan",
  "edmax.color.titleHighlight": "Gayamu",
  "edmax.color.description":
    "Pilih warna EdPower favoritmu dan lihat hasilnya.",

  "edmax.specs.title": "Spesifikasi",
  "edmax.specs.description": "Detail teknis lengkap motor listrik EdPower.",
  "edmax.specs.engine": "Mesin",
  "edmax.specs.battery": "Baterai",
  "edmax.specs.brake": "Rem",
  "edmax.specs.dimension": "Dimensi",
  "edmax.specs.tire": "Ban",
  "edmax.specs.suspension": "Suspensi",

  // edpower
  "edpower.productPage.hero.imageAlt":
    "Tampilan penuh EdPower dari sudut depan tiga perempat, menonjolkan desain maxi-scooter yang kokoh dan fitur premiumnya.",
  "edpower.productPage.hero.title": "EDPOWER",
  "edpower.productPage.hero.description": "Masa Depan Berkendara Listrik",
  "edpower.productPage.hero.ctaPrimary": "Pesan Sekarang",
  "edpower.productPage.hero.ctaSecondary": "Unduh Brosur",

  "edpower.productPage.techSpecs1.title": 160,
  "edpower.productPage.techSpecs1.unit": "km",
  "edpower.productPage.techSpecs1.desc": "Jarak Tempuh",

  "edpower.productPage.techSpecs2.title": 15,
  "edpower.productPage.techSpecs2.unit": "menit",
  "edpower.productPage.techSpecs2.desc":
    "Isi daya dari 10% ke 80% dengan SuperCharge",

  "edpower.productPage.techSpecs3.title": 80,
  "edpower.productPage.techSpecs3.unit": "km/jam",
  "edpower.productPage.techSpecs3.desc": "Kecepatan Maksimum",

  "edpower.productPage.productOverview.imageAlt":
    "Tampilan samping dramatis EdPower, menonjolkan jok lebar, posisi berkendara kokoh, dan tampilan futuristik.",
  "edpower.productPage.productOverview.title":
    "Bertenaga, Lapang, Siap Jarak Jauh.",
  "edpower.productPage.productOverview.description":
    "EdPower adalah model terbesar Wedison. Joknya lapang, posisi duduknya santai, dan jarak tempuhnya mencapai 160 km sekali isi. Layarnya terhubung ke ponsel, bagasinya muat dua helm, dan tenaganya tetap enak dipakai sampai luar kota.",

  "edpower.productPage.productHighlight1.imageAlt":
    "Tampilan kokpit menampilkan layar TFT besar dengan antarmuka Apple CarPlay & Android Auto",
  "edpower.productPage.productHighlight1.title":
    "Wireless Apple CarPlay & Android Auto",
  "edpower.productPage.productHighlight1.description":
    "Sambungkan ponselmu lewat Apple CarPlay atau Android Auto tanpa kabel. Navigasi, panggilan, dan musik tampil langsung di layar berwarna EdPower.",

  "edpower.productPage.productHighlight2.imageAlt":
    "Bagasi bawah jok terbuka menampilkan ruang ekstra besar",
  "edpower.productPage.productHighlight2.title": "Bagasi XXL di Bawah Jok",
  "edpower.productPage.productHighlight2.description":
    "Bagasi bawah jok EdPower muat dua helm sekaligus, atau belanjaan sekantong penuh. Tidak perlu tas tambahan.",

  "edpower.productPage.productHighlight3.imageAlt":
    "Tampilan belakang tiga perempat menonjolkan postur EdPower yang lebar dan jok ekstra luas",
  "edpower.productPage.productHighlight3.title": "Jok Lebar, Duduk Santai",
  "edpower.productPage.productHighlight3.description":
    "Jok yang lebar dan empuk plus posisi duduk yang rileks bikin perjalanan panjang tidak cepat pegal, buat pengendara maupun penumpang.",

  "edpower.productPage.productHighlight4.imageAlt":
    "Tampilan depan menampilkan lampu LED canggih dan bodi modern",
  "edpower.productPage.productHighlight4.title": "Desain yang Gampang Dikenali",
  "edpower.productPage.productHighlight4.description":
    "Wajah depan yang tegas, lampu LED penuh, dan bodi belakang yang berlekuk rapi. EdPower terlihat beda bahkan saat terparkir.",

  "edpower.productPage.productHighlight5.imageAlt":
    "Indikator baterai/jarak tempuh pada dashboard, tampilan close-up",
  "edpower.productPage.productHighlight5.title": "Jarak Tempuh Terbaik 160 km",
  "edpower.productPage.productHighlight5.description":
    "Sekali isi, EdPower sanggup menempuh sampai 160 km. Cukup untuk seminggu pemakaian dalam kota, atau sekali jalan ke luar kota.",

  "edpower.productPage.chargingOverview.imageAlt":
    "EdPower terparkir di showroom Wedison dengan stasiun SuperCharge dan charger rumah yang terlihat",
  "edpower.productPage.chargingOverview.title": "Dua Cara Mengisi Daya",
  "edpower.productPage.chargingOverview.description":
    "Buru-buru? Mampir ke SuperCharge di showroom Wedison, 15 menit selesai. Tidak buru-buru? Colokkan di rumah semalaman, paginya penuh.",

  "edpower.productPage.chargingHighlight1.imageAlt":
    "EdPower terhubung ke stasiun SuperCharge Wedison",
  "edpower.productPage.chargingHighlight1.title": "Wedison SuperCharge",
  "edpower.productPage.chargingHighlight1.description": (
    <>
      Isi daya dari 10% ke 80% dalam 15 menit, pas untuk mampir di sela
      aktivitas. Tersedia di seluruh showroom Wedison.{" "}
      <Link href="/super-charge" className="underline text-primary">
        Pelajari Lebih Lanjut
      </Link>
    </>
  ),

  "edpower.productPage.chargingHighlight2.imageAlt":
    "EdPower terhubung ke charger rumah di garasi modern yang bersih",
  "edpower.productPage.chargingHighlight2.title": "Isi Daya di Rumah",
  "edpower.productPage.chargingHighlight2.description":
    "Colokkan sebelum tidur, paginya baterai sudah penuh. Cukup pakai stopkontak biasa di rumah.",

  "edpower.specs.engine.motorType": "Brushless DC Motor",
  "edpower.specs.engine.motorPower": "3 kW",
  "edpower.specs.engine.topSpeed": "80 km/jam",
  "edpower.specs.engine.acceleration": "7.9 detik",
  "edpower.specs.battery.batteryType": "Lithium-ion (LFP)",
  "edpower.specs.battery.batteryCapacity": "5 kWh",
  "edpower.specs.battery.voltage": "76.8 Volt",
  "edpower.specs.battery.chargingTimeSuperCharge": "15 menit",
  "edpower.specs.battery.chargingTimeHome": "10.2 jam",
  "edpower.specs.battery.range": "160 km",
  "edpower.specs.brake.frontBrake": "Rem Cakram",
  "edpower.specs.brake.rearBrake": "Rem Cakram",
  "edpower.specs.brake.cbsSupport": "Ya",
  "edpower.specs.dimension.length": "2.000 mm",
  "edpower.specs.dimension.width": "710 mm",
  "edpower.specs.dimension.height": "1.200 mm",
  "edpower.specs.dimension.wheelbase": "1.450 mm",
  "edpower.specs.dimension.groundClearance": "160 mm",
  "edpower.specs.dimension.seatHeight": "740 mm",
  "edpower.specs.dimension.weight": "140 kg",
  "edpower.specs.tire.frontTire": "100/80-14",
  "edpower.specs.tire.rearTire": "120/70-14",
  "edpower.specs.suspension.frontSuspension": "Hidrolik Teleskopik",
  "edpower.specs.suspension.rearSuspension": "Hidrolik Teleskopik",

  //dash
  "dash.title":
    "Dash – Motor Listrik Pengiriman dengan Rak & Ruang Kargo Fleksibel",
  "dash.description":
    "Motor listrik khusus pengiriman. Ada dudukan box di belakang dan keranjang di depan, cocok untuk usaha logistik, makanan, maupun kurir.",

  "dash.hero.tag": "Motor Delivery",
  "dash.hero.title": "Efisiensi Maksimal untuk",
  "dash.hero.titleHighlight": "Setiap Pengantaran",
  "dash.hero.description":
    "Motor listrik yang memang dibuat untuk kerja: kuat dipakai seharian, hemat biaya operasional.",
  "dash.hero.orderNow": "Pesan Sekarang",
  "dash.hero.downloadBrochure": "Unduh Brosur",

  "dash.feature1.tag": "Pengiriman Tanpa Batas",
  "dash.feature1.title": "Dirancang untuk Pengiriman Tanpa Batas",
  "dash.feature1.subtitle": "Slot fleksibel untuk berbagai jenis box",
  "dash.feature1.description":
    "Slot belakangnya bisa dipasangi coolbox, kontainer, atau box lain sesuai jenis kirimanmu. Terpasang stabil, tidak goyang di jalan.",

  "dash.feature2.tag": "Dirancang Untuk Pengiriman",
  "dash.feature2.title": "Satu Jok, Seribu Tujuan",
  "dash.feature2.subtitle": "Praktis, ringan, dan efisien",
  "dash.feature2.description":
    "Tanpa jok penumpang, Dash jadi lebih ringan dan hemat daya. Pas untuk antar makanan, paket, atau logistik ringan.",

  "dash.color.title": "Tentukan",
  "dash.color.titleHighlight": "Warnamu",
  "dash.color.description": "Pilih warna Dash favoritmu dan lihat tampilannya.",

  "dash.specs.title": "Spesifikasi",
  "dash.specs.description": "Detail teknis lengkap motor listrik Dash.",
  "dash.specs.engine": "Mesin",
  "dash.specs.battery": "Baterai",
  "dash.specs.brake": "Rem",
  "dash.specs.dimension": "Dimensi",
  "dash.specs.tire": "Ban",
  "dash.specs.suspension": "Suspensi",

  //victory
  "victory.hero.tag": "Skuter Sporty",
  "victory.hero.title": "Kendalikan Jalanan dengan",
  "victory.hero.titleHighlight": "Gaya dan Performa",
  "victory.hero.description":
    "Skuter listrik bergaya sporty dengan bodi ramping. Enak dipakai harian di kota, tetap enak dilihat.",
  "victory.hero.orderNow": "Pesan Sekarang",
  "victory.hero.downloadBrochure": "Unduh Brosur",

  "victory.feature1.tag": "City Riding Nyaman",
  "victory.feature1.title": "Ukuran Ideal untuk Perkotaan",
  "victory.feature1.subtitle": "Tidak terlalu kecil, tidak terlalu besar",
  "victory.feature1.description":
    "Ukurannya pas untuk kota: gampang diselipkan di jalan sempit, tapi tetap terasa kokoh saat dipacu.",

  "victory.feature2.tag": "Desain Sporty",
  "victory.feature2.title": "Tampil Gahar & Modern",
  "victory.feature2.subtitle": "Mirip skutik performa tinggi",
  "victory.feature2.description":
    "Tampilannya mengambil garis skuter sporty, buat kamu yang mau tampil beda tanpa mengorbankan efisiensi.",

  "victory.color.description":
    "Pilih warna Victory favoritmu dan lihat tampilannya.",

  // ===

  "victory.productPage.hero.imageAlt": "Victory Abu-Abu",
  "victory.productPage.hero.title": "VICTORY",
  "victory.productPage.hero.description":
    "Gaya sporty, lincah di jalanan kota.",
  "victory.productPage.hero.ctaPrimary": "Pesan Sekarang",
  "victory.productPage.hero.ctaSecondary": "Unduh Brosur",

  "victory.productPage.techSpecs1.title": 120,
  "victory.productPage.techSpecs1.unit": "km",
  "victory.productPage.techSpecs1.desc": (
    <>
      <p>Jarak Tempuh</p>
      <p className="text-xs text-gray-500">*dengan Baterai Extended</p>
    </>
  ),

  "victory.productPage.techSpecs2.title": 15,
  "victory.productPage.techSpecs2.unit": "menit",
  "victory.productPage.techSpecs2.desc":
    "Isi daya dari 10% ke 80% dengan SuperCharge",

  "victory.productPage.techSpecs3.title": 80,
  "victory.productPage.techSpecs3.unit": "km/jam",
  "victory.productPage.techSpecs3.desc": "Kecepatan Maksimum",

  "victory.productPage.productOverview.imageAlt": "Victory Abu-Abu",
  "victory.productPage.productOverview.title": "Sporty dan Lincah di Kota.",
  "victory.productPage.productOverview.description":
    "Victory dibuat untuk jalanan kota. Wheelbase-nya lebar sehingga terasa stabil, rem cakram CBS di kedua roda bikin pengereman lebih terkendali, dan jarak tempuhnya sampai 120 km sekali isi. Kalau baterainya menipis, SuperCharge mengisinya kembali dalam 15 menit.",

  "victory.productPage.productHighlight1.imageAlt": "Tampilan Depan Victory",
  "victory.productPage.productHighlight1.title": "Desain Sporty yang Ikonik",
  "victory.productPage.productHighlight1.description":
    "Bodi aerodinamis dengan garis tegas dan lampu LED bersudut tajam. Victory gampang dikenali, bahkan di antrean lampu merah.",

  "victory.productPage.productHighlight2.imageAlt":
    "Tampilan tiga perempat depan menunjukkan ban lebar dan suspensi",
  "victory.productPage.productHighlight2.title": "Stabil di Berbagai Kondisi",
  "victory.productPage.productHighlight2.description":
    "Ban lebar dengan cengkeraman kuat dan suspensi hidrolik membuat Victory tetap mantap, baik di aspal mulus maupun jalan berlubang.",

  "victory.productPage.productHighlight3.imageAlt":
    "Tampilan dekat port SuperCharge dengan branding Wedison",
  "victory.productPage.productHighlight3.title": "Siap SuperCharge",
  "victory.productPage.productHighlight3.description":
    "Isi daya dari 10% ke 80% dalam 15 menit di SuperCharge, atau colokkan di rumah kalau tidak sedang buru-buru.",

  "victory.productPage.chargingOverview.imageAlt":
    "Victory terparkir di showroom Wedison, dengan stasiun SuperCharge di latar",
  "victory.productPage.chargingOverview.title": "Isi Daya Sesuai Kebutuhanmu",
  "victory.productPage.chargingOverview.description":
    "Mampir ke SuperCharge di showroom Wedison kalau sedang buru-buru, atau isi pelan-pelan di rumah saat malam. Dua-duanya gampang.",

  "victory.productPage.chargingHighlight1.imageAlt":
    "Victory di stasiun SuperCharge Wedison, kabel terhubung",
  "victory.productPage.chargingHighlight1.title": "SuperCharge Super Cepat",
  "victory.productPage.chargingHighlight1.description": (
    <>
      Isi daya dari 10% ke 80% dalam 15 menit, pas untuk berhenti sebentar di
      tengah hari yang padat. Tersedia di semua showroom Wedison.{" "}
      <Link href="/super-charge" className="underline text-primary">
        Pelajari Lebih Lanjut
      </Link>
    </>
  ),

  "victory.productPage.chargingHighlight2.imageAlt":
    "Victory terhubung ke charger rumah di garasi modern",
  "victory.productPage.chargingHighlight2.title": "Isi Daya Harian di Rumah",
  "victory.productPage.chargingHighlight2.description":
    "Colokkan malam hari, paginya sudah penuh. Charger rumahnya sudah termasuk dalam paket pembelian.",

  "victory.specs.engine.motorType": "Brushless DC Motor",
  "victory.specs.engine.motorPower": "3 kW",
  "victory.specs.engine.topSpeed": "80 km/jam",
  "victory.specs.engine.acceleration": "6.5 detik",
  "victory.specs.battery.batteryType": "Lithium-ion (LFP)",
  "victory.specs.battery.batteryCapacity":
    "2.5 kWh (Baterai Regular) / 3.4 kWh (Baterai Extended)",
  "victory.specs.battery.voltage": "76.8 Volt",
  "victory.specs.battery.chargingTimeSuperCharge": "15 menit",
  "victory.specs.battery.chargingTimeHome":
    "5 jam (Baterai Regular) / 7 jam (Baterai Extended)",
  "victory.specs.battery.range":
    "110 km (Baterai Regular) / 120 km (Baterai Extended)",
  "victory.specs.brake.frontBrake": "Rem Cakram",
  "victory.specs.brake.rearBrake": "Rem Cakram",
  "victory.specs.brake.cbsSupport": "Ya",
  "victory.specs.dimension.length": "1.950 mm",
  "victory.specs.dimension.width": "690 mm",
  "victory.specs.dimension.height": "1.130 mm",
  "victory.specs.dimension.wheelbase": "1.380 mm",
  "victory.specs.dimension.groundClearance": "140 mm",
  "victory.specs.dimension.seatHeight": "765 mm",
  "victory.specs.dimension.weight": "116.5 kg",
  "victory.specs.tire.frontTire": "90/90-14",
  "victory.specs.tire.rearTire": "100/80-14",
  "victory.specs.suspension.frontSuspension": "Hidrolik Teleskopik",
  "victory.specs.suspension.rearSuspension": "Hidrolik Teleskopik",

  //athena

  // "athena.hero.tag": "Motor Listrik Retro",
  // "athena.hero.title": "Desain Ikonik yang",
  // "athena.hero.titleHighlight": "Klasik & Modern",
  // "athena.hero.description":
  //   "Athena menghadirkan estetika retro klasik dengan performa modern. Perpaduan gaya abadi dan teknologi masa kini dalam satu kendaraan elektrik.",
  // "athena.hero.orderNow": "Pesan Sekarang",
  // "athena.hero.downloadBrochure": "Unduh Brosur",

  // "athena.feature1.tag": "Kenyamanan Berkendara",
  // "athena.feature1.title": "Nyaman Dikendarai, Elegan Dipandang",
  // "athena.feature1.subtitle": "Desain ergonomis, sensasi berkendara halus",
  // "athena.feature1.description":
  //   "Dengan posisi duduk ergonomis dan suspensi yang mendukung kenyamanan, Athena siap menemani perjalananmu dengan penuh gaya dan rasa rileks.",

  // "athena.feature2.tag": "Teknologi EV Modern",
  // "athena.feature2.title": "Gaya Retro, Tenaga Masa Kini",
  // "athena.feature2.subtitle": "Tampilan klasik, performa elektrik modern",
  // "athena.feature2.description":
  //   "Athena memadukan tampilan klasik dengan kekuatan motor listrik terkini. Pengalaman berkendara yang menyenangkan, efisien, dan ramah lingkungan.",

  // "athena.color.description":
  //   "Pilih warna Athena favoritmu dan lihat tampilannya.",

  "athena.productPage.hero.imageAlt": "Athena Pink dan Athena Kuning",
  "athena.productPage.hero.title": "ATHENA",
  "athena.productPage.hero.description": "Gaya Retro, Tenaga Masa Kini",
  "athena.productPage.hero.ctaPrimary": "Pesan Sekarang",
  "athena.productPage.hero.ctaSecondary": "Download Brosur",

  "athena.productPage.techSpecs1.title": 120,
  "athena.productPage.techSpecs1.unit": "km",
  "athena.productPage.techSpecs1.desc": (
    <>
      <p>Jarak Tempuh</p>
      <p className="text-xs text-gray-500">*dengan Baterai Extended</p>
    </>
  ),

  "athena.productPage.techSpecs2.title": 15,
  "athena.productPage.techSpecs2.unit": "menit",
  "athena.productPage.techSpecs2.desc":
    "Charge dari 10% ke 80% dengan SuperCharge",

  "athena.productPage.techSpecs3.title": 80,
  "athena.productPage.techSpecs3.unit": "km/jam",
  "athena.productPage.techSpecs3.desc": "Kecepatan Maksimum",

  "athena.productPage.productOverview.imageAlt": "Athena Hijau",
  "athena.productPage.productOverview.title": "Bentuk Klasik, Tenaga Listrik",
  "athena.productPage.productOverview.description":
    "Athena mengambil bentuk skuter Eropa klasik, lalu mengganti mesinnya dengan penggerak listrik. Hasilnya motor yang menarik perhatian tanpa berisik. Jarak tempuhnya sampai 120 km sekali isi, remnya cakram CBS di kedua roda, dan suspensinya hidrolik. Isi dayanya bisa cepat di showroom Wedison atau pelan-pelan di rumah.",

  "athena.productPage.productHighlight1.imageAlt": "Head unit Athena",
  "athena.productPage.productHighlight1.title": "Layar Digital Canggih",
  "athena.productPage.productHighlight1.description":
    "Panel LCD Athena terang dan mudah dibaca sekali lirik, bahkan saat siang. Informasinya secukupnya saja, jadi kamu tetap fokus ke jalan.",

  "athena.productPage.productHighlight2.imageAlt": "Athena SuperCharge",
  "athena.productPage.productHighlight2.title": "SuperCharge",
  "athena.productPage.productHighlight2.description":
    "Di SuperCharge, Athena terisi dari 10% ke 80% dalam 15 menit. Di rumah, pengisian penuh butuh sekitar 5 jam untuk baterai Regular dan 7 jam untuk Extended.",

  "athena.productPage.productHighlight3.imageAlt":
    "Sistem Pengereman CBS Athena",
  "athena.productPage.productHighlight3.title": "Dirancang untuk Perkotaan",
  "athena.productPage.productHighlight3.description":
    "Rem cakram CBS di kedua roda membagi daya pengereman secara otomatis, dan ban lebarnya menjaga motor tetap stabil saat harus berhenti mendadak.",

  "athena.productPage.chargingOverview.imageAlt":
    "Athena Hijau dengan SuperCharge dan Home Charging",
  "athena.productPage.chargingOverview.title": "Pengisian Daya Tanpa Ribet",
  "athena.productPage.chargingOverview.description":
    "Untuk harian, cukup colokkan Athena di rumah. Saat sedang di jalan dan butuh cepat, mampir ke SuperCharge di showroom Wedison.",

  "athena.productPage.chargingHighlight1.imageAlt": "Athena dengan SuperCharge",
  "athena.productPage.chargingHighlight1.title": "15-Menit dengan SuperCharge",
  "athena.productPage.chargingHighlight1.description": (
    <>
      SuperCharge mengisi baterai Athena dari 10% ke 80% dalam 15 menit, jadi
      kamu tidak perlu menunggu lama sebelum lanjut jalan.{" "}
      <Link href="/super-charge" className="underline text-primary">
        Pelajari Lebih Lanjut
      </Link>
    </>
  ),

  "athena.productPage.chargingHighlight2.imageAlt":
    "Athena dengan Home Charger",
  "athena.productPage.chargingHighlight2.title": "Isi Daya di Rumah",
  "athena.productPage.chargingHighlight2.description":
    "Colokkan semalaman atau kapan pun sempat. Charger rumah sudah termasuk, dan pengisiannya berjalan tanpa suara.",

  "athena.specs.engine.motorType": "Brushless DC Motor",
  "athena.specs.engine.motorPower": "2.5 kW",
  "athena.specs.engine.topSpeed": "80 km/jam",
  "athena.specs.engine.acceleration": "6.5 detik",
  "athena.specs.battery.batteryType": "Lithium-ion (LFP)",
  "athena.specs.battery.batteryCapacity":
    "2.5 kWh (Baterai Regular) / 3.4 kWh (Baterai Extended)",
  "athena.specs.battery.voltage": "76.8 Volt",
  "athena.specs.battery.chargingTimeSuperCharge": "15 menit",
  "athena.specs.battery.chargingTimeHome":
    "5 jam (Baterai Regular) / 7 jam (Baterai Extended)",
  "athena.specs.battery.range":
    "110 km (Baterai Regular) / 120 km (Baterai Extended)",
  "athena.specs.brake.frontBrake": "Rem Cakram",
  "athena.specs.brake.rearBrake": "Rem Cakram",
  "athena.specs.brake.cbsSupport": "Ya",
  "athena.specs.dimension.length": "1.850 mm",
  "athena.specs.dimension.width": "750 mm",
  "athena.specs.dimension.height": "1.155 mm",
  "athena.specs.dimension.wheelbase": "1.350 mm",
  "athena.specs.dimension.groundClearance": "160 mm",
  "athena.specs.dimension.seatHeight": "775 mm",
  "athena.specs.dimension.weight": "113.5 kg",
  "athena.specs.tire.frontTire": "100/80-12",
  "athena.specs.tire.rearTire": "100/80-12",
  "athena.specs.suspension.frontSuspension": "Hidrolik Teleskopik",
  "athena.specs.suspension.rearSuspension": "Hidrolik Teleskopik",

  //mini

  "bees.hero.tag": "Motor Entry-Level",
  "bees.hero.title": "Solusi Terjangkau untuk",
  "bees.hero.titleHighlight": "Mobilitas Harian",
  "bees.hero.description":
    "Model paling ringan dan paling murah dari Wedison. Cocok untuk pelajar, pekerja, atau siapa pun yang butuh kendaraan hemat.",
  "bees.hero.orderNow": "Pesan Sekarang",
  "bees.hero.downloadBrochure": "Unduh Brosur",

  "bees.feature1.tag": "Ukuran Ringkas, Lincah",
  "bees.feature1.title": "Desain Kompak, Manuver Maksimal",
  "bees.feature1.subtitle": "Ringan dan gesit untuk kota padat",
  "bees.feature1.description":
    "Bodinya mungil dan bobotnya cuma 78,5 kg, jadi Bees gampang diajak selap-selip di jalan padat dan gampang diparkir.",

  "bees.feature2.tag": "Terjangkau dan Praktis",
  "bees.feature2.title": "Harga Ekonomis, Bisa Disubsidi",
  "bees.feature2.subtitle": "Hemat biaya dan mudah diakses",
  "bees.feature2.description":
    "Bees termasuk motor yang memenuhi syarat subsidi pemerintah. Biaya hariannya ringan dan cukup diisi dari colokan rumah.",

  "bees.color.description": "Pilih warna Bees favoritmu dan lihat tampilannya.",

  // ===

  "bees.productPage.hero.imageAlt": "Bees Merah dan Bees Putih",
  "bees.productPage.hero.title": "BEES",
  "bees.productPage.hero.description":
    "Mobilitas Terjangkau untuk Setiap Perjalanan",
  "bees.productPage.hero.ctaPrimary": "Pesan Sekarang",
  "bees.productPage.hero.ctaSecondary": "Unduh Brosur",

  "bees.productPage.techSpecs1.title": 80,
  "bees.productPage.techSpecs1.unit": "km",
  "bees.productPage.techSpecs1.desc": "Jarak Tempuh",

  "bees.productPage.techSpecs2.title": "LED",
  "bees.productPage.techSpecs2.desc": "Tampilan Head Unit",

  "bees.productPage.techSpecs3.title": 55,
  "bees.productPage.techSpecs3.unit": "km/jam",
  "bees.productPage.techSpecs3.desc": "Kecepatan Maksimum",

  "bees.productPage.productOverview.imageAlt": "Bees Merah",
  "bees.productPage.productOverview.title": "Kecil di Jalan, Lega di Bagasi.",
  "bees.productPage.productOverview.description":
    "Ukurannya ringkas, tapi fiturnya tidak seadanya. Bagasi bawah joknya luas, layarnya LED digital, dan rem cakramnya ada di kedua roda. Cukup diisi dari colokan rumah.",

  "bees.productPage.productHighlight1.imageAlt": "Bagasi Bawah Jok Bees",
  "bees.productPage.productHighlight1.title": "Bagasi XL di Bawah Jok",
  "bees.productPage.productHighlight1.description":
    "Bagasi bawah jok Bees muat ransel, belanjaan, atau satu helm full-face. Lumayan lega untuk motor sekecil ini.",

  "bees.productPage.productHighlight2.imageAlt": "Tampilan LED Bees",
  "bees.productPage.productHighlight2.title": "Tampilan Digital LED",
  "bees.productPage.productHighlight2.description":
    "Kecepatan, sisa baterai, dan jarak tempuh tampil di layar LED yang tajam. Cukup sekali lirik untuk tahu semuanya.",

  "bees.productPage.productHighlight3.imageAlt": "Rem Cakram Bees",
  "bees.productPage.productHighlight3.title": "Rem Cakram Ganda yang Andal",
  "bees.productPage.productHighlight3.description":
    "Rem cakram di roda depan dan belakang membuat pengereman terasa halus dan gigitannya jelas, termasuk saat jalan basah.",

  "bees.productPage.chargingOverview.imageAlt":
    "Bees Merah sedang diisi daya di colokan rumah",
  "bees.productPage.chargingOverview.title": "Cukup Colokan Rumah",
  "bees.productPage.chargingOverview.description":
    "Bees diisi dari stopkontak biasa dan penuh dalam sekitar 4 jam. Charger-nya sudah termasuk, jadi tidak perlu perangkat tambahan.",

  // ===

  "bees.specs.engine.motorType": "Brushless DC Motor",
  "bees.specs.engine.motorPower": "1.2 kW",
  "bees.specs.engine.topSpeed": "55 km/jam",
  "bees.specs.engine.acceleration": "9.3 detik",
  "bees.specs.battery.batteryType": "Lithium-ion (LFP)",
  "bees.specs.battery.batteryCapacity": "1.6 kWh",
  "bees.specs.battery.voltage": "64 Volt",
  "bees.specs.battery.chargingTimeSuperCharge": "-",
  "bees.specs.battery.chargingTimeHome": "4.1 jam",
  "bees.specs.battery.range": "80 km",
  "bees.specs.brake.frontBrake": "Rem Cakram",
  "bees.specs.brake.rearBrake": "Rem Cakram",
  "bees.specs.brake.cbsSupport": "Tidak",
  "bees.specs.dimension.length": "1.790 mm",
  "bees.specs.dimension.width": "670 mm",
  "bees.specs.dimension.height": "1.110 mm",
  "bees.specs.dimension.wheelbase": "1.370 mm",
  "bees.specs.dimension.groundClearance": "130 mm",
  "bees.specs.dimension.seatHeight": "760 mm",
  "bees.specs.dimension.weight": "78.5 kg",
  "bees.specs.tire.frontTire": "90/90-10",
  "bees.specs.tire.rearTire": "90/90-10",
  "bees.specs.suspension.frontSuspension": "Hidrolik Teleskopik",
  "bees.specs.suspension.rearSuspension": "Hidrolik Teleskopik",

  //SuperCharge

  "supercharge.landing.title": "Perjalananmu",
  "supercharge.landing.description":
    "Jaringan pengisian cepat milik Wedison. Isi daya dari 10% ke 80% dalam 15 menit.",
  "supercharge.hero.tag": "Pengisian Cepat",
  "supercharge.hero.title": "Isi Daya dari 10% ke 80%",
  "supercharge.hero.titleHighlight": "Hanya 15 Menit",
  "supercharge.hero.description":
    "SuperCharge adalah jaringan pengisian cepat milik Wedison sendiri, kompatibel dengan Athena, Victory, dan EdPower.",
  "supercharge.hero.ctaPrimary": "Temukan Lokasi",
  "supercharge.hero.ctaSecondary": "Pelajari Teknologi",

  "supercharge.speed.kicker": "Kecepatan",
  "supercharge.speed.lead": "Isi daya dari 10% ke 80% cuma butuh",
  "supercharge.speed.unit": "menit",
  "supercharge.speed.caption":
    "Kira-kira selama antre kopi. Setelah itu, tinggal lanjut jalan.",

  "supercharge.network.kicker": "Jaringan SuperCharge",
  "supercharge.network.title": "Tumbuh di kota-kotamu",
  "supercharge.network.description":
    "Titik SuperCharge terus bertambah, dari Jakarta ke kota-kota lain di Indonesia.",
  "supercharge.network.stationsLabel": "Titik pengisian",
  "supercharge.network.citiesLabel": "Kota & terus bertambah",

  "supercharge.finalCta.title": "Siap merasakan SuperCharge?",
  "supercharge.finalCta.description":
    "Cari lokasi terdekat, jadwalkan test ride, atau tanya langsung ke tim kami.",
  "supercharge.finalCta.ctaPrimary": "Temukan Lokasi",
  "supercharge.finalCta.ctaSecondary": "Lihat Motor Listrik",

  "supercharge.locator.kicker": "Jaringan SuperCharge",
  "supercharge.locator.title": "Temukan Stasiun SuperCharge",
  "supercharge.locator.subtitle":
    "Cari titik SuperCharge terdekat, cek jumlah charger, jam buka, dan fasilitasnya, lalu langsung navigasi ke sana.",
  "supercharge.locator.searchPlaceholder": "Cari kota atau nama lokasi…",
  "supercharge.locator.nearMe": "Lokasi saya",
  "supercharge.locator.results": "lokasi",
  "supercharge.locator.listHeading": "Daftar Lokasi SuperCharge",
  "supercharge.locator.geoError":
    "Lokasimu tidak terdeteksi. Coba lagi, atau ketik nama kotamu di kolom pencarian.",
  "supercharge.locator.geoDenied":
    "Izin lokasi ditolak. Aktifkan akses lokasi di browser, atau ketik nama kotamu di kolom pencarian.",
  "supercharge.locator.charger": "Nozzle",
  "supercharge.locator.piles": "SuperCharge",
  "supercharge.locator.amenities": "Fasilitas",
  "supercharge.locator.close": "Tutup",
  "supercharge.locator.viewAll": "Lihat Semua Lokasi",
  "supercharge.locator.status.operational": "Beroperasi",
  "supercharge.locator.status.coming_soon": "Segera Hadir",
  "supercharge.locator.status.maintenance": "Perawatan",
  "supercharge.locator.status.closed": "Tutup",
  "supercharge.locator.tier.hub": "Hub",
  "supercharge.locator.tier.showroom": "Showroom",
  "supercharge.locator.tier.mitra": "Mitra",
  "supercharge.locator.filter.allTiers": "Semua Tipe",
  "supercharge.locator.filter.allStatus": "Semua Status",
  "supercharge.locator.filter.tierLabel": "Tipe lokasi",
  "supercharge.locator.filter.statusLabel": "Status",
  "supercharge.locator.amenity.toilet": "Toilet",
  "supercharge.locator.amenity.kafe": "Kafe",
  "supercharge.locator.amenity.musala": "Musala",
  "supercharge.locator.amenity.parkir": "Parkir",
  "supercharge.locator.amenity.wifi": "Wi-Fi",
  "supercharge.locator.amenity.minimarket": "Minimarket",
  "supercharge.locator.empty.title": "Tidak ada lokasi yang cocok",
  "supercharge.locator.empty.desc":
    "Coba ganti kata kunci atau longgarkan filternya.",

  "supercharge.video.title": "Begini Cara Kerja SuperCharge",
  "supercharge.video.description":
    "Dari colok sampai jalan lagi, lihat seperti apa proses pengisian di stasiun SuperCharge.",

  "supercharge.feature1.tag": "Cepat dan Andal",
  "supercharge.feature1.title": "Lima Belas Menit, Bukan Lima Jam",
  "supercharge.feature1.subtitle": "Waktu lebih singkat, baterai tetap awet",
  "supercharge.feature1.description":
    "SuperCharge mengisi baterai dari 10% ke 80% dalam 15 menit. Arusnya diatur otomatis supaya pengisian cepat tidak mengorbankan umur baterai.",

  "supercharge.feature2.tag": "Tersebar di Banyak Kota",
  "supercharge.feature2.title": "Jaringan yang Terus Bertambah",
  "supercharge.feature2.subtitle": "Cek titik terdekat sebelum berangkat",
  "supercharge.feature2.description":
    "Titik SuperCharge tersebar di showroom Wedison dan lokasi mitra, dan jumlahnya terus bertambah. Semua lokasinya bisa kamu lihat di peta.",

  "supercharge.feature3.tag": "Aman dan Bersertifikat",
  "supercharge.feature3.title": "Dibangun untuk Dipakai Bertahun-tahun",
  "supercharge.feature3.subtitle": "Keselamatan lebih dulu, baru kecepatan",
  "supercharge.feature3.description":
    "Stasiun DC kami dirancang khusus untuk motor listrik Wedison, sudah tersertifikasi standar keselamatan IEC, dan mengikuti Direktif Uni Eropa.",

  // SuperCharge App Section
  "supercharge.app.tag": "Aplikasi Mobile",
  "supercharge.app.teaser.title": "Cari. Isi Daya.",
  "supercharge.app.teaser.titleHighlight": "Jalan.",
  "supercharge.app.teaser.description":
    "Cari stasiun SuperCharge terdekat, mulai pengisian, dan pantau prosesnya langsung dari ponselmu.",
  "supercharge.app.teaser.feature.find": "Cari Stasiun",
  "supercharge.app.teaser.feature.realtime": "Pantau Sesi",
  "supercharge.app.teaser.feature.charge": "Isi Cepat",

  "supercharge.app.hero.title": "Semua Urusan Isi Daya,",
  "supercharge.app.hero.titleHighlight": "Dari Satu Aplikasi",
  "supercharge.app.hero.description":
    "Cari stasiun, mulai pengisian, pantau prosesnya, dan kelola paket isi dayamu. Semuanya dari satu aplikasi.",

  "supercharge.app.feature1.icon": "MapPin",
  "supercharge.app.feature1.title": "Temukan Stasiun Terdekat",
  "supercharge.app.feature1.subtitle": "Cari titik pengisian di sekitarmu",
  "supercharge.app.feature1.description":
    "Semua stasiun SuperCharge tampil di peta, lengkap dengan alamat, jam buka, dan jumlah charger-nya.",
  "supercharge.app.feature1.bullet1": "Peta interaktif dengan navigasi GPS",
  "supercharge.app.feature1.bullet2": "Urutkan berdasarkan jarak terdekat",
  "supercharge.app.feature1.bullet3": "Simpan stasiun favorit",

  "supercharge.app.feature2.icon": "Activity",
  "supercharge.app.feature2.title": "Pantau Pengisian dari Ponsel",
  "supercharge.app.feature2.subtitle": "Tidak perlu menunggu di dekat motor",
  "supercharge.app.feature2.description":
    "Lihat perkembangan pengisian dan sisa waktunya dari layar ponsel, sambil kamu mengerjakan hal lain.",
  "supercharge.app.feature2.bullet1": "Persentase baterai selama pengisian",
  "supercharge.app.feature2.bullet2": "Perkiraan sisa waktu",
  "supercharge.app.feature2.bullet3": "Notifikasi saat pengisian selesai",

  "supercharge.app.feature3.icon": "Zap",
  "supercharge.app.feature3.title": "Mulai dengan Satu Ketukan",
  "supercharge.app.feature3.subtitle": "Colok, ketuk, lalu tinggal",
  "supercharge.app.feature3.description":
    "Colokkan konektornya, mulai sesi dari aplikasi, dan pengisian langsung berjalan.",
  "supercharge.app.feature3.bullet1": "Mulai pengisian dengan satu ketukan",
  "supercharge.app.feature3.bullet2": "Bayar pakai paket isi daya",
  "supercharge.app.feature3.bullet3": "Riwayat sesi pengisian",

  "supercharge.app.stats.stations": "Stasiun",
  "supercharge.app.stats.downloads": "Unduhan",
  "supercharge.app.stats.rating": "Rating",
  "supercharge.app.stats.chargeTime": "Menit Isi Daya",

  "supercharge.app.cta.title": "Siap SuperCharge",
  "supercharge.app.cta.titleHighlight": "Perjalananmu?",
  "supercharge.app.cta.description":
    "Unduh aplikasinya, lalu cari stasiun terdekat sebelum berangkat.",

  // form title
  "form.title.placeholder": "Pilih topik yang ingin dibahas",

  "form.title.productInfo": "Informasi Produk Motor Listrik",
  "form.title.productInfo.value": "Informasi Produk Motor Listrik",

  "form.title.serviceMaintenance": "Servis & Perawatan Motor",
  "form.title.serviceMaintenance.value": "Servis & Perawatan Motor",

  "form.title.testRide": "Booking Uji Coba Motor",
  "form.title.testRide.value": "Test Ride / Uji Coba Motor",

  "form.title.paymentOptions": "Simulasi Kredit / Pembayaran",
  "form.title.paymentOptions.value": "Simulasi Kredit / Pembayaran",

  "form.title.warrantyClaim": "Klaim Garansi",
  "form.title.warrantyClaim.value": "Klaim Garansi",

  "form.title.feedback": "Saran & Masukan",
  "form.title.feedback.value": "Saran & Masukan",

  "form.title.technicalIssue": "Masalah Teknis / Kendala Penggunaan",
  "form.title.technicalIssue.value": "Masalah Teknis / Kendala Penggunaan",

  "form.title.partnership": "Kerja Sama atau Kemitraan",
  "form.title.partnership.value": "Kerja Sama atau Kemitraan",

  "form.title.other": "Lainnya (tuliskan di bawah)",
  "form.title.other.value": "Judul Lainnya: ",
  "form.hasMotor": "Apakah Anda sudah punya motor saat ini?",
  "form.vehicle": "Jenis Kendaraan Anda",
  "form.vehicle.placeholder": "Contoh: Wedison / EdPower / 2023",
  "form.vehicle.description": "Format: Merek / Model / Tahun",
  "form.sending.success.title": "Pesan Berhasil Dikirim",
  "form.sending.success.description":
    "Terima kasih. Tim kami akan segera menghubungi Anda.",
  "form.sending.error.title": "Pesan Gagal Terkirim",
  "form.sending.error.description":
    "Pesan Anda gagal dikirim. Silakan coba lagi nanti, atau hubungi kami lewat saluran lain.",
  "form.sending.sending": "Sedang mengirim pesan Anda, mohon tunggu sebentar.",
  "form.agreePrivacy.description": (
    <>
      Saya mengizinkan PT Wedison menggunakan data di atas dan menghubungi saya
      lewat email, telepon, atau sarana komunikasi lain untuk keperluan layanan
      pelanggan, sesuai dengan{" "}
      {/* <Link href="/" className="underline text-blue-400">
          persetujuan privasi.
        </Link> */}
      <AlertDialog>
        <AlertDialogTrigger className="underline text-blue-400 cursor-pointer font-semibold">
          Persetujuan Privasi
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Persetujuan Privasi</AlertDialogTitle>
            <AlertDialogDescription>
              Dengan mengirim formulir ini, Anda menyetujui Wedison mengumpulkan
              dan memakai data pribadi Anda semata-mata untuk menjawab
              pertanyaan Anda. Data Anda tidak akan dibagikan ke pihak ketiga
              tanpa persetujuan Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Saya Mengerti</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  ),

  // Media Center
  "mediaCenter.landing.h1": "Media Center",
  "mediaCenter.landing.news.title": "Berita",
  "mediaCenter.landing.instagram.title": "Instagram",
  "mediaCenter.landing.instagram.follow": "Ikuti kami di Instagram",

  // FAQ
  "faq.category.Battery": "Baterai",
  "faq.category.Charging": "Pengisian Daya",
  "faq.category.Performance": "Performa",
  "faq.category.Safety": "Keamanan",
  "faq.category.Servicing": "Layanan: Garansi, Perbaikan, dan Perawatan",
  "faq.category.SmartFeatures": "Fitur Pintar, Bluetooth, Aplikasi",
  "faq.category.Tires": "Ban",

  // Battery Questions
  "faq.Battery.questions.0.question": "Berapa lama garansi baterainya?",
  "faq.Battery.questions.0.answer": "Baterai Wedison bergaransi 3 tahun.",
  "faq.Battery.questions.1.question":
    "Berapa lama mengisi baterai sampai penuh?",
  "faq.Battery.questions.1.answer":
    "Wedison SuperCharge: 10% hingga 80% dalam 15 menit/ 10% hingga 95% dalam 20 menit\nWedison Regular Charge: Bervariasi tergantung adaptor dan ukuran baterai, dengan durasi antara 2 hingga 10 jam.",
  "faq.Battery.questions.2.question": "Baterai jenis apa yang dipakai Wedison?",
  "faq.Battery.questions.2.answer":
    "Wedison memakai baterai Lithium-ion (LFP), jenis yang sama seperti pada smartphone, laptop, dan mobil listrik.\n\nKeunggulannya:\nA. Padat energi: menyimpan banyak daya dalam paket yang kecil dan ringan.\nB. Tahan panas: tetap bekerja baik sampai suhu 45 derajat Celsius.\nC. Tidak cepat bocor daya: dayanya tetap tersimpan meski motor didiamkan berhari-hari.\nD. Awet: sanggup lebih dari 5.000 siklus pengisian dengan kapasitas yang masih hampir utuh.\nE. Cepat diisi: di stasiun SuperCharge, baterai terisi dari 10% ke 80% dalam 15 menit.",
  "faq.Battery.questions.3.question":
    "Ada berapa pilihan baterai yang dijual Wedison?",
  "faq.Battery.questions.3.answer":
    "Untuk model tertentu tersedia 2 pilihan baterai, Regular dan Extended.\nJarak tempuhnya berbeda tergantung model, mulai dari 80 km sampai 160 km sekali isi.",
  "faq.Battery.questions.4.question": "Baterainya buatan siapa?",
  "faq.Battery.questions.4.answer":
    "Baterai Wedison dikembangkan sendiri secara internal.",
  "faq.Battery.questions.5.question": "Berapa lama baterainya bisa bertahan?",
  "faq.Battery.questions.5.answer":
    "Dalam pemakaian normal, baterai Wedison dirancang untuk bertahan sampai 12 tahun.",
  "faq.Battery.questions.6.question":
    "Boleh pakai baterai atau charger merek lain?",
  "faq.Battery.questions.6.answer":
    "Tidak bisa. Motor listrik Wedison memakai jalur komunikasi CAN (Controller Area Network) untuk mengatur pengisian dan kerja komponennya, sedangkan baterai pihak ketiga tidak memakai sistem yang sama.",
  "faq.Battery.questions.7.question": "Baterainya bisa diganti?",
  "faq.Battery.questions.7.answer":
    "Bisa. Wedison menyediakan baterai dan suku cadang asli.",
  "faq.Battery.questions.8.question":
    "Bagaimana cara menjaga baterai tetap sehat?",
  "faq.Battery.questions.8.answer":
    "Usahakan mengisi daya sebelum baterai turun di bawah 20%. Kebiasaan ini membantu memperpanjang umur baterai.",
  "faq.Battery.questions.9.question":
    "Bagaimana cara memperpanjang umur baterai?",
  "faq.Battery.questions.9.answer":
    "Hindari memakai baterai sampai kosong 0% atau mengisinya terus sampai 100%.\nJaga di kisaran 20% sampai 80% supaya beban baterai lebih ringan.",
  "faq.Battery.questions.10.question": "Berapa rating IP baterainya?",
  "faq.Battery.questions.10.answer":
    "Baterai Wedison punya rating IP67.\nArtinya benar-benar kedap debu, dan tahan terendam air sedalam 1 meter selama 30 menit tanpa rusak.",
  "faq.Battery.questions.11.question":
    "Seberapa sering baterai perlu diisi kalau motor jarang dipakai?",
  "faq.Battery.questions.11.answer":
    "Kalau motor tidak dipakai lebih dari seminggu, tetap isi dayanya minimal sebulan sekali.",
  "faq.Battery.questions.12.question":
    "Apa yang harus dilakukan kalau motor lama tidak dipakai?",
  "faq.Battery.questions.12.answer":
    "Matikan MCB (pemutus arus), lalu tetap isi baterainya minimal sebulan sekali supaya kondisinya terjaga.",

  // Charging Questions
  "faq.Charging.questions.0.question": "Di mana saya bisa mengisi daya motor?",
  "faq.Charging.questions.0.answer":
    "SuperCharge\nDi stasiun SuperCharge Wedison, yang jumlahnya terus bertambah di berbagai kota.\nRegular Charge\nDi rumah, cukup dengan stopkontak dinding biasa.",
  "faq.Charging.questions.1.question": "Bagaimana cara mengisi dayanya?",
  "faq.Charging.questions.1.answer":
    "Setiap motor Wedison punya dua port pengisian, satu untuk charger rumah dan satu untuk SuperCharge.",
  "faq.Charging.questions.2.question":
    "Boleh pakai adaptor charger merek lain?",
  "faq.Charging.questions.2.answer":
    "Sebaiknya tidak. Pakai charger dan suku cadang resmi Wedison supaya kondisi baterai tetap terjaga.",
  "faq.Charging.questions.3.question": "Bisa mengisi daya di rumah?",
  "faq.Charging.questions.3.answer":
    "Bisa. Semua model Wedison punya port pengisian untuk charger rumah.",
  "faq.Charging.questions.4.question":
    "Apakah pengisian cepat merusak baterai?",
  "faq.Charging.questions.4.answer":
    "Tidak. Baterai Wedison memang dirancang untuk pengisian cepat, dan arusnya diatur otomatis supaya umur baterai tetap panjang.",
  "faq.Charging.questions.5.question": "Apakah pengisian cepat berbahaya?",
  "faq.Charging.questions.5.answer":
    "Tidak. Pengisian cepat Wedison tidak memperpendek umur baterai dan tidak menimbulkan risiko ledakan.",
  "faq.Charging.questions.6.question":
    "Bahaya tidak kalau baterai kelebihan isi?",
  "faq.Charging.questions.6.answer":
    "Baterai Wedison punya sistem manajemen bawaan.\nKalau suhu baterai naik terlalu tinggi saat pengisian, sistem akan memutus aliran daya secara otomatis.",
  "faq.Charging.questions.7.question":
    "Kenapa pengisian melambat saat baterai hampir penuh?",
  "faq.Charging.questions.7.answer":
    "Itu memang disengaja. Pengisian berjalan cepat sampai sekitar 95%, lalu melambat dan lebih terkontrol untuk melindungi baterai.\n\nJadi kamu tetap bisa jalan lebih cepat, sementara umur baterai ikut terjaga.",
  "faq.Charging.questions.8.question":
    "Berapa lama pengisian di rumah dengan charger 600W?",
  "faq.Charging.questions.8.answer":
    "Tergantung model dan kapasitas baterainya.\nDurasi pengisian 0 sampai 100% dengan adaptor 600W:\nLihat Data Pengisian Reguler",
  "faq.Charging.questions.9.question":
    "Berapa lama pengisian di rumah dengan charger 1260W?",
  "faq.Charging.questions.9.answer":
    "Tergantung model dan kapasitas baterainya.\nDurasi pengisian 0 sampai 100% dengan adaptor 1260W:\nBees: 3,5 jam (tidak berubah, Bees hanya bisa memakai charger 600W)\nLihat Data Pengisian Reguler",
  "faq.Charging.questions.10.question":
    "Bagaimana urutan mengisi daya di rumah?",
  "faq.Charging.questions.10.answer":
    "Sambungkan dulu charger ke port pengisian di motor, baru colokkan ke stopkontak.\nKalau sudah selesai, cabut dari stopkontak lebih dulu, baru lepas dari motor.",
  "faq.Charging.questions.11.question":
    "Apakah pengisian di SuperCharge gratis?",
  "faq.Charging.questions.11.answer":
    "Tidak gratis. Pengisian di SuperCharge memakai sistem paket yang bisa kamu beli lewat aplikasi Wedison.",

  // Performance Questions
  "faq.Performance.questions.0.question": "Berapa kecepatan maksimalnya?",
  "faq.Performance.questions.0.answer":
    "Tergantung model, kecepatan maksimalnya berkisar antara 55 km/jam sampai 95 km/jam.",
  "faq.Performance.questions.1.question": "Berapa besar daya motornya?",
  "faq.Performance.questions.1.answer":
    "Daya motor berbeda tiap model, mulai dari 1,2 kW sampai 5 kW.",
  "faq.Performance.questions.2.question": "Berapa jarak tempuhnya?",
  "faq.Performance.questions.2.answer":
    "Tergantung model dan pilihan baterainya, jarak tempuhnya berkisar antara 80 km sampai 160 km.",
  "faq.Performance.questions.3.question":
    "Aman tidak dipakai saat hujan atau melewati genangan?",
  "faq.Performance.questions.3.answer":
    "Motor, unit kontrol, dan baterai Wedison punya rating IP67 dan sudah lolos uji kedap air.\nMeski begitu, sebaiknya hindari menerjang genangan dalam atau membiarkan motor terendam lama.",
  "faq.Performance.questions.4.question": "Kuat menanjak?",
  "faq.Performance.questions.4.answer":
    "Kuat, dan kemampuannya berbeda tiap model:\nBees dan EdPower: tanjakan sampai 12%\nAthena dan Victory: tanjakan sampai 15%",
  "faq.Performance.questions.5.question":
    "Apakah kemampuan baterai menurun seiring waktu?",
  "faq.Performance.questions.5.answer":
    "Ya, seperti semua perangkat berbaterai lithium-ion. Kapasitasnya menurun sedikit demi sedikit setiap siklus pengisian.\nKecepatan penurunannya dipengaruhi jumlah siklus, usia baterai, dan suhu pemakaian.\n\nKarena itu setiap baterai Wedison ditanggung garansi 3 tahun.",

  // Safety Questions
  "faq.Safety.questions.0.question": "Apakah baterainya aman?",
  "faq.Safety.questions.0.answer":
    "Baterai Wedison punya sistem manajemen bawaan yang menjaga suhu dan arus pengisian,\nsehingga risiko panas berlebih, kelebihan isi, dan kebakaran bisa dicegah.",
  "faq.Safety.questions.1.question": "Sistem rem apa yang dipakai?",
  "faq.Safety.questions.1.answer":
    "CBS (Combined Braking System), yang membagi daya pengereman antara roda depan dan belakang secara otomatis saat kamu menarik tuas rem:\nAthena, Victory, dan EdPower\n\nRem cakram di roda depan dan belakang:\nBees",
  "faq.Safety.questions.2.question": "Motor penggeraknya jenis apa?",
  "faq.Safety.questions.2.answer":
    "Semua model Wedison memakai motor DC brushless (BLDC), yang dikenal efisien, bertorsi besar, dan berumur panjang.\n\nTipenya satu:\nDC Brushless Rear Hub Motor, dengan kecepatan sampai 95 km/jam (Bees, Athena, Victory, EdPower).",

  // Servicing Questions
  "faq.Servicing.questions.0.question": "Apakah ada servis gratis?",
  "faq.Servicing.questions.0.answer":
    "Ada. Setiap motor Wedison mendapat 3 kali servis gratis di bengkel Wedison atau bengkel resmi rekanan kami.\nJadwalnya mengikuti jarak tempuh: 1.000 km, 5.000 km, dan 10.000 km.",
  "faq.Servicing.questions.1.question":
    "Servis gratisnya di jarak tempuh berapa saja?",
  "faq.Servicing.questions.1.answer": "Di 1.000 km, 5.000 km, dan 10.000 km.",
  "faq.Servicing.questions.2.question": "Di mana motor saya bisa diservis?",
  "faq.Servicing.questions.2.answer":
    "Di bengkel resmi Wedison atau bengkel rekanan resmi Wedison terdekat.",
  "faq.Servicing.questions.3.question": "Apakah suku cadangnya tersedia?",
  "faq.Servicing.questions.3.answer":
    "Tersedia. Wedison menyediakan suku cadang asli untuk semua modelnya.",
  "faq.Servicing.questions.4.question": "Baterainya bergaransi?",
  "faq.Servicing.questions.4.answer": "Ya, baterai bergaransi 3 tahun.",
  "faq.Servicing.questions.5.question": "Motornya bergaransi?",
  "faq.Servicing.questions.5.answer": "Ya, motor bergaransi 2 tahun.",
  "faq.Servicing.questions.6.question":
    "Berapa biaya perbaikan motor, dinamo, dan komponen lain?",
  "faq.Servicing.questions.6.answer":
    "Biayanya berbeda-beda, tergantung komponen yang diganti dan seberapa parah kerusakannya.\n\nSilakan tanyakan langsung ke bengkel resmi terdekat untuk perkiraan biayanya.",
  "faq.Servicing.questions.7.question": "Bagaimana cara merawat motor Wedison?",
  "faq.Servicing.questions.7.answer":
    "Perawatan rutin dan cara pakai yang benar akan memperpanjang umur motor. Kamu tidak perlu mengisi daya setiap hari:\n- Isi daya seperlunya, dan usahakan baterai tetap di kisaran 20% sampai 80%.\n- Kalau motor jarang dipakai, tetap isi minimal sebulan sekali.\n- Isi daya di stasiun SuperCharge dan servis di bengkel resmi supaya kondisi baterai terjaga.",
  "faq.Servicing.questions.8.question": "Boleh dimodifikasi?",
  "faq.Servicing.questions.8.answer":
    "Garansi Wedison hanya berlaku untuk konfigurasi, desain, dan spesifikasi asli motor.\nKerusakan akibat penyalahgunaan, kelalaian, pemakaian di luar peruntukan, atau modifikasi tidak termasuk dalam garansi.",
  "faq.Servicing.questions.9.question": "Apa saja yang membatalkan garansi?",
  "faq.Servicing.questions.9.answer":
    "Kerusakan akibat pemakaian suku cadang tidak asli atau modifikasi tanpa persetujuan Wedison.\n\nKerusakan akibat kejadian di luar kendali juga tidak ditanggung, misalnya gempa bumi, angin topan, banjir, paparan zat kimia, atau korosi.",
  "faq.Servicing.questions.10.question": "Apa batasan garansinya?",
  "faq.Servicing.questions.10.answer":
    "Tidak ada komponen yang bergaransi seumur hidup.\nSuku cadang yang diganti dalam masa garansi hanya ditanggung sampai sisa periode garansi awal.\nUntuk suku cadang yang dibeli atau diganti di luar garansi, masa garansinya dihitung sejak tanggal pembelian atau penggantian.",

  // Smart Features Questions
  "faq.SmartFeatures.questions.0.question": "Fitur pintar apa saja yang ada?",
  "faq.SmartFeatures.questions.0.answer":
    "Lewat aplikasi Wedison, model tertentu bisa dinyalakan dan dimatikan dari ponsel melalui koneksi Bluetooth.\nFitur lainnya akan menyusul di pembaruan aplikasi berikutnya.",

  // Tires Questions
  "faq.Tires.questions.0.question": "Berapa ukuran bannya?",
  "faq.Tires.questions.0.answer":
    "Bees: Depan: 90/90-10; Belakang 90/90-10\nAthena: Depan: 100/80-12; Belakang 100/80-12\nVictory: Depan: 90/90-14; Belakang: 100/80-14\nEdPower: Depan: 100/90-14; Belakang: 120/70-14",

  // Ojol Page
  "ojol.hero.title": "Wedison Bersama",
  "ojol.hero.titleHighlight": "Ojol",
  "ojol.hero.description":
    "Motor listrik untuk driver ojol. Biaya operasional turun, dan tidak perlu antre BBM lagi.",
  "ojol.hero.startFrom": "Mulai dari",
  "ojol.hero.perDay": "/Hari",
  "ojol.hero.dailyRental": "SEWA HARIAN",
  "ojol.hero.tagline": "#JadiLebihMudah",
  "ojol.hero.tryFree": "Coba Gratis!",

  "ojol.benefits.title": "Narik Lebih Banyak, Keluar Ongkos Lebih Sedikit",
  "ojol.benefits.description":
    "Bosan antre BBM dan pusing lihat harga bensin naik terus? Pakai motor listrik, ongkos hariannya jauh lebih ringan, perawatannya lebih sedikit, dan waktu yang tadinya habis di SPBU bisa dipakai narik.",

  "ojol.campaign.heading": "Hot Campaign",
  "ojol.btn.register": "Daftar Sekarang",
  "ojol.btn.detail": "Lihat Detail",

  "ojol.campaign.milik.title": "Sewa Milik",
  "ojol.campaign.milik.tagline": "Cicil Sambil Narik, Akhirnya Jadi Milikmu",
  "ojol.campaign.milik.description":
    "Sewa selama 3,5 tahun (42 bulan) dengan opsi kepemilikan. Begitu kontrak selesai, motornya jadi milik kamu.",
  "ojol.campaign.milik.benefit.0":
    "1x Gratis charging adapter regular (senilai Rp 1.000.000)",
  "ojol.campaign.milik.benefit.1":
    "1x Gratis ganti ban depan & belakang (senilai Rp 385.000)",
  "ojol.campaign.milik.benefit.2":
    "1x Gratis ganti kampas rem (1 set depan & belakang)",
  "ojol.campaign.milik.benefit.3": "2x Kunci mekanik",
  "ojol.campaign.milik.benefit.4": "Garansi baterai 3 tahun",
  "ojol.campaign.milik.benefit.5": "Garansi motor 2 tahun",
  "ojol.campaign.milik.term.0":
    "Skema sewa milik berlaku selama 3 tahun 6 bulan (42 bulan)",
  "ojol.campaign.milik.term.1":
    "Rider berhak libur 1 hari per minggu (maksimal 48 hari per tahun)",
  "ojol.campaign.milik.term.2":
    "Setelah kontrak 42 bulan selesai, kepemilikan motor akan dialihkan ke rider",
  "ojol.campaign.milik.term.3":
    "Tabungan dipakai untuk biaya asuransi, servis, sparepart, dan BPKB. Sisanya ditransfer ke rider di akhir kontrak",
  "ojol.campaign.milik.term.4":
    "DP tidak dapat dikembalikan setelah dinyatakan eligible",
  "ojol.campaign.milik.term.5":
    "Denda tilang/pelanggaran lalu lintas ditanggung rider",
  "ojol.campaign.milik.term.6":
    "Rider wajib mengikuti proses screening dari Wedison",
  "ojol.campaign.milik.scheme.0.label": "Athena/Victory Regular",
  "ojol.campaign.milik.scheme.0.value": "Rp 55.000/hari",
  "ojol.campaign.milik.scheme.1.label": "Athena/Victory Extended",
  "ojol.campaign.milik.scheme.1.value": "Rp 60.000/hari",
  "ojol.campaign.milik.scheme.2.label": "EdPower Extended",
  "ojol.campaign.milik.scheme.2.value": "Rp 80.000/hari",
  "ojol.campaign.milik.scheme.3.label": "Deposit",
  "ojol.campaign.milik.scheme.3.value": "Rp 600.000 - Rp 800.000",

  "ojol.campaign.harian.title": "Sewa Harian",
  "ojol.campaign.harian.tagline": "Bayar Harian, Tanpa Beban Cicilan",
  "ojol.campaign.harian.description":
    "Sewa harian dengan kontrak 3 tahun. Cocok buat kamu yang mau langsung narik tanpa memikirkan cicilan.",
  "ojol.campaign.harian.benefit.0": "1x Gratis charging adapter regular",
  "ojol.campaign.harian.benefit.1":
    "1x Gratis ganti ban depan & belakang (senilai Rp 385.000)",
  "ojol.campaign.harian.benefit.2":
    "1x Gratis ganti kampas rem (1 set depan & belakang)",
  "ojol.campaign.harian.benefit.3": "1x Gratis servis berkala",
  "ojol.campaign.harian.benefit.4": "2x Kunci mekanik",
  "ojol.campaign.harian.benefit.5": "Garansi baterai 3 tahun",
  "ojol.campaign.harian.benefit.6": "Garansi motor 2 tahun",
  "ojol.campaign.harian.term.0":
    "Skema sewa harian berlaku selama 3 tahun (36 bulan)",
  "ojol.campaign.harian.term.1":
    "Rider berhak libur 1 hari per minggu (maksimal 48 hari per tahun)",
  "ojol.campaign.harian.term.2":
    "DP tidak dapat dikembalikan setelah dinyatakan eligible",
  "ojol.campaign.harian.term.3":
    "Motor sepenuhnya milik PT. Wedison Nusantara Energi",
  "ojol.campaign.harian.term.4":
    "Denda tilang/pelanggaran lalu lintas ditanggung rider",
  "ojol.campaign.harian.term.5":
    "Kerusakan akibat kelalaian atau kecelakaan ditanggung rider",
  "ojol.campaign.harian.term.6":
    "Rider wajib mengikuti proses screening dari Wedison",
  "ojol.campaign.harian.term.7": "Warna motor ditentukan secara acak",
  "ojol.campaign.harian.scheme.0.label": "Athena/Victory Regular",
  "ojol.campaign.harian.scheme.0.value": "Rp 50.000/hari",
  "ojol.campaign.harian.scheme.1.label": "Athena/Victory Extended",
  "ojol.campaign.harian.scheme.1.value": "Rp 55.000/hari",
  "ojol.campaign.harian.scheme.2.label": "EdPower Extended",
  "ojol.campaign.harian.scheme.2.value": "Rp 75.000/hari",
  "ojol.campaign.harian.scheme.3.label": "Deposit",
  "ojol.campaign.harian.scheme.3.value": "Rp 500.000 - Rp 750.000",

  "ojol.dialog.programBadge": "PROGRAM",
  "ojol.dialog.scheme": "Skema Pembayaran",
  "ojol.dialog.benefits": "Keuntungan",
  "ojol.dialog.terms": "Syarat & Ketentuan",
  "ojol.dialog.registerNow": "Daftar Program Ini Sekarang",

  "ojol.supercharge.badge": "10% - 80% dalam 15 menit",
  "ojol.supercharge.descriptionPart1":
    "Buat driver, waktu berhenti itu mahal. Di SuperCharge cukup ",
  "ojol.supercharge.descriptionBold": "15 menit",
  "ojol.supercharge.descriptionPart2":
    " untuk mengisi baterai dari 10% ke 80%, lalu langsung narik lagi. Sekali isi bisa menempuh sampai 160 km*, jadi lebih banyak waktu di jalan dan lebih banyak orderan.",
  "ojol.supercharge.disclaimer":
    "*Jarak tempuh 160 km berlaku untuk EdPower dengan baterai Extended",
  "ojol.supercharge.cta": "Pelajari Lebih Lanjut",

  "ojol.models.title": "Pilih Motor yang Cocok Buat Kamu",
  "ojol.models.subtitle":
    "Mau yang gesit buat gang sempit, atau yang kuat buat jarak jauh? Sesuaikan dengan wilayah dan gaya narik kamu.",
  "ojol.models.spec.range": "Jarak Tempuh",
  "ojol.models.spec.maxSpeed": "Kecepatan Max",
  "ojol.models.spec.battery": "Baterai",
  "ojol.models.spec.supercharge": "SuperCharge",
  "ojol.models.spec.motor": "Motor",
  "ojol.models.value.minutes": "15 menit",
  "ojol.models.bees.tagline": "Compact & Lincah",
  "ojol.models.bees.highlight": "Cocok buat gang sempit",
  "ojol.models.victory.tagline": "Stylish & Bertenaga",
  "ojol.models.victory.highlight": "Balance antara gaya & performa",
  "ojol.models.athena.tagline": "Premium & Nyaman",
  "ojol.models.athena.highlight": "Narik seharian tetap nyaman",
  "ojol.models.edpower.tagline": "Tangguh & Jarak Jauh",
  "ojol.models.edpower.highlight": "Raja jarak jauh",
  "ojol.models.cta": "Lihat Detail",
  "ojol.models.footnote": "*Jarak tempuh dengan baterai Extended",

  "ojol.cta.badge": "Program Khusus Driver",
  "ojol.cta.headline.1": "Siap Narik Lebih Cuan",
  "ojol.cta.headline.2": "Bareng Wedison?",
  "ojol.cta.description":
    "Sewa harian mulai 50 ribu, SuperCharge gratis, dan pilihan cicilan ringan. Daftar sekarang, tim kami bantu prosesnya.",
  "ojol.cta.benefit.1": "Sewa Harian Mulai 50K",
  "ojol.cta.benefit.2": "SuperCharge Gratis",
  "ojol.cta.benefit.3": "Cicilan Ringan",
  "ojol.cta.benefit.4": "Servis Prioritas",
  "ojol.cta.button": "Hubungi Sales Wedison",
  "ojol.cta.trust": "Dibalas cepat, konsultasi gratis",

  // Language
  language: "Bahasa Indonesia",
  switchLanguage: "English",
};
