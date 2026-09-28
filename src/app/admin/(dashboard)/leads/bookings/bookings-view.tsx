"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  CalendarCheck, CalendarX2, CalendarSync, Download, ExternalLink, Eye, Mail, MessageCircle, MoreHorizontal, Trash2, CircleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { BookingStatusBadge } from "@/components/admin/status-badge";
import { useCan } from "@/components/admin/providers";
import { api, errorMessage, qs } from "@/lib/admin/api";
import { formatDateTime, timeAgo } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import {
  BOOKING_PURPOSE_LABEL, BOOKING_SOURCE_LABEL, BOOKING_STATUS_LABEL, CALENDAR_STATUS_LABEL, SHOWROOM_LABEL, SHOWROOM_TZ, waLink,
  type Booking, type BookingPurpose, type BookingStatus, type Paginated, type ShowroomId,
} from "@/lib/admin/types";
import { formatVisit } from "../leads-shared";

const STATUSES = Object.keys(BOOKING_STATUS_LABEL) as BookingStatus[];
const PURPOSES = Object.keys(BOOKING_PURPOSE_LABEL) as BookingPurpose[];
const SHOWROOMS = Object.keys(SHOWROOM_LABEL) as ShowroomId[];

type Filters = {
  q: string;
  showroom: "all" | ShowroomId;
  purpose: "all" | BookingPurpose;
  status: "all" | BookingStatus;
  from: string;
  to: string;
  upcoming: boolean;
};

