// Kamus terjemahan (ID). Dipisah per-locale supaya HANYA locale aktif
// yang dibundel ke client (bukan kedua bahasa sekaligus). Dikonsumsi lewat provider per-locale.
import { LocaleLink } from "@/components/locale-link";
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
    "Motor listrik Wedison dengan jaringan pengisian cepat SuperCharge. Isi daya dari 10% ke 80% hanya dalam 15 menit.",

  // compare table
  "compare.model": "Bandingkan Model",
  "compare.select.bike": "Pilih model yang ingin dibandingkan",
  "compare.title": "Bandingkan Model Wedison",
  "compare.subtitle":
    "Sandingkan spesifikasinya berdampingan, dan lihat sendiri model mana yang paling cocok untuk kebutuhan Anda.",
  "compare.expandAll": "Buka Semua",
  "compare.collapseAll": "Tutup Semua",
  "compare.swipeHint": "Geser untuk melihat selengkapnya",
  "compare.page.kicker": "Bandingkan Model",
  "compare.page.addBike": "Tambah Model",
  "compare.page.remove": "Hapus",
  "compare.viewDetails": "Lihat Detail",
  "compare.help.title": "Masih ragu menentukan pilihan?",
  "compare.help.subtitle":
    "Ceritakan kebutuhan Anda. Tim kami akan membantu memilihkan model yang paling sesuai.",
  "compare.help.whatsapp": "Konsultasi via WhatsApp",
  "compare.help.showroom": "Kunjungi Showroom",

  // buttons
  "btn.learn.more": "Pelajari Lebih Lanjut",
  "btn.see.brochure": "Lihat Brosur",
  "btn.testRide.product": "Jadwalkan Test Ride",
  "btn.testRide.short": "Jadwalkan Test Ride",
  "btn.findShowroom": "Cari Showroom Terdekat",
  "product.brochure.title": "Brosur {model}",
  "product.brochure.desc":
    "Spesifikasi lengkap dan fitur unggulan dalam satu PDF, praktis untuk disimpan atau dibagikan.",
  "btn.order.now": "Pesan Sekarang",

  // user manual
  "user.manual.tag": "Dokumentasi",
  "user.manual.section.title": "Buku Panduan dan",
  "user.manual.section.titleHighlight": "Petunjuk Pemilik",
  "user.manual.section.description":
    "Cara mengoperasikan, mengisi daya, merawat, dan berkendara dengan aman. Semua terangkum dalam satu dokumen resmi.",
  "user.manual.faq.section.title": "Buku Panduan untuk",
  "user.manual.faq.section.titleHighlight": "Setiap Model",
  "user.manual.faq.section.description":
    "Pilih model Anda untuk membaca atau mengunduh panduan resminya.",
  "user.manual.btn.view": "Lihat Panduan",
  "user.manual.btn.download": "Unduh",
  "user.manual.card.bees.title": "Wedison Bees",
  "user.manual.card.bees.desc":
    "Panduan untuk komuter harian: pengoperasian, pengisian daya, dan perawatan rutin Bees.",
  "user.manual.card.athena.title": "Wedison Athena",
  "user.manual.card.athena.desc":
    "Panduan lengkap Athena: fitur pintar, pengisian daya, dan cara menjaga baterai tetap prima.",
  "user.manual.card.victory.title": "Wedison Victory",
  "user.manual.card.victory.desc":
    "Panduan lengkap Victory: mode berkendara, SuperCharge, dan jadwal servis berkala.",
  "user.manual.card.edpower.title": "Wedison EdPower",
  "user.manual.card.edpower.desc":
    "Panduan lengkap EdPower, dari perjalanan harian hingga perjalanan jarak jauh.",

  // footer support
  "footer.support": "Bantuan",
  "footer.userManual": "Buku Panduan",
  "footer.faq": "FAQ",

  // Navbar
  "nav.primary": "Navigasi utama",
  "nav.openMenu": "Buka menu",
  "nav.closeMenu": "Tutup menu",
  "nav.skipToContent": "Lewati ke konten",
  "nav.cta.testRide": "Test Ride",
  "nav.menu.models": "Produk",
  "nav.menu.services": "Layanan",
  "nav.menu.company": "Perusahaan",
  "nav.models.hint": "Empat model, satu jaringan pengisian yang sama.",
  "nav.models.compare": "Bandingkan semua model",
  "nav.models.all": "Lihat semua model",
  "nav.model.bees.tagline": "Ringkas dan lincah",
  "nav.model.athena.tagline": "Klasik dan nyaman",
  "nav.model.victory.tagline": "Sporty dan bertenaga",
  "nav.model.edpower.tagline": "Tangguh untuk jarak jauh",
  "nav.superCharge.network": "Jaringan SuperCharge",
  "nav.superCharge.network.description":
    "Isi daya dalam 15 menit di jaringan pengisian cepat yang dibangun dan dikelola langsung oleh Wedison.",
  "nav.superCharge.map": "Peta Lokasi",
  "nav.superCharge.map.description":
    "Temukan stasiun terdekat, lengkap dengan jam operasional dan fasilitas di sekitarnya.",
  "nav.feature.superCharge.alt":
    "Motor Wedison mengisi daya di stasiun SuperCharge pada malam hari",
  "nav.feature.superCharge.caption":
    "Stasiun SuperCharge kini hadir di Jabodetabek, Bandung, dan Bali.",
  "nav.feature.services.alt": "Meja resepsionis di Experience Center Wedison",
  "nav.feature.services.caption":
    "Semua yang Anda butuhkan, sebelum dan sesudah membawa pulang motor Wedison.",
  "nav.feature.company.alt": "Fasilitas Wedison dilihat dari udara",
  "nav.feature.company.caption":
    "Tentang perusahaan, orang-orang di baliknya, dan kabar terbaru kami.",
  "nav.products": "Produk",
  "nav.discover": "Jelajahi",
  "nav.discover.leftCard.title": "Jelajahi Wedison",
  "nav.discover.leftCard.description":
    "Kunjungi Experience Center, temukan jawaban di FAQ, atau ikuti kabar terbaru di Media Center.",
  "nav.experienceCenter.description":
    "Datang ke showroom Wedison dan rasakan sendiri pengisian daya 15 menit.",
  "nav.faq.description":
    "Jawaban untuk pertanyaan yang paling sering diajukan tentang produk dan layanan kami.",
  "nav.mediaCenter.description":
    "Berita, siaran pers, dan kabar terbaru dari Wedison.",
  "nav.ojol.description":
    "Program sewa motor listrik untuk mitra pengemudi ojek online. Mulai Rp50 ribu per hari.",
  "nav.showroom": "Showroom",
  "nav.serviceLocation": "Lokasi Layanan",
  "nav.superCharge": "SuperCharge",
  "nav.corporate": "Perusahaan",
  "nav.corporate.leftCard.title": "Powering the Future",
  "nav.corporate.leftCard.description":
    "Motor listrik yang terisi dalam 15 menit, didukung jaringan SuperCharge milik Wedison sendiri.",
  "nav.aboutUs": "Tentang Kami",
  "nav.aboutUs.description":
    "Siapa kami, apa yang kami bangun, dan ke mana kami melangkah.",
  "nav.careers": "Karier",
  "nav.careers.description":
    "Peluang berkarier bersama Wedison di industri kendaraan listrik Indonesia.",

  // Career Page
  "career.banner.title": "Bergabung dengan",
  "career.banner.titleHighlight": "Tim Wedison",
  "career.banner.description":
    "Mari membangun masa depan transportasi listrik Indonesia bersama-sama.",
  "career.banner.badge1": "Work-Life Balance",
  "career.banner.badge2": "Gaji Kompetitif",
  "career.banner.badge3": "Jenjang Karier",
  "career.section.title": "Posisi yang Tersedia",
  "career.section.description":
    "Temukan peran yang paling sesuai dengan keahlian dan minat Anda.",
  "career.card.viewDetails": "Lihat Detail",
  "career.card.previewText":
    "Klik untuk melihat detail posisi dan kualifikasinya",
  "career.detail.jobOverview": "Job Overview",
  "career.detail.keyResponsibilities": "Key Responsibilities",
  "career.detail.qualifications": "Qualifications & Requirements",
  "career.detail.applyButton": "Lamar Posisi Ini",
  "career.portal.title": "Pilih Platform Lamaran",
  "career.portal.description":
    "Pilih portal lowongan untuk melanjutkan lamaran Anda.",
  "career.portal.infoText":
    "Anda akan diarahkan ke situs pihak ketiga untuk melengkapi lamaran. Pastikan CV dan dokumen pendukung sudah siap.",
  "career.apply.emailTitle": "Lamar via Email",
  "career.apply.emailSubtitle": "Kirim lamaran Anda langsung ke hr@wedison.co",
  "career.apply.orViaPortal": "atau melalui portal lowongan",

  "nav.contactUs": "Hubungi Kami",
  "nav.contactUs.description":
    "Ada pertanyaan? Tim Wedison siap membantu Anda.",
  "nav.helpCenter": "Pusat Bantuan",

  // Hero
  "hero.tag": "Saatnya Beralih ke Listrik",
  "hero.title": "Berkendara Lebih Tenang,",
  "hero.titleHighlight": "Sepenuhnya Listrik",
  "hero.description":
    "Motor listrik Wedison hadir dengan tenaga yang responsif, pengisian daya secepat singgah minum kopi, dan tanpa emisi sama sekali.",
  "hero.exploreModels": "Lihat Semua Model",
  "hero.bookTestRide": "Jadwalkan Test Ride",

  // Features
  "features.tag": "Mengapa Wedison",
  "features.title": "Alasan Memilih",
  "features.titleHighlight": "Wedison",
  "features.description":
    "Empat model, satu jaringan pengisian cepat, dan biaya harian yang jauh lebih ringan dari motor bensin.",
  "features.longRangeBattery": "Jarak Tempuh hingga 200 km",
  "features.longRangeBatteryDesc":
    "Sekali pengisian cukup untuk beberapa hari perjalanan dalam kota, tergantung model dan pilihan baterai Anda.",
  "features.rapidCharging": "SuperCharge 15 Menit",
  "features.rapidChargingDesc":
    "Dari 10% ke 80% hanya dalam 15 menit di stasiun SuperCharge Wedison. Singgah sebentar, lalu lanjutkan perjalanan.",
  "features.impressivePerformance": "Torsi Penuh Sejak Detik Pertama",
  "features.impressivePerformanceDesc":
    "Motor listrik mengeluarkan torsi maksimal sejak putaran pertama. Tarikan awal terasa spontan dan halus.",
  "features.zeroEmissions": "Nol Emisi, Udara Lebih Bersih",
  "features.zeroEmissionsDesc":
    "Tanpa knalpot, tanpa asap. Semakin banyak yang beralih, semakin bersih udara di kota kita.",
  "features.zeroEmissionsLink":
    "https://www.sciencedirect.com/science/article/pii/S0967070X21003401",
  "features.healthBenefits": "Hemat Energi, Hemat Biaya",
  "features.healthBenefitsDesc":
    "Untuk jarak yang sama, Wedison membutuhkan energi jauh lebih sedikit dibanding motor bensin. Pengeluaran harian pun ikut turun.",
  "features.healthBenefitsLink":
    "https://www.sciencedirect.com/science/article/pii/S016041202031970X",
  "features.noiseFree": "Senyap di Setiap Perjalanan",
  "features.noiseFreeDesc":
    "Motor listrik nyaris tidak bersuara. Jalanan terasa lebih tenang, dan begitu pula perjalanan Anda.",
  "features.noiseFreeLink":
    "https://www.sciencedirect.com/science/article/pii/S0160412023003896",

  // Products
  "products.tag": "Jajaran Model",
  "products.title": "Motor Listrik",
  "products.titleHighlight": "Wedison",
  "products.description":
    "Empat model dengan karakter berbeda, dari komuter ringkas untuk jalanan kota hingga maxi-scooter untuk perjalanan jauh.",
  "products.learnMore": "Pelajari Lebih Lanjut",
  "products.orderNow": "Pesan Sekarang",
  "products.range": "Jarak Tempuh",
  "products.topSpeed": "Kecepatan Maksimum",
  "products.power": "Daya Motor",
  "products.miles": "km",
  "products.mph": "km/jam",

  // Testimonials
  "testimonials.tag": "Testimoni",
  "testimonials.title": "Cerita dari",
  "testimonials.titleHighlight": "Pengendara Wedison",
  "testimonials.description":
    "Pengalaman mereka yang sudah beralih ke motor listrik Wedison.",

  // Contact
  "contact.tag": "Hubungi Kami",
  "contact.sendMessage": "Kirim Pesan",
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
  "contact.subjectPlaceholder": "Apa yang bisa kami bantu?",
  "contact.message": "Pesan",
  "contact.messagePlaceholder": "Pesan Anda",
  "contact.send": "Kirim Pesan",
  "contact.headquarters": "Kantor Pusat",
  "contact.phone": "Telepon",
  "contact.emailLabel": "Email",
  "contact.emailResponse": "Kami balas secepatnya",
  "contact.followUs": "Ikuti Kami",

  // Footer
  "footer.description":
    "Motor listrik dan jaringan pengisian cepat, dirancang dan dikembangkan untuk jalanan Indonesia.",
  "footer.products": "Produk",
  "footer.experience": "Pengalaman",
  "footer.corporate": "Perusahaan",
  "footer.contact": "Hubungi Kami",
  "footer.about": "Tentang Kami",
  "footer.copyright": "© 2026 Wedison. Hak cipta dilindungi undang-undang.",
  "footer.tagline": "Dirancang untuk bertahan lama. Digerakkan oleh listrik.",
  "footer.privacy": "Privasi",
  "footer.terms": "Ketentuan",
  "footer.cookies": "Cookies",
  "footer.cookiePolicy": "Kebijakan Cookie",
  "footer.cookieSettings": "Pengaturan Cookie",
  "consent.title": "Situs ini menggunakan cookie",
  "consent.body":
    "Cookie yang wajib memastikan situs berjalan dengan baik. Dengan izin Anda, kami juga menggunakan cookie analitik untuk memahami cara situs digunakan, dan cookie pemasaran untuk mengukur efektivitas iklan. Pilihan ini bisa Anda ubah kapan saja.",
  "consent.policyLink": "Kebijakan Cookie",
  "consent.acceptAll": "Terima Semua",
  "consent.rejectAll": "Tolak Semua",
  "consent.customize": "Atur Preferensi",
  "consent.save": "Simpan Pilihan",
  "consent.alwaysOn": "Selalu aktif",
  "consent.prefs.title": "Preferensi Cookie",
  "consent.prefs.description":
    "Pilih kategori cookie yang Anda izinkan. Pilihan ini tersimpan di browser Anda selama 6 bulan.",
  "consent.cat.necessary.title": "Wajib",
  "consent.cat.necessary.desc":
    "Dibutuhkan agar situs berfungsi, misalnya untuk mengingat pilihan bahasa dan preferensi cookie ini. Tidak dapat dinonaktifkan.",
  "consent.cat.analytics.title": "Analitik",
  "consent.cat.analytics.desc":
    "Membantu kami memahami halaman mana yang paling sering dikunjungi dan bagaimana situs digunakan, dalam bentuk statistik anonim (Google Analytics melalui Google Tag Manager).",
  "consent.cat.marketing.title": "Pemasaran",
  "consent.cat.marketing.desc":
    "Digunakan untuk mengukur efektivitas iklan dan menampilkan iklan yang relevan di platform lain (Meta Pixel, Google Ads).",
  "footer.meetus": "Kunjungi Kami",
  "footer.career": "Karier",

  //showroom

  "showroom.tag": "Experience Center",
  "showroom.address":
    "Jl. Arteri Pondok Indah No 30 A-C, Kelurahan Kebayoran Lama Selatan, Kecamatan Kebayoran Lama, Jakarta Selatan, DKI Jakarta. 12240",
  "showroom.jakarta.name": "Wedison Jakarta",
  "showroom.jakarta.address":
    "Jl. Arteri Pondok Indah No 30 A-C, Kelurahan Kebayoran Lama Selatan, Kecamatan Kebayoran Lama, Jakarta Selatan, DKI Jakarta. 12240",
  "showroom.bandung.name": "Wedison Bandung",
  "showroom.bandung.address":
    "Jl. Raya Gadobangkong No.154, Gadobangkong, Kec. Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552",
  "showroom.bali.name": "Wedison Bali",
  "showroom.bekasi.name": "Wedison Bekasi",
  "showroom.bekasi.address":
    "Jl. HM. Joyo Martono, RT.003/RW.021, Margahayu, Kec. Bekasi Timur, Kota Bekasi, Jawa Barat 17113",
  "showroom.bali.address":
    "Jl. Gatot Subroto Tengah No.93, Dangin Puri Kaja, Kec. Denpasar Utara, Kota Denpasar, Bali 80118",
  "showroom.weekdays": "Senin - Jumat: 10.00 - 19.00",
  "showroom.weekend": "Sabtu - Minggu: 10.00 - 17.00",
  "showroom.testRide.title": "Test Ride",
  "showroom.testRide.description":
    "Coba langsung di sekitar showroom, didampingi tim kami. Gratis, dan Anda tidak perlu membawa KTP atau SIM.",
  "showroom.consultation.title": "Konsultasi Produk",
  "showroom.consultation.description":
    "Belum yakin model mana yang tepat? Ceritakan rutinitas harian Anda, dan tim kami akan membantu memilihkan yang paling sesuai.",
  "showroom.financing.title": "Simulasi Pembiayaan",
  "showroom.financing.description":
    "Hitung cicilan bersama tim kami dan temukan skema pembayaran yang paling sesuai dengan anggaran Anda.",
  "showroom.service.title": "Servis dan Purnajual",
  "showroom.service.description":
    "Servis resmi dengan suku cadang asli, ditangani teknisi yang memahami setiap detail motor listrik Wedison.",
  "showroom.bookVisit": "Jadwalkan Kunjungan",

  // showroom page (redesign 2026-10)
  "showroomPage.hero.imageAlt":
    "Pengunjung melihat jajaran motor listrik Wedison bersama tim showroom",
  "showroomPage.hero.title": "Kenali Wedison dari dekat.",
  "showroomPage.hero.desc":
    "Lihat setiap model secara langsung, coba di jalan bersama tim kami, lalu urus konsultasi, pembiayaan, hingga servis dalam satu kunjungan.",
  "showroomPage.hero.ctaPrimary": "Jadwalkan Test Ride",
  "showroomPage.hero.ctaSecondary": "Lihat Lokasi",
  "showroomPage.hero.fact1": "Test ride gratis",
  "showroomPage.hero.fact2": "Tanpa perlu KTP atau SIM",
  "showroomPage.hero.fact3": "Boleh langsung datang",
  "showroomPage.locations.title": "Pilih showroom terdekat",
  "showroomPage.locations.desc":
    "Setiap lokasi adalah showroom sekaligus pusat servis resmi, lengkap dengan SuperCharge. Pilih kartu untuk melihat lokasinya di peta.",
  "showroomPage.locations.countOpen": "{n} lokasi buka",
  "showroomPage.locations.countUpcoming": "{n} segera hadir",
  "showroomPage.locations.prev": "Showroom sebelumnya",
  "showroomPage.locations.next": "Showroom berikutnya",
  "showroomPage.locations.showAll": "Lihat semua",
  "showroomPage.locations.listLabel": "Daftar showroom di {country}",
  "showroomPage.card.showOnMap": "Tampilkan {name} di peta",
  "showroomPage.card.facilities": "Showroom · Servis · SuperCharge",
  "showroomPage.card.openUntil": "Buka · tutup {time}",
  "showroomPage.card.closedUntil": "Tutup · buka {time}",
  "showroomPage.card.weekdays": "Sen–Jum",
  "showroomPage.card.weekend": "Sab–Min",
  "showroomPage.card.directions": "Rute",
  "showroomPage.upcoming.label": "Segera hadir",
  "showroomPage.upcoming.desc":
    "Experience Center berikutnya sedang kami siapkan. Nantikan kabarnya.",
  "showroomPage.activities.title": "Satu kunjungan, semua beres.",
  "showroomPage.activities.desc":
    "Dari mencoba motor sampai merencanakan servis berkala, tim kami siap membantu di setiap lokasi.",
  "showroomPage.steps.title": "Begini alur kunjungan Anda",
  "showroomPage.steps.1.title": "Pilih jadwal",
  "showroomPage.steps.1.desc":
    "Booking lewat situs ini hanya butuh satu menit. Datang langsung juga boleh, tetapi dengan booking Anda tidak perlu menunggu giliran.",
  "showroomPage.steps.2.title": "Datang ke showroom",
  "showroomPage.steps.2.desc":
    "Tim kami membantu memilih model yang paling cocok untuk kebutuhan harian Anda. Tidak perlu membawa KTP atau SIM.",
  "showroomPage.steps.3.title": "Coba di jalan",
  "showroomPage.steps.3.desc":
    "Berkendara di sekitar showroom bersama tim Wedison, lalu kembali untuk berdiskusi lebih lanjut. Semuanya gratis.",
  "showroomPage.faq.title": "Sebelum Anda datang",
  "showroomPage.faq.desc":
    "Masih ada yang ingin ditanyakan? Tim kami siap membantu lewat WhatsApp.",
  "showroomPage.faq.whatsapp": "Tanya lewat WhatsApp",
  "showroomPage.faq.q1": "Apakah test ride dikenakan biaya?",
  "showroomPage.faq.a1": "Tidak. Test ride di semua showroom Wedison gratis.",
  "showroomPage.faq.q2": "Apakah saya perlu membawa KTP atau SIM?",
  "showroomPage.faq.a2":
    "Tidak perlu. Test ride dilakukan di sekitar showroom dan selalu didampingi tim Wedison.",
  "showroomPage.faq.q3": "Berapa lama test ride berlangsung?",
  "showroomPage.faq.a3":
    "Cukup singkat. Anda berkendara di sekitar showroom bersama tim kami, lalu kembali ke showroom untuk berdiskusi atau mencoba model lain.",
  "showroomPage.faq.q4": "Apakah harus booking terlebih dahulu?",
  "showroomPage.faq.a4":
    "Anda boleh datang langsung. Namun kami sarankan booking terlebih dahulu agar jadwal Anda tidak bersamaan dengan pengunjung lain.",
  "showroomPage.faq.q5": "Apakah saya bisa servis dan mengisi daya di showroom?",
  "showroomPage.faq.a5":
    "Bisa. Setiap showroom Wedison juga merupakan pusat servis resmi dan dilengkapi stasiun SuperCharge.",
  "showroomPage.faq.q6": "Kapan showroom buka?",
  "showroomPage.faq.a6":
    "Senin sampai Jumat pukul 10.00–19.00, Sabtu dan Minggu pukul 10.00–17.00, mengikuti waktu setempat.",
  "showroomPage.cta.title": "Kami tunggu kedatangan Anda.",
  "showroomPage.cta.desc":
    "Pilih showroom dan jadwal yang paling pas. Konfirmasinya kami kirim lewat WhatsApp.",

  // About Us Page
  "about.tag": "Tentang Kami",
  "about.overview.p1":
    "Wedison adalah perusahaan motor listrik pertama di Indonesia dengan teknologi pengisian cepat. Bagi kami, menjual motor saja tidak cukup. Kami juga membangun jaringan pengisian daya yang membuat motor listrik benar-benar praktis untuk dipakai setiap hari.",
  "about.overview.p2":
    "Motor dan stasiun pengisiannya kami rancang sebagai satu kesatuan, sehingga pengalaman memiliki motor listrik terasa utuh sejak hari pertama.",
  "about.mission.title": "Misi Kami",
  "about.mission.p1":
    "Membangun ekosistem kendaraan listrik yang lengkap, terjangkau, dan dapat diandalkan.",
  "about.mission.p2":
    "Menjadikan motor listrik pilihan yang masuk akal bagi keluarga di Indonesia dan Asia Tenggara.",
  "about.values.title": "Nilai yang Kami Pegang",
  "about.values.innovation.title": "Inovasi Kendaraan Listrik",
  "about.values.innovation.description":
    "Mengembangkan kendaraan listrik yang hemat energi dengan harga yang terjangkau bagi lebih banyak orang, bukan hanya segelintir.",
  "about.values.partnerships.title": "Kemitraan dan Kolaborasi",
  "about.values.partnerships.description":
    "Bekerja sama lintas industri untuk mempercepat pembangunan infrastruktur pengisian dan pengembangan baterai.",
  "about.values.experience.title": "Pengalaman Pemilik yang Utuh",
  "about.values.experience.description":
    "Menghadirkan motor yang mudah dikendarai siapa saja, dengan fitur yang benar-benar berguna dalam keseharian.",
  "about.projects.future.description":
    "Memanfaatkan energi terbarukan untuk menurunkan emisi karbon, sekaligus memperluas akses kendaraan listrik agar transportasi bersih semakin terjangkau.",
  "about.offers.motorcycles.title": "Jajaran Motor Listrik",
  "about.offers.motorcycles.description":
    "Beberapa model dengan karakter berbeda, dari komuter ringkas hingga maxi-scooter untuk perjalanan jauh.",
  "about.offers.charging.title": "Stasiun Pengisian SuperCharge",
  "about.offers.charging.description":
    "Stasiun pengisian cepat yang mengisi baterai dari 10% ke 80% dalam 15 menit. Waktu berhenti jadi jauh lebih singkat.",
  "about.joinUs": "Bergabung dalam Misi Kami",
  "about.joinUsDescription":
    "Kami sedang membangun transportasi listrik yang bisa diandalkan Indonesia untuk jangka panjang. Mari mewujudkannya bersama.",
  "about.contactUs": "Hubungi Kami",

  // about & contact page (redesign 2026-10)
  "aboutPage.hero.title": "Kami membuat motornya, sekaligus jaringan pengisiannya.",
  "aboutPage.hero.imageAlt": "Gedung kantor Wedison",
  "aboutPage.intro.imageAlt": "Tim Wedison di kantor",
  "aboutPage.values.imageAlt": "Pengendara bersama motor listrik Wedison",
  "aboutPage.eco.title": "Satu ekosistem, dari motor sampai stasiunnya",
  "aboutPage.eco.desc":
    "Setiap bagian kami rancang untuk saling melengkapi, supaya memiliki motor listrik terasa mudah setiap hari.",
  "aboutPage.eco.motorcycles.cta": "Lihat jajaran model",
  "aboutPage.eco.charging.cta": "Kenali SuperCharge",
  "aboutPage.eco.app.title": "Aplikasi Wedison",
  "aboutPage.eco.app.cta": "Tentang aplikasi",
  "aboutPage.eco.werigo.desc":
    "Layanan sewa motor listrik Wedison di Bali, diantar langsung ke tempat Anda menginap.",
  "aboutPage.eco.werigo.cta": "Kunjungi Werigo",
  "aboutPage.place.title": "Tempat kami bekerja",
  "aboutPage.place.desc":
    "Kantor pusat Wedison berada di Pondok Indah, Jakarta Selatan, satu gedung dengan showroom dan pusat servis kami. Silakan mampir.",
  "aboutPage.place.cta": "Lihat semua showroom",
  "aboutPage.place.imageMain": "Kantor pusat Wedison di Pondok Indah",
  "aboutPage.place.imageA": "Ruang kerja tim Wedison",
  "aboutPage.place.imageB": "Area tamu di kantor Wedison",
  "aboutPage.join.career": "Lihat Lowongan",
  "contactPage.hero.title": "Apa yang bisa kami bantu?",
  "contactPage.hero.desc":
    "Pilih kebutuhan Anda di bawah ini, supaya pertanyaan Anda langsung sampai ke tim yang tepat.",
  "contactPage.hero.imageAlt": "Meja layanan pelanggan di showroom Wedison",
  "contactPage.routes.label": "Pilih kebutuhan Anda",
  "contactPage.routes.testRide.title": "Test ride atau kunjungan showroom",
  "contactPage.routes.testRide.desc":
    "Jadwalkan kunjungan di showroom terdekat. Gratis, dan tidak perlu membawa KTP atau SIM.",
  "contactPage.routes.testRide.action": "Jadwalkan",
  "contactPage.routes.product.title": "Pertanyaan produk dan pembelian",
  "contactPage.routes.product.desc":
    "Tanyakan model, harga, atau pilihan pembiayaan langsung ke tim kami lewat WhatsApp.",
  "contactPage.routes.product.action": "Chat WhatsApp",
  "contactPage.routes.service.title": "Servis dan garansi",
  "contactPage.routes.service.desc":
    "Hubungi showroom terdekat. Setiap lokasi juga merupakan pusat servis resmi.",
  "contactPage.routes.service.action": "Pilih showroom",
  "contactPage.routes.partnership.title": "Kemitraan, korporat, dan media",
  "contactPage.routes.partnership.desc":
    "Ceritakan rencana kerja sama atau kebutuhan liputan Anda melalui formulir di bawah.",
  "contactPage.routes.partnership.action": "Isi formulir",
  "contactPage.routes.career.title": "Karier",
  "contactPage.routes.career.desc":
    "Lihat posisi yang sedang dibuka, atau kirim CV Anda ke {email}.",
  "contactPage.routes.career.action": "Lihat lowongan",
  "contactPage.direct.title": "Kontak langsung",
  "contactPage.direct.phone": "Telepon",
  "contactPage.direct.hours": "Jam layanan",
  "contactPage.branches.title": "Kontak per cabang",
  "contactPage.branches.desc":
    "Untuk servis, test ride, atau pertanyaan seputar cabang tertentu, hubungi cabangnya langsung.",
  "contactPage.branches.all": "Lihat halaman showroom",
  "contactPage.faq.all": "Lihat semua FAQ",

  // Contact Page
  "contact.page.business.hours": "Senin - Jumat: 09.00 - 18.00 WIB",
  "contact.page.faqTitle": "Pertanyaan yang Sering Diajukan",
  "contact.page.thankYou": "Terima Kasih",
  "contact.page.messageReceived":
    "Pesan Anda sudah kami terima. Tim kami akan segera menghubungi Anda kembali.",
  "contact.page.sendAnother": "Kirim Pesan Lain",
  "contact.page.sending": "Mengirim…",
  "contact.page.faq.q1": "Bagaimana cara mencoba test ride motor Wedison?",
  "contact.page.faq.a1":
    "Datang langsung ke showroom kami, atau buat janji lebih dulu melalui situs ini. Tim kami akan mendampingi Anda selama sesi test ride.",
  "contact.page.faq.q2": "Garansi apa yang saya dapatkan?",
  "contact.page.faq.a2":
    "Setiap motor Wedison dilindungi garansi 2 tahun untuk unit motor dan 3 tahun untuk baterai. Garansi ini mencakup cacat produksi.",
  "contact.page.faq.q3": "Berapa lama waktu pengisian dayanya?",
  "contact.page.faq.a3":
    "Di stasiun SuperCharge, sebagian besar model terisi dari 10% ke 80% dalam 15 menit. Dengan charger rumah, pengisian penuh membutuhkan sekitar 4 sampai 10 jam, tergantung model dan kapasitas baterainya.",
  "contact.page.faq.q4": "Apakah tersedia skema cicilan?",
  "contact.page.faq.a4":
    "Tersedia. Kami bekerja sama dengan beberapa mitra pembiayaan, dan tim kami akan membantu Anda memilih skema yang paling sesuai dengan anggaran.",

  //calculator
  "calculator.page.tag": "Kalkulator Penghematan",
  "calculator.page.title": "Hitung ",
  "calculator.page.titleHighlight": "Penghematan Anda",
  "calculator.page.description":
    "Geser slider di bawah ini. Bandingkan pengeluaran bulanan motor bensin dengan motor listrik Wedison, dan lihat selisihnya.",
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
  "calculator.page.distance": "Jarak Tempuh Harian Anda",
  "calculator.page.tnc1":
    "*Biaya perawatan mencakup servis rutin, tidak termasuk penggantian ban depan dan belakang.",
  "calculator.page.tnc2":
    "**Harga bahan bakar Pertalite mengacu pada harga per Desember 2024.",
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
  "edmax.hero.title": "Melaju ke Masa Depan bersama",
  "edmax.hero.titleHighlight": "EdPower",
  "edmax.hero.description":
    "Bertenaga, cepat diisi, dan sepenuhnya listrik. Dirancang untuk Anda yang sering menempuh perjalanan jauh.",
  "edmax.hero.orderNow": "Pesan Sekarang",
  "edmax.hero.downloadBrochure": "Unduh Brosur",

  "edmax.feature1.tag": "Smart Display",
  "edmax.feature1.title": "Layar Sentuh yang Terhubung dengan Ponsel Anda",
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
  "edmax.feature2.title": "Terisi dalam Hitungan Menit",
  "edmax.feature2.subtitle": "Teknologi Pengisian Super Cepat",
  "edmax.feature2.description":
    "Dari 10% ke 80% dalam 15 menit. Cukup waktu untuk secangkir kopi, lalu lanjutkan perjalanan.",
  "edmax.feature2.charge": "Pengisian 10-80%",
  "edmax.feature2.universal": "Universal",
  "edmax.feature2.chargingPort": "Port Pengisian",
  "edmax.feature2.smart": "Pintar",
  "edmax.feature2.chargingApp": "Aplikasi Pengisian",

  "edmax.feature3.title": "Dirancang untuk Mencuri Perhatian",
  "edmax.feature3.subtitle": "Tajam. Sporty. Ikonik.",
  "edmax.feature3.description":
    "Garis bodi yang tegas dan sudut yang tajam membuat EdPower mudah dikenali, bahkan dari kejauhan.",
  "edmax.feature3.aerodynamic": "Aerodinamis",
  "edmax.feature3.design": "Desain",
  "edmax.feature3.led": "LED",
  "edmax.feature3.lighting": "Pencahayaan",
  "edmax.feature3.premium": "Premium",
  "edmax.feature3.materials": "Material",

  "edmax.color.title": "Tentukan",
  "edmax.color.titleHighlight": "Gaya Anda",
  "edmax.color.description":
    "Pilih warna EdPower favorit Anda dan lihat tampilannya.",

  "edmax.specs.title": "Spesifikasi",
  "edmax.specs.description":
    "Spesifikasi teknis lengkap motor listrik EdPower.",
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

  "edpower.productPage.techSpecs1.title": 200,
  "edpower.productPage.techSpecs1.unit": "km",
  "edpower.productPage.techSpecs1.desc": "Jarak Tempuh",

  "edpower.productPage.techSpecs2.title": 15,
  "edpower.productPage.techSpecs2.unit": "menit",
  "edpower.productPage.techSpecs2.desc":
    "Isi daya 10% ke 80% dengan SuperCharge",

  "edpower.productPage.techSpecs3.title": 90,
  "edpower.productPage.techSpecs3.unit": "km/jam",
  "edpower.productPage.techSpecs3.desc": "Kecepatan Maksimum",

  "edpower.productPage.productOverview.imageAlt":
    "Tampilan samping dramatis EdPower, menonjolkan jok lebar, posisi berkendara kokoh, dan tampilan futuristik.",
  "edpower.productPage.productOverview.title":
    "Bertenaga, Lapang, dan Siap Menempuh Jarak Jauh",
  "edpower.productPage.productOverview.description":
    "EdPower adalah model terbesar di jajaran Wedison. Joknya lapang, posisi berkendaranya rileks, dan jarak tempuhnya mencapai 200 km dalam sekali pengisian. Layarnya terhubung dengan ponsel, bagasinya menampung dua helm, dan tenaganya tetap nyaman hingga ke luar kota.",

  "edpower.productPage.productHighlight1.imageAlt":
    "Tampilan kokpit menampilkan layar TFT besar dengan antarmuka Apple CarPlay & Android Auto",
  "edpower.productPage.productHighlight1.title":
    "Wireless Apple CarPlay & Android Auto",
  "edpower.productPage.productHighlight1.description":
    "Sambungkan ponsel Anda tanpa kabel lewat Apple CarPlay atau Android Auto. Navigasi, panggilan, dan musik langsung tampil di layar berwarna EdPower.",

  "edpower.productPage.productHighlight2.imageAlt":
    "Bagasi bawah jok terbuka menampilkan ruang ekstra besar",
  "edpower.productPage.productHighlight2.title": "Bagasi XXL di Bawah Jok",
  "edpower.productPage.productHighlight2.description":
    "Bagasi bawah jok EdPower menampung dua helm sekaligus, atau satu kantong belanja penuh. Tidak perlu tas tambahan.",

  "edpower.productPage.productHighlight3.imageAlt":
    "Tampilan belakang tiga perempat menonjolkan postur EdPower yang lebar dan jok ekstra luas",
  "edpower.productPage.productHighlight3.title":
    "Jok Lebar, Posisi Duduk Rileks",
  "edpower.productPage.productHighlight3.description":
    "Jok lebar yang empuk dan posisi duduk yang santai membuat perjalanan panjang tidak cepat melelahkan, bagi pengendara maupun penumpang.",

  "edpower.productPage.productHighlight4.imageAlt":
    "Tampilan depan menampilkan lampu LED canggih dan bodi modern",
  "edpower.productPage.productHighlight4.title":
    "Desain yang Langsung Dikenali",
  "edpower.productPage.productHighlight4.description":
    "Wajah depan yang tegas, lampu LED menyeluruh, dan lekuk bodi belakang yang rapi. EdPower tampil beda, bahkan saat terparkir.",

  "edpower.productPage.productHighlight5.imageAlt":
    "Indikator baterai/jarak tempuh pada dashboard, tampilan close-up",
  "edpower.productPage.productHighlight5.title": "Jarak Tempuh Terjauh: 200 km",
  "edpower.productPage.productHighlight5.description":
    "Dalam sekali pengisian, EdPower mampu menempuh hingga 200 km. Cukup untuk seminggu berkendara dalam kota, atau satu kali perjalanan ke luar kota.",

  "edpower.productPage.chargingOverview.imageAlt":
    "EdPower terparkir di showroom Wedison dengan stasiun SuperCharge dan charger rumah yang terlihat",
  "edpower.productPage.chargingOverview.title": "Dua Cara Mengisi Daya",
  "edpower.productPage.chargingOverview.description":
    "Sedang terburu-buru? Singgah di SuperCharge di showroom Wedison, 15 menit selesai. Punya waktu? Colokkan di rumah semalaman, dan baterai penuh keesokan paginya.",

  "edpower.productPage.chargingHighlight1.imageAlt":
    "EdPower terhubung ke stasiun SuperCharge Wedison",
  "edpower.productPage.chargingHighlight1.title": "Wedison SuperCharge",
  "edpower.productPage.chargingHighlight1.description": (
    <>
      Dari 10% ke 80% dalam 15 menit, cukup untuk singgah sejenak di sela
      aktivitas. Tersedia di seluruh showroom Wedison.{" "}
      <LocaleLink href="/super-charge" className="underline text-primary">
        Pelajari Lebih Lanjut
      </LocaleLink>
    </>
  ),

  "edpower.productPage.chargingHighlight2.imageAlt":
    "EdPower terhubung ke charger rumah di garasi modern yang bersih",
  "edpower.productPage.chargingHighlight2.title": "Isi Daya di Rumah",
  "edpower.productPage.chargingHighlight2.description":
    "Colokkan sebelum tidur, dan baterai sudah penuh saat Anda bangun. Cukup dengan stopkontak biasa di rumah.",

  "edpower.specs.engine.motorType": "Brushless DC Motor",
  "edpower.specs.engine.motorPower": "3 kW",
  "edpower.specs.engine.topSpeed": "90 km/jam",
  "edpower.specs.engine.acceleration": "7.9 detik",
  "edpower.specs.battery.batteryType": "Lithium-ion (LFP)",
  "edpower.specs.battery.batteryCapacity": "5 kWh",
  "edpower.specs.battery.voltage": "76.8 Volt",
  "edpower.specs.battery.chargingTimeSuperCharge": "15 menit",
  "edpower.specs.battery.chargingTimeHome": "10.2 jam",
  "edpower.specs.battery.range": "200 km",
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
    "Motor listrik untuk usaha pengiriman. Dudukan boks di belakang dan keranjang di depan membuatnya siap untuk logistik, kuliner, maupun kurir.",

  "dash.hero.tag": "Motor Pengiriman",
  "dash.hero.title": "Efisiensi Maksimal untuk",
  "dash.hero.titleHighlight": "Setiap Pengantaran",
  "dash.hero.description":
    "Motor listrik yang memang dibuat untuk bekerja. Tangguh dipakai seharian, hemat biaya operasional.",
  "dash.hero.orderNow": "Pesan Sekarang",
  "dash.hero.downloadBrochure": "Unduh Brosur",

  "dash.feature1.tag": "Siap Angkut Apa Saja",
  "dash.feature1.title": "Dirancang untuk Segala Jenis Pengiriman",
  "dash.feature1.subtitle": "Slot fleksibel untuk berbagai jenis boks",
  "dash.feature1.description":
    "Slot belakangnya bisa dipasangi coolbox, kontainer, atau boks lain sesuai jenis kiriman Anda. Terpasang kokoh dan tidak bergoyang di jalan.",

  "dash.feature2.tag": "Dibuat untuk Bekerja",
  "dash.feature2.title": "Satu Jok, Seribu Tujuan",
  "dash.feature2.subtitle": "Praktis, ringan, dan efisien",
  "dash.feature2.description":
    "Tanpa jok penumpang, Dash lebih ringan dan lebih hemat daya. Ideal untuk mengantar makanan, paket, dan logistik ringan.",

  "dash.color.title": "Tentukan",
  "dash.color.titleHighlight": "Warna Anda",
  "dash.color.description":
    "Pilih warna Dash favorit Anda dan lihat tampilannya.",

  "dash.specs.title": "Spesifikasi",
  "dash.specs.description": "Spesifikasi teknis lengkap motor listrik Dash.",
  "dash.specs.engine": "Mesin",
  "dash.specs.battery": "Baterai",
  "dash.specs.brake": "Rem",
  "dash.specs.dimension": "Dimensi",
  "dash.specs.tire": "Ban",
  "dash.specs.suspension": "Suspensi",

  //victory
  "victory.hero.tag": "Skuter Sporty",
  "victory.hero.title": "Taklukkan Jalanan dengan",
  "victory.hero.titleHighlight": "Gaya dan Performa",
  "victory.hero.description":
    "Skuter listrik bergaya sporty dengan bodi ramping. Lincah untuk keseharian di kota, dan selalu menarik untuk dipandang.",
  "victory.hero.orderNow": "Pesan Sekarang",
  "victory.hero.downloadBrochure": "Unduh Brosur",

  "victory.feature1.tag": "Nyaman di Kota",
  "victory.feature1.title": "Ukuran yang Pas untuk Perkotaan",
  "victory.feature1.subtitle": "Tidak terlalu kecil, tidak terlalu besar",
  "victory.feature1.description":
    "Ukurannya ideal untuk kota: cukup ramping untuk bermanuver di jalan sempit, tetapi tetap kokoh dan stabil saat dipacu.",

  "victory.feature2.tag": "Desain Sporty",
  "victory.feature2.title": "Tampil Tegas dan Modern",
  "victory.feature2.subtitle": "Terinspirasi skutik performa tinggi",
  "victory.feature2.description":
    "Garis desainnya mengambil karakter skuter sporty, untuk Anda yang ingin tampil beda tanpa mengorbankan efisiensi.",

  "victory.color.description":
    "Pilih warna Victory favorit Anda dan lihat tampilannya.",

  // ===

  "victory.productPage.hero.imageAlt": "Victory Abu-Abu",
  "victory.productPage.hero.title": "VICTORY",
  "victory.productPage.hero.description":
    "Sporty dan lincah untuk jalanan kota.",
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
    "Isi daya 10% ke 80% dengan SuperCharge",

  "victory.productPage.techSpecs3.title": 85,
  "victory.productPage.techSpecs3.unit": "km/jam",
  "victory.productPage.techSpecs3.desc": "Kecepatan Maksimum",

  "victory.productPage.productOverview.imageAlt": "Victory Abu-Abu",
  "victory.productPage.productOverview.title":
    "Sporty di Tampilan, Lincah di Jalanan",
  "victory.productPage.productOverview.description":
    "Victory dibuat untuk jalanan kota. Wheelbase yang panjang membuatnya stabil, rem cakram CBS di kedua roda membuat pengereman lebih terkendali, dan jarak tempuhnya mencapai 120 km dalam sekali pengisian. Saat baterai menipis, SuperCharge mengisinya kembali dalam 15 menit.",

  "victory.productPage.productHighlight1.imageAlt": "Tampilan Depan Victory",
  "victory.productPage.productHighlight1.title": "Desain Sporty yang Ikonik",
  "victory.productPage.productHighlight1.description":
    "Bodi aerodinamis dengan garis tegas dan lampu LED bersudut tajam. Victory mudah dikenali, bahkan di antrean lampu merah.",

  "victory.productPage.productHighlight2.imageAlt":
    "Tampilan tiga perempat depan menunjukkan ban lebar dan suspensi",
  "victory.productPage.productHighlight2.title":
    "Stabil di Berbagai Kondisi Jalan",
  "victory.productPage.productHighlight2.description":
    "Ban lebar dengan cengkeraman kuat dan suspensi hidrolik menjaga Victory tetap mantap, di aspal mulus maupun jalan berlubang.",

  "victory.productPage.productHighlight3.imageAlt":
    "Tampilan dekat port SuperCharge dengan branding Wedison",
  "victory.productPage.productHighlight3.title": "Siap SuperCharge",
  "victory.productPage.productHighlight3.description":
    "Isi daya dari 10% ke 80% dalam 15 menit di SuperCharge, atau colokkan di rumah saat Anda tidak sedang terburu-buru.",

  "victory.productPage.chargingOverview.imageAlt":
    "Victory terparkir di showroom Wedison, dengan stasiun SuperCharge di latar",
  "victory.productPage.chargingOverview.title": "Isi Daya Sesuai Ritme Anda",
  "victory.productPage.chargingOverview.description":
    "Singgah di SuperCharge di showroom Wedison saat waktu terbatas, atau isi perlahan di rumah pada malam hari. Keduanya sama mudahnya.",

  "victory.productPage.chargingHighlight1.imageAlt":
    "Victory di stasiun SuperCharge Wedison, kabel terhubung",
  "victory.productPage.chargingHighlight1.title": "SuperCharge, Secepat Itu",
  "victory.productPage.chargingHighlight1.description": (
    <>
      Dari 10% ke 80% dalam 15 menit, pas untuk jeda singkat di tengah hari yang
      padat. Tersedia di seluruh showroom Wedison.{" "}
      <LocaleLink href="/super-charge" className="underline text-primary">
        Pelajari Lebih Lanjut
      </LocaleLink>
    </>
  ),

  "victory.productPage.chargingHighlight2.imageAlt":
    "Victory terhubung ke charger rumah di garasi modern",
  "victory.productPage.chargingHighlight2.title": "Isi Daya Harian di Rumah",
  "victory.productPage.chargingHighlight2.description":
    "Colokkan di malam hari, dan baterai sudah penuh keesokan paginya. Charger rumah sudah termasuk dalam paket pembelian.",

  "victory.specs.engine.motorType": "Brushless DC Motor",
  "victory.specs.engine.motorPower": "3 kW",
  "victory.specs.engine.topSpeed": "85 km/jam",
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
  "athena.productPage.hero.description": "Gaya Klasik, Tenaga Masa Kini",
  "athena.productPage.hero.ctaPrimary": "Pesan Sekarang",
  "athena.productPage.hero.ctaSecondary": "Unduh Brosur",

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
    "Isi daya 10% ke 80% dengan SuperCharge",

  "athena.productPage.techSpecs3.title": 85,
  "athena.productPage.techSpecs3.unit": "km/jam",
  "athena.productPage.techSpecs3.desc": "Kecepatan Maksimum",

  "athena.productPage.productOverview.imageAlt": "Athena Hijau",
  "athena.productPage.productOverview.title":
    "Bentuk Klasik, Bertenaga Listrik",
  "athena.productPage.productOverview.description":
    "Athena mengambil siluet skuter Eropa klasik dan menggantikan mesinnya dengan penggerak listrik. Hasilnya, motor yang menarik perhatian tanpa suara bising. Jarak tempuhnya hingga 120 km dalam sekali pengisian, dengan rem cakram CBS di kedua roda dan suspensi hidrolik. Isi daya cepat di showroom Wedison, atau perlahan di rumah.",

  "athena.productPage.productHighlight1.imageAlt": "Head unit Athena",
  "athena.productPage.productHighlight1.title": "Layar Digital yang Jernih",
  "athena.productPage.productHighlight1.description":
    "Panel LCD Athena terang dan mudah dibaca sekilas, bahkan di bawah terik siang. Informasinya secukupnya, sehingga fokus Anda tetap ke jalan.",

  "athena.productPage.productHighlight2.imageAlt": "Athena SuperCharge",
  "athena.productPage.productHighlight2.title": "SuperCharge",
  "athena.productPage.productHighlight2.description":
    "Di stasiun SuperCharge, Athena terisi dari 10% ke 80% dalam 15 menit. Di rumah, pengisian penuh membutuhkan sekitar 5 jam untuk baterai Regular dan 7 jam untuk Extended.",

  "athena.productPage.productHighlight3.imageAlt":
    "Sistem Pengereman CBS Athena",
  "athena.productPage.productHighlight3.title": "Dirancang untuk Jalanan Kota",
  "athena.productPage.productHighlight3.description":
    "Rem cakram CBS di kedua roda membagi daya pengereman secara otomatis, sementara ban lebarnya menjaga motor tetap stabil saat harus berhenti mendadak.",

  "athena.productPage.chargingOverview.imageAlt":
    "Athena Hijau dengan SuperCharge dan Home Charging",
  "athena.productPage.chargingOverview.title": "Pengisian Daya Tanpa Repot",
  "athena.productPage.chargingOverview.description":
    "Untuk keseharian, cukup colokkan Athena di rumah. Saat di perjalanan dan butuh cepat, singgah di SuperCharge di showroom Wedison.",

  "athena.productPage.chargingHighlight1.imageAlt": "Athena dengan SuperCharge",
  "athena.productPage.chargingHighlight1.title": "15 Menit dengan SuperCharge",
  "athena.productPage.chargingHighlight1.description": (
    <>
      SuperCharge mengisi baterai Athena dari 10% ke 80% dalam 15 menit. Tidak
      perlu menunggu lama untuk kembali melaju.{" "}
      <LocaleLink href="/super-charge" className="underline text-primary">
        Pelajari Lebih Lanjut
      </LocaleLink>
    </>
  ),

  "athena.productPage.chargingHighlight2.imageAlt":
    "Athena dengan Home Charger",
  "athena.productPage.chargingHighlight2.title": "Isi Daya di Rumah",
  "athena.productPage.chargingHighlight2.description":
    "Colokkan semalaman, atau kapan pun Anda sempat. Charger rumah sudah termasuk, dan pengisiannya berlangsung nyaris tanpa suara.",

  "athena.specs.engine.motorType": "Brushless DC Motor",
  "athena.specs.engine.motorPower": "2.5 kW",
  "athena.specs.engine.topSpeed": "85 km/jam",
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

  "bees.hero.tag": "Model Entry-Level",
  "bees.hero.title": "Pilihan Terjangkau untuk",
  "bees.hero.titleHighlight": "Mobilitas Harian",
  "bees.hero.description":
    "Model paling ringan dan paling terjangkau dari Wedison. Cocok untuk pelajar, pekerja, dan siapa pun yang mencari kendaraan harian yang hemat.",
  "bees.hero.orderNow": "Pesan Sekarang",
  "bees.hero.downloadBrochure": "Unduh Brosur",

  "bees.feature1.tag": "Ringkas dan Lincah",
  "bees.feature1.title": "Bodi Kompak, Manuver Maksimal",
  "bees.feature1.subtitle": "Ringan dan gesit untuk kota yang padat",
  "bees.feature1.description":
    "Dengan bobot hanya 78,5 kg dan bodi yang ringkas, Bees mudah bermanuver di jalan padat dan tidak merepotkan saat parkir.",

  "bees.feature2.tag": "Terjangkau dan Praktis",
  "bees.feature2.title": "Harga Ekonomis, Memenuhi Syarat Subsidi",
  "bees.feature2.subtitle": "Hemat biaya, mudah dimiliki",
  "bees.feature2.description":
    "Bees termasuk dalam program subsidi motor listrik pemerintah. Biaya hariannya ringan, dan cukup diisi dari stopkontak rumah.",

  "bees.color.description":
    "Pilih warna Bees favorit Anda dan lihat tampilannya.",

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

  "bees.productPage.techSpecs3.title": 60,
  "bees.productPage.techSpecs3.unit": "km/jam",
  "bees.productPage.techSpecs3.desc": "Kecepatan Maksimum",

  "bees.productPage.productOverview.imageAlt": "Bees Merah",
  "bees.productPage.productOverview.title": "Ringkas di Jalan, Lega di Bagasi",
  "bees.productPage.productOverview.description":
    "Ukurannya kompak, tetapi fiturnya tidak setengah-setengah. Bagasi bawah joknya luas, panel instrumennya LED digital, dan rem cakramnya ada di kedua roda. Isi dayanya cukup dari stopkontak rumah.",

  "bees.productPage.productHighlight1.imageAlt": "Bagasi Bawah Jok Bees",
  "bees.productPage.productHighlight1.title": "Bagasi XL di Bawah Jok",
  "bees.productPage.productHighlight1.description":
    "Bagasi bawah jok Bees menampung ransel, belanjaan, atau satu helm full-face. Cukup lega untuk motor seringkas ini.",

  "bees.productPage.productHighlight2.imageAlt": "Tampilan LED Bees",
  "bees.productPage.productHighlight2.title": "Panel Instrumen LED",
  "bees.productPage.productHighlight2.description":
    "Kecepatan, sisa baterai, dan jarak tempuh tampil jelas di layar LED. Sekali lirik, semua informasi terbaca.",

  "bees.productPage.productHighlight3.imageAlt": "Rem Cakram Bees",
  "bees.productPage.productHighlight3.title": "Rem Cakram Ganda yang Andal",
  "bees.productPage.productHighlight3.description":
    "Rem cakram di roda depan dan belakang memberikan pengereman yang halus dan responsif, termasuk saat jalan basah.",

  "bees.productPage.chargingOverview.imageAlt":
    "Bees Merah sedang diisi daya di colokan rumah",
  "bees.productPage.chargingOverview.title": "Cukup dari Stopkontak Rumah",
  "bees.productPage.chargingOverview.description":
    "Bees diisi dari stopkontak biasa dan penuh dalam sekitar 4 jam. Charger sudah termasuk, tanpa perlu perangkat tambahan.",

  // ===

  "bees.specs.engine.motorType": "Brushless DC Motor",
  "bees.specs.engine.motorPower": "1.2 kW",
  "bees.specs.engine.topSpeed": "60 km/jam",
  "bees.specs.engine.acceleration": "19.3 detik",
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
  "bees.specs.dimension.groundClearance": "160 mm",
  "bees.specs.dimension.seatHeight": "765 mm",
  "bees.specs.dimension.weight": "78.5 kg",
  "bees.specs.tire.frontTire": "90/90-10",
  "bees.specs.tire.rearTire": "90/90-10",
  "bees.specs.suspension.frontSuspension": "Hidrolik Teleskopik",
  "bees.specs.suspension.rearSuspension": "Hidrolik Teleskopik",

  //SuperCharge

  "supercharge.landing.title": "Perjalanan Anda",
  "supercharge.landing.description":
    "Jaringan pengisian cepat milik Wedison. Dari 10% ke 80% hanya dalam 15 menit.",
  "supercharge.hero.tag": "Pengisian Cepat",
  "supercharge.hero.title": "Dari 10% ke 80%",
  "supercharge.hero.titleHighlight": "dalam 15 Menit",
  "supercharge.hero.description":
    "SuperCharge adalah jaringan pengisian cepat yang dibangun Wedison sendiri, kompatibel dengan Athena, Victory, dan EdPower.",
  "supercharge.hero.ctaPrimary": "Temukan Lokasi",
  "supercharge.hero.ctaSecondary": "Lihat Cara Kerjanya",
  "supercharge.hero.imageAlt":
    "Motor listrik Wedison sedang mengisi daya di stasiun SuperCharge",
  "supercharge.how.compare.super": "SuperCharge",
  "supercharge.how.compare.superValue": "15 menit",
  "supercharge.how.compare.home": "Isi daya di rumah",
  "supercharge.how.compare.homeValue": "±5 jam",
  "supercharge.how.compare.note":
    "Isi daya di rumah: Athena dan Victory dengan baterai Regular. SuperCharge kompatibel dengan Athena, Victory, dan EdPower.",
  "supercharge.how.step1.title": "Colokkan konektor",
  "supercharge.how.step1.desc":
    "Parkir di stasiun SuperCharge, lalu sambungkan konektor ke motor Anda.",
  "supercharge.how.step2.title": "Mulai dari aplikasi",
  "supercharge.how.step2.desc":
    "Ketuk mulai di aplikasi Wedison. Pengisian memakai paket isi daya Anda.",
  "supercharge.how.step3.title": "Siap melaju lagi",
  "supercharge.how.step3.desc":
    "Sekitar 15 menit kemudian baterai sudah di 80%. Aplikasi memberi tahu saat pengisian selesai.",
  "supercharge.network.upcomingLabel": "Segera hadir",
  "supercharge.safety.imageAlt": "Modul pengisian daya di dalam stasiun Wedison SuperCharge",
  "supercharge.safety.fact1.title": "Tersertifikasi IEC",
  "supercharge.safety.fact1.desc":
    "Stasiun DC kami memenuhi standar keselamatan internasional IEC.",
  "supercharge.safety.fact2.title": "Mengikuti Direktif Uni Eropa",
  "supercharge.safety.fact2.desc":
    "Dirancang sesuai ketentuan keselamatan perangkat listrik Uni Eropa.",
  "supercharge.safety.fact3.title": "Khusus motor Wedison",
  "supercharge.safety.fact3.desc": "Dibuat untuk sistem baterai Athena, Victory, dan EdPower.",
  "supercharge.safety.fact4.title": "Menjaga umur baterai",
  "supercharge.safety.fact4.desc":
    "Arus pengisian diatur otomatis, sehingga kecepatan tidak mengorbankan umur baterai.",
  "supercharge.app.screenAlt": "Tampilan fitur {feature} di aplikasi Wedison",


  "supercharge.network.title": "Semakin dekat dengan Anda",
  "supercharge.network.stationsLabel": "Titik pengisian",
  "supercharge.network.citiesLabel": "Kota, dan terus bertambah",

  "supercharge.finalCta.title": "Siap merasakan SuperCharge?",
  "supercharge.finalCta.description":
    "Temukan lokasi terdekat, jadwalkan test ride, atau langsung bertanya kepada tim kami.",
  "supercharge.finalCta.ctaPrimary": "Temukan Lokasi",
  "supercharge.finalCta.ctaSecondary": "Lihat Jajaran Motor",

  "supercharge.locator.kicker": "Jaringan SuperCharge",
  "supercharge.locator.title": "Temukan Stasiun SuperCharge",
  "supercharge.locator.subtitle":
    "Cari stasiun terdekat, cek jumlah charger, jam operasional, dan fasilitasnya, lalu langsung navigasi ke sana.",
  "supercharge.locator.searchPlaceholder": "Cari kota atau nama lokasi…",
  "supercharge.locator.nearMe": "Di sekitar saya",
  "supercharge.locator.results": "lokasi",
  "supercharge.locator.listHeading": "Daftar Lokasi SuperCharge",
  "supercharge.locator.geoError":
    "Lokasi Anda belum terdeteksi. Coba lagi, atau ketik nama kota di kolom pencarian.",
  "supercharge.locator.geoDenied":
    "Akses lokasi ditolak. Aktifkan izin lokasi di browser Anda, atau ketik nama kota di kolom pencarian.",
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
  "supercharge.locator.empty.title": "Belum ada lokasi yang cocok",
  "supercharge.locator.empty.desc":
    "Coba kata kunci lain, atau longgarkan filternya.",

  "supercharge.video.title": "Begini Cara Kerja SuperCharge",
  "supercharge.video.description":
    "Dari menyambungkan konektor hingga melaju kembali, lihat seperti apa proses pengisian di stasiun SuperCharge.",

  "supercharge.feature1.title": "Lima Belas Menit, Bukan Lima Jam",
  "supercharge.feature1.description":
    "SuperCharge mengisi baterai dari 10% ke 80% dalam 15 menit. Arus pengisian diatur otomatis, sehingga kecepatan tidak mengorbankan umur baterai.",

  "supercharge.feature2.subtitle": "Cek titik terdekat sebelum berangkat",
  "supercharge.feature2.description":
    "Stasiun SuperCharge tersedia di showroom Wedison dan lokasi mitra, dan jumlahnya terus bertambah. Semuanya bisa Anda temukan di peta.",

  "supercharge.feature3.title": "Dibangun untuk Dipakai Bertahun-tahun",
  "supercharge.feature3.subtitle": "Keselamatan lebih dulu, baru kecepatan",

  // SuperCharge App Section
  "supercharge.app.tag": "Aplikasi Wedison",
  "supercharge.app.teaser.title": "Cari. Isi Daya.",
  "supercharge.app.teaser.titleHighlight": "Melaju.",
  "supercharge.app.teaser.description":
    "Temukan stasiun SuperCharge terdekat, mulai pengisian, dan pantau prosesnya langsung dari ponsel Anda.",
  "supercharge.app.teaser.feature.find": "Temukan Stasiun",
  "supercharge.app.teaser.feature.realtime": "Pantau Sesi",
  "supercharge.app.teaser.feature.charge": "Isi Daya Cepat",

  "supercharge.app.hero.title": "Semua Urusan Isi Daya,",
  "supercharge.app.hero.titleHighlight": "dalam Satu Aplikasi",
  "supercharge.app.hero.description":
    "Temukan stasiun, mulai pengisian, pantau prosesnya, dan kelola paket isi daya Anda. Semuanya dari satu aplikasi.",

  "supercharge.app.feature1.title": "Temukan Stasiun Terdekat",
  "supercharge.app.feature1.subtitle":
    "Titik pengisian di sekitar Anda, dalam satu peta",
  "supercharge.app.feature1.description":
    "Semua stasiun SuperCharge tampil di peta, lengkap dengan alamat, jam operasional, dan jumlah charger yang tersedia.",
  "supercharge.app.feature1.bullet1": "Peta interaktif dengan navigasi GPS",
  "supercharge.app.feature1.bullet2": "Diurutkan dari yang terdekat",
  "supercharge.app.feature1.bullet3": "Simpan stasiun favorit Anda",

  "supercharge.app.feature2.title": "Pantau Pengisian dari Ponsel",
  "supercharge.app.feature2.subtitle": "Tidak perlu menunggu di samping motor",
  "supercharge.app.feature2.description":
    "Lihat progres pengisian dan perkiraan sisa waktunya dari ponsel, sementara Anda mengerjakan hal lain.",
  "supercharge.app.feature2.bullet1": "Persentase baterai secara langsung",
  "supercharge.app.feature2.bullet2": "Perkiraan sisa waktu pengisian",
  "supercharge.app.feature2.bullet3": "Notifikasi saat pengisian selesai",

  "supercharge.app.feature3.title": "Mulai dengan Satu Ketukan",
  "supercharge.app.feature3.subtitle": "Colokkan, ketuk, dan tinggalkan",
  "supercharge.app.feature3.description":
    "Sambungkan konektornya, mulai sesi dari aplikasi, dan pengisian langsung berjalan.",
  "supercharge.app.feature3.bullet1": "Mulai pengisian dengan satu ketukan",
  "supercharge.app.feature3.bullet2": "Bayar dengan paket isi daya",
  "supercharge.app.feature3.bullet3": "Riwayat sesi pengisian yang rapi",

  "supercharge.app.stats.stations": "Stasiun",
  "supercharge.app.stats.downloads": "Unduhan",
  "supercharge.app.stats.rating": "Rating",
  "supercharge.app.stats.chargeTime": "Menit Isi Daya",

  "supercharge.app.cta.description":
    "Unduh aplikasinya, lalu temukan stasiun terdekat sebelum berangkat.",

  // form title
  "form.title.placeholder": "Pilih topik pesan Anda",

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

  "form.title.other": "Lainnya (tuliskan di bawah ini)",
  "form.title.other.value": "Judul Lainnya: ",
  "form.hasMotor": "Apakah Anda sudah memiliki motor saat ini?",
  "form.vehicle": "Kendaraan Anda",
  "form.vehicle.placeholder": "Contoh: Wedison / EdPower / 2023",
  "form.vehicle.description": "Format: Merek / Model / Tahun",
  "form.sending.success.title": "Pesan Berhasil Dikirim",
  "form.sending.success.description":
    "Terima kasih. Tim kami akan segera menghubungi Anda.",
  "form.sending.error.title": "Pesan Belum Terkirim",
  "form.sending.error.description":
    "Pesan Anda belum berhasil terkirim. Silakan coba beberapa saat lagi, atau hubungi kami melalui saluran lain.",
  "form.sending.sending": "Pesan Anda sedang dikirim. Mohon tunggu sebentar.",
  "form.agreePrivacy.description": (
    <>
      Saya mengizinkan PT Wedison menggunakan data di atas dan menghubungi saya
      melalui email, telepon, atau sarana komunikasi lain untuk keperluan
      layanan pelanggan, sesuai dengan{" "}
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
              dan menggunakan data pribadi Anda semata-mata untuk menjawab
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
  "faq.page.kicker": "Pusat Bantuan",
  "faq.page.title": "Pertanyaan yang Sering Diajukan",
  "faq.page.intro":
    "Jawaban untuk pertanyaan yang paling sering kami terima seputar motor listrik Wedison: baterai, pengisian daya, performa, keamanan, garansi, dan servis. Belum menemukan jawabannya?",
  "faq.page.contactLink": "Hubungi tim kami.",
  "faq.page.tablist": "Kategori pertanyaan",

  // Battery Questions
  "faq.Battery.questions.0.question": "Berapa lama garansi baterainya?",
  "faq.Battery.questions.0.answer":
    "Baterai Wedison dilindungi garansi selama 3 tahun.",
  "faq.Battery.questions.1.question":
    "Berapa lama waktu mengisi baterai hingga penuh?",
  "faq.Battery.questions.1.answer":
    "Wedison SuperCharge: 10% ke 80% dalam 15 menit, atau 10% ke 95% dalam 20 menit.\nWedison Regular Charge: bervariasi tergantung adaptor dan kapasitas baterai, antara 2 hingga 10 jam.",
  "faq.Battery.questions.2.question":
    "Baterai jenis apa yang digunakan Wedison?",
  "faq.Battery.questions.2.answer":
    "Wedison menggunakan baterai Lithium-ion (LFP), teknologi yang sama dengan yang dipakai smartphone, laptop, dan mobil listrik.\n\nKeunggulannya:\nA. Padat energi: menyimpan daya besar dalam ukuran yang ringkas dan ringan.\nB. Tahan panas: tetap bekerja optimal hingga suhu 45 derajat Celsius.\nC. Minim kebocoran daya: daya tetap tersimpan meski motor tidak dipakai berhari-hari.\nD. Awet: mampu lebih dari 5.000 siklus pengisian dengan kapasitas yang tetap terjaga.\nE. Cepat diisi: di stasiun SuperCharge, baterai terisi dari 10% ke 80% dalam 15 menit.",
  "faq.Battery.questions.3.question": "Ada berapa pilihan baterai?",
  "faq.Battery.questions.3.answer":
    "Untuk model tertentu tersedia dua pilihan: Regular dan Extended.\nJarak tempuhnya berbeda-beda tergantung model, mulai dari 80 km hingga 200 km dalam sekali pengisian.",
  "faq.Battery.questions.4.question": "Siapa yang mengembangkan baterainya?",
  "faq.Battery.questions.4.answer":
    "Baterai Wedison dikembangkan sendiri oleh tim internal kami.",
  "faq.Battery.questions.5.question": "Berapa lama usia pakai baterainya?",
  "faq.Battery.questions.5.answer":
    "Dalam pemakaian normal, baterai Wedison dirancang untuk bertahan hingga 12 tahun.",
  "faq.Battery.questions.6.question":
    "Bolehkah memakai baterai atau charger merek lain?",
  "faq.Battery.questions.6.answer":
    "Tidak bisa. Motor listrik Wedison menggunakan jalur komunikasi CAN (Controller Area Network) untuk mengatur pengisian dan kerja komponennya. Baterai pihak ketiga tidak menggunakan sistem yang sama.",
  "faq.Battery.questions.7.question": "Apakah baterainya bisa diganti?",
  "faq.Battery.questions.7.answer":
    "Bisa. Wedison menyediakan baterai pengganti dan suku cadang asli.",
  "faq.Battery.questions.8.question":
    "Bagaimana cara menjaga baterai tetap sehat?",
  "faq.Battery.questions.8.answer":
    "Usahakan mengisi daya sebelum baterai turun di bawah 20%. Kebiasaan sederhana ini membantu memperpanjang usia baterai.",
  "faq.Battery.questions.9.question":
    "Bagaimana cara memperpanjang usia baterai?",
  "faq.Battery.questions.9.answer":
    "Hindari memakai baterai sampai benar-benar kosong atau mengisinya terus hingga 100%.\nJaga di kisaran 20% sampai 80% agar beban baterai lebih ringan.",
  "faq.Battery.questions.10.question": "Berapa rating IP baterainya?",
  "faq.Battery.questions.10.answer":
    "Baterai Wedison memiliki rating IP67.\nArtinya, sepenuhnya kedap debu dan tahan terendam air sedalam 1 meter selama 30 menit tanpa mengalami kerusakan.",
  "faq.Battery.questions.11.question":
    "Seberapa sering baterai perlu diisi jika motor jarang dipakai?",
  "faq.Battery.questions.11.answer":
    "Jika motor tidak dipakai lebih dari seminggu, tetap isi dayanya minimal sebulan sekali.",
  "faq.Battery.questions.12.question":
    "Apa yang perlu dilakukan jika motor tidak dipakai dalam waktu lama?",
  "faq.Battery.questions.12.answer":
    "Matikan MCB (pemutus arus), dan tetap isi baterainya minimal sebulan sekali agar kondisinya terjaga.",

  // Charging Questions
  "faq.Charging.questions.0.question": "Di mana saya bisa mengisi daya?",
  "faq.Charging.questions.0.answer":
    "SuperCharge\nDi stasiun SuperCharge Wedison, yang jumlahnya terus bertambah di berbagai kota.\nRegular Charge\nDi rumah, cukup dengan stopkontak biasa.",
  "faq.Charging.questions.1.question": "Bagaimana cara mengisi dayanya?",
  "faq.Charging.questions.1.answer":
    "Setiap motor Wedison memiliki dua port pengisian: satu untuk charger rumah, satu lagi untuk SuperCharge.",
  "faq.Charging.questions.2.question":
    "Bolehkah memakai adaptor charger merek lain?",
  "faq.Charging.questions.2.answer":
    "Sebaiknya tidak. Gunakan charger dan suku cadang resmi Wedison agar kondisi baterai tetap terjaga.",
  "faq.Charging.questions.3.question": "Apakah bisa mengisi daya di rumah?",
  "faq.Charging.questions.3.answer":
    "Bisa. Semua model Wedison dilengkapi port pengisian untuk charger rumah.",
  "faq.Charging.questions.4.question":
    "Apakah pengisian cepat merusak baterai?",
  "faq.Charging.questions.4.answer":
    "Tidak. Baterai Wedison memang dirancang untuk pengisian cepat, dengan arus yang diatur otomatis agar usia baterai tetap panjang.",
  "faq.Charging.questions.5.question": "Apakah pengisian cepat berbahaya?",
  "faq.Charging.questions.5.answer":
    "Tidak. Pengisian cepat Wedison tidak memperpendek usia baterai dan tidak menimbulkan risiko ledakan.",
  "faq.Charging.questions.6.question":
    "Apakah berbahaya jika baterai kelebihan isi?",
  "faq.Charging.questions.6.answer":
    "Baterai Wedison dilengkapi sistem manajemen bawaan.\nJika suhu baterai naik terlalu tinggi saat pengisian, sistem akan memutus aliran daya secara otomatis.",
  "faq.Charging.questions.7.question":
    "Mengapa pengisian melambat saat baterai hampir penuh?",
  "faq.Charging.questions.7.answer":
    "Ini memang dirancang demikian. Pengisian berjalan cepat hingga sekitar 95%, lalu melambat dan lebih terkontrol untuk melindungi baterai.\n\nAnda tetap bisa berangkat lebih cepat, sementara usia baterai ikut terjaga.",
  "faq.Charging.questions.8.question":
    "Berapa lama pengisian di rumah dengan charger 600W?",
  "faq.Charging.questions.8.answer":
    "Tergantung model dan kapasitas baterainya.\nDurasi pengisian 0 sampai 100% dengan adaptor 600W:\nLihat Data Pengisian Reguler",
  "faq.Charging.questions.9.question":
    "Berapa lama pengisian di rumah dengan charger 1260W?",
  "faq.Charging.questions.9.answer":
    "Tergantung model dan kapasitas baterainya.\nDurasi pengisian 0 sampai 100% dengan adaptor 1260W:\nBees: 3,5 jam (Bees hanya kompatibel dengan charger 600W)\nLihat Data Pengisian Reguler",
  "faq.Charging.questions.10.question":
    "Bagaimana urutan yang benar saat mengisi daya di rumah?",
  "faq.Charging.questions.10.answer":
    "Sambungkan charger ke port pengisian di motor terlebih dahulu, baru colokkan ke stopkontak.\nSetelah selesai, cabut dari stopkontak lebih dulu, baru lepaskan dari motor.",
  "faq.Charging.questions.11.question":
    "Apakah pengisian di SuperCharge gratis?",
  "faq.Charging.questions.11.answer":
    "Tidak. Pengisian di SuperCharge menggunakan sistem paket yang bisa dibeli melalui aplikasi Wedison.",

  // Performance Questions
  "faq.Performance.questions.0.question": "Berapa kecepatan maksimalnya?",
  "faq.Performance.questions.0.answer":
    "Tergantung modelnya, kecepatan maksimal berkisar antara 60 km/jam hingga 90 km/jam.",
  "faq.Performance.questions.1.question": "Berapa besar daya motornya?",
  "faq.Performance.questions.1.answer":
    "Daya motor berbeda di setiap model, mulai dari 1,2 kW hingga 6 kW.",
  "faq.Performance.questions.2.question": "Berapa jarak tempuhnya?",
  "faq.Performance.questions.2.answer":
    "Tergantung model dan pilihan baterainya, jarak tempuh berkisar antara 80 km hingga 200 km dalam sekali pengisian.",
  "faq.Performance.questions.3.question":
    "Apakah aman dipakai saat hujan atau melewati genangan?",
  "faq.Performance.questions.3.answer":
    "Motor, unit kontrol, dan baterai Wedison memiliki rating IP67 dan telah lulus uji kedap air.\nMeski begitu, sebaiknya hindari menerjang genangan yang dalam atau membiarkan motor terendam terlalu lama.",
  "faq.Performance.questions.4.question": "Apakah kuat menanjak?",
  "faq.Performance.questions.4.answer":
    "Kuat, dengan kemampuan yang berbeda di setiap model:\nBees dan EdPower: tanjakan hingga 12%\nAthena dan Victory: tanjakan hingga 15%",
  "faq.Performance.questions.5.question":
    "Apakah kapasitas baterai menurun seiring waktu?",
  "faq.Performance.questions.5.answer":
    "Ya, seperti semua perangkat dengan baterai lithium-ion. Kapasitasnya berkurang sedikit demi sedikit di setiap siklus pengisian.\nLaju penurunannya dipengaruhi jumlah siklus, usia baterai, dan suhu pemakaian.\n\nKarena itulah setiap baterai Wedison dilindungi garansi 3 tahun.",

  // Safety Questions
  "faq.Safety.questions.0.question": "Apakah baterainya aman?",
  "faq.Safety.questions.0.answer":
    "Baterai Wedison dilengkapi sistem manajemen bawaan yang menjaga suhu dan arus pengisian,\nsehingga risiko panas berlebih, kelebihan isi, dan kebakaran dapat dicegah.",
  "faq.Safety.questions.1.question": "Sistem rem apa yang digunakan?",
  "faq.Safety.questions.1.answer":
    "CBS (Combined Braking System), yang membagi daya pengereman ke roda depan dan belakang secara otomatis saat tuas rem ditarik:\nAthena, Victory, dan EdPower\n\nRem cakram di roda depan dan belakang:\nBees",
  "faq.Safety.questions.2.question":
    "Motor penggerak jenis apa yang digunakan?",
  "faq.Safety.questions.2.answer":
    "Semua model Wedison menggunakan motor DC brushless (BLDC), yang dikenal efisien, bertorsi besar, dan berumur panjang.\n\nTipenya satu:\nDC Brushless Rear Hub Motor, dengan kecepatan hingga 90 km/jam (Bees, Athena, Victory, EdPower).",

  // Servicing Questions
  "faq.Servicing.questions.0.question": "Apakah ada servis gratis?",
  "faq.Servicing.questions.0.answer":
    "Ada. Setiap motor Wedison mendapat 3 kali servis gratis di bengkel Wedison atau bengkel resmi rekanan kami.\nJadwalnya mengikuti jarak tempuh: 1.000 km, 5.000 km, dan 10.000 km.",
  "faq.Servicing.questions.1.question":
    "Pada jarak tempuh berapa saja servis gratisnya?",
  "faq.Servicing.questions.1.answer": "Pada 1.000 km, 5.000 km, dan 10.000 km.",
  "faq.Servicing.questions.2.question": "Di mana motor saya bisa diservis?",
  "faq.Servicing.questions.2.answer":
    "Di bengkel resmi Wedison atau bengkel rekanan resmi Wedison terdekat.",
  "faq.Servicing.questions.3.question": "Apakah suku cadangnya tersedia?",
  "faq.Servicing.questions.3.answer":
    "Tersedia. Wedison menyediakan suku cadang asli untuk seluruh modelnya.",
  "faq.Servicing.questions.4.question": "Apakah baterai bergaransi?",
  "faq.Servicing.questions.4.answer":
    "Ya. Baterai dilindungi garansi selama 3 tahun.",
  "faq.Servicing.questions.5.question": "Apakah motor bergaransi?",
  "faq.Servicing.questions.5.answer":
    "Ya. Unit motor dilindungi garansi selama 2 tahun.",
  "faq.Servicing.questions.6.question":
    "Berapa biaya perbaikan motor, dinamo, dan komponen lainnya?",
  "faq.Servicing.questions.6.answer":
    "Biayanya berbeda-beda, tergantung komponen yang diganti dan tingkat kerusakannya.\n\nSilakan tanyakan langsung ke bengkel resmi terdekat untuk mendapatkan perkiraan biaya.",
  "faq.Servicing.questions.7.question": "Bagaimana cara merawat motor Wedison?",
  "faq.Servicing.questions.7.answer":
    "Perawatan rutin dan cara pakai yang benar akan memperpanjang usia motor. Anda tidak perlu mengisi daya setiap hari:\n- Isi daya seperlunya, dan usahakan baterai berada di kisaran 20% sampai 80%.\n- Jika motor jarang dipakai, tetap isi dayanya minimal sebulan sekali.\n- Isi daya di stasiun SuperCharge dan lakukan servis di bengkel resmi agar kondisi baterai tetap terjaga.",
  "faq.Servicing.questions.8.question": "Apakah motor boleh dimodifikasi?",
  "faq.Servicing.questions.8.answer":
    "Garansi Wedison hanya berlaku untuk konfigurasi, desain, dan spesifikasi asli motor.\nKerusakan akibat penyalahgunaan, kelalaian, pemakaian di luar peruntukan, atau modifikasi tidak termasuk dalam garansi.",
  "faq.Servicing.questions.9.question": "Apa saja yang membatalkan garansi?",
  "faq.Servicing.questions.9.answer":
    "Kerusakan akibat pemakaian suku cadang tidak asli atau modifikasi tanpa persetujuan Wedison.\n\nKerusakan akibat kejadian di luar kendali juga tidak ditanggung, misalnya gempa bumi, angin topan, banjir, paparan zat kimia, atau korosi.",
  "faq.Servicing.questions.10.question": "Apa saja batasan garansinya?",
  "faq.Servicing.questions.10.answer":
    "Tidak ada komponen yang bergaransi seumur hidup.\nSuku cadang yang diganti selama masa garansi hanya ditanggung hingga sisa periode garansi awal.\nUntuk suku cadang yang dibeli atau diganti di luar garansi, masa garansinya dihitung sejak tanggal pembelian atau penggantian.",

  // Smart Features Questions
  "faq.SmartFeatures.questions.0.question":
    "Fitur pintar apa saja yang tersedia?",
  "faq.SmartFeatures.questions.0.answer":
    "Melalui aplikasi Wedison, model tertentu bisa dinyalakan dan dimatikan dari ponsel lewat koneksi Bluetooth.\nFitur lainnya akan hadir pada pembaruan aplikasi berikutnya.",

  // Tires Questions
  "faq.Tires.questions.0.question": "Berapa ukuran bannya?",
  "faq.Tires.questions.0.answer":
    "Bees: Depan: 90/90-10; Belakang 90/90-10\nAthena: Depan: 100/80-12; Belakang 100/80-12\nVictory: Depan: 90/90-14; Belakang: 100/80-14\nEdPower: Depan: 100/90-14; Belakang: 120/70-14",

  // Ojol Page
  "ojol.hero.title": "Wedison untuk",
  "ojol.hero.titleHighlight": "Mitra Ojek Online",
  "ojol.hero.description":
    "Motor listrik untuk mitra pengemudi ojek online. Biaya operasional lebih ringan, dan tidak perlu lagi antre di SPBU.",
  "ojol.hero.startFrom": "Mulai dari",
  "ojol.hero.perDay": "/hari",
  "ojol.hero.dailyRental": "SEWA HARIAN",
  "ojol.hero.tagline": "#JadiLebihMudah",
  "ojol.hero.tryFree": "Coba Gratis",

  "ojol.benefits.title": "Lebih Banyak Order, Lebih Sedikit Pengeluaran",
  "ojol.benefits.description":
    "Lelah mengantre di SPBU dan melihat harga bensin terus naik? Dengan motor listrik, biaya harian jauh lebih ringan, perawatan lebih sedikit, dan waktu yang biasanya habis di SPBU bisa dipakai untuk mengambil order.",

  "ojol.campaign.heading": "Program Unggulan",
  "ojol.btn.register": "Daftar Sekarang",
  "ojol.btn.detail": "Lihat Detail",

  "ojol.campaign.milik.title": "Sewa Milik",
  "ojol.campaign.milik.tagline": "Cicil Sambil Bekerja, Motor Jadi Milik Anda",
  "ojol.campaign.milik.description":
    "Sewa selama 3,5 tahun (42 bulan) dengan opsi kepemilikan. Begitu kontrak selesai, motor resmi menjadi milik Anda.",
  "ojol.campaign.milik.benefit.0":
    "1x Gratis adaptor charging regular (senilai Rp1.000.000)",
  "ojol.campaign.milik.benefit.1":
    "1x Gratis ganti ban depan dan belakang (senilai Rp385.000)",
  "ojol.campaign.milik.benefit.2":
    "1x Gratis ganti kampas rem (1 set depan dan belakang)",
  "ojol.campaign.milik.benefit.3": "2x Kunci mekanik",
  "ojol.campaign.milik.benefit.4": "Garansi baterai 3 tahun",
  "ojol.campaign.milik.benefit.5": "Garansi motor 2 tahun",
  "ojol.campaign.milik.term.0":
    "Skema sewa milik berlaku selama 3 tahun 6 bulan (42 bulan)",
  "ojol.campaign.milik.term.1":
    "Mitra berhak libur 1 hari per minggu (maksimal 48 hari per tahun)",
  "ojol.campaign.milik.term.2":
    "Setelah kontrak 42 bulan selesai, kepemilikan motor dialihkan kepada mitra",
  "ojol.campaign.milik.term.3":
    "Tabungan digunakan untuk biaya asuransi, servis, suku cadang, dan BPKB. Sisanya ditransfer kepada mitra di akhir kontrak",
  "ojol.campaign.milik.term.4":
    "Uang muka tidak dapat dikembalikan setelah mitra dinyatakan memenuhi syarat",
  "ojol.campaign.milik.term.5":
    "Denda tilang dan pelanggaran lalu lintas menjadi tanggung jawab mitra",
  "ojol.campaign.milik.term.6":
    "Mitra wajib mengikuti proses seleksi dari Wedison",
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
    "Sewa harian dengan kontrak 3 tahun. Tepat untuk Anda yang ingin langsung bekerja tanpa memikirkan cicilan.",
  "ojol.campaign.harian.benefit.0": "1x Gratis adaptor charging regular",
  "ojol.campaign.harian.benefit.1":
    "1x Gratis ganti ban depan dan belakang (senilai Rp385.000)",
  "ojol.campaign.harian.benefit.2":
    "1x Gratis ganti kampas rem (1 set depan dan belakang)",
  "ojol.campaign.harian.benefit.3": "1x Gratis servis berkala",
  "ojol.campaign.harian.benefit.4": "2x Kunci mekanik",
  "ojol.campaign.harian.benefit.5": "Garansi baterai 3 tahun",
  "ojol.campaign.harian.benefit.6": "Garansi motor 2 tahun",
  "ojol.campaign.harian.term.0":
    "Skema sewa harian berlaku selama 3 tahun (36 bulan)",
  "ojol.campaign.harian.term.1":
    "Mitra berhak libur 1 hari per minggu (maksimal 48 hari per tahun)",
  "ojol.campaign.harian.term.2":
    "Uang muka tidak dapat dikembalikan setelah mitra dinyatakan memenuhi syarat",
  "ojol.campaign.harian.term.3":
    "Motor sepenuhnya milik PT Wedison Nusantara Energi",
  "ojol.campaign.harian.term.4":
    "Denda tilang dan pelanggaran lalu lintas menjadi tanggung jawab mitra",
  "ojol.campaign.harian.term.5":
    "Kerusakan akibat kelalaian atau kecelakaan menjadi tanggung jawab mitra",
  "ojol.campaign.harian.term.6":
    "Mitra wajib mengikuti proses seleksi dari Wedison",
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
  "ojol.dialog.terms": "Syarat dan Ketentuan",
  "ojol.dialog.registerNow": "Daftar Program Ini",

  "ojol.supercharge.badge": "10% ke 80% dalam 15 menit",
  "ojol.supercharge.descriptionPart1":
    "Bagi pengemudi, setiap menit berhenti itu berharga. Di SuperCharge, cukup ",
  "ojol.supercharge.descriptionBold": "15 menit",
  "ojol.supercharge.descriptionPart2":
    " untuk mengisi baterai dari 10% ke 80%, lalu langsung kembali mengambil order. Sekali pengisian bisa menempuh hingga 200 km*, artinya lebih banyak waktu di jalan dan lebih banyak order yang bisa diambil.",
  "ojol.supercharge.disclaimer":
    "*Jarak tempuh 200 km berlaku untuk EdPower dengan baterai Extended",
  "ojol.supercharge.cta": "Pelajari Lebih Lanjut",

  "ojol.models.title": "Pilih Motor yang Paling Sesuai",
  "ojol.models.subtitle":
    "Butuh yang lincah untuk gang sempit, atau yang tangguh untuk jarak jauh? Sesuaikan dengan wilayah dan cara Anda bekerja.",
  "ojol.models.spec.range": "Jarak Tempuh",
  "ojol.models.spec.maxSpeed": "Kecepatan Maks.",
  "ojol.models.spec.battery": "Baterai",
  "ojol.models.spec.supercharge": "SuperCharge",
  "ojol.models.spec.motor": "Motor",
  "ojol.models.value.minutes": "15 menit",
  "ojol.models.bees.tagline": "Ringkas dan Lincah",
  "ojol.models.bees.highlight": "Andalan di gang sempit",
  "ojol.models.victory.tagline": "Bergaya dan Bertenaga",
  "ojol.models.victory.highlight": "Seimbang antara gaya dan performa",
  "ojol.models.athena.tagline": "Klasik dan Nyaman",
  "ojol.models.athena.highlight": "Tetap nyaman seharian di jalan",
  "ojol.models.edpower.tagline": "Tangguh untuk Jarak Jauh",
  "ojol.models.edpower.highlight": "Andalan untuk rute panjang",
  "ojol.models.cta": "Lihat Detail",
  "ojol.models.footnote": "*Jarak tempuh dengan baterai Extended",

  "ojol.cta.badge": "Program Khusus Mitra Pengemudi",
  "ojol.cta.headline.1": "Siap Menambah Penghasilan",
  "ojol.cta.headline.2": "bersama Wedison?",
  "ojol.cta.description":
    "Sewa harian mulai Rp50 ribu, SuperCharge gratis, dan pilihan cicilan ringan. Daftar sekarang, dan tim kami akan memandu prosesnya.",
  "ojol.cta.benefit.1": "Sewa Harian Mulai Rp50 Ribu",
  "ojol.cta.benefit.2": "SuperCharge Gratis",
  "ojol.cta.benefit.3": "Cicilan Ringan",
  "ojol.cta.benefit.4": "Servis Prioritas",
  "ojol.cta.button": "Hubungi Tim Wedison",
  "ojol.cta.trust": "Respons cepat, konsultasi gratis",

  // Booking (modal Test Ride / Booking Kunjungan)
  "booking.title": "Jadwalkan Kunjungan Showroom",
  "booking.title.testRide": "Jadwalkan Test Ride",
  "booking.subtitle":
    "Lengkapi data di bawah ini, lalu lanjutkan ke WhatsApp untuk mengonfirmasi jadwal dengan tim showroom.",
  "booking.field.showroom": "Showroom",
  "booking.placeholder.showroom": "Pilih showroom",
  "booking.field.purpose": "Tujuan Kunjungan",
  "booking.placeholder.purpose": "Pilih tujuan kunjungan",
  "booking.purpose.testRide": "Test Ride",
  "booking.purpose.consultation": "Konsultasi Produk",
  "booking.purpose.financing": "Simulasi Pembiayaan",
  "booking.purpose.service": "Servis",
  "booking.purpose.other": "Lainnya",
  "booking.field.name": "Nama Lengkap",
  "booking.placeholder.name": "Nama lengkap Anda",
  "booking.field.phone": "Nomor Telepon (WhatsApp)",
  "booking.field.email": "Email",
  "booking.optional": "(opsional)",
  "booking.field.date": "Tanggal",
  "booking.placeholder.date": "Pilih tanggal",
  "booking.field.time": "Waktu",
  "booking.placeholder.time": "Pilih waktu",
  "booking.time.pickDateFirst": "Pilih showroom dan tanggal terlebih dahulu",
  "booking.time.none": "Tidak ada slot yang tersisa",
  "booking.hoursHint":
    "Jam operasional: Senin–Jumat 10.00–19.00, Sabtu–Minggu 10.00–17.00.",
  "booking.field.note": "Catatan",
  "booking.placeholder.note": "Contoh: ingin mencoba Athena, datang berdua",
  "booking.submit": "Kirim dan Lanjutkan ke WhatsApp",
  "booking.submitting": "Mengirim…",
  "booking.privacy":
    "Dengan mengirim formulir ini, Anda bersedia dihubungi tim Wedison untuk konfirmasi jadwal.",
  "booking.error.showroom": "Pilih showroom yang ingin Anda kunjungi",
  "booking.error.name": "Masukkan nama lengkap (minimal 2 huruf)",
  "booking.error.nameMax": "Nama terlalu panjang",
  "booking.error.phone": "Masukkan nomor WhatsApp yang valid (08xx atau +62)",
  "booking.error.email": "Masukkan alamat email yang valid",
  "booking.error.purpose": "Pilih tujuan kunjungan",
  "booking.error.date": "Pilih tanggal kunjungan",
  "booking.error.time": "Pilih waktu kunjungan",
  "booking.error.note": "Catatan terlalu panjang (maks. 500 karakter)",
  "booking.error.recaptcha":
    'Centang verifikasi "Saya bukan robot" terlebih dahulu.',
  "booking.error.submit.title": "Permintaan belum terkirim",
  "booking.error.submit.desc":
    "Silakan coba beberapa saat lagi, atau hubungi kami langsung melalui WhatsApp.",
  "booking.error.rateLimited":
    "Terlalu banyak percobaan. Silakan coba lagi dalam beberapa menit.",
  "booking.error.slot": "Slot tersebut sudah terisi. Silakan pilih waktu lain.",
  "booking.success.title": "Terima kasih, {name}!",
  "booking.success.desc":
    "Permintaan Anda sudah kami terima. Tim showroom akan mengonfirmasi jadwalnya melalui WhatsApp.",
  "booking.success.opened":
    "WhatsApp sudah terbuka di tab baru. Kirim pesan yang sudah terisi agar tim kami bisa langsung mengonfirmasi.",
  "booking.success.popupBlocked":
    "WhatsApp tidak terbuka otomatis? Klik tombol di bawah ini untuk mengirim konfirmasi.",
  "booking.success.schedule": "Jadwal",
  "booking.success.whatsapp": "Buka WhatsApp",
  "booking.success.close": "Selesai",

  // Language
  language: "Bahasa Indonesia",
  switchLanguage: "English",
};
