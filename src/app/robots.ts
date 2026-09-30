import type { MetadataRoute } from "next";
import { NOINDEX, SITE_URL } from "@/lib/seo/site";

// robots.txt. Di staging/preview (NOINDEX) seluruh situs ditutup agar tidak bersaing dengan
// wedison.co. Di produksi: semua crawler (termasuk crawler AI/LLM seperti GPTBot, ClaudeBot,
// PerplexityBot -> sengaja diizinkan untuk GEO/AEO) boleh mengindeks halaman publik; area
// admin dan API ditutup, kecuali /api/uploads (gambar CMS yang tampil di artikel).
export default function robots(): MetadataRoute.Robots {
  if (NOINDEX) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/uploads/"],
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
