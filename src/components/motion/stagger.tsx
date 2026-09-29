"use client";

import * as m from "motion/react-m";
import { staggerParent, fadeUp, VIEWPORT_ONCE } from "./config";
import { cn } from "@/lib/utils";

/** Orchestrates a cascade — direct children should be <StaggerItem> (no per-item delay math). */
export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_ONCE}
      variants={staggerParent}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.div className={cn("reveal-init", className)} variants={fadeUp}>
      {children}
    </m.div>
  );
}
