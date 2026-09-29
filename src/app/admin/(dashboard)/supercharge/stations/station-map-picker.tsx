"use client";

import { useEffect, useRef, useState } from "react";
import Map, { Marker, NavigationControl, type MapRef, type MapLayerMouseEvent } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LocateFixed, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAP_STYLE_URL, loadSageMapStyle } from "@/app/[locale]/super-charge/locations/map-style";

const INDONESIA = { longitude: 113.5, latitude: -2.2, zoom: 4 };

export type MapPickerProps = {
  lat: number | null;
  lng: number | null;
  onChange: (pos: { lat: number; lng: number }) => void;
};

/**
 * Pemilih koordinat: klik peta atau seret pin untuk mengisi lat/lng. Memakai style peta
 * yang sama dengan halaman publik /super-charge/locations agar admin melihat posisi persis
 * seperti pengunjung. Harus dimuat lewat dynamic({ ssr:false }) (MapLibre butuh window).
 */
export default function StationMapPicker({ lat, lng, onChange }: MapPickerProps) {
  const mapRef = useRef<MapRef>(null);
  const [style, setStyle] = useState<StyleSpecification | string>(MAP_STYLE_URL);
  useEffect(() => {
    let alive = true;
    loadSageMapStyle().then((s) => alive && setStyle(s)).catch(() => {});
    return () => { alive = false; };
  }, []);

  const has = lat !== null && lng !== null && Number.isFinite(lat) && Number.isFinite(lng);

  // Saat lat/lng diketik manual, ikuti ke posisi baru. Pin PERTAMA (dari kosong) -> zoom
  // ke level jalan, supaya klik/geser berikutnya presisi; setelah itu cukup geser tengah.
  const hadPin = useRef(has);
  useEffect(() => {
    const m = mapRef.current;
    if (!has || !m) { hadPin.current = has; return; }
    const c = m.getCenter();
    const moved = Math.abs(c.lat - lat!) > 1e-6 || Math.abs(c.lng - lng!) > 1e-6;
    if (!hadPin.current || m.getZoom() < 10) m.flyTo({ center: [lng!, lat!], zoom: 15, duration: 600 });
    else if (moved) m.easeTo({ center: [lng!, lat!], duration: 300 });
    hadPin.current = true;
  }, [has, lat, lng]);

  const set = (e: { lngLat: { lat: number; lng: number } }) => onChange({ lat: +e.lngLat.lat.toFixed(6), lng: +e.lngLat.lng.toFixed(6) });

  const locate = () => {
    navigator.geolocation?.getCurrentPosition(
      (p) => {
        onChange({ lat: +p.coords.latitude.toFixed(6), lng: +p.coords.longitude.toFixed(6) });
        mapRef.current?.flyTo({ center: [p.coords.longitude, p.coords.latitude], zoom: 15, duration: 800 });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-lg border border-border">
      <Map
        ref={mapRef}
        mapStyle={style}
        initialViewState={has ? { longitude: lng!, latitude: lat!, zoom: 14 } : INDONESIA}
        onClick={(e: MapLayerMouseEvent) => set(e)}
        cursor="crosshair"
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {has && (
          <Marker longitude={lng!} latitude={lat!} anchor="bottom" draggable onDragEnd={set}>
            <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/25">
              <MapPin className="size-5" />
            </div>
          </Marker>
        )}
      </Map>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2">
        <span className="rounded-md bg-background/90 px-2 py-1 text-[11px] text-muted-foreground shadow-sm">
          {has ? "Drag the pin or click the map to adjust" : "Click the map to place the pin"}
        </span>
        <Button type="button" size="sm" variant="outline" className="pointer-events-auto bg-background/95" onClick={locate}>
          <LocateFixed /> My location
        </Button>
      </div>
    </div>
  );
}
