"use client";

// Wrapper client agar peta bisa di-`dynamic({ ssr:false })` — di Next 15 ssr:false
// dilarang di Server Component, jadi harus dari komponen client seperti ini.
import dynamic from "next/dynamic";
import type { MapProps } from "./supercharge-map";

const SuperChargeMap = dynamic(() => import("./supercharge-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-muted" aria-hidden />
  ),
});

export default function MapClient(props: MapProps) {
  return <SuperChargeMap {...props} />;
}
