"use client";
import { useLanguage } from "@/app/lib/language-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { useInView } from "react-intersection-observer";
import HeadunitCarousel from "../edpower/components/headunit-carousel";

type Props = {
  page: string;
  feature: number;
  image: string;
  imageStyle?: string;
  alt: string;
  style?: string;
  titleColor?: string;
  descColor?: string;
  tagStyle?: string;
  edmaxCarousel?: boolean;
};

export default function FeatureSection2({
  page,
  feature,
  image,
  imageStyle,
  alt,
  style,
  titleColor,
  descColor,
  tagStyle,
  edmaxCarousel,
}: Props) {
  const { t } = useLanguage();
  const { ref: feature2Ref, inView: feature2InView } = useInView({
    threshold: 0.4,
    triggerOnce: true,
  });

  return (
    <section
      ref={feature2Ref}
      className={cn(
        "py-16 md:py-20 lg:py-24 bg-gradient-to-b from-black from-80% to-gray-900 overflow-hidden relative",
        style
      )}
      // className="py-16 md:py-20 lg:py-24 bg-white overflow-hidden relative"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[2400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div
            className={cn(
              "transition-all duration-1000 transform",
              feature2InView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-16",
              feature % 2 != 0 ? "order-0" : "order-2"
            )}
          >
            <div
              className={cn(
                "hidden lg:inline-block px-4 py-1 mb-6 border border-teal-700 rounded-full bg-teal-900/50 text-[var(--primary-light)]",
                tagStyle
              )}
            >
              <span className="text-sm font-medium">
                {t(`${page}.feature${feature}.tag`)}
              </span>
            </div>
            <h2
              className={cn(
                `text-2xl sm:text-3xl md:text-4xl font-bold text-white
                 mb-2`,
                titleColor
              )}
            >
              {/* <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2"> */}
              {t(`${page}.feature${feature}.title`)}
            </h2>
            <h3 className="text-xl sm:text-2xl font-semibold text-[var(--primary-dark)] mb-4">
              {/* <h3 className="text-xl sm:text-2xl font-semibold text-[var(--primary-dark)] mb-4"> */}
              {t(`${page}.feature${feature}.subtitle`)}
            </h3>
            <p
              className={cn(
                `text-base sm:text-lg text-gray-300 mb-6 max-w-[80%]`,
                descColor
              )}
            >
              {/* <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-lg"> */}
              {t(`${page}.feature${feature}.description`)}
            </p>
          </div>

          <div
            className={cn(
              "relative transition-all duration-1000 transform",
              feature2InView
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-16"
            )}
          >
            <div className="relative h-[300px] sm:h-[400px] md:h-[550px] w-full rounded-xl overflow-hidden shadow-soft-lg">
              {edmaxCarousel ? (
                <HeadunitCarousel />
              ) : (
                <Image
                  src={image}
                  alt={alt}
                  className={cn("w-full h-full object-cover", imageStyle)}
                  width={800}
                  height={450}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
