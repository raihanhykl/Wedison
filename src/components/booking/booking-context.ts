"use client";

import { createContext, useContext } from "react";
import type { ShowroomId } from "@/lib/booking/showrooms";
import type { BookingPurpose, BookingSource } from "@/lib/booking/schema";

export type BookingPrefill = {
  /** Terisi otomatis bila dibuka dari kartu showroom tertentu. */
  showroom?: ShowroomId;
  /** Terisi otomatis bila dibuka dari tombol "Test Ride". */
  purpose?: BookingPurpose;
  /** Asal klik, untuk analytics (dataLayer). */
  source: BookingSource;
};

export type BookingContextValue = {
  openBooking: (prefill: BookingPrefill) => void;
  closeBooking: () => void;
  isOpen: boolean;
};

export const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking harus dipakai di dalam <BookingProvider>");
  return ctx;
}
