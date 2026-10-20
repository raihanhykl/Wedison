"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useCan } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import { cn } from "@/lib/utils";
import {
  PRICING_AUDIENCE_LABEL, PRICING_KIND_LABEL,
  type PriceRegion, type PricingAudience, type PricingData, type PricingKind, type PricingScheme,
} from "@/lib/admin/types";

const slugRule = z.string().trim().regex(/^[a-z0-9-]{2,60}$/, "lowercase letters, digits and dashes");

// ─── Regions ───────────────────────────────────────────────────────────────
const regionSchema = z.object({
  slug: slugRule,
  nameId: z.string().trim().min(2, "Required").max(80),
  nameEn: z.string().trim().min(2, "Required").max(80),
  priceLabelId: z.string().trim().max(80),
  priceLabelEn: z.string().trim().max(80),
  coverageId: z.string().trim().max(300),
  coverageEn: z.string().trim().max(300),
  salesWhatsapp: z.string().trim().regex(/^$|^\d{8,16}$/, "Digits only, e.g. 628123456789"),
  isDefault: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.string().trim().regex(/^\d{0,3}$/, "0–999"),
});
type RegionValues = z.infer<typeof regionSchema>;

export function RegionsPanel({ data }: { data: PricingData }) {
  const qc = useQueryClient();
  const can = useCan("pricing");
  const [editing, setEditing] = useState<PriceRegion | "new" | null>(null);
  const [confirm, setConfirm] = useState<PriceRegion | null>(null);
  const invalidate = () => qc.invalidateQueries({ queryKey: ["pricing"] });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/pricing/regions/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Region deleted"); setConfirm(null); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const rowCount = (id: string) => data.entries.filter((e) => e.regionId === id).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Regions appear as the area selector on product pages. A region without price rows shows a “contact sales” panel with its WhatsApp number.</p>
        {can.write && <Button onClick={() => setEditing("new")}><Plus /> Add region</Button>}
      </div>
      <ul className="divide-y divide-border rounded-lg border border-border">
        {data.regions.map((r) => (
          <li key={r.id} className={cn("flex flex-wrap items-center gap-3 px-4 py-3", !r.isActive && "text-muted-foreground")}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{r.nameId}</span>
                <span className="text-xs text-muted-foreground">/ {r.nameEn}</span>
                {r.isDefault && <Badge variant="secondary">Default</Badge>}
                {!r.isActive && <Badge variant="outline">Hidden</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{r.priceLabelId || "—"} · {r.coverageId || "no coverage note"} · {rowCount(r.id)} price rows{r.salesWhatsapp ? ` · WA ${r.salesWhatsapp}` : ""}</p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">#{r.sortOrder}</span>
            {can.write && <Button variant="ghost" size="sm" onClick={() => setEditing(r)}><Pencil /> Edit</Button>}
            {can.deleteHard && <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setConfirm(r)}><Trash2 /></Button>}
          </li>
        ))}
        {data.regions.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted-foreground">No regions yet.</li>}
      </ul>
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-xl">
          {editing && <RegionForm key={editing === "new" ? "new" : editing.id} region={editing === "new" ? null : editing} onDone={() => { setEditing(null); invalidate(); }} />}
        </SheetContent>
      </Sheet>
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Delete region?"
        description={confirm ? `${confirm.nameId} and its ${rowCount(confirm.id)} price row(s) and terms will be deleted permanently.` : undefined}
        loading={remove.isPending}
        onConfirm={() => { if (confirm) remove.mutate(confirm.id); }}
      />
    </div>
  );
}

