"use client";

// import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { MapPin, Activity, Zap, Check } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { cn } from "@/lib/utils";
import StoreBadges from "@/components/store-badges";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Sub-section A – App Introduction                                   */
/* ------------------------------------------------------------------ */

function AppIntro() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section ref={ref} className="bg-white py-20 md:py-28 lg:py-32">
      <div className="main-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Phone */}
          <div
            className={cn(
              "flex justify-center transition-all duration-1000",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
            )}
          >
            <div className="w-[240px] sm:w-[270px] md:w-[300px]">
              {/* <PhoneMockup
                screenshot="/super-charge/app/screenshot-home.svg"
                alt="SuperCharge app home screen"
              /> */}
              <Image
                src={"/super-charge/app/Screen-05.webp"}
                alt="Mockup"
                height={300}
                width={300}
              />
            </div>
          </div>

          {/* Text */}
          <div
            className={cn(
              "transition-all duration-1000 delay-150",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
            )}
          >
            <span className="inline-block rounded-full border border-[var(--primary-lighter)] bg-[var(--secondary-light)] px-4 py-1.5 text-sm font-medium text-[var(--primary-dark)]">
              {t("supercharge.app.tag")}
            </span>

            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight">
              {t("supercharge.app.hero.title")}
              <br />
              <span className="text-[var(--primary)]">
                {t("supercharge.app.hero.titleHighlight")}
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-lg leading-relaxed">
              {t("supercharge.app.hero.description")}
            </p>

            <div className="mt-8">
              <StoreBadges size="md" />
            </div>
          </div>
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
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  const isPhoneLeft = index % 2 === 0;

  const bullets = [
    t(`supercharge.app.feature${featureKey}.bullet1`),
    t(`supercharge.app.feature${featureKey}.bullet2`),
    t(`supercharge.app.feature${featureKey}.bullet3`),
  ];

  return (
    <section ref={ref} className={cn(bgClass, "py-16 md:py-20 lg:py-24")}>
      <div className="main-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Phone column */}
          <div
            className={cn(
              "flex justify-center transition-all duration-1000",
              isPhoneLeft ? "order-1 lg:order-0" : "order-1 lg:order-2",
              inView
                ? "opacity-100 translate-x-0"
                : isPhoneLeft
                  ? "opacity-0 -translate-x-12"
                  : "opacity-0 translate-x-12",
            )}
          >
            <div className="w-[220px] sm:w-[250px] md:w-[270px]">
              <Image
                src={`/super-charge/app/${screenshot}.webp`}
                alt="Mockup"
                height={300}
                width={300}
              />
            </div>
          </div>

          {/* Text column */}
          <div
            className={cn(
              "order-2 transition-all duration-1000 lg:order-1 lg:max-w-[85%]",
              !isPhoneLeft && "lg:ml-auto",
              inView
                ? "opacity-100 translate-x-0"
                : isPhoneLeft
                  ? "opacity-0 translate-x-12"
                  : "opacity-0 -translate-x-12 ",
            )}
          >
            {/* Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--secondary-light)] text-[var(--primary-dark)]">
              {icon}
            </div>

            <h3 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-black">
              {t(`supercharge.app.feature${featureKey}.title`)}
            </h3>

            <p className="mt-2 text-lg font-semibold text-[var(--primary-dark)] sm:text-xl">
              {t(`supercharge.app.feature${featureKey}.subtitle`)}
            </p>

            <p className="mt-4 text-base text-gray-500 sm:text-lg leading-relaxed">
              {t(`supercharge.app.feature${featureKey}.description`)}
            </p>

            {/* Bullets */}
            <ul className="mt-6 space-y-3">
              {bullets.map((bullet, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex items-start gap-3 text-sm text-gray-600 transition-all duration-700 sm:text-base",
                    inView
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0",
                  )}
                  style={{
                    transitionDelay: inView
                      ? `${(i + 1) * 150 + 300}ms`
                      : "0ms",
                  }}
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-section C – Stats Bar                                          */
/* ------------------------------------------------------------------ */

// interface StatItemProps {
//   target: number;
//   suffix: string;
//   label: string;
//   decimal?: boolean;
//   delay: number;
//   inView: boolean;
// }

// function StatItem({
//   target,
//   suffix,
//   label,
//   decimal = false,
//   delay,
//   inView,
// }: StatItemProps) {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     if (!inView) return;

//     let current = 0;
//     const increment = decimal ? target / 60 : Math.ceil(target / 60);

//     const interval = setInterval(() => {
//       current += increment;
//       if (current >= target) {
//         current = target;
//         clearInterval(interval);
//       }
//       setCount(current);
//     }, 25);

//     return () => clearInterval(interval);
//   }, [inView, target, decimal]);

//   const display = decimal ? count.toFixed(1) : Math.floor(count).toString();

//   return (
//     <div
//       className={cn(
//         "flex flex-col items-center text-center transition-all duration-700",
//         inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
//       )}
//       style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
//     >
//       <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--primary)]">
//         {display}
//         {suffix}
//       </span>
//       <span className="mt-2 text-sm font-medium text-gray-500 sm:text-base">
//         {label}
//       </span>
//     </div>
//   );
// }

// function StatsBar() {
//   const { t } = useLanguage();
//   const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

//   const stats = [
//     {
//       target: 100,
//       suffix: "+",
//       label: t("supercharge.app.stats.stations"),
//       decimal: false,
//       delay: 0,
//     },
//     {
//       target: 50,
//       suffix: "K+",
//       label: t("supercharge.app.stats.downloads"),
//       decimal: false,
//       delay: 150,
//     },
//     {
//       target: 4.8,
//       suffix: "",
//       label: t("supercharge.app.stats.rating"),
//       decimal: true,
//       delay: 300,
//     },
//     {
//       target: 15,
//       suffix: "",
//       label: t("supercharge.app.stats.chargeTime"),
//       decimal: false,
//       delay: 450,
//     },
//   ];

//   return (
//     <section ref={ref} className="bg-gray-50 py-16 md:py-20">
//       <div className="main-container">
//         <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
//           {stats.map((stat, i) => (
//             <StatItem
//               key={i}
//               target={stat.target}
//               suffix={stat.suffix}
//               label={stat.label}
//               decimal={stat.decimal}
//               delay={stat.delay}
//               inView={inView}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

/* ------------------------------------------------------------------ */
/*  Sub-section D – Download CTA                                       */
/* ------------------------------------------------------------------ */

function DownloadCTA() {
  const { t } = useLanguage();
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="bg-white py-20 md:py-28 lg:py-32">
      <div className="main-container">
        <div
          className={cn(
            "flex flex-col items-center text-center transition-all duration-1000",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black">
            {t("supercharge.app.cta.title")}{" "}
            <span className="text-[var(--primary)]">
              {t("supercharge.app.cta.titleHighlight")}
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-base sm:text-lg text-gray-500 leading-relaxed">
            {t("supercharge.app.cta.description")}
          </p>

          {/* Two phones */}
          <div className="mt-14 flex items-end justify-center gap-6 md:gap-10">
            <div
              className={cn(
                "w-[260px] sm:w-[390px] md:w-[420px] transition-all duration-1000",
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: inView ? "200ms" : "0ms" }}
            >
              {/* <PhoneMockup
                screenshot="/super-charge/app/mockup-supercharge-app.png"
                alt="SuperCharge app home"
              /> */}

              <Image
                src={"/super-charge/app/mockup-supercharge-app.png"}
                alt="mockup"
                width={500}
                height={400}
              />
            </div>
            {/* 
            <div
              className={cn(
                "hidden sm:block w-[160px] sm:w-[190px] md:w-[220px] transition-all duration-1000",
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: inView ? "400ms" : "0ms" }}
            >
              <PhoneMockup
                screenshot="/super-charge/app/screenshot-map.svg"
                alt="SuperCharge app map"
              />
            </div> */}
          </div>

          {/* Store badges */}
          <div
            className={cn(
              "mt-10 transition-all duration-700",
              inView ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDelay: inView ? "600ms" : "0ms" }}
          >
            <StoreBadges className="justify-center" />
          </div>
        </div>
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
        bgClass="bg-gray-100"
        screenshot="Screen-01"
        icon={<MapPin className="h-5 w-5" />}
        featureKey="1"
      />
      <FeatureRow
        index={2}
        bgClass="bg-white"
        screenshot="Screen-04"
        icon={<Activity className="h-5 w-5" />}
        featureKey="2"
      />
      <FeatureRow
        index={3}
        bgClass="bg-gray-100"
        screenshot="Screen-02"
        icon={<Zap className="h-5 w-5" />}
        featureKey="3"
      />

      {/* <StatsBar /> */}

      <DownloadCTA />
    </>
  );
}
