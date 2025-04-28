/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // Load the Leaflet library dynamically
    const loadLeaflet = async () => {
      // Only load if window is defined (client-side)
      if (typeof window !== "undefined") {
        // Add Leaflet CSS
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.integrity =
            "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          link.crossOrigin = "";
          document.head.appendChild(link);
        }

        // Import Leaflet
        const L = (await import("leaflet")).default;

        // Initialize map if it doesn't exist
        if (!mapInstanceRef.current && mapRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView(
            [latitude, longitude],
            zoom
          );

          // Add tile layer (OpenStreetMap)
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(mapInstanceRef.current);

          // Create a custom icon
          const customIcon = L.divIcon({
            html: `<div class="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          // Add marker
          markerRef.current = L.marker([latitude, longitude], {
            icon: customIcon,
          })
            .addTo(mapInstanceRef.current)
            .bindPopup("Wedison Showroom")
            .openPopup();
        } else if (mapInstanceRef.current) {
          // Update marker position if map already exists
          mapInstanceRef.current.setView([latitude, longitude], zoom);
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          }
        }
      }
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-md">
      <div ref={mapRef} className="w-full h-full z-10"></div>

      {/* Fallback while map is loading */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-0">
        <div className="flex flex-col items-center text-gray-500">
          <MapPin className="h-8 w-8 mb-2 text-teal-500 animate-bounce" />
          <p>Loading map...</p>
        </div>
      </div>
    </div>
  );
}
