"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

type Language = "en" | "id";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  // Catatan: sebagian nilai terjemahan sebenarnya JSX (ReactNode), tapi tipe
  // dipertahankan `string` (via cast di t()) agar ~ratusan call site yang
  // menaruh t() ke field bertipe string tetap kompilasi.
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Language;
  // Kamus locale AKTIF saja (di-inject oleh provider per-locale) -> hanya satu
  // bahasa yang ikut ke bundle client, bukan keduanya sekaligus.
  dictionary: Record<string, unknown>;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // URL = sumber kebenaran. `language` selalu mengikuti segmen [locale] di URL.
  const language: Language = locale;

  // Ganti bahasa = navigasi ke URL locale lain (pertahankan sisa path),
  // plus simpan preferensi di cookie agar middleware mengingatnya.
  const setLanguage = (newLanguage: Language) => {
    document.cookie = `NEXT_LOCALE=${newLanguage}; path=/; max-age=31536000; samesite=lax`;
    const rest = pathname.replace(/^\/(id|en)(?=\/|$)/, "");
    router.push(`/${newLanguage}${rest || "/"}`);
  };

  const t = (key: string): string => {
    return (dictionary as unknown as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
