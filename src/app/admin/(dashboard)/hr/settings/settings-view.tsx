"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { useHrPermissions } from "@/components/admin/hr/shared";
import { api, errorMessage } from "@/lib/admin/api";
import type { HrSettings } from "@/lib/admin/types";

export function HrSettingsView() {
  const qc = useQueryClient();
  const perm = useHrPermissions();
  const { data, isLoading } = useQuery({ queryKey: ["hr-settings"], queryFn: () => api<{ data: HrSettings }>("/admin/hr/settings").then((r) => r.data) });
  const [s, setS] = useState<HrSettings | null>(null);
  useEffect(() => { if (data) setS(data); }, [data]);
  const can = !!perm.data?.settings;

  const save = useMutation({
    mutationFn: () => api<{ data: HrSettings }>("/admin/hr/settings", {
      method: "PUT",
      body: { ...s!, ccEmail: s!.ccEmail || null, phone: s!.phone || null, whatsapp: s!.whatsapp || null, applicationNoteId: s!.applicationNoteId || null, applicationNoteEn: s!.applicationNoteEn || null, companyPortals: s!.companyPortals.filter((p) => p.name.trim() && p.url.trim()) },
    }).then((r) => r.data),
    onSuccess: (d) => { qc.setQueryData(["hr-settings"], d); toast.success("HR settings saved. The careers page updates within a minute."); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (isLoading || !s) return <Skeleton className="h-96 rounded-xl" />;
  const set = (patch: Partial<HrSettings>) => setS({ ...s, ...patch });
  const preview = (tpl: string) => tpl.replaceAll("{title}", "Sales Executive").replaceAll("{department}", "Sales");

  return (
    <>
      <PageHeader
        title="HR Contact & Settings"
        description="Contact details applicants see on the careers page, and how application emails are prepared."
        actions={can && <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save</Button>}
      />
      {!can && <p className="text-sm text-muted-foreground">You can view these settings. Only an HR Manager can change them.</p>}
      <fieldset disabled={!can} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">HR contact</CardTitle><CardDescription>Applicants send their CV to this email unless an opening has its own.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Contact name</Label><Input value={s.contactName} onChange={(e) => set({ contactName: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Application email</Label><Input type="email" value={s.contactEmail} onChange={(e) => set({ contactEmail: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>CC email <span className="font-normal text-muted-foreground">(optional)</span></Label><Input type="email" value={s.ccEmail ?? ""} onChange={(e) => set({ ccEmail: e.target.value })} placeholder="recruitment@wedison.co" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Phone <span className="font-normal text-muted-foreground">(optional)</span></Label><Input value={s.phone ?? ""} onChange={(e) => set({ phone: e.target.value })} placeholder="021 …" /></div>
              <div className="space-y-1.5"><Label>WhatsApp <span className="font-normal text-muted-foreground">(optional)</span></Label><Input value={s.whatsapp ?? ""} onChange={(e) => set({ whatsapp: e.target.value })} placeholder="62812…" /></div>
            </div>
            <p className="text-xs text-muted-foreground">Phone and WhatsApp are shown on the careers page only when filled in.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Application email</CardTitle><CardDescription>Subject line pre-filled when an applicant clicks “Apply via email”. Use {"{title}"} and {"{department}"}.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Subject (Indonesian site)</Label><Input value={s.emailSubjectId} onChange={(e) => set({ emailSubjectId: e.target.value })} /><p className="font-mono text-[11px] text-muted-foreground">{preview(s.emailSubjectId)}</p></div>
            <div className="space-y-1.5"><Label>Subject (English site)</Label><Input value={s.emailSubjectEn} onChange={(e) => set({ emailSubjectEn: e.target.value })} /><p className="font-mono text-[11px] text-muted-foreground">{preview(s.emailSubjectEn)}</p></div>
            <div className="space-y-1.5"><Label>Note for applicants (ID)</Label><Textarea rows={2} value={s.applicationNoteId ?? ""} onChange={(e) => set({ applicationNoteId: e.target.value })} placeholder="Hanya kandidat yang lolos seleksi administrasi yang akan kami hubungi." /></div>
            <div className="space-y-1.5"><Label>Note for applicants (EN)</Label><Textarea rows={2} value={s.applicationNoteEn ?? ""} onChange={(e) => set({ applicationNoteEn: e.target.value })} placeholder="Only shortlisted candidates will be contacted." /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Open application</CardTitle><CardDescription>Lets people send a CV even when no opening fits, so you can build a talent pool.</CardDescription></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor="open-app">Show “Send an open application” on the careers page</Label>
              <Switch id="open-app" checked={s.openApplicationEnabled} onCheckedChange={(v) => set({ openApplicationEnabled: v })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Company profiles on job portals</CardTitle><CardDescription>Links to Wedison’s company pages (e.g. LinkedIn, JobStreet). Shown on the careers page.</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            {s.companyPortals.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input className="w-32" value={p.name} placeholder="LinkedIn" onChange={(e) => { const n = [...s.companyPortals]; n[i] = { ...p, name: e.target.value }; set({ companyPortals: n }); }} />
                <Input value={p.url} placeholder="https://…" onChange={(e) => { const n = [...s.companyPortals]; n[i] = { ...p, url: e.target.value }; set({ companyPortals: n }); }} />
                <Switch checked={p.enabled} onCheckedChange={(v) => { const n = [...s.companyPortals]; n[i] = { ...p, enabled: v }; set({ companyPortals: n }); }} aria-label="Shown" />
                <Button type="button" variant="ghost" size="icon" aria-label="Remove" onClick={() => set({ companyPortals: s.companyPortals.filter((_, k) => k !== i) })}><X /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => set({ companyPortals: [...s.companyPortals, { name: "", url: "", enabled: true }] })}><Plus /> Add profile</Button>
          </CardContent>
        </Card>
      </fieldset>
    </>
  );
}
