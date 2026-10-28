"use client";

import { useId, type ReactNode } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TOKENS, fillTokens, type TeaserFacts } from "@/lib/teasers/teaser";

const HAS_TOKEN = /\{(city|showroom|date|time|address)\}/;

/** Label + kontrol + bantuan/galat, dengan id yang menghubungkan label dan input. */
export function Field({ label, hint, error, warn, optional, htmlFor, children, className }: {
  label: string; hint?: ReactNode; error?: string | null; warn?: string | null; optional?: boolean; htmlFor?: string; children: ReactNode; className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label} {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : warn ? <p className="text-xs text-chart-4">{warn}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/**
 * Input teks dengan penghitung karakter. Bila memakai token ({city}, {date}, …) tampil pratinjau
 * hasil akhirnya. `required` menandai kosong sebagai belum siap tayang.
 */
export function TextField({
  label, value, onChange, max, multiline, rows = 3, placeholder, hint, facts, required, optional, idealMax, className,
}: {
  label: string; value: string; onChange: (v: string) => void; max: number; multiline?: boolean; rows?: number; placeholder?: string;
  hint?: ReactNode; facts?: TeaserFacts; required?: boolean; optional?: boolean; idealMax?: number; className?: string;
}) {
  const id = useId();
  const filled = facts && HAS_TOKEN.test(value) ? fillTokens(value, facts) : null;
  const len = (filled ?? value).length;
  const over = idealMax ? len > idealMax : false;
  const empty = required && !value.trim();
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>
          {label} {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
        </Label>
        <span className={cn("font-mono text-[11px] tabular-nums", over || value.length > max ? "text-destructive" : "text-muted-foreground")}>
          {len}/{idealMax ?? max}
        </span>
      </div>
      {multiline ? (
        <Textarea id={id} rows={rows} value={value} maxLength={max} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} aria-invalid={empty || undefined} className={cn(empty && "border-chart-4")} />
      ) : (
        <Input id={id} value={value} maxLength={max} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} aria-invalid={empty || undefined} className={cn(empty && "border-chart-4")} />
      )}
      {filled && <p className="rounded-md bg-muted/60 px-2.5 py-1.5 text-xs text-muted-foreground"><span className="font-medium text-foreground">Shows as:</span> {filled}</p>}
      {empty ? <p className="text-xs text-chart-4">Required before publishing.</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** Daftar item yang bisa ditambah, diurutkan, dan dihapus (promo, FAQ, poin pengalaman). */
export function RepeatList<T>({
  items, onChange, max, addLabel, make, itemLabel, render, disabled,
}: {
  items: T[]; onChange: (v: T[]) => void; max: number; addLabel: string; make: () => T; itemLabel: (i: number) => string;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode; disabled?: boolean;
}) {
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-1">
            <span className="mr-auto font-mono text-xs uppercase tracking-wider text-muted-foreground">{itemLabel(i)}</span>
            <Button type="button" variant="ghost" size="icon" className="size-7" disabled={disabled || i === 0} onClick={() => move(i, -1)} aria-label={`Move ${itemLabel(i)} up`}><ArrowUp /></Button>
            <Button type="button" variant="ghost" size="icon" className="size-7" disabled={disabled || i === items.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${itemLabel(i)} down`}><ArrowDown /></Button>
            <Button type="button" variant="ghost" size="icon" className="size-7 text-destructive" disabled={disabled} onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label={`Remove ${itemLabel(i)}`}><Trash2 /></Button>
          </div>
          <div className="space-y-3">{render(item, (patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x))), i)}</div>
        </div>
      ))}
      {items.length === 0 && <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">Nothing here yet.</p>}
      <Button type="button" variant="outline" size="sm" disabled={disabled || items.length >= max} onClick={() => onChange([...items, make()])}>
        <Plus /> {addLabel} {items.length >= max && <span className="text-muted-foreground">(max {max})</span>}
      </Button>
    </div>
  );
}

/** Token yang bisa dipakai di teks; klik untuk menyalin. */
export function TokenHelp({ facts }: { facts: TeaserFacts }) {
  const value: Record<string, string> = { "{city}": facts.city, "{showroom}": facts.showroom, "{date}": facts.date, "{time}": facts.time, "{address}": facts.address };
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs">
      <p className="text-muted-foreground">
        Use these placeholders in any text. They are filled in automatically, so changing the date or address updates every sentence. Click to copy.
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {TOKENS.map((t) => (
          <button
            key={t.token}
            type="button"
            title={`${t.desc}: ${value[t.token]}`}
            onClick={() => void navigator.clipboard.writeText(t.token).then(() => toast.success(`${t.token} copied`))}
            className="rounded-md border border-border bg-background px-2 py-1 font-mono hover:border-primary hover:text-primary"
          >
            {t.token} <span className="font-sans text-muted-foreground">→ {value[t.token] || "—"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Switch bahasa konten (ID/EN) yang dipakai tab Page text & SEO. */
export function LocaleSwitch({ value, onChange, issues }: { value: "id" | "en"; onChange: (l: "id" | "en") => void; issues: Record<"id" | "en", number> }) {
  return (
    <div role="tablist" aria-label="Content language" className="inline-flex rounded-lg border border-border bg-muted p-0.5">
      {(["id", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          role="tab"
          aria-selected={value === l}
          onClick={() => onChange(l)}
          className={cn("inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors", value === l ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
        >
          {l === "id" ? "Bahasa Indonesia" : "English"}
          {issues[l] > 0 && <span className="rounded-full bg-chart-4/20 px-1.5 font-mono text-[10px] text-foreground">{issues[l]}</span>}
        </button>
      ))}
    </div>
  );
}
