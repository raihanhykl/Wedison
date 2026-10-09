"use client";

import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Check, Eye, Mail, MessageCircle, MessageSquareText, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useCan } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import { formatDateTime, timeAgo } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import { waLink, type ContactSubmission, type Paginated } from "@/lib/admin/types";
import { contactReplyMailto } from "@/lib/admin/contact-reply";
import { cn } from "@/lib/utils";

function HandledBadge({ c }: { c: ContactSubmission }) {
  return (
    <Badge variant="outline" className={cn("font-medium", c.isHandled ? "bg-primary/10 text-primary border-primary/20" : "bg-chart-4/15 text-foreground border-chart-4/40")}>
      {c.isHandled ? "Handled" : "Unhandled"}
    </Badge>
  );
}

export function ContactsView() {
  const qc = useQueryClient();
  const can = useCan("leads");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState("");
  const [handled, setHandled] = useState<"all" | "false" | "true">("all");
  const dq = useDebounce(q);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [toDelete, setToDelete] = useState<ContactSubmission | null>(null);

  const query = { page, limit, q: dq, handled: handled === "all" ? undefined : handled };
  const { data, isLoading } = useQuery({
    queryKey: ["contacts", query],
    queryFn: () => api<Paginated<ContactSubmission>>("/admin/leads/contacts", { query }),
    placeholderData: keepPreviousData,
  });

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["contacts"] }); qc.invalidateQueries({ queryKey: ["leads-stats"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); };
  const patch = useMutation({
    mutationFn: ({ id, ...body }: { id: string; isHandled?: boolean; adminNote?: string | null }) => api<{ data: ContactSubmission }>(`/admin/leads/contacts/${id}`, { method: "PATCH", body }).then((r) => r.data),
    onSuccess: (c) => { toast.success(c.isHandled ? "Marked as handled" : "Message updated"); setSelected((s) => (s?.id === c.id ? c : s)); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/leads/contacts/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Message deleted"); setToDelete(null); setSelected(null); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const columns = useMemo<ColumnDef<ContactSubmission, unknown>[]>(() => [
    { id: "received", header: "Received", size: 110, cell: ({ row }) => <span className="text-xs text-muted-foreground" title={formatDateTime(row.original.createdAt)}>{timeAgo(row.original.createdAt)}</span> },
    {
      id: "from", header: "From",
      cell: ({ row }) => (
        <button type="button" onClick={() => setSelected(row.original)} className="min-w-[180px] text-left">
          <p className="font-medium">{row.original.name}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">{row.original.email} · {row.original.phone}</p>
        </button>
      ),
    },
    { id: "topic", header: "Topic", size: 190, cell: ({ row }) => <Badge variant="outline" className="max-w-[180px] truncate">{row.original.topic}</Badge> },
    { id: "message", header: "Message", cell: ({ row }) => <p className="line-clamp-2 max-w-[360px] text-sm text-muted-foreground">{row.original.message}</p> },
    { id: "status", header: "Status", size: 110, cell: ({ row }) => <HandledBadge c={row.original} /> },
    {
      id: "actions", header: "", size: 48,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label="Actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSelected(c)}><Eye /> View message</DropdownMenuItem>
              <DropdownMenuItem asChild><a href={contactReplyMailto(c)}><Mail /> Reply by email</a></DropdownMenuItem>
              <DropdownMenuItem asChild><a href={waLink(c.phone)} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></DropdownMenuItem>
              <DropdownMenuSeparator />
              {c.isHandled
                ? <DropdownMenuItem onClick={() => patch.mutate({ id: c.id, isHandled: false })}><RotateCcw /> Reopen</DropdownMenuItem>
                : <DropdownMenuItem onClick={() => patch.mutate({ id: c.id, isHandled: true })}><Check /> Mark as handled</DropdownMenuItem>}
              {can.deleteHard && (<><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setToDelete(c)}><Trash2 /> Delete</DropdownMenuItem></>)}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [can.deleteHard, patch]);

  return (
    <>
      <PageHeader title="Contact Messages" description="Messages sent through the contact form (/corporate/contact). The email copy is still delivered via EmailJS; this list is the follow-up queue." />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Search name / email / phone / message…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="sm:max-w-sm" />
        <Select value={handled} onValueChange={(v) => { setHandled(v as typeof handled); setPage(1); }}>
          <SelectTrigger className="sm:w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All messages</SelectItem>
            <SelectItem value="false">Unhandled</SelectItem>
            <SelectItem value="true">Handled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        emptyState={<EmptyState icon={MessageSquareText} title="No messages" description="Submissions from the contact form will appear here." />}
      />

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {selected && <ContactDetail key={selected.id} c={selected} saving={patch.isPending} onHandled={(v) => patch.mutate({ id: selected.id, isHandled: v })} onNote={(n) => patch.mutate({ id: selected.id, adminNote: n })} />}
        </SheetContent>
      </Sheet>
      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} title="Delete message?" description={toDelete ? `${toDelete.name} · ${toDelete.topic}` : undefined} loading={remove.isPending} onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }} />
    </>
  );
}

function ContactDetail({ c, saving, onHandled, onNote }: { c: ContactSubmission; saving: boolean; onHandled: (v: boolean) => void; onNote: (n: string) => void }) {
  const [note, setNote] = useState(c.adminNote ?? "");
  useEffect(() => setNote(c.adminNote ?? ""), [c.adminNote]);
  return (
    <>
      <SheetHeader>
        <SheetTitle className="font-display text-xl">{c.name}</SheetTitle>
        <SheetDescription>{c.topic} · {formatDateTime(c.createdAt)}</SheetDescription>
      </SheetHeader>
      <div className="space-y-5 px-4 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" asChild><a href={contactReplyMailto(c)}><Mail /> Reply by email</a></Button>
          <Button size="sm" variant="outline" asChild><a href={waLink(c.phone)} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button>
          <div className="ml-auto"><HandledBadge c={c} /></div>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
          <p className="whitespace-pre-wrap">{c.message}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt><dd className="mt-0.5 break-all">{c.email}</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Phone</dt><dd className="mt-0.5 font-mono">{c.phone}</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Language</dt><dd className="mt-0.5">{c.locale?.toUpperCase() ?? "—"}</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Handled at</dt><dd className="mt-0.5">{c.handledAt ? formatDateTime(c.handledAt) : "—"}</dd></div>
        </dl>
        <div className="space-y-1.5">
          <Label htmlFor="contact-admin-note">Internal note</Label>
          <Textarea id="contact-admin-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Replied by email on 30 Sep" />
          <div className="flex flex-wrap justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => onNote(note)} disabled={saving || note === (c.adminNote ?? "")}>Save note</Button>
            <Button size="sm" onClick={() => onHandled(!c.isHandled)} disabled={saving}>{c.isHandled ? <><RotateCcw /> Reopen</> : <><Check /> Mark as handled</>}</Button>
          </div>
        </div>
      </div>
    </>
  );
}
