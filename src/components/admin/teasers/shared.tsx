"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/admin/api";
import { cn } from "@/lib/utils";
import { tzLabel, type TeaserStatus } from "@/lib/teasers/teaser";
import type { AdminTeaser } from "@/lib/admin/types";

export const TEASER_STATUS_LABEL: Record<TeaserStatus, string> = { DRAFT: "Draft", PUBLISHED: "Published", ARCHIVED: "Archived" };

export const TEASER_STATUS_HELP: Record<TeaserStatus, string> = {
  DRAFT: "Not visible on the site. Use Preview to check it.",
  PUBLISHED: "Live on the site. Saved changes appear right away.",
  ARCHIVED: "Hidden. Visitors to the old link are sent to the Showroom page.",
};

const STYLE: Record<TeaserStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground border-border",
  PUBLISHED: "bg-primary/10 text-primary border-primary/20",
  ARCHIVED: "bg-chart-4/15 text-foreground border-chart-4/40",
};

export function TeaserStatusBadge({ status, className }: { status: TeaserStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STYLE[status], className)}>
      {TEASER_STATUS_LABEL[status]}
    </Badge>
  );
}

export type TeaserPermissions = { write: boolean; publish: boolean; delete: boolean };

export function useTeaserPermissions() {
  return useQuery({
    queryKey: ["teaser-permissions"],
    queryFn: () => api<{ data: TeaserPermissions }>("/admin/teasers/permissions").then((r) => r.data),
    staleTime: 5 * 60_000,
  });
}

export type EventPhase = { key: "upcoming" | "live" | "ended"; label: string };

/** Posisi acara relatif terhadap sekarang: "in 12 days", "today", "ended 3 days ago". */
export function eventPhase(t: Pick<AdminTeaser, "startAt" | "endAt">, now = Date.now()): EventPhase {
  const start = new Date(t.startAt).getTime();
  const end = new Date(t.endAt).getTime();
  const day = 86_400_000;
  if (now < start) {
    const d = Math.ceil((start - now) / day);
    return { key: "upcoming", label: d <= 1 ? "Opens within 24 hours" : `Opens in ${d} days` };
  }
  if (now <= end) return { key: "live", label: "Happening now" };
  const d = Math.floor((now - end) / day);
  return { key: "ended", label: d < 1 ? "Ended today" : `Ended ${d} day${d > 1 ? "s" : ""} ago` };
}

/** "Sat, 28 Nov 2026 · 10:00–17:00 WIB" di zona showroom. */
export function scheduleLabel(t: Pick<AdminTeaser, "startDate" | "startTime" | "endDate" | "endTime" | "timeZone">) {
  const d = (ymd: string) => new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const tz = tzLabel(t.timeZone);
  return t.startDate === t.endDate
    ? `${d(t.startDate)} · ${t.startTime}–${t.endTime} ${tz}`
    : `${d(t.startDate)} ${t.startTime} – ${d(t.endDate)} ${t.endTime} ${tz}`;
}

export const previewUrl = (slug: string, locale: "id" | "en" = "id") => `/api/preview/teaser/?slug=${encodeURIComponent(slug)}&locale=${locale}`;
export const liveUrl = (slug: string, locale: "id" | "en" = "id") => `/${locale}/showroom/${slug}/`;
export const inquiriesUrl = (source: string) => `/admin/leads/contacts?source=${encodeURIComponent(source)}`;
