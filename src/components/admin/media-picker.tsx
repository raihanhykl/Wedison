"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ImagePlus, Loader2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api, errorMessage } from "@/lib/admin/api";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { Media, Paginated } from "@/lib/admin/types";

export function useUploadMedia(folder = "general") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (files: File[]) => {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      form.append("folder", folder);
      return api<{ items: Media[] }>("/admin/media/upload", { method: "POST", body: form });
    },
    onSuccess: (r) => {
      toast.success(`${r.items.length} file diunggah`);
      qc.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
}

/** Dialog pilih gambar dari Media Library, dengan unggah cepat. */
export function MediaPickerDialog({ open, onOpenChange, onSelect, folder = "articles" }: { open: boolean; onOpenChange: (o: boolean) => void; onSelect: (m: Media) => void; folder?: string }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [picked, setPicked] = useState<Media | null>(null);
  const dq = useDebounce(q);
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = useUploadMedia(folder);

  const { data, isLoading } = useQuery({
    queryKey: ["media", { page, limit: 24, q: dq, mime: "image/" }],
    queryFn: () => api<Paginated<Media>>("/admin/media", { query: { page, limit: 24, q: dq, mime: "image/" } }),
    placeholderData: keepPreviousData,
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>Pilih gambar atau unggah baru. Gambar dikonversi ke WebP otomatis.</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input placeholder="Cari nama file / alt…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) upload.mutate(files, { onSuccess: (r) => setPicked(r.items[0] ?? null) });
            e.target.value = "";
          }} />
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={upload.isPending}>
            {upload.isPending ? <Loader2 className="animate-spin" /> : <Upload />} Unggah
          </Button>
        </div>
        <ScrollArea className="h-[52vh] rounded-lg border border-border p-2">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-md" />)}
            </div>
          ) : data?.items.length ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {data.items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPicked(m)}
                  onDoubleClick={() => onSelect(m)}
                  className={cn("group relative aspect-square overflow-hidden rounded-md bg-muted ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", picked?.id === m.id && "ring-2 ring-primary")}
                  title={m.originalName}
                >
                  <Image src={m.url} alt={m.alt ?? m.originalName} fill sizes="120px" className="object-cover" unoptimized />
                  {picked?.id === m.id && (
                    <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-3" /></span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <ImagePlus className="size-6" /> Belum ada gambar. Unggah untuk memulai.
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {data?.meta && (
              <>
                <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Sebelumnya</Button>
                <span className="font-mono">{data.meta.page}/{data.meta.totalPages}</span>
                <Button variant="ghost" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>Berikutnya</Button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button disabled={!picked} onClick={() => picked && onSelect(picked)}>Gunakan gambar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
