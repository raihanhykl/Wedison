import Script from "next/script";

/**
 * ID container Google Tag Manager, per environment (nilainya publik, bukan secret).
 * Diisi lewat NEXT_PUBLIC_GTM_ID saat build:
 *   - produksi (main)            -> GTM-TGNBLQ37
 *   - staging & ssr-version      -> GTM-MBLHDFJ2
 * Sengaja TIDAK ada nilai default: kalau variabelnya kosong (mis. dev lokal),
 * GTM tidak dipasang sama sekali, supaya trafik dev tidak masuk ke container mana pun.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Script GTM. Next menyuntikkannya ke <head> setelah halaman interaktif.
 * Letakkan di dalam <body> pada root layout.
 */
export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <Script id="gtm-base" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/** Fallback GTM untuk browser tanpa JavaScript. Letakkan tepat setelah <body>. */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
