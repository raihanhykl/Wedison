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
  const greet = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <>
      <PageHeader
        title={`${greet}, ${user.name.split(" ")[0]}`}
        description="Ringkasan konten Media Center dan jaringan SuperCharge."
        actions={
          <Button asChild>
            <Link href="/admin/cms/articles/new">
              <Plus /> Tulis artikel
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
          <StatCard title="Artikel" value={c.articles} hint={`${c.articlesByStatus.PUBLISHED ?? 0} tayang · ${c.articlesByStatus.DRAFT ?? 0} draf`} icon={FileText} href="/admin/cms/articles" />
          <StatCard title="Liputan pers" value={c.press} hint="tayang di Media Center" icon={Newspaper} href="/admin/cms/press" />
          <StatCard title="Post sosial media" value={c.social} hint="aktif" icon={Share2} href="/admin/cms/social" />
          <StatCard title="Lokasi SuperCharge" value={c.stations} hint={`${c.stationsByStatus.OPERATIONAL ?? 0} beroperasi · ${c.stationsByStatus.COMING_SOON ?? 0} segera`} icon={MapPin} href="/admin/supercharge/stations" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Artikel terbaru</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/cms/articles">
                Semua <ArrowRight />
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
                      <p className="truncate font-medium">{t?.title ?? "(tanpa judul)"}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.author?.name ?? "—"} · diubah {timeAgo(a.updatedAt)}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </Link>
                );
              })
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Belum ada artikel.{" "}
                <Link href="/admin/cms/articles/new" className="text-primary underline underline-offset-4">
                  Tulis yang pertama
                </Link>
                .
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Aktivitas terakhir</CardTitle>
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
                        <span className="font-medium">{log.user?.name ?? "Sistem"}</span>{" "}
                        <span className="text-muted-foreground">{log.summary ?? `${log.action} ${log.entity}`}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{timeAgo(log.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
              )}
            </CardContent>
          </Card>

          {c && (
            <Card className="bg-forest text-forest-foreground border-transparent">
              <CardContent className="grid grid-cols-2 gap-4 pt-6">
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-forest-muted"><Eye className="size-3.5" /> Total baca</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">{c.totalViews.toLocaleString("id-ID")}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-forest-muted"><Zap className="size-3.5" /> Tayang 30 hari</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">{c.publishedLast30Days}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-forest-muted"><Images className="size-3.5" /> File media</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">{c.media}</p>
                </div>
                <div>
                  <p className="text-xs text-forest-muted">Cache API</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">{data?.cache.size ?? 0}<span className="text-sm text-forest-muted"> entri</span></p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
