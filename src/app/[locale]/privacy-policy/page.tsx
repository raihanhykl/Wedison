import { getSEOMetadata } from "@/app/lib/seo1";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/privacy-policy" });
}

const CONTACT_EMAIL = "support@wedison.co";

type Section = { key: string; title: string; body: string[]; list?: string[] };

// Cakupan halaman ini sengaja sempit: integrasi pelaporan iklan (Meta Ads -> server MCP -> ChatGPT).
// Kebijakan privasi seluruh situs (form, cookie, pixel, CRM) perlu review terpisah. Platform lain
// (Werigo, TikTok) baru boleh ditambahkan di sini setelah integrasinya benar-benar berjalan.
// Jangan menambahkan klaim (enkripsi, batas waktu penghapusan, dll.) yang belum diverifikasi IT.
const CONTENT = {
  id: {
    kicker: "Privasi",
    title: "Kebijakan Privasi",
    subtitle: "Integrasi Pelaporan Iklan Wedison",
    effective: "Berlaku sejak: 22 Juli 2025",
    intro:
      "Kebijakan ini menjelaskan data apa yang diakses, untuk apa, dan bagaimana data tersebut diproses oleh integrasi pelaporan iklan Wedison, yaitu aplikasi yang menghubungkan akun iklan Meta milik Wedison dengan alat pelaporan internal kami.",
    sections: [
      {
        key: "scope",
        title: "1. Ruang lingkup",
        body: [
          "Kebijakan ini hanya berlaku untuk integrasi pelaporan iklan yang membaca data performa iklan dari akun Meta Ads (Facebook dan Instagram) yang dimiliki atau dikelola Wedison, setelah diotorisasi oleh pemilik atau admin akun tersebut.",
          "Penggunaan situs wedison.co lainnya, termasuk formulir, cookie, dan pixel, diatur dalam kebijakan terpisah seperti Kebijakan Cookie kami. Platform iklan lain hanya akan dicakup oleh kebijakan ini setelah integrasinya berjalan dan halaman ini diperbarui.",
        ],
      },
      {
        key: "operator",
        title: "2. Pengelola",
        body: [
          `Integrasi ini dikelola oleh PT Wedison Nusantara Energi ("Wedison", "kami"). Pertanyaan dan permintaan terkait privasi dapat dikirim ke ${CONTACT_EMAIL}.`,
        ],
      },
      {
        key: "data",
        title: "3. Data yang kami akses",
        body: [
          "Dengan izin baca (read-only) yang diberikan pemilik akun, integrasi ini dapat mengakses data pelaporan iklan berikut:",
        ],
        list: [
          "ID dan nama akun iklan, kampanye, set iklan, dan iklan, beserta statusnya.",
          "Metrik performa, seperti biaya (spend), impresi, jangkauan, klik, CTR, CPC, dan CPM.",
          "Jumlah dan nilai konversi sebagaimana dilaporkan oleh Meta.",
          "Rentang tanggal serta pengelompokan laporan yang disediakan Meta.",
          "Bila otorisasi dilakukan melalui Login Facebook: identitas dasar akun yang memberi otorisasi (ID pengguna khusus aplikasi dan nama) yang diberikan Meta untuk proses login.",
        ],
      },
      {
        key: "not-collected",
        title: "4. Data yang tidak kami kumpulkan",
        body: [
          "Data pelaporan yang diterima berbentuk agregat (jumlah dan statistik), bukan profil orang yang melihat iklan. Integrasi ini tidak meminta akses ke pesan, daftar teman, unggahan pribadi, atau data kontak pengguna Facebook dan Instagram.",
        ],
      },
      {
        key: "purpose",
        title: "5. Tujuan penggunaan",
        body: [
          "Data dipakai hanya untuk pelaporan dan analisis pemasaran internal Wedison, misalnya menyusun ringkasan performa kampanye dan membandingkan hasil antarperiode. Kami tidak menjual data ini dan tidak memakainya untuk menargetkan iklan kepada individu tertentu.",
        ],
      },
      {
        key: "flow",
        title: "6. Cara data diproses dan siapa penerimanya",
        body: [
          "Saat anggota tim Wedison yang berwenang meminta laporan, server integrasi milik Wedison mengambil data dari Meta Marketing API lalu meneruskan hasilnya ke ChatGPT (OpenAI) untuk disusun menjadi laporan. Pihak yang terlibat:",
        ],
        list: [
          "Meta Platforms, sebagai sumber data iklan.",
          "Penyedia hosting server yang menjalankan integrasi untuk Wedison.",
          "OpenAI, yang memproses data laporan saat diminta melalui ChatGPT sesuai ketentuan layanannya.",
        ],
      },
      {
        key: "international",
        title: "7. Pemrosesan di luar Indonesia",
        body: [
          "Meta dan OpenAI dapat memproses data di server yang berada di luar Indonesia. Kami hanya meneruskan data yang diperlukan untuk menyusun laporan yang diminta.",
        ],
      },
      {
        key: "retention",
        title: "8. Penyimpanan dan masa simpan",
        body: [
          "Data pelaporan disimpan hanya selama diperlukan untuk tujuan pelaporan internal di atas. Data yang tidak lagi diperlukan, atau yang diminta untuk dihapus, akan dihapus dari sistem yang dikelola Wedison. Laporan yang sudah dibagikan di lingkungan internal mengikuti kebijakan dokumen internal Wedison.",
        ],
      },
      {
        key: "security",
        title: "9. Akses dan keamanan",
        body: [
          "Akses ke integrasi ini dibatasi untuk anggota tim Wedison yang berwenang. Kredensial akses (token) disimpan di sisi server dan tidak pernah ditampilkan di situs publik atau dibagikan kepada pihak yang tidak berwenang.",
        ],
      },
      {
        key: "revoke",
        title: "10. Mencabut akses",
        body: [
          "Pemilik atau admin akun iklan dapat mencabut akses integrasi ini kapan saja, baik melalui Pengaturan Facebook (Integrasi Bisnis) maupun Meta Business Settings dengan menghapus aplikasi dari daftar aplikasi yang terhubung. Setelah dicabut, integrasi tidak dapat lagi mengambil data baru. Anda juga dapat meminta kami memutus akses melalui email di bawah.",
        ],
      },
      {
        key: "deletion",
        title: "11. Permintaan penghapusan data",
        body: [
          `Untuk meminta penghapusan data yang diperoleh melalui integrasi ini, kirim email ke ${CONTACT_EMAIL} dengan subjek "Permintaan Penghapusan Data – Integrasi Pelaporan Iklan". Sertakan nama Anda, ID akun iklan atau akun yang terkait, dan data yang ingin dihapus.`,
          "Kami akan memverifikasi bahwa permintaan berasal dari pemilik atau admin akun yang bersangkutan, menghapus data terkait dari sistem yang dikelola Wedison, lalu mengonfirmasi melalui email. Penghapusan ini tidak menghapus data yang disimpan Meta di platformnya sendiri.",
        ],
      },
      {
        key: "rights",
        title: "12. Hak Anda",
        body: [
          "Sesuai Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda dapat meminta informasi, akses, perbaikan, atau penghapusan data pribadi Anda yang kami proses, serta menarik persetujuan yang telah diberikan, dengan menghubungi kami di alamat email di bawah.",
        ],
      },
      {
        key: "changes",
        title: "13. Perubahan kebijakan",
        body: [
          "Kebijakan ini dapat diperbarui bila integrasi, data yang diakses, atau penyedia layanan berubah. Tanggal berlaku di bagian atas halaman akan disesuaikan setiap kali ada perubahan.",
        ],
      },
    ] as Section[],
    contactTitle: "Kontak",
    contact: "Pertanyaan, permintaan akses, atau penghapusan data dapat dikirim ke",
  },
  en: {
    kicker: "Privacy",
    title: "Privacy Policy",
    subtitle: "Wedison Advertising Reporting Integration",
    effective: "Effective date: 22 July 2025",
    intro:
      "This policy explains what data is accessed, why, and how it is processed by the Wedison advertising reporting integration: the app that connects Wedison's Meta advertising accounts with our internal reporting tools.",
    sections: [
      {
        key: "scope",
        title: "1. Scope",
        body: [
          "This policy applies only to the advertising reporting integration, which reads ad performance data from Meta Ads (Facebook and Instagram) accounts owned or managed by Wedison, after authorization by the owner or an admin of that account.",
          "Other use of wedison.co, including forms, cookies, and pixels, is covered by separate policies such as our Cookie Policy. Other advertising platforms will only be covered by this policy once their integration is live and this page has been updated.",
        ],
      },
      {
        key: "operator",
        title: "2. Operator",
        body: [
          `This integration is operated by PT Wedison Nusantara Energi ("Wedison", "we", "us"). Privacy questions and requests can be sent to ${CONTACT_EMAIL}.`,
        ],
      },
      {
        key: "data",
        title: "3. Data we access",
        body: [
          "With the read-only permission granted by the account owner, the integration can access the following advertising reporting data:",
        ],
        list: [
          "IDs and names of ad accounts, campaigns, ad sets, and ads, and their status.",
          "Performance metrics such as spend, impressions, reach, clicks, CTR, CPC, and CPM.",
          "Conversion counts and values as reported by Meta.",
          "Date ranges and report breakdowns provided by Meta.",
          "If authorization uses Facebook Login: basic identity of the authorizing account (app-scoped user ID and name) that Meta provides for the login process.",
        ],
      },
      {
        key: "not-collected",
        title: "4. Data we do not collect",
        body: [
          "The reporting data we receive is aggregated (counts and statistics), not profiles of people who saw the ads. The integration does not request access to messages, friend lists, personal posts, or contact details of Facebook or Instagram users.",
        ],
      },
      {
        key: "purpose",
        title: "5. How we use the data",
        body: [
          "The data is used only for Wedison's internal marketing reporting and analysis, such as summarizing campaign performance and comparing results across periods. We do not sell this data and do not use it to target ads at specific individuals.",
        ],
      },
      {
        key: "flow",
        title: "6. How data is processed and who receives it",
        body: [
          "When an authorized Wedison team member requests a report, Wedison's integration server retrieves the data from the Meta Marketing API and passes the result to ChatGPT (OpenAI) to compile the report. The parties involved are:",
        ],
        list: [
          "Meta Platforms, as the source of the advertising data.",
          "The server hosting provider that runs the integration for Wedison.",
          "OpenAI, which processes report data when requested through ChatGPT, under its own service terms.",
        ],
      },
      {
        key: "international",
        title: "7. Processing outside Indonesia",
        body: [
          "Meta and OpenAI may process data on servers located outside Indonesia. We only pass on the data needed to produce the requested report.",
        ],
      },
      {
        key: "retention",
        title: "8. Storage and retention",
        body: [
          "Reporting data is kept only as long as needed for the internal reporting purposes above. Data that is no longer needed, or that is requested to be deleted, is deleted from systems managed by Wedison. Reports already shared internally follow Wedison's internal document policies.",
        ],
      },
      {
        key: "security",
        title: "9. Access and security",
        body: [
          "Access to this integration is limited to authorized Wedison team members. Access credentials (tokens) are kept server-side and are never shown on the public website or shared with unauthorized parties.",
        ],
      },
      {
        key: "revoke",
        title: "10. Revoking access",
        body: [
          "The owner or an admin of the ad account can revoke this integration's access at any time, either in Facebook Settings (Business Integrations) or in Meta Business Settings, by removing the app from the list of connected apps. Once revoked, the integration can no longer retrieve new data. You can also ask us to disconnect access by email.",
        ],
      },
      {
        key: "deletion",
        title: "11. Data deletion requests",
        body: [
          `To request deletion of data obtained through this integration, email ${CONTACT_EMAIL} with the subject "Data Deletion Request – Advertising Reporting Integration". Include your name, the related ad account ID or account, and the data you want deleted.`,
          "We will verify that the request comes from the owner or an admin of the account concerned, delete the related data from systems managed by Wedison, and confirm by email. This does not delete data that Meta stores on its own platform.",
        ],
      },
      {
        key: "rights",
        title: "12. Your rights",
        body: [
          "Under Indonesia's Personal Data Protection Law (Law No. 27 of 2022), you may request information about, access to, correction of, or deletion of your personal data that we process, and withdraw consent you have given, by contacting us at the email address below.",
        ],
      },
      {
        key: "changes",
        title: "13. Changes to this policy",
        body: [
          "We may update this policy when the integration, the data it accesses, or its service providers change. The effective date at the top of this page will be updated with each change.",
        ],
      },
    ] as Section[],
    contactTitle: "Contact",
    contact: "Questions and requests for access or deletion can be sent to",
  },
};

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = CONTENT[locale === "en" ? "en" : "id"];

  return (
    <div>
      <section className="border-b border-border bg-muted/40">
        <div className="main-container pb-12 pt-28 sm:pb-16 sm:pt-36">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {c.kicker}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-2 text-lg text-foreground/80">{c.subtitle}</p>
          <p className="mt-3 text-sm text-muted-foreground">{c.effective}</p>
        </div>
      </section>

      <div className="main-container max-w-3xl py-12 sm:py-16">
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{c.intro}</p>

        {c.sections.map((s) => (
          <section key={s.key} className="mt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {s.title}
            </h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-2 leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            {s.list && (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-muted-foreground">
                {s.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {c.contactTitle}
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            {c.contact}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