function RegionForm({ region, onDone }: { region: PriceRegion | null; onDone: () => void }) {
  const form = useForm<RegionValues>({
    resolver: zodResolver(regionSchema),
    defaultValues: region
      ? { slug: region.slug, nameId: region.nameId, nameEn: region.nameEn, priceLabelId: region.priceLabelId, priceLabelEn: region.priceLabelEn, coverageId: region.coverageId ?? "", coverageEn: region.coverageEn ?? "", salesWhatsapp: region.salesWhatsapp ?? "", isDefault: region.isDefault, isActive: region.isActive, sortOrder: String(region.sortOrder) }
      : { slug: "", nameId: "", nameEn: "", priceLabelId: "", priceLabelEn: "", coverageId: "", coverageEn: "", salesWhatsapp: "", isDefault: false, isActive: true, sortOrder: "10" },
  });
  const save = useMutation({
    mutationFn: (v: RegionValues) => {
      const body = { ...v, coverageId: v.coverageId || null, coverageEn: v.coverageEn || null, salesWhatsapp: v.salesWhatsapp || null, sortOrder: Number(v.sortOrder || 0) };
      return region ? api(`/admin/pricing/regions/${region.id}`, { method: "PATCH", body }) : api("/admin/pricing/regions", { method: "POST", body });
    },
    onSuccess: () => { toast.success(region ? "Region updated" : "Region added"); onDone(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const text = (name: keyof RegionValues, label: string, placeholder?: string, rows?: number) => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>{rows ? <Textarea rows={rows} placeholder={placeholder} {...field} value={String(field.value ?? "")} /> : <Input placeholder={placeholder} {...field} value={String(field.value ?? "")} />}</FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="flex h-full flex-col">
        <SheetHeader><SheetTitle>{region ? `Edit ${region.nameId}` : "Add region"}</SheetTitle><SheetDescription>Region names and labels are shown on the public site in both languages.</SheetDescription></SheetHeader>
        <div className="flex-1 space-y-4 px-4 pb-4">
          <div className="grid gap-4 sm:grid-cols-2">{text("nameId", "Name (ID)", "Jabodetabek")}{text("nameEn", "Name (EN)", "Greater Jakarta")}</div>
          <FormField control={form.control} name="slug" render={({ field }) => (
            <FormItem><FormLabel>Slug</FormLabel><FormControl><Input className="font-mono text-xs" placeholder="jabodetabek" {...field} /></FormControl><FormDescription>Used in URLs and the API. Lowercase, digits, dashes.</FormDescription><FormMessage /></FormItem>
          )} />
          <div className="grid gap-4 sm:grid-cols-2">{text("priceLabelId", "Price label (ID)", "Harga OTR Jabodetabek")}{text("priceLabelEn", "Price label (EN)", "OTR price, Greater Jakarta")}</div>
          <div className="grid gap-4 sm:grid-cols-2">{text("coverageId", "Coverage (ID)", "Jakarta, Bekasi, Bogor, Depok, Tangerang", 2)}{text("coverageEn", "Coverage (EN)", "Jakarta, Bekasi, Bogor, Depok, Tangerang", 2)}</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {text("salesWhatsapp", "Sales WhatsApp", "6285286126550")}
            {text("sortOrder", "Order", "0")}
          </div>
          <div className="flex flex-wrap gap-6">
            <FormField control={form.control} name="isDefault" render={({ field }) => (
              <FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0">Default region (starting prices on landing)</FormLabel></FormItem>
            )} />
            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0">Shown on site</FormLabel></FormItem>
            )} />
          </div>
        </div>
        <SheetFooter><Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="animate-spin" />} {region ? "Save changes" : "Add region"}</Button></SheetFooter>
      </form>
    </Form>
  );
}

// ─── Schemes ───────────────────────────────────────────────────────────────
const KINDS = Object.keys(PRICING_KIND_LABEL) as PricingKind[];
const AUDIENCES = Object.keys(PRICING_AUDIENCE_LABEL) as PricingAudience[];
const schemeSchema = z.object({
  slug: slugRule,
  kind: z.enum(["PURCHASE", "RENT_TO_OWN", "RENTAL", "B2B_CREDIT", "BAAS"]),
  nameId: z.string().trim().min(2, "Required").max(80),
  nameEn: z.string().trim().min(2, "Required").max(80),
  taglineId: z.string().trim().max(160),
  taglineEn: z.string().trim().max(160),
  descriptionId: z.string().trim().max(600),
  descriptionEn: z.string().trim().max(600),
  audience: z.enum(["ALL", "OJOL", "B2B"]),
  isPublic: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.string().trim().regex(/^\d{0,3}$/, "0–999"),
});
type SchemeValues = z.infer<typeof schemeSchema>;

