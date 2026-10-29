"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, CircleAlert, ExternalLink, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/admin/api";
import { slugify } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { MODEL_CATALOG, MODEL_KEYS, TIME_ZONES, type ModelKey } from "@/lib/teasers/teaser";
import { Field } from "./fields";
import { normalizeWhatsapp, zonedIso, type EditorProps, type ShowroomOption } from "./form-state";

export function EventTab({ s, set, readOnly, facts, teaserId, slugTouched, onSlugTouched, issuePaths, showroomOptions, onLink }: EditorProps & {
  slugTouched: boolean; onSlugTouched: () => void; issuePaths: Set<string>;
  showroomOptions: ShowroomOption[]; onLink: (o: ShowroomOption | null) => void;
}) {
  const linked = showroomOptions.find((o) => o.id === s.showroomId) ?? null;
  // Terhubung ke showroom: alamat, kontak, zona waktu dikelola di Showroom Locations.
  const locked = !!s.showroomId;
  const startAt = zonedIso(s.startDate, s.startTime, s.timeZone);
  const endAt = zonedIso(s.endDate, s.endTime, s.timeZone);
  const badSchedule = issuePaths.has("schedule");
  const startInPast = startAt ? new Date(startAt).getTime() < Date.now() : false;
  const wa = normalizeWhatsapp(s.whatsapp);
  const waValid = /^62\d{8,13}$/.test(wa);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim());
  const mapsValid = !s.mapsUrl.trim() || /^https:\/\//.test(s.mapsUrl.trim());

  const setCity = (city: string) => {
    set("city", city);
    if (!slugTouched) set("slug", slugify(city));
    // Kota di alamat mengikuti nama kota selama belum diisi berbeda.
    if (locked) return; // nama & alamat mengikuti showroom terkait
    if (!s.addressLocality || s.addressLocality === s.city) set("addressLocality", city);
    // Nama showroom ikut kota selama masih nama otomatis (bandingkan tanpa spasi tepi: "New " saat mengetik).
    const auto = (c: string) => `Wedison Experience Center ${c}`.trim();
    if (!s.showroomName.trim() || s.showroomName.trim() === auto(s.city)) set("showroomName", city.trim() ? auto(city) : "");
  };

  const toggleModel = (k: ModelKey, on: boolean) =>
    set("models", MODEL_KEYS.filter((m) => (m === k ? on : s.models.includes(m))));

  return (
    <fieldset disabled={readOnly} className="min-w-0 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Showroom</CardTitle>
          <CardDescription>Which showroom this page announces and where it lives on the site.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Linked showroom" htmlFor="t-showroom" className="sm:col-span-2"
            hint={linked
              ? <>Showroom name, address, contacts and time zone come from <Link href={`/admin/showrooms/${linked.id}`} className="text-primary underline underline-offset-4">{linked.name}</Link> and stay in sync when it changes.</>
              : "Link a showroom from Showroom Locations to reuse its address and contacts, or leave it unlinked and fill them in here."}
          >
            <Select value={s.showroomId ?? "none"} onValueChange={(v) => onLink(v === "none" ? null : showroomOptions.find((o) => o.id === v) ?? null)} disabled={readOnly}>
              <SelectTrigger id="t-showroom" className="sm:max-w-md"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not linked (enter manually)</SelectItem>
                {showroomOptions.filter((o) => o.status !== "CLOSED" || o.id === s.showroomId).map((o) => (
                  <SelectItem key={o.id} value={o.id}>{o.name}{o.status === "COMING_SOON" ? " · coming soon" : ""}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="City" htmlFor="t-city" hint="Used in the page text through {city}, e.g. “coming to Surabaya”.">
            <Input id="t-city" value={s.city} maxLength={60} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Surabaya" className="text-base font-medium" />
          </Field>
          <Field label="Showroom name" htmlFor="t-name" hint="Shown with the address and used through {showroom}.">
            <Input id="t-name" disabled={locked} value={s.showroomName} maxLength={120} onChange={(e) => set("showroomName", e.target.value)} placeholder="e.g. Wedison Experience Center Surabaya" />
          </Field>
          <SlugField slug={s.slug} onChange={(v) => { set("slug", v); onSlugTouched(); }} teaserId={teaserId} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Opening schedule</CardTitle>
          <CardDescription>The countdown runs to the start time. Times are in the showroom’s local time zone, not your computer’s.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Time zone" htmlFor="t-tz">
            <Select value={s.timeZone} onValueChange={(v) => set("timeZone", v)} disabled={readOnly || locked}>
              <SelectTrigger id="t-tz" className="sm:max-w-sm"><SelectValue /></SelectTrigger>
              <SelectContent>{TIME_ZONES.map((z) => <SelectItem key={z.value} value={z.value}>{z.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2">
              <Field label="Starts" htmlFor="t-start-date">
                <Input id="t-start-date" type="date" className="min-w-0" value={s.startDate} onChange={(e) => { const v = e.target.value; if (s.endDate === s.startDate || !s.endDate || s.endDate < v) set("endDate", v); set("startDate", v); }} />
              </Field>
              <Field label="Time" htmlFor="t-start-time">
                <Input id="t-start-time" type="time" className="min-w-0" value={s.startTime} onChange={(e) => set("startTime", e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2">
              <Field label="Ends" htmlFor="t-end-date">
                <Input id="t-end-date" type="date" className="min-w-0" value={s.endDate} min={s.startDate} onChange={(e) => set("endDate", e.target.value)} aria-invalid={badSchedule || undefined} />
              </Field>
              <Field label="Time" htmlFor="t-end-time">
                <Input id="t-end-time" type="time" className="min-w-0" value={s.endTime} onChange={(e) => set("endTime", e.target.value)} aria-invalid={badSchedule || undefined} />
              </Field>
            </div>
          </div>
          <div className={cn("rounded-lg border px-3 py-2.5 text-sm", badSchedule ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/40")}>
            {badSchedule ? (
              <p className="flex items-center gap-2 text-destructive"><CircleAlert className="size-4" /> The end must be after the start.</p>
            ) : (
              <>
                <p><span className="text-muted-foreground">Visitors see:</span> <span className="font-medium">{facts.id.date} · {facts.id.time}</span></p>
                {startInPast && <p className="mt-1 text-xs text-chart-4">The start time has passed: the countdown shows the “now open” message instead.</p>}
                {startAt && endAt && !startInPast && <p className="mt-1 text-xs text-muted-foreground">The countdown currently shows {Math.ceil((new Date(startAt).getTime() - Date.now()) / 86_400_000)} days to go.</p>}
              </>
            )}
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="t-countdown">Show countdown</Label>
              <p className="text-xs text-muted-foreground">Days, hours, minutes and seconds under the hero buttons.</p>
            </div>
            <Switch id="t-countdown" checked={s.showCountdown} onCheckedChange={(v) => set("showCountdown", v)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Address</CardTitle>
          <CardDescription>Shown in the event details, the FAQ ({"{address}"}), Google Calendar and Google search results.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Street address" htmlFor="t-street" className="sm:col-span-2" warn={issuePaths.has("streetAddress") ? "Required before publishing." : null}>
            <Input id="t-street" disabled={locked} value={s.streetAddress} maxLength={200} onChange={(e) => set("streetAddress", e.target.value)} placeholder="e.g. Jl. Raya Darmo No. 1, Wonokromo" />
          </Field>
          <Field label="City" htmlFor="t-locality" warn={issuePaths.has("addressLocality") ? "Required before publishing." : null}>
            <Input id="t-locality" disabled={locked} value={s.addressLocality} maxLength={80} onChange={(e) => set("addressLocality", e.target.value)} placeholder="e.g. Surabaya" />
          </Field>
          <Field label="Province" htmlFor="t-region" optional>
            <Input id="t-region" disabled={locked} value={s.addressRegion} maxLength={80} onChange={(e) => set("addressRegion", e.target.value)} placeholder="e.g. Jawa Timur" />
          </Field>
          <Field label="Postal code" htmlFor="t-postal" optional>
            <Input id="t-postal" disabled={locked} value={s.postalCode} maxLength={10} inputMode="numeric" onChange={(e) => set("postalCode", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 60241" />
          </Field>
          <Field
            label="Google Maps link" htmlFor="t-maps" optional
            error={mapsValid ? null : "Must start with https://"}
            hint={<>Shows a “Get directions” button. Empty = no button. {s.mapsUrl && mapsValid && <a href={s.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline underline-offset-4">Test link <ExternalLink className="size-3" /></a>}</>}
          >
            <Input id="t-maps" disabled={locked} value={s.mapsUrl} maxLength={1000} onChange={(e) => set("mapsUrl", e.target.value)} placeholder="https://maps.app.goo.gl/…" />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Contact points</CardTitle>
          <CardDescription>
            Shown next to the inquiry form. Form messages go to <span className="font-medium text-foreground">Leads › Contact Messages</span> with the source “Teaser: {s.city || "city"}”.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="WhatsApp number" htmlFor="t-wa"
            error={s.whatsapp && !waValid ? "Enter an Indonesian number, e.g. 0852 8612 6550" : null}
            hint={waValid ? <>Saved as +{wa}. <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline underline-offset-4">Test chat <ExternalLink className="size-3" /></a></> : "The branch number. 08…, +62… and 62… are all fine."}
          >
            <Input id="t-wa" disabled={locked} value={s.whatsapp} inputMode="tel" maxLength={24} onChange={(e) => set("whatsapp", e.target.value)} placeholder="e.g. 0852 8612 6550" />
          </Field>
          <Field label="Email" htmlFor="t-email" error={s.email && !emailValid ? "Enter a valid email address" : null} hint="Shown as a mailto link.">
            <Input id="t-email" disabled={locked} type="email" value={s.email} maxLength={120} onChange={(e) => set("email", e.target.value)} placeholder="support@wedison.co" />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Models shown</CardTitle>
          <CardDescription>The motorcycles in the “Models you can ride” section, linking to their product pages. Taglines are in Page text.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {MODEL_KEYS.map((k) => {
              const on = s.models.includes(k);
              return (
                <label key={k} htmlFor={`t-model-${k}`} className={cn("flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 transition-colors", on ? "border-primary/40 bg-primary/5" : "border-border")}>
                  <Checkbox id={`t-model-${k}`} checked={on} onCheckedChange={(v) => toggleModel(k, v === true)} disabled={readOnly} />
                  <span className="text-sm font-medium">{MODEL_CATALOG[k].name}</span>
                </label>
              );
            })}
          </div>
          {issuePaths.has("models") && <p className="mt-2 text-xs text-chart-4">Choose at least one model before publishing.</p>}
        </CardContent>
      </Card>
    </fieldset>
  );
}

/** Saat mengetik: izinkan "-" di akhir (agar "new-york" bisa diketik); dirapikan saat blur. */
const typingSlug = (v: string) =>
  v.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+/, "").slice(0, 60);

function SlugField({ slug, onChange, teaserId }: { slug: string; onChange: (v: string) => void; teaserId?: string }) {
  const debounced = useDebounce(slug, 400);
  const check = useQuery({
    queryKey: ["teaser-slug", debounced, teaserId],
    queryFn: () => api<{ data: { available: boolean; reason: string | null } }>("/admin/teasers/check-slug", { query: { slug: debounced, id: teaserId } }).then((r) => r.data),
    enabled: !!debounced,
    staleTime: 10_000,
  });
  const pending = slug !== debounced || check.isFetching;
  return (
    <Field
      label="Page URL" htmlFor="t-slug" className="sm:col-span-2"
      hint={
        !slug ? "Filled from the city. Lowercase letters, numbers and dashes." :
        pending ? <span className="inline-flex items-center gap-1"><Loader2 className="size-3 animate-spin" /> Checking…</span> :
        check.data?.available ? <span className="inline-flex items-center gap-1 text-primary"><CheckCircle2 className="size-3" /> Available</span> :
        <span className="inline-flex items-center gap-1 text-destructive"><CircleAlert className="size-3" /> {check.data?.reason ?? "Not available"}</span>
      }
    >
      <div className="flex items-center rounded-md border border-input bg-background pl-3 focus-within:ring-2 focus-within:ring-ring">
        <span className="shrink-0 font-mono text-xs text-muted-foreground"><span className="hidden sm:inline">wedison.co/id</span>/showroom/</span>
        <input
          id="t-slug"
          value={slug}
          maxLength={60}
          onChange={(e) => onChange(typingSlug(e.target.value))}
          onBlur={() => onChange(slugify(slug).slice(0, 60))}
          placeholder="surabaya"
          className="h-9 min-w-0 flex-1 bg-transparent px-1 font-mono text-sm outline-none"
        />
      </div>
    </Field>
  );
}
