"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft, CalendarCheck, CheckCircle2, CircleAlert, Copy, ExternalLink, ImagePlus, Loader2, Lock, Megaphone, Plus,
  RefreshCw, Save, Trash2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { MediaPickerDialog } from "@/components/admin/media-picker";
import {
  SHOWROOM_STATUS_HELP, SHOWROOM_STATUS_LABEL, ShowroomStatusBadge, useShowroomPermissions, visibilitySummary,
} from "@/components/admin/showrooms/shared";
import { TeaserStatusBadge } from "@/components/admin/teasers/shared";
import { ApiError, api, errorMessage } from "@/lib/admin/api";
import { slugify } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/seo/site";
import { openStatusAt, type PublicShowroom } from "@/lib/showrooms/showroom";
import { TIME_ZONES } from "@/lib/teasers/teaser";
import type { AdminShowroomDetail, DayKey, ShowroomClosure, ShowroomStatus, WeekHours } from "@/lib/admin/types";

const MapPicker = dynamic(() => import("../supercharge/stations/station-map-picker"), { ssr: false, loading: () => <Skeleton className="h-72 w-full rounded-lg" /> });

const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Monday" }, { key: "tue", label: "Tuesday" }, { key: "wed", label: "Wednesday" }, { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" }, { key: "sat", label: "Saturday" }, { key: "sun", label: "Sunday" },
];
const STATUSES: ShowroomStatus[] = ["OPEN", "COMING_SOON", "TEMPORARILY_CLOSED", "CLOSED"];
const DEFAULT_HOURS: WeekHours = {
  mon: { open: "10:00", close: "19:00" }, tue: { open: "10:00", close: "19:00" }, wed: { open: "10:00", close: "19:00" },
  thu: { open: "10:00", close: "19:00" }, fri: { open: "10:00", close: "19:00" }, sat: { open: "10:00", close: "17:00" },
  sun: { open: "10:00", close: "17:00" }, holiday: { open: "10:00", close: "16:00" },
};

type State = {
  id: string; name: string; city: string; status: ShowroomStatus; isPublic: boolean; bookable: boolean; sortOrder: string;
  streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; lat: string; lng: string; mapsUrl: string;
  whatsapp: string; phone: string; email: string; timeZone: string; hours: WeekHours; closures: ShowroomClosure[];
  hasWorkshop: boolean; hasSupercharge: boolean; photoUrl: string;
};

function initial(s?: AdminShowroomDetail): State {
  if (!s) {
    return {
      id: "", name: "", city: "", status: "COMING_SOON", isPublic: false, bookable: true, sortOrder: "100",
      streetAddress: "", addressLocality: "", addressRegion: "", postalCode: "", lat: "", lng: "", mapsUrl: "",
      whatsapp: CONTACT.whatsapp, phone: "", email: "", timeZone: "Asia/Jakarta", hours: structuredClone(DEFAULT_HOURS), closures: [],
      hasWorkshop: true, hasSupercharge: false, photoUrl: "",
    };
  }
  return {
    id: s.id, name: s.name, city: s.city, status: s.status, isPublic: s.isPublic, bookable: s.bookable, sortOrder: String(s.sortOrder),
    streetAddress: s.streetAddress, addressLocality: s.addressLocality, addressRegion: s.addressRegion, postalCode: s.postalCode,
    lat: s.lat == null ? "" : String(s.lat), lng: s.lng == null ? "" : String(s.lng), mapsUrl: s.mapsUrl ?? "",
    whatsapp: s.whatsapp, phone: s.phone ?? "", email: s.email ?? "", timeZone: s.timeZone, hours: structuredClone(s.hours),
    closures: structuredClone(s.closures), hasWorkshop: s.hasWorkshop, hasSupercharge: s.hasSupercharge, photoUrl: s.photoUrl ?? "",
  };
}

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const normWa = (raw: string) => { const d = raw.replace(/\D/g, ""); return d.startsWith("0") ? `62${d.slice(1)}` : d; };
const todayYmd = () => new Date().toISOString().slice(0, 10);

