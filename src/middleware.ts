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
    const current = pathname.split("/")[1];
    // Teruskan locale sebagai REQUEST header agar Server Component (khususnya
    // not-found, yang tak menerima params & ada di luar LanguageProvider) bisa
    // merender bahasa yang benar per-request (bukan default static).
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-locale", current);
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    // Refresh cookie agar link tanpa-locale ikut ke locale yang sedang dibuka.
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
  // PENTING (di belakang nginx): req.nextUrl.host = bind internal (localhost:3002),
  // sehingga redirect absolut bocor jadi https://localhost:3002/en/. Bangun ulang
  // host/proto dari header X-Forwarded-* yang di-set nginx -> host publik yang benar.
  const fwdHost = req.headers.get("x-forwarded-host");
  if (fwdHost) {
    const [hostname, port] = fwdHost.split(":");
    url.hostname = hostname;
    url.port = port ?? ""; // clear port internal (3002), kecuali proxy kirim port eksplisit
    url.protocol = `${req.headers.get("x-forwarded-proto") ?? "https"}:`;
  }
  return NextResponse.redirect(url);
}

export const config = {
  // Semua path KECUALI _next, api, dan file ber-ekstensi (punya titik: favicon.ico, sitemap.xml, dll).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
