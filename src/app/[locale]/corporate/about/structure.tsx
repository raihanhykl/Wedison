"use client";

import { useEffect } from "react";
import { useLanguage } from "@/app/lib/language-context";
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
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const { t } = useLanguage();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <section className="pt-0 2xl:pt-24 bg-gradient-to-b from-muted to-background">
        <div className="main-container py-16 md:py-20 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal>
              <div className="text-center mb-8 md:mb-0">
                <div className="inline-block px-4 py-1 mb-4 border border-border rounded-full bg-secondary text-primary">
                  <span className="text-sm font-medium">{t("about.tag")}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl md:text-4xl 2xl:text-6xl font-bold tracking-tight text-foreground text-balance mb-6">
                  {t("about.title")}{" "}
                  <span className="text-primary relative">
                    {t("about.titleHighlight")}
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/40"></span>
                  </span>
                </h1>
              </div>

              <div className="bg-card border border-border rounded-xl shadow-sm p-6 2xl:p-8">
                <h2 className="font-display text-xl 2xl:text-3xl font-bold tracking-tight text-foreground mb-4">
                  {t("about.overview.title")}
                </h2>
                <p className="text-muted-foreground mb-4 text-base 2xl:text-lg leading-relaxed">
                  {t("about.overview.p1")}
                </p>
                <p className="text-muted-foreground text-base 2xl:text-lg leading-relaxed">
                  {t("about.overview.p2")}
                </p>
              </div>
            </Reveal>

            {/* Hero Image */}
            <Reveal
              delay={0.1}
              className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg"
            >
              <Image
                src={"/wedison-factory.webp"}
                alt=" Wedison Factory"
                className="w-full h-full object-cover object-center"
                fill
                sizes="100vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="main-container">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-8 text-foreground">
                {t("about.mission.title")}
              </h2>

              <div className="bg-muted border border-border rounded-xl p-6 md:p-8 shadow-sm mb-6">
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
                  {t("about.mission.p1")}
                </p>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {t("about.mission.p2")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="main-container">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-8 text-foreground">
              {t("about.values.title")}
            </h2>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                Icon: Zap,
                title: t("about.values.innovation.title"),
                description: t("about.values.innovation.description"),
              },
              {
                Icon: Users,
                title: t("about.values.partnerships.title"),
                description: t("about.values.partnerships.description"),
              },
              {
                Icon: Lightbulb,
                title: t("about.values.experience.title"),
                description: t("about.values.experience.description"),
              },
            ].map(({ Icon, title, description }, index) => (
              <StaggerItem key={index}>
                <div className="h-full bg-card border border-border rounded-xl p-6 shadow-sm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                      {title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="main-container">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-8 text-foreground">
              {t("about.projects.title")}
            </h2>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                Icon: Leaf,
                title: t("about.projects.future.title"),
                description: t("about.projects.future.description"),
              },
              {
                Icon: BatteryCharging,
                title: t("about.projects.charging.title"),
                description: t("about.projects.charging.description"),
              },
            ].map(({ Icon, title, description }, index) => (
              <StaggerItem key={index}>
                <div className="h-full bg-muted border border-border rounded-xl p-6 shadow-sm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                      {title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="main-container">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-8 text-foreground">
              {t("about.offers.title")}
            </h2>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                Icon: Bike,
                title: t("about.offers.motorcycles.title"),
                description: t("about.offers.motorcycles.description"),
              },
              {
                Icon: BatteryCharging,
                title: t("about.offers.charging.title"),
                description: t("about.offers.charging.description"),
              },
            ].map(({ Icon, title, description }, index) => (
              <StaggerItem key={index}>
                <div className="h-full bg-card border border-border rounded-xl p-6 shadow-sm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                      {title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="main-container">
          <Reveal className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-6 text-foreground">
              {t("about.joinUs")}
            </h2>
            <p className="text-muted-foreground mb-8 text-base md:text-lg">
              {t("about.joinUsDescription")}
            </p>
            <Link href={"/corporate/contact/#contact"}>
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground group transition-all duration-300 hover:-translate-y-1 px-6 py-3 text-base">
                {t("about.contactUs")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
