"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, Check, Copy, ExternalLink, Loader2, Lock, Plus, RotateCcw, Save, Send, Trash2, Undo2, X } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { JobStatusBadge, LinesInput, formatSalary, locationLabel, useDepartments, useHrPermissions, useLocations } from "@/components/admin/hr/shared";
import { api, errorMessage } from "@/lib/admin/api";
import { slugify, toLocalInput } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import {
  EMPLOYMENT_LABEL, LEVEL_LABEL, WORKPLACE_LABEL,
  type EmploymentType, type ExperienceLevel, type Job, type JobStatus, type Locale, type WorkplaceType,
} from "@/lib/admin/types";

type Draft = { enabled: boolean; title: string; summary: string; responsibilities: string[]; qualifications: string[]; niceToHave: string[]; benefits: string[] };
const emptyDraft = (enabled: boolean): Draft => ({ enabled, title: "", summary: "", responsibilities: [], qualifications: [], niceToHave: [], benefits: [] });
function fromJob(j: Job | undefined, l: Locale): Draft {
  const t = j?.translations.find((x) => x.locale === l);
  return t ? { enabled: true, title: t.title, summary: t.summary, responsibilities: t.responsibilities, qualifications: t.qualifications, niceToHave: t.niceToHave, benefits: t.benefits } : emptyDraft(!j && l === "id");
}

type Transition = "submit" | "return" | "publish" | "close" | "reopen" | "archive" | "unarchive";

