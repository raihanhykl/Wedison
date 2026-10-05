"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useDepartments, useHrPermissions, useLocations } from "@/components/admin/hr/shared";
import { api, errorMessage } from "@/lib/admin/api";
import type { JobDepartment, JobLocation } from "@/lib/admin/types";

export function StructureView() {
  const perm = useHrPermissions();
  const can = !!perm.data?.taxonomy;
  return (
    <>
      <PageHeader title="Divisions & Locations" description="Used to group openings and as filters on the careers page. Only divisions and locations with live openings appear there." />
      {perm.data && !can && <p className="text-sm text-muted-foreground">You can view these lists. Only an HR Manager can change them.</p>}
      <Tabs defaultValue="departments">
        <TabsList>
          <TabsTrigger value="departments"><Building2 className="size-4" /> Divisions</TabsTrigger>
          <TabsTrigger value="locations"><MapPin className="size-4" /> Locations</TabsTrigger>
        </TabsList>
        <TabsContent value="departments" className="mt-4"><Departments can={can} /></TabsContent>
        <TabsContent value="locations" className="mt-4"><Locations can={can} /></TabsContent>
      </Tabs>
    </>
  );
}

function Departments({ can }: { can: boolean }) {
  const qc = useQueryClient();
  const { data, isLoading } = useDepartments();
  const [editing, setEditing] = useState<JobDepartment | "new" | null>(null);
  const [form, setForm] = useState({ nameId: "", nameEn: "", sortOrder: "0", isActive: true });
  const [toDelete, setToDelete] = useState<JobDepartment | null>(null);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["hr-departments"] }); qc.invalidateQueries({ queryKey: ["hr-jobs"] }); };

  const open = (d: JobDepartment | "new") => {
    setForm(d === "new" ? { nameId: "", nameEn: "", sortOrder: String(data?.length ?? 0), isActive: true } : { nameId: d.nameId, nameEn: d.nameEn ?? "", sortOrder: String(d.sortOrder), isActive: d.isActive });
    setEditing(d);
  };
  const save = useMutation({
    mutationFn: () => {
      const body = { nameId: form.nameId.trim(), nameEn: form.nameEn.trim() || null, sortOrder: Number(form.sortOrder) || 0, isActive: form.isActive };
      return editing && editing !== "new" ? api(`/admin/hr/departments/${editing.id}`, { method: "PATCH", body }) : api("/admin/hr/departments", { method: "POST", body });
    },
    onSuccess: () => { toast.success("Division saved"); setEditing(null); refresh(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const toggle = useMutation({
    mutationFn: (d: JobDepartment) => api(`/admin/hr/departments/${d.id}`, { method: "PATCH", body: { isActive: !d.isActive } }),
    onSuccess: refresh,
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/hr/departments/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Division deleted"); setToDelete(null); refresh(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="space-y-3">
      {can && <div className="flex justify-end"><Button onClick={() => open("new")}><Plus /> New division</Button></div>}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader className="bg-muted/60"><TableRow><TableHead className="w-16">Order</TableHead><TableHead>Name (ID)</TableHead><TableHead>Name (EN)</TableHead><TableHead className="text-right">Openings</TableHead><TableHead className="w-24">Active</TableHead><TableHead className="w-24" /></TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <TableRow key={i}>{Array.from({ length: 6 }).map((__, j) => <TableCell key={j}><Skeleton className="h-4" /></TableCell>)}</TableRow>)
              : data?.length ? data.map((d) => (
                <TableRow key={d.id} className={d.isActive ? "" : "opacity-60"}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{d.sortOrder}</TableCell>
                  <TableCell className="font-medium">{d.nameId}</TableCell>
                  <TableCell className="text-muted-foreground">{d.nameEn ?? "—"}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{d._count?.jobs ?? 0}</TableCell>
                  <TableCell><Switch checked={d.isActive} disabled={!can} onCheckedChange={() => toggle.mutate(d)} aria-label="Active" /></TableCell>
                  <TableCell>{can && <div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="size-8" onClick={() => open(d)} aria-label="Edit"><Pencil /></Button><Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => setToDelete(d)} aria-label="Delete"><Trash2 /></Button></div>}</TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={6} className="p-0"><EmptyState icon={Building2} title="No divisions yet" /></TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing === "new" ? "New division" : "Edit division"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Name (ID)</Label><Input value={form.nameId} onChange={(e) => setForm({ ...form, nameId: e.target.value })} placeholder="Penjualan" /></div>
            <div className="space-y-1.5"><Label>Name (EN)</Label><Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} placeholder="Sales" /></div>
            <div className="space-y-1.5"><Label>Order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></div>
            <div className="flex items-end justify-between gap-2 pb-2"><Label htmlFor="d-active">Active</Label><Switch id="d-active" checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={() => save.mutate()} disabled={form.nameId.trim().length < 2 || save.isPending}>{save.isPending && <Loader2 className="animate-spin" />} Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} title={`Delete “${toDelete?.nameId}”?`} description="Divisions used by active openings cannot be deleted; deactivate them instead." loading={remove.isPending} onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }} />
    </div>
  );
}

