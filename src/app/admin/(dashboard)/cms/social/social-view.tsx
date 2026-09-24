"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ExternalLink, Loader2, Pencil, Plus, RefreshCw, Share2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useCan } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import { cn } from "@/lib/utils";
import { PLATFORM_LABEL, type Paginated, type SocialPlatform, type SocialPost } from "@/lib/admin/types";

const schema = z.object({
  platform: z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE", "X", "FACEBOOK", "LINKEDIN"]),
  url: z.string().url("Invalid URL"),
  caption: z.string().trim().max(2200).optional(),
  thumbnailUrl: z.string().trim().max(1000).optional(),
  isActive: z.boolean(),
});
type Values = z.infer<typeof schema>;

export function SocialView() {
  const qc = useQueryClient();
  const can = useCan();
  const [platform, setPlatform] = useState<"all" | SocialPlatform>("all");
  const [editing, setEditing] = useState<SocialPost | "new" | null>(null);
  const [toDelete, setToDelete] = useState<SocialPost | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["social", platform],
    queryFn: () => api<Paginated<SocialPost>>("/admin/social", { query: { limit: 100, platform: platform === "all" ? undefined : platform } }),
  });
  const items = data?.items ?? [];
  const invalidate = () => { qc.invalidateQueries({ queryKey: ["social"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); };

  const toggle = useMutation({
    mutationFn: (v: { id: string; isActive: boolean }) => api(`/admin/social/${v.id}`, { method: "PATCH", body: { isActive: v.isActive } }),
    onSuccess: invalidate,
    onError: (e) => toast.error(errorMessage(e)),
  });
  const refresh = useMutation({
    mutationFn: (id: string) => api(`/admin/social/${id}/refresh`, { method: "POST" }),
    onSuccess: () => { toast.success("Thumbnail & caption refreshed"); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const reorder = useMutation({
    mutationFn: (ids: string[]) => api("/admin/social/reorder", { method: "POST", body: { ids } }),
    onSuccess: invalidate,
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/social/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Post deleted"); setToDelete(null); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const move = (idx: number, dir: -1 | 1) => {
    const ids = items.map((i) => i.id);
    const j = idx + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[idx], ids[j]] = [ids[j], ids[idx]];
    reorder.mutate(ids);
  };

  return (
    <>
      <PageHeader
        title="Social Media"
        description="Posts shown in the Instagram section of the Media Center. The order here is the order on the site."
        actions={<Button onClick={() => setEditing("new")}><Plus /> Add post</Button>}
      />
      <Select value={platform} onValueChange={(v) => setPlatform(v as typeof platform)}>
        <SelectTrigger className="sm:w-[200px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All platforms</SelectItem>
          {(Object.keys(PLATFORM_LABEL) as SocialPlatform[]).map((p) => <SelectItem key={p} value={p}>{PLATFORM_LABEL[p]}</SelectItem>)}
        </SelectContent>
      </Select>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-xl" />)}</div>
      ) : items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p, idx) => (
            <div key={p.id} className={cn("group overflow-hidden rounded-xl border border-border bg-card", !p.isActive && "opacity-60")}>
              <div className="relative aspect-[4/5] bg-muted">
                {p.thumbnailUrl ? <Image src={p.thumbnailUrl} alt="" fill sizes="300px" className="object-cover" unoptimized /> : <Share2 className="absolute inset-0 m-auto size-6 text-muted-foreground" />}
                <Badge className="absolute left-2 top-2" variant="secondary">{PLATFORM_LABEL[p.platform]}</Badge>
                <div className="absolute right-2 top-2 flex gap-1">
                  <Button size="icon" variant="secondary" className="size-7" disabled={idx === 0 || reorder.isPending} onClick={() => move(idx, -1)} aria-label="Move up"><ArrowUp /></Button>
                  <Button size="icon" variant="secondary" className="size-7" disabled={idx === items.length - 1 || reorder.isPending} onClick={() => move(idx, 1)} aria-label="Move down"><ArrowDown /></Button>
                </div>
              </div>
              <div className="space-y-3 p-3">
                <p className="line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">{p.caption || <span className="italic">No caption</span>}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Switch checked={p.isActive} onCheckedChange={(v) => toggle.mutate({ id: p.id, isActive: v })} aria-label="Visible" />
                    <span>{p.isActive ? "Visible" : "Hidden"}</span>
                  </div>
                  <div className="flex gap-0.5">
                    <Button size="icon" variant="ghost" className="size-7" onClick={() => refresh.mutate(p.id)} aria-label="Refresh"><RefreshCw className={cn(refresh.isPending && refresh.variables === p.id && "animate-spin")} /></Button>
                    <Button size="icon" variant="ghost" className="size-7" onClick={() => setEditing(p)} aria-label="Edit"><Pencil /></Button>
                    <Button size="icon" variant="ghost" className="size-7" asChild><a href={p.url} target="_blank" rel="noreferrer" aria-label="Open"><ExternalLink /></a></Button>
                    {can.deleteHard && <Button size="icon" variant="ghost" className="size-7 text-destructive" onClick={() => setToDelete(p)} aria-label="Delete"><Trash2 /></Button>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Share2} title="No posts yet" description="Paste an Instagram post URL; the thumbnail & caption are fetched automatically." action={<Button onClick={() => setEditing("new")}><Plus /> Add post</Button>} />
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          {editing && <SocialForm key={editing === "new" ? "new" : editing.id} post={editing === "new" ? null : editing} onDone={() => { setEditing(null); invalidate(); }} />}
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} title="Delete post?" description={toDelete?.url} loading={remove.isPending} onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }} />
    </>
  );
}

