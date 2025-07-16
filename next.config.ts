import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["wedison.co", "unsplash.com"], // Tambahkan domain ini
    unoptimized: true,
  },
  output: "export",
  trailingSlash: true, // <== ini penting
};

export default nextConfig;
