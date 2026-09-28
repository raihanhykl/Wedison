"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImageIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MediaPickerDialog } from "@/components/admin/media-picker";
import { api, errorMessage } from "@/lib/admin/api";
import {
  STATION_AMENITIES, STATION_STATUS_LABEL, STATION_TIER_LABEL,
  type Station, type StationStatus, type StationTier, type StationsMeta,
} from "@/lib/admin/types";

const StationMapPicker = dynamic(() => import("./station-map-picker"), { ssr: false, loading: () => <Skeleton className="h-72 w-full rounded-lg" /> });

const num = (min: number, max: number, msg: string) =>
  z.string().trim().refine((v) => v !== "" && Number.isFinite(Number(v)) && Number(v) >= min && Number(v) <= max, msg);

// Angka disimpan sebagai string di form (agar "-6." bisa diketik), dikonversi saat submit.
const schema = z.object({
  id: z.string().trim().regex(/^$|^[A-Z0-9-]{3,20}$/, "Uppercase letters/digits, e.g. ST0045"),
  name: z.string().trim().min(3, "Min. 3 characters").max(160),
  slug: z.string().trim().max(160),
  status: z.enum(["OPERATIONAL", "COMING_SOON", "MAINTENANCE", "CLOSED"]),
  tier: z.enum(["HUB", "SHOWROOM", "MITRA"]),
  address: z.string().trim().min(5, "Min. 5 characters").max(400),
  city: z.string().trim().min(2, "Required").max(80),
  province: z.string().trim().min(2, "Required").max(80),
  lat: num(-11, 6, "Latitude must be between -11 and 6 (Indonesia)"),
  lng: num(95, 141, "Longitude must be between 95 and 141 (Indonesia)"),
  pilesTotal: num(1, 100, "1–100"),
  powerKw: num(1, 1000, "1–1000 kW"),
  hours: z.string().trim().max(60),
  amenities: z.array(z.string()),
  photoUrl: z.string().trim().max(1000),
  notes: z.string().trim().max(1000),
  isActive: z.boolean(),
});
type Values = z.infer<typeof schema>;

const EMPTY: Values = {
  id: "", name: "", slug: "", status: "COMING_SOON", tier: "MITRA", address: "", city: "", province: "",
  lat: "", lng: "", pilesTotal: "1", powerKw: "40", hours: "24 jam", amenities: [], photoUrl: "", notes: "", isActive: true,
};

