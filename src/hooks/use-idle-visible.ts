"use client";

import { useEffect, useState, type RefObject } from "react";

/** Jendela idle maksimum sebelum konten berat dipaksa dimuat (ms). */
const IDLE_TIMEOUT = 2500;

/**
 * true setelah elemen (1) mendekati viewport DAN (2) browser senggang (requestIdleCallback).
 * Dipakai untuk menunda komponen berat seperti peta MapLibre (±270 kB gzip + WebGL) supaya
 * LCP/TBT halaman tidak tertahan. Sekali true, tetap true.
 */
export function useIdleVisible(ref: RefObject<HTMLElement | null>, rootMargin = "200px"): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    // requestIdleCallback belum ada di Safari lama -> fallback setTimeout.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const schedule = () => {
      const start = () => {
        if (!cancelled) setReady(true);
      };
      if (typeof w.requestIdleCallback === "function") {
        idleId = w.requestIdleCallback(start, { timeout: IDLE_TIMEOUT });
      } else {
        timeoutId = window.setTimeout(start, 300);
      }
    };

    if (!("IntersectionObserver" in window)) {
      schedule();
      return () => {
        cancelled = true;
      };
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          schedule();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      if (idleId !== undefined && typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [ready, ref, rootMargin]);

  return ready;
}
