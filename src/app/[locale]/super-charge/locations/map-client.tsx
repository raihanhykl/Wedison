"use client";

// Wrapper client agar peta bisa di-`dynamic({ ssr:false })` — di Next 15 ssr:false
// dilarang di Server Component, jadi harus dari komponen client seperti ini.
//
// Peta (MapLibre GL ±270 kB gzip + WebGL) ditunda sampai (1) kontainer peta terlihat di
// viewport DAN (2) browser senggang setelah hidrasi (useIdleVisible). Daftar lokasi
// yang sudah di-SSR tampil lebih dulu, sehingga LCP/TBT halaman tidak ditahan oleh peta.
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useIdleVisible } from "@/hooks/use-idle-visible";
import type { MapProps } from "./supercharge-map";

const SuperChargeMap = dynamic(() => import("./supercharge-map"), {
  ssr: false,
  loading: () => <Placeholder />,
});

function Placeholder() {
  return <div className="h-full w-full animate-pulse bg-muted" aria-hidden />;
}

export default function MapClient(props: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useIdleVisible(ref);

  return (
    <div ref={ref} className="h-full w-full">
      {ready ? <SuperChargeMap {...props} /> : <Placeholder />}
    </div>
  );
}
