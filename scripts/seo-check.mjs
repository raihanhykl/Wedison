#!/usr/bin/env node
/**
 * Pemeriksaan SEO/keamanan otomatis terhadap server yang sudah jalan (standalone atau staging).
 * Mencegah regresi temuan audit 2026-09 (docs/SEO-AUDIT-2026-09.md):
 *   - <title>, meta description, canonical, hreflang harus ada DI DALAM <head>
 *     (untuk UA browser, Googlebot, dan bot tanpa JS)
 *   - satu <h1> per halaman, panjang title/description wajar, OG image 200
 *   - header keamanan (CSP, XFO, nosniff, Referrer-Policy) + tanpa X-Powered-By
 *   - link internal tidak boleh memicu redirect (tanpa locale / tanpa trailing slash)
 *   - robots.txt, sitemap.xml, llms.txt, manifest tersedia; JSON-LD valid
 *   - halaman 404 benar-benar 404
 *
 * Pakai:  node scripts/seo-check.mjs http://127.0.0.1:3999 [--expect-noindex]
 * Exit code 1 bila ada kegagalan. Dipanggil di CI (.github/workflows/pr-check.yml).
 */

const base = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/+$/, "");
const expectNoindex = process.argv.includes("--expect-noindex");

const PAGES = [
  "/id/",
  "/en/",
  "/id/products/",
  "/id/products/athena/",
  "/en/products/bees/",
  "/id/super-charge/",
  "/id/super-charge/locations/",
  "/id/showroom/",
  "/id/faq/",
  "/en/compare/",
  "/id/corporate/about/",
  "/id/corporate/contact/",
  "/id/media-center/",
  "/id/ojol/",
  "/id/baas/",
  "/en/career/",
];

const UAS = {
  browser:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  gptbot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
  screamingfrog: "Screaming Frog SEO Spider/22.1",
};

let failures = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (!cond) {
    failures++;
    console.log(`  ✗ ${msg}`);
  }
}

