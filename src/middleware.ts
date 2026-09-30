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

const ADMIN_COOKIE = process.env.ADMIN_COOKIE_NAME ?? "wd_admin_token";

/**
 * Redirect ke URL publik. Di belakang nginx, req.nextUrl.host = bind internal
 * (localhost:3002), sehingga redirect absolut bocor jadi https://localhost:3002/...
 * Bangun ulang host/proto dari header X-Forwarded-* yang di-set nginx.
 */
function redirectPublic(req: NextRequest, url: URL) {
  const fwdHost = req.headers.get("x-forwarded-host");
  if (fwdHost) {
    const [hostname, port] = fwdHost.split(":");
    url.hostname = hostname;
    url.port = port ?? ""; // clear port internal (3002), kecuali proxy kirim port eksplisit
    url.protocol = `${req.headers.get("x-forwarded-proto") ?? "https"}:`;
  }
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin dashboard: tidak dilokalisasi (tanpa /id /en). Guard ringan di edge: tanpa cookie
  // sesi -> ke halaman login. Verifikasi token sesungguhnya dilakukan layout admin ke API.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const isLogin = pathname.startsWith("/admin/login");
    const hasSession = !!req.cookies.get(ADMIN_COOKIE)?.value;
    if (!isLogin && !hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login/";
      url.searchParams.set("next", pathname);
      return redirectPublic(req, url);
    }
    if (isLogin && hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/";
      url.search = "";
      return redirectPublic(req, url);
    }
    return NextResponse.next();
  }

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (hasLocale) {
    const current = pathname.split("/")[1];
    const res = NextResponse.next();
    // Ingat locale yang sedang dibuka agar link tanpa-locale ikut ke locale itu.
    // Cookie hanya ditulis bila nilainya berubah: respons halaman statis (SSG/ISR) tanpa
    // Set-Cookie tetap bisa di-cache oleh browser/proxy sesuai Cache-Control dari Next.
    if (req.cookies.get("NEXT_LOCALE")?.value !== current) {
      res.cookies.set("NEXT_LOCALE", current, {
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
      });
    }
    return res;
  }

  // Path tanpa locale -> redirect ke locale hasil deteksi (pertahankan path + query).
  // Hasilnya bergantung pada cookie + Accept-Language, jadi beri tahu cache lewat Vary.
  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const res = redirectPublic(req, url);
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
}

export const config = {
  // Semua path KECUALI _next, api, dan file ber-ekstensi (punya titik: favicon.ico, sitemap.xml, dll).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