function SocialForm({ post, onDone }: { post: SocialPost | null; onDone: () => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: post ? { platform: post.platform, url: post.url, caption: post.caption ?? "", thumbnailUrl: post.thumbnailUrl ?? "", isActive: post.isActive } : { platform: "INSTAGRAM", url: "", caption: "", thumbnailUrl: "", isActive: true },
  });
  const fetchMeta = useMutation({
    mutationFn: (url: string) => api<{ data: { url: string; caption: string; thumbnailUrl: string | null } }>("/admin/social/fetch-metadata", { method: "POST", body: { url } }).then((r) => r.data),
    onSuccess: (m) => {
      form.setValue("url", m.url);
      if (m.caption) form.setValue("caption", m.caption);
      if (m.thumbnailUrl) form.setValue("thumbnailUrl", m.thumbnailUrl);
      toast.success(m.thumbnailUrl ? "Thumbnail & caption filled in" : "Caption filled in; thumbnail unavailable");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const save = useMutation({
    mutationFn: (v: Values) => {
      const body = { ...v, caption: v.caption || null, thumbnailUrl: v.thumbnailUrl || null };
      return post ? api(`/admin/social/${post.id}`, { method: "PATCH", body }) : api("/admin/social", { method: "POST", body });
    },
    onSuccess: () => { toast.success("Post saved"); onDone(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const thumb = form.watch("thumbnailUrl");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{post ? "Edit post" : "Add post"}</DialogTitle>
          <DialogDescription>Instagram URL format: https://www.instagram.com/p/CODE/ or /reel/CODE/</DialogDescription>
        </DialogHeader>
        <FormField control={form.control} name="platform" render={({ field }) => (
          <FormItem>
            <FormLabel>Platform</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>{(Object.keys(PLATFORM_LABEL) as SocialPlatform[]).map((p) => <SelectItem key={p} value={p}>{PLATFORM_LABEL[p]}</SelectItem>)}</SelectContent>
            </Select>
          </FormItem>
        )} />
        <FormField control={form.control} name="url" render={({ field }) => (
          <FormItem>
            <FormLabel>Post URL</FormLabel>
            <div className="flex gap-2">
              <FormControl><Input placeholder="https://www.instagram.com/reel/…" {...field} /></FormControl>
              <Button type="button" variant="outline" disabled={fetchMeta.isPending} onClick={() => form.trigger("url").then((ok) => ok && fetchMeta.mutate(field.value))}>
                {fetchMeta.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />} Fetch
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )} />
        {thumb && <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"><Image src={thumb} alt="" fill sizes="480px" className="object-cover" unoptimized /></div>}
        <FormField control={form.control} name="caption" render={({ field }) => (<FormItem><FormLabel>Caption</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (<FormItem><FormLabel>Thumbnail URL</FormLabel><FormControl><Input className="font-mono text-xs" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
            <FormLabel className="font-normal">Show on the site</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <DialogFooter>
          <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="animate-spin" />} Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
