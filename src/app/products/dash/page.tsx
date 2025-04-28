"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import FeatureSection2 from "../components/feature-section";
import DashSpecificationsAccordion from "./components/dash-specification-accordion";
// import ProductPicker, { ProductColor } from "../edmax/components/product-pick";

export default function EdmaxPage() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  //   const product: ProductColor[] = [
  //     { name: "hero", hex: "#ffc500", alt: "Yellow Dash Electric Motorcycle" },
  //   ];

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);

  // InView hooks for animations

  const { ref: specsRef, inView: specsInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      {/* <section className="relative min-h-[90vh] h-full md:min-h-screen flex items-center overflow-hidden"> */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
        <Image
          alt="dash side look"
          src={"/dash-hero.webp"}
          width={9000}
          height={1000}
          className="object-cover inset-0 h-[100vh] lg:object-[0%_100%] object-[75%_100%]"
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
                  {t("dash.hero.tag")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4 md:mb-6">
                {t("dash.hero.title")}{" "}
                <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent relative">
                  {t("dash.hero.titleHighlight")}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-lg">
                {t("dash.hero.description")}
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
                <div className="absolute -bottom-10 -left-10 w-40 h-40  bg-teal-500/20 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute -top-10 -right-10 w-60 h-60 bg-teal-400/20 rounded-full opacity-40 blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FeatureSection2
        page="dash"
        feature={1}
        alt="man riding dash electric motorcycle"
        image="/dash-feature1.webp"
        style="bg-gradient-to-t  from-black from-60% to-[#493c14]"
        titleColor="text-white"
        descColor="text-gray-300"
      />
      <FeatureSection2
        page="dash"
        feature={2}
        alt="Edmax super fast charge"
        image="/dash-feature2.webp"
        style="bg-gradient-to-b  from-black from-60% to-[#493c14]"
        titleColor="text-white"
        descColor="text-gray-300"
      />
      {/* Color Pick Section */}
      {/* <ProductPicker
        productName="Dash"
        productColor={product}
        style="bg-black"
        titleColor="text-white"
        descColor="text-gray-300"
      /> */}

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
                {t("dash.specs.title")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t("dash.specs.description")}
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
            {/* <SpecificationsAccordion /> */}
            <DashSpecificationsAccordion />
          </div>
        </div>
      </section>
    </main>
  );
}
