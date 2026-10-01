"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, Info, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PILLAR_DESCRIPTION, PILLAR_LABEL, type CheckStatus, type ContentScore, type HealthCheck, type Pillar, type PillarScore } from "@/lib/admin/types";

export function gradeColor(score: number) {
  return score >= 80 ? "text-primary" : score >= 55 ? "text-chart-4" : "text-destructive";
}
export function gradeStroke(score: number) {
  return score >= 80 ? "stroke-primary" : score >= 55 ? "stroke-chart-4" : "stroke-destructive";
}
export function gradeLabel(score: number) {
  return score >= 80 ? "Good" : score >= 55 ? "Needs work" : "Poor";
}

/** Circular score indicator (0–100). */
export function ScoreRing({ score, label, size = 72, className, sublabel }: { score: number; label: string; size?: number; className?: string; sublabel?: string }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (Math.max(0, Math.min(100, score)) / 100);
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={6} className="fill-none stroke-muted" />
          <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`} className={cn("fill-none transition-[stroke-dasharray] duration-500", gradeStroke(score))} />
        </svg>
        <span className={cn("absolute inset-0 flex items-center justify-center font-mono text-lg font-semibold", gradeColor(score))}>{score}</span>
      </div>
      <span className="text-xs font-medium">{label}</span>
      {sublabel && <span className="text-[11px] text-muted-foreground">{sublabel}</span>}
    </div>
  );
}

const STATUS_ICON: Record<CheckStatus, React.ElementType> = { pass: CheckCircle2, warn: AlertTriangle, fail: XCircle, info: Info };
const STATUS_COLOR: Record<CheckStatus, string> = { pass: "text-primary", warn: "text-chart-4", fail: "text-destructive", info: "text-muted-foreground" };
const ORDER: Record<CheckStatus, number> = { fail: 0, warn: 1, info: 2, pass: 3 };

export function CheckList({ checks, compact }: { checks: HealthCheck[]; compact?: boolean }) {
  const [showPassed, setShowPassed] = useState(false);
  const sorted = [...checks].sort((a, b) => ORDER[a.status] - ORDER[b.status]);
  const visible = showPassed ? sorted : sorted.filter((c) => c.status !== "pass");
  const passed = sorted.filter((c) => c.status === "pass").length;
  return (
    <div className="space-y-1">
      {visible.length === 0 && <p className="py-3 text-center text-xs text-muted-foreground">Everything passes. Nice work.</p>}
      {visible.map((c) => {
        const Icon = STATUS_ICON[c.status];
        return (
          <div key={c.id} className={cn("flex gap-2 rounded-md px-2 py-1.5", c.status === "fail" && "bg-destructive/5", c.status === "warn" && "bg-chart-4/10")}>
            <Icon className={cn("mt-0.5 size-4 shrink-0", STATUS_COLOR[c.status])} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn("text-sm", compact && "text-[13px]")}>{c.label}</span>
                {c.value && <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{c.value}</span>}
              </div>
              {c.note && c.status !== "pass" && <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{c.note}</p>}
              {c.pages && c.pages.length > 0 && c.status !== "pass" && (
                <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground" title={c.pages.join(", ")}>{c.pages.join(" · ")}</p>
              )}
            </div>
          </div>
        );
      })}
      {passed > 0 && (
        <button type="button" onClick={() => setShowPassed((v) => !v)} className="flex w-full items-center justify-center gap-1 py-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronDown className={cn("size-3 transition-transform", showPassed && "rotate-180")} /> {showPassed ? "Hide" : "Show"} {passed} passed
        </button>
      )}
    </div>
  );
}

/** Three-pillar panel used in the article editor and the site audit page. */
export function PillarTabs({ pillars, compact, defaultPillar = "seo" }: { pillars: Record<Pillar, PillarScore>; compact?: boolean; defaultPillar?: Pillar }) {
  return (
    <Tabs defaultValue={defaultPillar}>
      <TabsList className="grid w-full grid-cols-3">
        {(["seo", "aeo", "geo"] as Pillar[]).map((p) => (
          <TabsTrigger key={p} value={p} className="gap-1.5">
            {PILLAR_LABEL[p]} <span className={cn("font-mono text-xs", gradeColor(pillars[p].score))}>{pillars[p].score}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {(["seo", "aeo", "geo"] as Pillar[]).map((p) => (
        <TabsContent key={p} value={p} className="mt-3">
          <p className="mb-2 text-xs text-muted-foreground">{PILLAR_DESCRIPTION[p]} <span className="font-mono">{pillars[p].passed}/{pillars[p].total} checks</span></p>
          <CheckList checks={pillars[p].checks} compact={compact} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

/** Compact S/A/G pills for tables. */
export function HealthPills({ score, className }: { score: ContentScore | null | undefined; className?: string }) {
  if (!score) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {(["seo", "aeo", "geo"] as Pillar[]).map((p) => (
        <Tooltip key={p}>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={cn("h-5 gap-1 px-1.5 font-mono text-[10px]", score[p].score >= 80 ? "border-primary/30 bg-primary/10 text-primary" : score[p].score >= 55 ? "border-chart-4/40 bg-chart-4/15 text-foreground" : "border-destructive/30 bg-destructive/10 text-destructive")}>
              {PILLAR_LABEL[p][0]}<span>{score[p].score}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="font-medium">{PILLAR_LABEL[p]} {score[p].score}/100 · {gradeLabel(score[p].score)}</p>
            <p className="text-xs opacity-80">{score[p].checks.filter((c) => c.status === "fail").length} failing · {score[p].checks.filter((c) => c.status === "warn").length} to improve</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
