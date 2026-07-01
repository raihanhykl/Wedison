"use client";

import { MapPin, Activity, Zap, Check } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { cn } from "@/lib/utils";
import StoreBadges from "@/components/store-badges";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

/* ------------------------------------------------------------------ */
/*  Sub-section A – App Introduction                                   */
/* ------------------------------------------------------------------ */

function AppIntro() {
  const { t } = useLanguage();

  return (
    <section className="bg-card py-20 md:py-28 lg:py-32">
      <div className="main-container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Phone */}
          <Reveal className="flex justify-center" y={28} amount={0.2}>
            <div className="w-[240px] sm:w-[270px] md:w-[300px]">
              <Image
                src={"/super-charge/app/Screen-05.webp"}
                alt="Tampilan aplikasi Wedison SuperCharge"
                height={300}
                width={300}
              />
            </div>
          </Reveal>

          {/* Text */}
          <Reveal delay={0.1} y={28}>
            <span className="inline-block rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-primary">
              {t("supercharge.app.tag")}
            </span>

            <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {t("supercharge.app.hero.title")}
              <br />
              <span className="text-primary">
                {t("supercharge.app.hero.titleHighlight")}
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("supercharge.app.hero.description")}
            </p>

            <div className="mt-8">
              <StoreBadges size="md" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-section B – Feature Rows                                       */
/* ------------------------------------------------------------------ */

interface FeatureRowProps {
  index: number;
  bgClass: string;
  screenshot: string;
  icon: React.ReactNode;
  featureKey: string;
}

function FeatureRow({
  index,
  bgClass,
  screenshot,
  icon,
  featureKey,
}: FeatureRowProps) {
  const { t } = useLanguage();

  const isPhoneLeft = index % 2 === 0;

  const bullets = [
    t(`supercharge.app.feature${featureKey}.bullet1`),
    t(`supercharge.app.feature${featureKey}.bullet2`),
    t(`supercharge.app.feature${featureKey}.bullet3`),
  ];

  return (
    <section className={cn(bgClass, "py-16 md:py-20 lg:py-24")}>
      <div className="main-container">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2">
          {/* Phone column */}
          <Reveal
            className={cn(
              "flex justify-center",
              isPhoneLeft ? "order-1 lg:order-0" : "order-1 lg:order-2",
            )}
            y={28}
            amount={0.2}
          >
            <div className="w-[220px] sm:w-[250px] md:w-[270px]">
              <Image
                src={`/super-charge/app/${screenshot}.webp`}
                alt={`Fitur ${t(`supercharge.app.feature${featureKey}.title`)} pada aplikasi Wedison SuperCharge`}
                height={300}
                width={300}
              />
            </div>
          </Reveal>

          {/* Text column */}
          <Reveal
            className={cn(
              "order-2 lg:order-1 lg:max-w-[85%]",
              !isPhoneLeft && "lg:ml-auto",
            )}
            delay={0.1}
            y={28}
          >
            {/* Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
              {icon}
            </div>

            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {t(`supercharge.app.feature${featureKey}.title`)}
            </h3>

            <p className="mt-2 text-lg font-semibold text-primary sm:text-xl">
              {t(`supercharge.app.feature${featureKey}.subtitle`)}
            </p>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t(`supercharge.app.feature${featureKey}.description`)}
            </p>

            {/* Bullets */}
            <Stagger className="mt-6 space-y-3">
              {bullets.map((bullet, i) => (
                <StaggerItem
                  key={i}
                  className="flex items-start gap-3 text-sm text-muted-foreground sm:text-base"
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{bullet}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-section D – Download CTA                                       */
/* ------------------------------------------------------------------ */

function DownloadCTA() {
  const { t } = useLanguage();

  return (
    <section className="bg-card py-20 md:py-28 lg:py-32">
      <div className="main-container">
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
            {t("supercharge.app.cta.title")}{" "}
            <span className="text-primary">
              {t("supercharge.app.cta.titleHighlight")}
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("supercharge.app.cta.description")}
          </p>

          {/* Two phones */}
          <Reveal
            className="mt-14 flex items-end justify-center gap-6 md:gap-10"
            delay={0.15}
            y={24}
            amount={0.2}
          >
            <div className="w-[260px] sm:w-[390px] md:w-[420px]">
              <Image
                src={"/super-charge/app/mockup-supercharge-app.png"}
                alt="Aplikasi Wedison SuperCharge di dua layar smartphone"
                width={500}
                height={400}
              />
            </div>
          </Reveal>

          {/* Store badges */}
          <Reveal className="mt-10" delay={0.25}>
            <StoreBadges className="justify-center" />
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export default function AppShowcase() {
  return (
    <>
      <AppIntro />

      <FeatureRow
        index={1}
        bgClass="bg-muted"
        screenshot="Screen-01"
        icon={<MapPin className="h-5 w-5" />}
        featureKey="1"
      />
      <FeatureRow
        index={2}
        bgClass="bg-card"
        screenshot="Screen-04"
        icon={<Activity className="h-5 w-5" />}
        featureKey="2"
      />
      <FeatureRow
        index={3}
        bgClass="bg-muted"
        screenshot="Screen-02"
        icon={<Zap className="h-5 w-5" />}
        featureKey="3"
      />

      <DownloadCTA />
    </>
  );
}
