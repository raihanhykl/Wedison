"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

/**
 * Ather-style hero shrink. Detects a small scroll THRESHOLD (not continuous scroll-linking,
 * which flickers) and toggles `data-shrunk`. The actual shrink+round is a single smooth CSS
 * transition (see `.hero-shrink` in globals.css) — container-aligned width via calc(), resize-aware.
 */
export function ShrinkHero({ children }: { children: React.ReactNode }) {
  const [shrunk, setShrunk] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setShrunk(y > 48));

  return (
    <div className="hero-shrink" data-shrunk={shrunk}>
      <div className="hero-shrink-inner">{children}</div>
    </div>
  );
}
