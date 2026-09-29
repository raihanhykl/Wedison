"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ExternalLink, Loader2, MoreHorizontal, Newspaper, Pencil, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useCan } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import { formatDate, toLocalInput } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import { STATUS_LABEL, type ContentStatus, type Paginated, type Press } from "@/lib/admin/types";

const schema = z.object({
  url: z.string().url("Invalid URL"),
  title: z.string().trim().min(3, "At least 3 characters").max(300),
  slug: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().max(2000).optional(),
  description: z.string().trim().max(1000).optional(),
  imageUrl: z.string().trim().max(1000).optional(),
  siteName: z.string().trim().max(120).optional(),
  author: z.string().trim().max(120).optional(),
  publishedAt: z.string().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
});
type Values = z.infer<typeof schema>;

const empty: Values = { url: "", title: "", slug: "", excerpt: "", description: "", imageUrl: "", siteName: "", author: "", publishedAt: "", status: "PUBLISHED" };

export function PressView() {
  const qc = useQueryClient();
  const can = useCan();
  const [tab, setTab] = useState<"all" | ContentStatus>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Press | "new" | null>(null);
  const [toDelete, setToDelete] = useState<Press | null>(null);
  const dq = useDebounce(q);

  const params = { page, limit, q: dq, status: tab === "all" ? undefined : tab };
  const { data, isLoading } = useQuery({
    queryKey: ["press", params],
    queryFn: () => api<Paginated<Press>>("/admin/press", { query: params }),
    placeholderData: keepPreviousData,
  });
  const invalidate = () => { qc.invalidateQueries({ queryKey: ["press"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); };

  const refresh = useMutation({
    mutationFn: (id: string) => api(`/admin/press/${id}/refresh`, { method: "POST" }),
    onSuccess: () => { toast.success("Metadata refreshed from the source"); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const setStatus = useMutation({
    mutationFn: (v: { id: string; status: ContentStatus }) => api(`/admin/press/${v.id}`, { method: "PATCH", body: { status: v.status } }),
    onSuccess: () => invalidate(),
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/press/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Press coverage deleted"); setToDelete(null); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const columns = useMemo<ColumnDef<Press, unknown>[]>(() => [
    {
      id: "title", header: "Coverage",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center gap-3 min-w-[280px]">
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
              {p.imageUrl ? <Image src={p.imageUrl} alt="" fill sizes="64px" className="object-cover" unoptimized /> : <Newspaper className="absolute inset-0 m-auto size-4 text-muted-foreground" />}
            </div>
            <div className="min-w-0">
              <button type="button" onClick={() => setEditing(p)} className="line-clamp-2 text-left font-medium hover:text-primary">{p.title}</button>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-mono uppercase">{p.siteName ?? new URL(p.url).hostname}</span>
                {p.author && <span>· {p.author}</span>}
              </div>
            </div>
          </div>
        );
      },
    },
    { id: "status", header: "Status", size: 110, cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { id: "publishedAt", header: "Published", size: 120, cell: ({ row }) => <span className="text-xs">{formatDate(row.original.publishedAt)}</span> },
    { id: "fetched", header: "Metadata", size: 120, cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.fetchedAt ? formatDate(row.original.fetchedAt) : "not fetched"}</span> },
    {
      id: "actions", size: 48,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label="Actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditing(p)}><Pencil /> Edit</DropdownMenuItem>
              <DropdownMenuItem asChild><a href={p.url} target="_blank" rel="noreferrer"><ExternalLink /> Open source</a></DropdownMenuItem>
              <DropdownMenuItem asChild><a href={`/id/media-center/news/${p.slug}/`} target="_blank" rel="noreferrer"><ExternalLink /> View on site</a></DropdownMenuItem>
              <DropdownMenuItem onClick={() => refresh.mutate(p.id)}><RefreshCw /> Refresh metadata</DropdownMenuItem>
              <DropdownMenuSeparator />
              {p.status !== "PUBLISHED" && <DropdownMenuItem onClick={() => setStatus.mutate({ id: p.id, status: "PUBLISHED" })}>Publish</DropdownMenuItem>}
              {p.status === "PUBLISHED" && <DropdownMenuItem onClick={() => setStatus.mutate({ id: p.id, status: "DRAFT" })}>Unpublish (draft)</DropdownMenuItem>}
              {p.status !== "ARCHIVED" && <DropdownMenuItem onClick={() => setStatus.mutate({ id: p.id, status: "ARCHIVED" })}>Archive</DropdownMenuItem>}
              {can.deleteHard && (<><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setToDelete(p)}><Trash2 /> Delete</DropdownMenuItem></>)}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [can.deleteHard, refresh, setStatus]);

  return (
    <>
      <PageHeader
        title="Press Coverage"
        description="News about Wedison from external media. Paste a URL and the metadata (title, image, date) is fetched automatically."
        actions={<Button onClick={() => setEditing("new")}><Plus /> Add coverage</Button>}
      />
      <Tabs value={tab} onValueChange={(v) => { setTab(v as typeof tab); setPage(1); }}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="PUBLISHED">Published</TabsTrigger>
          <TabsTrigger value="DRAFT">Drafts</TabsTrigger>
          <TabsTrigger value="ARCHIVED">Archived</TabsTrigger>
        </TabsList>
      </Tabs>
      <Input placeholder="Search title / outlet…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="sm:max-w-xs" />
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        emptyState={<EmptyState icon={Newspaper} title="No press coverage yet" description="Add a media article URL to feature it on the Media Center." action={<Button onClick={() => setEditing("new")}><Plus /> Add coverage</Button>} />}
      />

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-xl">
          {editing && <PressForm key={editing === "new" ? "new" : editing.id} press={editing === "new" ? null : editing} onDone={() => { setEditing(null); invalidate(); }} />}
        </SheetContent>
      </Sheet>
      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} title="Delete press coverage?" description={toDelete?.title} loading={remove.isPending} onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }} />
    </>
  );
}

function PressForm({ press, onDone }: { press: Press | null; onDone: () => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: press
      ? { url: press.url, title: press.title, slug: press.slug, excerpt: press.excerpt ?? "", description: press.description ?? "", imageUrl: press.imageUrl ?? "", siteName: press.siteName ?? "", author: press.author ?? "", publishedAt: toLocalInput(press.publishedAt), status: press.status }
      : empty,
  });

  const fetchMeta = useMutation({
    mutationFn: (url: string) => api<{ data: { title: string; description: string; image: string | null; siteName: string; publishedAt: string | null; author: string | null; slug: string } }>("/admin/press/fetch-metadata", { method: "POST", body: { url } }).then((r) => r.data),
    onSuccess: (m) => {
      const cur = form.getValues();
      form.reset({
        ...cur,
        title: m.title || cur.title,
        slug: cur.slug || m.slug,
        description: m.description || cur.description,
        imageUrl: m.image ?? cur.imageUrl,
        siteName: m.siteName || cur.siteName,
        author: cur.author || m.author || "",
        publishedAt: m.publishedAt ? toLocalInput(m.publishedAt) : cur.publishedAt,
      });
      toast.success("Metadata filled in. Review, then save.");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const save = useMutation({
    mutationFn: (v: Values) => {
      const body = {
        ...v,
        slug: v.slug || undefined,
        excerpt: v.excerpt || null, description: v.description || null, imageUrl: v.imageUrl || null, siteName: v.siteName || null, author: v.author || null,
        publishedAt: v.publishedAt ? new Date(v.publishedAt).toISOString() : null,
      };
      return press ? api(`/admin/press/${press.id}`, { method: "PATCH", body }) : api("/admin/press", { method: "POST", body });
    },
    onSuccess: () => { toast.success("Press coverage saved"); onDone(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const imageUrl = form.watch("imageUrl");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="flex h-full flex-col">
        <SheetHeader>
          <SheetTitle>{press ? "Edit coverage" : "Add coverage"}</SheetTitle>
          <SheetDescription>Paste the article URL, then click “Fetch”.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 px-4">
          <FormField control={form.control} name="url" render={({ field }) => (
            <FormItem>
              <FormLabel>Source URL</FormLabel>
              <div className="flex gap-2">
                <FormControl><Input placeholder="https://…" {...field} /></FormControl>
                <Button type="button" variant="outline" onClick={() => form.trigger("url").then((ok) => ok && fetchMeta.mutate(field.value))} disabled={fetchMeta.isPending}>
                  {fetchMeta.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />} Fetch
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )} />
          {imageUrl && (
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <Image src={imageUrl} alt="" fill sizes="500px" className="object-cover" unoptimized />
            </div>
          )}
          <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug</FormLabel><FormControl><Input className="font-mono text-xs" placeholder="generated from the title" {...field} /></FormControl><FormDescription>URL: /media-center/news/&lt;slug&gt;</FormDescription><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="excerpt" render={({ field }) => (<FormItem><FormLabel>Quote (shown on the detail page)</FormLabel><FormControl><Textarea rows={5} placeholder="Opening paragraph / quote from the source article" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Short description (card)</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="siteName" render={({ field }) => (<FormItem><FormLabel>Outlet name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="author" render={({ field }) => (<FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="publishedAt" render={({ field }) => (<FormItem><FormLabel>Publish date</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>{(["PUBLISHED", "DRAFT", "ARCHIVED"] as ContentStatus[]).map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input className="font-mono text-xs" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <SheetFooter>
          <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="animate-spin" />} Save</Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
