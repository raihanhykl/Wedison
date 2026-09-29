"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, CalendarClock, Download, Inbox, MessageSquareText, CalendarX2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/admin/page-header";
import { BarList, StackedBar, TrendChart } from "@/components/admin/charts";
import { api, qs } from "@/lib/admin/api";
import {
  BOOKING_PURPOSE_LABEL, BOOKING_SOURCE_LABEL, BOOKING_STATUS_LABEL, SHOWROOM_LABEL,
  type BookingPurpose, type BookingStatus, type LeadsStats, type ShowroomId,
} from "@/lib/admin/types";
import { BookingRow, ContactRow, ListCard } from "./leads-shared";

const RANGES = [
  { key: "7", label: "Last 7 days" },
  { key: "30", label: "Last 30 days" },
  { key: "90", label: "Last 90 days" },
  { key: "365", label: "Last 12 months" },
] as const;

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function StatCard({ title, value, hint, icon: Icon, href }: { title: string; value: number; hint?: string; icon: React.ElementType; href: string }) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-0.5 group-hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-mono text-3xl font-semibold tracking-tight">{value}</div>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </CardContent>
      </Card>
    </Link>
  );
}

const STATUS_ORDER: BookingStatus[] = ["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];
// Warna segmen status = warna badge status (konsisten dengan tabel).
const STATUS_DOT: Record<BookingStatus, string> = {
  NEW: "bg-chart-4",
  CONTACTED: "bg-chart-3",
  CONFIRMED: "bg-primary",
  COMPLETED: "bg-forest",
  CANCELLED: "bg-destructive",
  NO_SHOW: "bg-muted-foreground/60",
};

export function LeadsOverviewView() {
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("30");
  const { from, to } = useMemo(() => {
    const t = new Date();
    const f = new Date(t);
    f.setDate(f.getDate() - (Number(range) - 1));
    return { from: ymd(f), to: ymd(t) };
  }, [range]);

  const { data, isLoading } = useQuery({
    queryKey: ["leads-stats", from, to],
    queryFn: () => api<{ data: LeadsStats }>("/admin/leads/stats", { query: { from, to } }).then((r) => r.data),
    refetchInterval: 60_000,
  });
  const t = data?.totals;
  const rangeLabel = RANGES.find((r) => r.key === range)!.label.toLowerCase();

  const sorted = <K extends string>(rec: Partial<Record<K, number>>, label: (k: K) => string) =>
    (Object.entries(rec) as [K, number][]).map(([k, v]) => ({ key: k, label: label(k), value: v })).sort((a, b) => b.value - a.value);

  return (
    <>
      <PageHeader
        title="Leads Overview"
        description="Showroom bookings (Test Ride & visits) and contact-form messages from wedison.co, in one place."
        actions={
          <>
            <Select value={range} onValueChange={(v) => setRange(v as typeof range)}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RANGES.map((r) => <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" asChild>
              <a href={`/api/v1/admin/leads/bookings/export/${qs({})}`}>
                <Download /> Export CSV
              </a>
            </Button>
          </>
        }
      />

      {data && !data.calendarConfigured && (
        <Alert>
          <CalendarX2 className="size-4" />
          <AlertTitle>Google Calendar sync is not configured</AlertTitle>
          <AlertDescription>
            Bookings are saved here, but not pushed to the &ldquo;Booking Showroom&rdquo; calendar yet. Add the service-account credentials to <code className="font-mono text-xs">server/.env</code> (see docs/BOOKING-FORM.md), then use &ldquo;Sync to calendar&rdquo; on existing bookings.
          </AlertDescription>
        </Alert>
      )}

      {isLoading || !t ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title={`Bookings · ${rangeLabel}`} value={t.bookingsInRange} hint={`${t.bookingsAll} all time`} icon={CalendarCheck} href="/admin/leads/bookings" />
          <StatCard title="Visits in the next 7 days" value={t.upcoming7d} hint="excluding cancelled / no-show" icon={CalendarClock} href="/admin/leads/bookings?upcoming=1" />
          <StatCard title="New bookings to follow up" value={t.bookingsNew} hint="status New (not contacted yet)" icon={Inbox} href="/admin/leads/bookings?status=NEW" />
          <StatCard title={`Contact messages · ${rangeLabel}`} value={t.contactsInRange} hint={`${t.contactsUnhandled} unhandled · ${t.contactsAll} all time`} icon={MessageSquareText} href="/admin/leads/contacts" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Bookings per day</CardTitle>
            <CardDescription>When booking requests were submitted ({rangeLabel}, WIB).</CardDescription>
          </CardHeader>
          <CardContent>{isLoading || !data ? <Skeleton className="h-44" /> : <TrendChart label="Bookings" data={data.perDay.map((d) => ({ day: d.day, value: d.bookings }))} />}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Contact messages per day</CardTitle>
            <CardDescription>Messages from the contact form ({rangeLabel}, WIB).</CardDescription>
          </CardHeader>
          <CardContent>{isLoading || !data ? <Skeleton className="h-44" /> : <TrendChart label="Messages" data={data.perDay.map((d) => ({ day: d.day, value: d.contacts }))} />}</CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">By purpose</CardTitle>
            <CardDescription>What visitors book ({rangeLabel}).</CardDescription>
          </CardHeader>
          <CardContent>{isLoading || !data ? <Skeleton className="h-40" /> : <BarList items={sorted<BookingPurpose>(data.byPurpose, (k) => BOOKING_PURPOSE_LABEL[k] ?? k)} />}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">By showroom</CardTitle>
            <CardDescription>Where visitors want to go ({rangeLabel}).</CardDescription>
          </CardHeader>
          <CardContent>{isLoading || !data ? <Skeleton className="h-40" /> : <BarList items={sorted<ShowroomId>(data.byShowroom, (k) => SHOWROOM_LABEL[k] ?? k)} />}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">By entry point</CardTitle>
            <CardDescription>Which button opened the form ({rangeLabel}).</CardDescription>
          </CardHeader>
          <CardContent>{isLoading || !data ? <Skeleton className="h-40" /> : <BarList items={sorted<string>(data.bySource, (k) => BOOKING_SOURCE_LABEL[k] ?? k)} />}</CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Booking pipeline</CardTitle>
            <CardDescription>Follow-up status of bookings submitted {rangeLabel}.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? <Skeleton className="h-24" /> : (
              <StackedBar segments={STATUS_ORDER.map((s) => ({ key: s, label: BOOKING_STATUS_LABEL[s], value: data.byStatus[s] ?? 0, className: STATUS_DOT[s] }))} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Contact topics</CardTitle>
            <CardDescription>Most common subjects ({rangeLabel}).</CardDescription>
          </CardHeader>
          <CardContent>{isLoading || !data ? <Skeleton className="h-40" /> : <BarList items={data.byTopic.map((x) => ({ key: x.topic, label: x.topic, value: x.count }))} />}</CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ListCard title="Upcoming visits" href="/admin/leads/bookings?upcoming=1" loading={isLoading} empty={!data?.upcomingBookings.length}>
          {data?.upcomingBookings.map((b) => <BookingRow key={b.id} b={b} />)}
        </ListCard>
        <ListCard title="Latest contact messages" href="/admin/leads/contacts" loading={isLoading} empty={!data?.recentContacts.length}>
          {data?.recentContacts.map((c) => <ContactRow key={c.id} c={c} />)}
        </ListCard>
      </div>

      <div className="grid gap-6">
        <ListCard title="Latest booking requests" href="/admin/leads/bookings" loading={isLoading} empty={!data?.recentBookings.length}>
          {data?.recentBookings.map((b) => <BookingRow key={b.id} b={b} />)}
        </ListCard>
      </div>
    </>
  );
}
