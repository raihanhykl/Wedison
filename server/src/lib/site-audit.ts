/**
 * Site-wide SEO / AEO / GEO audit. Crawls the public pages listed in the site's sitemap
 * (rewritten to the internal base URL so it works behind nginx), plus robots.txt, llms.txt and
 * the manifest, and turns the findings into three pillar checklists with plain-language notes.
 * Runs on demand from the admin (POST /admin/seo/site/run); the last result is stored in the
 * Setting table so the dashboard can show it without re-crawling.
 */
import { logger } from "./logger.js";

export type SiteCheckStatus = "pass" | "warn" | "fail" | "info";
export type SiteCheck = {
  id: string;
  pillar: "seo" | "aeo" | "geo";
  label: string;
  status: SiteCheckStatus;
  weight: number;
  note?: string;
  value?: string;
  /** Paths affected (for the note), max 8. */
  pages?: string[];
};
export type SitePillar = { score: number; grade: "good" | "fair" | "poor"; passed: number; total: number; checks: SiteCheck[] };

export type PageResult = {
  path: string;
  status: number;
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  canonical: string;
  hreflang: number;
  robots: string;
  h1: number;
  h2: number;
  questionHeadings: number;
  jsonLdTypes: string[];
  images: number;
  imagesMissingAlt: number;
  ogImage: string;
  words: number;
  hasMain: boolean;
  internalLinkIssues: number;
  metadataInHead: boolean;
  issues: string[];
};

export type SiteAudit = {
  version: 1;
  ranAt: string;
  durationMs: number;
  baseUrl: string;
  publicOrigin: string;
  pagesCrawled: number;
  overall: number;
  seo: SitePillar;
  aeo: SitePillar;
  geo: SitePillar;
  pages: PageResult[];
  files: { robots: boolean; sitemap: boolean; llms: boolean; manifest: boolean; robotsAllowsAi: boolean; sitemapUrls: number };
};

const UA = "Mozilla/5.0 (compatible; WedisonAdminAudit/1.0; +https://wedison.co)";

