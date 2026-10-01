"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, ExternalLink, FileText, Loader2, Play, Radar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { PillarTabs, ScoreRing, gradeColor, gradeLabel } from "@/components/admin/content-health";
import { StatusBadge } from "@/components/admin/status-badge";
import { api, errorMessage } from "@/lib/admin/api";
import { formatDateTime, timeAgo } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import type { SeoOverview, SiteAudit } from "@/lib/admin/types";

export function SeoView() {
  const qc = useQueryClient();
  const [showPages, setShowPages] = useState(false);
  const overview = useQuery({ queryKey: ["seo-overview"], queryFn: () => api<{ data: SeoOverview }>("/admin/seo/overview").then((r) => r.data) });
  const site = useQuery({ queryKey: ["seo-site"], queryFn: () => api<{ data: SiteAudit | null }>("/admin/seo/site").then((r) => r.data) });

  const run = useMutation({
    mutationFn: () => api<{ data: SiteAudit }>("/admin/seo/site/run", { method: "POST", body: {} }).then((r) => r.data),
    onSuccess: (a) => {
      toast.success(`Audit finished: ${a.pagesCrawled} pages, overall ${a.overall}/100`);
      qc.invalidateQueries({ queryKey: ["seo-site"] });
      qc.invalidateQueries({ queryKey: ["seo-overview"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const rescore = useMutation({
    mutationFn: () => api<{ articles: number }>("/admin/seo/rescore", { method: "POST", body: {} }),
    onSuccess: (r) => {
      toast.success(`Rescored ${r.articles} articles`);
      qc.invalidateQueries({ queryKey: ["seo-overview"] });
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const audit = site.data;
  const a = overview.data?.articles;

  return (
    <>
      <PageHeader
        title="SEO & AI Readiness"
        description="Early detection for the whole website: search engines (SEO), answer engines (AEO) and generative AI engines (GEO). Run the audit after each release."
        actions={
          <>
            <Button variant="outline" onClick={() => rescore.mutate()} disabled={rescore.isPending}>
              {rescore.isPending ? <Loader2 className="animate-spin" /> : <RefreshCw />} Rescore articles
            </Button>
            <Button onClick={() => run.mutate()} disabled={run.isPending}>
              {run.isPending ? <Loader2 className="animate-spin" /> : <Play />} {run.isPending ? "Crawling…" : "Run site audit"}
            </Button>
          </>
        }
      />

      {run.isPending && (
        <Alert>
          <Radar className="size-4" />
          <AlertTitle>Crawling the site</AlertTitle>
          <AlertDescription>Fetching every URL in the sitemap and checking metadata, headings, images, structured data and AI-readiness files. This usually takes 10–40 seconds.</AlertDescription>
        </Alert>
      )}

      {/* ── Website ───────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Website</CardTitle>
          <CardDescription>
            {audit ? (
              <>Last audit {timeAgo(audit.ranAt)} ({formatDateTime(audit.ranAt)}) · {audit.pagesCrawled} pages from {audit.publicOrigin} · {(audit.durationMs / 1000).toFixed(1)}s</>
            ) : site.isLoading ? "Loading…" : "No audit yet. Run the site audit to get the first result."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {audit ? (
            <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <ScoreRing score={audit.seo.score} label="SEO" size={70} sublabel={gradeLabel(audit.seo.score)} />
                  <ScoreRing score={audit.aeo.score} label="AEO" size={70} sublabel={gradeLabel(audit.aeo.score)} />
                  <ScoreRing score={audit.geo.score} label="GEO" size={70} sublabel={gradeLabel(audit.geo.score)} />
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs">
                  <p className="mb-2 font-medium">Discovery files</p>
                  <ul className="space-y-1 font-mono">
                    {([["robots.txt", audit.files.robots], ["sitemap.xml", audit.files.sitemap], ["llms.txt", audit.files.llms], ["manifest", audit.files.manifest], ["AI crawlers allowed", audit.files.robotsAllowsAi]] as [string, boolean][]).map(([k, v]) => (
                      <li key={k} className="flex items-center justify-between"><span>{k}</span><span className={v ? "text-primary" : "text-destructive"}>{v ? "ok" : "missing"}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="min-w-0">
                <PillarTabs pillars={{ seo: audit.seo, aeo: audit.aeo, geo: audit.geo }} />
              </div>
            </div>
          ) : site.isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <EmptyState icon={Radar} title="No site audit yet" description="The audit crawls the public site and lists what to fix for SEO, AEO and GEO." action={<Button onClick={() => run.mutate()} disabled={run.isPending}><Play /> Run site audit</Button>} />
          )}
        </CardContent>
      </Card>

      {audit?.pages && audit.pages.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display text-lg">Pages</CardTitle>
              <CardDescription>{audit.pages.filter((p) => p.issues.length).length} of {audit.pages.length} pages have findings.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowPages((v) => !v)}>
              <ChevronDown className={cn("transition-transform", showPages && "rotate-180")} /> {showPages ? "Hide" : "Show"}
            </Button>
          </CardHeader>
          {showPages && (
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/60">
                  <TableRow>
                    <TableHead>Path</TableHead>
                    <TableHead className="w-20">Status</TableHead>
                    <TableHead className="w-24">Title</TableHead>
                    <TableHead className="w-24">Desc.</TableHead>
                    <TableHead className="w-24">Schema</TableHead>
                    <TableHead>Findings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audit.pages.map((p) => (
                    <TableRow key={p.path} className={p.issues.length ? "" : "opacity-60"}>
                      <TableCell className="font-mono text-xs"><a href={`${audit.publicOrigin}${p.path}`} target="_blank" rel="noreferrer" className="hover:underline">{p.path}</a></TableCell>
                      <TableCell><Badge variant="outline" className={p.status === 200 ? "" : "border-destructive/30 text-destructive"}>{p.status}</Badge></TableCell>
                      <TableCell className="font-mono text-xs">{p.titleLength}</TableCell>
                      <TableCell className="font-mono text-xs">{p.descriptionLength}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{[...new Set(p.jsonLdTypes)].slice(0, 3).join(", ") || "—"}</TableCell>
                      <TableCell className="text-xs">{p.issues.length ? p.issues.join(" · ") : <span className="text-primary">No findings</span>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          )}
        </Card>
      )}

      {/* ── Articles ──────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Articles (published)</CardTitle>
            <CardDescription>Average score of published articles. Each article shows its own checklist in the editor.</CardDescription>
          </CardHeader>
          <CardContent>
            {a ? (
              <>
                {a.avgSeo !== null && a.avgAeo !== null && a.avgGeo !== null ? (
                  <div className="grid grid-cols-3 gap-2">
                    <ScoreRing score={a.avgSeo} label="SEO" size={64} sublabel="average" />
                    <ScoreRing score={a.avgAeo} label="AEO" size={64} sublabel="average" />
                    <ScoreRing score={a.avgGeo} label="GEO" size={64} sublabel="average" />
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                    No scores stored yet. Click “Rescore articles” to analyse existing articles.
                  </p>
                )}
                <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div><dt className="text-muted-foreground">Published</dt><dd className="font-mono text-lg">{a.published}</dd></div>
                  <div><dt className="text-muted-foreground">Last 90 days</dt><dd className="font-mono text-lg">{a.publishedLast90d}</dd></div>
                  <div><dt className="text-muted-foreground">With author</dt><dd className="font-mono text-lg">{a.withAuthor}</dd></div>
                </dl>
              </>
            ) : (
              <Skeleton className="h-32" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Needs attention</CardTitle>
            <CardDescription>Lowest-scoring articles first. Open one to see what to fix.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {overview.isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="my-2 h-9" />)
            ) : overview.data?.attention.length ? (
              overview.data.attention.map((x) => (
                <Link key={x.id} href={`/admin/cms/articles/${x.id}`} className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-muted/40">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-sm">{x.title}</span>
                  <StatusBadge status={x.status} />
                  <span className="flex gap-2 font-mono text-xs">
                    <span className={gradeColor(x.seo)}>S{x.seo}</span>
                    <span className={gradeColor(x.aeo)}>A{x.aeo}</span>
                    <span className={gradeColor(x.geo)}>G{x.geo}</span>
                  </span>
                </Link>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">No scored articles yet. Save an article or click “Rescore articles”.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Static pages (products, showroom, FAQ …) are fixed in code by the development team; article findings are fixed in the editor. <a className="underline underline-offset-4" href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noreferrer">Google helpful content guidance <ExternalLink className="inline size-3" /></a>
      </p>
    </>
  );
}