function Locations({ can }: { can: boolean }) {
  const qc = useQueryClient();
  const { data, isLoading } = useLocations();
  const [editing, setEditing] = useState<JobLocation | "new" | null>(null);
  const [form, setForm] = useState({ city: "", province: "", country: "Indonesia", countryCode: "ID", sortOrder: "0", isActive: true });
  const [toDelete, setToDelete] = useState<JobLocation | null>(null);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["hr-locations"] }); qc.invalidateQueries({ queryKey: ["hr-jobs"] }); };

  const open = (l: JobLocation | "new") => {
    setForm(l === "new" ? { city: "", province: "", country: "Indonesia", countryCode: "ID", sortOrder: String(data?.length ?? 0), isActive: true } : { city: l.city, province: l.province ?? "", country: l.country, countryCode: l.countryCode, sortOrder: String(l.sortOrder), isActive: l.isActive });
    setEditing(l);
  };
  const save = useMutation({
    mutationFn: () => {
      const body = { city: form.city.trim(), province: form.province.trim() || null, country: form.country.trim(), countryCode: form.countryCode.trim(), sortOrder: Number(form.sortOrder) || 0, isActive: form.isActive };
      return editing && editing !== "new" ? api(`/admin/hr/locations/${editing.id}`, { method: "PATCH", body }) : api("/admin/hr/locations", { method: "POST", body });
    },
    onSuccess: () => { toast.success("Location saved"); setEditing(null); refresh(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const toggle = useMutation({
    mutationFn: (l: JobLocation) => api(`/admin/hr/locations/${l.id}`, { method: "PATCH", body: { isActive: !l.isActive } }),
    onSuccess: refresh,
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/hr/locations/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Location deleted"); setToDelete(null); refresh(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const countries = [...new Set((data ?? []).map((l) => l.country))];

  return (
    <div className="space-y-3">
      {can && <div className="flex justify-end"><Button onClick={() => open("new")}><Plus /> New location</Button></div>}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader className="bg-muted/60"><TableRow><TableHead>City</TableHead><TableHead>Province / region</TableHead><TableHead>Country</TableHead><TableHead className="text-right">Openings</TableHead><TableHead className="w-24">Active</TableHead><TableHead className="w-24" /></TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <TableRow key={i}>{Array.from({ length: 6 }).map((__, j) => <TableCell key={j}><Skeleton className="h-4" /></TableCell>)}</TableRow>)
              : data?.length ? data.map((l) => (
                <TableRow key={l.id} className={l.isActive ? "" : "opacity-60"}>
                  <TableCell className="font-medium">{l.city}</TableCell>
                  <TableCell className="text-muted-foreground">{l.province ?? "—"}</TableCell>
                  <TableCell>{l.country} <Badge variant="outline" className="ml-1 font-mono text-[10px]">{l.countryCode}</Badge></TableCell>
                  <TableCell className="text-right font-mono text-xs">{l._count?.jobs ?? 0}</TableCell>
                  <TableCell><Switch checked={l.isActive} disabled={!can} onCheckedChange={() => toggle.mutate(l)} aria-label="Active" /></TableCell>
                  <TableCell>{can && <div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="size-8" onClick={() => open(l)} aria-label="Edit"><Pencil /></Button><Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => setToDelete(l)} aria-label="Delete"><Trash2 /></Button></div>}</TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={6} className="p-0"><EmptyState icon={MapPin} title="No locations yet" /></TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      {countries.length > 1 && <p className="text-xs text-muted-foreground">{countries.length} countries: {countries.join(", ")}. Visitors can filter openings by country on the careers page.</p>}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing === "new" ? "New location" : "Edit location"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Bandung" /></div>
            <div className="space-y-1.5"><Label>Province / region</Label><Input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} placeholder="Jawa Barat" /></div>
            <div className="space-y-1.5"><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Country code (ISO)</Label><Input maxLength={2} className="font-mono uppercase" value={form.countryCode} onChange={(e) => setForm({ ...form, countryCode: e.target.value.toUpperCase() })} placeholder="ID" /></div>
            <div className="space-y-1.5"><Label>Order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></div>
            <div className="flex items-end justify-between gap-2 pb-2"><Label htmlFor="l-active">Active</Label><Switch id="l-active" checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={() => save.mutate()} disabled={form.city.trim().length < 2 || form.countryCode.length !== 2 || save.isPending}>{save.isPending && <Loader2 className="animate-spin" />} Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} title={`Delete “${toDelete?.city}”?`} description="Locations used by active openings cannot be deleted; deactivate them instead." loading={remove.isPending} onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }} />
    </div>
  );
}
