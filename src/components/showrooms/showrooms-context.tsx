"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PublicShowroom } from "@/lib/showrooms/showroom";

// Daftar showroom dari admin (diambil sekali di layout locale, server-side + ISR tag "showrooms"),
// dipakai komponen klien: form booking, halaman /showroom, halaman Kontak.
const ShowroomsContext = createContext<PublicShowroom[]>([]);

export function ShowroomsProvider({ showrooms, children }: { showrooms: PublicShowroom[]; children: ReactNode }) {
  return <ShowroomsContext.Provider value={showrooms}>{children}</ShowroomsContext.Provider>;
}

/** Semua showroom yang tampil di situs (OPEN, TEMPORARILY_CLOSED, COMING_SOON bila diaktifkan). */
export function useShowrooms() {
  return useContext(ShowroomsContext);
}

/** Showroom yang bisa dipilih di form booking. */
export function useBookableShowrooms() {
  return useShowrooms().filter((s) => s.bookable);
}

export function useShowroom(id: string | undefined | null) {
  const all = useShowrooms();
  return id ? all.find((s) => s.id === id) ?? null : null;
}
