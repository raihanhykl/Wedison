import Script from "next/script";

/**
 * Cekat AI chatbot (live.cekat.ai) on the public site only: rendered from the [locale] layout,
 * so the admin dashboard never loads it.
 *
 * Config comes from the environment (public values, not secrets):
 *   NEXT_PUBLIC_CEKAT_ACCESS_KEY  required; empty = widget not loaded at all (like GTM)
 *   NEXT_PUBLIC_CEKAT_SERVER      optional, default https://live.cekat.ai/widget.js
 *
 * Loaded with strategy "lazyOnload" (after the page has loaded and the browser is idle) so the
 * third-party script never competes with LCP / interaction. The inline snippet is the one from
 * Cekat; values are JSON-encoded so they cannot break out of the script.
 * The CSP in next.config allows https://live.cekat.ai for script-src and frame-src.
 * While a bottom bar or sheet would sit under the bubble, globals.css hides it (data-chat-obstruct).
 */
const ACCESS_KEY = process.env.NEXT_PUBLIC_CEKAT_ACCESS_KEY;
const SERVER = process.env.NEXT_PUBLIC_CEKAT_SERVER || "https://live.cekat.ai/widget.js";

export function CekatChat() {
  if (!ACCESS_KEY) return null;
  const config = { server: SERVER, iframeWidth: "400px", iframeHeight: "700px", accessKey: ACCESS_KEY, offsetX: 20, offsetY: 20 };
  return (
    <Script id="cekat-chat" strategy="lazyOnload">
      {`!function(c,e,k,a,t){c.mychat=c.mychat||${JSON.stringify(config).replace(/</g, "\\u003c")};var q=[];c.Cekat=function(){q.push(arguments)};c.Cekat.q=q;a=e.createElement(k);t=e.getElementsByTagName(k)[0];a.async=1;a.src=c.mychat.server;t.parentNode.insertBefore(a,t);}(window,document,"script");`}
    </Script>
  );
}
