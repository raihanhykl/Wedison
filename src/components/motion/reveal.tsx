"use client";

import * as m from "motion/react-m";
import { VIEWPORT_ONCE, transition } from "./config";
import { cn } from "@/lib/utils";

type Tag = "div" | "section" | "span" | "li" | "ul" | "h2" | "h3" | "p";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** entrance delay in SECONDS (Motion uses seconds, not ms) */
  delay?: number;
  /** vertical offset px before reveal (default 16) */
  y?: number;
  /** fraction of the element visible before it fires (default 0.15). Higher = fires later. */
  amount?: number;
  as?: Tag;
};

/**
 * Fade + rise on scroll-into-view. Reduced motion handled globally via MotionConfig
 * (lazy-motion-provider). Drop-in replacement for the old IntersectionObserver Reveal.
 */
export function Reveal({ children, className, delay = 0, y = 16, amount, as = "div" }: RevealProps) {
  const Comp = m[as] as typeof m.div;
  return (
    <Comp
      className={cn("reveal-init", className)}
      initial="hidden"
      whileInView="show"
      viewport={amount != null ? { ...VIEWPORT_ONCE, amount } : VIEWPORT_ONCE}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { ...transition, delay } },
      }}
    >
      {children}
    </Comp>
  );
}

export const FadeIn = Reveal;