export function BookingsView() {
  const params = useSearchParams();
  const qc = useQueryClient();
  const can = useCan();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [f, setF] = useState<Filters>(() => ({
    q: params.get("q") ?? "",
    showroom: (params.get("showroom") as Filters["showroom"]) || "all",
    purpose: (params.get("purpose") as Filters["purpose"]) || "all",
    status: (params.get("status") as Filters["status"]) || "all",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    upcoming: params.get("upcoming") === "1",
  }));
  const dq = useDebounce(f.q);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => { setF((s) => ({ ...s, [k]: v })); setPage(1); };
  const [selected, setSelected] = useState<Booking | null>(null);
  const [toDelete, setToDelete] = useState<Booking | null>(null);

  const query = useMemo(() => ({
    page, limit, q: dq,
    showroom: f.showroom === "all" ? undefined : f.showroom,
    purpose: f.purpose === "all" ? undefined : f.purpose,
    status: f.status === "all" ? undefined : f.status,
    from: f.from || undefined, to: f.to || undefined,
    upcoming: f.upcoming ? "1" : undefined,
    sort: f.upcoming ? "startAt" : "createdAt", order: f.upcoming ? "asc" : "desc",
  }), [page, limit, dq, f]);

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", query],
    queryFn: () => api<Paginated<Booking>>("/admin/leads/bookings", { query }),
    placeholderData: keepPreviousData,
  });

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["bookings"] }); qc.invalidateQueries({ queryKey: ["leads-stats"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); };
  const patch = useMutation({
    mutationFn: ({ id, ...body }: { id: string; status?: BookingStatus; adminNote?: string | null }) => api<{ data: Booking }>(`/admin/leads/bookings/${id}`, { method: "PATCH", body }).then((r) => r.data),
    onSuccess: (b) => { toast.success(`Booking updated · ${BOOKING_STATUS_LABEL[b.status]}`); setSelected((s) => (s?.id === b.id ? b : s)); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const sync = useMutation({
    mutationFn: (id: string) => api<{ data: Booking }>(`/admin/leads/bookings/${id}/calendar-sync`, { method: "POST" }).then((r) => r.data),
    onSuccess: (b) => {
      if (b.calendarStatus === "SAVED") toast.success("Saved to Google Calendar");
      else toast.warning(`${CALENDAR_STATUS_LABEL[b.calendarStatus]}${b.calendarError ? `: ${b.calendarError}` : ""}`);
      setSelected((s) => (s?.id === b.id ? b : s)); invalidate();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/leads/bookings/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Booking deleted"); setToDelete(null); setSelected(null); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const columns = useMemo<ColumnDef<Booking, unknown>[]>(() => [
    {
      id: "visit", header: "Visit", size: 170,
      cell: ({ row }) => (
        <button type="button" onClick={() => setSelected(row.original)} className="text-left">
          <p className="font-medium">{formatVisit(row.original)}</p>
          <p className="text-xs text-muted-foreground">{SHOWROOM_LABEL[row.original.showroom]}</p>
        </button>
      ),
    },
    {
      id: "customer", header: "Customer",
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <p className="font-medium">{row.original.name}</p>
          <p className="font-mono text-xs text-muted-foreground">{row.original.phone}{row.original.email ? ` · ${row.original.email}` : ""}</p>
        </div>
      ),
    },
    { id: "purpose", header: "Purpose", size: 150, cell: ({ row }) => <Badge variant="outline">{BOOKING_PURPOSE_LABEL[row.original.purpose]}</Badge> },
    { id: "status", header: "Status", size: 120, cell: ({ row }) => <BookingStatusBadge status={row.original.status} /> },
    {
      id: "calendar", header: "Calendar", size: 90,
      cell: ({ row }) => <CalendarCell b={row.original} />,
    },
    { id: "created", header: "Submitted", size: 110, cell: ({ row }) => <span className="text-xs text-muted-foreground" title={formatDateTime(row.original.createdAt)}>{timeAgo(row.original.createdAt)}</span> },
    {
      id: "actions", header: "", size: 48,
      cell: ({ row }) => {
        const b = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label="Actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => setSelected(b)}><Eye /> View details</DropdownMenuItem>
              <DropdownMenuItem asChild><a href={waLink(b.phone)} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp customer</a></DropdownMenuItem>
              {b.email && <DropdownMenuItem asChild><a href={`mailto:${b.email}`}><Mail /> Email customer</a></DropdownMenuItem>}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Set status</DropdownMenuLabel>
              {STATUSES.filter((s) => s !== b.status).map((s) => (
                <DropdownMenuItem key={s} onClick={() => patch.mutate({ id: b.id, status: s })}>{BOOKING_STATUS_LABEL[s]}</DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {b.calendarLink ? (
                <DropdownMenuItem asChild><a href={b.calendarLink} target="_blank" rel="noreferrer"><ExternalLink /> Open in Google Calendar</a></DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => sync.mutate(b.id)}><CalendarSync /> Sync to calendar</DropdownMenuItem>
              )}
              {can.deleteHard && (<><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setToDelete(b)}><Trash2 /> Delete</DropdownMenuItem></>)}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [can.deleteHard, patch, sync]);

  const exportHref = `/api/v1/admin/leads/bookings/export/${qs({ ...query, page: undefined, limit: undefined })}`;

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Test Ride and showroom-visit requests from the booking form. Update the follow-up status as you contact each customer."
        actions={<Button variant="outline" asChild><a href={exportHref}><Download /> Export CSV</a></Button>}
      />

      <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
        <Input placeholder="Search name / phone / email…" value={f.q} onChange={(e) => set("q", e.target.value)} className="lg:max-w-xs" />
        <Select value={f.showroom} onValueChange={(v) => set("showroom", v as Filters["showroom"])}>
          <SelectTrigger className="lg:w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All showrooms</SelectItem>{SHOWROOMS.map((s) => <SelectItem key={s} value={s}>{SHOWROOM_LABEL[s]}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={f.purpose} onValueChange={(v) => set("purpose", v as Filters["purpose"])}>
          <SelectTrigger className="lg:w-[190px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All purposes</SelectItem>{PURPOSES.map((p) => <SelectItem key={p} value={p}>{BOOKING_PURPOSE_LABEL[p]}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={f.status} onValueChange={(v) => set("status", v as Filters["status"])}>
          <SelectTrigger className="lg:w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All statuses</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s}>{BOOKING_STATUS_LABEL[s]}</SelectItem>)}</SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input type="date" value={f.from} onChange={(e) => set("from", e.target.value)} className="w-[150px]" aria-label="Visit date from" />
          <span className="text-xs text-muted-foreground">to</span>
          <Input type="date" value={f.to} onChange={(e) => set("to", e.target.value)} className="w-[150px]" aria-label="Visit date to" />
        </div>
        <label className="flex items-center gap-2 text-sm lg:ml-auto">
          <Switch checked={f.upcoming} onCheckedChange={(v) => set("upcoming", v)} />
          Upcoming only
        </label>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        emptyState={<EmptyState icon={CalendarCheck} title="No bookings" description="Requests from the Test Ride / Book a Visit form will show up here." />}
      />

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {selected && (
            <BookingDetail
              key={selected.id}
              b={selected}
              saving={patch.isPending}
              syncing={sync.isPending}
              onStatus={(status) => patch.mutate({ id: selected.id, status })}
              onNote={(adminNote) => patch.mutate({ id: selected.id, adminNote })}
              onSync={() => sync.mutate(selected.id)}
            />
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} title="Delete booking?" description={toDelete ? `${toDelete.name} · ${formatVisit(toDelete)}` : undefined} loading={remove.isPending} onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }} />
    </>
  );
}

function CalendarCell({ b }: { b: Booking }) {
  if (b.calendarStatus === "SAVED" && b.calendarLink) {
    return <a href={b.calendarLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline" title={CALENDAR_STATUS_LABEL.SAVED}><CalendarCheck className="size-3.5" /> Saved</a>;
  }
  if (b.calendarStatus === "FAILED") return <span className="inline-flex items-center gap-1 text-xs text-destructive" title={b.calendarError ?? ""}><CircleAlert className="size-3.5" /> Failed</span>;
  return <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" title={b.calendarError ?? CALENDAR_STATUS_LABEL[b.calendarStatus]}><CalendarX2 className="size-3.5" /> {b.calendarStatus === "PENDING" ? "Pending" : "Not synced"}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
    </div>
  );
}

function BookingDetail({ b, saving, syncing, onStatus, onNote, onSync }: { b: Booking; saving: boolean; syncing: boolean; onStatus: (s: BookingStatus) => void; onNote: (n: string) => void; onSync: () => void }) {
  const [note, setNote] = useState(b.adminNote ?? "");
  useEffect(() => setNote(b.adminNote ?? ""), [b.adminNote]);
  return (
    <>
      <SheetHeader>
        <SheetTitle className="font-display text-xl">{b.name}</SheetTitle>
        <SheetDescription>{BOOKING_PURPOSE_LABEL[b.purpose]} · {formatVisit(b, { year: true })}</SheetDescription>
      </SheetHeader>
      <div className="space-y-5 px-4 pb-6">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" asChild><a href={waLink(b.phone)} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button>
          {b.email && <Button size="sm" variant="outline" asChild><a href={`mailto:${b.email}`}><Mail /> Email</a></Button>}
          {b.calendarLink ? (
            <Button size="sm" variant="outline" asChild><a href={b.calendarLink} target="_blank" rel="noreferrer"><ExternalLink /> Google Calendar</a></Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onSync} disabled={syncing}><CalendarSync /> {syncing ? "Syncing…" : "Sync to calendar"}</Button>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="booking-status">Follow-up status</Label>
          <Select value={b.status} onValueChange={(v) => onStatus(v as BookingStatus)} disabled={saving}>
            <SelectTrigger id="booking-status" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{BOOKING_STATUS_LABEL[s]}</SelectItem>)}</SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Marking as Cancelled also removes the Google Calendar event.</p>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-border p-4">
          <Field label="Showroom">{SHOWROOM_LABEL[b.showroom]}</Field>
          <Field label="Visit">{b.date} · {b.time} {SHOWROOM_TZ[b.showroom]}</Field>
          <Field label="Phone"><span className="font-mono">{b.phone}</span></Field>
          <Field label="Email">{b.email ?? "—"}</Field>
          <Field label="Entry point">{BOOKING_SOURCE_LABEL[b.source ?? "unknown"] ?? b.source}</Field>
          <Field label="Language">{b.locale?.toUpperCase() ?? "—"}</Field>
          <Field label="Submitted">{formatDateTime(b.createdAt)}</Field>
          <Field label="Calendar">
            {CALENDAR_STATUS_LABEL[b.calendarStatus]}
            {b.calendarError && <span className="block text-xs text-destructive">{b.calendarError}</span>}
          </Field>
          <div className="col-span-2"><Field label="Customer note">{b.note ? <span className="whitespace-pre-wrap">{b.note}</span> : "—"}</Field></div>
        </dl>

        <div className="space-y-1.5">
          <Label htmlFor="booking-admin-note">Internal note</Label>
          <Textarea id="booking-admin-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Called at 10:15, will confirm tomorrow" />
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => onNote(note)} disabled={saving || note === (b.adminNote ?? "")}>Save note</Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">ID {b.id}{b.ip ? ` · IP ${b.ip}` : ""}</p>
      </div>
    </>
  );
}
