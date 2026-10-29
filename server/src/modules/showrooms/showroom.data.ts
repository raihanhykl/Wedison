import { prisma } from "../../lib/prisma.js";
import type { Showroom } from "../../lib/prisma.js";
import { cached, invalidate, CacheTags } from "../../lib/cache.js";

// Akses data showroom yang dipakai lintas modul (booking, teaser, publik). Dicache per tag
// "showrooms" dan dibuang setiap kali admin menyimpan showroom.

export async function getShowroom(id: string): Promise<Showroom | null> {
  if (!id) return null;
  return cached(`showroom:${id}`, [CacheTags.showrooms], () => prisma.showroom.findUnique({ where: { id } }), 60);
}

export async function allShowrooms(): Promise<Showroom[]> {
  return cached("showroom:all", [CacheTags.showrooms], () => prisma.showroom.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }), 60);
}

/** Field teaser yang disalin dari showroom terkait (agar alamat/kontak tidak diketik dua kali). */
export function teaserFieldsFrom(s: Showroom) {
  return {
    showroomName: s.name,
    streetAddress: s.streetAddress,
    addressLocality: s.addressLocality,
    addressRegion: s.addressRegion,
    postalCode: s.postalCode,
    mapsUrl: s.mapsUrl,
    whatsapp: s.whatsapp,
    timeZone: s.timeZone,
    // Email teaser wajib; showroom tanpa email -> email teaser dipertahankan.
    ...(s.email ? { email: s.email } : {}),
  };
}

/**
 * Setelah showroom berubah: perbarui semua teaser yang terhubung. Jadwal teaser disimpan UTC,
 * jadi bila zona waktu showroom berubah jam lokalnya ikut bergeser — teaser tetap konsisten
 * dengan alamat showroom-nya. Mengembalikan jumlah teaser yang diperbarui.
 */
export async function syncLinkedTeasers(s: Showroom): Promise<number> {
  const r = await prisma.showroomTeaser.updateMany({ where: { showroomId: s.id }, data: teaserFieldsFrom(s) });
  if (r.count) invalidate([CacheTags.teasers]);
  return r.count;
}
