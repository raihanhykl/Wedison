"use client";

import { translations } from "./translations";
import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type Language = "en" | "id";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  // Catatan: sebagian nilai terjemahan sebenarnya JSX (ReactNode), tapi tipe
  // dipertahankan `string` (via cast di t()) agar ~ratusan call site yang
  // menaruh t() ke field bertipe string tetap kompilasi. Membereskan tipe ini
  // = fase tersendiri, di luar lingkup migrasi locale.
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({
  locale,
  children,
}: {
  locale: Language;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // URL = sumber kebenaran. `language` selalu mengikuti segmen [locale] di URL.
  // Saat user pindah /id <-> /en, layout [locale] re-render dengan prop locale
  // baru sehingga seluruh consumer ikut ter-update. Tidak perlu useState.
  const language: Language = locale;

  // Ganti bahasa = navigasi ke URL locale lain (pertahankan sisa path),
  // plus simpan preferensi di cookie agar middleware mengingatnya.
  const setLanguage = (newLanguage: Language) => {
    document.cookie = `NEXT_LOCALE=${newLanguage}; path=/; max-age=31536000; samesite=lax`;
    const rest = pathname.replace(/^\/(id|en)(?=\/|$)/, "");
    router.push(`/${newLanguage}${rest || "/"}`);
  };

  const t = (key: string): string => {
    return (
      (translations[language] as unknown as Record<string, string>)[key] || key
    );
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
