"use client";

import { useInView } from "react-intersection-observer";
import { useLanguage } from "@/app/lib/language-context";
import StoreBadges from "./store-badges";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function AppDownloadTeaser() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="bg-white py-20 md:py-28 lg:py-32">
      <div className="main-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Phone Column */}
          <div
            className={`flex justify-center transition-all duration-1000 transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="w-[220px] sm:w-[250px] md:w-[370px] md:h-[500px] flex items-center">
              {/* <PhoneMockup
                screenshot="/super-charge/app/screenshot-map.svg"
                alt="SuperCharge App"
              /> */}
              <Image
                src={"/super-charge/app/mockup-supercharge-app.png"}
                width={500}
                height={500}
                alt="iphone mockup"
                className=""
              />
            </div>
          </div>

          {/* Text Column */}
          <div
            className={`transition-all duration-1000 delay-150 transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Tag */}
            <span className="inline-block rounded-full border border-[var(--primary-lighter)] bg-[var(--secondary-light)] px-4 py-1.5 text-sm font-medium text-[var(--primary-dark)]">
              {/* {t("supercharge.app.tag")} */}
              Wedison Supercharge App
            </span>

            {/* Headline */}
            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight">
              {t("supercharge.app.teaser.title")}{" "}
              <span className="text-[var(--primary)]">
                {t("supercharge.app.teaser.titleHighlight")}
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-lg leading-relaxed">
              {t("supercharge.app.teaser.description")}
            </p>

            {/* Store Badges */}
            <div className="mt-8">
              <StoreBadges size="md" />
            </div>

            {/* Link to SuperCharge page */}
            <Link
              href="/super-charge"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--primary-dark)] hover:text-[var(--primary)] transition-colors duration-300"
            >
              {t("btn.learn.more")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
