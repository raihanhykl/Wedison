"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Archive, CheckCircle2, CircleAlert, Copy, Eye, ExternalLink, Link2, Megaphone, MessageSquareText, MoreHorizontal, Pencil, Plus, RotateCcw, Send, Trash2, Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  TeaserStatusBadge, eventPhase, inquiriesUrl, liveUrl, previewUrl, scheduleLabel, useTeaserPermissions,
} from "@/components/admin/teasers/shared";
import { api, errorMessage } from "@/lib/admin/api";
import { timeAgo, formatDateTime } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { AdminTeaser } from "@/lib/admin/types";
import type { TeaserStatus } from "@/lib/teasers/teaser";

type Action = "publish" | "unpublish" | "archive" | "restore";
const ACTION_DONE: Record<Action, string> = { publish: "Teaser published", unpublish: "Moved back to draft", archive: "Teaser archived", restore: "Restored as draft" };

export function TeasersView() {
  const router = useRouter();
  const qc = useQueryClient();
  const perm = useTeaserPermissions().data;
  const [status, setStatus] = useState<"all" | TeaserStatus>("all");
  const [q, setQ] = useState("");
  const dq = useDebounce(q);
  const [toDelete, setToDelete] = useState<AdminTeaser | null>(null);
  const [toArchive, setToArchive] = useState<AdminTeaser | null>(null);

  const query = { status: status === "all" ? undefined : status, q: dq };
  const { data, isLoading } = useQuery({
    queryKey: ["teasers", query],
    queryFn: () => api<{ items: AdminTeaser[]; byStatus: Partial<Record<TeaserStatus, number>> }>("/admin/teasers", { query }),
    placeholderData: keepPreviousData,
  });
  const counts = data?.byStatus ?? {};
  const total = (counts.DRAFT ?? 0) + (counts.PUBLISHED ?? 0) + (counts.ARCHIVED ?? 0);

  const refresh = () => { qc.invalidateQueries({ queryKey: ["teasers"] }); qc.invalidateQueries({ queryKey: ["contact-sources"] }); };
  const transition = useMutation({
    mutationFn: ({ id, action }: { id: string; action: Action }) => api<{ data: AdminTeaser }>(`/admin/teasers/${id}/transition`, { method: "POST", body: { action } }),
    onSuccess: (_r, v) => { toast.success(ACTION_DONE[v.action]); setToArchive(null); refresh(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const duplicate = useMutation({
    mutationFn: (id: string) => api<{ data: AdminTeaser }>(`/admin/teasers/${id}/duplicate`, { method: "POST" }).then((r) => r.data),
    onSuccess: (t) => { toast.success("Copy created as a draft"); refresh(); router.push(`/admin/teasers/${t.id}`); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/teasers/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Teaser deleted"); setToDelete(null); refresh(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const copyLink = (t: AdminTeaser) => {
    void navigator.clipboard.writeText(`${window.location.origin}${liveUrl(t.slug)}`).then(() => toast.success("Link copied"));
  };

  const columns = useMemo<ColumnDef<AdminTeaser, unknown>[]>(() => [
    {
      id: "teaser", header: "Teaser",
      cell: ({ row }) => {
        const t = row.original;
        return (
          <Link href={`/admin/teasers/${t.id}`} className="block min-w-[200px]">
            <p className="font-medium hover:underline">{t.city}</p>
            <p className="truncate text-xs text-muted-foreground">{t.showroomName}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">/showroom/{t.slug}</p>
          </Link>
        );
      },
    },
    { id: "status", header: "Status", size: 110, cell: ({ row }) => <TeaserStatusBadge status={row.original.status} /> },
    {
      id: "opening", header: "Opening", size: 230,
      cell: ({ row }) => {
        const t = row.original;
        const phase = eventPhase(t);
        return (
          <div className="min-w-[200px]">
            <p className="text-sm">{scheduleLabel(t)}</p>
            <p className={cn("text-xs", phase.key === "live" ? "font-medium text-primary" : "text-muted-foreground")}>{phase.label}</p>
          </div>
        );
      },
    },
    {
      id: "ready", header: "Content", size: 140,
      cell: ({ row }) => {
        const n = row.original.issues.length;
        return n ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground" title={row.original.issues.map((i) => i.message).join("\n")}>
            <CircleAlert className="size-4 text-chart-4" /> {n} to fix
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm text-primary"><CheckCircle2 className="size-4" /> Complete</span>
        );
      },
    },
    {
      id: "inquiries", header: "Inquiries", size: 100,
      cell: ({ row }) => (
        <Link href={inquiriesUrl(row.original.source)} className="inline-flex items-center gap-1.5 text-sm hover:underline">
          <MessageSquareText className="size-4 text-muted-foreground" /> {row.original.inquiries}
        </Link>
      ),
    },
    { id: "updated", header: "Updated", size: 110, cell: ({ row }) => <span className="text-xs text-muted-foreground" title={formatDateTime(row.original.updatedAt)}>{timeAgo(row.original.updatedAt)}</span> },
    {
      id: "actions", header: "", size: 48,
      cell: ({ row }) => {
        const t = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${t.city}`}><MoreHorizontal /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem asChild><Link href={`/admin/teasers/${t.id}`}><Pencil /> {perm?.write && (t.status !== "PUBLISHED" || perm.publish) ? "Edit" : "Open"}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><a href={previewUrl(t.slug)} target="_blank" rel="noreferrer"><Eye /> Preview</a></DropdownMenuItem>
              {t.status === "PUBLISHED" && (
                <>
                  <DropdownMenuItem asChild><a href={liveUrl(t.slug)} target="_blank" rel="noreferrer"><ExternalLink /> View on site</a></DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyLink(t)}><Link2 /> Copy link</DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem asChild><Link href={inquiriesUrl(t.source)}><MessageSquareText /> Inquiries ({t.inquiries})</Link></DropdownMenuItem>
              {perm?.write && <DropdownMenuItem onClick={() => duplicate.mutate(t.id)}><Copy /> Duplicate</DropdownMenuItem>}
              {perm?.publish && (
                <>
                  <DropdownMenuSeparator />
                  {t.status !== "PUBLISHED" && t.status !== "ARCHIVED" && (
                    <DropdownMenuItem disabled={t.issues.length > 0} onClick={() => transition.mutate({ id: t.id, action: "publish" })}><Send /> Publish{t.issues.length > 0 && " (incomplete)"}</DropdownMenuItem>
                  )}
                  {t.status === "PUBLISHED" && <DropdownMenuItem onClick={() => transition.mutate({ id: t.id, action: "unpublish" })}><Undo2 /> Unpublish</DropdownMenuItem>}
                  {t.status !== "ARCHIVED" && <DropdownMenuItem onClick={() => setToArchive(t)}><Archive /> Archive</DropdownMenuItem>}
                  {t.status === "ARCHIVED" && <DropdownMenuItem onClick={() => transition.mutate({ id: t.id, action: "restore" })}><RotateCcw /> Restore as draft</DropdownMenuItem>}
                </>
              )}
              {perm?.delete && t.status !== "PUBLISHED" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setToDelete(t)}><Trash2 /> Delete</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [perm]);

  const filtered = status !== "all" || !!dq;

  return (
    <>
      <PageHeader
        title="Opening Teasers"
        description="Landing pages that announce a new showroom: countdown, promotions and an inquiry form. The design is fixed; you manage the wording, schedule, images and contact points."
        actions={perm?.write && <Button asChild><Link href="/admin/teasers/new"><Plus /> New teaser</Link></Button>}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={status} onValueChange={(v) => setStatus(v as typeof status)} className="max-w-full overflow-x-auto [scrollbar-width:none] sm:overflow-visible">
          <TabsList>
            <TabsTrigger value="all">All <Badge variant="secondary" className="ml-1.5">{total}</Badge></TabsTrigger>
            <TabsTrigger value="PUBLISHED">Published <Badge variant="secondary" className="ml-1.5">{counts.PUBLISHED ?? 0}</Badge></TabsTrigger>
            <TabsTrigger value="DRAFT">Drafts <Badge variant="secondary" className="ml-1.5">{counts.DRAFT ?? 0}</Badge></TabsTrigger>
            <TabsTrigger value="ARCHIVED">Archived <Badge variant="secondary" className="ml-1.5">{counts.ARCHIVED ?? 0}</Badge></TabsTrigger>
          </TabsList>
        </Tabs>
        <Input placeholder="Search city, showroom or URL…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
      </div>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        emptyState={
          filtered ? (
            <EmptyState icon={Megaphone} title="No teasers match" description="Try another status or search term." />
          ) : (
            <EmptyState
              icon={Megaphone}
              title="No opening teasers yet"
              description="Create one when a new showroom is coming. It starts from a ready-made template: fill in the city, date, address, contacts and promotions, then publish."
              action={perm?.write && <Button asChild><Link href="/admin/teasers/new"><Plus /> Create the first teaser</Link></Button>}
            />
          )
        }
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete the ${toDelete?.city ?? ""} teaser?`}
        description="The page and its content are deleted permanently. Inquiries already received stay in Contact Messages. To hide the page but keep it, archive it instead."
        loading={remove.isPending}
        onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }}
      />
      <ConfirmDialog
        open={!!toArchive}
        onOpenChange={(o) => !o && setToArchive(null)}
        title={`Archive the ${toArchive?.city ?? ""} teaser?`}
        description="The page is hidden and visitors to its link are redirected to the Showroom page. You can restore it later."
        confirmLabel="Archive"
        destructive={false}
        loading={transition.isPending}
        onConfirm={() => { if (toArchive) transition.mutate({ id: toArchive.id, action: "archive" }); }}
      />
    </>
  );
}
