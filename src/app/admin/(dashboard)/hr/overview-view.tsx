"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, Briefcase, CalendarClock, FilePlus2, MousePointerClick, Plus, RotateCcw, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/page-header";
import { BarList, TrendChart } from "@/components/admin/charts";
import { DateRangeFilter, presetRange, rangeLabel, rangeQuery, type DateTimeRange } from "@/components/admin/date-range-filter";
import { useAdminUser } from "@/components/admin/providers";
import { AuditStamp, JobStatusBadge, locationLabel, useDepartments, useHrPermissions, useLocations } from "@/components/admin/hr/shared";
import { api } from "@/lib/admin/api";
import { formatDate, timeAgo } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { EMPLOYMENT_LABEL, JOB_STATUS_LABEL, WORKPLACE_LABEL, type EmploymentType, type HrOverview, type HrOverviewJob, type JobStatus, type WorkplaceType } from "@/lib/admin/types";

function Stat({ title, value, hint, icon: Icon, href }: { title: string; value: number | string; hint?: string; icon: React.ElementType; href?: string }) {
  const body = (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="font-mono text-3xl font-semibold tracking-tight">{value}</div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

type SortKey = "title" | "status" | "department" | "views" | "applyClicks" | "createdAt" | "updatedAt" | "closesAt";
type Sort = { key: SortKey; dir: "asc" | "desc" };
const STATUS_ORDER: Record<JobStatus, number> = { PUBLISHED: 0, PENDING_REVIEW: 1, DRAFT: 2, CLOSED: 3, ARCHIVED: 4 };

function compare(a: HrOverviewJob, b: HrOverviewJob, key: SortKey): number {
  switch (key) {
    case "title": return a.title.localeCompare(b.title, "id");
    case "status": return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    case "department": return (a.department ?? "￿").localeCompare(b.department ?? "￿", "id");
    case "views": return a.views - b.views;
    case "applyClicks": return a.applyClicks - b.applyClicks;
    default: {
      const av = a[key] ? new Date(a[key]!).getTime() : null;
      const bv = b[key] ? new Date(b[key]!).getTime() : null;
      if (av === bv) return 0;
      if (av === null) return 1; // empty dates last in both directions (handled below)
      if (bv === null) return -1;
      return av - bv;
    }
  }
}

function SortHead({ label, k, sort, onSort, className }: { label: string; k: SortKey; sort: Sort; onSort: (k: SortKey) => void; className?: string }) {
  const active = sort.key === k;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead className={className} aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
      <button type="button" onClick={() => onSort(k)} className={cn("-ml-2 inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground", active && "text-foreground")}>
        {label} <Icon className={cn("size-3.5", !active && "opacity-40")} />
      </button>
    </TableHead>
  );
}

const ALL = "all";

export function HrOverviewView() {
  const user = useAdminUser();
  const perm = useHrPermissions();
  const { data: departments } = useDepartments();
  const { data: locations } = useLocations();
  const [range, setRange] = useState<DateTimeRange>(() => presetRange("30d"));
  const [departmentId, setDepartmentId] = useState(ALL);
  const [locationId, setLocationId] = useState(ALL);
  const [employmentType, setEmploymentType] = useState<typeof ALL | EmploymentType>(ALL);
  const [workplaceType, setWorkplaceType] = useState<typeof ALL | WorkplaceType>(ALL);
  const [status, setStatus] = useState<typeof ALL | JobStatus>(ALL);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>({ key: "applyClicks", dir: "desc" });

  // An open range ("All time") asks the API to start at the first recorded click.
  const query = {
    ...(range.from || range.to ? rangeQuery(range) : { allTime: "true" }),
    departmentId: departmentId === ALL ? undefined : departmentId,
    locationId: locationId === ALL ? undefined : locationId,
    employmentType: employmentType === ALL ? undefined : employmentType,
    workplaceType: workplaceType === ALL ? undefined : workplaceType,
  };
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["hr-overview", query],
    queryFn: () => api<{ data: HrOverview }>("/admin/hr/overview", { query }).then((r) => r.data),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
  });
  const c = data?.counts ?? {};
  const label = rangeLabel(range).toLowerCase();
  const filtered = departmentId !== ALL || locationId !== ALL || employmentType !== ALL || workplaceType !== ALL || range.preset !== "30d";
  const reset = () => { setRange(presetRange("30d")); setDepartmentId(ALL); setLocationId(ALL); setEmploymentType(ALL); setWorkplaceType(ALL); };

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = (data?.jobs ?? []).filter((j) => (status === ALL || j.status === status) && (!needle || j.title.toLowerCase().includes(needle)));
    const dateKey = sort.key === "createdAt" || sort.key === "updatedAt" || sort.key === "closesAt";
    return [...list].sort((a, b) => {
      // Empty dates stay at the bottom whichever direction is chosen.
      if (dateKey) {
        const an = !a[sort.key as "closesAt"], bn = !b[sort.key as "closesAt"];
        if (an !== bn) return an ? 1 : -1;
      }
      const r = compare(a, b, sort.key);
      return (sort.dir === "asc" ? r : -r) || a.title.localeCompare(b.title, "id");
    });
  }, [data?.jobs, q, status, sort]);

  const onSort = (k: SortKey) => setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: k === "title" || k === "department" || k === "status" || k === "closesAt" ? "asc" : "desc" }));

  return (
    <>
      <PageHeader
        title={`Hello, ${user.name.split(" ")[0]}`}
        description="Job openings on the Wedison careers page: what is live, what needs review, and how applicants respond."
        actions={perm.data?.write && <Button asChild><Link href="/admin/hr/jobs/new"><Plus /> New job opening</Link></Button>}
      />

      <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center" role="group" aria-label="Filters">
        <DateRangeFilter value={range} onChange={setRange} align="start" className="col-span-2 w-full lg:w-[260px]" />
        <Select value={departmentId} onValueChange={setDepartmentId}>
          <SelectTrigger className="w-full lg:w-[180px]" aria-label="Division"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All divisions</SelectItem>
            <SelectItem value="none">No division</SelectItem>
            {departments?.map((d) => <SelectItem key={d.id} value={d.id}>{d.nameId}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger className="w-full lg:w-[180px]" aria-label="Location"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All locations</SelectItem>
            {locations?.map((l) => <SelectItem key={l.id} value={l.id}>{locationLabel(l)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={employmentType} onValueChange={(v) => setEmploymentType(v as typeof employmentType)}>
          <SelectTrigger className="w-full lg:w-[150px]" aria-label="Employment type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            {(Object.keys(EMPLOYMENT_LABEL) as EmploymentType[]).map((t) => <SelectItem key={t} value={t}>{EMPLOYMENT_LABEL[t]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={workplaceType} onValueChange={(v) => setWorkplaceType(v as typeof workplaceType)}>
          <SelectTrigger className="w-full lg:w-[150px]" aria-label="Workplace"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any workplace</SelectItem>
            {(Object.keys(WORKPLACE_LABEL) as WorkplaceType[]).map((t) => <SelectItem key={t} value={t}>{WORKPLACE_LABEL[t]}</SelectItem>)}
          </SelectContent>
        </Select>
        {filtered && <Button variant="ghost" size="sm" onClick={reset}><RotateCcw /> Reset</Button>}
        {isFetching && !isLoading && <span className="text-xs text-muted-foreground">Updating…</span>}
      </div>

      {isError && !data ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">The overview could not be loaded. Try another range or reload the page.</CardContent></Card>
      ) : isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat title="Live job openings" value={c.PUBLISHED ?? 0} hint={`${data.openPositions} position(s) to fill · ${data.totalViews.toLocaleString("en-US")} views all time`} icon={Briefcase} href="/admin/hr/jobs?status=PUBLISHED" />
          <Stat title="Waiting for review" value={c.PENDING_REVIEW ?? 0} hint={`${c.DRAFT ?? 0} draft(s)`} icon={AlertCircle} href="/admin/hr/jobs?status=PENDING_REVIEW" />
          <Stat title="Apply clicks" value={data.applyClicks} hint={`${label} · ${data.clicksByChannel.slice(0, 3).map((x) => `${x.channel} ${x.count}`).join(" · ") || "no clicks"}`} icon={MousePointerClick} />
          <Stat title="New openings" value={data.createdInRange} hint={`created ${label} · ${data.publishedInRange} published`} icon={FilePlus2} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="font-display text-lg">Apply clicks per day</CardTitle>
            <CardDescription>Clicks on “Apply by email” and job-portal buttons ({label}, WIB).</CardDescription>
          </CardHeader>
          <CardContent>{!data ? <Skeleton className="h-44" /> : <TrendChart label="Apply clicks" data={data.clicksPerDay} />}</CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="font-display text-lg">By channel</CardTitle>
            <CardDescription>Where applicants went ({label}).</CardDescription>
          </CardHeader>
          <CardContent>{!data ? <Skeleton className="h-40" /> : <BarList items={data.clicksByChannel.map((x) => ({ key: x.channel, label: x.channel === "email" ? "Email" : x.channel, value: x.count }))} />}</CardContent>
        </Card>
      </div>

      <Card className="min-w-0">
        <CardHeader className="gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="font-display text-lg">Openings</CardTitle>
            <CardDescription>Clicks count {label}; views are all time. Click a column to sort.</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search position…" className="pl-8 sm:w-56" aria-label="Search position" />
            </div>
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger className="sm:w-44" aria-label="Status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All statuses</SelectItem>
                {(["PUBLISHED", "PENDING_REVIEW", "DRAFT", "CLOSED"] as JobStatus[]).map((s) => <SelectItem key={s} value={s}>{JOB_STATUS_LABEL[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <SortHead label="Position" k="title" sort={sort} onSort={onSort} className="min-w-[200px]" />
                  <SortHead label="Status" k="status" sort={sort} onSort={onSort} />
                  <SortHead label="Division" k="department" sort={sort} onSort={onSort} />
                  <SortHead label="Views" k="views" sort={sort} onSort={onSort} className="text-right" />
                  <SortHead label="Clicks" k="applyClicks" sort={sort} onSort={onSort} className="text-right" />
                  <SortHead label="Created" k="createdAt" sort={sort} onSort={onSort} />
                  <SortHead label="Updated" k="updatedAt" sort={sort} onSort={onSort} />
                  <SortHead label="Closes" k="closesAt" sort={sort} onSort={onSort} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data ? (
                  Array.from({ length: 4 }).map((_, i) => <TableRow key={i}><TableCell colSpan={8}><Skeleton className="h-6" /></TableCell></TableRow>)
                ) : rows.length ? (
                  rows.map((j) => (
                    <TableRow key={j.id}>
                      <TableCell><Link href={`/admin/hr/jobs/${j.id}`} className="font-medium hover:text-primary">{j.title}</Link>{j.openings > 1 && <span className="ml-1.5 text-xs text-muted-foreground">· {j.openings} positions</span>}</TableCell>
                      <TableCell><JobStatusBadge status={j.status} /></TableCell>
                      <TableCell className="text-sm">{j.department ?? <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{j.views}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{j.applyClicks}</TableCell>
                      <TableCell className="text-xs"><AuditStamp stacked user={j.createdBy ? { name: j.createdBy } : null} at={j.createdAt} /></TableCell>
                      <TableCell className="text-xs"><AuditStamp stacked user={j.updatedBy ? { name: j.updatedBy } : null} at={j.updatedAt} /></TableCell>
                      <TableCell className="whitespace-nowrap text-xs">{j.closesAt ? formatDate(j.closesAt) : <span className="text-muted-foreground">—</span>}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">No openings match these filters.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {data && data.jobs.length >= 200 && <p className="mt-2 px-6 text-xs text-muted-foreground sm:px-0">Showing the 200 most recently updated openings. Narrow the filters to see others.</p>}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="font-display text-lg">Needs your attention</CardTitle>
            <CardDescription>Openings submitted for review, and live openings that close within 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending review</p>
              {data?.pendingReview.length ? (
                data.pendingReview.map((j) => (
                  <Link key={j.id} href={`/admin/hr/jobs/${j.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted/50">
                    <span className="truncate">{j.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">submitted {timeAgo(j.updatedAt)}</span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nothing to review.</p>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Closing soon</p>
              {data?.closingSoon.length ? (
                data.closingSoon.map((j) => (
                  <Link key={j.id} href={`/admin/hr/jobs/${j.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted/50">
                    <span className="flex min-w-0 items-center gap-2 truncate"><CalendarClock className="size-4 shrink-0 text-chart-4" />{j.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">closes {formatDate(j.closesAt)}</span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No openings close in the next 7 days.</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader><CardTitle className="font-display text-lg">Live openings by division</CardTitle></CardHeader>
          <CardContent>{!data ? <Skeleton className="h-40" /> : <BarList items={data.byDepartment.map((d) => ({ key: d.name, label: d.name, value: d.count }))} emptyText="No live openings for these filters" />}</CardContent>
        </Card>
      </div>

      {perm.data && !perm.data.publish && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="size-3.5" /> You can write openings and submit them for review. An HR Manager publishes them.</p>
      )}
    </>
  );
}
