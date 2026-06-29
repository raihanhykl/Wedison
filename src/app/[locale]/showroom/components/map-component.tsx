"use client";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export default function MapComponent({
  latitude,
  longitude,
  zoom = 15,
}: MapComponentProps) {
  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&hl=id&output=embed`;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-md">
      <iframe
        title="Wedison Showroom Location"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
}
