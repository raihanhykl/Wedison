"use client";

import { useInView } from "react-intersection-observer";
import { Battery, Zap, Gauge, Leaf, HeartPulse, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Battery className="h-10 w-10 text-[var(--primary)]" />,
      title: t("features.longRangeBattery"),
      description: t("features.longRangeBatteryDesc"),
    },
    {
      icon: <Zap className="h-10 w-10 text-[var(--primary)]" />,
      title: t("features.rapidCharging"),
      description: t("features.rapidChargingDesc"),
    },
    {
      icon: <Gauge className="h-10 w-10 text-[var(--primary)]" />,
      title: t("features.impressivePerformance"),
      description: t("features.impressivePerformanceDesc"),
    },
    {
      icon: <Leaf className="h-10 w-10 text-[var(--primary)]" />,
      title: t("features.zeroEmissions"),
      description: t("features.zeroEmissionsDesc"),
    },
    {
      icon: <HeartPulse className="h-10 w-10 text-[var(--primary)]" />,
      title: t("features.healthBenefits"),
      description: t("features.healthBenefitsDesc"),
    },
    {
      icon: <Wind className="h-10 w-10 text-[var(--primary)]" />,
      title: t("features.noiseFree"),
      description: t("features.noiseFreeDesc"),
    },
  ];

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className="py-16 md:py-20 lg:py-24 bg-white"
      id="features"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block px-4 py-1 mb-4 border border-[var(--primary-lighter)] rounded-full bg-[var(--secondary-light)] text-[var(--primary-dark)]">
            <span className="text-sm font-medium">{t("features.tag")}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            {t("features.title")}{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent relative">
              {t("features.titleHighlight")}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--primary-light)]"></span>
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t("features.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "bg-gray-50 rounded-xl p-6 md:p-8 shadow-soft transition-all duration-700 transform group hover:shadow-soft-lg hover:-translate-y-1",
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              )}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="mb-5 inline-block p-3 bg-[var(--secondary-light)] rounded-lg group-hover:bg-[var(--secondary)] transition-colors duration-300">
                {feature.icon}
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3 group-hover:text-[var(--primary-dark)] transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
