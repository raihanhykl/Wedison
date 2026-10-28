"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Archive, ArrowLeft, CheckCircle2, CircleAlert, Copy, ExternalLink, Eye, Link2, Loader2, Lock, MessageSquareText, RotateCcw, Save, Send, Trash2, Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  TEASER_STATUS_HELP, TeaserStatusBadge, eventPhase, inquiriesUrl, liveUrl, previewUrl, useTeaserPermissions,
} from "@/components/admin/teasers/shared";
import { ApiError, api, errorMessage } from "@/lib/admin/api";
import { formatDateTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { issueTab, teaserIssues, type TeaserIssue } from "@/lib/teasers/issues";
import type { TeaserContent, TeaserLocale } from "@/lib/teasers/teaser";
import type { AdminTeaser } from "@/lib/admin/types";
import { formFacts, initialState, toPayload, zonedIso, type TeaserFormState } from "./form-state";
import { EventTab } from "./event-tab";
import { TextTab } from "./text-tab";
import { ImagesTab } from "./images-tab";
import { SeoTab } from "./seo-tab";

type Tab = "event" | "text" | "images" | "seo";
type Action = "publish" | "unpublish" | "archive" | "restore";
const ACTION_DONE: Record<Action, string> = { publish: "Teaser published: it is live now", unpublish: "Unpublished: back to draft", archive: "Teaser archived", restore: "Restored as draft" };

/** Galat dari API: judul + maksimal 3 hal yang perlu dibereskan (bukan satu kalimat panjang). */
function showError(e: unknown) {
  if (e instanceof ApiError && e.details?.length) {
    const list = e.details.slice(0, 3).map((d) => `• ${d.message}`).join("\n");
    const more = e.details.length > 3 ? `\n…and ${e.details.length - 3} more (see the checklist)` : "";
    toast.error(e.message, { description: <span className="whitespace-pre-line">{list + more}</span> });
  } else toast.error(errorMessage(e));
}

export function TeaserForm({ teaser }: { teaser?: AdminTeaser }) {
  const router = useRouter();
  const qc = useQueryClient();
  const perm = useTeaserPermissions().data;
  const isEdit = !!teaser;
  const [saved, setSaved] = useState<AdminTeaser | undefined>(teaser);
  const status = saved?.status ?? "DRAFT";
  const live = status === "PUBLISHED";
  const locked = live && !!perm && !perm.publish;
  const readOnly = !perm?.write || locked;

  const [s, setS] = useState<TeaserFormState>(() => initialState(teaser));
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState<Tab>("event");
  const [locale, setLocale] = useState<TeaserLocale>("id");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [confirm, setConfirm] = useState<"delete" | "archive" | "unpublish" | null>(null);
  const [focus, setFocus] = useState<{ section: string; n: number } | null>(null);

  const set = useCallback(<K extends keyof TeaserFormState>(key: K, value: TeaserFormState[K]) => {
    setS((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);
  const edit = useCallback((l: TeaserLocale, fn: (c: TeaserContent) => void) => {
    setS((prev) => {
      const draft = structuredClone(prev.content[l]);
      fn(draft);
      return { ...prev, content: { ...prev.content, [l]: draft } };
    });
    setDirty(true);
  }, []);

  const facts = useMemo(() => ({ id: formFacts(s, "id"), en: formFacts(s, "en") }), [s]);
  const issues = useMemo<TeaserIssue[]>(() => teaserIssues(s), [s]);
  const issuePaths = useMemo(() => new Set(issues.map((i) => i.path)), [issues]);
  const issueCount = useCallback((prefix: string) => issues.filter((i) => i.path.startsWith(prefix)).length, [issues]);
  const tabIssues = (t: Tab) => issues.filter((i) => issueTab(i.path) === t).length;

  // Peringatan saat menutup tab dengan perubahan belum tersimpan.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const refresh = (t?: AdminTeaser) => {
    qc.invalidateQueries({ queryKey: ["teasers"] });
    qc.invalidateQueries({ queryKey: ["contact-sources"] });
    if (t) {
      qc.setQueryData(["teaser", t.id], t);
      setSaved(t);
    }
  };

  const persist = async () => {
    const body = toPayload(s);
    const r = isEdit || saved
      ? await api<{ data: AdminTeaser }>(`/admin/teasers/${saved!.id}`, { method: "PUT", body })
      : await api<{ data: AdminTeaser }>("/admin/teasers", { method: "POST", body });
    return r.data;
  };

  const save = useMutation({
    mutationFn: persist,
    onSuccess: (t) => {
      setDirty(false);
      refresh(t);
      toast.success(isEdit ? (t.status === "PUBLISHED" ? "Saved: the live page is updated" : "Changes saved") : "Draft created");
      if (!isEdit) router.replace(`/admin/teasers/${t.id}`);
    },
    onError: showError,
  });

  const transition = useMutation({
    mutationFn: async (action: Action) => {
      if (dirty && saved && !readOnly) {
        const t = await persist();
        refresh(t);
        setDirty(false);
      }
      return api<{ data: AdminTeaser }>(`/admin/teasers/${saved!.id}/transition`, { method: "POST", body: { action } }).then((r) => r.data);
    },
    onSuccess: (t, action) => { refresh(t); setConfirm(null); toast.success(ACTION_DONE[action]); },
    onError: showError,
  });

  const duplicate = useMutation({
    mutationFn: () => api<{ data: AdminTeaser }>(`/admin/teasers/${saved!.id}/duplicate`, { method: "POST" }).then((r) => r.data),
    onSuccess: (t) => { refresh(); toast.success("Copy created as a draft"); router.push(`/admin/teasers/${t.id}`); },
    onError: showError,
  });
  const remove = useMutation({
    mutationFn: () => api(`/admin/teasers/${saved!.id}`, { method: "DELETE" }),
    onSuccess: () => { setDirty(false); refresh(); toast.success("Teaser deleted"); router.replace("/admin/teasers"); },
    onError: showError,
  });

  // Ctrl/Cmd + S = simpan.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!readOnly && !save.isPending) save.mutate();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  /** Preview: simpan dulu bila ada perubahan (draft), lalu buka halaman dalam draft mode. */
  const openPreview = async (l: TeaserLocale) => {
    if (!saved) return;
    const win = window.open("about:blank", "_blank");
    try {
      let slug = saved.slug;
      if (dirty && !readOnly && !live) {
        const t = await persist();
        refresh(t);
        setDirty(false);
        slug = t.slug;
        toast.success("Saved before preview");
      }
      if (win) win.location.href = previewUrl(slug, l);
    } catch (e) {
      win?.close();
      showError(e);
    }
  };

  const busy = save.isPending || transition.isPending;
  const startAt = zonedIso(s.startDate, s.startTime, s.timeZone);
  const endAt = zonedIso(s.endDate, s.endTime, s.timeZone);
  const phase = startAt && endAt ? eventPhase({ startAt, endAt }) : null;
  /** Klik item checklist: buka tab, bahasa, dan section tempat memperbaikinya. */
  const jump = (i: TeaserIssue) => {
    setTab(issueTab(i.path));
    const [, l, section] = i.path.split(".");
    if (l === "id" || l === "en") setLocale(l);
    if (section && section !== "seo") setFocus((f) => ({ section, n: (f?.n ?? 0) + 1 }));
  };

  return (
    <div className="space-y-4">
      {/* Bilah aksi */}
      <div className="sticky top-14 z-20 -mx-4 flex flex-wrap items-center gap-2 border-b border-border bg-background/95 px-4 py-2 backdrop-blur md:-mx-6 md:px-6">
        <Button variant="ghost" size="sm" asChild><Link href="/admin/teasers"><ArrowLeft /> Opening Teasers</Link></Button>
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">{s.city || (isEdit ? "Untitled teaser" : "New teaser")}</p>
        </div>
        {saved && <TeaserStatusBadge status={status} />}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {dirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
          {saved && (
            <Button variant="outline" disabled={busy} onClick={() => void openPreview(locale)}>
              <Eye /> Preview
            </Button>
          )}
          {!readOnly && (
            <Button variant={saved && status !== "PUBLISHED" && perm?.publish ? "outline" : "default"} disabled={busy || (!dirty && !!saved)} onClick={() => save.mutate()}>
              {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} {saved ? (live ? "Save & update live page" : "Save") : "Create draft"}
            </Button>
          )}
          {saved && perm?.publish && status === "DRAFT" && (
            <Button disabled={busy || issues.length > 0} onClick={() => transition.mutate("publish")} title={issues.length ? "Fix the checklist first" : undefined}>
              {transition.isPending ? <Loader2 className="animate-spin" /> : <Send />} Publish
            </Button>
          )}
        </div>
      </div>

      {locked && (
        <Alert><Lock className="size-4" /><AlertTitle>Read-only</AlertTitle><AlertDescription>This teaser is live. Only roles that can publish teasers may change it. Ask a publisher, or duplicate it to prepare changes as a draft.</AlertDescription></Alert>
      )}
      {!perm?.write && perm && (
        <Alert><Lock className="size-4" /><AlertTitle>View only</AlertTitle><AlertDescription>Your role can view teasers but not change them.</AlertDescription></Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="min-w-0">
          <TabsList className="h-auto flex-wrap">
            {([
              ["event", "Event & contact"],
              ["text", "Page text"],
              ["images", "Images"],
              ["seo", "SEO & sharing"],
            ] as [Tab, string][]).map(([key, label]) => (
              <TabsTrigger key={key} value={key} className="gap-1.5">
                {label}
                {tabIssues(key) > 0 && <span className="rounded-full bg-chart-4/25 px-1.5 font-mono text-[10px]">{tabIssues(key)}</span>}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="event" className="mt-4">
            <EventTab s={s} set={set} edit={edit} readOnly={readOnly} facts={facts} teaserId={saved?.id} slugTouched={slugTouched} onSlugTouched={() => setSlugTouched(true)} issuePaths={issuePaths} />
          </TabsContent>
          <TabsContent value="text" className="mt-4">
            <TextTab s={s} set={set} edit={edit} readOnly={readOnly} facts={facts} locale={locale} onLocale={setLocale} issueCount={issueCount} focus={focus} />
          </TabsContent>
          <TabsContent value="images" className="mt-4">
            <ImagesTab s={s} set={set} edit={edit} readOnly={readOnly} facts={facts} />
          </TabsContent>
          <TabsContent value="seo" className="mt-4">
            <SeoTab s={s} set={set} edit={edit} readOnly={readOnly} facts={facts} locale={locale} onLocale={setLocale} issueCount={issueCount} />
          </TabsContent>
        </Tabs>

        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                Status {saved ? <TeaserStatusBadge status={status} /> : <span className="text-sm font-normal text-muted-foreground">Not saved yet</span>}
              </CardTitle>
              <CardDescription>{saved ? TEASER_STATUS_HELP[status] : "Create the draft first, then preview and publish it."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {phase && <p className={cn(phase.key === "live" ? "font-medium text-primary" : "text-muted-foreground")}>{phase.label}</p>}
              {saved?.publishedAt && <p className="text-xs text-muted-foreground">First published {formatDateTime(saved.publishedAt)}</p>}
              {saved && perm?.publish && (
                <div className="flex flex-wrap gap-2">
                  {status === "PUBLISHED" && <Button variant="outline" size="sm" disabled={busy} onClick={() => setConfirm("unpublish")}><Undo2 /> Unpublish</Button>}
                  {status !== "ARCHIVED" && <Button variant="outline" size="sm" disabled={busy} onClick={() => setConfirm("archive")}><Archive /> Archive</Button>}
                  {status === "ARCHIVED" && <Button variant="outline" size="sm" disabled={busy} onClick={() => transition.mutate("restore")}><RotateCcw /> Restore as draft</Button>}
                </div>
              )}
              {saved && !perm?.publish && status === "DRAFT" && <p className="text-xs text-muted-foreground">A teammate with publish rights can make it live.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                {issues.length ? <CircleAlert className="size-4 text-chart-4" /> : <CheckCircle2 className="size-4 text-primary" />}
                {issues.length ? `${issues.length} thing${issues.length > 1 ? "s" : ""} to finish` : "Ready to publish"}
              </CardTitle>
              <CardDescription>{issues.length ? "Required before the page can go live. Click an item to go there." : "Everything required is filled in for both languages."}</CardDescription>
            </CardHeader>
            {issues.length > 0 && (
              <CardContent>
                <ul className="max-h-72 space-y-1 overflow-y-auto">
                  {issues.map((i, k) => (
                    <li key={k}>
                      <button type="button" onClick={() => jump(i)} className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted">
                        {i.message}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>

          {saved && (
            <Card>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => void openPreview("id")}><Eye /> Preview ID</Button>
                  <Button variant="outline" size="sm" onClick={() => void openPreview("en")}><Eye /> Preview EN</Button>
                </div>
                {live && (
                  <div className="space-y-1">
                    <a href={liveUrl(saved.slug)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary underline underline-offset-4">View live page <ExternalLink className="size-3" /></a>
                    <button type="button" className="flex items-center gap-1 text-muted-foreground hover:text-foreground" onClick={() => void navigator.clipboard.writeText(`${window.location.origin}${liveUrl(saved.slug)}`).then(() => toast.success("Link copied"))}>
                      <Link2 className="size-3" /> Copy link
                    </button>
                  </div>
                )}
                <Link href={inquiriesUrl(saved.source)} className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-muted/50">
                  <MessageSquareText className="size-4 text-muted-foreground" />
                  <span className="flex-1">Inquiries from this page</span>
                  <span className="font-mono font-semibold">{saved.inquiries}</span>
                </Link>
                <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                  {perm?.write && <Button variant="outline" size="sm" onClick={() => duplicate.mutate()} disabled={duplicate.isPending}><Copy /> Duplicate</Button>}
                  {perm?.delete && status !== "PUBLISHED" && <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirm("delete")}><Trash2 /> Delete</Button>}
                </div>
                {live && dirty && <p className="text-xs text-chart-4">Preview shows the saved version. Save to update the live page.</p>}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={confirm === "delete"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={`Delete the ${s.city || "this"} teaser?`}
        description="The page and its content are deleted permanently. Inquiries already received stay in Contact Messages."
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
      <ConfirmDialog
        open={confirm === "archive"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Archive this teaser?"
        description="The page is hidden and visitors to its link are redirected to the Showroom page. You can restore it later."
        confirmLabel="Archive"
        destructive={false}
        loading={transition.isPending}
        onConfirm={() => transition.mutate("archive")}
      />
      <ConfirmDialog
        open={confirm === "unpublish"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Unpublish this teaser?"
        description="The page goes offline right away (visitors get “page not found”) and it returns to draft."
        confirmLabel="Unpublish"
        destructive={false}
        loading={transition.isPending}
        onConfirm={() => transition.mutate("unpublish")}
      />
    </div>
  );
}
