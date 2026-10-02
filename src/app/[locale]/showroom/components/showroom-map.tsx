"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Map, {
  AttributionControl,
  Marker,
  NavigationControl,
  type MapRef,
} from "react-map-gl/maplibre";
import type { LngLatBoundsLike } from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAP_STYLE_URL, loadSageMapStyle } from "@/app/[locale]/super-charge/locations/map-style";

export type ShowroomPin = { id: string; name: string; lat: number; lng: number };

export type ShowroomMapProps = {
  pins: ShowroomPin[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

/**
 * Peta showroom satu negara. Tanpa pilihan -> semua cabang dimuat dalam satu bingkai
 * (fitBounds); ada pilihan -> terbang ke cabang tsb. Pin = tombol (bisa di-Tab), label
 * nama hanya muncul untuk pin aktif/hover supaya cabang yang berdekatan (Jakarta–Bekasi)
 * tidak saling tumpuk di zoom negara.
 */
export default function ShowroomMap({ pins, selectedId, onSelect }: ShowroomMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [hovered, setHovered] = useState<string | null>(null);
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

  const padding = useCallback(
    (base: number) => ({ top: base, left: base, right: base, bottom: base }),
    [],
  );

  const bounds = useCallback((): LngLatBoundsLike => {
    const lngs = pins.map((p) => p.lng);
    const lats = pins.map((p) => p.lat);
    return [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ];
  }, [pins]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded || pins.length === 0) return;
    const pin = pins.find((p) => p.id === selectedId);
    if (pin) {
      map.flyTo({
        center: [pin.lng, pin.lat],
        zoom: 13,
        duration: reduced ? 0 : 1100,
        padding: padding(24),
      });
    } else {
      map.fitBounds(bounds(), {
        padding: padding(56),
        maxZoom: 9,
        duration: reduced ? 0 : 900,
      });
    }
  }, [selectedId, loaded, pins, bounds, padding, reduced]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{ bounds: bounds(), fitBoundsOptions: { padding: padding(56), maxZoom: 9 } }}
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
      {/* Atribusi OSM wajib terlihat. */}
      <AttributionControl position="bottom-right" compact />
      <NavigationControl position="top-right" showCompass={false} />
      {pins.map((p) => {
        const active = p.id === selectedId;
        const showLabel = active || p.id === hovered;
        return (
          <Marker key={p.id} longitude={p.lng} latitude={p.lat} anchor="bottom">
            <button
              type="button"
              aria-label={p.name}
              aria-pressed={active}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(p.id);
              }}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(p.id)}
              onBlur={() => setHovered(null)}
              className={cn(
                "relative flex cursor-pointer flex-col items-center text-primary transition-transform duration-200",
                active ? "z-10 scale-110" : "hover:scale-110",
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
                className={cn("drop-shadow", active ? "h-9 w-9" : "h-8 w-8")}
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
