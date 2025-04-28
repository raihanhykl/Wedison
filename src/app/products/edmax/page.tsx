"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ColorPicker from "@/app/components/color-picker";
import SpecificationsAccordion from "@/app/components/specifications-accordion";
import Image from "next/image";
import HeadunitCarousel from "./components/headunit-carousel";
import { ProductColor } from "./components/product-pick";

export default function EdmaxPage() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  const product: ProductColor[] = [
    {
      name: "midnight",
      hex: "#000000",
      alt: "Black",
    },
    {
      name: "chatgpt",
      hex: "#FFFFFF",
      alt: "White",
    },
    {
      name: "brown",
      hex: "#A0522D",
      alt: "Red",
    },
  ];
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);

  // InView hooks for animations

  const { ref: feature2Ref, inView: feature2InView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { ref: feature3Ref, inView: feature3InView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { ref: colorRef, inView: colorInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { ref: specsRef, inView: specsInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      {/* <section className="relative min-h-[90vh] h-full md:min-h-screen flex items-center overflow-hidden"> */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
        {/* <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden pt-16 md:pt-20"> */}
        {/* Background gradient */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"></div> */}
        {/* backgroundimage */}
        <Image
          alt="edmax front look"
          src={"/edmax-edit.webp"}
          width={9000}
          height={1000}
          className="object-cover inset-0 h-[100vh] lg:object-[0%_0%] object-[75%_100%]"
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
              <div className="hidden lg:inline-block px-4 py-1 mb-6 border border-teal-700 rounded-full bg-teal-900/50 text-teal-400">
                <span className="text-sm font-medium">
                  {t("edmax.hero.tag")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4 md:mb-6">
                {t("edmax.hero.title")}{" "}
                <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent relative">
                  {t("edmax.hero.titleHighlight")}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-lg">
                {t("edmax.hero.description")}
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

      {/* Feature 1 - Long Range */}
      {/* <section
        ref={feature1Ref}
        className="py-16 md:py-20 lg:py-24 bg-gray-50 overflow-hidden relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div
              className={cn(
                "order-2 lg:order-1 relative transition-all duration-1000 transform",
                feature1InView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-16"
              )}
            >
              <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full rounded-xl overflow-hidden shadow-soft-lg">
                <img
                  src="/placeholder.svg?height=450&width=800"
                  alt="Edmax Long Range"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-transparent"></div>
              </div>
            </div>

            <div
              className={cn(
                "order-1 lg:order-2 transition-all duration-1000 transform",
                feature1InView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-16"
              )}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {t("edmax.feature1.title")}
              </h2>
              <h3 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-4">
                {t("edmax.feature1.subtitle")}
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-lg">
                {t("edmax.feature1.description")}
              </p>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-500"
                    >
                      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                      <path d="M9 17h6" />
                      <path d="M9 13h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">120km</p>
                    <p className="text-xs text-gray-500">
                      {t("edmax.feature1.range")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-500"
                    >
                      <path d="M3 12h4l3 8l4 -16l3 8h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t("edmax.feature1.efficient")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("edmax.feature1.energyUse")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-500"
                    >
                      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                      <path d="M12 12l3 2" />
                      <path d="M12 7v5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t("edmax.feature1.realtime")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("edmax.feature1.rangeIndicator")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* Feature 3 - Sporty Design */}
      <section
        ref={feature3Ref}
        className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-black from-50% to-green-950 overflow-hidden relative"
        // className="py-16 md:py-20 lg:py-24 bg-gray-50 overflow-hidden relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div
              className={cn(
                "order-2 lg:order-1 relative transition-all duration-1000 transform",
                feature3InView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-16"
              )}
            >
              <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full rounded-xl overflow-hidden shadow-soft-lg bg-black">
                {/* <Image
                  src={"/edmax-digital.webp"}
                  alt="Edmax Sporty Design"
                  className="w-full h-full object-cover"
                  width={800}
                  height={450}
                /> */}
                <HeadunitCarousel />
                {/* <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-transparent"></div> */}
              </div>
            </div>

            <div
              className={cn(
                "order-1 lg:order-2 transition-all duration-1000 transform",
                feature3InView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-16"
              )}
            >
              <div className="hidden lg:inline-block px-4 py-1 mb-6 border border-teal-700 rounded-full bg-teal-900/50 text-teal-400">
                <span className="text-sm font-medium">Smart Display</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                {/* <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2"> */}
                {/* {t("edmax.feature3.title")} */}
                Smart Connectivity at Your Fingertips
              </h2>
              <h3 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-4">
                {/* <h3 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-4"> */}
                {/* {t("edmax.feature3.subtitle")} */}
                Wireless Apple CarPlay & Android Auto, Full Touchscreen Display
              </h3>
              <p
                className="text-base sm:text-lg text-gray-300
               mb-6 max-w-lg"
              >
                {/* <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-lg"> */}
                {/* {t("edmax.feature3.description")} */}
                Connect without the hassle. Access navigation, music and
                communications directly from the full-color touchscreen with
                wireless Apple CarPlay and Android Auto support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 - Super Fast Charging */}
      <section
        ref={feature2Ref}
        className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-black from-80% to-gray-900 overflow-hidden relative"
        // className="py-16 md:py-20 lg:py-24 bg-white overflow-hidden relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div
              className={cn(
                "transition-all duration-1000 transform",
                feature2InView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-16"
              )}
            >
              <div className="hidden lg:inline-block px-4 py-1 mb-6 border border-teal-700 rounded-full bg-teal-900/50 text-teal-400">
                <span className="text-sm font-medium">Super Charge</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                {/* <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2"> */}
                {t("edmax.feature2.title")}
              </h2>
              <h3 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-4">
                {/* <h3 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-4"> */}
                {t("edmax.feature2.subtitle")}
              </h3>
              <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-lg">
                {/* <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-lg"> */}
                {t("edmax.feature2.description")}
              </p>

              {/* <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-500"
                    >
                      <path d="M11 9l-6 6l6 6" />
                      <path d="M17 4l6 6l-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">20 min</p>
                    <p className="text-xs text-gray-500">
                      {t("edmax.feature2.charge")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-500"
                    >
                      <path d="M19 7h-14a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-6a2 2 0 0 0 -2 -2z" />
                      <path d="M7 7v-2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v2" />
                      <path d="M5 12h14" />
                      <path d="M13 7v6" />
                    </svg>
                  </div>
                  <div>

                    <p className="text-sm font-medium text-gray-900">
                      {t("edmax.feature2.universal")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("edmax.feature2.chargingPort")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-500"
                    >
                      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                      <path d="M9 17h6" />
                      <path d="M9 13h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t("edmax.feature2.smart")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("edmax.feature2.chargingApp")}
                    </p>
                  </div>
                </div>
              </div> */}
            </div>

            <div
              className={cn(
                "relative transition-all duration-1000 transform",
                feature2InView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-16"
              )}
            >
              <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full rounded-xl overflow-hidden shadow-soft-lg">
                {/* <img
                  src="/placeholder.svg?height=450&width=800"
                  alt="Edmax Super Fast Charging"
                  className="w-full h-full object-cover"
                /> */}
                <Image
                  src={"/edmax-charging.webp"}
                  alt="Edmax Super Fast Charging"
                  className="w-full h-full object-cover"
                  width={800}
                  height={450}
                />
                {/* <div className="absolute inset-0 bg-gradient-to-l from-teal-500/20 to-transparent"></div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Pick Section */}
      <section ref={colorRef} className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "text-center mb-10 md:mb-16 transition-all duration-1000 transform",
              colorInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              {t("edmax.color.title")}{" "}
              <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent relative">
                {t("edmax.color.titleHighlight")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t("edmax.color.description")}
            </p>
          </div>

          <div
            className={cn(
              "transition-all duration-1000 transform",
              colorInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <ColorPicker name="edmax" product={product} />
          </div>

          <div
            className={cn(
              "flex flex-wrap justify-center gap-4 mt-10 transition-all duration-1000 transform",
              colorInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
            style={{ transitionDelay: "400ms" }}
          >
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg shadow-teal transition-all duration-300 hover:-translate-y-1">
              {t("edmax.hero.orderNow")}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              className="border-teal-500 text-teal-500 hover:bg-teal-50 px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg transition-all duration-300 hover:-translate-y-1"
            >
              <Download className="mr-2 h-5 w-5" />
              {t("edmax.hero.downloadBrochure")}
            </Button>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section ref={specsRef} className="py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "text-center mb-10 md:mb-16 transition-all duration-1000 transform",
              specsInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent relative">
                {t("edmax.specs.title")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t("edmax.specs.description")}
            </p>
          </div>

          <div
            className={cn(
              "max-w-3xl mx-auto transition-all duration-1000 transform",
              specsInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <SpecificationsAccordion />
          </div>
        </div>
      </section>
    </main>
  );
}
