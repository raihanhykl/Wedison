"use client";

import { useEffect } from "react";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/** Jarak scroll (px) dari full-bleed sampai ukuran akhir. */
const SHRINK_DISTANCE = 360;
const INSET_TOP = 12; // px — 0.75rem
const RADIUS = 28; // px — 1.75rem

/** Inset kiri/kanan akhir: sejajar container 1340px, minimal 14px di layar sempit. */
function sideInset() {
  return Math.max(14, (window.innerWidth - 1340) / 2);
}

/**
 * Ather-style hero shrink, scroll-linked: progress 0→1 mengikuti scrollY sepanjang
 * SHRINK_DISTANCE, dihaluskan spring supaya lompatan scroll wheel tidak terasa patah.
 * Menyusut lewat `clip-path: inset()` (bukan padding/width) sehingga tidak memicu
 * layout reflow pada carousel & gambar besar di dalamnya.
 */
export function ShrinkHero({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const side = useMotionValue(14);
  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, [0, SHRINK_DISTANCE], [0, 1], {
    clamp: true,
  });
  const progress = useSpring(raw, { stiffness: 260, damping: 40, mass: 0.6 });

  useEffect(() => {
    const update = () => side.set(sideInset());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [side]);

  const clipPath = useTransform(() => {
    const p = progress.get();
    const x = side.get() * p;
    return `inset(${INSET_TOP * p}px ${x}px 0px ${x}px round ${RADIUS * p}px)`;
  });

  // Reduced motion: tetap full-bleed (elemen sama agar hydration konsisten).
  return (
    <m.div style={reduce ? undefined : { clipPath, willChange: "clip-path" }}>
      {children}
    </m.div>
  );
}
