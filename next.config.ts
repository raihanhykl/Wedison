import type { NextConfig } from "next";

// ───────────────────────── Environment ─────────────────────────
// NEXT_PUBLIC_SITE_URL menentukan domain kanonik; selain wedison.co (staging ssr.wedison.tech,
// preview, dev) situs otomatis noindex (meta robots + X-Robots-Tag + robots.txt Disallow).
// Override: NEXT_PUBLIC_ROBOTS_NOINDEX=true|false. Logika yang sama ada di src/lib/seo/site.ts.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedison.co";
const IS_PRODUCTION_SITE = (() => {
  try {
    return new URL(SITE_URL).hostname === "wedison.co";
  } catch {
    return false;
  }
})();
const NOINDEX =
  process.env.NEXT_PUBLIC_ROBOTS_NOINDEX === "true" ||
  (process.env.NEXT_PUBLIC_ROBOTS_NOINDEX !== "false" && !IS_PRODUCTION_SITE);
const isProdBuild = process.env.NODE_ENV === "production";

// ───────────────────────── Security headers ─────────────────────────
// Dikirim oleh Next untuk SEMUA respons (HTML, /_next/static, /_next/image, file public/),
// sehingga tidak bergantung pada blok `location` nginx (add_header di nginx tidak diwariskan
// ke location yang punya add_header sendiri). HSTS sengaja hanya di nginx (terminasi TLS).
//
// CSP: daftar origin = layanan pihak ketiga yang dipakai situs saat ini. Menambah tag baru di
// GTM (mis. TikTok Pixel) = tambahkan origin-nya di sini, lalu cek console browser.
//   - GTM/GA4/Google Ads : googletagmanager.com, google-analytics.com, analytics.google.com,
//                          doubleclick.net, googleadservices.com, google.com, google.co.id
//   - Meta Pixel         : connect.facebook.net, facebook.com
//   - reCAPTCHA          : google.com/recaptcha, gstatic.com
//   - EmailJS (form)     : api.emailjs.com
//   - Peta locator       : tiles.openfreemap.org (style, tiles, glyph, sprite) + worker blob:
//   - Google Maps embed  : maps.google.com / google.com (iframe)
//   - Admin              : calendar.google.com (iframe kalender booking)
// 'unsafe-inline' script/style diperlukan oleh GTM & script inline Next tanpa nonce (halaman
// statis/ISR tidak bisa memakai nonce per-request). Migrasi ke nonce = pekerjaan lanjutan.
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.googleadservices.com https://*.doubleclick.net https://www.google.com https://www.gstatic.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "media-src 'self' blob: data:",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.doubleclick.net https://*.google.com https://*.google.co.id https://www.facebook.com https://connect.facebook.net https://api.emailjs.com https://tiles.openfreemap.org https://*.openfreemap.org https://www.gstatic.com",
  "frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com https://*.doubleclick.net https://www.facebook.com https://www.youtube.com https://www.youtube-nocookie.com https://calendar.google.com",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // geolocation dipakai tombol "dekat saya" di locator SuperCharge.
    value: "camera=(), microphone=(), geolocation=(self), payment=(), usb=()",
  },
  // CSP hanya di build produksi (dev butuh HMR/websocket & eval dari Next).
  ...(isProdBuild ? [{ key: "Content-Security-Policy", value: CSP }] : []),
  // Staging/preview: kunci dari indeks juga di level header (berlaku untuk PDF, gambar, dsb.).
  ...(NOINDEX ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
];

// Bot yang tidak menjalankan JavaScript / membaca <head> apa adanya. Untuk mereka Next
// merender metadata (title, canonical, hreflang, OG) secara BLOKING di <head>, bukan
// di-stream ke <body>. Daftar = bawaan Next + Googlebot, crawler AI/LLM (GEO), dan tool SEO.
// (Halaman statis/ISR selalu punya metadata di <head>; ini untuk halaman dinamis.)
const HTML_LIMITED_BOTS =
  /Googlebot|AdsBot-Google|Mediapartners-Google|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Bytespider|Amazonbot|meta-externalagent|meta-externalfetcher|cohere-ai|YouBot|Diffbot|DuckAssistBot|MistralAI-User|Applebot-Extended|Screaming Frog|AhrefsBot|SemrushBot|SiteAuditBot|MJ12bot|DotBot|PetalBot|SeznamBot|Qwantify|Pinterestbot|TelegramBot|Embedly/i;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  htmlLimitedBots: HTML_LIMITED_BOTS,
  images: {
    // `domains` sudah deprecated sejak Next 14 -> pakai remotePatterns
    remotePatterns: [
      { protocol: "https", hostname: "wedison.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "radarbanyumas.disway.id" },
      { protocol: "https", hostname: "imgx.gridoto.com" },
      { protocol: "https", hostname: "asset.kompas.com" },
      { protocol: "https", hostname: "otorider.com" },
    ],
    // Server image optimization ON (sharp ada di dependencies). Menyajikan AVIF/WebP
    // yang di-resize sesuai prop `sizes` -> decode jauh lebih ringan saat scroll.
    // CATATAN DEPLOY (VPS di belakang nginx): teruskan header `Accept` ke /_next/image
    // agar negosiasi AVIF/WebP jalan; pastikan .next/cache writable + sharp tersedia.
    // (Untuk sementara balik seperti semula: ganti blok ini dengan `unoptimized: true`.)
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400, // 31 hari
    qualities: [25, 50, 60, 75, 85, 90, 100],
    // Izinkan SVG lewat next/image (mis. logogram di navbar). Aset SVG milik sendiri,
    // dikunci dengan CSP + Content-Disposition agar aman.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Migrasi SSG -> SSR: hasilkan server mandiri (.next/standalone/server.js)
  // untuk deploy ramping ke VPS (Node). Menggantikan output:"export".
  // Hanya di produksi: `next build` selalu NODE_ENV=production, jadi standalone
  // tetap dihasilkan saat deploy; di `next dev` dimatikan agar module tracing
  // tidak mengganggu (sumber error "Cannot find module './xxx.js'").
  output: isProdBuild ? "standalone" : undefined,
  trailingSlash: true, // <== ini penting (jaga kontinuitas URL/SEO)
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // URL lama (slug Indonesia & produk tanpa /products) -> URL baru berbahasa Inggris.
  // 301 permanen agar link lama, bookmark, dan peringkat SEO ikut pindah.
  // Versi tanpa locale ikut dicakup; middleware lalu menambahkan /id atau /en.
  async redirects() {
    const moves: [string, string][] = [
      ["/:product(athena|bees|victory|edpower)", "/products/:product/"],
      ["/super-charge/lokasi", "/super-charge/locations/"],
      ["/media-center/artikel/:slug", "/media-center/articles/:slug/"],
    ];
    return moves.flatMap(([from, to]) => [
      { source: `/:locale(id|en)${from}`, destination: `/:locale${to}`, permanent: true },
      { source: from, destination: to, permanent: true },
    ]);
  },
  // Backend Express (server/) diakses lewat origin yang sama: /api/* -> API_INTERNAL_URL.
  // Browser tidak perlu CORS/cookie lintas origin; di VPS nginx bisa mengambil alih rule ini.
  // Route handler milik Next (mis. /api/revalidate) tetap menang karena rewrite = afterFiles.
  async rewrites() {
    const api = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:4000";
    return [
      { source: "/api/v1/:path*", destination: `${api}/api/v1/:path*` },
      { source: "/api/uploads/:path*", destination: `${api}/api/uploads/:path*` },
      { source: "/api/health", destination: `${api}/api/health` },
    ];
  },
};

export default nextConfig;
