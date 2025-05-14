// lib/seo.ts
import type { Metadata } from "next";

type GenerateSeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  jsonLdType?: "organization" | "product";
  productName?: string;
};

export function generateSeoMetadata({
  title,
  description,
  path = "/",
  image = "/images/og-default.jpg",
  type = "website",
  jsonLdType,
  productName,
}: GenerateSeoProps): {
  metadata: Metadata;
  jsonLd: string | null;
} {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://wedison.vercel.app";
  const fullUrl = `${siteUrl}${path}`;

  const metadata: Metadata = {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },

    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Wedison",
      images: [
        {
          url: `${siteUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}${image}`],
    },
    icons: {
      icon: "/favicon.ico",
    },
  };

  let jsonLd: object | null = null;

  if (jsonLdType === "organization") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: title,
      url: fullUrl,
      logo: `${siteUrl}/wedison-sidebyside.png`,
      sameAs: [
        "https://www.instagram.com/wedison",
        "https://www.facebook.com/wedison",
        "https://www.twitter.com/wedison",
      ],
      description,
    };
  } else if (jsonLdType === "product") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productName,
      image: `${siteUrl}${image}`,
      description,
      brand: {
        "@type": "Brand",
        name: "Wedison",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "IDR",
        price: "0",
        availability: "https://schema.org/PreOrder",
        url: `${fullUrl}`,
      },
      url: fullUrl,
    };
  }

  return {
    metadata,
    jsonLd: jsonLd ? JSON.stringify(jsonLd) : null,
  };
}
