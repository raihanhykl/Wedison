"use client";

import { LazyMotion, domAnimation, MotionConfig } from "motion/react";

/**
 * Single Motion boundary for the whole app. `m` components (motion/react-m) ride this
 * LazyMotion so we ship ~4.6kb core + domAnimation features (incl. whileInView) once,
 * never the full `motion` bundle. `strict` throws if anyone imports heavy `motion.*`.
 * reducedMotion="user" makes every animation respect the OS setting globally.
 */
export function LazyMotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
