"use client";

import { useLanguage } from "@/app/lib/language-context";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropworn-menu";

export default function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const route = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // let tone: string | null = null;
  const [tone, setTone] = useState<string | null>(null);

  // const pageTone = () => {
  //   if (route == "/edpower") {
  //     tone = " text-[var(--primary-light)]";
  //   } else if (route == "/dash") {
  //     tone = " text-[#fdc600] hover:text-[#fdc600]/80";
  //   } else if (route == "/victory") {
  //     tone = " text-white hover:text-white/80";
  //   } else if (route == "/mini") {
  //     tone = " text-[#7fa3a4] hover:text-[#7fa3a4]/80";
  //   } else if (route == "/athena") {
  //     tone = " text-[#ff7db6] hover:text-[#ff7db6]/80";
  //   }
  // };
  // pageTone();
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled, route]);

  useEffect(() => {
    if (route == "/edpower/" || route == "/edpower") {
      setTone(" text-[var(--primary-light)]");
    } else if (route == "/dash/" || route == "/dash") {
      setTone(" text-[#fdc600] hover:text-[#fdc600]/80");
    } else if (route == "/victory/" || route == "/victory") {
      setTone(" text-white hover:text-white/80");
    } else if (route == "/mini/" || route == "/mini") {
      setTone(" text-[#7fa3a4] hover:text-[#7fa3a4]/80");
    } else if (route == "/athena/" || route == "/athena") {
      setTone(" text-[#ff7db6] hover:text-[#ff7db6]/80");
    } else {
      setTone("");
    }
  }, [route]);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
    setIsOpen(false);
  };

  return (
    // <div className={cn("relative", className)}>
    //   <button
    //     onClick={() => setIsOpen(!isOpen)}
    //     className={cn(
    //       "flex items-center gap-1.5 text-gray-800 hover:text-[var(--primary)] transition-colors px-3 py-2 rounded-md text-sm font-medium",
    //       tone && tone
    //     )}
    //     aria-label="Toggle language"
    //   >
    //     <Globe className="h-4 w-4" />
    //     <span className="hidden md:inline">{t("language")}</span>
    //   </button>

    //   {isOpen && (
    //     <div className="absolute right-0 mt-2 w-40 rounded-md shadow-soft bg-white ring-1 ring-black ring-opacity-5 z-50">
    //       <button
    //         onClick={toggleLanguage}
    //         className={cn(
    //           "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--primary)] hover:rounded-md"
    //         )}
    //       >
    //         {t("switchLanguage")}
    //       </button>
    //     </div>
    //   )}
    // </div>
    <div className={cn("relative", className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1.5 text-white hover:text-[var(--primary)] transition-colors px-3 py-2 rounded-md text-sm font-semibold ring-0 outline-none",
            // "flex items-center gap-1.5 text-gray-800 hover:text-[var(--primary)] transition-colors px-3 py-2 rounded-md text-sm font-medium ring-0 outline-none",
            scrolled ? "bg-none backdrop-blur-md shadow-soft" : "bg-none",
            tone && tone
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{t("language")}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="absolute right-0 mt-2 w-40 rounded-md shadow-soft bg-white ring-1 ring-black ring-opacity-5 z-50 border-none">
          <button
            onClick={toggleLanguage}
            className={cn(
              "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--primary)] hover:rounded-md"
              // "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--primary)] hover:rounded-md"
            )}
          >
            {t("switchLanguage")}
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
