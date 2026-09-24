"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Eye, FileText, Images, MapPin, Newspaper, Plus, Share2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { initials } from "@/components/admin/nav-user";
import { useAdminUser } from "@/components/admin/providers";
import { api } from "@/lib/admin/api";
import { timeAgo } from "@/lib/admin/format";
import type { DashboardStats } from "@/lib/admin/types";

function StatCard({ title, value, hint, icon: Icon, href }: { title: string; value: number | string; hint?: string; icon: React.ElementType; href: string }) {
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

export function DashboardView() {
  const user = useAdminUser();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api<{ data: DashboardStats }>("/admin/dashboard/stats").then((r) => r.data),
    refetchInterval: 60_000,
  });
  const c = data?.counts;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageHeader
        title={`${greet}, ${user.name.split(" ")[0]}`}
        description="Overview of Media Center content and the SuperCharge network."
        actions={
          <Button asChild>
            <Link href="/admin/cms/articles/new">
              <Plus /> Write article
            </Link>
          </Button>
        }
      />

      {isLoading || !c ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Articles" value={c.articles} hint={`${c.articlesByStatus.PUBLISHED ?? 0} published · ${c.articlesByStatus.DRAFT ?? 0} drafts`} icon={FileText} href="/admin/cms/articles" />
          <StatCard title="Press coverage" value={c.press} hint="live on Media Center" icon={Newspaper} href="/admin/cms/press" />
          <StatCard title="Social posts" value={c.social} hint="active" icon={Share2} href="/admin/cms/social" />
          <StatCard title="SuperCharge stations" value={c.stations} hint={`${c.stationsByStatus.OPERATIONAL ?? 0} operational · ${c.stationsByStatus.COMING_SOON ?? 0} coming soon`} icon={MapPin} href="/admin/supercharge/stations" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Recent articles</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/cms/articles">
                View all <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="my-3 h-10" />)
            ) : data?.recentArticles.length ? (
              data.recentArticles.map((a) => {
                const t = a.translations.find((x) => x.locale === "id") ?? a.translations[0];
                return (
                  <Link key={a.id} href={`/admin/cms/articles/${a.id}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/40 -mx-2 px-2 rounded-md">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{t?.title ?? "(untitled)"}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.author?.name ?? "—"} · updated {timeAgo(a.updatedAt)}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </Link>
                );
              })
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No articles yet.{" "}
                <Link href="/admin/cms/articles/new" className="text-primary underline underline-offset-4">
                  Write the first one
                </Link>
                .
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8" />)
              ) : data?.recentActivity.length ? (
                data.recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <Avatar className="size-7">
                      <AvatarImage src={log.user?.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-[10px]">{initials(log.user?.name ?? "?")}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="truncate">
                        <span className="font-medium">{log.user?.name ?? "System"}</span>{" "}
                        <span className="text-muted-foreground">{log.summary ?? `${log.action} ${log.entity}`}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{timeAgo(log.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              )}
            </CardContent>
          </Card>

          {c && (
            <Card className="bg-forest text-forest-foreground border-transparent">
              <CardContent className="grid grid-cols-2 gap-4 pt-6">
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-forest-muted"><Eye className="size-3.5" /> Total reads</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">{c.totalViews.toLocaleString("en-US")}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-forest-muted"><Zap className="size-3.5" /> Published (30d)</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">{c.publishedLast30Days}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-forest-muted"><Images className="size-3.5" /> Media files</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">{c.media}</p>
                </div>
                <div>
                  <p className="text-xs text-forest-muted">API cache</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">{data?.cache.size ?? 0}<span className="text-sm text-forest-muted"> entries</span></p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