export function StationForm({ station, meta, onDone }: { station: Station | null; meta?: StationsMeta; onDone: () => void }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: station
      ? {
          id: station.id, name: station.name, slug: station.slug, status: station.status, tier: station.tier,
          address: station.address, city: station.city, province: station.province,
          lat: String(station.lat), lng: String(station.lng), pilesTotal: String(station.pilesTotal), powerKw: String(station.powerKw),
          hours: station.hours, amenities: station.amenities ?? [], photoUrl: station.photoUrl ?? "", notes: station.notes ?? "", isActive: station.isActive,
        }
      : EMPTY,
  });

  const save = useMutation({
    mutationFn: (v: Values) => {
      const body = {
        ...(station ? {} : v.id ? { id: v.id } : {}),
        name: v.name, slug: v.slug || undefined, status: v.status, tier: v.tier,
        address: v.address, city: v.city, province: v.province,
        lat: Number(v.lat), lng: Number(v.lng), pilesTotal: Number(v.pilesTotal), powerKw: Number(v.powerKw),
        hours: v.hours || "24 jam", amenities: v.amenities, photoUrl: v.photoUrl || null, notes: v.notes || null, isActive: v.isActive,
      };
      return station ? api(`/admin/stations/${station.id}`, { method: "PATCH", body }) : api("/admin/stations", { method: "POST", body });
    },
    onSuccess: () => { toast.success(station ? "Station updated" : "Station added"); onDone(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const lat = form.watch("lat");
  const lng = form.watch("lng");
  const piles = Number(form.watch("pilesTotal")) || 0;
  const photoUrl = form.watch("photoUrl");
  const latN = lat.trim() === "" ? null : Number(lat);
  const lngN = lng.trim() === "" ? null : Number(lng);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="flex h-full flex-col">
        <SheetHeader>
          <SheetTitle>{station ? `Edit ${station.id}` : "Add station"}</SheetTitle>
          <SheetDescription>{station ? "Changes go live on the public map right after saving." : "New stations appear on /super-charge/locations once saved (if active)."}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4 pb-4">
          <div className="grid gap-4 sm:grid-cols-[130px_1fr]">
            <FormField control={form.control} name="id" render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl><Input className="font-mono text-xs uppercase" placeholder="auto (ST0001)" disabled={!!station} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Station name</FormLabel><FormControl><Input placeholder="e.g. SuperCharge Cibubur" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>{(Object.keys(STATION_STATUS_LABEL) as StationStatus[]).map((s) => <SelectItem key={s} value={s}>{STATION_STATUS_LABEL[s]}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tier" render={({ field }) => (
              <FormItem>
                <FormLabel>Tier</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>{(Object.keys(STATION_TIER_LABEL) as StationTier[]).map((t) => <SelectItem key={t} value={t}>{STATION_TIER_LABEL[t]}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <div className="flex h-9 items-center gap-2">
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <span className="text-sm">{field.value ? "Shown on the map" : "Hidden"}</span>
                </div>
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem><FormLabel>City / regency</FormLabel><FormControl><Input list="station-cities" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="province" render={({ field }) => (
              <FormItem><FormLabel>Province</FormLabel><FormControl><Input list="station-provinces" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <datalist id="station-cities">{meta?.cities.map((c) => <option key={`${c.city}-${c.province}`} value={c.city} />)}</datalist>
            <datalist id="station-provinces">{meta?.provinces.map((p) => <option key={p} value={p} />)}</datalist>
          </div>

          <div className="space-y-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="lat" render={({ field }) => (
                <FormItem><FormLabel>Latitude</FormLabel><FormControl><Input inputMode="decimal" className="font-mono text-xs" placeholder="-6.2" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="lng" render={({ field }) => (
                <FormItem><FormLabel>Longitude</FormLabel><FormControl><Input inputMode="decimal" className="font-mono text-xs" placeholder="106.8" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <StationMapPicker
              lat={latN !== null && Number.isFinite(latN) ? latN : null}
              lng={lngN !== null && Number.isFinite(lngN) ? lngN : null}
              onChange={(p) => { form.setValue("lat", String(p.lat), { shouldValidate: true, shouldDirty: true }); form.setValue("lng", String(p.lng), { shouldValidate: true, shouldDirty: true }); }}
            />
            <FormDescription>Tip: in Google Maps, right-click a spot and click the coordinates to copy them.</FormDescription>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField control={form.control} name="pilesTotal" render={({ field }) => (
              <FormItem><FormLabel>Piles</FormLabel><FormControl><Input type="number" min={1} max={100} {...field} /></FormControl><FormDescription>= {piles * 2} chargers</FormDescription><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="powerKw" render={({ field }) => (
              <FormItem><FormLabel>Power (kW)</FormLabel><FormControl><Input type="number" min={1} max={1000} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="hours" render={({ field }) => (
              <FormItem><FormLabel>Opening hours</FormLabel><FormControl><Input placeholder="24 jam" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <FormField control={form.control} name="amenities" render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {STATION_AMENITIES.map((a) => {
                  const checked = field.value.includes(a.key);
                  return (
                    <label key={a.key} className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm has-[[data-state=checked]]:border-primary/40 has-[[data-state=checked]]:bg-primary/5">
                      <Checkbox checked={checked} onCheckedChange={(v) => field.onChange(v ? [...field.value, a.key] : field.value.filter((k) => k !== a.key))} />
                      {a.label}
                    </label>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="photoUrl" render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <div className="flex gap-3">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  {photoUrl ? <Image src={photoUrl} alt="" fill sizes="80px" className="object-cover" unoptimized /> : <ImageIcon className="absolute inset-0 m-auto size-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 space-y-2">
                  <FormControl><Input className="font-mono text-xs" placeholder="/api/uploads/… or https://…" {...field} /></FormControl>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => setPickerOpen(true)}><ImageIcon /> Choose from library</Button>
                    {photoUrl && <Button type="button" size="sm" variant="ghost" onClick={() => field.onChange("")}><X /> Remove</Button>}
                  </div>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="slug" render={({ field }) => (
            <FormItem><FormLabel>Slug</FormLabel><FormControl><Input className="font-mono text-xs" placeholder="generated from the name" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="notes" render={({ field }) => (
            <FormItem><FormLabel>Internal notes</FormLabel><FormControl><Textarea rows={2} placeholder="Not shown publicly" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <SheetFooter>
          <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="animate-spin" />} {station ? "Save changes" : "Add station"}</Button>
        </SheetFooter>
      </form>
      <MediaPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} folder="stations" onSelect={(m) => { form.setValue("photoUrl", m.url, { shouldDirty: true }); setPickerOpen(false); }} />
    </Form>
  );
}
