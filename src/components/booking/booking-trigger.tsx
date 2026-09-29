"use client";

import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps, MouseEvent } from "react";
import { useBooking } from "./booking-context";
import type { BookingPrefill } from "./booking-context";

type Props = Omit<ComponentProps<"button">, "onClick"> &
  BookingPrefill & {
    /** Render ke elemen anak (mis. <Button>) alih-alih <button> sendiri. */
    asChild?: boolean;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  };

/**
 * Tombol pembuka modal booking. Contoh:
 *   <BookingTrigger purpose="testRide" source="navbar" className="...">Test Ride</BookingTrigger>
 *   <BookingTrigger asChild showroom="bekasi" source="showroom-card"><Button>Book a Visit</Button></BookingTrigger>
 */
export function BookingTrigger({
  asChild,
  showroom,
  purpose,
  source,
  onClick,
  type = "button",
  ...rest
}: Props) {
  const { openBooking } = useBooking();
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      type={asChild ? undefined : type}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        openBooking({ showroom, purpose, source });
      }}
      {...rest}
    />
  );
}
