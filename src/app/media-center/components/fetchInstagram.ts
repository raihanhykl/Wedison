import fs from "fs";
import path from "path";

export type InstagramPostData = {
  url: string;
  thumbnail: string;
  caption: string;
};

export type InstagramPost = {
  url: string;
};

// Update this list whenever you publish new posts on @wedison.id
// To get the URL: open the post on Instagram → click "..." → "Copy link"
// NOTE: URLs MUST use canonical format without username:
//   ✅ https://www.instagram.com/reel/SHORTCODE/
//   ✅ https://www.instagram.com/p/SHORTCODE/
//   ❌ https://www.instagram.com/wedison.id/reel/SHORTCODE/
export const INSTAGRAM_POSTS: InstagramPost[] = [
  { url: "https://www.instagram.com/reel/DTziUjAkRgo/" },
  { url: "https://www.instagram.com/reel/DT7ZKzkESG7/" },
  { url: "https://www.instagram.com/reel/DRELt_CEWEb/" },
  { url: "https://www.instagram.com/reel/DWTIOqjjJJb/" },
  { url: "https://www.instagram.com/p/DWIIi8ZEvvY/" },
  { url: "https://www.instagram.com/p/DWD-sZGkb2N/" },
];

function normalizeUrl(url: string): string {
  const normalized = url.replace(
    /instagram\.com\/[^/]+\/(p|reel)\//,
    "instagram.com/$1/",
  );
  return normalized.endsWith("/") ? normalized : normalized + "/";
}

function getShortcode(url: string): string {
  const match = url.match(/\/(p|reel)\/([^/]+)/);
  return match ? match[2] : "unknown";
}

async function downloadThumbnail(
  imageUrl: string,
  shortcode: string,
): Promise<string> {
  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    if (!res.ok) return "";

    const buffer = Buffer.from(await res.arrayBuffer());

    // Save to public/instagram/
    const dir = path.join(process.cwd(), "public", "instagram");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filename = `${shortcode}.jpg`;
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, buffer);

    // Return the public path (served statically)
    return `/instagram/${filename}`;
  } catch {
    return "";
  }
}

export async function fetchInstagramPost(
  post: InstagramPost,
): Promise<InstagramPostData> {
  const url = normalizeUrl(post.url);
  const shortcode = getShortcode(url);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    const html = await res.text();

    // Extract og:image
    const ogImageMatch = html.match(/property="og:image"\s+content="([^"]+)"/);
    const rawThumbnail = ogImageMatch
      ? ogImageMatch[1].replace(/&amp;/g, "&")
      : "";
    // Upgrade to highest resolution
    const cdnUrl = rawThumbnail.replace(/\/s\d+x\d+/, "/s1080x1080");

    // Download image to public/ so it's served locally (CDN URLs expire)
    const thumbnail = cdnUrl ? await downloadThumbnail(cdnUrl, shortcode) : "";

    // Extract og:description (caption)
    const ogDescMatch = html.match(
      /property="og:description"\s+content="([^"]+)"/,
    );
    const rawCaption = ogDescMatch ? ogDescMatch[1] : "";
    const caption = rawCaption
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");

    return { url, thumbnail, caption };
  } catch {
    return { url, thumbnail: "", caption: "" };
  }
}

export async function fetchAllInstagramPosts(
  posts: InstagramPost[],
): Promise<InstagramPostData[]> {
  return Promise.all(posts.map(fetchInstagramPost));
}
