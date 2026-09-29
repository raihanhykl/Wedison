"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Images, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useUploadMedia } from "@/components/admin/media-picker";
import { api, errorMessage } from "@/lib/admin/api";
import { formatBytes, formatDateTime } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { Media, Paginated } from "@/lib/admin/types";

type MediaPage = Paginated<Media> & { folders: { name: string; count: number }[] };

export function MediaView() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("all");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Media | null>(null);
  const [toDelete, setToDelete] = useState<Media | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dq = useDebounce(q);
  const upload = useUploadMedia(folder === "all" ? "general" : folder);

  const { data, isLoading } = useQuery({
    queryKey: ["media", { page, limit: 40, q: dq, folder }],
    queryFn: () => api<MediaPage>("/admin/media", { query: { page, limit: 40, q: dq, folder: folder === "all" ? undefined : folder } }),
    placeholderData: keepPreviousData,
  });

  const patch = useMutation({
    mutationFn: (v: { id: string; alt: string; caption: string; folder: string }) => api<{ data: Media }>(`/admin/media/${v.id}`, { method: "PATCH", body: { alt: v.alt || null, caption: v.caption || null, folder: v.folder || undefined } }),
    onSuccess: (r) => { toast.success("Media details saved"); setActive(r.data); qc.invalidateQueries({ queryKey: ["media"] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (m: Media) => api(`/admin/media/${m.id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Media deleted"); setToDelete(null); setActive(null); qc.invalidateQueries({ queryKey: ["media"] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const handleFiles = (files: FileList | null) => {
    const list = Array.from(files ?? []).filter((f) => f.type.startsWith("image/"));
    if (list.length) upload.mutate(list);
  };

  return (
    <>
      <PageHeader
        title="Media Library"
        description="Images for articles and pages. Raster files are converted to WebP (max 2000px) to keep them light."
        actions={
          <>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
            <Button onClick={() => fileRef.current?.click()} disabled={upload.isPending}>
              {upload.isPending ? <Loader2 className="animate-spin" /> : <Upload />} Upload
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Search file name / alt text…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="sm:max-w-xs" />
        <Select value={folder} onValueChange={(v) => { setFolder(v); setPage(1); }}>
          <SelectTrigger className="sm:w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All folders</SelectItem>
            {data?.folders.map((f) => <SelectItem key={f.name} value={f.name}>{f.name} ({f.count})</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className={cn("rounded-xl border border-dashed p-3 transition-colors", dragging ? "border-primary bg-primary/5" : "border-border")}
      >
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
            {Array.from({ length: 16 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
          </div>
        ) : data?.items.length ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
            {data.items.map((m) => (
              <button key={m.id} type="button" onClick={() => setActive(m)} className="group relative aspect-square overflow-hidden rounded-lg bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" title={m.originalName}>
                <Image src={m.url} alt={m.alt ?? m.originalName} fill sizes="160px" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" unoptimized />
                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-6 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">{m.originalName}</span>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState icon={Images} title="No media yet" description="Drag & drop images here, or click Upload." />
        )}
      </div>

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="font-mono text-xs">{data.meta.page}/{data.meta.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          {active && <MediaDetail key={active.id} media={active} onSave={(v) => patch.mutate({ id: active.id, ...v })} saving={patch.isPending} onDelete={() => setToDelete(active)} />}
        </SheetContent>
      </Sheet>

      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} title="Delete media?" description="The file is removed from the server. Articles using it as a cover will lose the image." loading={remove.isPending} onConfirm={() => { if (toDelete) remove.mutate(toDelete); }} />
    </>
  );
}

function MediaDetail({ media, onSave, saving, onDelete }: { media: Media; onSave: (v: { alt: string; caption: string; folder: string }) => void; saving: boolean; onDelete: () => void }) {
  const [alt, setAlt] = useState(media.alt ?? "");
  const [caption, setCaption] = useState(media.caption ?? "");
  const [folder, setFolder] = useState(media.folder);
  const copy = () => { navigator.clipboard.writeText(window.location.origin + media.url); toast.success("URL copied"); };
  return (
    <>
      <SheetHeader>
        <SheetTitle className="truncate">{media.originalName}</SheetTitle>
        <SheetDescription>
          {media.width && media.height ? `${media.width}×${media.height} · ` : ""}{formatBytes(media.size)} · {media.mimeType.replace("image/", "").toUpperCase()}
        </SheetDescription>
      </SheetHeader>
      <div className="space-y-4 px-4">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <Image src={media.url} alt={media.alt ?? ""} fill sizes="400px" className="object-contain" unoptimized />
        </div>
        <div className="flex gap-2">
          <Input readOnly value={media.url} className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={copy} aria-label="Copy URL"><Copy /></Button>
        </div>
        <div className="space-y-1.5">
          <Label>Alt text</Label>
          <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Short description of the image for accessibility & SEO" />
        </div>
        <div className="space-y-1.5">
          <Label>Caption</Label>
          <Textarea rows={2} value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Folder</Label>
          <Input value={folder} onChange={(e) => setFolder(e.target.value)} className="font-mono text-xs" />
        </div>
        <p className="text-xs text-muted-foreground">Uploaded {formatDateTime(media.createdAt)}{media.uploadedBy ? ` by ${media.uploadedBy.name}` : ""}</p>
      </div>
      <SheetFooter className="flex-row justify-between">
        <Button variant="ghost" className="text-destructive" onClick={onDelete}><Trash2 /> Delete</Button>
        <Button onClick={() => onSave({ alt, caption, folder })} disabled={saving}>{saving && <Loader2 className="animate-spin" />} Save</Button>
      </SheetFooter>
    </>
  );
}
