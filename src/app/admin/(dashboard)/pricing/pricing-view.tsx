"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { LinesInput } from "@/components/admin/hr/shared";
import { useCan } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import { cn } from "@/lib/utils";
import {
  PRICING_KIND_FIELDS, PRICING_KIND_LABEL, PRICING_MODEL_LABEL, PRICING_VARIANT_LABEL,
  type PriceEntry, type PriceRegion, type PricingData, type PricingModel, type PricingSettings, type PricingVariant, type AuditFields } from "@/lib/admin/types";
import { RegionsPanel, SchemesPanel } from "./pricing-catalog";
import { AuditLine } from "@/components/admin/audit";

/** Baris tetap di tabel harga: model × varian yang ada di line-up. */
const ROWS: { model: PricingModel; variant: PricingVariant }[] = [
  { model: "BEES", variant: "SINGLE" },
  { model: "ATHENA", variant: "REGULAR" },
  { model: "ATHENA", variant: "EXTENDED" },
  { model: "VICTORY", variant: "REGULAR" },
  { model: "VICTORY", variant: "EXTENDED" },
  { model: "EDPOWER", variant: "SINGLE" },
];
const rowKey = (r: { model: string; variant: string }) => `${r.model}:${r.variant}`;
const fmt = (n: number | null | undefined) => (n == null ? "" : new Intl.NumberFormat("id-ID").format(n));

export function usePricing() {
  return useQuery({ queryKey: ["pricing"], queryFn: () => api<{ data: PricingData }>("/admin/pricing").then((r) => r.data) });
}

export function PricingView() {
  const { data, isLoading } = usePricing();
  const [tab, setTab] = useState("prices");

  return (
    <>
      <PageHeader
        title="Prices & Schemes"
        description="Everything the public site shows about prices: regions, schemes, price rows, benefits & terms, SuperCharge tariff and the referral programme. Changes publish within seconds."
        actions={<Button asChild variant="outline"><a href="/id/products/athena/#harga" target="_blank" rel="noreferrer"><ExternalLink /> View public page</a></Button>}
      />
      {isLoading || !data ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="prices">Prices</TabsTrigger>
            <TabsTrigger value="terms">Benefits & terms</TabsTrigger>
            <TabsTrigger value="schemes">Schemes <Badge variant="secondary" className="ml-1.5">{data.schemes.length}</Badge></TabsTrigger>
            <TabsTrigger value="regions">Regions <Badge variant="secondary" className="ml-1.5">{data.regions.length}</Badge></TabsTrigger>
            <TabsTrigger value="settings">SuperCharge & referral</TabsTrigger>
          </TabsList>
          <TabsContent value="prices" className="mt-4"><PricesPanel data={data} /></TabsContent>
          <TabsContent value="terms" className="mt-4"><TermsPanel data={data} /></TabsContent>
          <TabsContent value="schemes" className="mt-4"><SchemesPanel data={data} /></TabsContent>
          <TabsContent value="regions" className="mt-4"><RegionsPanel data={data} /></TabsContent>
          <TabsContent value="settings" className="mt-4"><SettingsPanel settings={data.settings} regions={data.regions} meta={data.settingsMeta} /></TabsContent>
        </Tabs>
      )}
    </>
  );
}

/** Pilih wilayah + skema (dipakai tab Prices dan Terms). */
function useScope(data: PricingData) {
  const regions = data.regions;
  const schemes = data.schemes;
  const [regionId, setRegionId] = useState(() => (regions.find((r) => r.isDefault) ?? regions[0])?.id ?? "");
  const [schemeId, setSchemeId] = useState(() => schemes[0]?.id ?? "");
  useEffect(() => { if (!regions.some((r) => r.id === regionId)) setRegionId(regions[0]?.id ?? ""); }, [regions, regionId]);
  useEffect(() => { if (!schemes.some((s) => s.id === schemeId)) setSchemeId(schemes[0]?.id ?? ""); }, [schemes, schemeId]);
  const region = regions.find((r) => r.id === regionId) ?? null;
  const scheme = schemes.find((s) => s.id === schemeId) ?? null;
  return { regionId, setRegionId, schemeId, setSchemeId, region, scheme };
}

