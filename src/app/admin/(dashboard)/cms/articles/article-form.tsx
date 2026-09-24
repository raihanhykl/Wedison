"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Check, ChevronsUpDown, ImagePlus, Loader2, Save, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/admin/status-badge";
import { MediaPickerDialog } from "@/components/admin/media-picker";
import { api, errorMessage } from "@/lib/admin/api";
import { slugify, toLocalInput } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, type Article, type Category, type ContentStatus, type Locale, type Media, type Tag } from "@/lib/admin/types";
import type { SimpleEditorChange } from "@/components/tiptap-templates/simple/simple-editor";

// Editor Tiptap berat + browser-only -> dynamic import tanpa SSR.
const SimpleEditor = dynamic(() => import("@/components/tiptap-templates/simple/simple-editor").then((m) => m.SimpleEditor), {
  ssr: false,
  loading: () => <Skeleton className="h-[520px] rounded-lg" />,
});

type TranslationDraft = {
  enabled: boolean;
  title: string;
  slug: string;
  slugTouched: boolean;
  excerpt: string;
  content: unknown;
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
};

const emptyTranslation = (enabled: boolean): TranslationDraft => ({
  enabled, title: "", slug: "", slugTouched: false, excerpt: "", content: null, contentHtml: "", seoTitle: "", seoDescription: "",
});

function fromArticle(a: Article, locale: Locale): TranslationDraft {
  const t = a.translations.find((x) => x.locale === locale);
  if (!t) return emptyTranslation(false);
  return {
    enabled: true, title: t.title, slug: t.slug, slugTouched: true, excerpt: t.excerpt ?? "", content: t.content,
    contentHtml: t.contentHtml, seoTitle: t.seoTitle ?? "", seoDescription: t.seoDescription ?? "",
  };
}

