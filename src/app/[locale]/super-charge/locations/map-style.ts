import type { StyleSpecification } from "maplibre-gl";

/**
 * Style peta "Sage" — basis OpenFreeMap `positron` (abu netral) yang di-patch ke palet
 * Wedison: darat sage sangat muda, air hijau-teal redup, hutan/park sage lebih pekat.
 * Sengaja MINIM warna: hanya darat/air/vegetasi yang di-tint; jalan & label tetap netral
 * supaya pin hijau brand tetap jadi elemen paling menonjol.
 */
export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/** id layer -> warna baru (hex). Ikut nama layer positron (diverifikasi dari style JSON). */
const LAND = "#F4F6F1"; // Snow ber-tint sage (darat)
const LAND_RESIDENTIAL = "#EDF0EA";
const PARK = "#E1E9DE"; // sage muda
const WOOD = "#D8E3D5"; // sage sedikit lebih pekat
const WATER = "#C3D4CD"; // hijau-teal redup (bukan biru terang)
const WATERWAY = "#B4C8C1";
const BUILDING_FILL = "#E9EBE5";
const BUILDING_OUTLINE = "#DCE0D8";

const FILL: Record<string, string> = {
  park: PARK,
  water: WATER,
  landcover_wood: WOOD,
  landuse_residential: LAND_RESIDENTIAL,
  building: BUILDING_FILL,
  road_area_pier: LAND,
};

const LINE: Record<string, string> = {
  waterway: WATERWAY,
  road_pier: LAND,
};

/**
 * Ambil style positron lalu patch warnanya. Dipanggil client-side sekali saat peta mount;
 * bila fetch gagal, pemanggil fallback ke URL style asli (peta tetap tampil).
 */
export async function loadSageMapStyle(): Promise<StyleSpecification> {
  const res = await fetch(MAP_STYLE_URL);
  if (!res.ok) throw new Error(`Gagal memuat style peta: ${res.status}`);
  const style = (await res.json()) as StyleSpecification;

  for (const layer of style.layers) {
    if (layer.type === "background") {
      layer.paint = { ...layer.paint, "background-color": LAND };
      continue;
    }
    if (layer.type === "fill" && layer.id in FILL) {
      layer.paint = {
        ...layer.paint,
        "fill-color": FILL[layer.id],
        ...(layer.id === "building"
          ? { "fill-outline-color": BUILDING_OUTLINE }
          : {}),
      };
      continue;
    }
    if (layer.type === "line" && layer.id in LINE) {
      layer.paint = { ...layer.paint, "line-color": LINE[layer.id] };
    }
  }

  return style;
}
