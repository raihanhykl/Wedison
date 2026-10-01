/**
 * Deteksi blok FAQ di HTML artikel CMS: heading H2/H3 berbentuk pertanyaan yang diikuti isi
 * sampai heading berikutnya. Hasilnya dipakai untuk JSON-LD FAQPage (AEO) di halaman artikel.
 * Aturan yang sama dipakai backend (server/src/lib/content-score.ts) agar skor editor konsisten.
 */
const QUESTION_WORDS = [
  "apa", "apakah", "bagaimana", "mengapa", "kenapa", "kapan", "berapa", "siapa", "di mana", "dimana", "haruskah", "bisakah", "bolehkah",
  "what", "why", "how", "when", "where", "who", "which", "can", "should", "is", "are", "does", "do",
];

function strip(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function isQuestion(text: string) {
  if (/\?\s*$/.test(text)) return true;
  const t = text.toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  return QUESTION_WORDS.some((w) => t === w || t.startsWith(w + " "));
}

export function extractArticleFaq(html: string): { question: string; answer: string }[] {
  const re = /<h([23])[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[1-3][\s>]|$)/gi;
  const out: { question: string; answer: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const q = strip(m[2]);
    const a = strip(m[3]);
    if (q && a && isQuestion(q) && a.split(/\s+/).length >= 8) out.push({ question: q, answer: a.slice(0, 1200) });
  }
  return out.slice(0, 20);
}
