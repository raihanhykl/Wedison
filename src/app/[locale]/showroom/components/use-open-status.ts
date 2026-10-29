"use client";

import { useEffect, useState } from "react";
import { openStatusAt, type OpenStatus, type PublicShowroom } from "@/lib/showrooms/showroom";

export type { OpenStatus };

/**
 * Status buka/tutup cabang menurut jam per hari, tanggal tutup khusus, dan zona waktunya sendiri.
 * Dihitung setelah mount (null saat SSR) supaya HTML server tidak memuat status yang basi
 * dan tidak terjadi hydration mismatch. Diperbarui tiap menit.
 */
export function useOpenStatus(showroom: PublicShowroom): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(openStatusAt(showroom, new Date()));
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, [showroom]);
  return status;
}
