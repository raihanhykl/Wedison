// /** @type {import('next-sitemap').IConfig} */
// module.exports = {
//   siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://wedison.co",
//   sitemapSize: 7000,
//   generateRobotsTxt: true,
//   robotsTxtOptions: {
//     policies: [
//       {
//         userAgent: "*",
//         allow: "/",
//       },
//     ],
//   },
// };

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://wedison.co",
  sitemapSize: 7000,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  transform: async (config, url) => {
    // paksa trailing slash di setiap URL di sitemap
    const hasExt = /\.[^/]+$/.test(url);
    const normalized = hasExt || url.endsWith("/") ? url : `${url}/`;
    return {
      loc: normalized,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
