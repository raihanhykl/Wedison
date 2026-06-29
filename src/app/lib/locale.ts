// Sumber kebenaran tunggal untuk daftar locale + util path.
// Dipakai oleh middleware, layout [locale], dan komponen navigasi.

export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "id";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Buang prefix /id atau /en dari pathname untuk perbandingan path yang
 * locale-agnostic. Contoh: "/id/showroom/" -> "/showroom/", "/en" -> "/".
 */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/(id|en)(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}
