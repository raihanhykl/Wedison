import type { Variants, Transition } from "motion/react";

// Shared motion language (Ather feel: ease-out expo, ~0.7s, 16px rise).
// Pure data — safe to import from server or client.
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const REVEAL_DURATION = 0.7;
export const REVEAL_Y = 16;

// Fire once, when ~15% visible, slightly before fully on-screen.
export const VIEWPORT_ONCE = { once: true, amount: 0.15, margin: "0px 0px -8% 0px" } as const;

export const transition: Transition = { duration: REVEAL_DURATION, ease: EASE_OUT_EXPO };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: REVEAL_Y },
  show: { opacity: 1, y: 0, transition },
};

// Parent orchestrates children; children use `fadeUp` and inherit the cascade.
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
