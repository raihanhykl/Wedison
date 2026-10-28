import type { ImageSlot, PublicTeaser, TeaserContent, TeaserFacts, TeaserLocale } from "@/lib/teasers/teaser";

/** Semua yang dibutuhkan section halaman teaser: data mentah + wording yang tokennya sudah diisi. */
export type TeaserView = {
  locale: TeaserLocale;
  teaser: PublicTeaser;
  /** wording bahasa aktif, token ({city}, {date}, …) sudah diganti */
  c: TeaserContent;
  facts: TeaserFacts;
  /** URL gambar efektif (slot kosong -> gambar default) */
  images: Record<ImageSlot, string>;
  /** true = draft mode admin: form tidak mengirim apa pun */
  preview: boolean;
};
