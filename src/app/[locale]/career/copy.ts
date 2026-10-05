// Copy halaman karier (daftar + detail lowongan). Ditulis langsung per bahasa agar natural.
import type { PublicJob } from "@/lib/cms/api";

export type CareerLocale = "id" | "en";

export const CAREER_COPY = {
  id: {
    boardTitle: "Posisi yang Sedang Dibuka",
    boardSub: "Temukan peran yang sesuai dengan keahlian Anda, lalu kirim lamaran langsung ke tim HR kami.",
    search: "Cari posisi…",
    allDivisions: "Semua divisi",
    allLocations: "Semua lokasi",
    allTypes: "Semua tipe",
    allCountries: "Semua negara",
    results: (n: number) => (n === 1 ? "1 posisi" : `${n} posisi`),
    reset: "Hapus filter",
    noMatchTitle: "Belum ada posisi yang cocok",
    noMatchSub: "Coba ubah filter atau kata kunci pencarian.",
    noJobsTitle: "Saat ini belum ada posisi yang dibuka",
    noJobsSub: "Kami tetap senang mengenal Anda. Kirimkan CV, dan kami akan menghubungi Anda saat ada posisi yang sesuai.",
    urgent: "Dibutuhkan segera",
    positions: (n: number) => `${n} posisi`,
    viewJob: "Lihat detail",
    openTitle: "Belum menemukan posisi yang pas?",
    openSub: "Kirimkan CV dan ceritakan peran yang Anda minati. Kami akan menghubungi Anda saat ada kesempatan yang sesuai.",
    openCta: "Kirim Lamaran Umum",
    openSubject: "Lamaran Umum",
    findUs: "Temukan kami juga di",
    back: "Semua lowongan",
    about: "Tentang peran ini",
    responsibilities: "Tanggung jawab",
    qualifications: "Kualifikasi",
    niceToHave: "Nilai tambah",
    benefits: "Yang kami tawarkan",
    applyTitle: "Lamar posisi ini",
    applyEmail: "Lamar via email",
    applyEmailHint: (email: string) => `Kirim CV dan portofolio Anda ke ${email}`,
    applyPortals: "Atau lamar melalui",
    closesOn: (d: string) => `Ditutup ${d}`,
    postedOn: (d: string) => `Dibuka ${d}`,
    closedTitle: "Lowongan ini sudah ditutup",
    closedSub: "Terima kasih atas minat Anda. Lihat posisi lain yang masih dibuka.",
    seeOpenings: "Lihat lowongan lain",
    share: "Bagikan",
    copied: "Tautan disalin",
    contact: "Ada pertanyaan seputar lowongan?",
    salaryPerMonth: "/bulan",
  },
  en: {
    boardTitle: "Open Positions",
    boardSub: "Find a role that fits your skills and send your application straight to our HR team.",
    search: "Search positions…",
    allDivisions: "All divisions",
    allLocations: "All locations",
    allTypes: "All types",
    allCountries: "All countries",
    results: (n: number) => (n === 1 ? "1 position" : `${n} positions`),
    reset: "Clear filters",
    noMatchTitle: "No positions match",
    noMatchSub: "Try different filters or search terms.",
    noJobsTitle: "There are no open positions right now",
    noJobsSub: "We would still love to hear from you. Send your CV and we will reach out when a suitable role opens.",
    urgent: "Urgently hiring",
    positions: (n: number) => `${n} positions`,
    viewJob: "View details",
    openTitle: "Don’t see the right role?",
    openSub: "Send us your CV and tell us what you would like to do. We will contact you when a matching opportunity comes up.",
    openCta: "Send an Open Application",
    openSubject: "Open Application",
    findUs: "Also find us on",
    back: "All openings",
    about: "About the role",
    responsibilities: "Responsibilities",
    qualifications: "Requirements",
    niceToHave: "Nice to have",
    benefits: "What we offer",
    applyTitle: "Apply for this role",
    applyEmail: "Apply by email",
    applyEmailHint: (email: string) => `Send your CV and portfolio to ${email}`,
    applyPortals: "Or apply through",
    closesOn: (d: string) => `Closes ${d}`,
    postedOn: (d: string) => `Posted ${d}`,
    closedTitle: "This opening has closed",
    closedSub: "Thank you for your interest. Take a look at the positions that are still open.",
    seeOpenings: "See other openings",
    share: "Share",
    copied: "Link copied",
    contact: "Questions about a role?",
    salaryPerMonth: "/month",
  },
} as const;

export const EMPLOYMENT: Record<CareerLocale, Record<PublicJob["employmentType"], string>> = {
  id: { FULL_TIME: "Penuh waktu", PART_TIME: "Paruh waktu", CONTRACT: "Kontrak", INTERNSHIP: "Magang", FREELANCE: "Lepas" },
  en: { FULL_TIME: "Full-time", PART_TIME: "Part-time", CONTRACT: "Contract", INTERNSHIP: "Internship", FREELANCE: "Freelance" },
};
export const WORKPLACE: Record<CareerLocale, Record<PublicJob["workplaceType"], string>> = {
  id: { ONSITE: "Di kantor", HYBRID: "Hybrid", REMOTE: "Remote" },
  en: { ONSITE: "On-site", HYBRID: "Hybrid", REMOTE: "Remote" },
};
export const LEVEL: Record<CareerLocale, Record<NonNullable<PublicJob["experienceLevel"]>, string>> = {
  id: { ENTRY: "Lulusan baru", JUNIOR: "Junior", MID: "Menengah", SENIOR: "Senior", LEAD: "Lead", MANAGER: "Manajer" },
  en: { ENTRY: "Entry level", JUNIOR: "Junior", MID: "Mid level", SENIOR: "Senior", LEAD: "Lead", MANAGER: "Manager" },
};

export function jobLocations(j: Pick<PublicJob, "locations">) {
  return j.locations.map((l) => (l.country && l.country !== "Indonesia" ? `${l.city}, ${l.country}` : l.city)).join(" · ");
}

export function salaryText(s: PublicJob["salary"], locale: CareerLocale) {
  if (!s) return null;
  const f = (n: number) => new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", { style: "currency", currency: s.currency, maximumFractionDigits: 0 }).format(n);
  const per = CAREER_COPY[locale].salaryPerMonth;
  if (s.min && s.max) return `${f(s.min)} – ${f(s.max)}${per}`;
  if (s.min) return `${locale === "en" ? "From" : "Mulai"} ${f(s.min)}${per}`;
  if (s.max) return `${locale === "en" ? "Up to" : "Hingga"} ${f(s.max)}${per}`;
  return null;
}

export function mailtoFor(email: string, subjectTpl: string, title: string, department?: string | null, cc?: string | null) {
  const subject = subjectTpl.replaceAll("{title}", title).replaceAll("{department}", department ?? "");
  const q = new URLSearchParams({ subject });
  if (cc) q.set("cc", cc);
  return `mailto:${email}?${q.toString().replace(/\+/g, "%20")}`;
}
