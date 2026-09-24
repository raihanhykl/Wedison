"use client";

import { useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { StationStatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { api } from "@/lib/admin/api";
import { useDebounce } from "@/hooks/use-debounce";
import { STATION_STATUS_LABEL, STATION_TIER_LABEL, type Paginated, type Station, type StationStatus } from "@/lib/admin/types";

// Modul SuperCharge — iterasi 1: daftar & pencarian (API CRUD sudah tersedia di backend).
// Form tambah/edit + peta pemilih koordinat menyusul di iterasi modul SuperCharge.
export function StationsView() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | StationStatus>("all");
  const dq = useDebounce(q);

  const { data, isLoading } = useQuery({
    queryKey: ["stations", { page, limit, q: dq, status }],
    queryFn: () => api<Paginated<Station>>("/admin/stations", { query: { page, limit, q: dq, status: status === "all" ? undefined : status, sort: "name", order: "asc" } }),
    placeholderData: keepPreviousData,
  });

  const columns = useMemo<ColumnDef<Station, unknown>[]>(() => [
    { id: "id", header: "Kode", size: 90, cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span> },
    { id: "name", header: "Lokasi", cell: ({ row }) => (<div className="min-w-[240px]"><p className="font-medium">{row.original.name}</p><p className="line-clamp-1 text-xs text-muted-foreground">{row.original.city}, {row.original.province}</p></div>) },
    { id: "status", header: "Status", size: 110, cell: ({ row }) => <StationStatusBadge status={row.original.status} /> },
    { id: "tier", header: "Tipe", size: 100, cell: ({ row }) => <Badge variant="outline">{STATION_TIER_LABEL[row.original.tier]}</Badge> },
    { id: "capacity", header: "Charger", size: 90, cell: ({ row }) => <span className="font-mono text-xs">{row.original.pilesTotal * 2} <span className="text-muted-foreground">({row.original.pilesTotal} pile)</span></span> },
    { id: "power", header: "Daya", size: 80, cell: ({ row }) => <span className="font-mono text-xs">{row.original.powerKw} kW</span> },
    { id: "hours", header: "Jam", size: 110, cell: ({ row }) => <span className="text-xs">{row.original.hours}</span> },
  ], []);

  return (
    <>
      <PageHeader title="Lokasi SuperCharge" description="Data lokasi yang tampil di peta /super-charge/lokasi." />
      <Alert>
        <MapPin className="size-4" />
        <AlertTitle>Modul SuperCharge — tahap 1</AlertTitle>
        <AlertDescription>Daftar & pencarian sudah aktif dan API CRUD tersedia. Form tambah/edit lokasi dengan pemilih koordinat di peta dikerjakan di iterasi berikutnya.</AlertDescription>
      </Alert>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Cari nama / kota / kode…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="sm:max-w-xs" />
        <Select value={status} onValueChange={(v) => { setStatus(v as typeof status); setPage(1); }}>
          <SelectTrigger className="sm:w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua status</SelectItem>
            {(Object.keys(STATION_STATUS_LABEL) as StationStatus[]).map((s) => <SelectItem key={s} value={s}>{STATION_STATUS_LABEL[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={data?.items ?? []} loading={isLoading} meta={data?.meta} onPageChange={setPage} onLimitChange={(l) => { setLimit(l); setPage(1); }} emptyState={<EmptyState icon={MapPin} title="Tidak ada lokasi" />} />
    </>
  );
}
