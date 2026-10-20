"use client";

import { useEffect, useRef, useState } from "react";
import Map, {
  AttributionControl,
  Marker,
  NavigationControl,
  type MapRef,
} from "react-map-gl/maplibre";
import type { LngLatBoundsLike, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";
import {
  MAP_STYLE_URL,
  loadSageMapStyle,
} from "@/app/[locale]/super-charge/locations/map-style";
import { STATUS_META } from "@/app/[locale]/super-charge/locations/lib";
import type { LatLng, Site } from "@/app/[locale]/super-charge/locations/types";

export type HomeMapProps = {
  sites: Site[];
  /** Bingkai yang dituju saat tidak ada stasiun terpilih (area / sekitar pengguna). */
  bounds: LngLatBoundsLike;
  selectedId: string | null;
  hoveredId: string | null;
  userLoc: LatLng | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
};

const PAD = { top: 48, right: 48, bottom: 48, left: 48 };

/**
 * Peta ringkas beranda: semua pin selalu tampil, bingkai mengikuti area/pilihan.
 * Pin beroperasi = hijau brand & lebih besar; segera hadir = redup & kecil agar
 * stasiun aktif tetap paling menonjol di zoom rendah.
 */
export default function HomeMap({
  sites,
  bounds,
  selectedId,
  hoveredId,
  userLoc,
  onSelect,
  onHover,
}: HomeMapProps) {
  const { t } = useLanguage();
  const mapRef = useRef<MapRef>(null);
  const [loaded, setLoaded] = useState(false);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const [sageStyle, setSageStyle] = useState<StyleSpecification | null>(null);
  useEffect(() => {
    let alive = true;
    loadSageMapStyle()
      .then((s) => alive && setSageStyle(s))
      .catch(() => {
        /* fallback ke style asli */
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    const site = sites.find((s) => s.properties.id === selectedId);
    if (site) {
      const [lng, lat] = site.geometry.coordinates;
      map.flyTo({
        center: [lng, lat],
        zoom: 13,
        duration: reduced ? 0 : 900,
        essential: true,
      });
    } else {
      map.fitBounds(bounds, {
        padding: PAD,
        maxZoom: 12,
        duration: reduced ? 0 : 900,
        essential: true,
      });
    }
  }, [selectedId, bounds, sites, loaded, reduced]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        bounds,
        fitBoundsOptions: { padding: PAD, maxZoom: 12 },
      }}
      mapStyle={sageStyle ?? MAP_STYLE_URL}
      style={{ width: "100%", height: "100%" }}
      cooperativeGestures
      attributionControl={false}
      onLoad={(e) => {
        setLoaded(true);
        // Atribusi ringkas dimulai tertutup (tombol ⓘ) supaya tidak menutupi peta di mobile.
        e.target
          .getContainer()
          .querySelector(".maplibregl-ctrl-attrib.maplibregl-compact-show")
          ?.classList.remove("maplibregl-compact-show");
      }}
    >
      <AttributionControl position="bottom-right" compact />
      <NavigationControl position="top-right" showCompass={false} />

      {userLoc && (
        <Marker longitude={userLoc.lng} latitude={userLoc.lat} anchor="center">
          <span className="relative block h-4 w-4" aria-hidden>
            <span className="absolute inset-0 animate-ping rounded-full bg-sky-500/40" />
            <span className="absolute inset-0 rounded-full border-2 border-white bg-sky-500 shadow-md" />
          </span>
        </Marker>
      )}

      {sites.map((s) => {
        const p = s.properties;
        const [lng, lat] = s.geometry.coordinates;
        const active = p.id === selectedId;
        const showLabel = active || p.id === hoveredId;
        const operational = p.status === "operational";
        return (
          <Marker key={p.id} longitude={lng} latitude={lat} anchor="bottom">
            <button
              type="button"
              aria-label={`${p.name}, ${t(STATUS_META[p.status].labelKey)}`}
              aria-pressed={active}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(p.id);
              }}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(p.id)}
              onBlur={() => onHover(null)}
              className={cn(
                "relative flex cursor-pointer flex-col items-center rounded-full transition-transform duration-200 ease-[cubic-bezier(.16,1,.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                operational
                  ? "text-primary"
                  : p.status === "coming_soon"
                    ? "text-muted-foreground/70"
                    : STATUS_META[p.status].text,
                active || showLabel ? "z-10 scale-110" : "hover:scale-110",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-semibold text-background shadow-md transition-opacity duration-200",
                  showLabel ? "opacity-100" : "opacity-0",
                )}
              >
                {p.name}
              </span>
              <MapPin
                className={cn(
                  "drop-shadow",
                  operational ? "h-8 w-8" : "h-6 w-6",
                )}
                fill="currentColor"
                stroke="white"
                strokeWidth={1.5}
                aria-hidden
              />
            </button>
          </Marker>
        );
      })}
    </Map>
  );
}
