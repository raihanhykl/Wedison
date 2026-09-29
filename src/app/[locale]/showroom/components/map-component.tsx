"use client";

import { cn } from "@/lib/utils";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  title?: string;
  className?: string;
}

export default function MapComponent({
  latitude,
  longitude,
  zoom = 15,
  title = "Wedison Showroom Location",
  className,
}: MapComponentProps) {
  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&hl=id&output=embed`;

  return (
    <div
      className={cn(
        "relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-md bg-gray-100",
        className
      )}
    >
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
}
