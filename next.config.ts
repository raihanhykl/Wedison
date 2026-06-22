import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // `domains` sudah deprecated sejak Next 14 -> pakai remotePatterns
    remotePatterns: [
      { protocol: "https", hostname: "wedison.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // wajib true untuk output:"export" (tidak ada server image optimization)
    unoptimized: true,
  },
  output: "export",
  trailingSlash: true, // <== ini penting
};

export default nextConfig;
