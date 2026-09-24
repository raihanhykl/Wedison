import Script from "next/script";

/**
 * ID Meta (Facebook) Pixel. Nilainya publik, bukan secret.
 * Diisi lewat NEXT_PUBLIC_META_PIXEL_ID saat build dan HANYA dipasang di
 * produksi (ci-cd.yml) — workflow staging/ssr sengaja tidak mengisinya,
 * supaya trafik testing & dev lokal tidak tercatat di pixel produksi.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Script Meta Pixel + event PageView awal. Next menyuntikkannya ke <head>
 * setelah halaman interaktif. Letakkan di dalam <body> pada root layout.
 */
export function MetaPixel() {
  if (!PIXEL_ID) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
    </Script>
  );
}

/** Fallback Meta Pixel untuk browser tanpa JavaScript. Letakkan tepat setelah <body>. */
export function MetaPixelNoScript() {
  if (!PIXEL_ID) return null;

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element -- pixel pelacak 1x1, bukan gambar konten */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