/** Koordinat dari link Google Maps panjang (…/@-6.24,106.78,… atau !3d-6.24!4d106.78 atau ?q=-6.24,106.78). */
function coordsFromMapsUrl(url: string): { lat: number; lng: number } | null {
  const m = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ?? url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ?? url.match(/[?&](?:q|query|ll)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  if (!m) return null;
  const lat = Number(m[1]); const lng = Number(m[2]);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

/** Aturan yang sama dengan server (showroom.rules.ts) agar galat terlihat sebelum menyimpan. */
function validate(s: State, isNew: boolean): Record<string, string> {
  const e: Record<string, string> = {};
  if (isNew && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.id)) e.id = "Use lowercase letters, numbers and dashes";
  if (s.name.trim().length < 3) e.name = "Name is required";
  if (s.city.trim().length < 2) e.city = "City is required";
  if (!/^62\d{8,13}$/.test(normWa(s.whatsapp))) e.whatsapp = "Enter an Indonesian number, e.g. 0852 8612 6550";
  if (s.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())) e.email = "Enter a valid email address";
  if (s.mapsUrl.trim() && !/^https:\/\//.test(s.mapsUrl.trim())) e.mapsUrl = "Must start with https://";
  if (s.postalCode && !/^\d+$/.test(s.postalCode)) e.postalCode = "Digits only";
  const lat = s.lat === "" ? null : Number(s.lat); const lng = s.lng === "" ? null : Number(s.lng);
  if (lat != null && (!Number.isFinite(lat) || lat < -11 || lat > 6)) e.lat = "Latitude must be within Indonesia";
  if (lng != null && (!Number.isFinite(lng) || lng < 95 || lng > 141)) e.lat = "Longitude must be within Indonesia";
  for (const k of [...DAYS.map((d) => d.key), "holiday"] as (DayKey | "holiday")[]) {
    const h = s.hours[k];
    if (h && (!h.open || !h.close || toMin(h.close) - toMin(h.open) < 60)) e[`hours.${k}`] = "Closing must be at least 1 hour after opening";
  }
  s.closures.forEach((c, i) => {
    if (!c.from || !c.to) e[`closures.${i}`] = "Pick both dates";
    else if (c.to < c.from) e[`closures.${i}`] = "The end date is before the start date";
  });
  const listed = s.isPublic && (s.status === "OPEN" || s.status === "TEMPORARILY_CLOSED");
  if (listed) {
    if (!s.streetAddress.trim()) e.streetAddress = "Required to show this showroom on the site";
    if (!s.addressLocality.trim()) e.addressLocality = "Required to show this showroom on the site";
    if (lat == null || lng == null) e.lat ??= "Pin the location on the map to show it on the site";
    if (s.status === "OPEN" && !DAYS.some((d) => s.hours[d.key])) e.hours = "An open showroom needs at least one opening day";
  }
  return e;
}

export function ShowroomForm({ showroom }: { showroom?: AdminShowroomDetail }) {
  const router = useRouter();
  const qc = useQueryClient();
  const perm = useShowroomPermissions().data;
  const isNew = !showroom;
  const readOnly = !perm?.write;
  const [saved, setSaved] = useState<AdminShowroomDetail | undefined>(showroom);
  const [s, setS] = useState<State>(() => initial(showroom));
  const [dirty, setDirty] = useState(false);
  const [idTouched, setIdTouched] = useState(false);
  const [picking, setPicking] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [archiveAsk, setArchiveAsk] = useState<AdminShowroomDetail["linkedTeasers"]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const set = useCallback(<K extends keyof State>(k: K, v: State[K]) => { setS((p) => ({ ...p, [k]: v })); setDirty(true); }, []);
  const errors = useMemo(() => validate(s, isNew), [s, isNew]);
  const err = (k: string) => (showErrors || k.startsWith("hours") || k.startsWith("closures") ? errors[k] : undefined);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const body = () => ({
    ...(isNew ? { id: s.id } : {}),
    name: s.name.trim(), city: s.city.trim(), status: s.status, isPublic: s.isPublic, bookable: s.bookable, sortOrder: Number(s.sortOrder) || 0,
    streetAddress: s.streetAddress.trim(), addressLocality: s.addressLocality.trim(), addressRegion: s.addressRegion.trim(), postalCode: s.postalCode.trim(),
    lat: s.lat === "" ? null : Number(s.lat), lng: s.lng === "" ? null : Number(s.lng), mapsUrl: s.mapsUrl.trim(),
    whatsapp: s.whatsapp, phone: s.phone.trim(), email: s.email.trim(), timeZone: s.timeZone, hours: s.hours,
    closures: s.closures.map((c) => ({ ...c, note: c.note.trim() })), hasWorkshop: s.hasWorkshop, hasSupercharge: s.hasSupercharge, photoUrl: s.photoUrl,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (Object.keys(errors).length) { setShowErrors(true); throw new Error(`Fix ${Object.keys(errors).length} field(s) first: ${Object.values(errors)[0]}`); }
      return isNew
        ? api<{ data: AdminShowroomDetail }>("/admin/showrooms", { method: "POST", body: body() }).then((r) => r.data)
        : api<{ data: AdminShowroomDetail }>(`/admin/showrooms/${saved!.id}`, { method: "PUT", body: body() }).then((r) => r.data);
    },
    onSuccess: (r) => {
      const before = saved?.status;
      setDirty(false);
      setSaved(r);
      qc.invalidateQueries({ queryKey: ["showrooms"] });
      qc.invalidateQueries({ queryKey: ["leads-showrooms"] });
      qc.invalidateQueries({ queryKey: ["teasers"] });
      if (!isNew) qc.setQueryData(["showroom", r.id], r);
      toast.success(isNew ? "Showroom created" : r.syncedTeasers ? `Saved · ${r.syncedTeasers} linked teaser(s) updated` : "Changes saved");
      // Baru dibuka: tawarkan mengarsipkan teaser pembukaannya yang masih tayang.
      if (before === "COMING_SOON" && r.status === "OPEN") {
        const live = (r.linkedTeasers ?? []).filter((t) => t.status === "PUBLISHED");
        if (live.length) setArchiveAsk(live);
      }
      if (isNew) router.replace(`/admin/showrooms/${r.id}`);
    },
    onError: (e) => {
      if (e instanceof ApiError && e.details?.length) toast.error(e.message, { description: <span className="whitespace-pre-line">{e.details.slice(0, 4).map((d) => `• ${d.message}`).join("\n")}</span> });
      else toast.error(errorMessage(e));
    },
  });

  const remove = useMutation({
    mutationFn: () => api(`/admin/showrooms/${saved!.id}`, { method: "DELETE" }),
    onSuccess: () => { setDirty(false); toast.success("Showroom deleted"); qc.invalidateQueries({ queryKey: ["showrooms"] }); router.replace("/admin/showrooms"); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const archive = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => api(`/admin/teasers/${id}/transition`, { method: "POST", body: { action: "archive" } }))),
    onSuccess: (_r, ids) => {
      setArchiveAsk([]);
      // Perbarui daftar teaser di sidebar tanpa memuat ulang halaman.
      setSaved((prev) => (prev ? { ...prev, linkedTeasers: prev.linkedTeasers.map((t) => (ids.includes(t.id) ? { ...t, status: "ARCHIVED" } : t)) } : prev));
      toast.success("Opening teaser archived: its link now leads to the Showroom page");
      qc.invalidateQueries({ queryKey: ["teasers"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); if (!readOnly && !save.isPending) save.mutate(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const setCity = (city: string) => {
    set("city", city);
    if (isNew && !idTouched) set("id", slugify(city).slice(0, 40));
    if (!s.name.trim() || s.name === `Wedison ${s.city}`.trim()) set("name", city.trim() ? `Wedison ${city.trim()}` : "");
    if (!s.addressLocality || s.addressLocality === s.city) set("addressLocality", city);
  };

  const setDay = (k: DayKey | "holiday", v: WeekHours[DayKey]) => set("hours", { ...s.hours, [k]: v });
  const copyMondayToWeekdays = () => set("hours", { ...s.hours, tue: s.hours.mon, wed: s.hours.mon, thu: s.hours.mon, fri: s.hours.mon });

  // Pratinjau status yang dilihat pengunjung sekarang (aturan yang sama dengan halaman publik).
  const preview = useMemo(() => {
    const pub: PublicShowroom = {
      id: s.id, name: s.name, city: s.city, status: s.status, bookable: false, country: "ID",
      address: { streetAddress: s.streetAddress, addressLocality: s.addressLocality, addressRegion: s.addressRegion, postalCode: s.postalCode },
      lat: null, lng: null, mapsUrl: null, whatsapp: s.whatsapp, phone: null, email: null, timeZone: s.timeZone,
      tzLabel: TIME_ZONES.find((z) => z.value === s.timeZone)?.label ?? "WIB", hours: s.hours,
      closures: s.closures.filter((c) => c.from && c.to && c.to >= todayYmd()), hasWorkshop: s.hasWorkshop, hasSupercharge: s.hasSupercharge, photoUrl: null, updatedAt: "",
    };
    const st = openStatusAt(pub, new Date());
    if (st.kind === "open") return `Open · closes ${st.until} ${pub.tzLabel}`;
    if (st.kind === "closed") return `Closed · opens ${st.nextDay === "today" ? "today" : st.nextDay === "tomorrow" ? "tomorrow" : st.nextDay} ${st.at} ${pub.tzLabel}`;
    if (st.kind === "closedToday") return `Closed today${st.note ? ` · ${st.note}` : ""}`;
    return "Temporarily closed";
  }, [s]);

  const bookingOn = (from: string, to: string) =>
    (saved?.upcomingBookingDates ?? []).filter((d) => d.date >= from && d.date <= to).reduce((n, d) => n + d.count, 0);
  const pastClosures = s.closures.filter((c) => c.to && c.to < todayYmd()).length;
  const summary = visibilitySummary({ status: s.status, isPublic: s.isPublic, bookable: s.bookable });
  const errorCount = Object.keys(errors).length;

  return (
    <div className="space-y-4">
      <div className="sticky top-14 z-20 -mx-4 flex flex-wrap items-center gap-2 border-b border-border bg-background/95 px-4 py-2 backdrop-blur md:-mx-6 md:px-6">
        <Button variant="ghost" size="sm" asChild><Link href="/admin/showrooms"><ArrowLeft /> Showroom Locations</Link></Button>
        <p className="min-w-0 truncate font-display font-semibold">{s.name || (isNew ? "New showroom" : "Showroom")}</p>
        {saved && <ShowroomStatusBadge status={saved.status} />}
        <div className="ml-auto flex items-center gap-2">
          {dirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
          {!readOnly && (
            <Button disabled={save.isPending || (!dirty && !isNew)} onClick={() => save.mutate()}>
              {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} {isNew ? "Create showroom" : "Save"}
            </Button>
          )}
        </div>
      </div>

      {perm && readOnly && (
        <Alert><Lock className="size-4" /><AlertTitle>View only</AlertTitle><AlertDescription>Your role can view showrooms but not change them.</AlertDescription></Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <fieldset disabled={readOnly} className="min-w-0 space-y-4">
          {/* Identitas */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Showroom</CardTitle><CardDescription>How the showroom is named across the site and in WhatsApp messages.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="City" error={err("city")} hint="Short city name, used on “Coming soon” cards and in page text.">
                <Input id="sr-city" value={s.city} maxLength={60} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Surabaya" />
              </Field>
              <Field label="Showroom name" error={err("name")} hint="Shown on cards, the booking form and Google results.">
                <Input id="sr-name" value={s.name} maxLength={80} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Wedison Surabaya" />
              </Field>
              {isNew ? (
                <CodeField value={s.id} error={err("id")} onChange={(v) => { set("id", v); setIdTouched(true); }} />
              ) : (
                <Field label="Code" hint="Fixed: bookings refer to this code.">
                  <Input value={s.id} disabled className="font-mono" />
                </Field>
              )}
              <Field label="Display order" hint="Lower numbers come first on the Showroom page and in the booking form.">
                <Input id="sr-order" type="number" min={0} max={9999} value={s.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
              </Field>
            </CardContent>
          </Card>

          {/* Lokasi */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Location</CardTitle><CardDescription>Address and map pin shown on the Showroom page, in Google results and in Google Calendar.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Street address" error={err("streetAddress")} className="sm:col-span-2">
                  <Input id="sr-street" value={s.streetAddress} maxLength={200} onChange={(e) => set("streetAddress", e.target.value)} placeholder="e.g. Jl. Raya Darmo No. 1, Wonokromo" />
                </Field>
                <Field label="City / regency" error={err("addressLocality")}>
                  <Input id="sr-locality" value={s.addressLocality} maxLength={80} onChange={(e) => set("addressLocality", e.target.value)} placeholder="e.g. Kota Surabaya" />
                </Field>
                <Field label="Province" optional>
                  <Input id="sr-region" value={s.addressRegion} maxLength={80} onChange={(e) => set("addressRegion", e.target.value)} placeholder="e.g. Jawa Timur" />
                </Field>
                <Field label="Postal code" optional error={err("postalCode")}>
                  <Input id="sr-postal" value={s.postalCode} maxLength={10} inputMode="numeric" onChange={(e) => set("postalCode", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 60241" />
                </Field>
                <Field
                  label="Google Maps link" optional error={err("mapsUrl")}
                  hint={<>Shows the “Directions” button. {s.mapsUrl && /^https:\/\//.test(s.mapsUrl) && <a href={s.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline underline-offset-4">Test <ExternalLink className="size-3" /></a>}</>}
                >
                  <div className="flex gap-2">
                    <Input id="sr-maps" value={s.mapsUrl} maxLength={1000} onChange={(e) => set("mapsUrl", e.target.value)} placeholder="https://maps.app.goo.gl/…" />
                    <Button
                      type="button" variant="outline" size="sm" className="h-9 shrink-0" title="Fill the map pin from this link"
                      onClick={() => {
                        const c = coordsFromMapsUrl(s.mapsUrl);
                        if (c) { set("lat", String(+c.lat.toFixed(6))); set("lng", String(+c.lng.toFixed(6))); toast.success("Pin set from the link"); }
                        else toast.error("No coordinates in this link. Short links (maps.app.goo.gl) don’t contain them: click the map instead.");
                      }}
                    >
                      Use for pin
                    </Button>
                  </div>
                </Field>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-end gap-3">
                  <Field label="Latitude" className="w-40"><Input id="sr-lat" inputMode="decimal" value={s.lat} onChange={(e) => set("lat", e.target.value)} placeholder="-7.2905" /></Field>
                  <Field label="Longitude" className="w-40"><Input id="sr-lng" inputMode="decimal" value={s.lng} onChange={(e) => set("lng", e.target.value)} placeholder="112.7398" /></Field>
                  <p className="pb-2 text-xs text-muted-foreground">Click the map or drag the pin.</p>
                </div>
                {err("lat") && <p className="text-xs text-destructive">{err("lat")}</p>}
                <div className="h-72 overflow-hidden rounded-lg border border-border">
                  <MapPicker
                    lat={s.lat === "" ? null : Number(s.lat)}
                    lng={s.lng === "" ? null : Number(s.lng)}
                    onChange={(p) => { set("lat", String(p.lat)); set("lng", String(p.lng)); }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kontak */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Contacts</CardTitle><CardDescription>Booking confirmations open WhatsApp to this number.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <Field label="WhatsApp" error={err("whatsapp")} hint={!errors.whatsapp ? <>Saved as +{normWa(s.whatsapp)}. <a href={`https://wa.me/${normWa(s.whatsapp)}`} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">Test</a></> : undefined}>
                <Input id="sr-wa" value={s.whatsapp} inputMode="tel" maxLength={24} onChange={(e) => set("whatsapp", e.target.value)} placeholder="e.g. 0852 8612 6550" />
              </Field>
              <Field label="Phone" optional><Input id="sr-phone" value={s.phone} inputMode="tel" maxLength={24} onChange={(e) => set("phone", e.target.value)} placeholder="e.g. 031 1234 5678" /></Field>
              <Field label="Email" optional error={err("email")}><Input id="sr-email" type="email" value={s.email} maxLength={120} onChange={(e) => set("email", e.target.value)} placeholder={`e.g. ${s.id || "cabang"}@wedison.co`} /></Field>
            </CardContent>
          </Card>

          {/* Jam buka */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Opening hours</CardTitle>
              <CardDescription>Booking slots (1 hour, every 30 minutes) follow these hours in the showroom’s own time zone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Field label="Time zone" className="sm:max-w-sm">
                <Select value={s.timeZone} onValueChange={(v) => set("timeZone", v)} disabled={readOnly}>
                  <SelectTrigger id="sr-tz"><SelectValue /></SelectTrigger>
                  <SelectContent>{TIME_ZONES.map((z) => <SelectItem key={z.value} value={z.value}>{z.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <div className="divide-y divide-border rounded-lg border border-border">
                {DAYS.map((d) => (
                  <HoursRow key={d.key} label={d.label} value={s.hours[d.key]} error={errors[`hours.${d.key}`]} onChange={(v) => setDay(d.key, v)} disabled={readOnly} />
                ))}
                <HoursRow label="Public holidays" hint="Shown on the site only; booking follows the weekday hours." value={s.hours.holiday} error={errors["hours.holiday"]} onChange={(v) => setDay("holiday", v)} disabled={readOnly} offLabel="Not shown" />
              </div>
              {errors.hours && <p className="text-xs text-destructive">{errors.hours}</p>}
              {!readOnly && <Button type="button" variant="ghost" size="sm" onClick={copyMondayToWeekdays}><Copy /> Copy Monday to Tuesday–Friday</Button>}
            </CardContent>
          </Card>

          {/* Tanggal tutup */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Closure dates</CardTitle>
              <CardDescription>Holidays (e.g. Lebaran), renovation or events. No booking slots on these dates; the site shows “Closed” with your note.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {s.closures.length === 0 && <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">No closure dates.</p>}
              {s.closures.map((c, i) => {
                const past = !!c.to && c.to < todayYmd();
                const clash = c.from && c.to && c.to >= c.from ? bookingOn(c.from, c.to) : 0;
                return (
                  <div key={i} className={cn("rounded-lg border border-border p-3", past && "opacity-60")}>
                    <div className="grid gap-2 sm:grid-cols-[9.5rem_9.5rem_minmax(0,1fr)_auto] sm:items-end">
                      <Field label="From"><Input type="date" value={c.from} onChange={(e) => { const v = e.target.value; set("closures", s.closures.map((x, k) => (k === i ? { ...x, from: v, to: !x.to || x.to < v ? v : x.to } : x))); }} /></Field>
                      <Field label="To"><Input type="date" value={c.to} min={c.from} onChange={(e) => set("closures", s.closures.map((x, k) => (k === i ? { ...x, to: e.target.value } : x)))} /></Field>
                      <Field label="Note shown on the site" optional><Input value={c.note} maxLength={120} onChange={(e) => set("closures", s.closures.map((x, k) => (k === i ? { ...x, note: e.target.value } : x)))} placeholder="e.g. Libur Lebaran" /></Field>
                      <Button type="button" variant="ghost" size="icon" className="text-destructive" aria-label="Remove closure" onClick={() => set("closures", s.closures.filter((_, k) => k !== i))}><X /></Button>
                    </div>
                    {errors[`closures.${i}`] && <p className="mt-1 text-xs text-destructive">{errors[`closures.${i}`]}</p>}
                    {past && <p className="mt-1 text-xs text-muted-foreground">Past · no longer shown</p>}
                    {clash > 0 && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-chart-4">
                        <CircleAlert className="size-3.5" /> {clash} active booking(s) on these dates.{" "}
                        <Link className="underline underline-offset-4" href={`/admin/leads/bookings?showroom=${s.id}&from=${c.from}&to=${c.to}`}>Review and reschedule</Link>
                      </p>
                    )}
                  </div>
                );
              })}
              {!readOnly && (
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" disabled={s.closures.length >= 60} onClick={() => { const t = todayYmd(); set("closures", [...s.closures, { from: t, to: t, note: "" }]); }}><Plus /> Add closure</Button>
                  {pastClosures > 0 && <Button type="button" variant="ghost" size="sm" onClick={() => set("closures", s.closures.filter((c) => !c.to || c.to >= todayYmd()))}>Remove {pastClosures} past</Button>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fasilitas & foto */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Facilities & photo</CardTitle></CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_260px]">
              <div className="space-y-3">
                <Toggle id="sr-workshop" label="Official service centre" hint="Shown as “Service” on the card and in the FAQ." checked={s.hasWorkshop} onChange={(v) => set("hasWorkshop", v)} />
                <Toggle id="sr-charge" label="SuperCharge station on site" hint="Shown as “SuperCharge” and listed in the FAQ and llms.txt." checked={s.hasSupercharge} onChange={(v) => set("hasSupercharge", v)} />
              </div>
              <div className="space-y-2">
                <Label>Card photo <span className="font-normal text-muted-foreground">(3:2)</span></Label>
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-muted">
                  {s.photoUrl ? <Image src={s.photoUrl} alt="" fill sizes="260px" className="object-cover" unoptimized /> : <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">Default photo</span>}
                </div>
                {!readOnly && (
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setPicking(true)}>{s.photoUrl ? <RefreshCw /> : <ImagePlus />} {s.photoUrl ? "Replace" : "Choose"}</Button>
                    {s.photoUrl && <Button type="button" variant="ghost" size="sm" onClick={() => set("photoUrl", "")}><X /> Remove</Button>}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">1500 × 1000 px or larger.</p>
              </div>
            </CardContent>
          </Card>
        </fieldset>

        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Status & visibility</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <fieldset disabled={readOnly} className="space-y-4">
                <div className="space-y-1.5">
                  <Select value={s.status} onValueChange={(v) => set("status", v as ShowroomStatus)} disabled={readOnly}>
                    <SelectTrigger id="sr-status" aria-label="Status"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((st) => <SelectItem key={st} value={st}>{SHOWROOM_STATUS_LABEL[st]}</SelectItem>)}</SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{SHOWROOM_STATUS_HELP[s.status]}</p>
                </div>
                {s.status !== "CLOSED" && (
                  <Toggle id="sr-public" label="Show on the site" hint={s.status === "COMING_SOON" ? "Adds a “Coming soon” card with the city name only." : "Showroom page, Contact page and Google results."} checked={s.isPublic} onChange={(v) => set("isPublic", v)} />
                )}
                {s.status === "OPEN" && <Toggle id="sr-bookable" label="Accept bookings" hint="Appears in the Test Ride / Book a Visit form." checked={s.bookable} onChange={(v) => set("bookable", v)} />}
              </fieldset>
              <div className="rounded-lg bg-muted/60 p-3 text-sm">
                <p className="font-medium">{summary}</p>
                {s.status !== "CLOSED" && s.status !== "COMING_SOON" && s.isPublic && <p className="mt-1 text-xs text-muted-foreground">Visitors see now: {preview}</p>}
              </div>
              {showErrors && errorCount > 0 && (
                <p className="flex items-center gap-1.5 text-xs text-destructive"><CircleAlert className="size-3.5" /> {errorCount} field(s) need attention.</p>
              )}
              {!showErrors && errorCount === 0 && dirty && <p className="flex items-center gap-1.5 text-xs text-primary"><CheckCircle2 className="size-3.5" /> Ready to save.</p>}
            </CardContent>
          </Card>

          {saved && (
            <Card>
              <CardContent className="space-y-3 text-sm">
                <Link href={`/admin/leads/bookings?showroom=${saved.id}&upcoming=1`} className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-muted/50">
                  <CalendarCheck className="size-4 text-muted-foreground" />
                  <span className="flex-1">Upcoming bookings</span>
                  <span className="font-mono font-semibold">{saved.bookings.upcoming}</span>
                </Link>
                <p className="text-xs text-muted-foreground">{saved.bookings.total} booking(s) in total.</p>
                {saved.visible && <a href="/id/showroom/#lokasi" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline underline-offset-4">View on the Showroom page <ExternalLink className="size-3" /></a>}
              </CardContent>
            </Card>
          )}

          {saved && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Megaphone className="size-4" /> Opening teasers</CardTitle><CardDescription>Linked teasers copy this showroom’s address, contacts and time zone automatically.</CardDescription></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {(saved.linkedTeasers ?? []).length === 0 && <p className="text-muted-foreground">None linked.</p>}
                {(saved.linkedTeasers ?? []).map((t) => (
                  <Link key={t.id} href={`/admin/teasers/${t.id}`} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-muted">
                    <span className="truncate">{t.city} <span className="font-mono text-xs text-muted-foreground">/{t.slug}</span></span>
                    <TeaserStatusBadge status={t.status} />
                  </Link>
                ))}
                {perm?.teasers && <Button variant="outline" size="sm" asChild><Link href={`/admin/teasers/new?showroom=${saved.id}`}><Plus /> Create opening teaser</Link></Button>}
              </CardContent>
            </Card>
          )}

          {saved && perm?.delete && (
            <Card>
              <CardContent className="space-y-2 text-sm">
                <Button variant="ghost" size="sm" className="text-destructive" disabled={saved.bookings.total > 0} onClick={() => setConfirmDelete(true)}><Trash2 /> Delete showroom</Button>
                {saved.bookings.total > 0 && <p className="text-xs text-muted-foreground">Has booking history: set the status to “Closed permanently” instead so the history stays.</p>}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      <MediaPickerDialog open={picking} onOpenChange={setPicking} folder="showrooms" onSelect={(m) => {
        if (m.width && m.height && Math.abs(m.width / m.height - 1.5) / 1.5 > 0.06) toast.warning(`This photo is ${m.width}×${m.height}; cards are 3:2, so it will be cropped.`);
        set("photoUrl", m.url); setPicking(false);
      }} />
      <ConfirmDialog open={confirmDelete} onOpenChange={setConfirmDelete} title={`Delete ${s.name || "this showroom"}?`} description="It disappears from the site and the booking form. Linked opening teasers keep their content but are unlinked." loading={remove.isPending} onConfirm={() => remove.mutate()} />
      <Dialog open={archiveAsk.length > 0} onOpenChange={(o) => !o && setArchiveAsk([])}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>The showroom is open: archive its opening teaser?</DialogTitle>
            <DialogDescription>
              {archiveAsk.map((t) => `/showroom/${t.slug}`).join(", ")} is still live. Archiving hides it and sends visitors of that link to the Showroom page, where {s.name} now appears with booking.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveAsk([])}>Keep it live</Button>
            <Button onClick={() => archive.mutate(archiveAsk.map((t) => t.id))} disabled={archive.isPending}>{archive.isPending && <Loader2 className="animate-spin" />} Archive teaser</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, hint, error, optional, className, children }: { label: string; hint?: React.ReactNode; error?: string; optional?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label} {optional && <span className="font-normal text-muted-foreground">(optional)</span>}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Toggle({ id, label, hint, checked, onChange }: { id: string; label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function HoursRow({ label, hint, value, error, onChange, disabled, offLabel = "Closed" }: {
  label: string; hint?: string; value: WeekHours[DayKey]; error?: string; onChange: (v: WeekHours[DayKey]) => void; disabled?: boolean; offLabel?: string;
}) {
  return (
    <div className="px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex w-44 items-center gap-2">
          <Switch checked={!!value} onCheckedChange={(on) => onChange(on ? { open: "10:00", close: "19:00" } : null)} disabled={disabled} aria-label={`${label} open`} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        {value ? (
          <div className="flex items-center gap-2">
            <Input type="time" className="h-8 w-28" value={value.open} onChange={(e) => onChange({ ...value, open: e.target.value })} aria-label={`${label} opens`} disabled={disabled} />
            <span className="text-muted-foreground">–</span>
            <Input type="time" className="h-8 w-28" value={value.close} onChange={(e) => onChange({ ...value, close: e.target.value })} aria-label={`${label} closes`} disabled={disabled} />
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">{offLabel}</span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function CodeField({ value, error, onChange }: { value: string; error?: string; onChange: (v: string) => void }) {
  const debounced = useDebounce(value, 400);
  const check = useQuery({
    queryKey: ["showroom-id", debounced],
    queryFn: () => api<{ data: { available: boolean; reason: string | null } }>("/admin/showrooms/check-id", { query: { id: debounced } }).then((r) => r.data),
    enabled: debounced.length >= 2,
  });
  const pending = value !== debounced || check.isFetching;
  return (
    <Field
      label="Code" error={error}
      hint={!value ? "Filled from the city. Cannot be changed later." : pending ? "Checking…" : check.data?.available ? "Available · cannot be changed later" : check.data?.reason ?? undefined}
    >
      <Input
        id="sr-code"
        className="font-mono"
        value={value}
        maxLength={40}
        onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+/, "").slice(0, 40))}
        onBlur={() => onChange(slugify(value).slice(0, 40))}
        placeholder="surabaya"
      />
    </Field>
  );
}
