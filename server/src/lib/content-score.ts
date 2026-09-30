/**
 * Content health scoring for CMS articles: SEO, AEO (Answer Engine Optimization) and
 * GEO (Generative Engine Optimization). Pure function over the article draft (no DB, no
 * network) so it can run live from the editor (POST /admin/articles/analyze) and at save time
 * (stored on ArticleTranslation.contentScore for list badges).
 *
 * Each check carries a `note` explaining what to fix, written for the editor, not for engineers.
 */

export type Pillar = "seo" | "aeo" | "geo";
export type CheckStatus = "pass" | "warn" | "fail" | "info";

export type Check = {
  id: string;
  pillar: Pillar;
  label: string;
  status: CheckStatus;
  /** Relative weight inside the pillar (info checks are not scored). */
  weight: number;
  /** What the editor should do when the check is not passing. */
  note?: string;
  /** Measured value shown next to the label, e.g. "42 chars". */
  value?: string;
};

export type PillarScore = {
  score: number; // 0..100
  grade: "good" | "fair" | "poor";
  passed: number;
  total: number;
  checks: Check[];
};

export type ContentStats = {
  words: number;
  sentences: number;
  paragraphs: number;
  headings: { h1: number; h2: number; h3: number; h4: number };
  questionHeadings: number;
  images: number;
  imagesMissingAlt: number;
  internalLinks: number;
  externalLinks: number;
  externalDomains: number;
  lists: number;
  tables: number;
  blockquotes: number;
  numericFacts: number;
  readingMinutes: number;
};

export type ContentScore = {
  version: 1;
  analyzedAt: string;
  overall: number;
  seo: PillarScore;
  aeo: PillarScore;
  geo: PillarScore;
  stats: ContentStats;
  /** Q&A pairs detected in the content (used for FAQPage JSON-LD on the public page). */
  faq: { question: string; answer: string }[];
};

export type ContentScoreInput = {
  locale: "id" | "en";
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  contentHtml: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  coverImage?: { url: string; alt?: string | null } | null;
  ogImage?: { url: string; alt?: string | null } | null;
  categoryName?: string | null;
  tags?: string[];
  authorName?: string | null;
  publishedAt?: string | Date | null;
  updatedAt?: string | Date | null;
  noIndex?: boolean;
  /** Public site origin, used to classify internal links. */
  siteOrigin?: string;
};

// ─── HTML helpers (regex based; content is sanitized HTML from the editor) ───────────────

function decode(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");
}

function stripTags(html: string) {
  return decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function words(text: string) {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
}

function sentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9\p{Lu}"“(])/u)
    .map((s) => s.trim())
    .filter((s) => words(s).length >= 3);
}

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const QUESTION_WORDS = {
  id: ["apa", "apakah", "bagaimana", "mengapa", "kenapa", "kapan", "berapa", "siapa", "di mana", "dimana", "haruskah", "bisakah", "bolehkah"],
  en: ["what", "why", "how", "when", "where", "who", "which", "can", "should", "is", "are", "does", "do"],
};

function isQuestion(text: string, locale: "id" | "en") {
  const t = norm(text);
  if (/\?\s*$/.test(text.trim())) return true;
  const ws = [...QUESTION_WORDS[locale], ...QUESTION_WORDS[locale === "id" ? "en" : "id"]];
  return ws.some((w) => t === w || t.startsWith(w + " "));
}

const FAQ_HEADING = /\b(faq|pertanyaan (umum|yang sering)|tanya[- ]jawab|frequently asked|q&a)\b/i;
const TAKEAWAY_HEADING = /\b(ringkasan|poin (penting|utama)|inti(nya)?|kesimpulan|tl;?dr|key takeaways?|summary|in short|conclusion)\b/i;
const EVIDENCE_WORDS = /\b(menurut|berdasarkan|data|riset|penelitian|survei|studi|laporan|pengujian|uji coba|sumber|according to|research|study|survey|report|data shows|based on)\b/i;
const UNIT = "(%|persen|km|kw|kwh|wh|volt|v|menit|jam|detik|hari|bulan|tahun|kg|mm|cm|m|rp|juta|ribu|miliar|unit|titik|kota|orang|kali|x|minutes?|hours?|years?|percent)";

