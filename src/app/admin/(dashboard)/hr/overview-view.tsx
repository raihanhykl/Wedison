"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, Briefcase, CalendarClock, Eye, MousePointerClick, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/admin/page-header";
import { useAdminUser } from "@/components/admin/providers";
import { useHrPermissions } from "@/components/admin/hr/shared";
import { api } from "@/lib/admin/api";
import { formatDate, timeAgo } from "@/lib/admin/format";
import type { HrOverview } from "@/lib/admin/types";

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

export function HrOverviewView() {
  const user = useAdminUser();
  const perm = useHrPermissions();
  const { data, isLoading } = useQuery({ queryKey: ["hr-overview"], queryFn: () => api<{ data: HrOverview }>("/admin/hr/overview").then((r) => r.data), refetchInterval: 60_000 });
  const c = data?.counts ?? {};

  return (
    <>
      <PageHeader
        title={`Hello, ${user.name.split(" ")[0]}`}
        description="Job openings on the Wedison careers page: what is live, what needs review, and what is closing soon."
        actions={
          perm.data?.write && (
            <Button asChild>
              <Link href="/admin/hr/jobs/new"><Plus /> New job opening</Link>
            </Button>
          )
        }
      />

      {isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat title="Live job openings" value={c.PUBLISHED ?? 0} hint={`${data.openPositions} position(s) to fill`} icon={Briefcase} href="/admin/hr/jobs?status=PUBLISHED" />
          <Stat title="Waiting for review" value={c.PENDING_REVIEW ?? 0} hint={`${c.DRAFT ?? 0} draft(s)`} icon={AlertCircle} href="/admin/hr/jobs?status=PENDING_REVIEW" />
          <Stat title="Job page views" value={data.totalViews.toLocaleString("en-US")} hint="live openings, all time" icon={Eye} />
          <Stat title="Apply clicks (30 days)" value={data.applyClicks30d} hint={data.clicksByChannel30d.slice(0, 3).map((x) => `${x.channel} ${x.count}`).join(" · ") || "no clicks yet"} icon={MousePointerClick} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Needs your attention</CardTitle>
            <CardDescription>Openings submitted for review, and live openings that close within 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending review</p>
              {data?.pendingReview.length ? (
                data.pendingReview.map((j) => (
                  <Link key={j.id} href={`/admin/hr/jobs/${j.id}`} className="-mx-2 flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-muted/50">
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
                  <Link key={j.id} href={`/admin/hr/jobs/${j.id}`} className="-mx-2 flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-muted/50">
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

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-lg">Most viewed openings</CardTitle>
              <Button variant="ghost" size="sm" asChild><Link href="/admin/hr/jobs">All <ArrowRight /></Link></Button>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {data?.topJobs.length ? (
                data.topJobs.map((j) => (
                  <Link key={j.id} href={`/admin/hr/jobs/${j.id}`} className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 text-sm hover:bg-muted/50">
                    <span className="min-w-0 flex-1 truncate">{j.title}</span>
                    <span className="font-mono text-xs text-muted-foreground">{j.views} views · {j.applyClicks} apply clicks</span>
                  </Link>
                ))
              ) : (
                <p className="py-4 text-sm text-muted-foreground">No live openings yet.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="font-display text-lg">Live openings by division</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data?.byDepartment.length ? (
                data.byDepartment.map((d) => {
                  const max = Math.max(...data.byDepartment.map((x) => x.count));
                  return (
                    <div key={d.name} className="flex items-center gap-3 text-sm">
                      <span className="w-40 shrink-0 truncate">{d.name}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(d.count / max) * 100}%` }} /></div>
                      <span className="w-6 text-right font-mono text-xs">{d.count}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No live openings yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {perm.data && !perm.data.publish && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="size-3.5" /> You are signed in as HR Staff: you can write openings and submit them for review. An HR Manager publishes them.</p>
      )}
    </>
  );
}
