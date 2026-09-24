import Script from "next/script";

// ID container Google Tag Manager. Aman ditulis di klien (nilainya publik).
export const GTM_ID = "GTM-TGNBLQ37";

/**
 * Script GTM. Next menyuntikkannya ke <head> setelah halaman interaktif.
 * Letakkan di dalam <body> pada root layout.
 */
export function GoogleTagManager() {
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