function attr(tag: string, name: string) {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"));
  return m ? m[1].replace(/&amp;/g, "&") : "";
}
function strip(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const Q_WORDS = /^(apa|apakah|bagaimana|mengapa|kenapa|kapan|berapa|siapa|di ?mana|what|why|how|when|where|who|which|can|should|is|are|does|do)\b/i;

function analysePage(path: string, status: number, html: string): PageResult {
  const headEnd = html.indexOf("</head>");
  const inHead = (i: number) => i >= 0 && i < headEnd;
  const tags = [...html.matchAll(/<(title|meta|link)\b[^>]*>/gi)].map((m) => ({ tag: m[0], idx: m.index ?? -1 }));
  const titleTag = tags.find((t) => /^<title/i.test(t.tag));
  const title = (html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1] ?? "").replace(/\s+/g, " ").trim();
  const desc = tags.find((t) => /name="description"/i.test(t.tag));
  const canonical = tags.find((t) => /rel="canonical"/i.test(t.tag));
  const hreflang = tags.filter((t) => /hreflang=/i.test(t.tag));
  const robots = tags.find((t) => /name="robots"/i.test(t.tag));
  const og = tags.find((t) => /property="og:image"/i.test(t.tag));
  const body = html.slice(headEnd);
  const heads = [...body.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: Number(m[1]), text: strip(m[2]) }));
  const imgs = [...body.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  // alt="" is valid for decorative images (WCAG); only images with no alt attribute at all are flagged.
  const imagesMissingAlt = imgs.filter((t) => !/\salt\s*=/i.test(t)).length;
  const jsonLdTypes: string[] = [];
  // Collect every @type, recursing into arrays and @graph (schemas can nest, e.g. [breadcrumb, {@graph:[dealers]}]).
  const collectTypes = (node: unknown, depth = 0) => {
    if (!node || typeof node !== "object" || depth > 4) return;
    if (Array.isArray(node)) return node.forEach((n) => collectTypes(n, depth + 1));
    const o = node as Record<string, unknown>;
    const t = o["@type"];
    if (typeof t === "string") jsonLdTypes.push(t);
    else if (Array.isArray(t)) jsonLdTypes.push(...t.filter((x): x is string => typeof x === "string"));
    if (Array.isArray(o["@graph"])) collectTypes(o["@graph"], depth + 1);
  };
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      collectTypes(JSON.parse(m[1]));
    } catch {
      jsonLdTypes.push("INVALID");
    }
  }
  const links = [...body.matchAll(/<a\b[^>]*href="([^"]*)"/gi)].map((m) => m[1].replace(/&amp;/g, "&"));
  const internalLinkIssues = [...new Set(links.filter((l) => l.startsWith("/") && !l.startsWith("//")))].filter((l) => {
    const p = l.split(/[?#]/)[0];
    if (/\.[a-z0-9]{2,5}$/i.test(p) || p.startsWith("/admin") || p.startsWith("/api")) return false;
    return !/^\/(id|en)\//.test(p) || !p.endsWith("/");
  }).length;
  const words = strip(body).split(/\s+/).filter(Boolean).length;
  const r: PageResult = {
    path,
    status,
    title,
    titleLength: title.length,
    description: desc ? attr(desc.tag, "content") : "",
    descriptionLength: desc ? attr(desc.tag, "content").length : 0,
    canonical: canonical ? attr(canonical.tag, "href") : "",
    hreflang: hreflang.length,
    robots: robots ? attr(robots.tag, "content") : "",
    h1: heads.filter((h) => h.level === 1).length,
    h2: heads.filter((h) => h.level === 2).length,
    questionHeadings: heads.filter((h) => h.level >= 2 && (Q_WORDS.test(h.text) || /\?\s*$/.test(h.text))).length,
    jsonLdTypes,
    images: imgs.length,
    imagesMissingAlt,
    ogImage: og ? attr(og.tag, "content") : "",
    words,
    hasMain: (body.match(/<main[\s>]/gi) ?? []).length === 1,
    internalLinkIssues,
    metadataInHead: !!titleTag && inHead(titleTag.idx) && !!canonical && inHead(canonical.idx) && (!desc || inHead(desc.idx)),
    issues: [],
  };
  if (status !== 200) r.issues.push(`HTTP ${status}`);
  if (!r.title) r.issues.push("Missing <title>");
  else if (r.titleLength < 30 || r.titleLength > 60) r.issues.push(`Title length ${r.titleLength} (ideal 30–60)`);
  if (!r.description) r.issues.push("Missing meta description");
  else if (r.descriptionLength < 70 || r.descriptionLength > 160) r.issues.push(`Description length ${r.descriptionLength} (ideal 70–160)`);
  if (!r.canonical) r.issues.push("Missing canonical");
  if (!r.metadataInHead) r.issues.push("Metadata rendered outside <head>");
  if (r.h1 !== 1) r.issues.push(`${r.h1} H1 (expected 1)`);
  if (r.h2 === 0) r.issues.push("No H2 headings");
  if (r.imagesMissingAlt > 0) r.issues.push(`${r.imagesMissingAlt} image(s) without alt`);
  if (!r.ogImage) r.issues.push("No og:image");
  if (r.jsonLdTypes.length === 0) r.issues.push("No structured data");
  if (r.jsonLdTypes.includes("INVALID")) r.issues.push("Invalid JSON-LD");
  if (r.internalLinkIssues) r.issues.push(`${r.internalLinkIssues} internal link(s) without locale/trailing slash`);
  if (!r.hasMain) r.issues.push("No single <main> landmark");
  return r;
}

async function fetchText(url: string, timeoutMs = 20000) {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html,*/*" }, redirect: "manual", signal: AbortSignal.timeout(timeoutMs) });
    return { status: res.status, body: await res.text() };
  } catch (err) {
    logger.warn({ url, err: (err as Error).message }, "site audit fetch failed");
    return { status: 0, body: "" };
  }
}

function pillar(checks: SiteCheck[]): SitePillar {
  const scored = checks.filter((c) => c.status !== "info");
  const total = scored.reduce((s, c) => s + c.weight, 0);
  const got = scored.reduce((s, c) => s + (c.status === "pass" ? c.weight : c.status === "warn" ? c.weight / 2 : 0), 0);
  const score = total ? Math.round((got / total) * 100) : 0;
  return { score, grade: score >= 80 ? "good" : score >= 55 ? "fair" : "poor", passed: scored.filter((c) => c.status === "pass").length, total: scored.length, checks };
}

export type SiteAuditContext = {
  /** Published, indexable CMS articles and how recent they are (from DB). */
  articles: { published: number; publishedLast90d: number; withAuthor: number; avgSeo: number | null; avgAeo: number | null; avgGeo: number | null };
};

export async function runSiteAudit(baseUrl: string, ctx: SiteAuditContext, opts: { maxPages?: number; concurrency?: number } = {}): Promise<SiteAudit> {
  const t0 = Date.now();
  const base = baseUrl.replace(/\/+$/, "");
  const maxPages = opts.maxPages ?? 60;
  const conc = opts.concurrency ?? 4;

  const [robots, sitemap, llms, manifest] = await Promise.all([
    fetchText(`${base}/robots.txt`),
    fetchText(`${base}/sitemap.xml`),
    fetchText(`${base}/llms.txt`),
    fetchText(`${base}/manifest.webmanifest`),
  ]);
  const locs = [...sitemap.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  let publicOrigin = base;
  try {
    if (locs[0]) publicOrigin = new URL(locs[0]).origin;
  } catch {
    /* keep base */
  }
  const paths = [...new Set(locs.map((u) => {
    try {
      return new URL(u).pathname;
    } catch {
      return "";
    }
  }).filter(Boolean))];
  // Prioritise key pages first, then the rest, capped.
  const key = paths.filter((p) => /^\/(id|en)\/$/.test(p) || /\/(products|super-charge|showroom|faq|corporate|media-center|compare|ojol|career)\/?$/.test(p) || /\/products\/[^/]+\/$/.test(p));
  const rest = paths.filter((p) => !key.includes(p) && !/\/en\/media-center\/news\//.test(p));
  const targets = [...key, ...rest].slice(0, maxPages);
  if (!targets.includes("/id/")) targets.unshift("/id/");

  const pages: PageResult[] = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: conc }, async () => {
      while (i < targets.length) {
        const p = targets[i++];
        const { status, body } = await fetchText(`${base}${p}`);
        pages.push(analysePage(p, status, body));
      }
    }),
  );
  pages.sort((a, b) => targets.indexOf(a.path) - targets.indexOf(b.path));

  const robotsAllowsAi = !/user-agent:\s*(gptbot|claudebot|perplexitybot|google-extended|ccbot)[\s\S]*?disallow:\s*\/\s*$/im.test(robots.body);
  const files = {
    robots: robots.status === 200,
    sitemap: sitemap.status === 200 && sitemap.body.includes("<urlset"),
    llms: llms.status === 200 && llms.body.trim().startsWith("#"),
    manifest: manifest.status === 200,
    robotsAllowsAi,
    sitemapUrls: locs.length,
  };
  const ok = pages.filter((p) => p.status === 200);
  const pct = (n: number, d: number) => (d ? Math.round((n * 100) / d) : 0);
  const listPaths = (f: (p: PageResult) => boolean) => ok.filter(f).map((p) => p.path).slice(0, 8);
  const ratioCheck = (
    id: string, pillarName: SiteCheck["pillar"], label: string, weight: number, bad: (p: PageResult) => boolean, note: string, passAt = 100, warnAt = 85,
  ): SiteCheck => {
    const badPages = ok.filter(bad);
    const good = pct(ok.length - badPages.length, ok.length);
    return {
      id, pillar: pillarName, label, weight, value: `${good}% of ${ok.length} pages`,
      status: ok.length === 0 ? "info" : good >= passAt ? "pass" : good >= warnAt ? "warn" : "fail",
      note: badPages.length ? note : undefined,
      pages: badPages.map((p) => p.path).slice(0, 8),
    };
  };

  const seo: SiteCheck[] = [
    { id: "reachable", pillar: "seo", label: "All sitemap pages return 200", weight: 3, value: `${ok.length}/${pages.length}`, status: ok.length === pages.length ? "pass" : "fail", note: ok.length === pages.length ? undefined : "Some URLs in the sitemap do not load. Fix or remove them.", pages: pages.filter((p) => p.status !== 200).map((p) => `${p.path} (${p.status})`).slice(0, 8) },
    ratioCheck("metadata-head", "seo", "Metadata rendered inside <head>", 3, (p) => !p.metadataInHead, "Title/canonical/description are streamed into <body> on these pages, so crawlers may miss them. Expected in `next dev`; on a production build it points to dynamic rendering (headers()/cookies() in a layout)."),
    ratioCheck("title-length", "seo", "Title length 30–60", 2, (p) => !p.title || p.titleLength < 30 || p.titleLength > 60, "Adjust titles in seo-strings.ts (static pages) or the article SEO title.", 100, 80),
    ratioCheck("description", "seo", "Meta description 70–160", 2, (p) => !p.description || p.descriptionLength < 70 || p.descriptionLength > 160, "Write descriptions of 70–160 characters for these pages.", 100, 80),
    ratioCheck("canonical", "seo", "Canonical present", 2, (p) => !p.canonical, "Every page needs a canonical URL."),
    ratioCheck("hreflang", "seo", "hreflang alternates", 1, (p) => p.hreflang === 0, "Bilingual pages should declare id/en alternates."),
    ratioCheck("single-h1", "seo", "Exactly one H1", 2, (p) => p.h1 !== 1, "Each page must have one H1 (the page title)."),
    ratioCheck("h2", "seo", "At least one H2", 1, (p) => p.h2 === 0, "Add section headings (H2) to structure the page.", 100, 85),
    ratioCheck("img-alt", "seo", "Images with alt text", 2, (p) => p.imagesMissingAlt > 0, "Add alt text to content images (decorative images may use alt=\"\").", 100, 70),
    ratioCheck("og-image", "seo", "Open Graph image", 1, (p) => !p.ogImage, "Set an og:image so shared links show a preview."),
    ratioCheck("internal-links", "seo", "Internal links without redirects", 1, (p) => p.internalLinkIssues > 0, "Links must include the locale prefix and trailing slash to avoid 307/308 hops."),
    ratioCheck("main-landmark", "seo", "Single <main> landmark", 1, (p) => !p.hasMain, "Wrap page content in one <main> element."),
    { id: "robots", pillar: "seo", label: "robots.txt", weight: 1, status: files.robots ? "pass" : "fail", note: files.robots ? undefined : "robots.txt is missing." },
    { id: "sitemap", pillar: "seo", label: "sitemap.xml", weight: 2, value: `${files.sitemapUrls} URLs`, status: files.sitemap && files.sitemapUrls > 0 ? "pass" : "fail", note: files.sitemap ? undefined : "sitemap.xml is missing or empty." },
    { id: "noindex", pillar: "seo", label: "Pages indexable", weight: 0, status: "info", value: `${ok.filter((p) => /noindex/i.test(p.robots)).length} noindex`, note: /noindex/i.test(ok[0]?.robots ?? "") ? "This environment sends noindex (expected on staging, must NOT happen on production)." : "No noindex on crawled pages." },
  ];

  const faqPages = ok.filter((p) => p.jsonLdTypes.includes("FAQPage"));
  const breadcrumbPages = ok.filter((p) => p.jsonLdTypes.includes("BreadcrumbList"));
  const innerPages = ok.filter((p) => !/^\/(id|en)\/$/.test(p.path));
  const aeo: SiteCheck[] = [
    { id: "faq-schema", pillar: "aeo", label: "FAQPage structured data", weight: 3, value: `${faqPages.length} page(s)`, status: faqPages.length >= 1 ? "pass" : "fail", note: faqPages.length ? undefined : "Publish an FAQ page (or FAQ blocks in articles) with FAQPage schema so answer engines can lift Q&A directly." },
    ratioCheck("question-headings", "aeo", "Pages with question-style headings", 2, (p) => p.questionHeadings === 0, "Phrase some subheadings as questions users ask; answer directly below.", 60, 35),
    ratioCheck("breadcrumbs", "aeo", "BreadcrumbList on inner pages", 1, (p) => innerPages.includes(p) && !p.jsonLdTypes.includes("BreadcrumbList"), "Add breadcrumb schema to inner pages.", 95, 70),
    ratioCheck("descriptions-answer", "aeo", "Descriptions usable as answers", 2, (p) => p.descriptionLength < 70, "Descriptions under 70 characters are rarely quoted as answers.", 100, 80),
    ratioCheck("structure", "aeo", "Pages with enough sections (2+ H2)", 1, (p) => p.h2 < 2, "Give pages clear sections so passages can be extracted.", 90, 70),
    { id: "llms", pillar: "aeo", label: "llms.txt", weight: 2, status: files.llms ? "pass" : "fail", note: files.llms ? undefined : "Provide /llms.txt (llmstxt.org) summarising the company, key facts and links." },
    { id: "article-aeo", pillar: "aeo", label: "Average article AEO score", weight: 2, value: ctx.articles.avgAeo === null ? "no articles" : `${ctx.articles.avgAeo}/100`, status: ctx.articles.avgAeo === null ? "info" : ctx.articles.avgAeo >= 70 ? "pass" : ctx.articles.avgAeo >= 50 ? "warn" : "fail", note: ctx.articles.avgAeo !== null && ctx.articles.avgAeo < 70 ? "Open low-scoring articles in the CMS and follow the AEO notes (direct answers, question headings, FAQ block)." : undefined },
  ];

  const orgPages = ok.filter((p) => p.jsonLdTypes.includes("Organization"));
  const productPages = ok.filter((p) => p.jsonLdTypes.includes("Product"));
  const localBiz = ok.filter((p) => p.jsonLdTypes.some((t) => /LocalBusiness|MotorcycleDealer|Store/.test(t)));
  const geo: SiteCheck[] = [
    { id: "org-schema", pillar: "geo", label: "Organization + WebSite schema", weight: 3, value: `${orgPages.length} page(s)`, status: orgPages.length >= Math.max(1, Math.floor(ok.length * 0.9)) ? "pass" : orgPages.length ? "warn" : "fail", note: orgPages.length >= Math.max(1, Math.floor(ok.length * 0.9)) ? undefined : "Organization/WebSite schema should be on every page (layout level) with sameAs links to official social profiles." },
    { id: "product-schema", pillar: "geo", label: "Product schema on product pages", weight: 2, value: `${productPages.length} page(s)`, status: productPages.length >= 4 ? "pass" : productPages.length ? "warn" : "fail", note: productPages.length >= 4 ? undefined : "Each product page should carry Product/Motorcycle schema with specs." },
    { id: "local-schema", pillar: "geo", label: "LocalBusiness schema (showrooms)", weight: 1, status: localBiz.length ? "pass" : "fail", note: localBiz.length ? undefined : "Showroom pages should publish LocalBusiness/MotorcycleDealer schema with address, geo and opening hours." },
    { id: "ai-crawlers", pillar: "geo", label: "AI crawlers allowed in robots.txt", weight: 2, status: files.robots ? (files.robotsAllowsAi ? "pass" : "fail") : "warn", note: files.robotsAllowsAi ? undefined : "robots.txt blocks GPTBot/ClaudeBot/PerplexityBot; generative engines cannot read the site." },
    { id: "llms-geo", pillar: "geo", label: "llms.txt with key facts", weight: 2, status: files.llms ? "pass" : "fail", note: files.llms ? undefined : "Add /llms.txt with company summary, facts and canonical links." },
    { id: "content-volume", pillar: "geo", label: "Published articles", weight: 2, value: String(ctx.articles.published), status: ctx.articles.published >= 10 ? "pass" : ctx.articles.published >= 3 ? "warn" : "fail", note: ctx.articles.published >= 10 ? undefined : "Generative engines cite sites with a body of original, well-sourced articles. Aim for 10+ published pieces." },
    { id: "content-freshness", pillar: "geo", label: "Articles published in last 90 days", weight: 2, value: String(ctx.articles.publishedLast90d), status: ctx.articles.publishedLast90d >= 3 ? "pass" : ctx.articles.publishedLast90d >= 1 ? "warn" : "fail", note: ctx.articles.publishedLast90d >= 3 ? undefined : "Publish regularly (2–4 articles a month) to stay fresh in AI answers." },
    { id: "article-geo", pillar: "geo", label: "Average article GEO score", weight: 2, value: ctx.articles.avgGeo === null ? "no articles" : `${ctx.articles.avgGeo}/100`, status: ctx.articles.avgGeo === null ? "info" : ctx.articles.avgGeo >= 70 ? "pass" : ctx.articles.avgGeo >= 50 ? "warn" : "fail", note: ctx.articles.avgGeo !== null && ctx.articles.avgGeo < 70 ? "Follow the GEO notes in the article editor: cite sources, add statistics and quotes, name the author." : undefined },
    { id: "authorship", pillar: "geo", label: "Articles with a named author", weight: 1, value: `${ctx.articles.withAuthor}/${ctx.articles.published}`, status: ctx.articles.published === 0 ? "info" : ctx.articles.withAuthor === ctx.articles.published ? "pass" : "warn", note: ctx.articles.published && ctx.articles.withAuthor < ctx.articles.published ? "Assign authors to all published articles (E-E-A-T)." : undefined },
    ratioCheck("jsonld-valid", "geo", "Structured data parses", 1, (p) => p.jsonLdTypes.includes("INVALID") || p.jsonLdTypes.length === 0, "Fix invalid or missing JSON-LD on these pages."),
  ];

  const seoP = pillar(seo);
  const aeoP = pillar(aeo);
  const geoP = pillar(geo);
  return {
    version: 1,
    ranAt: new Date().toISOString(),
    durationMs: Date.now() - t0,
    baseUrl: base,
    publicOrigin,
    pagesCrawled: pages.length,
    overall: Math.round((seoP.score + aeoP.score + geoP.score) / 3),
    seo: seoP,
    aeo: aeoP,
    geo: geoP,
    pages,
    files,
  };
}