export function extractFaq(html: string, locale: "id" | "en"): { question: string; answer: string }[] {
  // Question heading (h2/h3) followed by the block content until the next heading.
  const re = /<h([23])[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[1-3][\s>]|$)/gi;
  const out: { question: string; answer: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const q = stripTags(m[2]);
    const a = stripTags(m[3]);
    if (q && a && isQuestion(q, locale) && words(a).length >= 8) out.push({ question: q, answer: a.slice(0, 1200) });
  }
  return out.slice(0, 20);
}

function collectStats(input: ContentScoreInput, html: string) {
  const text = stripTags(html);
  const ws = words(text);
  const sents = sentences(text);
  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => stripTags(m[1])).filter((p) => words(p).length > 0);
  const heads = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: Number(m[1]), text: stripTags(m[2]) }));
  const count = (l: number) => heads.filter((h) => h.level === l).length;
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const imagesMissingAlt = imgs.filter((tag) => !/\salt\s*=\s*"[^"]*[\p{L}\p{N}][^"]*"/iu.test(tag)).length;
  const hrefs = [...html.matchAll(/<a\b[^>]*href\s*=\s*"([^"]+)"/gi)].map((m) => decode(m[1]));
  const origin = (input.siteOrigin ?? "https://wedison.co").replace(/\/+$/, "");
  let internal = 0;
  const externalDomains = new Set<string>();
  for (const h of hrefs) {
    if (h.startsWith("#") || h.startsWith("mailto:") || h.startsWith("tel:")) continue;
    if (h.startsWith("/") || h.startsWith(origin) || /(^|\.)wedison\.(co|tech)\b/i.test(h)) internal++;
    else {
      try {
        externalDomains.add(new URL(h).hostname.replace(/^www\./, ""));
      } catch {
        /* ignore malformed */
      }
    }
  }
  const externalLinks = hrefs.filter((h) => /^https?:\/\//i.test(h) && !h.startsWith(origin) && !/(^|\.)wedison\.(co|tech)\b/i.test(h)).length;
  const numericFacts = (text.match(new RegExp(`\\b\\d{1,3}([.,]\\d{3})*([.,]\\d+)?\\s*${UNIT}\\b`, "gi")) ?? []).length + (text.match(/\b\d+(?:[.,]\d+)?%/g) ?? []).length;
  return {
    text,
    paragraphs,
    heads,
    stats: {
      words: ws.length,
      sentences: sents.length,
      paragraphs: paragraphs.length,
      headings: { h1: count(1), h2: count(2), h3: count(3), h4: count(4) },
      questionHeadings: heads.filter((h) => h.level >= 2 && isQuestion(h.text, input.locale)).length,
      images: imgs.length,
      imagesMissingAlt,
      internalLinks: internal,
      externalLinks,
      externalDomains: externalDomains.size,
      lists: (html.match(/<(ul|ol)\b/gi) ?? []).length,
      tables: (html.match(/<table\b/gi) ?? []).length,
      blockquotes: (html.match(/<blockquote\b/gi) ?? []).length,
      numericFacts,
      readingMinutes: Math.max(1, Math.round(ws.length / 200)),
    } satisfies ContentStats,
    sents,
  };
}

