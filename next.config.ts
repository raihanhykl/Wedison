import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["wedison.co"], // Tambahkan domain ini
    unoptimized: true,
  },
  output: "export",
};

export default nextConfig;
