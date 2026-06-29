import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // `domains` sudah deprecated sejak Next 14 -> pakai remotePatterns
    remotePatterns: [
      { protocol: "https", hostname: "wedison.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // Tetap true dulu (keputusan: tunda optimasi gambar sampai VPS stabil).
    // sharp sudah dipindah ke dependencies agar siap diaktifkan nanti
    // (cukup hapus baris ini untuk menyalakan server image optimization).
    unoptimized: true,
  },
  // Migrasi SSG -> SSR: hasilkan server mandiri (.next/standalone/server.js)
  // untuk deploy ramping ke VPS (Node). Menggantikan output:"export".
  output: "standalone",
  trailingSlash: true, // <== ini penting (jaga kontinuitas URL/SEO)
};

export default nextConfig;
