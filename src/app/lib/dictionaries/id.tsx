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
    "landing.title": "Wedison - Masa Depan Mobilitas Listrik",
    "landing.description":
      "Wedison adalah brand motor listrik yang ramah lingkungan dengan teknologi SuperCharge terkini.",

    // compare table
    "compare.model": "Bandingkan Model",
    "compare.select.bike": "Pilih motor untuk bandingkan",
    "compare.title": "Bandingkan Model Wedison",
    "compare.subtitle":
      "Sandingkan spesifikasi tiap model berdampingan, dan temukan motor listrik yang paling pas buat kamu.",
    "compare.expandAll": "Buka Semua",
    "compare.collapseAll": "Tutup Semua",
    "compare.swipeHint": "Geser untuk lihat lebih",
    "compare.page.kicker": "Bandingkan Motor Listrik",
    "compare.page.addBike": "Tambah motor",
    "compare.page.remove": "Hapus",
    "compare.viewDetails": "Lihat Detail",
    "compare.help.title": "Masih bingung memilih?",
    "compare.help.subtitle":
      "Tim kami siap membantu kamu menemukan motor listrik Wedison yang paling pas.",
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
      "Semua yang perlu kamu ketahui tentang Wedison — pengoperasian, pengisian daya, perawatan, dan keselamatan dalam satu dokumen resmi.",
    "user.manual.faq.section.title": "Buku Panduan untuk",
    "user.manual.faq.section.titleHighlight": "Setiap Model",
    "user.manual.faq.section.description":
      "Pilih model di bawah untuk melihat atau mengunduh buku panduan resminya.",
    "user.manual.btn.view": "Lihat Panduan",
    "user.manual.btn.download": "Unduh",
    "user.manual.card.bees.title": "Wedison Bees",
    "user.manual.card.bees.desc":
      "Komuter urban yang ringkas — petunjuk pengoperasian, pengisian daya, dan perawatan.",
    "user.manual.card.athena.title": "Wedison Athena",
    "user.manual.card.athena.desc":
      "Buku panduan skuter bergaya retro dengan fitur pintar dan perawatan baterai.",
    "user.manual.card.victory.title": "Wedison Victory",
    "user.manual.card.victory.desc":
      "Panduan kelas sport — mode berkendara, SuperCharge, dan servis.",
    "user.manual.card.edpower.title": "Wedison EdPower",
    "user.manual.card.edpower.desc":
      "Model premium jarak jauh — dokumentasi lengkap untuk perjalanan harian dan jauh.",

    // footer support
    "footer.support": "Bantuan",
    "footer.userManual": "Buku Panduan",
    "footer.faq": "FAQ",

    // Navbar
    "nav.products": "Produk",
    "nav.discover": "Jelajahi",
    "nav.discover.leftCard.title": "Jelajahi Wedison",
    "nav.discover.leftCard.description":
      "Jelajahi Experience Center, temukan jawaban di FAQ, dan ikuti kabar terbaru lewat Media Center. Semua informasi ada di satu tempat.",
    "nav.experienceCenter.description":
      "Kunjungi showroom Wedison dan rasakan langsung teknologi supercharge 15 menit.",
    "nav.faq.description":
      "Temukan jawaban atas pertanyaan seputar produk, layanan, dan teknologi kami.",
    "nav.mediaCenter.description":
      "Dapatkan berita, rilis resmi, dan highlight terbaru tentang Wedison.",
    "nav.ojol.description":
      "Program sewa motor listrik eksklusif untuk driver ojol. Mulai dari 50K/hari.",
    "nav.showroom": "Showroom",
    "nav.serviceLocation": "Lokasi Layanan",
    "nav.superCharge": "SuperCharge",
    "nav.corporate": "Perusahaan",
    "nav.corporate.leftCard.title": "Powering the Future",
    "nav.corporate.leftCard.description":
      "Dengan teknologi supercharge, Wedison menghadirkan pengalaman berkendara listrik yang cepat, efisien, dan ramah lingkungan.",
    "nav.aboutUs": "Tentang Kami",
    "nav.aboutUs.description":
      "Kenali visi, misi, dan komitmen Wedison dalam menghadirkan inovasi motor listrik untuk masa depan berkelanjutan.",
    "nav.careers": "Karir",
    "nav.careers.description":
      "Bergabung dengan tim Wedison dan bangun karier di industri kendaraan listrik.",

    // Career Page
    "career.banner.title": "Bergabung Bersama",
    "career.banner.titleHighlight": "Tim Wedison",
    "career.banner.description":
      "Mari bersama membangun masa depan transportasi listrik yang berkelanjutan di Indonesia",
    "career.banner.badge1": "Work-Life Balance",
    "career.banner.badge2": "Gaji Kompetitif",
    "career.banner.badge3": "Pertumbuhan Karir",
    "career.section.title": "Posisi yang Tersedia",
    "career.section.description":
      "Temukan peran yang sesuai dengan passion dan keahlian Anda",
    "career.card.viewDetails": "Lihat Detail",
    "career.card.previewText":
      "Klik untuk melihat detail posisi dan requirements",
    "career.detail.jobOverview": "Job Overview",
    "career.detail.keyResponsibilities": "Key Responsibilities",
    "career.detail.qualifications": "Qualifications & Requirements",
    "career.detail.applyButton": "Lamar Posisi Ini",
    "career.portal.title": "Pilih Platform Lamaran",
    "career.portal.description":
      "Pilih platform job portal untuk melanjutkan lamaran Anda",
    "career.portal.infoText":
      "Anda akan diarahkan ke platform eksternal untuk melengkapi proses lamaran. Pastikan CV dan dokumen pendukung Anda sudah siap.",
    "career.apply.emailTitle": "Lamar via Email",
    "career.apply.emailSubtitle":
      "Kirim lamaran langsung ke hr@wedison.co",
    "career.apply.orViaPortal": "atau via Job Portal",

    "nav.contactUs": "Hubungi Kami",
    "nav.contactUs.description":
      "Butuh bantuan atau informasi lebih lanjut? Tim Wedison siap melayani Anda.",
    "nav.helpCenter": "Pusat Bantuan",

    // Hero
    "hero.tag": "Masa Depan adalah Listrik",
    "hero.title": "Masa Depan",
    "hero.titleHighlight": "Mobilitas Listrik",
    "hero.description":
      "Rasakan perpaduan sempurna antara tenaga, keberlanjutan, dan teknologi canggih dengan sepeda motor listrik Wedison Motors.",
    "hero.exploreModels": "Jelajahi Model",
    "hero.bookTestRide": "Pesan Test Ride",

    // Features
    "features.tag": "Fitur Revolusioner",
    "features.title": "Mengapa Memilih",
    "features.titleHighlight": "Wedison Motors",
    "features.description":
      "Sepeda motor listrik kami menggabungkan teknologi canggih dengan desain berkelanjutan untuk memberikan pengalaman berkendara yang tak tertandingi.",
    "features.longRangeBattery": "Baterai Jarak Jauh sampai 120km",
    "features.longRangeBatteryDesc":
      "Jelajahi hingga 100 kilometer dengan sekali pengisian menggunakan teknologi baterai lithium-ion canggih kami.",
    "features.rapidCharging": "SuperCharge dalam 15 Menit",
    "features.rapidChargingDesc":
      "Isi daya dari 10% hingga 80% hanya dalam 15 menit dengan jaringan SuperCharge kami.",
    "features.impressivePerformance": "0-95km/jam dalam 3 Detik",
    "features.impressivePerformanceDesc":
      "Rasakan akselerasi 0-100 km/jam dalam waktu kurang dari 3 detik dengan torsi instan.",
    "features.zeroEmissions": "Tanpa Emisi, Udara Lebih Bersih",
    "features.zeroEmissionsDesc":
      "Ditenagai listrik murni, Wedison membantu mengurangi polusi udara di perkotaan. Setiap perjalanan berarti udara yang lebih segar untuk kita semua.",
    "features.zeroEmissionsLink":
      "https://www.sciencedirect.com/science/article/pii/S0967070X21003401",
    "features.healthBenefits": "Solusi Energi yang Lebih Efisien dan Cerdas",
    "features.healthBenefitsDesc":
      "Untuk jarak yang sama, Wedison menggunakan energi lebih sedikit dibanding motor konvensional. Lebih hemat dan efisien.",
    "features.healthBenefitsLink":
      "https://www.sciencedirect.com/science/article/pii/S016041202031970X",
    "features.noiseFree": "Melaju Menuju Masa Depan Berkelanjutan",
    "features.noiseFreeDesc":
      "Setiap pilihan Anda pada Wedison adalah langkah nyata menuju mobilitas hijau yang ramah lingkungan dan berkelanjutan.",
    "features.noiseFreeLink":
      "https://www.sciencedirect.com/science/article/pii/S0160412023003896",

    // Products
    "products.tag": "Armada Kami",
    "products.title": "Sepeda Motor",
    "products.titleHighlight": "Listrik Kami",
    "products.description":
      "Temukan rangkaian sepeda motor listrik berperforma tinggi kami yang dirancang untuk setiap jenis pengendara.",
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
      "Dengarkan dari pengendara yang telah beralih ke listrik dengan Wedison Motors.",

    // Contact
    "contact.tag": "Hubungi Kami",
    "contact.title": "Tetap",
    "contact.titleHighlight": "Terhubung",
    "contact.description":
      "Punya pertanyaan tentang sepeda motor listrik kami? Kami siap membantu Anda bergabung dengan revolusi listrik.",
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
    "contact.phoneHours": "Senin-Jumat dari 9 pagi hingga 6 sore",
    "contact.emailLabel": "Email",
    "contact.emailResponse": "Kami akan merespons secepat mungkin",
    "contact.followUs": "Ikuti Kami",

    // Footer
    "footer.description":
      "Mempelopori masa depan mobilitas listrik dengan teknologi canggih dan desain berkelanjutan.",
    "footer.products": "Produk",
    "footer.experience": "Pengalaman",
    "footer.corporate": "Perusahaan",
    "footer.contact": "Hubungi Kami",
    "footer.about": "Tentang Kami",
    "footer.copyright": "© 2025 Wedison Motors. Seluruh hak cipta dilindungi.",
    "footer.tagline":
      "Dirancang dengan mempertimbangkan keberlanjutan. Didukung oleh energi terbarukan.",
    "footer.privacy": "Privasi",
    "footer.terms": "Ketentuan",
    "footer.cookies": "Cookies",
    "footer.meetus": "Temukan Kami",
    "footer.career": "Karir",

    //showroom

    "showroom.title": "Kunjungi",
    "showroom.titleHighlight": "Showroom Kami",
    "showroom.description":
      "Rasakan sepeda motor listrik kami secara langsung dan temukan masa depan mobilitas.",
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
    "showroom.whatYouCanDo": "Apa yang Dapat Anda Lakukan di Showroom",
    "showroom.testRide.title": "Test Ride Sepeda Motor Listrik",
    "showroom.testRide.description":
      "Coba performa sepeda motor listrik Wedison langsung di area uji kami. Rasakan kenyamanan berkendara dengan teknologi terbaru.",
    "showroom.consultation.title": "Konsultasi Produk",
    "showroom.consultation.description":
      "Butuh saran? Tim kami siap membantu Anda menemukan sepeda motor listrik yang paling sesuai dengan kebutuhan Anda.",
    "showroom.financing.title": "Simulasi Pembiayaan",
    "showroom.financing.description":
      "Dapatkan opsi pembelian yang fleksibel melalui program cicilan dan penawaran menarik lainnya.",
    "showroom.service.title": "Layanan dan Purna Jual",
    "showroom.service.description":
      "Kami berkomitmen untuk memberikan layanan purna jual terbaik, termasuk servis resmi dan penggantian suku cadang.",
    "showroom.bookVisit": "Booking Kunjungan",
    "showroom.viewModels": "Pergi ke Showroom",

    // About Us Page
    "about.tag": "Cerita Kami",
    "about.title": "Tentang",
    "about.titleHighlight": "Wedison Group",
    "about.overview.title": "WEDISON: Pelopor Energi Hijau dalam Mobilitas",
    "about.overview.p1":
      "Wedison adalah perusahaan teknologi terkemuka. Kami adalah perusahaan sepeda motor listrik pengisian cepat pertama di Indonesia. Bagi kami, ini bukan hanya tentang menjual sepeda motor listrik, ini tentang menciptakan ekosistem hijau yang mendorong mobilitas berkelanjutan di seluruh dunia.",
    "about.overview.p2":
      "Dipasangkan dengan sistem pengisian listrik canggih kami, sepeda motor listrik kami akan memperkaya gaya hidup konsumen kami dan memperbaiki lingkungan kita.",
    "about.mission.title": "Misi Kami",
    "about.mission.p1":
      "Menciptakan platform dan ekosistem EV energi hijau yang berkelas dunia, cerdas, dan ramah lingkungan.",
    "about.mission.p2":
      "Menyediakan solusi transportasi ekonomis dan menempatkan Sepeda Motor Listrik Wedison di setiap rumah tangga di Indonesia dan negara-negara Asia Tenggara.",
    "about.values.title": "Nilai-Nilai Inti Kami",
    "about.values.innovation.title": "Inovasi Kendaraan Listrik",
    "about.values.innovation.description":
      "Kami berkomitmen untuk mengembangkan kendaraan listrik hemat energi yang dapat diakses oleh masyarakat luas, mendukung transisi ke transportasi ramah lingkungan.",
    "about.values.partnerships.title": "Kemitraan dan Kolaborasi",
    "about.values.partnerships.description":
      "Kami berkolaborasi dengan berbagai industri untuk mempercepat pengembangan infrastruktur kendaraan listrik, termasuk stasiun pengisian dan teknologi baterai.",
    "about.values.experience.title":
      "Pengalaman Pengguna Berorientasi Masa Depan",
    "about.values.experience.description":
      "Menciptakan pengalaman berkendara yang ramah pengguna untuk setiap konsumen, dan mengembangkan fitur cerdas yang memenuhi kebutuhan masyarakat modern.",
    "about.projects.title": "Proyek Kami",
    "about.projects.future.title":
      "Menciptakan Masa Depan Hijau yang Lebih Cerah",
    "about.projects.future.description":
      "Memanfaatkan energi terbarukan untuk mengurangi emisi karbon dan mendukung lingkungan yang lebih sehat. Memperluas pasar kendaraan listrik (EV), menjadikan komunitas lebih bersih dan transportasi lebih terjangkau bagi semua orang.",
    "about.projects.charging.title": "Pengisian SuperCharge",
    "about.projects.charging.description":
      "Kami membangun infrastruktur pengisian yang kuat untuk mendukung ekosistem kendaraan listrik yang berkembang sambil menciptakan peluang penghematan waktu bagi bisnis.",
    "about.offers.title": "Apa yang Kami Tawarkan",
    "about.offers.motorcycles.title": "Model Sepeda Motor Listrik",
    "about.offers.motorcycles.description":
      "Kami menawarkan berbagai model sepeda motor listrik, masing-masing dirancang untuk memenuhi kebutuhan dan preferensi pelanggan yang beragam.",
    "about.offers.charging.title": "Stasiun Pengisian SuperCharge",
    "about.offers.charging.description":
      "Kami menawarkan stasiun pengisian SuperCharge, menyediakan solusi pengisian yang cepat dan nyaman, memastikan bahwa pengguna sepeda motor listrik dapat dengan mudah mengisi daya kendaraan mereka dan tetap di jalan lebih lama.",
    "about.joinUs": "Bergabunglah dengan Misi Kami",
    "about.joinUsDescription":
      "Bergabunglah dengan kami dalam misi kami untuk menciptakan masa depan yang berkelanjutan melalui mobilitas listrik. Bersama-sama, kita dapat membuat perbedaan.",
    "about.contactUs": "Hubungi Kami",

    // Contact Page
    "contact.page.description":
      "Punya pertanyaan atau butuh bantuan? Kami siap membantu. Hubungi kami menggunakan salah satu metode di bawah ini.",
    "contact.page.findUs": "Temukan Kami",
    "contact.page.openInMaps": "Buka di Google Maps",
    "contact.page.hours": "Jam Kerja",
    "contact.page.business.hours": "Senin - Jumat: 09.00 AM - 06.00 PM",
    "contact.page.faqTitle": "Pertanyaan yang Sering Diajukan",
    "contact.page.thankYou": "Terima Kasih!",
    "contact.page.messageReceived":
      "Kami telah menerima pesan Anda dan akan segera menghubungi Anda kembali.",
    "contact.page.sendAnother": "Kirim Pesan Lain",
    "contact.page.sending": "Mengirim...",
    "contact.page.faq.q1":
      "Bagaimana cara melakukan test ride sepeda motor Wedison?",
    "contact.page.faq.a1":
      "Anda dapat menjadwalkan test ride dengan mengunjungi showroom kami atau memesan janji melalui situs web kami. Tim kami akan memandu Anda melalui proses dan membantu Anda mengalami sepeda motor listrik kami secara langsung.",
    "contact.page.faq.q2":
      "Garansi apa yang disertakan dengan sepeda motor Wedison?",
    "contact.page.faq.a2":
      "Semua sepeda motor Wedison dilengkapi dengan garansi komprehensif 3 tahun untuk sepeda motor dan garansi 5 tahun untuk baterai. Ini mencakup cacat produksi dan memastikan ketenangan pikiran bagi pelanggan kami.",
    "contact.page.faq.q3":
      "Berapa lama waktu yang dibutuhkan untuk mengisi daya sepeda motor Wedison?",
    "contact.page.faq.a3":
      "Waktu pengisian bervariasi menurut model, tetapi dengan jaringan SuperCharge kami, sebagian besar model dapat mengisi daya dari 10% hingga 80% hanya dalam 15 menit. Pengisian penuh menggunakan stopkontak rumah standar biasanya membutuhkan waktu 3-4 jam.",
    "contact.page.faq.q4": "Apakah Anda menawarkan opsi pembiayaan?",
    "contact.page.faq.a4":
      "Ya, kami menawarkan opsi pembiayaan yang fleksibel untuk membuat kepemilikan sepeda motor Wedison lebih terjangkau. Tim kami dapat membantu Anda menjelajahi rencana pembayaran yang sesuai dengan anggaran dan kebutuhan Anda.",

    //calculator
    "calculator.page.tag": "Kalkulator Penghematan",
    "calculator.page.title": "Hitung ",
    "calculator.page.titleHighlight": "Penghematanmu Sekarang",
    "calculator.page.description":
      "Cari tahu berapa banyak biaya yang bisa kamu hemat dengan beralih dari motor bensin ke motor listrik Wedison. Geser slidernya, bandingkan biaya bulanan, dan lihat perbedaannya sendiri. Saatnya berkendara lebih hemat dan ramah lingkungan.",
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
      "Rasakan cara baru yang berani untuk bergerak – bertenaga, pengisian cepat, dan 100% listrik. Dibuat untuk gaya, diciptakan untuk kebebasan.",
    "edmax.hero.orderNow": "Pesan Sekarang",
    "edmax.hero.downloadBrochure": "Unduh Brosur",

    "edmax.feature1.tag": "Smart Display",
    "edmax.feature1.title": "Konektivitas Cerdas di Ujung Jari Anda",
    "edmax.feature1.subtitle":
      "Wireless Apple CarPlay & Android Auto, Full Layar Touch Screen",
    "edmax.feature1.description":
      "Terhubung tanpa repot. Akses navigasi, musik, dan komunikasi langsung dari layar sentuh penuh warna dengan dukungan Apple CarPlay dan Android Auto nirkabel.",
    "edmax.feature1.range": "Jarak Tempuh",
    "edmax.feature1.efficient": "Efisien",
    "edmax.feature1.energyUse": "Penggunaan Energi",
    "edmax.feature1.realtime": "Waktu Nyata",
    "edmax.feature1.rangeIndicator": "Indikator Jarak",

    "edmax.feature2.tag": "Pengisian Super Cepat",
    "edmax.feature2.title": "Isi Daya dalam Hitungan Menit",
    "edmax.feature2.subtitle": "Teknologi Pengisian Super Cepat",
    "edmax.feature2.description":
      "Dari 10 hingga 80% hanya dalam 15 menit. Karena waktu Anda terlalu berharga untuk disia-siakan.",
    "edmax.feature2.charge": "Pengisian 10-80%",
    "edmax.feature2.universal": "Universal",
    "edmax.feature2.chargingPort": "Port Pengisian",
    "edmax.feature2.smart": "Pintar",
    "edmax.feature2.chargingApp": "Aplikasi Pengisian",

    "edmax.feature3.title": "Dirancang untuk Menarik Perhatian",
    "edmax.feature3.subtitle": "Tajam. Sporty. Ikonik.",
    "edmax.feature3.description":
      "Dengan lekukan yang berani dan tepi yang tajam, EdPower menghadirkan gaya agresif dengan presisi aerodinamis. Berkendara dengan gaya, selalu.",
    "edmax.feature3.aerodynamic": "Aerodinamis",
    "edmax.feature3.design": "Desain",
    "edmax.feature3.led": "LED",
    "edmax.feature3.lighting": "Pencahayaan",
    "edmax.feature3.premium": "Premium",
    "edmax.feature3.materials": "Material",

    "edmax.color.title": "Tentukan",
    "edmax.color.titleHighlight": "Gayamu",
    "edmax.color.description":
      "Pilih warna EdPower favorit Anda dan lihat tampilannya.",

    "edmax.specs.title": "Spesifikasi",
    "edmax.specs.description":
      "Jelajahi detail teknis sepeda motor listrik EdPower.",
    "edmax.specs.engine": "Mesin",
    "edmax.specs.battery": "Baterai",
    "edmax.specs.brake": "Rem",
    "edmax.specs.dimension": "Dimensi",
    "edmax.specs.tire": "Ban",
    "edmax.specs.suspension": "Suspensi",

    // edpower
    "edpower.productPage.hero.imageAlt":
      "Tampilan penuh EDPower dari sudut depan tiga perempat, menonjolkan desain maxi-scooter yang kokoh dan fitur premiumnya.",
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
      "Tampilan samping dramatis EDPower, menonjolkan jok lebar, posisi berkendara kokoh, dan tampilan futuristik.",
    "edpower.productPage.productOverview.title":
      "Kekuatan Utama, Kenyamanan Tak Tertandingi.",
    "edpower.productPage.productOverview.description":
      "Inilah EDPower—skuter listrik andalan dari Wedison. Dengan jok luas, desain futuristik, dan jarak tempuh terbaik hingga 160 km, EDPower menetapkan standar baru untuk kendaraan roda dua listrik. Nikmati kenyamanan tingkat lanjut, konektivitas canggih, dan tenaga yang siap menjelajah jauh. Dirancang bagi mereka yang menuntut yang terbaik.",

    "edpower.productPage.productHighlight1.imageAlt":
      "Tampilan kokpit menampilkan layar TFT besar dengan antarmuka Apple CarPlay & Android Auto",
    "edpower.productPage.productHighlight1.title":
      "Wireless Apple CarPlay & Android Auto",
    "edpower.productPage.productHighlight1.description":
      "Hubungkan smartphone Anda dengan mudah melalui Apple CarPlay atau Android Auto tanpa kabel—untuk navigasi, panggilan, musik, dan lainnya langsung dari layar berwarna skuter Anda. Tetap terhubung dan terkendali, ke mana pun Anda melaju.",

    "edpower.productPage.productHighlight2.imageAlt":
      "Bagasi bawah jok terbuka menampilkan ruang ekstra besar",
    "edpower.productPage.productHighlight2.title": "Bagasi XXL di Bawah Jok",
    "edpower.productPage.productHighlight2.description":
      "Bawa semua yang Anda butuhkan untuk perjalanan kota maupun jarak jauh. Bagasi bawah jok EDPower yang sangat besar dengan mudah memuat dua helm, belanjaan, atau seluruh perlengkapan penting Anda.",

    "edpower.productPage.productHighlight3.imageAlt":
      "Tampilan belakang tiga perempat menonjolkan postur EDPower yang lebar dan jok ekstra luas",
    "edpower.productPage.productHighlight3.title":
      "Kenyamanan & Ruang Tanpa Tanding",
    "edpower.productPage.productHighlight3.description":
      "Dengan jok ekstra lebar dan empuk serta posisi berkendara ergonomis, EDPower menghadirkan kenyamanan sepanjang hari—ideal untuk perjalanan harian atau liburan akhir pekan.",

    "edpower.productPage.productHighlight4.imageAlt":
      "Tampilan depan menampilkan lampu LED canggih dan bodi modern",
    "edpower.productPage.productHighlight4.title":
      "Desain Modern yang Mencuri Perhatian",
    "edpower.productPage.productHighlight4.description":
      "Dari bagian depan yang tegas hingga bodi belakang yang sculpted, setiap detail EDPower dirancang untuk menarik perhatian. Rasakan masa depan dengan penuh percaya diri dan gaya.",

    "edpower.productPage.productHighlight5.imageAlt":
      "Indikator baterai/jarak tempuh pada dashboard, tampilan close-up",
    "edpower.productPage.productHighlight5.title":
      "Jarak Tempuh Terbaik 160 km",
    "edpower.productPage.productHighlight5.description":
      "Jelajahi lebih jauh dari sebelumnya. Dengan jarak tempuh hingga 160 km dalam sekali pengisian, EDPower siap menjelajah kota maupun luar kota—tanpa batas, hanya kebebasan.",

    "edpower.productPage.chargingOverview.imageAlt":
      "EDPower terparkir di showroom Wedison dengan stasiun SuperCharge dan charger rumah yang terlihat",
    "edpower.productPage.chargingOverview.title":
      "Pengisian Cepat & Fleksibel untuk Setiap Gaya Hidup",
    "edpower.productPage.chargingOverview.description":
      "EDPower menyesuaikan jadwal Anda dengan dua pilihan pengisian daya yang mudah: SuperCharge ultra-cepat di showroom Wedison, atau pengisian semalam yang praktis di rumah. Selalu bertenaga, selalu siap berangkat.",

    "edpower.productPage.chargingHighlight1.imageAlt":
      "EDPower terhubung ke stasiun SuperCharge Wedison",
    "edpower.productPage.chargingHighlight1.title": "Wedison SuperCharge",
    "edpower.productPage.chargingHighlight1.description": (
      <>
        Isi daya dari 10% ke 80% hanya dalam 15 menit. Sempurna untuk isi cepat
        di sela aktivitas—tersedia di seluruh showroom Wedison.{" "}
        <Link href="/super-charge" className="underline text-primary">
          Pelajari Lebih Lanjut
        </Link>
      </>
    ),

    "edpower.productPage.chargingHighlight2.imageAlt":
      "EDPower terhubung ke charger rumah di garasi modern yang bersih",
    "edpower.productPage.chargingHighlight2.title":
      "Pengisian Daya di Rumah Tanpa Repot",
    "edpower.productPage.chargingHighlight2.description":
      "Colokkan di rumah dan mulai hari Anda dengan baterai penuh. EDPower membuat pengisian semalam menjadi mudah dan tanpa khawatir.",

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
      "Dash adalah motor listrik yang dirancang untuk pengiriman. Dilengkapi dudukan box belakang, keranjang depan, dan cocok untuk usaha logistik, makanan, hingga kurir",

    "dash.hero.tag": "Motor Delivery",
    "dash.hero.title": "Efisiensi Maksimal untuk",
    "dash.hero.titleHighlight": "Setiap Pengantaran",
    "dash.hero.description":
      "Dash hadir sebagai solusi motor listrik ideal untuk kebutuhan pengiriman harian yang tangguh dan hemat energi.",
    "dash.hero.orderNow": "Pesan Sekarang",
    "dash.hero.downloadBrochure": "Unduh Brosur",

    "dash.feature1.tag": "Pengiriman Tanpa Batas",
    "dash.feature1.title": "Dirancang untuk Pengiriman Tanpa Batas",
    "dash.feature1.subtitle": "Slot fleksibel untuk berbagai jenis box",
    "dash.feature1.description":
      "Slot belakang siap digunakan dengan coolbox, container, atau box lain sesuai kebutuhan pengirimanmu. Ringkas, stabil, dan bikin pengantaran makin praktis.",

    "dash.feature2.tag": "Dirancang Untuk Pengiriman",
    "dash.feature2.title": "Satu Jok, Seribu Tujuan",
    "dash.feature2.subtitle": "Praktis, ringan, dan efisien",
    "dash.feature2.description":
      "Tanpa kursi penumpang, Dash lebih ringan dan efisien. Ideal untuk operasional harian seperti pengiriman makanan, barang, atau kebutuhan logistik ringan.",

    "dash.color.title": "Ekspresikan",
    "dash.color.titleHighlight": "Gaya Anda",
    "dash.color.description":
      "Pilih warna yang sesuai dengan kepribadian Anda dan menonjol di lanskap perkotaan.",

    "dash.specs.title": "Spesifikasi",
    "dash.specs.description":
      "Temukan detail teknis yang membuat Dash sempurna untuk petualangan perkotaan.",
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
      "Victory hadir sebagai skuter listrik serbaguna dengan desain ramping, cocok untuk city ride dengan gaya sporty yang modern.",
    "victory.hero.orderNow": "Pesan Sekarang",
    "victory.hero.downloadBrochure": "Unduh Brosur",

    "victory.feature1.tag": "City Riding Nyaman",
    "victory.feature1.title": "Ukuran Ideal untuk Perkotaan",
    "victory.feature1.subtitle": "Tidak terlalu kecil, tidak terlalu besar",
    "victory.feature1.description":
      "Victory dirancang dengan dimensi pas untuk manuver perkotaan—mudah dikendalikan di jalan sempit, tapi tetap terasa kokoh dan stabil.",

    "victory.feature2.tag": "Desain Sporty",
    "victory.feature2.title": "Tampil Gahar & Modern",
    "victory.feature2.subtitle": "Mirip skutik performa tinggi",
    "victory.feature2.description":
      "Tampilan Victory terinspirasi dari desain skuter sporty, menjadikannya pilihan ideal untuk kamu yang ingin tampil beda dan tetap efisien.",

    "victory.color.description":
      "Pilih warna Victory favoritmu dan lihat tampilannya.",

    // ===

    "victory.productPage.hero.imageAlt": "Victory Abu-Abu",
    "victory.productPage.hero.title": "VICTORY",
    "victory.productPage.hero.description":
      "Taklukkan jalanan dengan gaya dan performa.",
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
    "victory.productPage.productOverview.title":
      "Sporty, Lincah, Tak Terhentikan.",
    "victory.productPage.productOverview.description":
      "Victory dari Wedison menghadirkan tingkat sportiness dan kelincahan baru dalam mobilitas listrik. Dirancang khusus untuk berkendara di kota, Victory memadukan tampilan agresif, akselerasi super cepat, dan kendali yang luar biasa. Dengan wheelbase lebar dan rem cakram CBS canggih, Anda akan merasa percaya diri di setiap tikungan. Tempuh jarak hingga 120 km dan isi daya dalam hitungan menit—Victory selalu membawa Anda selangkah lebih maju di setiap perjalanan.",

    "victory.productPage.productHighlight1.imageAlt": "Tampilan Depan Victory",
    "victory.productPage.productHighlight1.title": "Desain Sporty yang Ikonik",
    "victory.productPage.productHighlight1.description":
      "Victory tampil mencolok dengan bentuk aerodinamis yang tegas dan pencahayaan LED bergaya tajam—dirancang untuk pengendara yang ingin tampil beda di setiap lampu merah.",

    "victory.productPage.productHighlight2.imageAlt":
      "Tampilan tiga perempat depan menunjukkan ban lebar dan suspensi",
    "victory.productPage.productHighlight2.title":
      "Kendali Urban yang Superior",
    "victory.productPage.productHighlight2.description":
      "Ban lebar, daya cengkeram tinggi, dan suspensi hidrolik memberikan pengendalian yang presisi dan alami di berbagai kondisi—sempurna untuk gaya hidup kota yang dinamis.",

    "victory.productPage.productHighlight3.imageAlt":
      "Tampilan dekat port SuperCharge dengan branding Wedison",
    "victory.productPage.productHighlight3.title": "Siap SuperCharge",
    "victory.productPage.productHighlight3.description":
      "Isi daya dari 10% ke 80% hanya dalam 15 menit dengan Wedison SuperCharge, atau isi daya di rumah untuk fleksibilitas penuh.",

    "victory.productPage.chargingOverview.imageAlt":
      "Victory terparkir di showroom Wedison, dengan stasiun SuperCharge di latar",
    "victory.productPage.chargingOverview.title": "Isi Daya Sesuai Gaya Anda",
    "victory.productPage.chargingOverview.description":
      "Isi daya dalam hitungan menit dengan SuperCharge di seluruh showroom Wedison, atau isi ulang dengan mudah di rumah. Victory menyesuaikan gaya hidup Anda—selalu siap untuk langkah berikutnya.",

    "victory.productPage.chargingHighlight1.imageAlt":
      "Victory di stasiun SuperCharge Wedison, kabel terhubung",
    "victory.productPage.chargingHighlight1.title": "SuperCharge Super Cepat",
    "victory.productPage.chargingHighlight1.description": (
      <>
        Isi daya dari 10% ke 80% hanya dalam 15 menit—sempurna untuk berhenti
        sejenak di hari yang sibuk. Tersedia di semua showroom Wedison.{" "}
        <Link href="/super-charge" className="underline text-primary">
          Pelajari Lebih Lanjut
        </Link>
      </>
    ),

    "victory.productPage.chargingHighlight2.imageAlt":
      "Victory terhubung ke charger rumah di garasi modern",
    "victory.productPage.chargingHighlight2.title":
      "Pengisian Daya Harian di Rumah",
    "victory.productPage.chargingHighlight2.description":
      "Colokkan di rumah dan bangun dengan baterai penuh. Dengan charger rumahan bawaan, Victory selalu siap diajak berangkat—praktis, mudah, dan bisa diandalkan.",

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
    "athena.productPage.productOverview.title":
      "Keanggunan Tak Lekang Waktu, Kini Teraliri Energi Baru",
    "athena.productPage.productOverview.description":
      "Athena dari Wedison memadukan keanggunan klasik skuter Eropa dengan teknologi listrik terkini. Dirancang untuk mencuri perhatian tanpa mengundang bising, Athena menghadirkan sentuhan baru penuh gaya di jalanan kota—mengantar Anda melaju mulus dan senyap di setiap perjalanan. Dengan jangkauan hingga 120 km dalam sekali pengisian, rem cakram CBS yang tangguh, serta suspensi hidrolik canggih, Athena bukan sekadar kendaraan. Ini adalah sebuah pengalaman, dirancang bagi mereka yang mendambakan gaya tanpa usaha dan performa generasi baru. Isi daya cepat di showroom Wedison atau nikmati kemudahan charging di rumah—Athena siap menyesuaikan diri dengan gaya hidup modern Anda.",

    "athena.productPage.productHighlight1.imageAlt": "Head unit Athena",
    "athena.productPage.productHighlight1.title": "Layar Digital Canggih",
    "athena.productPage.productHighlight1.description":
      "Panel instrumen LCD Athena yang jernih dan terang memberikan semua informasi penting tentang perjalanan secara sekilas. Sederhana, digital, dan andal, sehingga Anda dapat fokus pada jalan di depan, bebas dari gangguan.",

    "athena.productPage.productHighlight2.imageAlt": "Athena SuperCharge",
    "athena.productPage.productHighlight2.title": "SuperCharge",
    "athena.productPage.productHighlight2.description":
      "Isi daya dari 10% hingga 80% hanya dalam 15 menit dengan Wedison SuperCharge (tersedia di seluruh showroom), atau isi daya dengan mudah di rumah hingga penuh dalam kurang dari 4 jam. Athena dirancang untuk mengikuti ritme kota yang tak pernah berhenti.",

    "athena.productPage.productHighlight3.imageAlt":
      "Sistem Pengereman CBS Athena",
    "athena.productPage.productHighlight3.title": "Dirancang untuk Perkotaan",
    "athena.productPage.productHighlight3.description":
      "Dengan rem cakram CBS di depan dan belakang, serta ban lebar yang stabil, Athena menghadirkan kendali lincah dan pengereman yang meyakinkan—memungkinkan Anda melaju di jalanan kota dengan percaya diri, nyaman, dan penuh gaya.",

    "athena.productPage.chargingOverview.imageAlt":
      "Athena Hijau dengan SuperCharge dan Home Charging",
    "athena.productPage.chargingOverview.title": "Pengisian Daya Tanpa Ribet",
    "athena.productPage.chargingOverview.description":
      "Tetap bergerak dengan solusi pengisian daya fleksibel dari Athena. Cukup colokkan di rumah untuk kenyamanan sehari-hari, atau nikmati kecepatan SuperCharge di seluruh showroom Wedison. Athena memberi Anda kebebasan untuk memilih—isi daya di tempat tinggal, atau isi cepat saat sedang bepergian.",

    "athena.productPage.chargingHighlight1.imageAlt":
      "Athena dengan SuperCharge",
    "athena.productPage.chargingHighlight1.title":
      "15-Menit dengan SuperCharge",
    "athena.productPage.chargingHighlight1.description": (
      <>
        Rasakan pengisian daya super cepat dengan teknologi SuperCharge canggih
        kami—dirancang agar Anda tetap bisa melaju, mengisi daya baterai dari
        10% hingga 80% hanya dalam 15 menit.{" "}
        <Link href="/super-charge" className="underline text-primary">
          Pelajari Lebih Lanjut
        </Link>
      </>
    ),

    "athena.productPage.chargingHighlight2.imageAlt":
      "Athena dengan Home Charger",
    "athena.productPage.chargingHighlight2.title":
      "Pengisian Daya di Rumah yang Praktis",
    "athena.productPage.chargingHighlight2.description":
      "Isi daya semalaman, atau kapan pun sesuai jadwal Anda. Charger rumahan bawaan Athena mampu mengisi penuh baterai dalam waktu kurang dari empat jam—tanpa suara, tanpa repot, dan selalu siap saat Anda butuh.",

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
      "Bees hadir sebagai motor listrik paling ringan dan gesit dari Wedison. Cocok untuk pelajar, pekerja, atau siapa pun yang butuh kendaraan efisien dengan harga terjangkau.",
    "bees.hero.orderNow": "Pesan Sekarang",
    "bees.hero.downloadBrochure": "Unduh Brosur",

    "bees.feature1.tag": "Ukuran Ringkas, Lincah",
    "bees.feature1.title": "Desain Kompak, Manuver Maksimal",
    "bees.feature1.subtitle": "Ringan dan gesit untuk kota padat",
    "bees.feature1.description":
      "Dengan bodi mungil dan bobot ringan, Bees ideal untuk selap-selip di jalanan sempit dan padat. Gerak cepat, hemat ruang, dan nyaman dikendarai.",

    "bees.feature2.tag": "Terjangkau dan Praktis",
    "bees.feature2.title": "Harga Ekonomis, Bisa Disubsidi",
    "bees.feature2.subtitle": "Hemat biaya dan mudah diakses",
    "bees.feature2.description":
      "Bees termasuk kendaraan yang memenuhi syarat subsidi pemerintah. Biaya hemat, bisa charge di rumah, dan cocok untuk semua kalangan.",

    "bees.color.description":
      "Pilih warna Bees favoritmu dan lihat tampilannya.",

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
    "bees.productPage.productOverview.title":
      "Kecil Ukurannya, Besar Pengalamannya.",
    "bees.productPage.productOverview.description":
      "Kompak namun kaya fitur—Bees hadir dengan bagasi bawah jok XL, layar LED digital yang modern, dan rem cakram ganda yang andal. Pengisian daya di rumah yang praktis membuat setiap hari lebih mudah.",

    "bees.productPage.productHighlight1.imageAlt": "Bagasi Bawah Jok Bees",
    "bees.productPage.productHighlight1.title": "Bagasi XL di Bawah Jok",
    "bees.productPage.productHighlight1.description":
      "Bawa lebih banyak di setiap perjalanan. Kompartemen bawah jok Bees yang ekstra luas bisa memuat ransel, belanjaan, bahkan helm full-face—lebih banyak ruang, lebih banyak kemungkinan.",

    "bees.productPage.productHighlight2.imageAlt": "Tampilan LED Bees",
    "bees.productPage.productHighlight2.title": "Tampilan Digital LED",
    "bees.productPage.productHighlight2.description":
      "Tetap terinformasi dan terkendali dengan layar LED digital modern yang tajam. Lihat kecepatan, baterai, dan info lainnya secara real-time—cukup dengan sekali lirik.",

    "bees.productPage.productHighlight3.imageAlt": "Rem Cakram Bees",
    "bees.productPage.productHighlight3.title": "Rem Cakram Ganda yang Andal",
    "bees.productPage.productHighlight3.description":
      "Nikmati kekuatan pengereman maksimal dan rasa aman dengan rem cakram di roda depan dan belakang. Memberikan pengereman yang halus dan responsif dalam segala kondisi—untuk perjalanan yang tenang dan percaya diri.",

    "bees.productPage.chargingOverview.imageAlt":
      "Bees Merah sedang diisi daya di colokan rumah",
    "bees.productPage.chargingOverview.title":
      "Pengisian Daya di Rumah yang Simpel",
    "bees.productPage.chargingOverview.description":
      "Isi daya dengan mudah dari colokan listrik biasa. Dengan charger rumah bawaan, Bees selalu siap menemani perjalanan berikutnya—tanpa perlu fast-charging, cukup colokkan dan jalan.",

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
      "SuperCharge perjalananmu dengan pengisian cepat dan andal. Isi daya dari 10% ke 80% hanya dalam 15 menit.",
    "supercharge.hero.tag": "Fast Charging",
    "supercharge.hero.title": "Isi Daya dari 10% ke 80%",
    "supercharge.hero.titleHighlight": "Hanya 15 Menit",
    "supercharge.hero.description":
      "SuperCharge adalah solusi pengisian cepat eksklusif dari Wedison. Didesain khusus untuk Edmax, Athena, dan Victory — rasakan efisiensi tanpa kompromi.",
    "supercharge.hero.ctaPrimary": "Temukan Lokasi",
    "supercharge.hero.ctaSecondary": "Pelajari Teknologi",

    "supercharge.video.title": "SuperCharge: Solusi Charging Masa Depan",
    "supercharge.video.description":
      "SuperCharge hadir untuk memberikan pengalaman isi daya yang lebih cepat, aman, dan praktis bagi kendaraan listrik Anda.",

    "supercharge.feature1.tag": "Cepat dan Andal",
    "supercharge.feature1.title": "Teknologi Pengisian Generasi Baru",
    "supercharge.feature1.subtitle": "Waktu lebih singkat, performa maksimal",
    "supercharge.feature1.description":
      "Dengan teknologi fast charge terbaru, SuperCharge mampu mengisi baterai dari 10% ke 80% hanya dalam 15 menit. Hemat waktu, tanpa mengorbankan kualitas.",

    "supercharge.feature2.tag": "Tersebar Nasional",
    "supercharge.feature2.title": "Lebih dari 100 Titik SuperCharge",
    "supercharge.feature2.subtitle":
      "Dimanapun kamu berkendara, kami siap isi daya",
    "supercharge.feature2.description":
      "SuperCharge tersedia di lebih dari 100 titik strategis di Indonesia, memudahkan kamu untuk tetap bergerak tanpa harus khawatir kehabisan daya.",

    "supercharge.feature3.tag": "Andal. Aman. Patuh Regulasi.",
    "supercharge.feature3.title": "Dirancang untuk Tahan Lama",
    "supercharge.feature3.subtitle":
      "Keselamatan dan keandalan adalah prioritas",
    "supercharge.feature3.description":
      "Stasiun pengisian daya DC kami dirancang untuk bekerja secara sempurna dengan motor listrik Wedison Anda, memastikan pengisian daya cepat sekaligus menjaga umur baterai. Telah tersertifikasi penuh sesuai standar keselamatan IEC dan mematuhi Direktif Uni Eropa, memberikan daya yang aman, efisien, dan andal untuk motor Anda—setiap saat.",

    // SuperCharge App Section
    "supercharge.app.tag": "Aplikasi Mobile",
    "supercharge.app.teaser.title": "Cari. Isi Daya.",
    "supercharge.app.teaser.titleHighlight": "Jalan.",
    "supercharge.app.teaser.description":
      "Temukan stasiun SuperCharge terdekat, cek ketersediaan secara real-time, dan mulai pengisian daya — langsung dari ponselmu.",
    "supercharge.app.teaser.feature.find": "Cari Stasiun",
    "supercharge.app.teaser.feature.realtime": "Real-Time",
    "supercharge.app.teaser.feature.charge": "Isi Cepat",

    "supercharge.app.hero.title": "Teman Pengisian Dayamu,",
    "supercharge.app.hero.titleHighlight": "Selalu di Genggaman",
    "supercharge.app.hero.description":
      "Pantau status pengisian daya, temukan stasiun terdekat, dan kelola sesi SuperCharge-mu — semua yang kamu butuhkan dalam satu aplikasi.",

    "supercharge.app.feature1.icon": "MapPin",
    "supercharge.app.feature1.title": "Temukan Stasiun Terdekat",
    "supercharge.app.feature1.subtitle": "Cari titik pengisian di sekitarmu",
    "supercharge.app.feature1.description":
      "Lihat semua stasiun SuperCharge di peta interaktif dengan status ketersediaan real-time.",
    "supercharge.app.feature1.bullet1": "Peta interaktif dengan navigasi GPS",
    "supercharge.app.feature1.bullet2":
      "Filter berdasarkan ketersediaan & jarak",
    "supercharge.app.feature1.bullet3": "Simpan stasiun favorit",

    "supercharge.app.feature2.icon": "Activity",
    "supercharge.app.feature2.title": "Status Pengisian Real-Time",
    "supercharge.app.feature2.subtitle": "Ketahui sebelum berangkat",
    "supercharge.app.feature2.description":
      "Cek ketersediaan stasiun, status antrian, dan estimasi waktu tunggu sebelum kamu pergi.",
    "supercharge.app.feature2.bullet1": "Update ketersediaan langsung",
    "supercharge.app.feature2.bullet2": "Informasi kecepatan pengisian",
    "supercharge.app.feature2.bullet3": "Status antrian & waktu tunggu",

    "supercharge.app.feature3.icon": "Zap",
    "supercharge.app.feature3.title": "Pengalaman Pengisian Mudah",
    "supercharge.app.feature3.subtitle": "Colok, isi daya, dan jalan",
    "supercharge.app.feature3.description":
      "Mulai dan pantau sesi pengisian dayamu langsung dari aplikasi dengan satu ketukan.",
    "supercharge.app.feature3.bullet1": "Mulai pengisian dengan satu ketukan",
    "supercharge.app.feature3.bullet2": "Pemantauan pengisian real-time",
    "supercharge.app.feature3.bullet3": "Riwayat sesi & analitik",

    "supercharge.app.stats.stations": "Stasiun",
    "supercharge.app.stats.downloads": "Unduhan",
    "supercharge.app.stats.rating": "Rating",
    "supercharge.app.stats.chargeTime": "Menit Isi Daya",

    "supercharge.app.cta.title": "Siap SuperCharge",
    "supercharge.app.cta.titleHighlight": "Perjalananmu?",
    "supercharge.app.cta.description":
      "Unduh sekarang dan tak perlu khawatir mencari charger lagi.",

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
    "form.hasMotor": "Apakah Anda memiliki motor saat ini?",
    "form.vehicle": "Jenis Kendaraan anda",
    "form.vehicle.placeholder": "Contoh: Wedison / Edmax / 2023",
    "form.vehicle.description": "Format: Merek / Model / Tahun",
    "form.sending.success.title": "Pesan Berhasil Dikirim!",
    "form.sending.success.description":
      "Terima kasih telah menghubungi kami. Kami akan segera menghubungi Anda.",
    "form.sending.error.title": "Terjadi Kesalahan Saat Mengirim Pesan",
    "form.sending.error.description":
      "Terjadi kesalahan saat mengirim pesan Anda. Silakan coba lagi nanti atau hubungi kami melalui saluran lain.",
    "form.sending.sending": "Mengirim pesan Anda... Silahkan tunggu.",
    "form.agreePrivacy.description": (
      <>
        Mengizinkan PT Wedison untuk menggunakan informasi di atas dan
        menghubungi Saya melalui email dan/atau telepon atau sarana komunikasi
        pribadi lainnya untuk kegiatan pelayanan kepada customer sesuai dengan{" "}
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
                Dengan mengirimkan formulir ini, Anda menyetujui bahwa Wedison
                dapat mengumpulkan dan menggunakan data pribadi Anda hanya untuk
                menanggapi pertanyaan Anda. Informasi Anda tidak akan dibagikan
                kepada pihak ketiga tanpa persetujuan Anda.
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
    "faq.Battery.questions.0.question": "Apa jaminan untuk baterai?",
    "faq.Battery.questions.0.answer":
      "Baterai Wedison dilindungi garansi 3 tahun",
    "faq.Battery.questions.1.question":
      "Berapa lama waktu yang dibutuhkan untuk mengisi baterai hingga penuh?",
    "faq.Battery.questions.1.answer":
      "Wedison SuperCharge: 10% hingga 80% dalam 15 menit/ 10% hingga 95% dalam 20 menit\nWedison Regular Charge: Bervariasi tergantung adaptor dan ukuran baterai, dengan durasi antara 2 hingga 10 jam.",
    "faq.Battery.questions.2.question": "Jenis baterai apa yang Anda gunakan?",
    "faq.Battery.questions.2.answer":
      "Wedison EV menggunakan Baterai Lithium-ion (LFP), jenis baterai isi ulang yang umum digunakan pada perangkat seperti smartphone, laptop, dan kendaraan listrik.\n\nKarakteristik Baterai Lithium-ion adalah sebagai berikut:\nA. Kepadatan energi tinggi: Dapat menyimpan energi listrik yang cukup besar dalam paket yang lebih kecil dan ringan.\nB. Tahan suhu tinggi: Berkinerja efisien pada suhu tinggi hingga 45 derajat celsius dan tahan terhadap suhu rendah tanpa mengalami kerusakan.\nC. Tingkat self-discharge rendah: Baterai mempertahankan energinya dengan efektif bahkan ketika tidak digunakan selama berhari-hari atau berminggu-minggu.\nD. Jumlah siklus pengisian tinggi: Memungkinkan lebih dari 5.000 siklus pengisian sambil mempertahankan hampir seluruh kapasitas aslinya.\nE. Pengisian cepat: Wedison EV dapat diisi penuh dalam 30 menit di salah satu stasiun pengisian super cepat.",
    "faq.Battery.questions.3.question":
      "Berapa banyak jenis baterai yang Anda jual?",
    "faq.Battery.questions.3.answer":
      "Wedison menawarkan 2 variasi baterai untuk model tertentu. \nBerkendara dengan kecepatan 50km/jam, versi dasar dan extended mampu menempuh jarak masing-masing hingga 80 dan 160 km.",
    "faq.Battery.questions.4.question": "Baterai berasal dari mana?",
    "faq.Battery.questions.4.answer":
      "Baterai proprietary Wedison dikembangkan secara internal.",
    "faq.Battery.questions.5.question":
      "Berapa lama baterai Anda dapat bertahan?",
    "faq.Battery.questions.5.answer":
      "Dalam kondisi operasional normal, baterai proprietary Wedison dirancang untuk bertahan hingga 12 tahun.",
    "faq.Battery.questions.6.question":
      "Bisakah kami menggunakan baterai/pengisi daya pihak ketiga?",
    "faq.Battery.questions.6.answer":
      "Tidak, sepeda motor listrik memerlukan CAN (Controller Area Network) untuk berkomunikasi dengan komponen EV lainnya untuk operasi dan pengisian daya. Namun, baterai pihak ketiga tidak menggunakan CAN yang sama untuk komunikasi.",
    "faq.Battery.questions.7.question": "Bisakah baterai diganti?",
    "faq.Battery.questions.7.answer":
      "Ya, Wedison menyediakan suku cadang dan aksesori asli seperti baterai.",
    "faq.Battery.questions.8.question":
      "Bagaimana saya bisa menjaga baterai dalam kondisi baik?",
    "faq.Battery.questions.8.answer":
      "Selama penggunaan sehari-hari, harap coba isi daya baterai tepat waktu sebelum level turun di bawah 20% untuk membantu memperpanjang masa pakai baterai.",
    "faq.Battery.questions.9.question":
      "Bagaimana cara memperpanjang masa pakai baterai?",
    "faq.Battery.questions.9.answer":
      "Hindari mengosongkan hingga 0% atau mengisi hingga 100%. \nUsahakan untuk menjaga daya antara 20% dan 80% untuk mengurangi stres baterai dan memaksimalkan masa pakai.",
    "faq.Battery.questions.10.question":
      "Apa peringkat perlindungan masuk (IP) baterai?",
    "faq.Battery.questions.10.answer":
      "Baterai Wedison memiliki rating IP67,\nBaterai benar-benar kedap debu dan dapat direndam dalam air hingga kedalaman 1 meter selama 30 menit tanpa kerusakan.",
    "faq.Battery.questions.11.question":
      "Seberapa sering saya harus mengisi daya baterai? Saat bepergian?",
    "faq.Battery.questions.11.answer":
      "Jika kendaraan tidak digunakan untuk waktu yang lama (lebih dari seminggu), pastikan untuk mengisi dayanya setidaknya sekali setiap bulan.",
    "faq.Battery.questions.12.question":
      "Apa yang terjadi jika saya tidak menggunakan kendaraan untuk waktu yang lama?",
    "faq.Battery.questions.12.answer":
      "Matikan MCB (pemutus sirkuit) dan pastikan baterai diisi setidaknya sekali sebulan untuk menjaga kesehatannya.",

    // Charging Questions
    "faq.Charging.questions.0.question":
      "Di mana kami dapat mengisi daya motor kami?",
    "faq.Charging.questions.0.answer":
      "SuperCharge\nDi stasiun SuperCharge Wedison, yang akan secara bertahap diluncurkan di seluruh negeri.\nRegular Charge \nDi rumah/tempat dengan stopkontak dinding standar",
    "faq.Charging.questions.1.question":
      "Bagaimana kami dapat mengisi daya motor kami?",
    "faq.Charging.questions.1.answer":
      "Wedison EV dilengkapi dengan port pengisian reguler dan super yang dapat diisi di rumah dan stasiun pengisian daya yang ditentukan.",
    "faq.Charging.questions.2.question":
      "Bisakah saya menggunakan adaptor daya pihak ketiga untuk mengisi EV?",
    "faq.Charging.questions.2.answer":
      "Gunakan hanya suku cadang dan perlengkapan yang dikeluarkan Wedison untuk kesehatan dan kinerja baterai yang optimal.",
    "faq.Charging.questions.3.question":
      "Bisakah kami mengisi daya motor di rumah?",
    "faq.Charging.questions.3.answer":
      "Ya, Wedison EV memiliki port reguler untuk pengisian daya di rumah.",
    "faq.Charging.questions.4.question":
      "Apakah pengisian cepat merusak baterai?",
    "faq.Charging.questions.4.answer":
      "Baterai Wedison dirancang untuk pengisian cepat dan siklus hidup panjang tanpa menyebabkan kerusakan.",
    "faq.Charging.questions.5.question": "Apakah pengisian cepat berbahaya?",
    "faq.Charging.questions.5.answer":
      "Pengisian cepat Wedison tidak memperpendek masa pakai baterai atau menimbulkan risiko ledakan.",
    "faq.Charging.questions.6.question": "Apakah overcharging berbahaya?",
    "faq.Charging.questions.6.answer":
      "Baterai Wedison dilengkapi dengan sistem manajemen perlindungan\nJika baterai menjadi terlalu panas karena overcharging, fitur keamanan bawaan akan secara otomatis memutus daya untuk mencegah kerusakan atau bahaya.",
    "faq.Charging.questions.7.question": "Mengapa pengisian daya melambat?",
    "faq.Charging.questions.7.answer":
      "Teknologi baterai lithium-ion canggih Wedison menampilkan pengisian pintar yang menyeimbangkan kecepatan dan kinerja jangka panjang. Ini mengisi daya dengan cepat hingga kapasitas 95%, kemudian beralih ke kecepatan yang lebih lambat dan terkontrol untuk melindungi dan memperpanjang masa pakai baterai.\n\nPendekatan pengisian pintar ini membuat Anda kembali berkendara lebih cepat sambil membantu memperpanjang masa pakai baterai secara keseluruhan.",
    "faq.Charging.questions.8.question":
      "Berapa durasi pengisian reguler? (charger 600W)",
    "faq.Charging.questions.8.answer":
      "Waktu pengisian bervariasi tergantung model dan kapasitas baterai. \nWaktu pengisian dengan adaptor pengisian 600w dari 0-100%:\nLihat Data Pengisian Reguler",
    "faq.Charging.questions.9.question":
      "Berapa durasi pengisian reguler? (charger 1260W)",
    "faq.Charging.questions.9.answer":
      "Waktu pengisian bervariasi tergantung model dan kapasitas baterai. \nWaktu pengisian dengan adaptor pengisian 1260w dari 0-100%:\nBees: 3,5 jam (Tidak berubah, hanya dapat menggunakan charger 600w)\nLihat Data Pengisian Reguler",
    "faq.Charging.questions.10.question":
      "Bagaimana cara melakukan pengisian reguler?",
    "faq.Charging.questions.10.answer":
      "Pertama sambungkan pengisi daya ke port pengisian kendaraan, lalu colokkan ke sumber daya. \nSetelah pengisian selesai, cabut sumber daya terlebih dahulu, lalu lepaskan pengisi daya dari kendaraan.",
    "faq.Charging.questions.11.question": "Apakah pengisian daya gratis?",
    "faq.Charging.questions.11.answer":
      "Tidak, pengisian daya listrik berdasarkan Pay as Per use, dan harga pengisian daya bervariasi tergantung lokasi dan stasiun pengisian daya/operator.",

    // Performance Questions
    "faq.Performance.questions.0.question": "Berapa kecepatan motor?",
    "faq.Performance.questions.0.answer":
      "Tergantung model, kecepatan tertinggi berkisar dari 55 km/jam hingga 95 km/jam",
    "faq.Performance.questions.1.question": "Berapa daya motor / BLDC motor?",
    "faq.Performance.questions.1.answer":
      "Daya motor bervariasi antar model, berkisar dari 1,2KW hingga 5KW",
    "faq.Performance.questions.2.question": "Berapa jarak tempuh motor?",
    "faq.Performance.questions.2.answer":
      "Jarak tempuh bervariasi antara model dan baterai, berkisar dari 80 km hingga 160 km",
    "faq.Performance.questions.3.question":
      "Apakah Wedison EV aman digunakan dalam hujan dan banjir?",
    "faq.Performance.questions.3.answer":
      "Motor, unit kontrol, dan baterai Wedison adalah IP67, yang telah diuji kedap air.\nMeskipun telah menjalani tes perendaman air pada 1 meter, perendaman yang diperpanjang tidak disarankan.",
    "faq.Performance.questions.4.question": "Bisakah motor menanjak?",
    "faq.Performance.questions.4.answer":
      "Ya, bisa menanjak dan kemampuan mendaki tergantung pada model:\nBees, EdPower: 12%\nAthena dan Victory: 15%",
    "faq.Performance.questions.5.question":
      "Apakah baterai menurun seiring waktu?",
    "faq.Performance.questions.5.answer":
      "Seperti perangkat apa pun yang ditenagai oleh baterai lithium-ion, kemampuan baterai untuk menahan daya secara bertahap menurun dengan setiap siklus pengisian dan pengosongan. \nKeausan baterai dipengaruhi oleh faktor-faktor seperti siklus pengisian, usia baterai, dan suhu. \n\nSetiap Wedison EV dilengkapi dengan baterai Lithium Ion proprietary, yang didukung dengan garansi 3 tahun.",

    // Safety Questions
    "faq.Safety.questions.0.question": "Apakah baterai Anda aman?",
    "faq.Safety.questions.0.answer":
      "Baterai proprietary Wedison menampilkan sistem manajemen baterai canggih\ndengan langkah-langkah keamanan untuk mencegah overheating, overcharging, dan risiko kebakaran",
    "faq.Safety.questions.1.question": "Rem apa yang Anda gunakan?",
    "faq.Safety.questions.1.answer":
      "CBS (Combined Braking System), sistem pengereman efisien yang secara otomatis mendistribusikan gaya pengereman antara rem depan dan belakang ketika pengendara mengerem:\nAthena, Victory, & EdPower\n\nRem cakram depan dan belakang, memberikan kontrol, keamanan, dan kinerja pengereman yang ditingkatkan:\nMotor Bees",
    "faq.Safety.questions.2.question": "Motor apa yang Anda gunakan?",
    "faq.Safety.questions.2.answer":
      "Motor Wedison dilengkapi dengan motor DC brushless (BLDC), dikenal karena kinerja, efisiensi, torsi, dan masa pakai yang panjang.\n\nTersedia 1 versi: \n1. DC Brushless Rear Hub Motor: kecepatan motor hingga 95 km/jam. (Bees, Athena, Victory, EdPower)",

    // Servicing Questions
    "faq.Servicing.questions.0.question":
      "Apakah Wedison EV dilengkapi dengan layanan gratis?",
    "faq.Servicing.questions.0.answer":
      "Ya, setiap motor Wedison dilengkapi dengan 3 sesi layanan gratis di Wedison atau pusat layanan terauthorisasi. \nPemeriksaan garansi berbasis jarak tempuh dijadwalkan pada interval 1.000 km, 5.000 km, dan 10.000 km.",
    "faq.Servicing.questions.1.question":
      "Jarak tempuh apa yang dicakup dalam jadwal layanan gratis?",
    "faq.Servicing.questions.1.answer":
      "Garansi jarak tempuh termasuk pemeriksaan pada 1.000 km, 5.000 km, dan 10.000 km.",
    "faq.Servicing.questions.2.question":
      "Di mana saya dapat melayani EV motor?",
    "faq.Servicing.questions.2.answer":
      "Di bengkel resmi Wedison atau pusat layanan terauthorisasi Wedison terdekat.",
    "faq.Servicing.questions.3.question":
      "Apakah Wedison menyediakan suku cadang untuk motor?",
    "faq.Servicing.questions.3.answer":
      "Ya, Wedison menyediakan suku cadang siap pakai untuk motor.",
    "faq.Servicing.questions.4.question": "Apakah baterai dilengkapi garansi?",
    "faq.Servicing.questions.4.answer":
      "Ya, baterai proprietary dilengkapi dengan garansi 3 tahun.",
    "faq.Servicing.questions.5.question":
      "Apakah motor Wedison dilengkapi garansi?",
    "faq.Servicing.questions.5.answer":
      "Ya, motor dilengkapi dengan garansi 2 tahun.",
    "faq.Servicing.questions.6.question":
      "Berapa biaya untuk memperbaiki motor, dinamo, dan lainnya?",
    "faq.Servicing.questions.6.answer":
      "Biaya perbaikan motor listrik bervariasi berdasarkan jenis dan merek suku cadang, dan tingkat kerusakan atau perbaikan yang diperlukan. \n\nPengguna harus memeriksa harga dengan bengkel masing-masing.",
    "faq.Servicing.questions.7.question":
      "Bagaimana cara merawat motor Wedison?",
    "faq.Servicing.questions.7.answer":
      "Perawatan dan penanganan yang tepat, bersama dengan perawatan yang tepat dan teratur dapat memperpanjang masa pakai motor. \nAnda tidak perlu mengisi daya EV setiap hari:\n- Sebaliknya, isi daya sesuai kebutuhan, jaga baterai antara 20% dan 80% untuk kesehatan dan jangkauan optimal.\n- Isi daya setidaknya sekali sebulan.\n- Untuk kinerja dan kualitas baterai optimal, Wedison EV harus diisi daya dan diservis di stasiun pengisian super cepat dan pusat layanan yang ditentukan masing-masing.",
    "faq.Servicing.questions.8.question":
      "Apakah modifikasi diizinkan untuk EV?",
    "faq.Servicing.questions.8.answer":
      "Produk yang dicakup dalam garansi Wedison hanya mencakup konfigurasi, desain, atau spesifikasi aslinya. \nKerusakan, kesalahan, kegagalan, atau ketidaksempurnaan yang disebabkan oleh penyalahgunaan, gangguan, penggunaan ilegal, kelalaian, atau operasi yang berkepanjangan tidak dicakup.",
    "faq.Servicing.questions.9.question":
      "Kondisi apa yang akan membatalkan garansi?",
    "faq.Servicing.questions.9.answer":
      "Kerusakan yang diakibatkan oleh penggunaan suku cadang Wedison non-original atau modifikasi yang tidak diauthorisasi. \n\nKerusakan yang diakibatkan oleh peristiwa yang tidak dapat dihindari atau tidak terduga—seperti asap, paparan zat, gempa bumi, topan, banjir, korosi kimia, aktivitas promosi atau periklanan, item gratis, masalah terkait kebisingan, atau kontak dengan bahan lunak atau keras buatan—tidak dicakup.",
    "faq.Servicing.questions.10.question": "Apa batasan garansi?",
    "faq.Servicing.questions.10.answer":
      "Tidak ada komponen yang dicakup under garansi seumur hidup.\nSuku cadang pengganti yang disediakan under garansi hanya dicakup untuk sisa periode garansi asli.\nUntuk suku cadang yang dibeli atau diganti di luar layanan garansi, periode garansi dimulai dari tanggal pembelian atau penggantian.",

    // Smart Features Questions
    "faq.SmartFeatures.questions.0.question": "Apa fitur pintar yang tersedia?",
    "faq.SmartFeatures.questions.0.answer":
      "Aplikasi Wedison Smart Phone: untuk model tertentu, dapat digunakan untuk menyalakan dan mematikan motor melalui aplikasi menggunakan koneksi bluetooth.\nSelain itu, fitur lain akan diluncurkan di aplikasi untuk memberikan lebih banyak data.",

    // Tires Questions
    "faq.Tires.questions.0.question": "Apa dimensi ban?",
    "faq.Tires.questions.0.answer":
      "Bees: Depan: 90/90-10; Belakang 90/90-10\nAthena: Depan: 100/80-12; Belakang 100/80-12\nVictory: Depan: 90/90-14; Belakang: 100/80-14\nEdPower: Depan: 100/90-14; Belakang: 120/70-14",

    // Ojol Page
    "ojol.hero.title": "Wedison Bersama",
    "ojol.hero.titleHighlight": "Ojol",
    "ojol.hero.description":
      "Solusi motor listrik untuk driver ojol. Hemat biaya operasional, tanpa antre BBM!",
    "ojol.hero.startFrom": "Mulai dari",
    "ojol.hero.perDay": "/Hari",
    "ojol.hero.dailyRental": "SEWA HARIAN",
    "ojol.hero.tagline": "#JadiLebihMudah",
    "ojol.hero.tryFree": "Coba Gratis!",

    "ojol.benefits.title": "Narik Lebih Banyak, Kerja Lebih Efisien",
    "ojol.benefits.description":
      "Bosen antre BBM? Capek mikirin biaya bensin yang makin mahal? Tenang, Wedison solusinya! Irit biaya operasional, gak perlu antre, dan perawatan lebih ringan. Waktunya upgrade cara narik kamu!",

    "ojol.campaign.heading": "Hot Campaign",
    "ojol.btn.register": "Daftar Sekarang",
    "ojol.btn.detail": "Lihat Detail",

    "ojol.campaign.milik.title": "Sewa Milik",
    "ojol.campaign.milik.tagline": "Cicil Motor, Jadi Milik Sendiri!",
    "ojol.campaign.milik.description":
      "Program sewa dengan opsi kepemilikan selama 3,5 tahun (42 bulan). Setelah kontrak selesai, motor jadi milik kamu!",
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
      "Tabungan akan digunakan untuk biaya asuransi, servis, sparepart, dan BPKB. Sisa tabungan di akhir kontrak akan ditransfer ke rider",
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
    "ojol.campaign.harian.tagline": "Narik Dulu, Fleksibel Tanpa Beban!",
    "ojol.campaign.harian.description":
      "Sewa motor listrik harian dengan kontrak 3 tahun. Cocok buat kamu yang mau narik tanpa mikir cicilan!",
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
      "Waktu adalah uang, dan Supercharge bikin kamu gak buang-buang waktu! Cukup ",
    "ojol.supercharge.descriptionBold": "15 menit",
    "ojol.supercharge.descriptionPart2":
      " aja, baterai langsung terisi dari 10% ke 80%. Langsung gas narik lagi, gak perlu nunggu lama! Sekali charge bisa tempuh hingga 165 km*. Lebih banyak orderan, cuan lebih banyak!",
    "ojol.supercharge.disclaimer":
      "*Jarak tempuh 165 km berlaku untuk model EdPower Extended Battery",
    "ojol.supercharge.cta": "Pelajari Lebih Lanjut",

    "ojol.models.title": "Pilih Motor yang Cocok Buat Kamu",
    "ojol.models.subtitle":
      "Mau yang gesit buat gang sempit atau yang kuat buat jarak jauh? Wedison punya pilihan lengkap yang pas buat gaya narik kamu!",
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
    "ojol.models.footnote": "*Jarak tempuh dengan Extended Battery",

    "ojol.cta.badge": "Program Khusus Driver",
    "ojol.cta.headline.1": "Siap Narik Lebih Cuan",
    "ojol.cta.headline.2": "Bareng Wedison?",
    "ojol.cta.description":
      "Gabung sekarang dan nikmati berbagai keuntungan eksklusif: sewa harian mulai 50K, charging cepat gratis, hingga program cicilan ringan. Yuk, upgrade cara narik kamu!",
    "ojol.cta.benefit.1": "Sewa Harian Mulai 50K",
    "ojol.cta.benefit.2": "SuperCharge Gratis",
    "ojol.cta.benefit.3": "Cicilan Ringan",
    "ojol.cta.benefit.4": "Servis Prioritas",
    "ojol.cta.button": "Hubungi Sales Wedison",
    "ojol.cta.trust": "Respon cepat, konsultasi gratis!",

    // Language
    language: "Bahasa Indonesia",
    switchLanguage: "English",
};
