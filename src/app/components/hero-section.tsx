"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../lib/language-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  imageAlt: string;
  imageStyle?: string;
  theme: "dark" | "light";
};

export default function HeroSection({
  name,
  imageStyle,
  imageAlt,
  theme,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { t } = useLanguage();
  const light = {
    titleStyle: "text-black",
    descriptionStyle: "text-gray-800",
    tagStyle: "border-teal-200 bg-teal-50 text-teal-600",
  };
  const dark = {
    titleStyle: "text-white",
    descriptionStyle: "text-gray-200",
    tagStyle: "border-teal-700 bg-teal-900/50 text-teal-400",
  };

  useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(max-width: 767px)");

    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Set nilai awal
    setIsMobile(mediaQuery.matches);

    // Tambahkan event listener
    mediaQuery.addEventListener("change", handleMediaChange);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      <Image
        alt={imageAlt}
        src={`/${name}-hero.webp`}
        width={9000}
        height={1000}
        className={cn(
          "object-cover inset-0 h-[100vh] 2xl:object-[80%_100%] object-[75%_75%]",
          imageStyle
        )}
      />
      {/* dark overlay */}
      <div className="md:hidden absolute inset-0 bg-black/60 z-10" />

      {/* Hero content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 absolute z-20 left-0 md:left-15">
        {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"> */}
        <div className=" grid grid-cols-1 lg:grid-cols-[1fr_2fr] 2xl:grid-cols-2 gap-8 md:gap-12 items-center pb-20">
          <div
            className={cn(
              "transition-all duration-1000 transform order-1 lg:order-0 ",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-16"
            )}
          >
            <div
              className={cn(
                "hidden lg:inline-block px-4 py-1 mb-6 border border-teal-700 rounded-full bg-teal-900/50 text-teal-400",
                isMobile
                  ? dark.tagStyle
                  : theme === "dark"
                  ? dark.tagStyle
                  : light.tagStyle
              )}
            >
              <span className="text-sm font-medium">
                {t(`${name}.hero.tag`)}
              </span>
            </div>

            <h1
              className={cn(
                "text-3xl sm:text-4xl md:text-4xl lg:text-4xl 2xl:text-6xl font-bold leading-tight text-white mb-4 md:mb-6",
                // "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4 md:mb-6",
                isMobile
                  ? dark.titleStyle
                  : theme === "dark"
                  ? dark.titleStyle
                  : light.titleStyle
              )}
            >
              {t(`${name}.hero.title`)}{" "}
              <span className="bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent relative">
                {t(`${name}.hero.titleHighlight`)}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
              </span>
            </h1>

            <p
              className={cn(
                "text-base sm:text-md md:text-lg 2xl:text-xl text-gray-300 mb-6 md:mb-8 max-w-lg",
                // "text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-lg",
                isMobile
                  ? dark.descriptionStyle
                  : theme === "dark"
                  ? dark.descriptionStyle
                  : light.descriptionStyle
              )}
            >
              {t(`${name}.hero.description`)}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg shadow-teal transition-all duration-300 hover:-translate-y-1">
                {t("edmax.hero.orderNow")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                className="border-teal-500 text-teal-400 hover:bg-teal-900/50 px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Download className="mr-2 h-5 w-5" />
                {t("edmax.hero.downloadBrochure")}
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "relative transition-all duration-1000 delay-300 transform",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-16"
            )}
          >
            {/* Motorcycle image */}
            <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] w-full mt-8 lg:mt-0">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                {/* <img
                src="/placeholder.svg?height=500&width=600"
                alt="Wedison Edmax Electric Motorcycle"
                className="object-contain w-full h-full animate-float"
              /> */}
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/20 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-teal-400/20 rounded-full opacity-40 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
