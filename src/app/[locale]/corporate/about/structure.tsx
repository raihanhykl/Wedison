"use client";

import { useEffect } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Users,
  Lightbulb,
  Leaf,
  BatteryCharging,
  Bike,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const { t } = useLanguage();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // InView hooks for animations
  const { ref: missionRef, inView: missionInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: valuesRef, inView: valuesInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: projectsRef, inView: projectsInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: offersRef, inView: offersInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <section className="pt-0 2xl:pt-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="main-container py-16 md:py-20 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="text-center mb-8 md:mb-0">
                <div className="inline-block px-4 py-1 mb-4 border border-[var(--primary-lighter)] rounded-full bg-[var(--secondary-light)] text-[var(--primary-dark)]">
                  <span className="text-sm font-medium">{t("about.tag")}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-4xl 2xl:text-6xl font-bold text-gray-900 mb-6">
                  {t("about.title")}{" "}
                  <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent relative">
                    {t("about.titleHighlight")}
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--primary-light)]"></span>
                  </span>
                </h1>
              </div>

              <div className="bg-white rounded-xl shadow-soft p-6 2xl:p-8">
                <h2 className="text-xl 2xl:text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text">
                  {t("about.overview.title")}
                </h2>
                <p className="text-gray-700 mb-4 text-base 2xl:text-lg leading-relaxed">
                  {t("about.overview.p1")}
                </p>
                <p className="text-gray-700 text-base 2xl:text-lg leading-relaxed">
                  {t("about.overview.p2")}
                </p>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-soft-lg">
              {/* <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/20 to-transparent z-10"></div> */}
              <Image
                src={"/wedison-factory.webp"}
                alt=" Wedison Factory"
                className="w-full h-full object-cover object-center z-50"
                width={9000}
                height={1000}
              />

              {/* Decorative elements */}
              {/* <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--secondary)] rounded-full opacity-50 blur-2xl"></div> */}
              {/* <div className="absolute -top-10 -right-10 w-60 h-60 bg-[var(--primary-lighter)] rounded-full opacity-40 blur-3xl"></div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className="py-16 md:py-20 bg-white">
        <div className="main-container">
          <div className="max-w-4xl mx-auto">
            <div
              className={cn(
                "transition-all duration-1000 transform",
                missionInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
                {t("about.mission.title")}
              </h2>

              <div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow-soft mb-6">
                <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                  {t("about.mission.p1")}
                </p>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {t("about.mission.p2")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section ref={valuesRef} className="py-16 md:py-20 bg-gray-50">
        <div className="main-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
            {t("about.values.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div
              className={cn(
                "bg-white rounded-xl p-6 shadow-soft transition-all duration-700 transform hover:shadow-soft-lg hover:-translate-y-1",
                valuesInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("about.values.innovation.title")}
                </h3>
              </div>
              <p className="text-gray-700">
                {t("about.values.innovation.description")}
              </p>
            </div>

            <div
              className={cn(
                "bg-white rounded-xl p-6 shadow-soft transition-all duration-700 transform hover:shadow-soft-lg hover:-translate-y-1",
                valuesInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("about.values.partnerships.title")}
                </h3>
              </div>
              <p className="text-gray-700">
                {t("about.values.partnerships.description")}
              </p>
            </div>

            <div
              className={cn(
                "bg-white rounded-xl p-6 shadow-soft transition-all duration-700 transform hover:shadow-soft-lg hover:-translate-y-1",
                valuesInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center mr-4">
                  <Lightbulb className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("about.values.experience.title")}
                </h3>
              </div>
              <p className="text-gray-700">
                {t("about.values.experience.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-16 md:py-20 bg-white">
        <div className="main-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
            {t("about.projects.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div
              className={cn(
                "bg-gray-50 rounded-xl p-6 shadow-soft transition-all duration-700 transform hover:shadow-soft-lg hover:-translate-y-1",
                projectsInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center mr-4">
                  <Leaf className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("about.projects.future.title")}
                </h3>
              </div>
              <p className="text-gray-700">
                {t("about.projects.future.description")}
              </p>
            </div>

            <div
              className={cn(
                "bg-gray-50 rounded-xl p-6 shadow-soft transition-all duration-700 transform hover:shadow-soft-lg hover:-translate-y-1",
                projectsInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center mr-4">
                  <BatteryCharging className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("about.projects.charging.title")}
                </h3>
              </div>
              <p className="text-gray-700">
                {t("about.projects.charging.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section ref={offersRef} className="py-16 md:py-20 bg-gray-50">
        <div className="main-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
            {t("about.offers.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div
              className={cn(
                "bg-white rounded-xl p-6 shadow-soft transition-all duration-700 transform hover:shadow-soft-lg hover:-translate-y-1",
                offersInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center mr-4">
                  <Bike className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("about.offers.motorcycles.title")}
                </h3>
              </div>
              <p className="text-gray-700">
                {t("about.offers.motorcycles.description")}
              </p>
            </div>

            <div
              className={cn(
                "bg-white rounded-xl p-6 shadow-soft transition-all duration-700 transform hover:shadow-soft-lg hover:-translate-y-1",
                offersInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center mr-4">
                  <BatteryCharging className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("about.offers.charging.title")}
                </h3>
              </div>
              <p className="text-gray-700">
                {t("about.offers.charging.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="main-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
              {t("about.joinUs")}
            </h2>
            <p className="text-gray-700 mb-8 text-base md:text-lg">
              {t("about.joinUsDescription")}
            </p>
            <Link href={"/corporate/contact/#contact"}>
              <Button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white group transition-all duration-300 hover:-translate-y-1 px-6 py-3 text-base">
                {t("about.contactUs")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
