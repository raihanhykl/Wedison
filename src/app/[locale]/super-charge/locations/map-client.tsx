"use client";

// Wrapper client agar peta bisa di-`dynamic({ ssr:false })` — di Next 15 ssr:false
// dilarang di Server Component, jadi harus dari komponen client seperti ini.
//
// Peta (MapLibre GL ±270 kB gzip + WebGL) ditunda sampai (1) kontainer peta terlihat di
// viewport DAN (2) browser senggang setelah hidrasi (requestIdleCallback). Daftar lokasi
// yang sudah di-SSR tampil lebih dulu, sehingga LCP/TBT halaman tidak ditahan oleh peta.
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MapProps } from "./supercharge-map";

const SuperChargeMap = dynamic(() => import("./supercharge-map"), {
  ssr: false,
  loading: () => <Placeholder />,
});

function Placeholder() {
  return <div className="h-full w-full animate-pulse bg-muted" aria-hidden />;
}

/** Jendela idle maksimum sebelum peta dipaksa dimuat (ms). */
const IDLE_TIMEOUT = 2500;

export default function MapClient(props: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
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
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      if (idleId !== undefined && typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [ready]);

  return (
    <div ref={ref} className="h-full w-full">
      {ready ? <SuperChargeMap {...props} /> : <Placeholder />}
    </div>
  );
}
