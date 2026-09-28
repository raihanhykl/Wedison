"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { api } from "@/lib/admin/api";
import { calendarEmbedUrl, calendarOpenUrl, BOOKING_CALENDAR_ID, type CalendarMode } from "@/lib/admin/calendar";
import type { Booking, Paginated } from "@/lib/admin/types";
import { cn } from "@/lib/utils";
import { BookingRow } from "../leads-shared";

const MODES: { key: CalendarMode; label: string }[] = [
  { key: "MONTH", label: "Month" },
  { key: "WEEK", label: "Week" },
  { key: "AGENDA", label: "Agenda" },
];
const ZONES = [
  { key: "Asia/Jakarta", label: "WIB (Jakarta · Bekasi · Bandung)" },
  { key: "Asia/Makassar", label: "WITA (Bali)" },
];

export function CalendarView() {
  const [mode, setMode] = useState<CalendarMode>("MONTH");
  const [tz, setTz] = useState(ZONES[0].key);
  const { data, isLoading } = useQuery({
    queryKey: ["bookings", { upcoming: "1", limit: 8 }],
    queryFn: () => api<Paginated<Booking>>("/admin/leads/bookings", { query: { upcoming: "1", limit: 8, sort: "startAt", order: "asc" } }),
  });

  return (
    <>
      <PageHeader
        title="Booking Calendar"
        description='Live view of the "Booking Showroom" Google Calendar. Every confirmed booking from the website is added here automatically.'
        actions={
          <Button variant="outline" asChild>
            <a href={calendarOpenUrl} target="_blank" rel="noreferrer"><ExternalLink /> Open in Google Calendar</a>
          </Button>
        }
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-3 border-b border-border bg-muted/40 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 font-display text-lg"><CalendarDays className="size-5 text-primary" /> Booking Showroom</CardTitle>
              <CardDescription className="break-all font-mono text-[11px]">{BOOKING_CALENDAR_ID}</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-md border border-border bg-background p-0.5" role="tablist" aria-label="Calendar view">
                {MODES.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    role="tab"
                    aria-selected={mode === m.key}
                    onClick={() => setMode(m.key)}
                    className={cn("rounded-[5px] px-3 py-1.5 text-sm font-medium transition-colors", mode === m.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <Select value={tz} onValueChange={setTz}>
                <SelectTrigger className="w-[230px]"><SelectValue /></SelectTrigger>
                <SelectContent>{ZONES.map((z) => <SelectItem key={z.key} value={z.key}>{z.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </CardHeader>
          {/* Embed Google punya lebar minimum; di layar sempit biarkan bisa digeser, bukan terpotong. */}
          <CardContent className="overflow-x-auto p-0">
            <iframe
              key={`${mode}-${tz}`}
              title="Booking Showroom calendar"
              src={calendarEmbedUrl({ mode, timeZone: tz })}
              className="block h-[70vh] min-h-[560px] w-full min-w-[800px] border-0 bg-white"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="2xl:block">
            <CardHeader>
              <CardTitle className="font-display text-lg">Next visits</CardTitle>
              <CardDescription>From the bookings database, soonest first.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="my-3 h-10" />) : data?.items.length ? data.items.map((b) => <BookingRow key={b.id} b={b} />) : <p className="py-6 text-center text-sm text-muted-foreground">No upcoming visits.</p>}
            </CardContent>
          </Card>
          <Card className="bg-muted/40">
            <CardContent className="flex gap-3 pt-6 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" />
              <p>
                Events only appear in this embed if you are signed in to a Google account that has access to the calendar (or the calendar is public). Use the button above to manage the calendar itself, and the Bookings page to update follow-up status.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
