/**
 * Scraper metadata Open Graph untuk liputan pers & post sosial media.
 * Diporting dari src/app/lib/fetchPreview.ts (frontend) ke server, agar admin bisa
 * "Ambil metadata" satu klik dan hasilnya disimpan di DB (tidak scraping saat build lagi).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

export type PageMetadata = {
  url: string;
  title: string;
  description: string;
  image: string | null;
  siteName: string;
  publishedAt: string | null; // ISO
  author: string | null;
};

function pickMeta(html: string, prop: string) {
  const reProp = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
  const reName = new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
  const reRev = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, "i");
  const m = html.match(reProp) ?? html.match(reName) ?? html.match(reRev);
  return m?.[1] ? decodeEntities(m[1].trim()) : "";
}

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function normalizeDate(input?: string | null): string | null {
  if (!input) return null;
  const t = Date.parse(input);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

function pickJsonLd(html: string): { date?: string; author?: string } {
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  const out: { date?: string; author?: string } = {};
  while ((m = re.exec(html))) {
    try {
      const data = JSON.parse(m[1].trim());
      const nodes = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
      for (const node of nodes) {
        if (!node || typeof node !== "object") continue;
        const d = node.datePublished || node.dateCreated || node.uploadDate || node.dateModified;
        if (d && !out.date && normalizeDate(d)) out.date = normalizeDate(d)!;
        const a = node.author;
        if (a && !out.author) {
          if (typeof a === "string") out.author = a;
          else if (Array.isArray(a)) out.author = a.map((x) => x?.name).filter(Boolean).join(", ");
          else if (a.name) out.author = a.name;
        }
      }
    } catch {
      /* JSON-LD tidak valid, abaikan */
    }
  }
  return out;
}

function pickTimeTag(html: string): string | null {
  const m =
    html.match(/<time[^>]+datetime=["']([^"']+)["']/i) ??
    html.match(/<meta[^>]+itemprop=["'](?:datePublished|dateCreated|dateModified)["'][^>]+content=["']([^"']+)["']/i);
  return normalizeDate(m?.[1]);
}

function absolutify(base: string, maybe?: string) {
  if (!maybe) return null;
  try {
    return new URL(maybe, base).toString();
  } catch {
    return null;
  }
}

export function hostnameOf(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export async function fetchPageMetadata(url: string, timeoutMs = 15000): Promise<PageMetadata> {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "text/html,*/*" },
    signal: AbortSignal.timeout(timeoutMs),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Source responded with ${res.status}`);
  const html = await res.text();

  const title =
    pickMeta(html, "og:title") ||
    pickMeta(html, "twitter:title") ||
    decodeEntities((html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "").trim());
  const description =
    pickMeta(html, "og:description") || pickMeta(html, "description") || pickMeta(html, "twitter:description");
  const image = absolutify(url, pickMeta(html, "og:image") || pickMeta(html, "twitter:image"));
  const siteName = pickMeta(html, "og:site_name") || hostnameOf(url);

  const ld = pickJsonLd(html);
  const publishedAt =
    normalizeDate(
      pickMeta(html, "article:published_time") ||
        pickMeta(html, "og:published_time") ||
        pickMeta(html, "datePublished") ||
        pickMeta(html, "pubdate") ||
        pickMeta(html, "article:modified_time"),
    ) ??
    ld.date ??
    pickTimeTag(html);
  const author = pickMeta(html, "author") || pickMeta(html, "article:author") || ld.author || null;

  return { url, title, description, image, siteName, publishedAt, author };
}

// ─── Instagram / sosial media ───────────────────────────────────────────────

export function normalizeInstagramUrl(url: string): string {
  const normalized = url.replace(/instagram\.com\/[^/]+\/(p|reel)\//, "instagram.com/$1/");
  return normalized.endsWith("/") ? normalized : normalized + "/";
}

export function instagramShortcode(url: string): string | null {
  return url.match(/\/(p|reel|reels)\/([^/?#]+)/)?.[2] ?? null;
}

/** Unduh thumbnail ke folder upload lokal (URL CDN IG kedaluwarsa dalam hitungan hari). */
export async function downloadToUploads(imageUrl: string, basename: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, {
      headers: { "user-agent": UA },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const dir = path.resolve(env.UPLOAD_DIR, "social");
    await fs.mkdir(dir, { recursive: true });
    const file = `${basename}.jpg`;
    await fs.writeFile(path.join(dir, file), buf);
    return `${env.UPLOAD_PUBLIC_PATH}/social/${file}`;
  } catch {
    return null;
  }
}

export async function fetchSocialMetadata(rawUrl: string) {
  const url = normalizeInstagramUrl(rawUrl);
  const meta = await fetchPageMetadata(url);
  const shortcode = instagramShortcode(url);
  // Upgrade ke resolusi tertinggi bila URL CDN IG memuat ukuran
  const hi = meta.image?.replace(/\/s\d+x\d+/, "/s1080x1080") ?? null;
  const thumbnailUrl = hi && shortcode ? await downloadToUploads(hi, shortcode) : null;
  return {
    url,
    externalId: shortcode,
    caption: meta.description || meta.title || "",
    thumbnailUrl,
    publishedAt: meta.publishedAt,
  };
}
