// import { PRESS_URLS } from "../../../public/data/press-urls";

import { PRESS_URLS } from "../../../public/data/press-urls";

export type LinkPreview = {
  url: string;
  title: string;
  headLine: string;
  slug: string;
  description?: string;
  image?: string | null;
  site?: string;
  published?: string;
  author?: string;
};

function pickMeta(html: string, prop: string) {
  // Cari <meta property="og:..."> atau <meta name="...">
  const reProp = new RegExp(
    `<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const reName = new RegExp(
    `<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const m1 = html.match(reProp);
  if (m1?.[1]) return m1[1].trim();
  const m2 = html.match(reName);
  if (m2?.[1]) return m2[1].trim();
  return "";
}

// pick author using jsonld

// --- Fallback helpers: JSON-LD & <time> -------------------------------------

function normalizeDate(input?: string): string {
  if (!input) return "";
  const t = Date.parse(input);
  return Number.isFinite(t) ? new Date(t).toISOString() : "";
}

function pickJsonLdDate(html: string): string {
  // Ambil semua <script type="application/ld+json"> (bisa lebih dari satu)
  const re =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = m[1].trim();
    if (!raw) continue;
    try {
      const data = JSON.parse(raw);

      // Utility untuk cari date fields di object apapun
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extract = (obj: any): string | undefined => {
        if (obj && typeof obj === "object") {
          return (
            obj.datePublished ||
            obj.dateCreated ||
            obj.uploadDate ||
            obj.dateModified ||
            undefined
          );
        }
        return undefined;
      };

      // 1) object tunggal
      if (!Array.isArray(data)) {
        // cek @graph kalau ada
        if (data["@graph"] && Array.isArray(data["@graph"])) {
          for (const node of data["@graph"]) {
            const d = extract(node);
            const iso = normalizeDate(d);
            if (iso) return iso;
          }
        }
        const d = extract(data);
        const iso = normalizeDate(d);
        if (iso) return iso;
      } else {
        // 2) array beberapa object
        for (const node of data) {
          const d = extract(node);
          const iso = normalizeDate(d);
          if (iso) return iso;
        }
      }
    } catch {
      // abaikan JSON-LD yang tidak valid
    }
  }
  return "";
}

function pickTimeTagDate(html: string): string {
  // 1) <time datetime="...">
  const mTime = html.match(/<time[^>]+datetime=["']([^"']+)["'][^>]*>/i);
  if (mTime?.[1]) {
    const iso = normalizeDate(mTime[1].trim());
    if (iso) return iso;
  }

  // 2) <time itemprop="datePublished|dateModified" ...>...</time>
  const mTimeItemprop = html.match(
    /<time[^>]+itemprop=["'](?:datePublished|dateCreated|dateModified)["'][^>]*>([^<]*)<\/time>/i
  );
  if (mTimeItemprop?.[1]) {
    const iso = normalizeDate(mTimeItemprop[1].trim());
    if (iso) return iso;
  }

  // 3) <meta itemprop="datePublished|dateModified" content="...">
  const mMetaItemprop = html.match(
    /<meta[^>]+itemprop=["'](?:datePublished|dateCreated|dateModified)["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );
  if (mMetaItemprop?.[1]) {
    const iso = normalizeDate(mMetaItemprop[1].trim());
    if (iso) return iso;
  }

  return "";
}

// -----------------------------------------------------------------------------

function absolutify(baseUrl: string, maybeRelative: string | undefined) {
  if (!maybeRelative) return undefined;
  try {
    // kalau sudah absolute http/https, langsung return
    if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
    const u = new URL(baseUrl);
    return new URL(maybeRelative, `${u.protocol}//${u.host}`).toString();
  } catch {
    return undefined;
  }
}

function hostnameOf(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export async function fetchPreview(
  // url: string,
  newsData: PRESS_URLS,
  timeoutMs = 15000
): Promise<LinkPreview> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Penting: cache 'force-cache' agar Next bisa SSG
    const res = await fetch(newsData.url, {
      cache: "force-cache",
      signal: controller.signal,
    });
    const html = await res.text();

    const url = newsData.url;

    const title =
      pickMeta(html, "og:title") ||
      pickMeta(html, "twitter:title") ||
      (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "").trim();

    const description =
      pickMeta(html, "og:description") ||
      pickMeta(html, "description") ||
      pickMeta(html, "og:image:secure_url");

    const image = absolutify(
      url,
      pickMeta(html, "og:image") || pickMeta(html, "twitter:image")
    );

    const site = pickMeta(html, "og:site_name") || hostnameOf(newsData.url);

    // 1) meta tags umum
    let published =
      pickMeta(html, "article:published_time") ||
      pickMeta(html, "og:published_time") ||
      pickMeta(html, "og:updated_time") ||
      pickMeta(html, "article:modified_time") ||
      pickMeta(html, "datePublished") ||
      pickMeta(html, "dateModified") ||
      pickMeta(html, "pubdate") ||
      pickMeta(html, "content_PublishedDate") ||
      "";

    // 2) Fallback JSON-LD
    if (!normalizeDate(published)) {
      const fromJsonLd = pickJsonLdDate(html);
      if (fromJsonLd) published = fromJsonLd;
    }

    // 3) Fallback elemen <time>
    if (!normalizeDate(published)) {
      const fromTime = pickTimeTagDate(html);
      if (fromTime) published = fromTime;
    }

    // Normalisasi akhir ke ISO (atau "")
    published = normalizeDate(published);

    return {
      url,
      title,
      description,
      image: image || null,
      slug: newsData.slug,
      site,
      published,
      author: newsData.author,
      headLine: newsData.headLine,
    };
  } catch {
    // fallback minimal agar build tetap jalan meski ada URL yang gagal di-fetch
    return {
      url: newsData.url,
      title: newsData.url,
      slug: newsData.slug,
      description: "",
      image: undefined,
      site: hostnameOf(newsData.url),
      headLine: newsData.headLine,
      author: newsData.author,
    };
  } finally {
    clearTimeout(t);
  }
}

export async function fetchAllPreviews(urls: PRESS_URLS[]) {
  // Batasi concurrency biar build stabil
  const MAX = 4;
  const out: LinkPreview[] = [];
  for (let i = 0; i < urls.length; i += MAX) {
    const chunk = urls.slice(i, i + MAX);
    const results = await Promise.all(chunk.map((u) => fetchPreview(u)));
    out.push(...results);
  }
  return out;
}
