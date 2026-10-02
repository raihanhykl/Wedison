"use client";

import { useEffect, useState } from "react";
import { SHOWROOMS, type ShowroomId } from "@/lib/booking/showrooms";
import { isWeekend, minutesToTime, nowInTimeZone } from "@/lib/booking/slots";

export type OpenStatus = {
  open: boolean;
  /** "19.00" saat buka (jam tutup), atau jam buka berikutnya saat tutup. */
  time: string;
};

/** Status buka/tutup cabang menurut jam & zona waktunya sendiri (WIB/WITA). */
export function openStatusAt(id: ShowroomId, now: Date): OpenStatus {
  const s = SHOWROOMS[id];
  const { ymd, minutes } = nowInTimeZone(s.timeZone, now);
  const today = isWeekend(ymd) ? s.hours.weekend : s.hours.weekday;
  const dot = (min: number) => minutesToTime(min).replace(":", ".");
  if (minutes >= today.open && minutes < today.close) {
    return { open: true, time: dot(today.close) };
  }
  // Sebelum buka -> buka hari ini; setelah tutup -> buka besok. Semua hari buka jam yang
  // sama, jadi jam buka weekday cukup sebagai "berikutnya".
  return { open: false, time: dot(minutes < today.open ? today.open : s.hours.weekday.open) };
}

/**
 * Dihitung setelah mount (null saat SSR) supaya HTML server tidak memuat status yang basi
 * dan tidak terjadi hydration mismatch. Diperbarui tiap menit.
 */
export function useOpenStatus(id: ShowroomId): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(openStatusAt(id, new Date()));
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, [id]);
  return status;
}
