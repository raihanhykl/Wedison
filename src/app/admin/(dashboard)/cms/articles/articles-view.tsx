"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { toast } from "sonner";
import { Archive, ArchiveRestore, Eye, FileText, MoreHorizontal, Pencil, Plus, Send, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useCan } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import { formatDate, timeAgo } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import type { Article, Category, ContentStatus, Paginated } from "@/lib/admin/types";

type Tab = "all" | ContentStatus | "trash";

export function ArticlesView() {
  const qc = useQueryClient();
  const can = useCan();
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [selection, setSelection] = useState<RowSelectionState>({});
  const [confirm, setConfirm] = useState<{ ids: string[]; action: "trash" | "delete" } | null>(null);
  const dq = useDebounce(q);

  const params = {
    page, limit, q: dq,
    status: tab === "all" || tab === "trash" ? undefined : tab,
    trashed: tab === "trash" ? true : undefined,
    categoryId: categoryId === "all" ? undefined : categoryId,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["articles", params],
    queryFn: () => api<Paginated<Article>>("/admin/articles", { query: params }),
    placeholderData: keepPreviousData,
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api<{ items: Category[] }>("/admin/topics").then((r) => r.items),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["articles"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const bulk = useMutation({
    mutationFn: (v: { ids: string[]; action: "publish" | "draft" | "archive" | "trash" | "restore" | "delete" }) =>
      api<{ count: number }>("/admin/articles/bulk", { method: "POST", body: v }),
    onSuccess: (r, v) => {
      toast.success(`${r.count} article(s) ${LABEL[v.action]}`);
      setSelection({});
      setConfirm(null);
      invalidate();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const LABEL = { publish: "published", draft: "moved to drafts", archive: "archived", trash: "moved to trash", restore: "restored", delete: "permanently deleted" };
  const selectedIds = Object.keys(selection).filter((k) => selection[k]);

  const columns = useMemo<ColumnDef<Article, unknown>[]>(
    () => [
      {
        id: "select",
        size: 36,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Select" />,
      },
      {
        id: "title",
        header: "Title",
        cell: ({ row }) => {
          const a = row.original;
          const t = a.translations.find((x) => x.locale === "id") ?? a.translations[0];
          return (
            <div className="flex items-center gap-3 min-w-[260px]">
              <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
                {a.coverImage ? <Image src={a.coverImage.url} alt="" fill sizes="44px" className="object-cover" unoptimized /> : <FileText className="absolute inset-0 m-auto size-4 text-muted-foreground" />}
              </div>
              <div className="min-w-0">
                <Link href={`/admin/cms/articles/${a.id}`} className="line-clamp-1 font-medium hover:text-primary">
                  {t?.title ?? "(untitled)"}
                </Link>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {a.translations.map((x) => (
                    <Badge key={x.locale} variant="outline" className="h-4 px-1 font-mono text-[10px] uppercase">{x.locale}</Badge>
                  ))}
                  {a.isFeatured && <Badge className="h-4 px-1.5 text-[10px]">Featured</Badge>}
                  <span className="truncate">/{t?.slug}</span>
                </div>
              </div>
            </div>
          );
        },
      },
      { id: "category", header: "Topic", size: 130, cell: ({ row }) => <span className="text-sm">{row.original.category?.nameId ?? <span className="text-muted-foreground">—</span>}</span> },
      { id: "status", header: "Status", size: 110, cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      { id: "author", header: "Author", size: 140, cell: ({ row }) => <span className="text-sm">{row.original.author?.name ?? "—"}</span> },
      { id: "views", header: "Reads", size: 80, cell: ({ row }) => <span className="font-mono text-xs">{row.original.viewCount}</span> },
      {
        id: "date", header: "Date", size: 150,
        cell: ({ row }) => (
          <div className="text-xs">
            <div>{row.original.publishedAt ? formatDate(row.original.publishedAt) : <span className="text-muted-foreground">not published</span>}</div>
            <div className="text-muted-foreground">updated {timeAgo(row.original.updatedAt)}</div>
          </div>
        ),
      },
      {
        id: "actions", size: 48,
        cell: ({ row }) => {
          const a = row.original;
          const t = a.translations.find((x) => x.locale === "id") ?? a.translations[0];
          const trashed = !!a.deletedAt;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Actions"><MoreHorizontal /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!trashed && (
                  <>
                    <DropdownMenuItem asChild><Link href={`/admin/cms/articles/${a.id}`}><Pencil /> Edit</Link></DropdownMenuItem>
                    {a.status === "PUBLISHED" && t && (
                      <DropdownMenuItem asChild>
                        <a href={`/${t.locale}/media-center/artikel/${t.slug}/`} target="_blank" rel="noreferrer"><Eye /> View on site</a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {a.status !== "PUBLISHED" && <DropdownMenuItem onClick={() => bulk.mutate({ ids: [a.id], action: "publish" })}><Send /> Publish</DropdownMenuItem>}
                    {a.status === "PUBLISHED" && <DropdownMenuItem onClick={() => bulk.mutate({ ids: [a.id], action: "draft" })}><Undo2 /> Revert to draft</DropdownMenuItem>}
                    {a.status !== "ARCHIVED" && <DropdownMenuItem onClick={() => bulk.mutate({ ids: [a.id], action: "archive" })}><Archive /> Archive</DropdownMenuItem>}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setConfirm({ ids: [a.id], action: "trash" })}><Trash2 /> Move to trash</DropdownMenuItem>
                  </>
                )}
                {trashed && (
                  <>
                    <DropdownMenuItem onClick={() => bulk.mutate({ ids: [a.id], action: "restore" })}><ArchiveRestore /> Restore</DropdownMenuItem>
                    {can.deleteHard && (
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setConfirm({ ids: [a.id], action: "delete" })}><Trash2 /> Delete permanently</DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [bulk, can.deleteHard],
  );

  const counts = data?.meta.total ?? 0;

  return (
    <>
      <PageHeader
        title="Articles"
        description="Original Wedison stories on the Media Center. Bilingual (ID required, EN optional)."
        actions={
          <Button asChild>
            <Link href="/admin/cms/articles/new"><Plus /> Write article</Link>
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => { setTab(v as Tab); setPage(1); setSelection({}); }}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="PUBLISHED">Published</TabsTrigger>
          <TabsTrigger value="DRAFT">Drafts</TabsTrigger>
          <TabsTrigger value="SCHEDULED">Scheduled</TabsTrigger>
          <TabsTrigger value="ARCHIVED">Archived</TabsTrigger>
          <TabsTrigger value="trash">Trash</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input placeholder="Search title…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="sm:max-w-xs" />
        <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setPage(1); }}>
          <SelectTrigger className="sm:w-[200px]"><SelectValue placeholder="Topic" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All topics</SelectItem>
            {categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.nameId}</SelectItem>)}
          </SelectContent>
        </Select>
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm">
            <span className="font-medium">{selectedIds.length} selected</span>
            {tab !== "trash" ? (
              <>
                <Button size="sm" variant="outline" onClick={() => bulk.mutate({ ids: selectedIds, action: "publish" })}>Publish</Button>
                <Button size="sm" variant="outline" onClick={() => bulk.mutate({ ids: selectedIds, action: "archive" })}>Archive</Button>
                <Button size="sm" variant="destructive" onClick={() => setConfirm({ ids: selectedIds, action: "trash" })}>Move to trash</Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => bulk.mutate({ ids: selectedIds, action: "restore" })}>Restore</Button>
                {can.deleteHard && <Button size="sm" variant="destructive" onClick={() => setConfirm({ ids: selectedIds, action: "delete" })}>Delete permanently</Button>}
              </>
            )}
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        getRowId={(r) => r.id}
        emptyState={
          <EmptyState
            icon={FileText}
            title={tab === "trash" ? "Trash is empty" : counts === 0 && !dq ? "No articles yet" : "No results"}
            description={tab === "trash" ? undefined : "Write your first article to feature it on the Media Center."}
            action={tab !== "trash" && !dq ? <Button asChild><Link href="/admin/cms/articles/new"><Plus /> Write article</Link></Button> : undefined}
          />
        }
      />

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={confirm?.action === "delete" ? "Delete permanently?" : "Move to trash?"}
        description={confirm?.action === "delete" ? `${confirm.ids.length} article(s) and their translations will be deleted permanently. This cannot be undone.` : "Articles can be restored from the Trash tab."}
        confirmLabel={confirm?.action === "delete" ? "Delete permanently" : "Move to trash"}
        loading={bulk.isPending}
        onConfirm={() => { if (confirm) bulk.mutate({ ids: confirm.ids, action: confirm.action }); }}
      />
    </>
  );
}
