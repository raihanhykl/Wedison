"use client";

import { useEffect, useRef } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";
import type { Site, LatLng } from "./types";
import { STATUS_META } from "./lib";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";
const INDONESIA = { longitude: 113.5, latitude: -2.2, zoom: 4.2 };

export type MapProps = {
  sites: Site[];
  selectedId: string | null;
  hoveredId: string | null;
  userLocation: LatLng | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
};

export default function SuperChargeMap({
  sites,
  selectedId,
  hoveredId,
  userLocation,
  onSelect,
  onHover,
}: MapProps) {
  const { t } = useLanguage();
  const mapRef = useRef<MapRef>(null);
  // Ref agar efek flyTo hanya terpicu saat SELEKSI berubah, bukan tiap kali `sites`
  // (=hasil filter/search/near-me) berganti referensi — mencegah peta "loncat" balik.
  const sitesRef = useRef(sites);
  sitesRef.current = sites;
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // flyTo site terpilih
  useEffect(() => {
    if (!selectedId) return;
    const s = sitesRef.current.find((x) => x.properties.id === selectedId);
    if (!s) return;
    mapRef.current?.flyTo({
      center: s.geometry.coordinates,
      zoom: 13,
      duration: reduced ? 0 : 1200,
    });
  }, [selectedId, reduced]);

  // flyTo lokasi user (near-me)
  useEffect(() => {
    if (!userLocation) return;
    mapRef.current?.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 11,
      duration: reduced ? 0 : 1200,
    });
  }, [userLocation, reduced]);

  const selected = sites.find((s) => s.properties.id === selectedId) ?? null;

  return (
    <Map
      ref={mapRef}
      initialViewState={INDONESIA}
      mapStyle={MAP_STYLE}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="top-right" showCompass={false} />

      {/* Lokasi user */}
      {userLocation && (
        <Marker
          longitude={userLocation.lng}
          latitude={userLocation.lat}
          anchor="center"
        >
          <span className="relative flex h-4 w-4" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-500/60" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-sky-500 shadow" />
          </span>
        </Marker>
      )}

      {/* Pin lokasi SuperCharge */}
      {sites.map((s) => {
        const p = s.properties;
        const active = p.id === selectedId || p.id === hoveredId;
        return (
          <Marker
            key={p.id}
            longitude={s.geometry.coordinates[0]}
            latitude={s.geometry.coordinates[1]}
            anchor="bottom"
          >
            <button
              type="button"
              aria-label={`${p.name} — ${t(STATUS_META[p.status].labelKey)}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(p.id);
              }}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              className={cn(
                "grid cursor-pointer place-items-center transition-transform duration-200",
                active ? "z-10 scale-125" : "hover:scale-110",
              )}
              style={{ color: STATUS_META[p.status].marker }}
            >
              <MapPin
                className={cn("drop-shadow", active ? "h-8 w-8" : "h-7 w-7")}
                fill="currentColor"
                stroke="white"
                strokeWidth={1.5}
              />
            </button>
          </Marker>
        );
      })}

      {/* Label ringkas untuk pin terpilih */}
      {selected && (
        <Popup
          longitude={selected.geometry.coordinates[0]}
          latitude={selected.geometry.coordinates[1]}
          anchor="bottom"
          offset={34}
          closeButton={false}
          closeOnClick={false}
          className="[&_.maplibregl-popup-content]:rounded-lg [&_.maplibregl-popup-content]:px-3 [&_.maplibregl-popup-content]:py-1.5 [&_.maplibregl-popup-content]:shadow-lg"
        >
          <span className="text-xs font-semibold text-foreground">
            {selected.properties.name}
          </span>
        </Popup>
      )}
    </Map>
  );
}
