"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-200"></div>
      {/* <Image
        src={"/contoh-hero.png"}
        alt="Wedison Electric Motorcycle"
        className="absolute inset-0 object-cover object-top w-full h-full"
        height={800}
        width={900}
        quality={100}
      /> */}

      {/* Hero content */}
      <div className="container py-0 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* <div className="block lg:flex gap-8 md:gap-12 items-center"> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-12 items-center">
          <div
            className={cn(
              "order-1 md:order-0 transition-all duration-1000 transform",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-16"
            )}
          >
            <div className="inline-block px-4 py-1 mb-6 border border-teal-200 rounded-full bg-teal-50 text-teal-600">
              <span className="text-sm font-medium">{t("hero.tag")}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-bold leading-tight text-gray-900 mb-4 md:mb-6">
              {t("hero.title")}{" "}
              {/* <span className="bg-gradient-to-r text-shadow-lg from-teal-500 to-teal-400 bg-clip-text text-transparent relative"> */}
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent relative">
                {t("hero.titleHighlight")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
              </span>
            </h1>

            <p className="text-base sm:text-lg 2xl:text-xl text-gray-600 mb-6 md:mb-8 max-w-lg">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link href={"#products"} scroll={true}>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg shadow-teal transition-all duration-300 hover:-translate-y-1">
                  {/* <Button className="bg-[#2db475] hover:bg-[#2db475cb] text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg shadow-teal transition-all duration-300 hover:-translate-y-1"> */}
                  {t("hero.exploreModels")}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href={"#contact"} scroll={true}>
                <Button
                  variant="outline"
                  // className="border-[#2db475] text-[#2db475] hover:bg-teal-50 px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg transition-all duration-300 hover:-translate-y-1"
                  className=" text-teal-500 hover:bg-teal-50 px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {t("hero.bookTestRide")}
                </Button>
              </Link>
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
            <div className="relative h-[250px] sm:h-[350px] md:h-[400px] 2xl:h-[450px] w-full mb-5 2xl:mt-0">
              {/* <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full mb-5 lg:mt-0"> */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-xl">
                {/* <div> */}
                <Image
                  src="/edmax-chatgpt.webp"
                  alt="Wedison Electric Motorcycle"
                  className="object-cover w-full h-full animate-float rounded-md "
                  height={800}
                  width={900}
                  quality={100}
                />
              </div>

              {/* Decorative elements */}
              {/* <div className="absolute -bottom-10 -left-5 w-40 h-40 bg-teal-100 rounded-full opacity-50 blur-2xl"></div> */}
              {/* <div className="absolute -top-10 -right-10 w-60 h-60 bg-teal-200 rounded-full opacity-40 blur-3xl"></div> */}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="absolute top-30 left-2/6 w-40 h-40 bg-teal-200 rounded-full opacity-50 blur-2xl"></div> */}

      {/* Decorative shapes */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
      <div className="hidden md:absolute bottom-6 left-1/2 transform -translate-x-1/2 2xl:flex flex-col items-center">
        <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-gray-400 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
