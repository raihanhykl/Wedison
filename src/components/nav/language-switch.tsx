"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LOCALES, type Locale } from "@/app/lib/locale";
import { useLanguage } from "@/app/lib/language-context";

/**
 * Segmented control ID | EN.
 *
 * Dua perbaikan dibanding toggle globe lama:
 *  · Keduanya <Link> ke URL locale lain, bukan div ber-onClick. Bisa dibuka di tab
 *    baru, terbaca crawler, dapat fokus keyboard gratis.
 *  · Bahasa aktif kelihatan langsung. Toggle lama hanya menampilkan bahasa tujuan,
 *    jadi orang harus menebak sedang berada di bahasa apa.
 *
 * Halaman dengan slug berbeda per bahasa (artikel CMS) mendeklarasikan URL terjemahan lewat
 * <link rel="alternate" hreflang> di <head>. Setelah mount, tautan memakai URL itu agar
 * tidak mendarat di slug yang salah. Tanpa JS, halaman artikel sendiri me-redirect slug
 * locale lain ke terjemahannya (lihat media-center/articles/[slug]/page.tsx).
 */
export default function LanguageSwitch({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(id|en)(?=\/|$)/, "") || "/";
  const activeIndex = LOCALES.indexOf(language as Locale);

  const [alternates, setAlternates] = useState<Partial<Record<Locale, string>>>({});
  useEffect(() => {
    // Untuk browser, metadata halaman dinamis di-stream Next ke <body> dan bisa tiba setelah
    // efek ini jalan -> cari di seluruh dokumen dan amati perubahan DOM sebentar.
    const read = () => {
      const found: Partial<Record<Locale, string>> = {};
      for (const locale of LOCALES) {
        const el = document.querySelector<HTMLLinkElement>(
          `link[rel="alternate"][hreflang="${locale}"]`,
        );
        if (!el?.href) continue;
        try {
          const u = new URL(el.href);
          found[locale] = `${u.pathname}${u.search}`;
        } catch {
          /* abaikan href tidak valid */
        }
      }
      setAlternates(found);
      return Object.keys(found).length > 0;
    };
    if (read()) return;
    const observer = new MutationObserver(() => {
      if (read()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    const stop = window.setTimeout(() => observer.disconnect(), 5000);
    return () => {
      observer.disconnect();
      window.clearTimeout(stop);
    };
  }, [pathname]);

  const remember = (locale: Locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <div
      className={cn(
        "nav-rule relative flex items-center rounded-md border p-[3px]",
        className,
      )}
    >
      <span
        aria-hidden
        className="nav-seg-plate absolute top-[3px] bottom-[3px] left-[3px] rounded-[5px]"
        style={{
          width: `calc((100% - 6px) / ${LOCALES.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {LOCALES.map((locale) => {
        const active = locale === language;
        const href = alternates[locale] ?? `/${locale}${rest}`;
        return (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            onClick={() => remember(locale)}
            className={cn(
              "relative z-10 rounded-[5px] text-center font-mono font-medium uppercase transition-colors duration-300",
              size === "sm"
                ? "px-2 py-1 text-[10px] tracking-[0.12em]"
                : "px-2.5 py-1.5 text-[11px] tracking-[0.12em]",
              active ? "nav-ink" : "nav-ink-dim hover:opacity-80",
            )}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
