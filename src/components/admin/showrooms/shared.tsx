"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/admin/api";
import { cn } from "@/lib/utils";
import type { AdminShowroom, ShowroomStatus } from "@/lib/admin/types";

export const SHOWROOM_STATUS_LABEL: Record<ShowroomStatus, string> = {
  OPEN: "Open",
  COMING_SOON: "Coming soon",
  TEMPORARILY_CLOSED: "Temporarily closed",
  CLOSED: "Closed permanently",
};

export const SHOWROOM_STATUS_HELP: Record<ShowroomStatus, string> = {
  OPEN: "Operating normally. Shown on the Showroom page and bookable (if booking is on).",
  COMING_SOON: "Not open yet. Hidden by default; when shown, the site only displays the city as “Coming soon”.",
  TEMPORARILY_CLOSED: "Still listed with a “Temporarily closed” label, but nobody can book it.",
  CLOSED: "Removed from the site everywhere. Booking history stays in Leads.",
};

const STYLE: Record<ShowroomStatus, string> = {
  OPEN: "bg-primary/10 text-primary border-primary/20",
  COMING_SOON: "bg-chart-2/15 text-foreground border-chart-2/40",
  TEMPORARILY_CLOSED: "bg-chart-4/15 text-foreground border-chart-4/40",
  CLOSED: "bg-muted text-muted-foreground border-border",
};

export function ShowroomStatusBadge({ status, className }: { status: ShowroomStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STYLE[status], className)}>
      {SHOWROOM_STATUS_LABEL[status]}
    </Badge>
  );
}

/** Ringkasan satu kalimat: di mana showroom ini tampil dan apakah bisa di-booking. */
export function visibilitySummary(s: Pick<AdminShowroom, "status" | "isPublic" | "bookable">) {
  if (s.status === "CLOSED") return "Not on the site";
  if (!s.isPublic) return "Hidden from the site";
  if (s.status === "COMING_SOON") return "Shown as “Coming soon”";
  if (s.status === "TEMPORARILY_CLOSED") return "Shown, booking closed";
  return s.bookable ? "Shown · bookable" : "Shown · booking off";
}

export type ShowroomPermissions = { write: boolean; delete: boolean; teasers: boolean };

export function useShowroomPermissions() {
  return useQuery({
    queryKey: ["showroom-permissions"],
    queryFn: () => api<{ data: ShowroomPermissions }>("/admin/showrooms/permissions").then((r) => r.data),
    staleTime: 5 * 60_000,
  });
}
