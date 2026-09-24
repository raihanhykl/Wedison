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

// SuperCharge module — iteration 1: list & search (the CRUD API already exists in the backend).
// Add/edit form with a map coordinate picker follows in the SuperCharge iteration.
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
    { id: "id", header: "Code", size: 90, cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span> },
    { id: "name", header: "Station", cell: ({ row }) => (<div className="min-w-[240px]"><p className="font-medium">{row.original.name}</p><p className="line-clamp-1 text-xs text-muted-foreground">{row.original.city}, {row.original.province}</p></div>) },
    { id: "status", header: "Status", size: 110, cell: ({ row }) => <StationStatusBadge status={row.original.status} /> },
    { id: "tier", header: "Tier", size: 100, cell: ({ row }) => <Badge variant="outline">{STATION_TIER_LABEL[row.original.tier]}</Badge> },
    { id: "capacity", header: "Chargers", size: 90, cell: ({ row }) => <span className="font-mono text-xs">{row.original.pilesTotal * 2} <span className="text-muted-foreground">({row.original.pilesTotal} pile)</span></span> },
    { id: "power", header: "Power", size: 80, cell: ({ row }) => <span className="font-mono text-xs">{row.original.powerKw} kW</span> },
    { id: "hours", header: "Hours", size: 110, cell: ({ row }) => <span className="text-xs">{row.original.hours}</span> },
  ], []);

  return (
    <>
      <PageHeader title="SuperCharge Stations" description="Station data shown on the /super-charge/lokasi map." />
      <Alert>
        <MapPin className="size-4" />
        <AlertTitle>SuperCharge module — phase 1</AlertTitle>
        <AlertDescription>List and search are live and the CRUD API is ready. The add/edit form with a map coordinate picker is planned for the next iteration.</AlertDescription>
      </Alert>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Search name / city / code…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="sm:max-w-xs" />
        <Select value={status} onValueChange={(v) => { setStatus(v as typeof status); setPage(1); }}>
          <SelectTrigger className="sm:w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(STATION_STATUS_LABEL) as StationStatus[]).map((s) => <SelectItem key={s} value={s}>{STATION_STATUS_LABEL[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={data?.items ?? []} loading={isLoading} meta={data?.meta} onPageChange={setPage} onLimitChange={(l) => { setLimit(l); setPage(1); }} emptyState={<EmptyState icon={MapPin} title="No stations" />} />
    </>
  );
}
