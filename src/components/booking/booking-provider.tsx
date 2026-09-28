"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { trackBookingOpen } from "@/lib/booking/analytics";
import { BookingContext, type BookingPrefill } from "./booking-context";

// Dialog + form (react-hook-form, day-picker, dsb.) hanya diunduh saat pertama kali dibuka,
// supaya tidak membebani bundle awal landing page.
const BookingDialog = dynamic(() => import("./booking-dialog"), { ssr: false });

/**
 * Satu modal booking untuk seluruh situs. Tombol mana pun ("Test Ride" di navbar/landing,
 * "Book a Visit" di kartu showroom) cukup memanggil openBooking({...prefill}).
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({ source: "other" });
  // Naikkan key setiap kali dibuka -> form selalu mulai bersih dengan prefill terbaru.
  const [session, setSession] = useState(0);

  const openBooking = useCallback(
    (next: BookingPrefill) => {
      setPrefill(next);
      setSession((s) => s + 1);
      setMounted(true);
      setOpen(true);
      trackBookingOpen({
        source: next.source,
        purpose: next.purpose,
        showroom: next.showroom,
        locale: language,
      });
    },
    [language],
  );

  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openBooking, closeBooking, isOpen: open }),
    [openBooking, closeBooking, open],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      {mounted && (
        <BookingDialog key={session} open={open} onOpenChange={setOpen} prefill={prefill} />
      )}
    </BookingContext.Provider>
  );
}
