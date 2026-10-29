"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

/** Cabang untuk label & filter di admin Leads (termasuk yang sudah tutup). */
export type ShowroomOption = { id: string; name: string; city: string; status: string; timeZone: string; tzLabel: string };

export function useShowroomOptions() {
  return useQuery({
    queryKey: ["leads-showrooms"],
    queryFn: () => api<{ items: ShowroomOption[] }>("/admin/leads/showrooms").then((r) => r.items),
    staleTime: 5 * 60_000,
  });
}

/** Label & zona waktu cabang; kode yang tidak dikenal (cabang terhapus) ditampilkan apa adanya. */
export function useShowroomLabels() {
  const { data } = useShowroomOptions();
  return useMemo(() => {
    const map = new Map((data ?? []).map((s) => [s.id, s]));
    return {
      options: data ?? [],
      name: (id: string) => map.get(id)?.name ?? id,
      tz: (id: string) => map.get(id)?.tzLabel ?? "",
    };
  }, [data]);
}
