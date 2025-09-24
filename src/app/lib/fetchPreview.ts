// Build-time only. Tidak dipakai di client.
export type LinkPreview = {
  url: string;
  title: string;
  description?: string;
  image?: string;
  site?: string;
  published?: string;
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
  url: string,
  timeoutMs = 15000
): Promise<LinkPreview> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Penting: cache 'force-cache' agar Next bisa SSG
    const res = await fetch(url, {
      cache: "force-cache",
      signal: controller.signal,
    });
    const html = await res.text();

    const title =
      pickMeta(html, "og:title") ||
      pickMeta(html, "twitter:title") ||
      (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "").trim();

    const description =
      pickMeta(html, "og:description") || pickMeta(html, "description");

    const image = absolutify(
      url,
      pickMeta(html, "og:image") || pickMeta(html, "twitter:image")
    );

    const site = pickMeta(html, "og:site_name") || hostnameOf(url);

    const published =
      pickMeta(html, "article:published_time") ||
      pickMeta(html, "og:updated_time") ||
      pickMeta(html, "article:modified_time") ||
      "";

    return { url, title, description, image, site, published };
  } catch {
    // fallback minimal agar build tetap jalan meski ada URL yang gagal di-fetch
    return {
      url,
      title: url,
      description: "",
      image: undefined,
      site: hostnameOf(url),
    };
  } finally {
    clearTimeout(t);
  }
}

export async function fetchAllPreviews(urls: string[]) {
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
