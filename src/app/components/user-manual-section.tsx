"use client";

import React from "react";
import { useInView } from "react-intersection-observer";
import { FileText, Eye, Download } from "lucide-react";
import { useLanguage } from "../lib/language-context";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MotorType = "bees" | "athena" | "victory" | "edpower";

const MOTOR_TYPES: MotorType[] = ["bees", "athena", "victory", "edpower"];

const PDF_NAME: Record<MotorType, string> = {
  bees: "Bees",
  athena: "Athena",
  victory: "Victory",
  edpower: "EdPower",
};

const manualHref = (motorType: MotorType) =>
  `/user-manual/${encodeURI(`USER MANUAL - ${PDF_NAME[motorType]}.pdf`)}`;

type CardProps = {
  motorType: MotorType;
  inView: boolean;
  index?: number;
  showTitle?: boolean;
};

function UserManualCard({
  motorType,
  inView,
  index = 0,
  showTitle = true,
}: CardProps) {
  const { t } = useLanguage();
  const href = manualHref(motorType);

  return (
    <Card
      className={cn(
        "group relative h-full overflow-hidden rounded-xl border border-gray-200/80 bg-white py-0 gap-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out",
        "hover:-translate-y-0.5 hover:border-[var(--primary-lighter)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
        "motion-safe:transition-all motion-safe:duration-700",
        inView
          ? "motion-safe:translate-y-0 motion-safe:opacity-100"
          : "motion-safe:translate-y-6 motion-safe:opacity-0",
      )}
      style={{ transitionDelay: inView ? `${index * 100}ms` : "0ms" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--secondary-light)] text-[var(--primary-dark)] ring-1 ring-[var(--primary-lighter)]/40 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
            <FileText className="h-4 w-4" />
          </div>
          {showTitle && (
            <h3 className="text-base font-semibold tracking-tight text-black sm:text-lg">
              {t(`user.manual.card.${motorType}.title`)}
            </h3>
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          {t(`user.manual.card.${motorType}.desc`)}
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            asChild
            size="sm"
            className="group/btn rounded-full bg-[var(--primary)] px-4 text-xs font-medium text-white hover:bg-[var(--primary-dark)] sm:text-sm"
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              <Eye className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:scale-110" />
              {t("user.manual.btn.view")}
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="group/btn rounded-full border-gray-300 bg-white px-4 text-xs font-medium hover:border-[var(--primary)] hover:bg-[var(--secondary-light)] hover:text-[var(--primary-dark)] sm:text-sm"
          >
            <a href={href} download>
              <Download className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
              {t("user.manual.btn.download")}
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}

type Props = { variant: "single"; motorType: MotorType } | { variant: "grid" };

export default function UserManualSection(props: Props) {
  const { t } = useLanguage();
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const isGrid = props.variant === "grid";

  return (
    <section
      ref={ref}
      id={isGrid ? "user-manual" : undefined}
      className="relative scroll-mt-24 bg-white py-10 md:py-14"
    >
      <div className="main-container">
        {isGrid ? (
          <>
            <div
              className={cn(
                "mx-auto max-w-2xl text-center transition-all duration-700",
                inView
                  ? "motion-safe:translate-y-0 motion-safe:opacity-100"
                  : "motion-safe:translate-y-4 motion-safe:opacity-0",
              )}
            >
              <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                {t("user.manual.faq.section.title")}{" "}
                <span className="text-[var(--primary)]">
                  {t("user.manual.faq.section.titleHighlight")}
                </span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
                {t("user.manual.faq.section.description")}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {MOTOR_TYPES.map((m, i) => (
                <UserManualCard
                  key={m}
                  motorType={m}
                  inView={inView}
                  index={i}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            <div
              className={cn(
                "lg:w-1/2 transition-all duration-700",
                inView
                  ? "motion-safe:translate-y-0 motion-safe:opacity-100"
                  : "motion-safe:translate-y-4 motion-safe:opacity-0",
              )}
            >
              <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                {t("user.manual.section.title")}{" "}
                <span className="text-[var(--primary)]">
                  {t("user.manual.section.titleHighlight")}
                </span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
                {t("user.manual.section.description")}
              </p>
            </div>

            <div className="lg:w-1/2">
              <UserManualCard
                motorType={props.motorType}
                inView={inView}
                showTitle={false}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
