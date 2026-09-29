"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingStatusBadge } from "@/components/admin/status-badge";
import { timeAgo } from "@/lib/admin/format";
import { BOOKING_PURPOSE_LABEL, SHOWROOM_LABEL, SHOWROOM_TZ, waLink, type Booking, type ContactSubmission } from "@/lib/admin/types";

/** "Wed, 30 Sep · 10:30 WIB" dari tanggal/jam booking (zona waktu showroom, bukan browser). */
export function formatVisit(b: Pick<Booking, "date" | "time" | "showroom">, opts: { year?: boolean } = {}) {
  const d = new Date(`${b.date}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", ...(opts.year ? { year: "numeric" } : {}), timeZone: "UTC" });
  return `${d} · ${b.time} ${SHOWROOM_TZ[b.showroom]}`;
}

export function BookingRow({ b, href }: { b: Booking; href?: string }) {
  return (
    <div className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-muted/40">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {b.name} <span className="font-normal text-muted-foreground">· {BOOKING_PURPOSE_LABEL[b.purpose]}</span>
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {formatVisit(b)} · {SHOWROOM_LABEL[b.showroom]}
        </p>
      </div>
      <BookingStatusBadge status={b.status} />
      <Button variant="ghost" size="icon" className="size-8" asChild>
        <a href={href ?? waLink(b.phone)} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${b.name}`}>
          <MessageCircle />
        </a>
      </Button>
    </div>
  );
}

export function ContactRow({ c }: { c: ContactSubmission }) {
  return (
    <div className="-mx-2 flex items-start gap-3 rounded-md px-2 py-2.5 hover:bg-muted/40">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {c.name} <span className="font-normal text-muted-foreground">· {c.topic}</span>
        </p>
        <p className="line-clamp-1 text-xs text-muted-foreground">{c.message}</p>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(c.createdAt)}</span>
    </div>
  );
}

export function ListCard({ title, href, loading, empty, children }: { title: string; href: string; loading?: boolean; empty: boolean; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display text-lg">{title}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href={href}>
            View all <ArrowRight />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="my-3 h-10" />) : empty ? <p className="py-8 text-center text-sm text-muted-foreground">Nothing here yet.</p> : children}
      </CardContent>
    </Card>
  );
}
