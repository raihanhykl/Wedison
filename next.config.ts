import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
  trailingSlash: true, // <== ini penting (jaga kontinuitas URL/SEO)
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
