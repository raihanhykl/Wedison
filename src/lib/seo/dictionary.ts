// Akses kamus terjemahan dari SERVER COMPONENT (generateMetadata, JSON-LD) tanpa membawa
// seluruh kamus ke bundle client: hanya locale yang diminta yang di-import (dinamis).
import "server-only";
import { isValidElement, type ReactNode } from "react";
import type { Locale } from "@/app/lib/locale";

export type Dictionary = Record<string, unknown>;

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  return locale === "en"
    ? ((await import("@/app/lib/dictionaries/en")).en as Dictionary)
    : ((await import("@/app/lib/dictionaries/id")).id as Dictionary);
}

/**
 * Ratakan nilai kamus (string, angka, atau JSX seperti <>...<Link/></>) menjadi teks polos.
 * Dipakai untuk schema.org (FAQ answer, spesifikasi) yang harus berupa string.
 */
export function toText(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    const el = node.type === "br" ? "\n" : "";
    return el + toText(props.children);
  }
  return "";
}

/** Teks kamus untuk `key`, dirapikan (spasi ganda dihapus). Kosong bila kunci tidak ada. */
export function dictText(dict: Dictionary, key: string): string {
  const v = dict[key];
  if (v === undefined) return "";
  return toText(v).replace(/[ \t]+/g, " ").trim();
}
