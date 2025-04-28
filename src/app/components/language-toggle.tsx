"use client";

import { useLanguage } from "@/app/lib/language-context";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const route = usePathname();

  let tone: string | null = null;

  const pageTone = () => {
    if (route == "/products/edmax") {
      tone = " text-[var(--primary-light)]";
    } else if (route == "/products/dash") {
      tone = " text-[#fdc600] hover:text-[#fdc600]/80";
    } else if (route == "/products/victory") {
      tone = " text-white hover:text-white/80";
    } else if (route == "/products/mini") {
      tone = " text-[#7fa3a4] hover:text-[#7fa3a4]/80";
    } else if (route == "/products/athena") {
      tone = " text-[#ff7db6] hover:text-[#ff7db6]/80";
    }
  };
  pageTone();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 text-gray-800 hover:text-teal-500 transition-colors px-3 py-2 rounded-md text-sm font-medium",
          tone && tone
        )}
        aria-label="Toggle language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden md:inline">{t("language")}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-soft bg-white ring-1 ring-black ring-opacity-5 z-50">
          <button
            onClick={toggleLanguage}
            className={cn(
              "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-500 hover:rounded-md"
            )}
          >
            {t("switchLanguage")}
          </button>
        </div>
      )}
    </div>
  );
}