export function JobForm({ job }: { job?: Job }) {
  const router = useRouter();
  const qc = useQueryClient();
  const perm = useHrPermissions();
  const { data: departments } = useDepartments();
  const { data: locations } = useLocations();
  const isEdit = !!job;
  const status: JobStatus = job?.status ?? "DRAFT";
  const p = perm.data;
  const locked = isEdit && (status === "PUBLISHED" || status === "CLOSED") && !p?.publish;
  const readOnly = !p?.write || locked;

  const [tr, setTr] = useState<Record<Locale, Draft>>({ id: fromJob(job, "id"), en: fromJob(job, "en") });
  const [activeLocale, setActiveLocale] = useState<Locale>(job && !job.translations.some((t) => t.locale === "id") ? "en" : "id");
  const [slug, setSlug] = useState(job?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [departmentId, setDepartmentId] = useState(job?.departmentId ?? "none");
  const [locationIds, setLocationIds] = useState<string[]>(job?.locations.map((l) => l.id) ?? []);
  const [employmentType, setEmploymentType] = useState<EmploymentType>(job?.employmentType ?? "FULL_TIME");
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>(job?.workplaceType ?? "ONSITE");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | "none">(job?.experienceLevel ?? "none");
  const [openings, setOpenings] = useState(String(job?.openings ?? 1));
  const [salaryMin, setSalaryMin] = useState(job?.salaryMin ? String(job.salaryMin) : "");
  const [salaryMax, setSalaryMax] = useState(job?.salaryMax ? String(job.salaryMax) : "");
  const [showSalary, setShowSalary] = useState(job?.showSalary ?? false);
  const [isUrgent, setIsUrgent] = useState(job?.isUrgent ?? false);
  const [closesAt, setClosesAt] = useState(toLocalInput(job?.closesAt));
  const [applyEmail, setApplyEmail] = useState(job?.applyEmail ?? "");
  const [portals, setPortals] = useState<{ name: string; url: string }[]>(job?.portals ?? []);
  const [dirty, setDirty] = useState(false);
  const [confirm, setConfirm] = useState<"delete" | null>(null);
  const [returnOpen, setReturnOpen] = useState(false);
  const [returnNote, setReturnNote] = useState("");

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const touch = () => setDirty(true);
  const update = (l: Locale, patch: Partial<Draft>) => {
    touch();
    setTr((prev) => {
      const next = { ...prev, [l]: { ...prev[l], ...patch } };
      if (patch.title !== undefined && !slugTouched) {
        const base = (l === "en" ? patch.title : next.en.enabled && next.en.title ? next.en.title : next.id.title) || patch.title;
        setSlug(slugify(base));
      }
      return next;
    });
  };

  const refresh = (j?: Job) => {
    qc.invalidateQueries({ queryKey: ["hr-jobs"] });
    qc.invalidateQueries({ queryKey: ["hr-overview"] });
    if (j) qc.setQueryData(["hr-job", j.id], j);
  };

  const body = () => {
    const translations = (["id", "en"] as Locale[])
      .filter((l) => tr[l].enabled)
      .map((l) => ({
        locale: l,
        title: tr[l].title.trim(),
        summary: tr[l].summary.trim(),
        responsibilities: tr[l].responsibilities.map((s) => s.trim()).filter(Boolean),
        qualifications: tr[l].qualifications.map((s) => s.trim()).filter(Boolean),
        niceToHave: tr[l].niceToHave.map((s) => s.trim()).filter(Boolean),
        benefits: tr[l].benefits.map((s) => s.trim()).filter(Boolean),
      }));
    if (!translations.length) throw new Error("Write the job in at least one language");
    for (const t of translations) {
      if (t.title.length < 3) throw new Error(`Title (${t.locale.toUpperCase()}) must be at least 3 characters`);
      if (t.summary.length < 10) throw new Error(`Summary (${t.locale.toUpperCase()}) must be at least 10 characters`);
    }
    return {
      slug: slug.trim() || undefined,
      departmentId: departmentId === "none" ? null : departmentId,
      locationIds,
      employmentType,
      workplaceType,
      experienceLevel: experienceLevel === "none" ? null : experienceLevel,
      openings: Number(openings) || 1,
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      showSalary,
      isUrgent,
      applyEmail: applyEmail.trim() || null,
      portals: portals.filter((x) => x.name.trim() && x.url.trim()),
      closesAt: closesAt ? new Date(closesAt).toISOString() : null,
      translations,
    };
  };

  const save = useMutation({
    mutationFn: async () => (isEdit ? api<{ data: Job }>(`/admin/hr/jobs/${job.id}`, { method: "PUT", body: body() }) : api<{ data: Job }>("/admin/hr/jobs", { method: "POST", body: body() })).then((r) => r.data),
    onSuccess: (j) => {
      setDirty(false);
      refresh(j);
      toast.success(isEdit ? "Changes saved" : "Draft created");
      if (!isEdit) router.replace(`/admin/hr/jobs/${j.id}`);
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const transition = useMutation({
    mutationFn: async (v: { action: Transition; note?: string }) => {
      if (dirty && isEdit && !readOnly) await api(`/admin/hr/jobs/${job.id}`, { method: "PUT", body: body() });
      return api<{ data: Job }>(`/admin/hr/jobs/${job!.id}/transition`, { method: "POST", body: v }).then((r) => r.data);
    },
    onSuccess: (j, v) => {
      setDirty(false);
      refresh(j);
      setReturnOpen(false);
      toast.success({ submit: "Submitted for review", return: "Returned to draft", publish: "Job published", close: "Job closed", reopen: "Job reopened", archive: "Job archived", unarchive: "Moved back to drafts" }[v.action]);
      router.refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const duplicate = useMutation({
    mutationFn: () => api<{ data: Job }>(`/admin/hr/jobs/${job!.id}/duplicate`, { method: "POST" }).then((r) => r.data),
    onSuccess: (j) => { refresh(); toast.success("Copy created as draft"); router.push(`/admin/hr/jobs/${j.id}`); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: () => api(`/admin/hr/jobs/${job!.id}`, { method: "DELETE" }),
    onSuccess: () => { refresh(); toast.success("Job deleted"); router.replace("/admin/hr/jobs"); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const busy = save.isPending || transition.isPending;
  const t = tr[activeLocale];
  const live = status === "PUBLISHED" || status === "CLOSED";
  const closesInPast = closesAt && new Date(closesAt) <= new Date();
  const salaryPreview = formatSalary(salaryMin ? Number(salaryMin) : null, salaryMax ? Number(salaryMax) : null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild><Link href="/admin/hr/jobs"><ArrowLeft /> Job Openings</Link></Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {isEdit && <JobStatusBadge status={status} />}
          {dirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
          {!readOnly && (
            <Button variant="outline" disabled={busy} onClick={() => save.mutate()}>
              {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} {isEdit ? "Save" : "Save draft"}
            </Button>
          )}
          {isEdit && status === "DRAFT" && p?.write && !p.publish && (
            <Button disabled={busy} onClick={() => transition.mutate({ action: "submit" })}><Send /> Submit for review</Button>
          )}
          {isEdit && (status === "DRAFT" || status === "PENDING_REVIEW") && p?.publish && (
            <>
              {status === "PENDING_REVIEW" && <Button variant="outline" disabled={busy} onClick={() => setReturnOpen(true)}><Undo2 /> Return</Button>}
              <Button disabled={busy} onClick={() => transition.mutate({ action: "publish" })}><Send /> Publish</Button>
            </>
          )}
          {isEdit && status === "PUBLISHED" && p?.publish && <Button variant="outline" disabled={busy} onClick={() => transition.mutate({ action: "close" })}><Lock /> Close</Button>}
          {isEdit && status === "CLOSED" && p?.publish && <Button disabled={busy} onClick={() => transition.mutate({ action: "reopen" })}><RotateCcw /> Reopen</Button>}
          {isEdit && status === "ARCHIVED" && p?.publish && <Button variant="outline" disabled={busy} onClick={() => transition.mutate({ action: "unarchive" })}><RotateCcw /> Move to drafts</Button>}
        </div>
      </div>

      {job?.reviewNote && status === "DRAFT" && (
        <Alert><AlertTriangle className="size-4" /><AlertTitle>Returned by HR Manager</AlertTitle><AlertDescription>{job.reviewNote}</AlertDescription></Alert>
      )}
      {status === "PENDING_REVIEW" && !p?.publish && (
        <Alert><AlertTitle>Waiting for an HR Manager</AlertTitle><AlertDescription>This opening has been submitted. You can still make changes until it is published or returned.</AlertDescription></Alert>
      )}
      {locked && (
        <Alert><Lock className="size-4" /><AlertTitle>Read-only</AlertTitle><AlertDescription>This opening is live. Only an HR Manager can edit, close or reopen it.</AlertDescription></Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <fieldset disabled={readOnly} className="min-w-0 space-y-4">
          <Tabs value={activeLocale} onValueChange={(v) => setActiveLocale(v as Locale)}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <TabsList>
                <TabsTrigger value="id">🇮🇩 Indonesian {!tr.id.enabled && <span className="ml-1 text-muted-foreground">(off)</span>}</TabsTrigger>
                <TabsTrigger value="en">🇬🇧 English {!tr.en.enabled && <span className="ml-1 text-muted-foreground">(off)</span>}</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2 text-sm">
                <Switch id={`lang-${activeLocale}`} checked={t.enabled} onCheckedChange={(v) => update(activeLocale, { enabled: v })} />
                <Label htmlFor={`lang-${activeLocale}`}>Publish in {activeLocale === "id" ? "Indonesian" : "English"}</Label>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Write in one or both languages. If only one is filled in, the careers page shows it for both language versions of the site.</p>

            {(["id", "en"] as Locale[]).map((l) => (
              <TabsContent key={l} value={l} className="mt-4">
                {!tr[l].enabled ? (
                  <Card className="border-dashed"><CardContent className="py-10 text-center text-sm text-muted-foreground">This language is off. Turn on the switch above to write it.</CardContent></Card>
                ) : (
                  <Card>
                    <CardContent className="space-y-5 pt-6">
                      <div className="space-y-1.5">
                        <Label>Position title</Label>
                        <Input value={tr[l].title} onChange={(e) => update(l, { title: e.target.value })} placeholder={l === "id" ? "Contoh: Sales Executive Showroom Bandung" : "e.g. Showroom Sales Executive, Bandung"} className="text-base font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Summary</Label>
                        <Textarea rows={4} value={tr[l].summary} onChange={(e) => update(l, { summary: e.target.value })} placeholder={l === "id" ? "2–4 kalimat: peran ini untuk apa, bekerja dengan siapa, dan dampaknya." : "2–4 sentences: what the role is for, who it works with, and its impact."} />
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-1.5"><Label>Responsibilities</Label><LinesInput value={tr[l].responsibilities} onChange={(v) => update(l, { responsibilities: v })} rows={7} /></div>
                        <div className="space-y-1.5"><Label>Requirements</Label><LinesInput value={tr[l].qualifications} onChange={(v) => update(l, { qualifications: v })} rows={7} /></div>
                        <div className="space-y-1.5"><Label>Nice to have <span className="font-normal text-muted-foreground">(optional)</span></Label><LinesInput value={tr[l].niceToHave} onChange={(v) => update(l, { niceToHave: v })} rows={4} /></div>
                        <div className="space-y-1.5"><Label>What we offer <span className="font-normal text-muted-foreground">(optional)</span></Label><LinesInput value={tr[l].benefits} onChange={(v) => update(l, { benefits: v })} rows={4} /></div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">How to apply</CardTitle>
              <CardDescription>Applicants apply by email or through job portals. Leave the email empty to use the HR email from HR Contact & Settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Application email for this opening <span className="font-normal text-muted-foreground">(optional)</span></Label>
                <Input type="email" value={applyEmail} onChange={(e) => { setApplyEmail(e.target.value); touch(); }} placeholder="Default: HR email in settings" />
              </div>
              <div className="space-y-2">
                <Label>Job portal links for this opening</Label>
                {portals.map((x, i) => (
                  <div key={i} className="flex gap-2">
                    <Input className="w-36" value={x.name} placeholder="JobStreet" onChange={(e) => { const n = [...portals]; n[i] = { ...x, name: e.target.value }; setPortals(n); touch(); }} />
                    <Input value={x.url} placeholder="https://…" onChange={(e) => { const n = [...portals]; n[i] = { ...x, url: e.target.value }; setPortals(n); touch(); }} />
                    <Button type="button" variant="ghost" size="icon" aria-label="Remove link" onClick={() => { setPortals(portals.filter((_, k) => k !== i)); touch(); }}><X /></Button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2">
                  {["JobStreet", "LinkedIn", "Glints", "Kalibrr"].filter((n) => !portals.some((x) => x.name === n)).map((n) => (
                    <Button key={n} type="button" variant="outline" size="sm" onClick={() => { setPortals([...portals, { name: n, url: "" }]); touch(); }}><Plus /> {n}</Button>
                  ))}
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setPortals([...portals, { name: "", url: "" }]); touch(); }}><Plus /> Other</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </fieldset>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <fieldset disabled={readOnly} className="space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Classification</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Division</Label>
                  <Select value={departmentId} onValueChange={(v) => { setDepartmentId(v); touch(); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No division</SelectItem>
                      {departments?.filter((d) => d.isActive || d.id === departmentId).map((d) => <SelectItem key={d.id} value={d.id}>{d.nameId}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Location(s)</Label>
                  <LocationPicker all={locations ?? []} value={locationIds} onChange={(v) => { setLocationIds(v); touch(); }} disabled={readOnly} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Employment</Label>
                    <Select value={employmentType} onValueChange={(v) => { setEmploymentType(v as EmploymentType); touch(); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{(Object.keys(EMPLOYMENT_LABEL) as EmploymentType[]).map((k) => <SelectItem key={k} value={k}>{EMPLOYMENT_LABEL[k]}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Workplace</Label>
                    <Select value={workplaceType} onValueChange={(v) => { setWorkplaceType(v as WorkplaceType); touch(); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{(Object.keys(WORKPLACE_LABEL) as WorkplaceType[]).map((k) => <SelectItem key={k} value={k}>{WORKPLACE_LABEL[k]}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Level</Label>
                    <Select value={experienceLevel} onValueChange={(v) => { setExperienceLevel(v as ExperienceLevel | "none"); touch(); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not specified</SelectItem>
                        {(Object.keys(LEVEL_LABEL) as ExperienceLevel[]).map((k) => <SelectItem key={k} value={k}>{LEVEL_LABEL[k]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Positions</Label>
                    <Input type="number" min={1} value={openings} onChange={(e) => { setOpenings(e.target.value); touch(); }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Schedule & visibility</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Closing date <span className="font-normal text-muted-foreground">(optional)</span></Label>
                  <Input type="datetime-local" value={closesAt} onChange={(e) => { setClosesAt(e.target.value); touch(); }} />
                  <p className={cn("text-xs", closesInPast ? "text-destructive" : "text-muted-foreground")}>
                    {closesInPast ? "This date is in the past. Change it before publishing or reopening." : "The opening closes automatically on this date."}
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div><Label htmlFor="urgent">Urgently hiring</Label><p className="text-xs text-muted-foreground">Shown first, with an “Urgent” label.</p></div>
                  <Switch id="urgent" checked={isUrgent} onCheckedChange={(v) => { setIsUrgent(v); touch(); }} />
                </div>
                <div className="space-y-1.5">
                  <Label>URL slug</Label>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><span className="font-mono">/career/</span>
                    <Input className="h-8 font-mono text-xs" value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); touch(); }} placeholder="generated-from-title" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Salary <span className="font-normal text-muted-foreground">(optional)</span></CardTitle>
                <CardDescription>Shown only if the switch is on. Listings with salary tend to get more applicants.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Min (IDR/month)</Label><Input inputMode="numeric" value={salaryMin} onChange={(e) => { setSalaryMin(e.target.value.replace(/\D/g, "")); touch(); }} placeholder="5000000" /></div>
                  <div className="space-y-1.5"><Label>Max (IDR/month)</Label><Input inputMode="numeric" value={salaryMax} onChange={(e) => { setSalaryMax(e.target.value.replace(/\D/g, "")); touch(); }} placeholder="7000000" /></div>
                </div>
                {salaryPreview && <p className="font-mono text-xs text-muted-foreground">{salaryPreview}</p>}
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-salary">Show salary on the site</Label>
                  <Switch id="show-salary" checked={showSalary} onCheckedChange={(v) => { setShowSalary(v); touch(); }} />
                </div>
              </CardContent>
            </Card>
          </fieldset>

          {isEdit && (
            <Card>
              <CardContent className="space-y-2 pt-6 text-xs text-muted-foreground">
                <p>{job.viewCount} views · {job._count?.applyClicks ?? 0} apply clicks</p>
                {live && <a className="flex items-center gap-1 text-primary underline underline-offset-4" href={`/id/career/${job.slug}/`} target="_blank" rel="noreferrer">View on site <ExternalLink className="size-3" /></a>}
                <div className="flex flex-wrap gap-2 pt-2">
                  {p?.write && <Button variant="outline" size="sm" onClick={() => duplicate.mutate()} disabled={duplicate.isPending}><Copy /> Duplicate</Button>}
                  {p?.publish && status !== "ARCHIVED" && <Button variant="outline" size="sm" onClick={() => transition.mutate({ action: "archive" })} disabled={busy}>Archive</Button>}
                  {p?.delete && <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirm("delete")}><Trash2 /> Delete</Button>}
                </div>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Return to draft</DialogTitle><DialogDescription>Tell the writer what to change. The note is shown at the top of the opening.</DialogDescription></DialogHeader>
          <Textarea rows={4} value={returnNote} onChange={(e) => setReturnNote(e.target.value)} placeholder="e.g. Please add the salary range and the Bandung location." />
          <DialogFooter><Button variant="outline" onClick={() => setReturnOpen(false)}>Cancel</Button><Button onClick={() => transition.mutate({ action: "return", note: returnNote })} disabled={transition.isPending}><Undo2 /> Return</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={confirm === "delete"} onOpenChange={(o) => !o && setConfirm(null)} title="Delete this job opening?" description="Its view and apply-click history is deleted too. To hide it but keep the history, close or archive it instead." loading={remove.isPending} onConfirm={() => remove.mutate()} />
    </div>
  );
}

function LocationPicker({ all, value, onChange, disabled }: { all: { id: string; city: string; country: string; isActive: boolean }[]; value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const selected = all.filter((l) => value.includes(l.id));
  return (
    <div className="space-y-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((l) => (
            <Badge key={l.id} variant="secondary" className="gap-1 pr-1">
              {locationLabel(l)}
              {!disabled && <button type="button" onClick={() => onChange(value.filter((x) => x !== l.id))} className="rounded-sm hover:bg-foreground/10" aria-label={`Remove ${l.city}`}><X className="size-3" /></button>}
            </Badge>
          ))}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="w-full justify-start font-normal text-muted-foreground" disabled={disabled}>Add location…</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search city" />
            <CommandList>
              <CommandEmpty>No location. Add it in Divisions & Locations.</CommandEmpty>
              <CommandGroup>
                {all.filter((l) => l.isActive || value.includes(l.id)).map((l) => (
                  <CommandItem key={l.id} value={`${l.city} ${l.country}`} onSelect={() => onChange(value.includes(l.id) ? value.filter((x) => x !== l.id) : [...value, l.id])}>
                    <Check className={cn("size-4", value.includes(l.id) ? "opacity-100" : "opacity-0")} /> {locationLabel(l)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
