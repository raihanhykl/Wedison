import type { MetadataRoute } from "next";
import { IS_PRODUCTION_SITE, NOINDEX, ROBOTS_ALLOW_ONLY, SITE_URL } from "@/lib/seo/site";

// robots.txt. Di staging/preview (NOINDEX) seluruh situs ditutup agar tidak bersaing dengan
// wedison.co. Di produksi: semua crawler (termasuk crawler AI/LLM seperti GPTBot, ClaudeBot,
// PerplexityBot -> sengaja diizinkan untuk GEO/AEO) boleh mengindeks halaman publik; area
// admin dan API ditutup, kecuali /api/uploads (gambar CMS yang tampil di artikel).
export default function robots(): MetadataRoute.Robots {
  if (NOINDEX) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  const publicRules = {
    allow: ["/", "/api/uploads/"],
    disallow: ["/admin", "/admin/", "/api/"],
  };
  // Mode audit staging: hanya tool audit yang boleh crawl; tidak berlaku di domain produksi.
  if (ROBOTS_ALLOW_ONLY && !IS_PRODUCTION_SITE) {
    return {
      rules: [
        { userAgent: ROBOTS_ALLOW_ONLY, ...publicRules },
        { userAgent: "*", disallow: "/" },
      ],
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }
  return {
    rules: [{ userAgent: "*", ...publicRules }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
