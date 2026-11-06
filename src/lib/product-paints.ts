// Katalog warna cat per model — sumber tunggal untuk color picker halaman produk dan
// JSON-LD (`Product.color`). Data murni (tanpa React), aman diimpor dari server maupun client.
//
// Aset: public/paints/<model>-<warna>-<finish>.webp — cutout transparan dengan framing yang
// SAMA untuk semua warna dalam satu model (posisi & skala motor identik). Itu yang membuat
// transisi "sapuan cat" di picker rapi; aset baru wajib mengikuti framing yang sama.
//
// `hex` hanya untuk swatch (diambil dari piksel dominan bodi di gambar), bukan token tema.
import type { ProductId } from "@/lib/pricing/types";

export type PaintFinish = "glossy" | "matte";

export type Paint = {
  /** Slug stabil, dipakai di URL (?color=) dan analytics. Jangan diubah setelah rilis. */
  slug: string;
  name: { id: string; en: string };
  hex: string;
  finish: PaintFinish;
  src: string;
};

export type ModelPaints = {
  /** Rasio intrinsik gambar (lebar / tinggi); seragam untuk semua warna satu model. */
  aspectRatio: number;
  /** Urutan = urutan swatch; elemen pertama jadi warna default. */
  paints: readonly Paint[];
};

const paint = (model: ProductId, slug: string, id: string, en: string, hex: string, finish: PaintFinish = "glossy", file = slug): Paint => ({
  slug,
  name: { id, en },
  hex,
  finish,
  src: `/paints/${model}-${file}-${finish}.webp`,
});

export const PRODUCT_PAINTS: Record<ProductId, ModelPaints> = {
  athena: {
    aspectRatio: 1100 / 924,
    paints: [
      paint("athena", "green", "Hijau", "Green", "#7a8058"),
      paint("athena", "yellow", "Kuning", "Yellow", "#fbd003"),
      paint("athena", "pink", "Pink", "Pink", "#f98ab5"),
      paint("athena", "white", "Putih", "White", "#eceef1"),
      paint("athena", "black", "Hitam", "Black", "#18191b"),
    ],
  },
  bees: {
    aspectRatio: 1100 / 1005,
    paints: [
      paint("bees", "red", "Merah", "Red", "#b5020a"),
      paint("bees", "white", "Putih", "White", "#f1f1f1"),
      paint("bees", "grey", "Abu-abu", "Grey", "#67686c"),
      paint("bees", "black", "Hitam", "Black", "#19191a"),
    ],
  },
  edpower: {
    aspectRatio: 1100 / 924,
    paints: [
      paint("edpower", "navy", "Biru Navy", "Navy Blue", "#031a49"),
      paint("edpower", "red", "Merah", "Red", "#ab0209"),
      paint("edpower", "white", "Putih", "White", "#eeeff0"),
      paint("edpower", "grey", "Abu-abu", "Grey", "#4a4f57"),
      paint("edpower", "black", "Hitam", "Black", "#161616"),
    ],
  },
  victory: {
    aspectRatio: 1100 / 1042,
    paints: [
      paint("victory", "red", "Merah", "Red", "#bc0105"),
      paint("victory", "silver", "Silver", "Silver", "#aeb0b3"),
      paint("victory", "white", "Putih", "White", "#eceef0"),
      paint("victory", "black", "Hitam", "Black", "#121314"),
      // Nama sama dengan hitam glossy; pembedanya label finish (Glossy/Doff) di picker.
      paint("victory", "black-matte", "Hitam", "Black", "#2e2e2f", "matte", "black"),
    ],
  },
};

export function paintsFor(model: ProductId): ModelPaints {
  return PRODUCT_PAINTS[model];
}

/** Nama warna untuk JSON-LD `Product.color`; finish doff disebut agar tiap nama unik. */
export function paintNames(model: ProductId, locale: "id" | "en"): string[] {
  return PRODUCT_PAINTS[model].paints.map((p) => {
    const name = p.name[locale];
    if (p.finish !== "matte") return name;
    return locale === "en" ? `Matte ${name}` : `${name} Doff`;
  });
}
