"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@/lib/admin/api";
import { JOB_STATUS_LABEL, type HrPermissions, type Job, type JobDepartment, type JobLocation, type JobStatus } from "@/lib/admin/types";

/** Permissions of the current user inside the HR module (from the backend). */
export function useHrPermissions() {
  return useQuery({
    queryKey: ["hr-permissions"],
    queryFn: () => api<{ data: HrPermissions }>("/admin/hr/permissions").then((r) => r.data),
    staleTime: 5 * 60_000,
  });
}

export function useDepartments() {
  return useQuery({ queryKey: ["hr-departments"], queryFn: () => api<{ items: JobDepartment[] }>("/admin/hr/departments").then((r) => r.items) });
}

export function useLocations() {
  return useQuery({ queryKey: ["hr-locations"], queryFn: () => api<{ items: JobLocation[] }>("/admin/hr/locations").then((r) => r.items) });
}

const STYLE: Record<JobStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground border-transparent",
  PENDING_REVIEW: "bg-chart-4/15 text-foreground border-chart-4/40",
  PUBLISHED: "bg-primary/10 text-primary border-primary/20",
  CLOSED: "bg-secondary text-secondary-foreground border-transparent",
  ARCHIVED: "bg-muted text-muted-foreground border-dashed",
};

export function JobStatusBadge({ status, className }: { status: JobStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STYLE[status], className)}>
      {JOB_STATUS_LABEL[status]}
    </Badge>
  );
}

export function jobTitle(j: Pick<Job, "translations">) {
  return (j.translations.find((t) => t.locale === "id") ?? j.translations[0])?.title ?? "(untitled)";
}

export function locationLabel(l: Pick<JobLocation, "city" | "country">) {
  return l.country && l.country !== "Indonesia" ? `${l.city}, ${l.country}` : l.city;
}

export function formatSalary(min: number | null, max: number | null, currency = "IDR") {
  const f = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  if (min && max) return `${f(min)} – ${f(max)}`;
  if (min) return `from ${f(min)}`;
  if (max) return `up to ${f(max)}`;
  return "";
}

/** One item per line; empty lines are dropped. */
export function LinesInput({ value, onChange, placeholder, rows = 5, id }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; rows?: number; id?: string }) {
  return (
    <div className="space-y-1">
      <Textarea
        id={id}
        rows={rows}
        value={value.join("\n")}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.replace(/^\s*[-•*]\s*/, "")))}
        onBlur={(e) => onChange(e.target.value.split("\n").map((s) => s.replace(/^\s*[-•*]\s*/, "").trim()).filter(Boolean))}
      />
      <p className="text-xs text-muted-foreground">One point per line · {value.filter((s) => s.trim()).length} item(s)</p>
    </div>
  );
}