export function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = !!article;

  const [status, setStatus] = useState<ContentStatus>(article?.status ?? "DRAFT");
  const [isFeatured, setIsFeatured] = useState(article?.isFeatured ?? false);
  const [publishedAt, setPublishedAt] = useState(toLocalInput(article?.publishedAt));
  const [scheduledAt, setScheduledAt] = useState(toLocalInput(article?.scheduledAt));
  const [categoryId, setCategoryId] = useState<string>(article?.categoryId ?? "none");
  const [tags, setTags] = useState<Tag[]>(article?.tags ?? []);
  const [cover, setCover] = useState<Media | null>(article?.coverImage ?? null);
  const [tr, setTr] = useState<Record<Locale, TranslationDraft>>({
    id: article ? fromArticle(article, "id") : emptyTranslation(true),
    en: article ? fromArticle(article, "en") : emptyTranslation(false),
  });
  const [activeLocale, setActiveLocale] = useState<Locale>("id");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: () => api<{ items: Category[] }>("/admin/categories").then((r) => r.items) });

  // Peringatan saat meninggalkan halaman dengan perubahan belum disimpan
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const update = (locale: Locale, patch: Partial<TranslationDraft>) => {
    setDirty(true);
    setTr((prev) => {
      const next = { ...prev[locale], ...patch };
      if (patch.title !== undefined && !next.slugTouched) next.slug = slugify(patch.title);
      return { ...prev, [locale]: next };
    });
  };

  const save = useMutation({
    mutationFn: async (nextStatus: ContentStatus) => {
      const translations = (["id", "en"] as Locale[])
        .filter((l) => tr[l].enabled)
        .map((l) => ({
          locale: l,
          title: tr[l].title.trim(),
          slug: tr[l].slug.trim() || undefined,
          excerpt: tr[l].excerpt.trim() || null,
          content: tr[l].content ?? { type: "doc", content: [] },
          contentHtml: tr[l].contentHtml,
          seoTitle: tr[l].seoTitle.trim() || null,
          seoDescription: tr[l].seoDescription.trim() || null,
        }));
      if (!translations.length || !tr.id.enabled) throw new Error("Versi Bahasa Indonesia wajib diisi");
      for (const t of translations) if (t.title.length < 3) throw new Error(`Judul (${t.locale.toUpperCase()}) minimal 3 karakter`);
      if (nextStatus === "SCHEDULED" && !scheduledAt) throw new Error("Isi tanggal jadwal tayang");
      const body = {
        status: nextStatus,
        isFeatured,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        coverImageId: cover?.id ?? null,
        categoryId: categoryId === "none" ? null : categoryId,
        tagIds: tags.map((t) => t.id),
        translations,
      };
      return isEdit
        ? api<{ data: Article }>(`/admin/articles/${article.id}`, { method: "PUT", body })
        : api<{ data: Article }>("/admin/articles", { method: "POST", body });
    },
    onSuccess: (r) => {
      setDirty(false);
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.setQueryData(["article", r.data.id], r.data);
      setStatus(r.data.status);
      toast.success(r.data.status === "PUBLISHED" ? "Artikel tayang" : "Artikel disimpan");
      if (!isEdit) router.replace(`/admin/cms/articles/${r.data.id}`);
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const t = tr[activeLocale];
  const publicUrl = article?.status === "PUBLISHED" && tr.id.slug ? `/id/media-center/artikel/${tr.id.slug}/` : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/cms/articles"><ArrowLeft /> Artikel</Link>
        </Button>
        <div className="ml-auto flex items-center gap-2">
          {isEdit && <StatusBadge status={status} />}
          {dirty && <span className="text-xs text-muted-foreground">Belum disimpan</span>}
          <Button variant="outline" disabled={save.isPending} onClick={() => save.mutate(status === "PUBLISHED" ? "PUBLISHED" : status === "SCHEDULED" ? "SCHEDULED" : "DRAFT")}>
            {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} {status === "PUBLISHED" ? "Perbarui" : "Simpan draf"}
          </Button>
          {status !== "PUBLISHED" && (
            <Button disabled={save.isPending} onClick={() => save.mutate(status === "SCHEDULED" && scheduledAt ? "SCHEDULED" : "PUBLISHED")}>
              <Send /> {status === "SCHEDULED" && scheduledAt ? "Jadwalkan" : "Tayangkan"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* ── Konten ───────────────────────────────────────────── */}
        <div className="min-w-0 space-y-4">
          <Tabs value={activeLocale} onValueChange={(v) => setActiveLocale(v as Locale)}>
            <div className="flex items-center justify-between gap-2">
              <TabsList>
                <TabsTrigger value="id">🇮🇩 Indonesia</TabsTrigger>
                <TabsTrigger value="en">🇬🇧 English {!tr.en.enabled && <span className="ml-1 text-muted-foreground">(kosong)</span>}</TabsTrigger>
              </TabsList>
              {activeLocale === "en" && (
                <div className="flex items-center gap-2 text-sm">
                  <Switch id="en-enabled" checked={tr.en.enabled} onCheckedChange={(v) => update("en", { enabled: v })} />
                  <Label htmlFor="en-enabled">Sediakan versi EN</Label>
                </div>
              )}
            </div>

            {(["id", "en"] as Locale[]).map((locale) => (
              <TabsContent key={locale} value={locale} className="mt-4 space-y-4">
                {locale === "en" && !tr.en.enabled ? (
                  <Card className="border-dashed">
                    <CardContent className="py-10 text-center text-sm text-muted-foreground">
                      Versi English belum diaktifkan. Nyalakan sakelar di atas untuk menulis terjemahan.
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Input
                        value={tr[locale].title}
                        onChange={(e) => update(locale, { title: e.target.value })}
                        placeholder={locale === "id" ? "Judul artikel" : "Article title"}
                        className="h-12 !text-xl font-display font-bold tracking-tight border-transparent bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-transparent"
                      />
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">/{locale}/media-center/artikel/</span>
                        <Input
                          value={tr[locale].slug}
                          onChange={(e) => update(locale, { slug: slugify(e.target.value), slugTouched: true })}
                          className="h-7 font-mono text-xs max-w-xs"
                          placeholder="slug-otomatis"
                        />
                      </div>
                    </div>

                    {/* key memaksa editor remount per-locale agar konten awal benar */}
                    <SimpleEditor
                      key={`${article?.id ?? "new"}-${locale}`}
                      content={(tr[locale].content as never) ?? tr[locale].contentHtml}
                      onChange={(c: SimpleEditorChange) => update(locale, { content: c.json, contentHtml: c.html })}
                    />

                    <Card>
                      <CardHeader className="pb-3"><CardTitle className="text-base">Ringkasan & SEO</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                          <Label>Ringkasan (excerpt)</Label>
                          <Textarea value={tr[locale].excerpt} onChange={(e) => update(locale, { excerpt: e.target.value })} rows={3} placeholder="Kosongkan untuk diambil otomatis dari isi." />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label>Judul SEO <span className="text-muted-foreground font-normal">({tr[locale].seoTitle.length}/70)</span></Label>
                            <Input value={tr[locale].seoTitle} maxLength={70} onChange={(e) => update(locale, { seoTitle: e.target.value })} placeholder={tr[locale].title || "Sama dengan judul"} />
                          </div>
                          <div className="space-y-1.5">
                            <Label>Deskripsi SEO <span className="text-muted-foreground font-normal">({tr[locale].seoDescription.length}/170)</span></Label>
                            <Input value={tr[locale].seoDescription} maxLength={170} onChange={(e) => update(locale, { seoDescription: e.target.value })} placeholder="Sama dengan ringkasan" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* ── Panel samping ─────────────────────────────────────── */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Publikasi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => { setStatus(v as ContentStatus); setDirty(true); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_LABEL) as ContentStatus[]).map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {status === "SCHEDULED" && (
                <div className="space-y-1.5">
                  <Label>Jadwal tayang</Label>
                  <Input type="datetime-local" value={scheduledAt} onChange={(e) => { setScheduledAt(e.target.value); setDirty(true); }} />
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Tanggal terbit <span className="text-muted-foreground font-normal">(opsional)</span></Label>
                <Input type="datetime-local" value={publishedAt} onChange={(e) => { setPublishedAt(e.target.value); setDirty(true); }} />
                <p className="text-xs text-muted-foreground">Kosong = saat ditayangkan. Isi untuk backdate.</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label htmlFor="featured">Artikel unggulan</Label>
                  <p className="text-xs text-muted-foreground">Tampil menonjol di Media Center.</p>
                </div>
                <Switch id="featured" checked={isFeatured} onCheckedChange={(v) => { setIsFeatured(v); setDirty(true); }} />
              </div>
              {publicUrl && (
                <a href={publicUrl} target="_blank" rel="noreferrer" className="block text-xs text-primary underline underline-offset-4">Lihat di situs ↗</a>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Gambar sampul</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {cover ? (
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
                  <Image src={cover.url} alt={cover.alt ?? ""} fill sizes="360px" className="object-cover" unoptimized />
                  <Button size="icon" variant="secondary" className="absolute right-2 top-2 size-7" onClick={() => { setCover(null); setDirty(true); }} aria-label="Hapus sampul"><X /></Button>
                </div>
              ) : (
                <button type="button" onClick={() => setPickerOpen(true)} className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground hover:bg-muted">
                  <ImagePlus className="size-5" /> Pilih dari Media Library
                </button>
              )}
              {cover && <Button variant="outline" size="sm" className="w-full" onClick={() => setPickerOpen(true)}>Ganti gambar</Button>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Klasifikasi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Kategori</Label>
                <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setDirty(true); }}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa kategori</SelectItem>
                    {categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.nameId}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Tag</Label>
                <TagPicker value={tags} onChange={(v) => { setTags(v); setDirty(true); }} />
              </div>
            </CardContent>
          </Card>

          {isEdit && (
            <p className="px-1 text-xs text-muted-foreground">
              Penulis: {article.author?.name ?? "—"} · Dibaca {article.viewCount}×
            </p>
          )}
        </aside>
      </div>

      <MediaPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} onSelect={(m) => { setCover(m); setDirty(true); setPickerOpen(false); }} />
      <span className="hidden">{t.title}</span>
    </div>
  );
}

/** Multi-select tag dengan pencarian + buat tag baru inline (Command/Popover). */
function TagPicker({ value, onChange }: { value: Tag[]; onChange: (v: Tag[]) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: all } = useQuery({ queryKey: ["tags"], queryFn: () => api<{ items: Tag[] }>("/admin/tags").then((r) => r.items) });
  const create = useMutation({
    mutationFn: (name: string) => api<{ data: Tag }>("/admin/tags", { method: "POST", body: { name } }).then((r) => r.data),
    onSuccess: (tag) => {
      qc.invalidateQueries({ queryKey: ["tags"] });
      if (!value.some((t) => t.id === tag.id)) onChange([...value, tag]);
      setQ("");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const selectedIds = useMemo(() => new Set(value.map((t) => t.id)), [value]);
  const exact = all?.some((t) => t.name.toLowerCase() === q.trim().toLowerCase());

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((t) => (
            <Badge key={t.id} variant="secondary" className="gap-1 pr-1">
              {t.name}
              <button type="button" onClick={() => onChange(value.filter((x) => x.id !== t.id))} className="rounded-sm hover:bg-foreground/10" aria-label={`Hapus tag ${t.name}`}><X className="size-3" /></button>
            </Badge>
          ))}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal text-muted-foreground">
            Tambah tag… <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput ref={inputRef} placeholder="Cari atau buat tag" value={q} onValueChange={setQ} />
            <CommandList>
              <CommandEmpty>Tidak ada tag.</CommandEmpty>
              <CommandGroup>
                {all?.map((t) => (
                  <CommandItem key={t.id} value={t.name} onSelect={() => onChange(selectedIds.has(t.id) ? value.filter((x) => x.id !== t.id) : [...value, t])}>
                    <Check className={cn("size-4", selectedIds.has(t.id) ? "opacity-100" : "opacity-0")} /> {t.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              {q.trim().length > 0 && !exact && (
                <CommandGroup heading="Baru">
                  <CommandItem value={`__create_${q}`} onSelect={() => create.mutate(q.trim())}>
                    + Buat tag “{q.trim()}”
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
