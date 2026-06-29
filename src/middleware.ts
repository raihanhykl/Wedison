import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE, isLocale } from "@/app/lib/locale";

function detectLocale(req: NextRequest): string {
  // 1) Preferensi eksplisit user (cookie di-set saat menekan toggle bahasa).
  const cookie = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && isLocale(cookie)) return cookie;

  // 2) Accept-Language header (di VPS bare-metal tanpa CDN, ini sumber paling andal).
  const accept = req.headers.get("accept-language")?.toLowerCase() ?? "";
  for (const part of accept.split(",")) {
    const lang = part.split(";")[0].trim();
    if (lang.startsWith("id")) return "id";
    if (lang.startsWith("en")) return "en";
  }

  // 3) Fallback.
  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (hasLocale) {
    // Path sudah ber-locale: teruskan, tapi refresh cookie agar link tanpa-locale
    // (mis. yang tertanam di translations.tsx) ikut ke locale yang sedang dibuka.
    const current = pathname.split("/")[1];
    const res = NextResponse.next();
    res.cookies.set("NEXT_LOCALE", current, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
    return res;
  }

  // Path tanpa locale -> redirect ke locale hasil deteksi (pertahankan path + query).
  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Semua path KECUALI _next, api, dan file ber-ekstensi (punya titik: favicon.ico, sitemap.xml, dll).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
