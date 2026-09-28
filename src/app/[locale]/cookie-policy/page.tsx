import { getSEOMetadata } from "@/app/lib/seo1";
import { CookieSettingsButton } from "@/components/cookie-consent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/cookie-policy" });
}

type Row = { name: string; provider: string; purpose: string; duration: string };
type Section = { key: string; title: string; desc: string; rows: Row[] };

// Daftar cookie harus sinkron dengan src/lib/consent.ts. Bila berubah material,
// naikkan CONSENT_VERSION agar pengunjung diminta persetujuan ulang.
const CONTENT = {
  id: {
    kicker: "Privasi",
    title: "Kebijakan Cookie",
    updated: "Terakhir diperbarui: 28 September 2026",
    intro:
      "Cookie adalah file kecil yang disimpan browser saat kamu mengunjungi wedison.co. Halaman ini menjelaskan cookie apa saja yang kami pakai, untuk apa, dan bagaimana kamu mengaturnya. Cookie analitik dan marketing hanya aktif setelah kamu memberi izin.",
    cols: ["Nama", "Penyedia", "Tujuan", "Masa berlaku"],
    sections: [
      {
        key: "necessary",
        title: "Wajib",
        desc: "Diperlukan agar situs berfungsi. Selalu aktif dan tidak dipakai untuk melacakmu.",
        rows: [
          { name: "wd_consent", provider: "Wedison", purpose: "Menyimpan pilihan persetujuan cookie kamu.", duration: "6 bulan" },
          { name: "NEXT_LOCALE", provider: "Wedison", purpose: "Mengingat pilihan bahasa (Indonesia/Inggris).", duration: "1 tahun" },
        ],
      },
      {
        key: "analytics",
        title: "Analitik",
        desc: "Membantu kami memahami penggunaan situs secara statistik agar bisa terus diperbaiki.",
        rows: [
          { name: "_ga, _ga_*", provider: "Google (via Google Tag Manager)", purpose: "Membedakan pengunjung dan sesi untuk statistik kunjungan.", duration: "Hingga 2 tahun" },
        ],
      },
      {
        key: "marketing",
        title: "Marketing",
        desc: "Mengukur efektivitas iklan dan menampilkan iklan yang relevan di platform lain.",
        rows: [
          { name: "_fbp, _fbc", provider: "Meta (Facebook Pixel)", purpose: "Mengukur konversi iklan dan membangun audiens iklan.", duration: "3 bulan" },
          { name: "Cookie iklan Google", provider: "Google (via Google Tag Manager)", purpose: "Mengukur konversi dan performa kampanye iklan.", duration: "Hingga 13 bulan" },
        ],
      },
    ] as Section[],
    manageTitle: "Mengatur pilihanmu",
    manage:
      "Kamu bisa mengubah atau mencabut persetujuan kapan saja lewat tombol di bawah atau link \"Pengaturan Cookie\" di footer. Saat izin dicabut, kami berhenti memuat tag terkait dan menghapus cookie-nya dari domain kami. Kamu juga bisa menghapus cookie lewat pengaturan browser.",
    manageCta: "Buka pengaturan cookie",
    recordTitle: "Catatan persetujuan",
    record:
      "Sebagai bukti persetujuan sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, kami mencatat setiap keputusanmu: kategori yang diizinkan, versi kebijakan, waktu, ID acak dari cookie wd_consent, dan alamat IP dalam bentuk hash (bukan IP asli). Catatan ini tidak dipakai untuk mengidentifikasimu dan dihapus otomatis setelah 2 tahun.",
    contactTitle: "Kontak",
    contact: "Pertanyaan tentang kebijakan ini dapat dikirim ke",
  },
  en: {
    kicker: "Privacy",
    title: "Cookie Policy",
    updated: "Last updated: 28 September 2026",
    intro:
      "Cookies are small files your browser stores when you visit wedison.co. This page explains which cookies we use, why, and how you can control them. Analytics and marketing cookies are only active after you give permission.",
    cols: ["Name", "Provider", "Purpose", "Duration"],
    sections: [
      {
        key: "necessary",
        title: "Necessary",
        desc: "Required for the site to work. Always on and never used to track you.",
        rows: [
          { name: "wd_consent", provider: "Wedison", purpose: "Stores your cookie consent choice.", duration: "6 months" },
          { name: "NEXT_LOCALE", provider: "Wedison", purpose: "Remembers your language (Indonesian/English).", duration: "1 year" },
        ],
      },
      {
        key: "analytics",
        title: "Analytics",
        desc: "Helps us understand site usage as aggregate statistics so we can keep improving it.",
        rows: [
          { name: "_ga, _ga_*", provider: "Google (via Google Tag Manager)", purpose: "Distinguishes visitors and sessions for visit statistics.", duration: "Up to 2 years" },
        ],
      },
      {
        key: "marketing",
        title: "Marketing",
        desc: "Measures ad performance and shows relevant ads on other platforms.",
        rows: [
          { name: "_fbp, _fbc", provider: "Meta (Facebook Pixel)", purpose: "Measures ad conversions and builds ad audiences.", duration: "3 months" },
          { name: "Google ad cookies", provider: "Google (via Google Tag Manager)", purpose: "Measures conversions and campaign performance.", duration: "Up to 13 months" },
        ],
      },
    ] as Section[],
    manageTitle: "Managing your choice",
    manage:
      "You can change or withdraw consent at any time using the button below or the \"Cookie Settings\" link in the footer. When you withdraw, we stop loading the related tags and delete their cookies from our domain. You can also clear cookies in your browser settings.",
    manageCta: "Open cookie settings",
    recordTitle: "Consent records",
    record:
      "As proof of consent under Indonesia's Personal Data Protection Law (Law No. 27 of 2022), we record each decision: the categories allowed, policy version, time, a random ID from the wd_consent cookie, and a hashed (not raw) IP address. These records are not used to identify you and are deleted automatically after 2 years.",
    contactTitle: "Contact",
    contact: "Questions about this policy can be sent to",
  },
};

export default async function CookiePolicyPage({
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
          <p className="mt-3 text-sm text-muted-foreground">{c.updated}</p>
        </div>
      </section>

      <div className="main-container max-w-3xl py-12 sm:py-16">
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{c.intro}</p>

        {c.sections.map((s) => (
          <section key={s.key} className="mt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {s.title}
            </h2>
            <p className="mt-2 text-muted-foreground">{s.desc}</p>
            <div className="mt-5 overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    {c.cols.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-wider text-muted-foreground"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {s.rows.map((r) => (
                    <tr key={r.name} className="align-top">
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{r.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.provider}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.purpose}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{r.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {c.manageTitle}
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">{c.manage}</p>
          <CookieSettingsButton label={c.manageCta} />
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {c.recordTitle}
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">{c.record}</p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {c.contactTitle}
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            {c.contact}{" "}
            <a href="mailto:support@wedison.co" className="font-medium text-primary hover:underline">
              support@wedison.co
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