export function SchemesPanel({ data }: { data: PricingData }) {
  const qc = useQueryClient();
  const can = useCan("pricing");
  const [editing, setEditing] = useState<PricingScheme | "new" | null>(null);
  const [confirm, setConfirm] = useState<PricingScheme | null>(null);
  const invalidate = () => qc.invalidateQueries({ queryKey: ["pricing"] });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/pricing/schemes/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Scheme deleted"); setConfirm(null); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const toggle = useMutation({
    mutationFn: (v: { id: string; isPublic: boolean }) => api(`/admin/pricing/schemes/${v.id}`, { method: "PATCH", body: { isPublic: v.isPublic } }),
    onSuccess: (_r, v) => { toast.success(v.isPublic ? "Scheme is now public" : "Scheme hidden from the site"); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const rowCount = (id: string) => data.entries.filter((e) => e.schemeId === id).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Schemes become tabs on product pages (only public ones). The kind decides which price columns apply.</p>
        {can.write && <Button onClick={() => setEditing("new")}><Plus /> Add scheme</Button>}
      </div>
      <ul className="divide-y divide-border rounded-lg border border-border">
        {data.schemes.map((s) => (
          <li key={s.id} className={cn("flex flex-wrap items-center gap-3 px-4 py-3", !s.isActive && "text-muted-foreground")}>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{s.nameId}</span>
                <span className="text-xs text-muted-foreground">/ {s.nameEn}</span>
                <Badge variant="outline">{PRICING_KIND_LABEL[s.kind]}</Badge>
                {s.audience !== "ALL" && <Badge variant="secondary">{PRICING_AUDIENCE_LABEL[s.audience]}</Badge>}
                {!s.isActive && <Badge variant="outline">Inactive</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{s.taglineId || "—"} · {rowCount(s.id)} price rows</p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">#{s.sortOrder}</span>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Switch checked={s.isPublic} disabled={!can.write || toggle.isPending} onCheckedChange={(v) => toggle.mutate({ id: s.id, isPublic: v })} aria-label="Public" /> Public
            </label>
            {can.write && <Button variant="ghost" size="sm" onClick={() => setEditing(s)}><Pencil /> Edit</Button>}
            {can.deleteHard && <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setConfirm(s)}><Trash2 /></Button>}
          </li>
        ))}
        {data.schemes.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted-foreground">No schemes yet.</li>}
      </ul>
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-xl">
          {editing && <SchemeForm key={editing === "new" ? "new" : editing.id} scheme={editing === "new" ? null : editing} onDone={() => { setEditing(null); invalidate(); }} />}
        </SheetContent>
      </Sheet>
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Delete scheme?"
        description={confirm ? `${confirm.nameId} and its ${rowCount(confirm.id)} price row(s) and terms will be deleted permanently.` : undefined}
        loading={remove.isPending}
        onConfirm={() => { if (confirm) remove.mutate(confirm.id); }}
      />
    </div>
  );
}

function SchemeForm({ scheme, onDone }: { scheme: PricingScheme | null; onDone: () => void }) {
  const form = useForm<SchemeValues>({
    resolver: zodResolver(schemeSchema),
    defaultValues: scheme
      ? { slug: scheme.slug, kind: scheme.kind, nameId: scheme.nameId, nameEn: scheme.nameEn, taglineId: scheme.taglineId ?? "", taglineEn: scheme.taglineEn ?? "", descriptionId: scheme.descriptionId ?? "", descriptionEn: scheme.descriptionEn ?? "", audience: scheme.audience, isPublic: scheme.isPublic, isActive: scheme.isActive, sortOrder: String(scheme.sortOrder) }
      : { slug: "", kind: "PURCHASE", nameId: "", nameEn: "", taglineId: "", taglineEn: "", descriptionId: "", descriptionEn: "", audience: "ALL", isPublic: true, isActive: true, sortOrder: "10" },
  });
  const save = useMutation({
    mutationFn: (v: SchemeValues) => {
      const body = { ...v, taglineId: v.taglineId || null, taglineEn: v.taglineEn || null, descriptionId: v.descriptionId || null, descriptionEn: v.descriptionEn || null, sortOrder: Number(v.sortOrder || 0) };
      return scheme ? api(`/admin/pricing/schemes/${scheme.id}`, { method: "PATCH", body }) : api("/admin/pricing/schemes", { method: "POST", body });
    },
    onSuccess: () => { toast.success(scheme ? "Scheme updated" : "Scheme added"); onDone(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const text = (name: keyof SchemeValues, label: string, placeholder?: string, rows?: number) => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>{rows ? <Textarea rows={rows} placeholder={placeholder} {...field} value={String(field.value ?? "")} /> : <Input placeholder={placeholder} {...field} value={String(field.value ?? "")} />}</FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="flex h-full flex-col">
        <SheetHeader><SheetTitle>{scheme ? `Edit ${scheme.nameId}` : "Add scheme"}</SheetTitle><SheetDescription>The kind decides which price columns the scheme uses. Changing the kind of an existing scheme keeps its rows but hides columns that no longer apply.</SheetDescription></SheetHeader>
        <div className="flex-1 space-y-4 px-4 pb-4">
          <div className="grid gap-4 sm:grid-cols-2">{text("nameId", "Name (ID)", "Beli Putus")}{text("nameEn", "Name (EN)", "Outright Purchase")}</div>
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem><FormLabel>Slug</FormLabel><FormControl><Input className="font-mono text-xs" placeholder="purchase" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            {text("sortOrder", "Order", "0")}
            <FormField control={form.control} name="kind" render={({ field }) => (
              <FormItem><FormLabel>Kind</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>{KINDS.map((k) => <SelectItem key={k} value={k}>{PRICING_KIND_LABEL[k]}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="audience" render={({ field }) => (
              <FormItem><FormLabel>Audience</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>{AUDIENCES.map((a) => <SelectItem key={a} value={a}>{PRICING_AUDIENCE_LABEL[a]}</SelectItem>)}</SelectContent></Select>
                <FormDescription>Shown as a small label, e.g. “Khusus driver ojol”.</FormDescription><FormMessage /></FormItem>
            )} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">{text("taglineId", "Tagline (ID)", "Motor langsung menjadi milik Anda")}{text("taglineEn", "Tagline (EN)", "The motorcycle is yours from day one")}</div>
          <div className="grid gap-4 sm:grid-cols-2">{text("descriptionId", "Description (ID)", "", 3)}{text("descriptionEn", "Description (EN)", "", 3)}</div>
          <div className="flex flex-wrap gap-6">
            <FormField control={form.control} name="isPublic" render={({ field }) => (
              <FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0">Public (shown on site)</FormLabel></FormItem>
            )} />
            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0">Active</FormLabel></FormItem>
            )} />
          </div>
        </div>
        <SheetFooter><Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="animate-spin" />} {scheme ? "Save changes" : "Add scheme"}</Button></SheetFooter>
      </form>
    </Form>
  );
}
