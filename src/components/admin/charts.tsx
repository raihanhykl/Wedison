"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Chart ringan tanpa library (satu seri per chart, satu sumbu). Warna seri = primary; teks memakai
// token teks (bukan warna seri). Setiap chart punya tooltip hover dan fallback teks.

export type BarItem = { key: string; label: string; value: number; hint?: string };

/** Daftar batang horizontal untuk perbandingan kategori (magnitude, satu hue). */
export function BarList({ items, emptyText = "No data in this range", className }: { items: BarItem[]; emptyText?: string; className?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const total = items.reduce((a, i) => a + i.value, 0);
  if (!items.length || total === 0) return <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>;
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((i) => (
        <li key={i.key} title={`${i.label}: ${i.value}`}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-foreground">{i.label}</span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
              {i.value} <span className="text-muted-foreground/70">· {Math.round((i.value / total) * 100)}%</span>
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
          {i.hint && <p className="mt-0.5 text-xs text-muted-foreground">{i.hint}</p>}
        </li>
      ))}
    </ul>
  );
}

export type TrendPoint = { day: string; value: number };

/** Batang per hari (satu seri). Label sumbu-x jarang, grid tipis, tooltip saat hover. */
export function TrendChart({ data, label, className }: { data: TrendPoint[]; label: string; className?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 180;
  const padL = 28;
  const padB = 22;
  const padT = 8;
  const n = Math.max(1, data.length);
  const max = Math.max(1, ...data.map((d) => d.value));
  const innerW = W - padL - 4;
  const innerH = H - padT - padB;
  const step = innerW / n;
  const barW = Math.max(2, Math.min(18, step - 2)); // 2px celah antar batang
  const total = data.reduce((a, d) => a + d.value, 0);
  const tickEvery = n > 45 ? 14 : n > 14 ? 7 : 1;
  const fmt = (ymd: string, long = false) =>
    new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-GB", long ? { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" } : { day: "numeric", month: "short", timeZone: "UTC" });

  if (total === 0) return <p className="py-10 text-center text-sm text-muted-foreground">No {label.toLowerCase()} in this range</p>;

  const h = hover !== null ? data[hover] : null;
  return (
    <div className={cn("relative", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label} per day`} onMouseLeave={() => setHover(null)}>
        {[0, 0.5, 1].map((f) => {
          const y = padT + innerH - innerH * f;
          return (
            <g key={f}>
              <line x1={padL} x2={W - 4} y1={y} y2={y} className="stroke-border" strokeWidth={1} strokeDasharray={f === 0 ? undefined : "2 3"} />
              <text x={padL - 6} y={y + 3} textAnchor="end" className="fill-muted-foreground" fontSize={9} fontFamily="ui-monospace, monospace">
                {Math.round(max * f)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const x = padL + i * step + (step - barW) / 2;
          const bh = (d.value / max) * innerH;
          const y = padT + innerH - bh;
          const isHover = hover === i;
          return (
            <g key={d.day} onMouseEnter={() => setHover(i)}>
              {/* target hover lebih lebar dari batang */}
              <rect x={padL + i * step} y={padT} width={step} height={innerH} fill="transparent" />
              {d.value > 0 && <rect x={x} y={y} width={barW} height={bh} rx={2} className={cn("fill-primary transition-opacity", hover !== null && !isHover && "opacity-50")} />}
              {(i % tickEvery === 0 || (i === n - 1 && i % tickEvery >= Math.ceil(tickEvery / 2))) && (
                <text x={padL + i * step + step / 2} y={H - 6} textAnchor="middle" className="fill-muted-foreground" fontSize={9}>
                  {fmt(d.day)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {h && (
        <div
          className="pointer-events-none absolute -top-1 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: `${((padL + (hover! + 0.5) * step) / W) * 100}%`, transform: "translateX(-50%)" }}
        >
          <p className="text-muted-foreground">{fmt(h.day, true)}</p>
          <p className="font-mono font-semibold tabular-nums">{h.value} <span className="font-sans font-normal text-muted-foreground">{label.toLowerCase()}</span></p>
        </div>
      )}
    </div>
  );
}

export type StackSegment = { key: string; label: string; value: number; className: string };

/** Satu batang bertumpuk (komposisi) dengan celah 2px + legenda berlabel (identitas tidak hanya warna). */
export function StackedBar({ segments, className }: { segments: StackSegment[]; className?: string }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  if (total === 0) return <p className="py-6 text-center text-sm text-muted-foreground">No data in this range</p>;
  return (
    <div className={className}>
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full">
        {segments.filter((s) => s.value > 0).map((s) => (
          <div key={s.key} title={`${s.label}: ${s.value}`} className={cn("h-full min-w-[3px] first:rounded-l-full last:rounded-r-full", s.className)} style={{ flexGrow: s.value }} />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-sm">
            <span className={cn("size-2.5 shrink-0 rounded-full", s.className)} aria-hidden />
            <span className="truncate text-foreground">{s.label}</span>
            <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
