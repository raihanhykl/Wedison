"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { PenLine, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** User reference attached by the API to createdBy / updatedBy / deletedBy. */
export type AuditUserRef = { id: string; name: string; email?: string; avatarUrl?: string | null; deleted?: boolean; deletedAt?: string | null } | { name: string } | null | undefined;

export type Audited = {
  createdAt?: string | null;
  updatedAt?: string | null;
  createdById?: string | null;
  updatedById?: string | null;
  createdBy?: AuditUserRef;
  updatedBy?: AuditUserRef;
};

const isDeleted = (u: AuditUserRef) => !!u && ("deleted" in u ? !!u.deleted : "deletedAt" in u ? !!u.deletedAt : false);

const fmt = (d: Date) => d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** "Name" with a "(deleted)" marker; `fallback` when no user is recorded (system, website, older data). */
export function AuditName({ user, fallback = "unknown", className }: { user: AuditUserRef; fallback?: string; className?: string }) {
  if (!user) return <span className={cn("text-muted-foreground", className)}>{fallback}</span>;
  return (
    <span className={cn("text-muted-foreground", className)} title={"email" in user && user.email ? user.email : undefined}>
      {user.name}
      {isDeleted(user) && <span className="ml-1 rounded bg-muted px-1 text-[10px] uppercase tracking-wide">deleted</span>}
    </span>
  );
}

/** Date + who, inline ("5 Oct 2026, 10:20 · Rina") or stacked on two lines. */
export function AuditStamp({ user, at, verb, stacked, fallback }: { user: AuditUserRef; at: string | null | undefined; verb?: string; stacked?: boolean; fallback?: string }) {
  if (!at) return <span className="text-muted-foreground">—</span>;
  const d = new Date(at);
  if (stacked) {
    return (
      <span className="flex flex-col leading-tight" title={d.toISOString()}>
        <span className="whitespace-nowrap tabular-nums">{fmt(d)}</span>
        <AuditName user={user} fallback={fallback} className="max-w-[170px] truncate" />
      </span>
    );
  }
  return (
    <span title={d.toISOString()}>
      {verb && <span className="text-muted-foreground">{verb} </span>}
      <span className="tabular-nums">{fmt(d)}</span>
      <span className="text-muted-foreground"> · </span>
      <AuditName user={user} fallback={fallback} />
    </span>
  );
}

const short = (d: Date) =>
  d.getFullYear() === new Date().getFullYear()
    ? d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function CompactRow({ icon: Icon, label, user, at, fallback }: { icon: typeof Plus; label: string; user: AuditUserRef; at: string; fallback?: string }) {
  const d = new Date(at);
  return (
    <span className="flex min-w-0 items-center gap-1.5" title={`${label} ${fmt(d)} · ${user ? user.name + (isDeleted(user) ? " (deleted)" : "") : fallback ?? "unknown"}`}>
      <Icon className="size-3 shrink-0 text-muted-foreground/70" aria-label={label} />
      <span className="shrink-0 whitespace-nowrap tabular-nums">{short(d)}</span>
      <AuditName user={user} fallback={fallback} className="min-w-0 truncate" />
    </span>
  );
}

/** Compact two-line cell: + created date · who / ✎ updated date · who (full text in the tooltip). */
export function AuditCell({ item, createdFallback, updatedFallback }: { item: Audited; createdFallback?: string; updatedFallback?: string }) {
  const same = item.createdAt && item.updatedAt && Math.abs(new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime()) < 2000 && (item.updatedById ?? null) === (item.createdById ?? null);
  if (!item.createdAt && !item.updatedAt) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex max-w-[200px] flex-col gap-0.5 text-xs leading-tight">
      {item.createdAt && <CompactRow icon={Plus} label="Created" user={item.createdBy} at={item.createdAt} fallback={createdFallback} />}
      {item.updatedAt && !same && <CompactRow icon={PenLine} label="Updated" user={item.updatedBy} at={item.updatedAt} fallback={updatedFallback} />}
    </div>
  );
}

/** DataTable column showing created/updated at + by. */
export function auditColumn<T extends Audited>(opts: { createdFallback?: string; updatedFallback?: string; size?: number } = {}): ColumnDef<T, unknown> {
  return {
    id: "audit",
    header: "Created · Updated",
    size: opts.size ?? 180,
    cell: ({ row }) => <AuditCell item={row.original} createdFallback={opts.createdFallback} updatedFallback={opts.updatedFallback} />,
  };
}

/** One muted line for cards / panels: "Updated 2 Oct 2026, 10:20 · Rina" (or created when never edited). */
export function AuditLine({ item, className, fallback }: { item: Audited; className?: string; fallback?: string }) {
  if (!item.updatedAt && !item.createdAt) return null;
  const edited = item.updatedAt && item.createdAt && new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime() > 2000;
  return (
    <p className={cn("text-[11px] text-muted-foreground", className)}>
      {edited ? <AuditStamp verb="Updated" user={item.updatedBy} at={item.updatedAt} fallback={fallback} /> : <AuditStamp verb="Created" user={item.createdBy} at={item.createdAt ?? item.updatedAt} fallback={fallback} />}
    </p>
  );
}

/** Plain-text version for title tooltips. */
export function auditText(item: Audited) {
  const who = (u: AuditUserRef, f: string) => (u ? `${u.name}${isDeleted(u) ? " (deleted)" : ""}` : f);
  const parts: string[] = [];
  if (item.createdAt) parts.push(`Created ${fmt(new Date(item.createdAt))} · ${who(item.createdBy, "unknown")}`);
  if (item.updatedAt) parts.push(`Updated ${fmt(new Date(item.updatedAt))} · ${who(item.updatedBy, "unknown")}`);
  return parts.join("\n");
}
