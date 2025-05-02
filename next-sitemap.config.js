/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://wedison.co", // Ganti ke domain kamu nanti
  generateRobotsTxt: true, // Biar sekalian generate robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/", // Semua halaman boleh di-crawl
      },
    ],
  },
};
