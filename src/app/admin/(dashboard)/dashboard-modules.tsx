"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { NAV } from "@/components/admin/nav-config";
import { useAdminUser } from "@/components/admin/providers";
import { api } from "@/lib/admin/api";
import { canAccess, type Module } from "@/lib/admin/permissions";
import { cn } from "@/lib/utils";

type Stat = { label: string; value: number; href?: string; tone?: "attention" };
export type ModuleSummaries = { modules: { module: Module; stats: Stat[] }[]; canWriteArticles: boolean };

const DESCRIPTION: Record<string, string> = {
  "CMS · Media Center": "Articles, press coverage, social posts and media for the Media Center.",
  SuperCharge: "Charging stations on the public SuperCharge locator.",
  Pricing: "Prices, schemes and terms per region.",
  Leads: "Showroom bookings and contact-form messages.",
  Showrooms: "Showroom locations and opening teaser pages.",
  "HR · Careers": "Job openings and applications on the careers page.",
  System: "Team accounts, roles and the activity log.",
};

export function useModuleSummaries() {
  return useQuery({
    queryKey: ["dashboard-modules"],
    queryFn: () => api<{ data: ModuleSummaries }>("/admin/dashboard/modules").then((r) => r.data),
    refetchInterval: 60_000,
  });
}

/** One card per sidebar group the signed-in user can open, with live numbers and quick links. */
export function ModuleCards() {
  const user = useAdminUser();
  const { data, isLoading } = useModuleSummaries();
  const groups = NAV.filter((g) => g.label !== "Overview")
    .map((g) => ({ ...g, items: g.items.filter((i) => i.module && canAccess(user, i.module)) }))
    .filter((g) => g.items.length > 0);

  if (!groups.length) return null;

  return (
    <section aria-labelledby="modules-title" className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 id="modules-title" className="font-display text-lg font-bold tracking-tight">Your modules</h2>
        <p className="text-xs text-muted-foreground">{groups.length} module{groups.length === 1 ? "" : "s"} open to your role</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => {
          const Icon = g.items[0].icon;
          const modules = [...new Set(g.items.map((i) => i.module!))];
          const stats = (data?.modules ?? []).filter((m) => modules.includes(m.module)).flatMap((m) => m.stats).slice(0, 3);
          const attention = stats.some((s) => s.tone === "attention");
          return (
            <article key={g.label} className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] transition-[border-color,box-shadow] hover:border-foreground/20 hover:shadow-md">
              <header className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={g.items[0].href} className="flex items-center gap-1.5 font-display text-base font-bold tracking-tight hover:text-primary">
                    {g.label}
                    {attention && <span className="size-2 rounded-full bg-chart-4" aria-label="Needs attention" />}
                  </Link>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{DESCRIPTION[g.label] ?? ""}</p>
                </div>
              </header>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)
                  : stats.map((s) => {
                      const body = (
                        <>
                          <span className={cn("block font-mono text-xl font-semibold tabular-nums", s.tone === "attention" && "text-chart-4")}>{s.value.toLocaleString("en-US")}</span>
                          <span className="mt-0.5 line-clamp-2 block text-[11px] leading-tight text-muted-foreground">{s.label}</span>
                        </>
                      );
                      return s.href ? (
                        <Link key={s.label} href={s.href} className="rounded-lg bg-muted/50 px-2.5 py-2 transition-colors hover:bg-muted">{body}</Link>
                      ) : (
                        <div key={s.label} className="rounded-lg bg-muted/50 px-2.5 py-2">{body}</div>
                      );
                    })}
              </div>

              <nav aria-label={`${g.label} pages`} className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-3">
                {g.items.map((i) => (
                  <Link key={i.href} href={i.href} className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground">
                    <i.icon className="size-3.5" />
                    {i.title === "Overview" ? `${g.label.split(" ")[0]} overview` : i.title}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-60" />
                  </Link>
                ))}
              </nav>
            </article>
          );
        })}
      </div>
    </section>
  );
}
