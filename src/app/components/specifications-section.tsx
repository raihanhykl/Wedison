"use client";
import React from "react";
import DashSpecificationsAccordion from "../dash/components/dash-specification-accordion";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "../lib/language-context";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
};

export default function SpecificationsSection({}: Props) {
  const { t } = useLanguage();
  const { ref: specsRef, inView: specsInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  return (
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
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent relative">
              {t(`dash.specs.title`)}
              {/* {t(`${name}.specs.title`)} */}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--primary-light)]"></span>
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t(`dash.specs.description`)}
            {/* {t(`${name}.specs.description`)} */}
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
          <DashSpecificationsAccordion />
        </div>
      </div>
    </section>
  );
}