function scorePillar(checks: Check[]): PillarScore {
  const scored = checks.filter((c) => c.status !== "info");
  const total = scored.reduce((s, c) => s + c.weight, 0);
  const got = scored.reduce((s, c) => s + (c.status === "pass" ? c.weight : c.status === "warn" ? c.weight / 2 : 0), 0);
  const score = total ? Math.round((got / total) * 100) : 0;
  return {
    score,
    grade: score >= 80 ? "good" : score >= 55 ? "fair" : "poor",
    passed: scored.filter((c) => c.status === "pass").length,
    total: scored.length,
    checks,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────────────────

export function analyzeContent(input: ContentScoreInput): ContentScore {
  const html = input.contentHtml ?? "";
  const { text, paragraphs, heads, stats, sents } = collectStats(input, html);
  const L = input.locale;
  const title = (input.title ?? "").trim();
  const seoTitle = (input.seoTitle ?? "").trim() || title;
  const metaDesc = (input.seoDescription ?? "").trim() || (input.excerpt ?? "").trim();
  const keywordList = (input.seoKeywords ?? "")
    .split(",")
    .map((k) => norm(k))
    .filter(Boolean);
  const focus = keywordList[0] ?? "";
  const normText = norm(text);
  const first100 = norm(words(text).slice(0, 100).join(" "));
  const firstPara = paragraphs[0] ?? "";
  const firstParaWords = words(firstPara).length;
  const tags = input.tags ?? [];
  const seo: Check[] = [];
  const aeo: Check[] = [];
  const geo: Check[] = [];
  const add = (arr: Check[], c: Omit<Check, "pillar">, pillar: Pillar) => arr.push({ ...c, pillar });

  // ───────────── SEO ─────────────
  {
    const n = seoTitle.length;
    add(seo, {
      id: "title-length", label: "Title length", weight: 3, value: `${n} chars`,
      status: n >= 30 && n <= 60 ? "pass" : n >= 20 && n <= 70 ? "warn" : "fail",
      note: n === 0 ? "Write a title." : n < 30 ? "Titles under 30 characters look thin in search results. Aim for 30–60 characters." : n > 60 ? "Google truncates titles after about 60 characters. Shorten the SEO title or move details to the description." : undefined,
    }, "seo");
  }
  {
    const n = metaDesc.length;
    add(seo, {
      id: "meta-description", label: "Meta description", weight: 3, value: `${n} chars`,
      status: n >= 70 && n <= 160 ? "pass" : n > 0 ? "warn" : "fail",
      note: n === 0 ? "Add an excerpt or SEO description (70–160 characters). It becomes the snippet in search results and the summary AI engines quote." : n < 70 ? "Description is short. Use 70–160 characters to fill the snippet." : n > 160 ? "Description will be truncated in search results. Keep it under 160 characters." : undefined,
    }, "seo");
  }
  add(seo, {
    id: "focus-keyword", label: "Focus keyword defined", weight: 2, value: focus || "none",
    status: focus ? "pass" : "warn",
    note: focus ? undefined : "Add keywords (comma separated) in the SEO section. The first keyword is treated as the focus keyword for the checks below.",
  }, "seo");
  if (focus) {
    const inTitle = norm(seoTitle).includes(focus);
    const inIntro = first100.includes(focus);
    const inHeading = heads.some((h) => norm(h.text).includes(focus));
    const inSlug = norm((input.slug ?? "").replace(/-/g, " ")).includes(focus);
    const occurrences = normText.split(focus).length - 1;
    const density = stats.words ? (occurrences * words(focus).length * 100) / stats.words : 0;
    add(seo, { id: "keyword-title", label: "Keyword in title", weight: 2, status: inTitle ? "pass" : "warn", note: inTitle ? undefined : `Include “${focus}” in the title or SEO title.` }, "seo");
    add(seo, { id: "keyword-intro", label: "Keyword in the first paragraph", weight: 1, status: inIntro ? "pass" : "warn", note: inIntro ? undefined : `Mention “${focus}” within the first 100 words.` }, "seo");
    add(seo, { id: "keyword-heading", label: "Keyword in a subheading", weight: 1, status: inHeading ? "pass" : "warn", note: inHeading ? undefined : `Use “${focus}” in at least one H2/H3.` }, "seo");
    add(seo, { id: "keyword-slug", label: "Keyword in URL slug", weight: 1, status: inSlug ? "pass" : "warn", note: inSlug ? undefined : `Put “${focus}” in the slug.` }, "seo");
    add(seo, {
      id: "keyword-density", label: "Keyword density", weight: 1, value: `${density.toFixed(1)}% (${occurrences}×)`,
      status: occurrences === 0 ? "fail" : density > 3 ? "warn" : "pass",
      note: occurrences === 0 ? `“${focus}” never appears in the body text.` : density > 3 ? "Keyword repeated too often; write naturally and use synonyms." : undefined,
    }, "seo");
  }
  {
    const s = (input.slug ?? "").trim();
    add(seo, {
      id: "slug", label: "URL slug", weight: 1, value: s ? `${s.length} chars` : "empty",
      status: !s ? "warn" : s.length <= 75 && /^[a-z0-9-]+$/.test(s) ? "pass" : "warn",
      note: !s ? "Slug is generated from the title on save; shorter, descriptive slugs perform better." : s.length > 75 ? "Slug is long. Keep it under 75 characters with the main keyword." : !/^[a-z0-9-]+$/.test(s) ? "Use lowercase letters, numbers and hyphens only." : undefined,
    }, "seo");
  }
  add(seo, {
    id: "cover-image", label: "Cover image with alt text", weight: 2,
    status: !input.coverImage ? "fail" : (input.coverImage.alt ?? "").trim() ? "pass" : "warn",
    note: !input.coverImage ? "Add a cover image. It is used for cards, social previews and image search." : (input.coverImage.alt ?? "").trim() ? undefined : "Write alt text for the cover image (describe what is in the picture).",
  }, "seo");
  add(seo, {
    id: "inline-alt", label: "Inline images have alt text", weight: 2, value: `${stats.images - stats.imagesMissingAlt}/${stats.images}`,
    status: stats.images === 0 ? "info" : stats.imagesMissingAlt === 0 ? "pass" : stats.imagesMissingAlt < stats.images ? "warn" : "fail",
    note: stats.images === 0 ? "No inline images. Consider adding one or two relevant images." : stats.imagesMissingAlt ? `${stats.imagesMissingAlt} image(s) have no alt text. Click the image in the editor to add it.` : undefined,
  }, "seo");
  {
    const h2 = stats.headings.h2;
    add(seo, {
      id: "subheadings", label: "Subheadings (H2)", weight: 3, value: `${h2} H2 · ${stats.headings.h3} H3`,
      status: h2 >= 2 ? "pass" : h2 === 1 ? "warn" : "fail",
      note: h2 >= 2 ? undefined : "Break the article into sections with H2 headings (at least two). Each heading should say what the section answers.",
    }, "seo");
    add(seo, {
      id: "no-h1", label: "No H1 inside the body", weight: 1,
      status: stats.headings.h1 === 0 ? "pass" : "fail",
      note: stats.headings.h1 === 0 ? undefined : "The page title is already the H1. Change H1 headings in the body to H2.",
    }, "seo");
    let sequential = true;
    let prev = 1;
    for (const h of heads) {
      if (h.level > prev + 1) sequential = false;
      prev = h.level;
    }
    add(seo, { id: "heading-order", label: "Heading levels in order", weight: 1, status: heads.length === 0 ? "info" : sequential ? "pass" : "warn", note: sequential ? undefined : "Do not skip levels (e.g. H2 → H4). Use H3 under H2." }, "seo");
  }
  add(seo, {
    id: "word-count", label: "Article length", weight: 3, value: `${stats.words} words`,
    status: stats.words >= 600 ? "pass" : stats.words >= 300 ? "warn" : "fail",
    note: stats.words >= 600 ? undefined : stats.words >= 300 ? "Around 600+ words gives search engines enough context. Expand the sections that matter most." : "The article is very short. Aim for at least 600 words of useful content.",
  }, "seo");
  add(seo, {
    id: "internal-links", label: "Internal links", weight: 2, value: String(stats.internalLinks),
    status: stats.internalLinks >= 1 ? "pass" : "warn",
    note: stats.internalLinks ? undefined : "Link to related Wedison pages (a product, SuperCharge, showroom or another article). Internal links help ranking and keep readers on the site.",
  }, "seo");
  {
    const avg = paragraphs.length ? Math.round(paragraphs.reduce((s, p) => s + words(p).length, 0) / paragraphs.length) : 0;
    const longest = paragraphs.reduce((m, p) => Math.max(m, words(p).length), 0);
    add(seo, {
      id: "paragraphs", label: "Paragraph length", weight: 1, value: `avg ${avg} · max ${longest} words`,
      status: paragraphs.length === 0 ? "info" : longest <= 150 && avg <= 90 ? "pass" : "warn",
      note: paragraphs.length && (longest > 150 || avg > 90) ? "Some paragraphs are long. Split them into 2–4 sentences each for readability on mobile." : undefined,
    }, "seo");
  }
  add(seo, { id: "topic", label: "Topic assigned", weight: 1, status: input.categoryName ? "pass" : "warn", note: input.categoryName ? undefined : "Assign a topic. It becomes the article section in structured data and the Media Center filter." }, "seo");
  add(seo, { id: "tags", label: "Tags (1–6)", weight: 1, value: String(tags.length), status: tags.length >= 1 && tags.length <= 6 ? "pass" : tags.length === 0 ? "warn" : "warn", note: tags.length === 0 ? "Add 2–4 relevant tags." : tags.length > 6 ? "Too many tags dilute relevance; keep the most specific ones." : undefined }, "seo");
  add(seo, {
    id: "social-preview", label: "Social share preview", weight: 1,
    status: input.ogImage || input.coverImage ? "pass" : "warn",
    note: input.ogImage || input.coverImage ? undefined : "Without a cover or share image, links shared on WhatsApp/LinkedIn show no picture.",
  }, "seo");
  if (input.canonicalUrl) {
    let valid = false;
    try {
      valid = /^https?:$/.test(new URL(input.canonicalUrl).protocol);
    } catch {
      valid = false;
    }
    add(seo, { id: "canonical", label: "Canonical URL valid", weight: 1, status: valid ? "pass" : "fail", note: valid ? "Canonical points elsewhere: this page will not rank on its own (intended for republished content)." : "Canonical URL is not a valid http(s) URL." }, "seo");
  }
  if (input.noIndex) add(seo, { id: "noindex", label: "Hidden from search engines", weight: 0, status: "info", note: "noindex is on. The article will not appear in Google or AI search results." }, "seo");

  // ───────────── AEO (Answer Engine Optimization) ─────────────
  {
    const topicWords = norm(title).split(" ").filter((w) => w.length > 3);
    const mentionsTopic = topicWords.some((w) => norm(firstPara).includes(w)) || (focus && norm(firstPara).includes(focus));
    const ok = firstParaWords >= 30 && firstParaWords <= 90 && mentionsTopic;
    add(aeo, {
      id: "direct-answer", label: "Direct answer in the opening paragraph", weight: 3, value: `${firstParaWords} words`,
      status: ok ? "pass" : firstParaWords > 0 && mentionsTopic ? "warn" : "fail",
      note: ok ? undefined : firstParaWords === 0 ? "Start with a short paragraph that answers the main question of the article in plain words." : !mentionsTopic ? "The first paragraph does not mention the article's topic. State the answer up front, then explain." : firstParaWords < 30 ? "Opening paragraph is too short to be quoted as an answer (aim for 40–80 words)." : "Opening paragraph is long. Answer engines prefer a concise 40–80 word answer first, details after.",
    }, "aeo");
  }
  add(aeo, {
    id: "question-headings", label: "Question-style subheadings", weight: 3, value: String(stats.questionHeadings),
    status: stats.questionHeadings >= 2 ? "pass" : stats.questionHeadings === 1 ? "warn" : "fail",
    note: stats.questionHeadings >= 2 ? undefined : "Phrase subheadings as the questions people actually ask (e.g. “Berapa lama pengisian SuperCharge?”) and answer directly under each.",
  }, "aeo");
  {
    const faqPairs = extractFaq(html, L);
    const hasFaqHeading = heads.some((h) => FAQ_HEADING.test(h.text));
    const ok = faqPairs.length >= 2 || (hasFaqHeading && faqPairs.length >= 1);
    add(aeo, {
      id: "faq-section", label: "FAQ block (auto FAQPage schema)", weight: 2, value: `${faqPairs.length} Q&A`,
      status: ok ? "pass" : faqPairs.length === 1 ? "warn" : "warn",
      note: ok ? "Detected Q&A pairs are published as FAQPage structured data automatically." : "Add a short FAQ at the end: 2–4 question headings (H2/H3 ending with “?”) each followed by a 1–3 sentence answer. It is emitted as FAQPage schema automatically.",
    }, "aeo");
  }
  add(aeo, {
    id: "lists-tables", label: "Lists or tables", weight: 2, value: `${stats.lists} lists · ${stats.tables} tables`,
    status: stats.lists + stats.tables >= 1 ? "pass" : "warn",
    note: stats.lists + stats.tables ? undefined : "Use bullet points, numbered steps or a comparison table for facts that can be listed. They are the easiest format for answer engines to extract.",
  }, "aeo");
  {
    const avg = sents.length ? Math.round(sents.reduce((s, x) => s + words(x).length, 0) / sents.length) : 0;
    add(aeo, {
      id: "sentence-length", label: "Sentence length", weight: 2, value: `avg ${avg} words`,
      status: sents.length === 0 ? "info" : avg <= 22 ? "pass" : avg <= 28 ? "warn" : "fail",
      note: sents.length && avg > 22 ? "Sentences are long. Keep most under 20 words; one idea per sentence." : undefined,
    }, "aeo");
  }
  add(aeo, {
    id: "summary", label: "Summary / excerpt", weight: 2,
    status: (input.excerpt ?? "").trim().length >= 60 ? "pass" : (input.excerpt ?? "").trim() ? "warn" : "fail",
    note: (input.excerpt ?? "").trim().length >= 60 ? undefined : "Write a 1–2 sentence excerpt that summarises the article. It is reused as the answer snippet.",
  }, "aeo");
  {
    const hasTakeaways = heads.some((h) => TAKEAWAY_HEADING.test(h.text));
    add(aeo, {
      id: "key-takeaways", label: "Key takeaways or conclusion", weight: 1,
      status: hasTakeaways ? "pass" : "warn",
      note: hasTakeaways ? undefined : "Add a “Ringkasan”/“Kesimpulan” section with 3–5 bullet points. Answer engines often quote it verbatim.",
    }, "aeo");
  }
  {
    const first300 = words(text).slice(0, 300).join(" ");
    const hasDefinition = /\b(adalah|merupakan|yaitu|is a|is an|are|means|refers to)\b/i.test(first300) || /<strong>|<b>/i.test(html.slice(0, 3000));
    add(aeo, {
      id: "definitions", label: "Clear definitions of key terms", weight: 1,
      status: hasDefinition ? "pass" : "warn",
      note: hasDefinition ? undefined : "Define the main term early (“SuperCharge adalah …”) so the article can be cited as a definition.",
    }, "aeo");
  }
  {
    const howTo = /\b(cara|langkah|panduan|tutorial|how to|guide|steps?)\b/i.test(title);
    const ordered = /<ol\b/i.test(html);
    add(aeo, {
      id: "steps", label: "Numbered steps for how-to content", weight: 1,
      status: !howTo ? "info" : ordered ? "pass" : "warn",
      note: !howTo ? "Not a how-to article." : ordered ? undefined : "This looks like a how-to. Put the steps in a numbered list.",
    }, "aeo");
  }

  // ───────────── GEO (Generative Engine Optimization) ─────────────
  add(geo, {
    id: "sources", label: "Cited external sources", weight: 3, value: `${stats.externalDomains} domain(s)`,
    status: stats.externalDomains >= 2 ? "pass" : stats.externalDomains === 1 ? "warn" : "fail",
    note: stats.externalDomains >= 2 ? undefined : "Link to 2+ credible sources (government data, research, reputable media). AI engines weight cited, verifiable content higher.",
  }, "geo");
  add(geo, {
    id: "statistics", label: "Concrete numbers and statistics", weight: 3, value: String(stats.numericFacts),
    status: stats.numericFacts >= 3 ? "pass" : stats.numericFacts >= 1 ? "warn" : "fail",
    note: stats.numericFacts >= 3 ? undefined : "Add specific figures with units (km, menit, %, Rp). Generative engines prefer precise, quotable facts over generic claims.",
  }, "geo");
  {
    const attributedQuote = stats.blockquotes > 0 || /[“"][^”"]{20,}[”"]\s*[,.]?\s*(kata|ujar|ucap|menurut|said|says)\b/i.test(text);
    add(geo, {
      id: "quotes", label: "Quotes from people or documents", weight: 2, value: String(stats.blockquotes),
      status: attributedQuote ? "pass" : "warn",
      note: attributedQuote ? undefined : "Include at least one attributed quote (a Wedison engineer, a customer, an official source). Use the blockquote block.",
    }, "geo");
  }
  add(geo, {
    id: "author", label: "Named author", weight: 2,
    status: input.authorName ? "pass" : "warn",
    note: input.authorName ? undefined : "Articles without a named author are less trusted (E-E-A-T). The author is taken from the account that created the article.",
  }, "geo");
  {
    const brandEarly = /wedison/i.test(seoTitle) || /wedison/i.test(first100);
    add(geo, {
      id: "entity", label: "Brand/entity named early", weight: 2,
      status: brandEarly ? "pass" : "warn",
      note: brandEarly ? undefined : "Mention “Wedison” (and the product name) in the title or first 100 words so the content is attributed to the right entity.",
    }, "geo");
  }
  add(geo, {
    id: "depth", label: "Depth of coverage", weight: 2, value: `${stats.words} words · ${stats.headings.h2} sections`,
    status: stats.words >= 800 && stats.headings.h2 >= 3 ? "pass" : stats.words >= 500 ? "warn" : "fail",
    note: stats.words >= 800 && stats.headings.h2 >= 3 ? undefined : "Comprehensive pieces (800+ words, 3+ sections) are cited more often by AI answers than thin ones.",
  }, "geo");
  add(geo, {
    id: "evidence-language", label: "Evidence and attribution language", weight: 1,
    status: EVIDENCE_WORDS.test(text) ? "pass" : "warn",
    note: EVIDENCE_WORDS.test(text) ? undefined : "Show where claims come from (“menurut data …”, “berdasarkan pengujian …”).",
  }, "geo");
  add(geo, {
    id: "original-media", label: "Original images", weight: 1, value: String(stats.images + (input.coverImage ? 1 : 0)),
    status: stats.images + (input.coverImage ? 1 : 0) >= 2 ? "pass" : stats.images + (input.coverImage ? 1 : 0) === 1 ? "warn" : "fail",
    note: stats.images + (input.coverImage ? 1 : 0) >= 2 ? undefined : "Add original photos, charts or product images with descriptive alt text.",
  }, "geo");
  {
    const published = input.publishedAt ? new Date(input.publishedAt) : null;
    const updated = input.updatedAt ? new Date(input.updatedAt) : null;
    const ref = updated ?? published;
    const days = ref ? Math.floor((Date.now() - ref.getTime()) / 86400000) : null;
    add(geo, {
      id: "freshness", label: "Freshness", weight: 1, value: days === null ? "not published" : `${days} days`,
      status: days === null ? "info" : days <= 180 ? "pass" : days <= 365 ? "warn" : "fail",
      note: days === null ? "Freshness is tracked from the publish/update date." : days > 180 ? "Content older than 6 months: review facts, update figures and re-save to refresh the modified date." : undefined,
    }, "geo");
  }
  add(geo, {
    id: "keywords-meta", label: "Keywords for topical signals", weight: 1, value: String(keywordList.length),
    status: keywordList.length >= 2 ? "pass" : keywordList.length === 1 ? "warn" : "fail",
    note: keywordList.length >= 2 ? undefined : "List 3–6 related keywords/entities in the SEO section (they feed the keywords meta and NewsArticle schema).",
  }, "geo");
  add(geo, {
    id: "structured-data", label: "Structured data (NewsArticle, Breadcrumb)", weight: 1,
    status: "pass",
    note: "Generated automatically on the public page.",
  }, "geo");

  const seoScore = scorePillar(seo);
  const aeoScore = scorePillar(aeo);
  const geoScore = scorePillar(geo);
  return {
    version: 1,
    analyzedAt: new Date().toISOString(),
    overall: Math.round((seoScore.score + aeoScore.score + geoScore.score) / 3),
    seo: seoScore,
    aeo: aeoScore,
    geo: geoScore,
    stats,
    faq: extractFaq(html, L),
  };
}
