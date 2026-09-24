"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Check, ChevronsUpDown, ImagePlus, Loader2, Save, Search, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

// The Tiptap editor is heavy and browser-only -> dynamic import without SSR.
const SimpleEditor = dynamic(() => import("@/components/tiptap-templates/simple/simple-editor").then((m) => m.SimpleEditor), {
  ssr: false,
  loading: () => <Skeleton className="h-[520px] rounded-lg" />,
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedison.co";

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
  seoKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
};

const emptyTranslation = (enabled: boolean): TranslationDraft => ({
  enabled, title: "", slug: "", slugTouched: false, excerpt: "", content: null, contentHtml: "",
  seoTitle: "", seoDescription: "", seoKeywords: "", canonicalUrl: "", ogTitle: "", ogDescription: "",
});

function fromArticle(a: Article, locale: Locale): TranslationDraft {
  const t = a.translations.find((x) => x.locale === locale);
  if (!t) return emptyTranslation(false);
  return {
    enabled: true, title: t.title, slug: t.slug, slugTouched: true, excerpt: t.excerpt ?? "", content: t.content,
    contentHtml: t.contentHtml, seoTitle: t.seoTitle ?? "", seoDescription: t.seoDescription ?? "",
    seoKeywords: t.seoKeywords ?? "", canonicalUrl: t.canonicalUrl ?? "", ogTitle: t.ogTitle ?? "", ogDescription: t.ogDescription ?? "",
  };
}

function CharCount({ value, max, ideal }: { value: string; max: number; ideal?: [number, number] }) {
  const n = value.length;
  const tone = n > max ? "text-destructive" : ideal && (n < ideal[0] || n > ideal[1]) && n > 0 ? "text-chart-4" : "text-muted-foreground";
  return <span className={cn("font-mono text-[11px] font-normal", tone)}>{n}/{max}</span>;
}

export function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = !!article;

  const [status, setStatus] = useState<ContentStatus>(article?.status ?? "DRAFT");
  const [isFeatured, setIsFeatured] = useState(article?.isFeatured ?? false);
  const [noIndex, setNoIndex] = useState(article?.noIndex ?? false);
  const [publishedAt, setPublishedAt] = useState(toLocalInput(article?.publishedAt));
  const [scheduledAt, setScheduledAt] = useState(toLocalInput(article?.scheduledAt));
  const [categoryId, setCategoryId] = useState<string>(article?.categoryId ?? "none");
  const [tags, setTags] = useState<Tag[]>(article?.tags ?? []);
  const [cover, setCover] = useState<Media | null>(article?.coverImage ?? null);
  const [ogImage, setOgImage] = useState<Media | null>(article?.ogImage ?? null);
  const [tr, setTr] = useState<Record<Locale, TranslationDraft>>({
    id: article ? fromArticle(article, "id") : emptyTranslation(true),
    en: article ? fromArticle(article, "en") : emptyTranslation(false),
  });
  const [activeLocale, setActiveLocale] = useState<Locale>("id");
  const [picker, setPicker] = useState<"cover" | "og" | null>(null);
  const [dirty, setDirty] = useState(false);

  const { data: topics } = useQuery({ queryKey: ["topics"], queryFn: () => api<{ items: Category[] }>("/admin/topics").then((r) => r.items) });

  // Warn before leaving with unsaved changes
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

  // Cover alt text is stored on the media item itself (shared with the Media Library).
  const updateAlt = useMutation({
    mutationFn: (v: { id: string; alt: string }) => api<{ data: Media }>(`/admin/media/${v.id}`, { method: "PATCH", body: { alt: v.alt || null } }).then((r) => r.data),
    onSuccess: (m) => {
      setCover((c) => (c?.id === m.id ? m : c));
      setOgImage((c) => (c?.id === m.id ? m : c));
      qc.invalidateQueries({ queryKey: ["media"] });
      toast.success("Alt text saved");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

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
          seoKeywords: tr[l].seoKeywords.trim() || null,
          canonicalUrl: tr[l].canonicalUrl.trim() || null,
          ogTitle: tr[l].ogTitle.trim() || null,
          ogDescription: tr[l].ogDescription.trim() || null,
        }));
      if (!translations.length || !tr.id.enabled) throw new Error("The Indonesian version is required");
      for (const t of translations) if (t.title.length < 3) throw new Error(`Title (${t.locale.toUpperCase()}) must be at least 3 characters`);
      if (nextStatus === "SCHEDULED" && !scheduledAt) throw new Error("Please set the scheduled publish date");
      const body = {
        status: nextStatus,
        isFeatured,
        noIndex,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        coverImageId: cover?.id ?? null,
        ogImageId: ogImage?.id ?? null,
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
      toast.success(r.data.status === "PUBLISHED" ? "Article published" : r.data.status === "SCHEDULED" ? "Article scheduled" : "Article saved");
      if (!isEdit) router.replace(`/admin/cms/articles/${r.data.id}`);
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const publicUrl = article?.status === "PUBLISHED" && tr.id.slug ? `/id/media-center/artikel/${tr.id.slug}/` : null;
  const primaryAction = status === "SCHEDULED" && scheduledAt ? "SCHEDULED" : "PUBLISHED";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/cms/articles"><ArrowLeft /> Articles</Link>
        </Button>
        <div className="ml-auto flex items-center gap-2">
          {isEdit && <StatusBadge status={status} />}
          {dirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
          <Button variant="outline" disabled={save.isPending} onClick={() => save.mutate(status === "PUBLISHED" ? "PUBLISHED" : status === "SCHEDULED" ? "SCHEDULED" : "DRAFT")}>
            {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} {status === "PUBLISHED" ? "Update" : status === "SCHEDULED" ? "Save schedule" : "Save draft"}
          </Button>
          {status !== "PUBLISHED" && (
            <Button disabled={save.isPending} onClick={() => save.mutate(primaryAction)}>
              <Send /> {primaryAction === "SCHEDULED" ? "Schedule" : "Publish"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* ── Content ─────────────────────────────────────────── */}
        <div className="min-w-0 space-y-4">
          <Tabs value={activeLocale} onValueChange={(v) => setActiveLocale(v as Locale)}>
            <div className="flex items-center justify-between gap-2">
              <TabsList>
                <TabsTrigger value="id">🇮🇩 Indonesian</TabsTrigger>
                <TabsTrigger value="en">🇬🇧 English {!tr.en.enabled && <span className="ml-1 text-muted-foreground">(empty)</span>}</TabsTrigger>
              </TabsList>
              {activeLocale === "en" && (
                <div className="flex items-center gap-2 text-sm">
                  <Switch id="en-enabled" checked={tr.en.enabled} onCheckedChange={(v) => update("en", { enabled: v })} />
                  <Label htmlFor="en-enabled">Provide an English version</Label>
                </div>
              )}
            </div>

            {(["id", "en"] as Locale[]).map((locale) => {
              const t = tr[locale];
              const snippetTitle = t.seoTitle || t.title || "Article title";
              const snippetDesc = t.seoDescription || t.excerpt || "Meta description preview — fill in the excerpt or SEO description.";
              const snippetUrl = `${SITE}/${locale}/media-center/artikel/${t.slug || "slug"}/`;
              return (
                <TabsContent key={locale} value={locale} className="mt-4 space-y-4">
                  {locale === "en" && !t.enabled ? (
                    <Card className="border-dashed">
                      <CardContent className="py-10 text-center text-sm text-muted-foreground">
                        The English version is disabled. Turn on the switch above to write the translation.
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Input
                          value={t.title}
                          onChange={(e) => update(locale, { title: e.target.value })}
                          placeholder={locale === "id" ? "Judul artikel" : "Article title"}
                          className="h-12 !text-xl font-display font-bold tracking-tight border-transparent bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-transparent"
                        />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono">/{locale}/media-center/artikel/</span>
                          <Input
                            value={t.slug}
                            onChange={(e) => update(locale, { slug: slugify(e.target.value), slugTouched: true })}
                            className="h-7 font-mono text-xs max-w-xs"
                            placeholder="auto-generated-slug"
                          />
                        </div>
                      </div>

                      {/* key forces a remount per locale so the initial content is correct */}
                      <SimpleEditor
                        key={`${article?.id ?? "new"}-${locale}`}
                        content={(t.content as never) ?? t.contentHtml}
                        onChange={(c: SimpleEditorChange) => update(locale, { content: c.json, contentHtml: c.html })}
                      />

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Excerpt</CardTitle>
                          <CardDescription>Shown on cards and used as the default meta description.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Textarea value={t.excerpt} onChange={(e) => update(locale, { excerpt: e.target.value })} rows={3} placeholder="Leave empty to generate from the content." />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base"><Search className="size-4" /> SEO</CardTitle>
                          <CardDescription>Search snippet, keywords and canonical for the {locale.toUpperCase()} version.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          {/* Google-style snippet preview */}
                          <div className="rounded-lg border border-border bg-muted/40 p-4">
                            <p className="font-mono text-[11px] text-muted-foreground truncate">{snippetUrl}</p>
                            <p className="mt-1 text-[17px] leading-snug text-[#1a0dab] dark:text-[#8ab4f8] line-clamp-1">{snippetTitle}</p>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{snippetDesc}</p>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                              <Label className="flex items-center justify-between">SEO title <CharCount value={t.seoTitle} max={70} ideal={[30, 60]} /></Label>
                              <Input value={t.seoTitle} maxLength={70} onChange={(e) => update(locale, { seoTitle: e.target.value })} placeholder={t.title || "Defaults to the title"} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="flex items-center justify-between">Meta description <CharCount value={t.seoDescription} max={170} ideal={[70, 160]} /></Label>
                              <Input value={t.seoDescription} maxLength={170} onChange={(e) => update(locale, { seoDescription: e.target.value })} placeholder="Defaults to the excerpt" />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                              <Label>Keywords <span className="font-normal text-muted-foreground">(comma separated)</span></Label>
                              <Input value={t.seoKeywords} maxLength={300} onChange={(e) => update(locale, { seoKeywords: e.target.value })} placeholder="motor listrik, supercharge, wedison" />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2">
                              <Label>Canonical URL <span className="font-normal text-muted-foreground">(optional, for republished content)</span></Label>
                              <Input value={t.canonicalUrl} onChange={(e) => update(locale, { canonicalUrl: e.target.value })} placeholder={snippetUrl} className="font-mono text-xs" />
                            </div>
                          </div>
                          <div className="border-t border-border pt-4">
                            <p className="mb-3 text-sm font-medium">Social sharing (Open Graph / Twitter)</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-1.5">
                                <Label className="flex items-center justify-between">OG title <CharCount value={t.ogTitle} max={100} /></Label>
                                <Input value={t.ogTitle} maxLength={100} onChange={(e) => update(locale, { ogTitle: e.target.value })} placeholder="Defaults to the SEO title" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="flex items-center justify-between">OG description <CharCount value={t.ogDescription} max={200} /></Label>
                                <Input value={t.ogDescription} maxLength={200} onChange={(e) => update(locale, { ogDescription: e.target.value })} placeholder="Defaults to the meta description" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>

        {/* ── Side panel ──────────────────────────────────────── */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
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
                  <Label>Publish on</Label>
                  <Input type="datetime-local" value={scheduledAt} onChange={(e) => { setScheduledAt(e.target.value); setDirty(true); }} />
                  <p className="text-xs text-muted-foreground">The article goes live automatically at this time.</p>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Publish date <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input type="datetime-local" value={publishedAt} onChange={(e) => { setPublishedAt(e.target.value); setDirty(true); }} />
                <p className="text-xs text-muted-foreground">Empty = when published. Set it to backdate.</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label htmlFor="featured">Featured article</Label>
                  <p className="text-xs text-muted-foreground">Highlighted on the Media Center.</p>
                </div>
                <Switch id="featured" checked={isFeatured} onCheckedChange={(v) => { setIsFeatured(v); setDirty(true); }} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label htmlFor="noindex">Hide from search engines</Label>
                  <p className="text-xs text-muted-foreground">Adds robots noindex.</p>
                </div>
                <Switch id="noindex" checked={noIndex} onCheckedChange={(v) => { setNoIndex(v); setDirty(true); }} />
              </div>
              {publicUrl && (
                <a href={publicUrl} target="_blank" rel="noreferrer" className="block text-xs text-primary underline underline-offset-4">View on site ↗</a>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cover image</CardTitle>
              <CardDescription>Shown on cards and at the top of the article.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {cover ? (
                <>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
                    <Image src={cover.url} alt={cover.alt ?? ""} fill sizes="360px" className="object-cover" unoptimized />
                    <Button size="icon" variant="secondary" className="absolute right-2 top-2 size-7" onClick={() => { setCover(null); setDirty(true); }} aria-label="Remove cover"><X /></Button>
                  </div>
                  <AltTextField key={cover.id} media={cover} onSave={(alt) => updateAlt.mutate({ id: cover.id, alt })} saving={updateAlt.isPending} />
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setPicker("cover")}>Change image</Button>
                </>
              ) : (
                <button type="button" onClick={() => setPicker("cover")} className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground hover:bg-muted">
                  <ImagePlus className="size-5" /> Choose from Media Library
                </button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Social share image</CardTitle>
              <CardDescription>Optional 1200×630 image for link previews. Defaults to the cover.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {ogImage ? (
                <>
                  <div className="relative aspect-[1200/630] overflow-hidden rounded-lg bg-muted">
                    <Image src={ogImage.url} alt={ogImage.alt ?? ""} fill sizes="360px" className="object-cover" unoptimized />
                    <Button size="icon" variant="secondary" className="absolute right-2 top-2 size-7" onClick={() => { setOgImage(null); setDirty(true); }} aria-label="Remove share image"><X /></Button>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setPicker("og")}>Change image</Button>
                </>
              ) : (
                <Button variant="outline" size="sm" className="w-full" onClick={() => setPicker("og")}><ImagePlus /> Choose image</Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Classification</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Topic</Label>
                <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setDirty(true); }}>
                  <SelectTrigger><SelectValue placeholder="Choose a topic" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No topic</SelectItem>
                    {topics?.map((c) => <SelectItem key={c.id} value={c.id}>{c.nameEn ?? c.nameId}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Tags</Label>
                <TagPicker value={tags} onChange={(v) => { setTags(v); setDirty(true); }} />
              </div>
            </CardContent>
          </Card>

          {isEdit && (
            <p className="px-1 text-xs text-muted-foreground">
              Author: {article.author?.name ?? "—"} · {article.viewCount} reads
            </p>
          )}
        </aside>
      </div>

      <MediaPickerDialog
        open={picker !== null}
        onOpenChange={(o) => !o && setPicker(null)}
        onSelect={(m) => {
          if (picker === "og") setOgImage(m);
          else setCover(m);
          setDirty(true);
          setPicker(null);
        }}
      />
    </div>
  );
}

function AltTextField({ media, onSave, saving }: { media: Media; onSave: (alt: string) => void; saving: boolean }) {
  const [alt, setAlt] = useState(media.alt ?? "");
  const changed = alt !== (media.alt ?? "");
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center justify-between">
        Alt text {!media.alt && <span className="font-normal text-chart-4">missing</span>}
      </Label>
      <div className="flex gap-2">
        <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image for accessibility & SEO" />
        <Button size="sm" variant="outline" disabled={!changed || saving} onClick={() => onSave(alt.trim())}>
          {saving ? <Loader2 className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

/** Multi-select tag picker with search + inline tag creation (Command/Popover). */
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
              <button type="button" onClick={() => onChange(value.filter((x) => x.id !== t.id))} className="rounded-sm hover:bg-foreground/10" aria-label={`Remove tag ${t.name}`}><X className="size-3" /></button>
            </Badge>
          ))}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal text-muted-foreground">
            Add tag… <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput ref={inputRef} placeholder="Search or create a tag" value={q} onValueChange={setQ} />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {all?.map((t) => (
                  <CommandItem key={t.id} value={t.name} onSelect={() => onChange(selectedIds.has(t.id) ? value.filter((x) => x.id !== t.id) : [...value, t])}>
                    <Check className={cn("size-4", selectedIds.has(t.id) ? "opacity-100" : "opacity-0")} /> {t.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              {q.trim().length > 0 && !exact && (
                <CommandGroup heading="New">
                  <CommandItem value={`__create_${q}`} onSelect={() => create.mutate(q.trim())}>
                    + Create tag “{q.trim()}”
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
