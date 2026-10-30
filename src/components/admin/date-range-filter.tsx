"use client";

import { useEffect, useState } from "react";
import type { DateRange as DayRange } from "react-day-picker";
import { CalendarRange, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** A date-time range in the browser's local time. `null` ends mean "open". */
export type DateTimeRange = { from: Date | null; to: Date | null; preset?: string };

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const RANGE_PRESETS: { key: string; label: string; make: () => DateTimeRange }[] = [
  { key: "today", label: "Today", make: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { key: "7d", label: "Last 7 days", make: () => ({ from: startOfDay(addDays(new Date(), -6)), to: endOfDay(new Date()) }) },
  { key: "30d", label: "Last 30 days", make: () => ({ from: startOfDay(addDays(new Date(), -29)), to: endOfDay(new Date()) }) },
  { key: "90d", label: "Last 90 days", make: () => ({ from: startOfDay(addDays(new Date(), -89)), to: endOfDay(new Date()) }) },
  { key: "month", label: "This month", make: () => { const n = new Date(); return { from: new Date(n.getFullYear(), n.getMonth(), 1), to: endOfDay(n) }; } },
  { key: "lastMonth", label: "Last month", make: () => { const n = new Date(); return { from: new Date(n.getFullYear(), n.getMonth() - 1, 1), to: endOfDay(new Date(n.getFullYear(), n.getMonth(), 0)) }; } },
  { key: "year", label: "This year", make: () => { const n = new Date(); return { from: new Date(n.getFullYear(), 0, 1), to: endOfDay(n) }; } },
  { key: "all", label: "All time", make: () => ({ from: null, to: null }) },
];

export function presetRange(key: string): DateTimeRange {
  const p = RANGE_PRESETS.find((x) => x.key === key) ?? RANGE_PRESETS[2];
  return { ...p.make(), preset: p.key };
}

const pad = (n: number) => String(n).padStart(2, "0");
const hhmm = (d: Date | null, fallback: string) => (d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : fallback);
const withTime = (d: Date, t: string, end: boolean) => {
  const [h, m] = t.split(":").map(Number);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), Number.isFinite(h) ? h : end ? 23 : 0, Number.isFinite(m) ? m : end ? 59 : 0, end ? 59 : 0, end ? 999 : 0);
};
const fmt = (d: Date, withHour: boolean) =>
  d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", ...(withHour ? { hour: "2-digit", minute: "2-digit" } : {}) });
const isWholeDay = (r: DateTimeRange) =>
  (!r.from || (r.from.getHours() === 0 && r.from.getMinutes() === 0)) && (!r.to || (r.to.getHours() === 23 && r.to.getMinutes() === 59));

export function rangeLabel(r: DateTimeRange) {
  if (r.preset && r.preset !== "custom") return RANGE_PRESETS.find((p) => p.key === r.preset)?.label ?? "Custom";
  if (!r.from && !r.to) return "All time";
  const h = !isWholeDay(r);
  if (r.from && r.to) return `${fmt(r.from, h)} – ${fmt(r.to, h)}`;
  return r.from ? `From ${fmt(r.from, h)}` : `Until ${fmt(r.to!, h)}`;
}

/** Query params for the API (ISO strings; empty when open). */
export function rangeQuery(r: DateTimeRange) {
  return { from: r.from?.toISOString(), to: r.to?.toISOString() };
}

/**
 * Date-time range picker: presets on the left, a two-month range calendar and start/end times.
 * Changes apply on "Apply" so half-picked ranges never hit the API.
 */
export function DateRangeFilter({ value, onChange, className, align = "end" }: { value: DateTimeRange; onChange: (r: DateTimeRange) => void; className?: string; align?: "start" | "end" }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DayRange | undefined>(undefined);
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("23:59");

  useEffect(() => {
    if (!open) return;
    setDraft(value.from || value.to ? { from: value.from ?? undefined, to: value.to ?? undefined } : undefined);
    setFromTime(hhmm(value.from, "00:00"));
    setToTime(hhmm(value.to, "23:59"));
  }, [open, value]);

  const from = draft?.from ? withTime(draft.from, fromTime, false) : null;
  const to = draft?.to ? withTime(draft.to, toTime, true) : draft?.from ? withTime(draft.from, toTime, true) : null;
  const invalid = !!from && !!to && from > to;

  const apply = () => {
    if (invalid) return;
    onChange({ from, to, preset: "custom" });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("justify-between gap-2 font-normal", className)} aria-label="Date range">
          <span className="flex min-w-0 items-center gap-2"><CalendarRange className="size-4 shrink-0 text-muted-foreground" /><span className="truncate">{rangeLabel(value)}</span></span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto max-w-[calc(100vw-2rem)] p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex gap-1 overflow-x-auto border-b border-border p-2 sm:w-40 sm:flex-col sm:border-b-0 sm:border-r">
            {RANGE_PRESETS.map((p) => (
              <Button
                key={p.key}
                variant={value.preset === p.key ? "secondary" : "ghost"}
                size="sm"
                className="shrink-0 justify-start"
                onClick={() => { onChange({ ...p.make(), preset: p.key }); setOpen(false); }}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <div className="p-2">
            <Calendar mode="range" numberOfMonths={2} selected={draft} onSelect={setDraft} defaultMonth={draft?.from ?? addDays(new Date(), -30)} disabled={{ after: new Date(2100, 0, 1) }} className="[--cell-size:2.1rem]" />
            <div className="grid grid-cols-2 gap-3 border-t border-border px-1 pt-3">
              <div className="space-y-1">
                <Label htmlFor="range-from-time" className="text-xs text-muted-foreground">Start time</Label>
                <Input id="range-from-time" type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} disabled={!draft?.from} className="h-8" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="range-to-time" className="text-xs text-muted-foreground">End time</Label>
                <Input id="range-to-time" type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} disabled={!draft?.from} className="h-8" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 px-1 pt-3">
              <p className={cn("text-xs", invalid ? "text-destructive" : "text-muted-foreground")}>
                {invalid ? "End must be after start" : from ? `${fmt(from, true)} – ${to ? fmt(to, true) : "…"}` : "Pick a start and end day"}
              </p>
              <div className="flex gap-2">
                {draft && <Button variant="ghost" size="sm" onClick={() => setDraft(undefined)}><X /> Clear</Button>}
                <Button size="sm" onClick={apply} disabled={!draft?.from || invalid}>Apply</Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
