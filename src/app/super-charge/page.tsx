"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import FeatureSection2 from "@/app/products/components/feature-section";

export default function EdmaxPage() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      {/* <section className="relative min-h-[90vh] h-full md:min-h-screen flex items-center overflow-hidden"> */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
        <Image
          alt="dash side look"
          src={"/supercharge-hero.webp"}
          width={9000}
          height={1000}
          className="object-cover inset-0 h-[100vh] lg:object-[0%_90%] object-[69%_100%]"
        />
        {/* dark overlay */}
        <div className="md:hidden absolute inset-0 bg-black/60 z-10" />

        {/* Hero content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 absolute z-20 left-0 md:left-15">
          {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"> */}
          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center pb-20">
            <div
              className={cn(
                "transition-all duration-1000 transform order-1 lg:order-0",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              )}
            >
              <div className="hidden lg:inline-block px-4 py-1 mb-6 border border-teal-200 rounded-full bg-teal-50 text-teal-600">
                <span className="text-sm font-medium">
                  {t("supercharge.hero.tag")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white md:text-gray-800 mb-4 md:mb-6">
                {t("supercharge.hero.title")}{" "}
                <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent relative">
                  {t("supercharge.hero.titleHighlight")}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-300 md:text-gray-900 mb-6 md:mb-8 max-w-lg">
                {t("supercharge.hero.description")}
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
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"></div>

                {/* Decorative elements */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/20 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute -top-10 -right-10 w-60 h-60 bg-teal-400/20 rounded-full opacity-40 blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 - Super Fast Charging */}

      <FeatureSection2
        page="supercharge"
        feature={1}
        alt="man riding dash electric motorcycle"
        image="/edmax-charging.webp"
        style="bg-gray-100"
        // style="bg-gradient-to-bl  from-[#1E1F22] from-60% to-[#3A3B3F]"
        titleColor="text-black"
        descColor="text-gray-600"
        tagStyle="border-teal-200 bg-teal-50 text-teal-600"
      />
      <FeatureSection2
        page="supercharge"
        feature={2}
        alt="Victory in the golden hour"
        image="/supercharge-location.webp"
        style="bg-white object-[100%_0%] object-cover"
        titleColor="text-black"
        descColor="text-gray-600"
        tagStyle="border-teal-200 bg-teal-50 text-teal-600"
      />
    </main>
  );
}
