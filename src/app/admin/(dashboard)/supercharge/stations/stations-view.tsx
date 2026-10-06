"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { toast } from "sonner";
import { Eye, EyeOff, ExternalLink, MapPin, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { StationStatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useCan } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import { timeAgo } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { STATION_STATUS_LABEL, STATION_TIER_LABEL, type Paginated, type Station, type StationStatus, type StationTier, type StationsMeta } from "@/lib/admin/types";
import { StationForm } from "./station-form";

const STATUSES = Object.keys(STATION_STATUS_LABEL) as StationStatus[];
const TIERS = Object.keys(STATION_TIER_LABEL) as StationTier[];
type BulkAction = "status" | "activate" | "deactivate" | "delete";

const mapsUrl = (s: Station) => `https://www.google.com/maps?q=${s.lat},${s.lng}`;

export function StationsView() {
  const qc = useQueryClient();
  const can = useCan("supercharge");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | StationStatus>("all");
  const [tier, setTier] = useState<"all" | StationTier>("all");
  const [active, setActive] = useState<"all" | "true" | "false">("all");
  const [province, setProvince] = useState("all");
  const [selection, setSelection] = useState<RowSelectionState>({});
  const [editing, setEditing] = useState<Station | "new" | null>(null);
  const [confirm, setConfirm] = useState<{ ids: string[]; label: string } | null>(null);
  const [bulkStatus, setBulkStatus] = useState<StationStatus>("OPERATIONAL");
  const dq = useDebounce(q);

  const query = { page, limit, q: dq, status: status === "all" ? undefined : status, tier: tier === "all" ? undefined : tier, active: active === "all" ? undefined : active, province: province === "all" ? undefined : province, sort: "name", order: "asc" as const };
  const { data, isLoading } = useQuery({
    queryKey: ["stations", query],
    queryFn: () => api<Paginated<Station>>("/admin/stations", { query }),
    placeholderData: keepPreviousData,
  });
  const { data: meta } = useQuery({ queryKey: ["stations-meta"], queryFn: () => api<{ data: StationsMeta }>("/admin/stations/meta").then((r) => r.data) });

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["stations"] }); qc.invalidateQueries({ queryKey: ["stations-meta"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); };
  const bulk = useMutation({
    mutationFn: (v: { ids: string[]; action: BulkAction; status?: StationStatus }) => api<{ count: number }>("/admin/stations/bulk", { method: "POST", body: v }),
    onSuccess: (r, v) => {
      const what = v.action === "status" ? `Status set to ${STATION_STATUS_LABEL[v.status!]}` : v.action === "activate" ? "Shown on the map" : v.action === "deactivate" ? "Hidden from the map" : "Deleted";
      toast.success(`${what} · ${r.count} station${r.count === 1 ? "" : "s"}`);
      setSelection({}); setConfirm(null); invalidate();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const selectedIds = Object.keys(selection).filter((k) => selection[k]);

  const columns = useMemo<ColumnDef<Station, unknown>[]>(() => [
    {
      id: "select", size: 36,
      header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)} aria-label="Select all" />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Select row" />,
    },
    { id: "id", header: "Code", size: 90, cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span> },
    {
      id: "name", header: "Station",
      cell: ({ row }) => {
        const s = row.original;
        return (
          <button type="button" onClick={() => setEditing(s)} className="flex min-w-[260px] items-center gap-3 text-left">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              {s.photoUrl ? <Image src={s.photoUrl} alt="" fill sizes="40px" className="object-cover" unoptimized /> : <MapPin className="absolute inset-0 m-auto size-4 text-muted-foreground" />}
            </div>
            <div className="min-w-0">
              <p className={cn("truncate font-medium", !s.isActive && "text-muted-foreground")}>{s.name}</p>
              <p className="line-clamp-1 text-xs text-muted-foreground">{s.city}, {s.province}</p>
            </div>
          </button>
        );
      },
    },
    { id: "status", header: "Status", size: 120, cell: ({ row }) => <StationStatusBadge status={row.original.status} /> },
    { id: "tier", header: "Tier", size: 96, cell: ({ row }) => <Badge variant="outline">{STATION_TIER_LABEL[row.original.tier]}</Badge> },
    { id: "capacity", header: "Chargers", size: 100, cell: ({ row }) => <span className="font-mono text-xs">{row.original.pilesTotal * 2} <span className="text-muted-foreground">({row.original.pilesTotal} pile)</span></span> },
    { id: "power", header: "Power", size: 80, cell: ({ row }) => <span className="font-mono text-xs">{row.original.powerKw} kW</span> },
    {
      id: "visible", header: "Map", size: 80,
      cell: ({ row }) => row.original.isActive
        ? <span className="inline-flex items-center gap-1 text-xs text-primary"><Eye className="size-3.5" /> Shown</span>
        : <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><EyeOff className="size-3.5" /> Hidden</span>,
    },
    { id: "updated", header: "Updated", size: 110, cell: ({ row }) => <span className="text-xs text-muted-foreground">{timeAgo(row.original.updatedAt)}</span> },
    {
      id: "actions", header: "", size: 48,
      cell: ({ row }) => {
        const s = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label="Actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => setEditing(s)}><Pencil /> Edit</DropdownMenuItem>
              <DropdownMenuItem asChild><a href={mapsUrl(s)} target="_blank" rel="noreferrer"><ExternalLink /> Open in Google Maps</a></DropdownMenuItem>
              <DropdownMenuItem asChild><a href="/id/super-charge/locations/" target="_blank" rel="noreferrer"><MapPin /> View public map</a></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Set status</DropdownMenuLabel>
              {STATUSES.filter((st) => st !== s.status).map((st) => (
                <DropdownMenuItem key={st} onClick={() => bulk.mutate({ ids: [s.id], action: "status", status: st })}>{STATION_STATUS_LABEL[st]}</DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {s.isActive
                ? <DropdownMenuItem onClick={() => bulk.mutate({ ids: [s.id], action: "deactivate" })}><EyeOff /> Hide from map</DropdownMenuItem>
                : <DropdownMenuItem onClick={() => bulk.mutate({ ids: [s.id], action: "activate" })}><Eye /> Show on map</DropdownMenuItem>}
              {can.deleteHard && (<><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setConfirm({ ids: [s.id], label: `${s.id} · ${s.name}` })}><Trash2 /> Delete</DropdownMenuItem></>)}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [bulk, can.deleteHard]);

  const counts = meta?.byStatus;

  return (
    <>
      <PageHeader
        title="SuperCharge Stations"
        description="Stations shown on the public /super-charge/locations map. Changes are published immediately."
        actions={<Button onClick={() => setEditing("new")}><Plus /> Add station</Button>}
      />

      {meta && (
        <div className="flex flex-wrap gap-2 text-xs">
          {STATUSES.map((s) => (
            <button key={s} type="button" onClick={() => { setStatus(status === s ? "all" : s); setPage(1); }} className={cn("rounded-full border px-3 py-1 transition-colors", status === s ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground")}>
              {STATION_STATUS_LABEL[s]} <span className="font-mono">{counts?.[s] ?? 0}</span>
            </button>
          ))}
          <span className="self-center text-muted-foreground">· {meta.total} total{meta.inactive ? `, ${meta.inactive} hidden` : ""}</span>
        </div>
      )}

      <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap">
        <Input placeholder="Search name / city / address / code…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="lg:max-w-xs" />
        <Select value={status} onValueChange={(v) => { setStatus(v as typeof status); setPage(1); }}>
          <SelectTrigger className="lg:w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All statuses</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s}>{STATION_STATUS_LABEL[s]}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={tier} onValueChange={(v) => { setTier(v as typeof tier); setPage(1); }}>
          <SelectTrigger className="lg:w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All tiers</SelectItem>{TIERS.map((t) => <SelectItem key={t} value={t}>{STATION_TIER_LABEL[t]}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={province} onValueChange={(v) => { setProvince(v); setPage(1); }}>
          <SelectTrigger className="lg:w-[170px]"><SelectValue placeholder="Province" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All provinces</SelectItem>{meta?.provinces.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={active} onValueChange={(v) => { setActive(v as typeof active); setPage(1); }}>
          <SelectTrigger className="lg:w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Shown + hidden</SelectItem><SelectItem value="true">Shown on map</SelectItem><SelectItem value="false">Hidden</SelectItem></SelectContent>
        </Select>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <span className="font-medium">{selectedIds.length} selected</span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Select value={bulkStatus} onValueChange={(v) => setBulkStatus(v as StationStatus)}>
              <SelectTrigger className="h-8 w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{STATION_STATUS_LABEL[s]}</SelectItem>)}</SelectContent>
            </Select>
            <Button size="sm" variant="outline" disabled={bulk.isPending} onClick={() => bulk.mutate({ ids: selectedIds, action: "status", status: bulkStatus })}>Set status</Button>
            <Button size="sm" variant="outline" disabled={bulk.isPending} onClick={() => bulk.mutate({ ids: selectedIds, action: "activate" })}><Eye /> Show</Button>
            <Button size="sm" variant="outline" disabled={bulk.isPending} onClick={() => bulk.mutate({ ids: selectedIds, action: "deactivate" })}><EyeOff /> Hide</Button>
            {can.deleteHard && <Button size="sm" variant="destructive" disabled={bulk.isPending} onClick={() => setConfirm({ ids: selectedIds, label: `${selectedIds.length} stations` })}><Trash2 /> Delete</Button>}
            <Button size="sm" variant="ghost" onClick={() => setSelection({})}>Clear</Button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        getRowId={(s) => s.id}
        emptyState={<EmptyState icon={MapPin} title="No stations" description="Add your first SuperCharge station to show it on the public map." action={<Button onClick={() => setEditing("new")}><Plus /> Add station</Button>} />}
      />

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-2xl">
          {editing && <StationForm key={editing === "new" ? "new" : editing.id} station={editing === "new" ? null : editing} meta={meta} onDone={() => { setEditing(null); invalidate(); }} />}
        </SheetContent>
      </Sheet>
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Delete station?"
        description={confirm ? `${confirm.label} will be removed from the public map permanently.` : undefined}
        loading={bulk.isPending}
        onConfirm={() => { if (confirm) bulk.mutate({ ids: confirm.ids, action: "delete" }); }}
      />
    </>
  );
}
