"use client";
import ColorPicker from "@/app/components/color-picker";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Download } from "lucide-react";
import React from "react";
import { useInView } from "react-intersection-observer";

export interface ProductColor {
  name: string;
  hex: string;
  //   image: string;
  alt: string;
}
type Props = {
  productColor: ProductColor[];
  productName: string;
  style?: string;
  titleColor?: string;
  descColor?: string;
};

export default function ProductPicker({
  productName,
  productColor,
  style,
  titleColor,
  descColor,
}: Props) {
  const { t } = useLanguage();
  const { ref: colorRef, inView: colorInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  return (
    <section
      ref={colorRef}
      className={cn("py-16 md:py-20 lg:py-24 bg-white", style)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-10 md:mb-16 transition-all duration-1000 transform",
            colorInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          )}
        >
          <h2
            className={cn(
              "text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4",
              titleColor
            )}
          >
            {t("edmax.color.title")}{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent relative">
              {t("edmax.color.titleHighlight")}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--primary-light)]"></span>
            </span>
          </h2>
          <p
            className={cn(
              "text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto",
              descColor
            )}
          >
            {t(
              `${
                productName === "edpower" ? "edmax" : productName
              }.color.description`
            )}
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
          <ColorPicker
            name={productName}
            product={productColor}
            descColor={descColor}
          />
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
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg shadow-teal transition-all duration-300 hover:-translate-y-1">
            {t("edmax.hero.orderNow")}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--secondary-light)] px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg transition-all duration-300 hover:-translate-y-1"
          >
            <Download className="mr-2 h-5 w-5" />
            {t("edmax.hero.downloadBrochure")}
          </Button>
        </div>
      </div>
    </section>
  );
}
