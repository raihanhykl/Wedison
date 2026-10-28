"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import type { ContactSourceOption } from "./types";

/** Sumber pesan kontak + label yang bisa dibaca ("Contact page", "Teaser: Surabaya"). */
export function useContactSources() {
  return useQuery({
    queryKey: ["contact-sources"],
    queryFn: () => api<{ items: ContactSourceOption[] }>("/admin/leads/contacts/sources").then((r) => r.items),
    staleTime: 60_000,
  });
}

/** Label sumber; null = data lama dari halaman Kontak. */
export function sourceLabel(options: ContactSourceOption[] | undefined, source: string | null) {
  const key = source ?? "contact-page";
  return options?.find((o) => o.value === key)?.label ?? (key === "contact-page" ? "Contact page" : key.startsWith("teaser-") ? "Teaser" : key);
}
