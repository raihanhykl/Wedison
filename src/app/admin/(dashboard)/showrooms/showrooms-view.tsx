"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  CalendarCheck, CalendarX, Eye, EyeOff, ExternalLink, Megaphone, MoreHorizontal, Pencil, Plus, Store, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  SHOWROOM_STATUS_LABEL, ShowroomStatusBadge, useShowroomPermissions, visibilitySummary,
} from "@/components/admin/showrooms/shared";
import { ApiError, api, errorMessage } from "@/lib/admin/api";
import { timeAgo, formatDateTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import type { AdminShowroom, ShowroomStatus } from "@/lib/admin/types";

type Filter = "all" | ShowroomStatus;
const STATUSES: ShowroomStatus[] = ["OPEN", "COMING_SOON", "TEMPORARILY_CLOSED", "CLOSED"];

/** Tanggal tutup khusus berikutnya (hari ini atau nanti) untuk kolom daftar. */
function nextClosure(s: AdminShowroom) {
  const today = new Date().toISOString().slice(0, 10);
  return [...s.closures].sort((a, b) => a.from.localeCompare(b.from)).find((c) => c.to >= today) ?? null;
}
const shortDate = (ymd: string) => new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export function ShowroomsView() {
  const qc = useQueryClient();
  const perm = useShowroomPermissions().data;
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [toDelete, setToDelete] = useState<AdminShowroom | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["showrooms"],
    queryFn: () => api<{ items: AdminShowroom[] }>("/admin/showrooms").then((r) => r.items),
  });
  const all = data ?? [];
  const counts = Object.fromEntries(STATUSES.map((s) => [s, all.filter((x) => x.status === s).length])) as Record<ShowroomStatus, number>;
  const rows = all.filter((s) => (filter === "all" || s.status === filter) && (!q.trim() || `${s.name} ${s.city} ${s.id} ${s.addressLocality}`.toLowerCase().includes(q.trim().toLowerCase())));

  const refresh = () => { qc.invalidateQueries({ queryKey: ["showrooms"] }); qc.invalidateQueries({ queryKey: ["leads-showrooms"] }); };
  const quick = useMutation({
    mutationFn: ({ id, ...body }: { id: string; status?: ShowroomStatus; isPublic?: boolean; bookable?: boolean }) =>
      api<{ data: AdminShowroom }>(`/admin/showrooms/${id}`, { method: "PATCH", body }).then((r) => r.data),
    onSuccess: (s) => { toast.success(`${s.name}: ${visibilitySummary(s).toLowerCase()}`); refresh(); },
    onError: (e) => {
      // Mis. menampilkan showroom tanpa alamat/titik peta: arahkan ke editor.
      if (e instanceof ApiError && e.details?.length) toast.error(e.message, { description: e.details.map((d) => `• ${d.message}`).join("\n") });
      else toast.error(errorMessage(e));
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/showrooms/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Showroom deleted"); setToDelete(null); refresh(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const columns = useMemo<ColumnDef<AdminShowroom, unknown>[]>(() => [
    {
      id: "showroom", header: "Showroom",
      cell: ({ row }) => {
        const s = row.original;
        return (
          <Link href={`/admin/showrooms/${s.id}`} className="flex min-w-[220px] items-center gap-3">
            <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
              {s.photoUrl ? <Image src={s.photoUrl} alt="" fill sizes="48px" className="object-cover" unoptimized /> : <Store className="absolute inset-0 m-auto size-5 text-muted-foreground" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium hover:underline">{s.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{s.addressLocality || s.city} · <span className="font-mono">{s.id}</span></span>
            </span>
          </Link>
        );
      },
    },
    { id: "status", header: "Status", size: 150, cell: ({ row }) => <ShowroomStatusBadge status={row.original.status} /> },
    {
      id: "site", header: "On the site", size: 170,
      cell: ({ row }) => {
        const s = row.original;
        return <span className={cn("text-sm", s.bookableNow ? "text-primary" : "text-muted-foreground")}>{visibilitySummary(s)}</span>;
      },
    },
    {
      id: "closure", header: "Next closure", size: 150,
      cell: ({ row }) => {
        const c = nextClosure(row.original);
        return c ? (
          <span className="inline-flex items-center gap-1.5 text-sm" title={c.note}>
            <CalendarX className="size-4 text-muted-foreground" /> {c.from === c.to ? shortDate(c.from) : `${shortDate(c.from)} – ${shortDate(c.to)}`}
          </span>
        ) : <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      id: "bookings", header: "Bookings", size: 120,
      cell: ({ row }) => {
        const b = row.original.bookings;
        return (
          <Link href={`/admin/leads/bookings?showroom=${row.original.id}&upcoming=1`} className="inline-flex items-center gap-1.5 text-sm hover:underline" title={`${b.total} in total`}>
            <CalendarCheck className="size-4 text-muted-foreground" /> {b.upcoming} upcoming
          </Link>
        );
      },
    },
    { id: "updated", header: "Updated", size: 110, cell: ({ row }) => <span className="text-xs text-muted-foreground" title={formatDateTime(row.original.updatedAt)}>{timeAgo(row.original.updatedAt)}</span> },
    {
      id: "actions", header: "", size: 48,
      cell: ({ row }) => {
        const s = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${s.name}`}><MoreHorizontal /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuItem asChild><Link href={`/admin/showrooms/${s.id}`}><Pencil /> {perm?.write ? "Edit" : "Open"}</Link></DropdownMenuItem>
              {s.visible && <DropdownMenuItem asChild><a href="/id/showroom/#lokasi" target="_blank" rel="noreferrer"><ExternalLink /> View on site</a></DropdownMenuItem>}
              {perm?.teasers && s.status === "COMING_SOON" && (
                <DropdownMenuItem asChild><Link href={`/admin/teasers/new?showroom=${s.id}`}><Megaphone /> Create opening teaser</Link></DropdownMenuItem>
              )}
              {perm?.write && (
                <>
                  <DropdownMenuSeparator />
                  {s.status === "OPEN" && (
                    <DropdownMenuItem onClick={() => quick.mutate({ id: s.id, bookable: !s.bookable })}>
                      <CalendarCheck /> {s.bookable ? "Turn booking off" : "Turn booking on"}
                    </DropdownMenuItem>
                  )}
                  {s.status !== "CLOSED" && (
                    <DropdownMenuItem onClick={() => quick.mutate({ id: s.id, isPublic: !s.isPublic })}>
                      {s.isPublic ? <><EyeOff /> Hide from the site</> : <><Eye /> Show on the site</>}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Change status</DropdownMenuLabel>
                  {STATUSES.filter((st) => st !== s.status).map((st) => (
                    <DropdownMenuItem key={st} onClick={() => quick.mutate({ id: s.id, status: st })}>{SHOWROOM_STATUS_LABEL[st]}</DropdownMenuItem>
                  ))}
                </>
              )}
              {perm?.delete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    disabled={s.bookings.total > 0}
                    onClick={() => setToDelete(s)}
                  >
                    <Trash2 /> {s.bookings.total > 0 ? "Delete (has bookings)" : "Delete"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [perm]);

  const filtered = filter !== "all" || !!q.trim();

  return (
    <>
      <PageHeader
        title="Showroom Locations"
        description="One place for every showroom: the booking form, the Showroom and Contact pages, Google results and opening teasers all read from here."
        actions={perm?.write && <Button asChild><Link href="/admin/showrooms/new"><Plus /> New showroom</Link></Button>}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)} className="max-w-full overflow-x-auto [scrollbar-width:none] sm:overflow-visible">
          <TabsList>
            <TabsTrigger value="all">All <Badge variant="secondary" className="ml-1.5">{all.length}</Badge></TabsTrigger>
            {STATUSES.map((st) => (
              <TabsTrigger key={st} value={st}>{SHOWROOM_STATUS_LABEL[st]} <Badge variant="secondary" className="ml-1.5">{counts[st] ?? 0}</Badge></TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Input placeholder="Search name, city or code…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
      </div>
      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyState={
          filtered ? (
            <EmptyState icon={Store} title="No showrooms match" description="Try another status or search term." />
          ) : (
            <EmptyState icon={Store} title="No showrooms yet" description="Add your first showroom to show it on the site and accept bookings." action={perm?.write && <Button asChild><Link href="/admin/showrooms/new"><Plus /> New showroom</Link></Button>} />
          )
        }
      />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete ${toDelete?.name ?? "this showroom"}?`}
        description="It disappears from the site and the booking form. Opening teasers linked to it keep their content but are unlinked. This cannot be undone."
        loading={remove.isPending}
        onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }}
      />
    </>
  );
}
