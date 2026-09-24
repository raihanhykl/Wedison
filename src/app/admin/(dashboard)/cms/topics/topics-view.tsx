"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { useCan } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import type { Category, Tag } from "@/lib/admin/types";

const categorySchema = z.object({
  nameId: z.string().trim().min(2, "At least 2 characters").max(80),
  nameEn: z.string().trim().max(80).optional(),
  slug: z.string().trim().max(120).optional(),
  description: z.string().trim().max(500).optional(),
  sortOrder: z.coerce.number().int(),
});
type CategoryValues = z.infer<typeof categorySchema>;

export function TopicsView() {
  return (
    <>
      <PageHeader title="Topics & Tags" description="Topics group articles (one per article); tags are free-form and unlimited." />
      <Tabs defaultValue="topics">
        <TabsList>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>
        <TabsContent value="topics" className="mt-4"><TopicsPanel /></TabsContent>
        <TabsContent value="tags" className="mt-4"><TagsPanel /></TabsContent>
      </Tabs>
    </>
  );
}

function TopicsPanel() {
  const qc = useQueryClient();
  const can = useCan();
  const [editing, setEditing] = useState<Category | null | "new">(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ["topics"], queryFn: () => api<{ items: Category[] }>("/admin/topics").then((r) => r.items) });

  const form = useForm<CategoryValues>({ resolver: zodResolver(categorySchema), defaultValues: { nameId: "", nameEn: "", slug: "", description: "", sortOrder: 0 } });

  const openForm = (c: Category | "new") => {
    form.reset(c === "new" ? { nameId: "", nameEn: "", slug: "", description: "", sortOrder: (data?.length ?? 0) } : { nameId: c.nameId, nameEn: c.nameEn ?? "", slug: c.slug, description: c.description ?? "", sortOrder: c.sortOrder });
    setEditing(c);
  };

  const save = useMutation({
    mutationFn: (v: CategoryValues) => {
      const body = { ...v, nameEn: v.nameEn || null, description: v.description || null, slug: v.slug || undefined };
      return editing && editing !== "new"
        ? api(`/admin/topics/${editing.id}`, { method: "PATCH", body })
        : api("/admin/topics", { method: "POST", body });
    },
    onSuccess: () => { toast.success("Topic saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["topics"] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/topics/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Topic deleted"); setToDelete(null); qc.invalidateQueries({ queryKey: ["topics"] }); qc.invalidateQueries({ queryKey: ["articles"] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button onClick={() => openForm("new")}><Plus /> New topic</Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader className="bg-muted/60">
            <TableRow>
              <TableHead className="w-12">Order</TableHead>
              <TableHead>Name (ID)</TableHead>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Articles</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <TableRow key={i}>{Array.from({ length: 6 }).map((__, j) => <TableCell key={j}><Skeleton className="h-4" /></TableCell>)}</TableRow>)
            ) : data?.length ? (
              data.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.sortOrder}</TableCell>
                  <TableCell className="font-medium">{c.nameId}{c.description && <p className="text-xs font-normal text-muted-foreground line-clamp-1">{c.description}</p>}</TableCell>
                  <TableCell className="text-muted-foreground">{c.nameEn ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{c.slug}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{c._count?.articles ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => openForm(c)} aria-label="Edit"><Pencil /></Button>
                      {can.deleteHard && <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => setToDelete(c)} aria-label="Delete"><Trash2 /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="p-0"><EmptyState icon={Tags} title="No topics yet" /></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing === "new" ? "New topic" : "Edit topic"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit((v) => save.mutate(v))}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="nameId" render={({ field }) => (<FormItem><FormLabel>Name (ID)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="nameEn" render={({ field }) => (<FormItem><FormLabel>Name (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug</FormLabel><FormControl><Input className="font-mono" placeholder="generated from the name" {...field} /></FormControl><FormDescription>Used in the topic filter URL.</FormDescription><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="sortOrder" render={({ field }) => (<FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" className="w-28" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="animate-spin" />} Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} title={`Delete topic “${toDelete?.nameId}”?`} description="Articles in this topic will have no topic." loading={remove.isPending} onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }} />
    </div>
  );
}

function TagsPanel() {
  const qc = useQueryClient();
  const can = useCan();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<Tag | null>(null);
  const [editName, setEditName] = useState("");
  const [toDelete, setToDelete] = useState<Tag | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ["tags"], queryFn: () => api<{ items: Tag[] }>("/admin/tags").then((r) => r.items) });

  const create = useMutation({
    mutationFn: (n: string) => api("/admin/tags", { method: "POST", body: { name: n } }),
    onSuccess: () => { setName(""); qc.invalidateQueries({ queryKey: ["tags"] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const rename = useMutation({
    mutationFn: (v: { id: string; name: string }) => api(`/admin/tags/${v.id}`, { method: "PATCH", body: { name: v.name } }),
    onSuccess: () => { setEditing(null); qc.invalidateQueries({ queryKey: ["tags"] }); toast.success("Tag updated"); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/tags/${id}`, { method: "DELETE" }),
    onSuccess: () => { setToDelete(null); qc.invalidateQueries({ queryKey: ["tags"] }); toast.success("Tag deleted"); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="space-y-4">
      <form className="flex gap-2 max-w-md" onSubmit={(e) => { e.preventDefault(); if (name.trim()) create.mutate(name.trim()); }}>
        <Input placeholder="New tag name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit" disabled={!name.trim() || create.isPending}><Plus /> Add</Button>
      </form>
      {isLoading ? (
        <div className="flex flex-wrap gap-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-7 w-20 rounded-full" />)}</div>
      ) : data?.length ? (
        <div className="flex flex-wrap gap-2">
          {data.map((t) => (
            <Badge key={t.id} variant="outline" className="h-8 gap-1.5 rounded-full pl-3 pr-1 text-sm font-normal">
              {t.name}
              <span className="font-mono text-[10px] text-muted-foreground">{t._count?.articles ?? 0}</span>
              <button type="button" className="rounded-full p-1 hover:bg-muted" onClick={() => { setEditing(t); setEditName(t.name); }} aria-label="Rename"><Pencil className="size-3" /></button>
              {can.deleteHard && <button type="button" className="rounded-full p-1 text-destructive hover:bg-destructive/10" onClick={() => setToDelete(t)} aria-label="Delete"><Trash2 className="size-3" /></button>}
            </Badge>
          ))}
        </div>
      ) : (
        <EmptyState icon={Tags} title="No tags yet" description="Tags can also be created directly from the article editor." />
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Rename tag</DialogTitle></DialogHeader>
          <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button disabled={!editName.trim() || rename.isPending} onClick={() => editing && rename.mutate({ id: editing.id, name: editName.trim() })}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} title={`Delete tag “${toDelete?.name}”?`} description="The tag will be removed from all articles." loading={remove.isPending} onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }} />
    </div>
  );
}