function ScopePicker({ data, scope }: { data: PricingData; scope: ReturnType<typeof useScope> }) {
  const countFor = (regionId: string, schemeId: string) => data.entries.filter((e) => e.regionId === regionId && e.schemeId === schemeId).length;
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Select value={scope.regionId} onValueChange={scope.setRegionId}>
        <SelectTrigger className="sm:w-[220px]"><SelectValue placeholder="Region" /></SelectTrigger>
        <SelectContent>
          {data.regions.map((r) => <SelectItem key={r.id} value={r.id}>{r.nameId}{!r.isActive ? " (hidden)" : ""}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={scope.schemeId} onValueChange={scope.setSchemeId}>
        <SelectTrigger className="sm:w-[300px]"><SelectValue placeholder="Scheme" /></SelectTrigger>
        <SelectContent>
          {data.schemes.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.nameId} · {PRICING_KIND_LABEL[s.kind]} {scope.regionId ? `(${countFor(scope.regionId, s.id)} rows)` : ""}{!s.isPublic ? " · not public" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Tab: Prices ───────────────────────────────────────────────────────────
type Draft = Record<string, { values: Record<string, string>; noteId: string; noteEn: string; isActive: boolean; id?: string }>;

function PricesPanel({ data }: { data: PricingData }) {
  const qc = useQueryClient();
  const can = useCan("pricing");
  const scope = useScope(data);
  const kind = scope.scheme?.kind;
  const fields = useMemo(() => (kind ? PRICING_KIND_FIELDS[kind] : []), [kind]);
  const existing = useMemo(() => data.entries.filter((e) => e.regionId === scope.regionId && e.schemeId === scope.schemeId), [data.entries, scope.regionId, scope.schemeId]);

  const initial = useMemo<Draft>(() => {
    const d: Draft = {};
    for (const r of ROWS) {
      const e = existing.find((x) => x.model === r.model && x.variant === r.variant);
      d[rowKey(r)] = {
        id: e?.id,
        values: Object.fromEntries(fields.map((f) => [f.key, e ? fmt(e[f.key] as number | null) : ""])),
        noteId: e?.noteId ?? "",
        noteEn: e?.noteEn ?? "",
        isActive: e?.isActive ?? true,
      };
    }
    return d;
  }, [existing, fields]);
  const [draft, setDraft] = useState<Draft>(initial);
  useEffect(() => setDraft(initial), [initial]);
  const [confirm, setConfirm] = useState<PriceEntry | null>(null);

  const parse = (v: string) => { const n = Number(v.replace(/[^\d]/g, "")); return v.trim() === "" ? null : Number.isFinite(n) ? n : null; };
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  const save = useMutation({
    mutationFn: () => {
      const rows = ROWS.flatMap((r) => {
        const d = draft[rowKey(r)];
        const nums = Object.fromEntries(fields.map((f) => [f.key, parse(d.values[f.key] ?? "")]));
        const hasValue = Object.values(nums).some((n) => n != null);
        if (!hasValue && !d.id) return [];
        return [{ model: r.model, variant: r.variant, ...nums, noteId: d.noteId || null, noteEn: d.noteEn || null, isActive: d.isActive }];
      });
      return api("/admin/pricing/entries", { method: "PUT", body: { regionId: scope.regionId, schemeId: scope.schemeId, rows } });
    },
    onSuccess: () => { toast.success("Prices saved and published"); qc.invalidateQueries({ queryKey: ["pricing"] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/pricing/entries/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Price row deleted"); setConfirm(null); qc.invalidateQueries({ queryKey: ["pricing"] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const set = (key: string, patch: Partial<Draft[string]>) => setDraft((d) => ({ ...d, [key]: { ...d[key], ...patch } }));
  const setValue = (key: string, field: string, v: string) => setDraft((d) => ({ ...d, [key]: { ...d[key], values: { ...d[key].values, [field]: v } } }));

  // Beli putus: hitung net otomatis saat OTR & diskon diisi (bisa ditimpa manual).
  const autoNet = (key: string) => {
    const d = draft[key];
    const otr = parse(d.values.otrPrice ?? ""); const disc = parse(d.values.discount ?? "");
    if (otr != null && disc != null) setValue(key, "netPrice", fmt(otr - disc));
  };

  if (!scope.region || !scope.scheme) return <p className="text-sm text-muted-foreground">Add a region and a scheme first.</p>;

  return (
    <div className="space-y-4">
      <ScopePicker data={data} scope={scope} />
      <p className="text-sm text-muted-foreground">
        {scope.scheme.taglineId || PRICING_KIND_LABEL[scope.scheme.kind]} · amounts in Rupiah. Leave a row empty if the model is not offered in this region/scheme.
        {!scope.scheme.isPublic && <span className="ml-1 text-amber-700">This scheme is not public: prices are stored but not shown on the site.</span>}
      </p>
      {(() => {
        // Most recently changed row in this region/scheme = "last updated" for the price table.
        const last = [...existing].sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())[0];
        return last ? <AuditLine item={{ ...last, createdAt: undefined }} /> : null;
      })()}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Model</th>
              {fields.map((f) => <th key={f.key} className="px-3 py-2 font-medium">{f.label}{f.hint && <span className="ml-1 normal-case tracking-normal text-muted-foreground/70">{f.hint}</span>}</th>)}
              <th className="px-3 py-2 font-medium">Note (ID / EN)</th>
              <th className="px-3 py-2 font-medium">Shown</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => {
              const key = rowKey(r);
              const d = draft[key];
              const entry = existing.find((e) => e.model === r.model && e.variant === r.variant);
              return (
                <tr key={key} className={cn("border-t border-border", !d.isActive && "bg-muted/30 text-muted-foreground")}>
                  <td className="px-3 py-2">
                    <div className="font-medium">{PRICING_MODEL_LABEL[r.model]}</div>
                    <div className="text-xs text-muted-foreground">{PRICING_VARIANT_LABEL[r.variant]}</div>
                  </td>
                  {fields.map((f) => (
                    <td key={f.key} className="px-3 py-2">
                      <Input
                        inputMode="numeric"
                        className="h-9 w-[150px] font-mono text-xs tabular-nums"
                        placeholder="—"
                        disabled={!can.write}
                        value={d.values[f.key] ?? ""}
                        onChange={(e) => setValue(key, f.key, e.target.value)}
                        onBlur={(e) => { const n = parse(e.target.value); setValue(key, f.key, n == null ? "" : fmt(n)); if (scope.scheme?.kind === "PURCHASE" && f.key !== "netPrice") autoNet(key); }}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-1">
                      <Input className="h-8 w-[200px] text-xs" placeholder="Catatan (ID)" disabled={!can.write} value={d.noteId} onChange={(e) => set(key, { noteId: e.target.value })} />
                      <Input className="h-8 w-[200px] text-xs" placeholder="Note (EN)" disabled={!can.write} value={d.noteEn} onChange={(e) => set(key, { noteEn: e.target.value })} />
                    </div>
                  </td>
                  <td className="px-3 py-2"><Switch checked={d.isActive} disabled={!can.write} onCheckedChange={(v) => set(key, { isActive: v })} aria-label="Shown on site" /></td>
                  <td className="px-2 py-2">
                    {entry && can.write && (
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" aria-label="Delete row" onClick={() => setConfirm(entry)}><Trash2 className="size-4" /></Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {can.write && (
        <div className="flex items-center gap-3">
          <Button onClick={() => save.mutate()} disabled={!dirty || save.isPending}>{save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save prices</Button>
          {dirty && <Button variant="ghost" onClick={() => setDraft(initial)}>Discard changes</Button>}
          <span className="text-xs text-muted-foreground">{existing.length} saved row(s) for {scope.region.nameId} · {scope.scheme.nameId}</span>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Delete this price row?"
        description={confirm ? `${PRICING_MODEL_LABEL[confirm.model]} (${PRICING_VARIANT_LABEL[confirm.variant]}) will no longer be offered in ${scope.region.nameId} · ${scope.scheme.nameId}.` : undefined}
        loading={remove.isPending}
        onConfirm={() => { if (confirm) remove.mutate(confirm.id); }}
      />
    </div>
  );
}

// ─── Tab: Benefits & terms ─────────────────────────────────────────────────
type TermsDraft = { includedId: string[]; includedEn: string[]; termsId: string[]; termsEn: string[]; partners: string[]; validFrom: string; validUntil: string; noteId: string; noteEn: string };
const toDate = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

function TermsPanel({ data }: { data: PricingData }) {
  const qc = useQueryClient();
  const can = useCan("pricing");
  const scope = useScope(data);
  const existing = useMemo(() => data.terms.find((t) => t.regionId === scope.regionId && t.schemeId === scope.schemeId) ?? null, [data.terms, scope.regionId, scope.schemeId]);
  const initial = useMemo<TermsDraft>(() => ({
    includedId: existing?.includedId ?? [], includedEn: existing?.includedEn ?? [], termsId: existing?.termsId ?? [], termsEn: existing?.termsEn ?? [],
    partners: existing?.partners ?? [], validFrom: toDate(existing?.validFrom ?? null), validUntil: toDate(existing?.validUntil ?? null), noteId: existing?.noteId ?? "", noteEn: existing?.noteEn ?? "",
  }), [existing]);
  const [draft, setDraft] = useState<TermsDraft>(initial);
  useEffect(() => setDraft(initial), [initial]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  const save = useMutation({
    mutationFn: () => api("/admin/pricing/terms", {
      method: "PUT",
      body: {
        regionId: scope.regionId, schemeId: scope.schemeId,
        ...draft,
        validFrom: draft.validFrom ? new Date(`${draft.validFrom}T00:00:00+07:00`).toISOString() : null,
        validUntil: draft.validUntil ? new Date(`${draft.validUntil}T23:59:59+07:00`).toISOString() : null,
        noteId: draft.noteId || null, noteEn: draft.noteEn || null,
      },
    }),
    onSuccess: () => { toast.success("Benefits & terms saved and published"); qc.invalidateQueries({ queryKey: ["pricing"] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const set = (patch: Partial<TermsDraft>) => setDraft((d) => ({ ...d, ...patch }));

  if (!scope.region || !scope.scheme) return <p className="text-sm text-muted-foreground">Add a region and a scheme first.</p>;

  return (
    <div className="space-y-5">
      <ScopePicker data={data} scope={scope} />
      <p className="text-sm text-muted-foreground">Shown under the prices for {scope.region.nameId} · {scope.scheme.nameId}. Write both languages; EN falls back to ID when empty.</p>
      {existing && <AuditLine item={existing} />}

      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Every unit includes (ID)"><LinesInput value={draft.includedId} onChange={(v) => set({ includedId: v })} placeholder="1x Adapter charging reguler (senilai Rp 1.700.000)" /></Field>
        <Field label="Every unit includes (EN)"><LinesInput value={draft.includedEn} onChange={(v) => set({ includedEn: v })} placeholder="1x Regular charging adapter (worth Rp 1,700,000)" /></Field>
        <Field label="Terms & conditions (ID)"><LinesInput value={draft.termsId} onChange={(v) => set({ termsId: v })} rows={8} placeholder="Promo bersifat terbatas waktu dan kuota." /></Field>
        <Field label="Terms & conditions (EN)"><LinesInput value={draft.termsEn} onChange={(v) => set({ termsEn: v })} rows={8} placeholder="Promotions are limited by time and quota." /></Field>
        <Field label="Financing partners" hint="Shown as chips, e.g. “Kredivo (personal)”. Leave empty if none."><LinesInput value={draft.partners} onChange={(v) => set({ partners: v })} rows={4} placeholder="Kredivo (personal)" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Valid from"><Input type="date" value={draft.validFrom} disabled={!can.write} onChange={(e) => set({ validFrom: e.target.value })} /></Field>
          <Field label="Valid until" hint="Empty = until further notice"><Input type="date" value={draft.validUntil} disabled={!can.write} onChange={(e) => set({ validUntil: e.target.value })} /></Field>
          <Field label="Note (ID)"><Textarea rows={3} value={draft.noteId} disabled={!can.write} onChange={(e) => set({ noteId: e.target.value })} placeholder="Pricelist 25 September 2026." /></Field>
          <Field label="Note (EN)"><Textarea rows={3} value={draft.noteEn} disabled={!can.write} onChange={(e) => set({ noteEn: e.target.value })} placeholder="Price list of 25 September 2026." /></Field>
        </div>
      </div>

      {can.write && (
        <div className="flex items-center gap-3">
          <Button onClick={() => save.mutate()} disabled={!dirty || save.isPending}>{save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save benefits & terms</Button>
          {dirty && <Button variant="ghost" onClick={() => setDraft(initial)}>Discard changes</Button>}
        </div>
      )}
    </div>
  );
}

// ─── Tab: SuperCharge tariff, referral, disclaimer ─────────────────────────
function SettingsPanel({ settings, regions, meta }: { settings: PricingSettings; regions: PriceRegion[]; meta: AuditFields | null }) {
  const qc = useQueryClient();
  const can = useCan("pricing");
  const [draft, setDraft] = useState<PricingSettings>(settings);
  useEffect(() => setDraft(settings), [settings]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);
  const save = useMutation({
    mutationFn: () => api("/admin/pricing/settings", { method: "PUT", body: draft }),
    onSuccess: () => { toast.success("Settings saved and published"); qc.invalidateQueries({ queryKey: ["pricing"] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const sc = draft.supercharge;
  const rf = draft.referral;
  const setSc = (patch: Partial<PricingSettings["supercharge"]>) => setDraft((d) => ({ ...d, supercharge: { ...d.supercharge, ...patch } }));
  const setRf = (patch: Partial<PricingSettings["referral"]>) => setDraft((d) => ({ ...d, referral: { ...d.referral, ...patch } }));
  const tariff = (key: keyof PricingSettings["supercharge"]["tariff"], v: string) => {
    const n = v.replace(/[^\d]/g, "");
    setSc({ tariff: { ...sc.tariff, [key]: n === "" ? null : Number(n) } });
  };

  return (
    <div className="space-y-8">
      {meta && <AuditLine item={meta} className="-mb-4" />}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">SuperCharge tariff</h2>
            <p className="text-sm text-muted-foreground">Per charging session, shown on product pages of SuperCharge-capable models. Empty = not supported.</p>
          </div>
          <label className="flex items-center gap-2 text-sm"><Switch checked={sc.enabled} disabled={!can.write} onCheckedChange={(v) => setSc({ enabled: v })} /> Show on site</label>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          {(["bees", "athena", "victory", "edpower"] as const).map((m) => (
            <Field key={m} label={PRICING_MODEL_LABEL[m.toUpperCase() as PricingModel]}>
              <Input inputMode="numeric" className="font-mono text-xs tabular-nums" placeholder="not supported" disabled={!can.write} value={fmt(sc.tariff[m])} onChange={(e) => tariff(m, e.target.value)} />
            </Field>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Unit (ID)"><Input value={sc.unitId} disabled={!can.write} onChange={(e) => setSc({ unitId: e.target.value })} /></Field>
          <Field label="Unit (EN)"><Input value={sc.unitEn} disabled={!can.write} onChange={(e) => setSc({ unitEn: e.target.value })} /></Field>
          <Field label="Note (ID)"><Textarea rows={2} value={sc.noteId ?? ""} disabled={!can.write} onChange={(e) => setSc({ noteId: e.target.value || null })} /></Field>
          <Field label="Note (EN)"><Textarea rows={2} value={sc.noteEn ?? ""} disabled={!can.write} onChange={(e) => setSc({ noteEn: e.target.value || null })} /></Field>
        </div>
      </section>

      <section className="space-y-4 border-t border-border pt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">Referral programme</h2>
            <p className="text-sm text-muted-foreground">Shown under the prices in the selected regions only.</p>
          </div>
          <label className="flex items-center gap-2 text-sm"><Switch checked={rf.enabled} disabled={!can.write} onCheckedChange={(v) => setRf({ enabled: v })} /> Show on site</label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Bonus (Rp)"><Input inputMode="numeric" className="font-mono text-xs tabular-nums" disabled={!can.write} value={fmt(rf.amount)} onChange={(e) => setRf({ amount: Number(e.target.value.replace(/[^\d]/g, "")) || 0 })} /></Field>
          <Field label="Title (ID)"><Input value={rf.titleId} disabled={!can.write} onChange={(e) => setRf({ titleId: e.target.value })} /></Field>
          <Field label="Title (EN)"><Input value={rf.titleEn} disabled={!can.write} onChange={(e) => setRf({ titleEn: e.target.value })} /></Field>
        </div>
        <Field label="Regions">
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => {
              const on = rf.regionSlugs.includes(r.slug);
              return (
                <button key={r.id} type="button" disabled={!can.write} aria-pressed={on} onClick={() => setRf({ regionSlugs: on ? rf.regionSlugs.filter((s) => s !== r.slug) : [...rf.regionSlugs, r.slug] })}
                  className={cn("rounded-full border px-3 py-1 text-xs transition-colors", on ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground")}>
                  {r.nameId}
                </button>
              );
            })}
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Description (ID)"><Textarea rows={3} value={rf.descriptionId} disabled={!can.write} onChange={(e) => setRf({ descriptionId: e.target.value })} /></Field>
          <Field label="Description (EN)"><Textarea rows={3} value={rf.descriptionEn} disabled={!can.write} onChange={(e) => setRf({ descriptionEn: e.target.value })} /></Field>
        </div>
      </section>

      <section className="space-y-4 border-t border-border pt-8">
        <div>
          <h2 className="font-display text-lg font-semibold">Disclaimer</h2>
          <p className="text-sm text-muted-foreground">One line under every price block.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Disclaimer (ID)"><Textarea rows={3} value={draft.disclaimerId} disabled={!can.write} onChange={(e) => setDraft((d) => ({ ...d, disclaimerId: e.target.value }))} /></Field>
          <Field label="Disclaimer (EN)"><Textarea rows={3} value={draft.disclaimerEn} disabled={!can.write} onChange={(e) => setDraft((d) => ({ ...d, disclaimerEn: e.target.value }))} /></Field>
        </div>
      </section>

      {can.write && (
        <div className="flex items-center gap-3">
          <Button onClick={() => save.mutate()} disabled={!dirty || save.isPending}>{save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save settings</Button>
          {dirty && <Button variant="ghost" onClick={() => setDraft(settings)}>Discard changes</Button>}
        </div>
      )}
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

