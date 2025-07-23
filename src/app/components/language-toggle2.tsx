"use client";

import { useLanguage } from "@/app/lib/language-context";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function LanguageToggle2({
  toggleOpen,
}: {
  toggleOpen?: boolean;
}) {
  const { language, setLanguage } = useLanguage();
  const route = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [whitePage, setWhitePage] = useState(false);
  useEffect(() => {
    if (
      route === "/corporate/about/" ||
      route === "/corporate/contact/" ||
      route === "/showroom/" ||
      route === "/super-charge/"
    ) {
      setWhitePage(true);
    } else {
      setWhitePage(false);
    }
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

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  return (
    <div
      className={cn(
        ` h-6 w-16 md:w-22 md:h-10 rounded-full border-[2px] lg:border-[3px] flex items-center justify-center mr-2 hover:scale-105 transition-all duration-300 ${
          language === "en" ? "pl-2" : "pr-2"
        }`,

        scrolled || toggleOpen
          ? "border-black"
          : whitePage
          ? "border-black"
          : "border-white"
      )}
    >
      <div
        className="relative w-full h-full text-white font-semibold overflow-visible cursor-pointer"
        onClick={() => {
          toggleLanguage();
        }}
      >
        {/* Globe */}
        <div
          className={cn(
            `  absolute top-0 w-3/5 h-full flex items-center transition-all duration-500 z-20 py-[2px] rounded-full`,
            language === "en"
              ? "left-full -translate-x-full "
              : "left-0 translate-x-0 ",

            scrolled || toggleOpen
              ? "text-black"
              : whitePage
              ? "text-black"
              : "text-white"
          )}
        >
          <Globe className="h-full mx-auto" />
        </div>

        {/* Translate Text */}
        <div
          className={
            cn(
              `absolute top-0 h-full w-2/5  flex items-center transition-all duration-500 select-none text-right text-sm text-wrap xl:text-nowrap rounded-xl font-bold `,

              language === "en"
                ? "left-0 translate-x-0"
                : "left-full -translate-x-full ",
              scrolled || toggleOpen
                ? "text-black"
                : whitePage
                ? "text-black"
                : "text-white"
            )
            // scrolled ? "text-black" : "text-white"
          }
        >
          <span
            className={cn(
              "absolute transition-opacity duration-300 text-center w-full",
              language === "id" ? "opacity-100" : "opacity-0"
            )}
          >
            EN
          </span>

          {/* Language 2 */}
          <span
            className={cn(
              "absolute transition-opacity duration-300 mx-auto w-full text-center",
              language === "en" ? "opacity-100" : "opacity-0"
            )}
          >
            ID
          </span>
        </div>
      </div>
    </div>
  );
}
