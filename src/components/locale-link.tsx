"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLanguage } from "@/app/lib/language-context";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  /** Path locale-agnostic, mis. "/super-charge" atau "/corporate/contact#contact". */
  href: string;
};

/**
 * <Link> internal yang otomatis diberi prefix locale aktif + trailing slash, mis.
 * "/super-charge" -> "/id/super-charge/". Dipakai di kamus (dictionaries/*.tsx) dan komponen
 * client yang tidak tahu locale. Link tanpa prefix locale memicu redirect 307 dari middleware
 * (+ 308 trailing slash) = dua lompatan sia-sia untuk user dan crawler.
 */
export function LocaleLink({ href, ...rest }: Props) {
  const { language } = useLanguage();
  const m = href.match(/^([^?#]*)(.*)$/);
  const pathname = m?.[1] ?? href;
  const suffix = m?.[2] ?? "";
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`;
  return <Link href={`/${language}${withSlash}${suffix}`} {...rest} />;
}