async function get(path, ua = UAS.browser) {
  const res = await fetch(base + path, { headers: { "user-agent": ua }, redirect: "manual" });
  const body = await res.text();
  return { res, body };
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`, "i"));
  return m ? m[1].replace(/&amp;/g, "&") : "";
}

function analyse(html) {
  const headEnd = html.indexOf("</head>");
  const inHead = (idx) => idx >= 0 && idx < headEnd;
  const tags = [...html.matchAll(/<(title|meta|link)\b[^>]*>/gi)].map((m) => ({ tag: m[0], idx: m.index }));
  const title = tags.find((t) => /^<title/i.test(t.tag));
  const titleText = (html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1] ?? "").trim();
  const desc = tags.find((t) => /name="description"/i.test(t.tag));
  const canonical = tags.find((t) => /rel="canonical"/i.test(t.tag));
  const hreflang = tags.filter((t) => /hreflang=/i.test(t.tag));
  const robots = tags.find((t) => /name="robots"/i.test(t.tag));
  const ogImage = tags.find((t) => /property="og:image"/i.test(t.tag));
  const h1 = [...html.matchAll(/<h1[\s>]/gi)].length;
  const h2 = [...html.matchAll(/<h2[\s>]/gi)].length;
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]*)"/gi)].map((m) => m[1].replace(/&amp;/g, "&"));
  return {
    titleInHead: title ? inHead(title.idx) : false,
    titleText,
    descInHead: desc ? inHead(desc.idx) : false,
    descText: desc ? attr(desc.tag, "content") : "",
    canonicalInHead: canonical ? inHead(canonical.idx) : false,
    canonicalHref: canonical ? attr(canonical.tag, "href") : "",
    hreflangInHead: hreflang.length > 0 && hreflang.every((t) => inHead(t.idx)),
    hreflangCount: hreflang.length,
    robotsContent: robots ? attr(robots.tag, "content") : "",
    ogImage: ogImage ? attr(ogImage.tag, "content") : "",
    h1,
    h2,
    jsonLd,
    links,
    hasMain: /<main[\s>]/i.test(html) && (html.match(/<main[\s>]/gi) ?? []).length === 1,
  };
}

async function checkPage(path) {
  console.log(`\n${path}`);
  const { res, body } = await get(path);
  ok(res.status === 200, `status ${res.status} (expected 200)`);
  const a = analyse(body);
  ok(a.titleInHead, `<title> must be inside <head> (browser UA)`);
  ok(a.descInHead, `meta description must be inside <head>`);
  ok(a.canonicalInHead, `canonical must be inside <head>`);
  ok(a.hreflangInHead, `hreflang links must be inside <head> (found ${a.hreflangCount})`);
  ok(a.titleText.length > 0 && a.titleText.length <= 65, `title length ${a.titleText.length} (1–65): "${a.titleText}"`);
  ok(a.descText.length >= 70 && a.descText.length <= 160, `description length ${a.descText.length} (70–160)`);
  ok(a.canonicalHref.endsWith("/"), `canonical should end with "/": ${a.canonicalHref}`);
  ok(a.h1 === 1, `exactly one <h1> (found ${a.h1})`);
  ok(a.h2 >= 1, `at least one <h2> (found ${a.h2})`);
  ok(a.hasMain, `exactly one <main> landmark`);
  ok(a.jsonLd.length >= 1, `JSON-LD present`);
  for (const j of a.jsonLd) {
    try {
      JSON.parse(j);
    } catch {
      ok(false, `JSON-LD must parse: ${j.slice(0, 80)}…`);
    }
  }
  if (expectNoindex) ok(/noindex/i.test(a.robotsContent), `meta robots noindex expected on staging (got "${a.robotsContent}")`);
  else ok(!/noindex/i.test(a.robotsContent), `meta robots must NOT be noindex on production (got "${a.robotsContent}")`);

  // Header keamanan
  const h = res.headers;
  ok(!!h.get("content-security-policy"), "Content-Security-Policy header");
  ok(h.get("x-frame-options")?.toUpperCase() === "SAMEORIGIN", "X-Frame-Options: SAMEORIGIN");
  ok(h.get("x-content-type-options") === "nosniff", "X-Content-Type-Options: nosniff");
  ok(!!h.get("referrer-policy"), "Referrer-Policy header");
  ok(!h.get("x-powered-by"), "no X-Powered-By header");
  if (expectNoindex) ok(/noindex/i.test(h.get("x-robots-tag") ?? ""), "X-Robots-Tag noindex on staging");

  // OG image harus bisa diakses (bukan 404)
  if (a.ogImage) {
    const u = new URL(a.ogImage);
    const img = await fetch(base + u.pathname, { method: "HEAD", redirect: "manual" });
    ok(img.status === 200, `og:image reachable (${img.status}) ${u.pathname}`);
  } else ok(false, "og:image present");

  // Link internal: harus berprefix locale + trailing slash, dan tidak redirect
  const internal = [...new Set(a.links.filter((l) => l.startsWith("/") && !l.startsWith("//")))];
  const bad = internal.filter((l) => {
    const p = l.split(/[?#]/)[0];
    if (/\.[a-z0-9]{2,5}$/i.test(p)) return false; // file (pdf, dsb.)
    if (p.startsWith("/admin")) return false;
    return !/^\/(id|en)\//.test(p) || !p.endsWith("/");
  });
  ok(bad.length === 0, `internal links without locale prefix / trailing slash: ${bad.slice(0, 6).join(", ")}`);

  // Bot tanpa JS harus mendapat metadata di <head> juga
  for (const [name, ua] of Object.entries(UAS)) {
    if (name === "browser") continue;
    const r = await get(path, ua);
    const b = analyse(r.body);
    ok(b.titleInHead && b.canonicalInHead && b.hreflangInHead, `${name}: title/canonical/hreflang inside <head>`);
  }
}

async function checkStatic() {
  console.log("\n[static & redirects]");
  const robots = await get("/robots.txt");
  ok(robots.res.status === 200, "robots.txt 200");
  if (expectNoindex) ok(/Disallow:\s*\/\s*$/m.test(robots.body), "robots.txt Disallow: / on staging");
  else {
    ok(/Disallow:\s*\/admin/i.test(robots.body), "robots.txt disallows /admin");
    ok(/Sitemap:\s*https?:\/\//i.test(robots.body), "robots.txt lists sitemap");
  }
  const sitemap = await get("/sitemap.xml");
  ok(sitemap.res.status === 200 && sitemap.body.includes("<urlset"), "sitemap.xml 200 + urlset");
  ok(sitemap.body.includes('hreflang="id"'), "sitemap has hreflang alternates");
  ok(!sitemap.body.includes("/en/media-center/news/"), "sitemap excludes /en press pages (canonical /id)");
  const llms = await get("/llms.txt");
  ok(llms.res.status === 200 && llms.body.startsWith("# Wedison"), "llms.txt 200");
  const manifest = await get("/manifest.webmanifest");
  ok(manifest.res.status === 200, "manifest.webmanifest 200");
  const apple = await fetch(base + "/apple-icon.png", { method: "HEAD" });
  ok(apple.status === 200, "apple-icon.png 200");

  // URL yang tidak cocok rute mana pun -> 404 statis root (prerender, dwibahasa, tanpa JS).
  // Catatan Next 15: notFound() dari halaman dinamis (artikel/berita) mengembalikan 404 dengan
  // shell yang diisi di sisi klien (perilaku framework, sama dengan build sebelumnya).
  const nf = await get("/id/halaman-tidak-ada/");
  ok(nf.res.status === 404, `unknown page returns 404 (got ${nf.res.status})`);
  ok(!/__next_error__/.test(nf.body), "unknown-page 404 is server-rendered (no __next_error__ shell)");
  ok(/Halaman Tidak Ditemukan/.test(nf.body) && /Go to English site/.test(nf.body), "unknown-page 404 renders bilingual static copy");
  const nfArticle = await get("/id/media-center/articles/artikel-tidak-ada/");
  ok(nfArticle.res.status === 404, `notFound() from a dynamic page returns 404 (got ${nfArticle.res.status})`);

  const root = await get("/");
  ok([307, 302].includes(root.res.status) && /\/(id|en)\/$/.test(root.res.headers.get("location") ?? ""), `/ redirects to locale (${root.res.status})`);
  const legacy = await get("/athena/");
  ok([301, 308].includes(legacy.res.status), `/athena/ legacy redirect (${legacy.res.status} -> ${legacy.res.headers.get("location")})`);

  const asset = await get("/id/");
  const chunk = asset.body.match(/\/_next\/static\/[^"]+\.js/)?.[0];
  if (chunk) {
    const r = await fetch(base + chunk, { method: "HEAD" });
    ok(r.headers.get("x-content-type-options") === "nosniff", "static chunk has nosniff header");
    ok(/immutable/.test(r.headers.get("cache-control") ?? ""), "static chunk cache-control immutable");
  }
  const press = await get("/id/media-center/");
  const newsLink = press.body.match(/href="(\/id\/media-center\/news\/[^"]+\/)"/)?.[1];
  if (newsLink) {
    const en = await get(newsLink.replace("/id/", "/en/"));
    const a = analyse(en.body);
    ok(a.canonicalHref.includes("/id/media-center/news/"), `EN press page canonical points to /id (${a.canonicalHref})`);
  }
}

(async () => {
  console.log(`SEO check against ${base} (${expectNoindex ? "staging/noindex" : "production/indexable"} mode)`);
  for (const p of PAGES) await checkPage(p);
  await checkStatic();
  console.log(`\n${checks - failures}/${checks} checks passed`);
  if (failures) {
    console.log(`${failures} FAILED`);
    process.exit(1);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
