"use client";

import { useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@,;<>()[\]\\"]+@[^\s@,;<>()[\]\\"]+\.[^\s@,;<>()[\]\\"]{2,}$/i;
export const isEmail = (v: string) => EMAIL_RE.test(v.trim());

/**
 * Multi-email input: each address becomes a capsule with an "x" to remove it.
 * Commits on Enter, comma, semicolon, space, Tab (when text is typed) and blur; pasting a list
 * splits it. Invalid text stays in the field with an error; duplicates and addresses listed in
 * `exclude` (e.g. the To list when this is CC) are rejected. Backspace on an empty field removes
 * the last capsule.
 */
export function EmailChipsInput({
  value,
  onChange,
  placeholder = "name@wedison.co",
  max = 10,
  exclude = [],
  excludeLabel = "the other list",
  disabled,
  invalid,
  id,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  max?: number;
  /** Addresses that may not be added here (shown with `excludeLabel` in the error). */
  exclude?: string[];
  excludeLabel?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const errId = useId();

  const commit = (raw: string) => {
    const parts = raw.split(/[\s,;]+/).map((p) => p.trim().replace(/^<|>$/g, "").toLowerCase()).filter(Boolean);
    if (!parts.length) {
      setText("");
      return true;
    }
    const next = [...value];
    const bad: string[] = [];
    const problems: string[] = [];
    for (const p of parts) {
      if (!isEmail(p)) bad.push(p);
      else if (next.includes(p)) problems.push(`${p} is already added`);
      else if (exclude.includes(p)) problems.push(`${p} is already in ${excludeLabel}`);
      else if (next.length >= max) problems.push(`At most ${max} addresses`);
      else next.push(p);
    }
    if (next.length !== value.length) onChange(next);
    if (bad.length) {
      setText(bad.join(", "));
      setError(`${bad.length > 1 ? "These are not valid email addresses" : "Not a valid email address"}: ${bad.join(", ")}`);
      return false;
    }
    setText("");
    setError(problems[0] ?? null);
    return true;
  };

  const remove = (email: string) => {
    onChange(value.filter((e) => e !== email));
    setError(null);
    inputRef.current?.focus();
  };

  const full = value.length >= max;
  const showError = error ?? null;

  return (
    <div className="space-y-1.5">
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex min-h-9 w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 text-sm shadow-xs transition-[color,box-shadow] dark:bg-input/30",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          (invalid || showError) && "border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/20",
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
        )}
      >
        {value.map((email) => (
          <span key={email} className="inline-flex max-w-full items-center gap-1 rounded-full border border-primary/25 bg-primary/10 py-0.5 pl-2.5 pr-1 text-xs font-medium text-foreground">
            <span className="truncate">{email}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(email); }}
                className="flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Remove ${email}`}
              >
                <X className="size-3" />
              </button>
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="email"
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          value={text}
          aria-label={ariaLabel}
          aria-invalid={!!showError || invalid || undefined}
          aria-describedby={[describedBy, showError ? errId : null].filter(Boolean).join(" ") || undefined}
          placeholder={value.length ? (full ? "" : "Add another…") : placeholder}
          className="min-w-[10rem] flex-1 bg-transparent px-1 py-0.5 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          onChange={(e) => {
            const v = e.target.value;
            setError(null);
            if (/[,;\s]$/.test(v)) commit(v);
            else setText(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || (e.key === "Tab" && text.trim())) {
              if (text.trim()) {
                e.preventDefault();
                commit(text);
              } else if (e.key === "Enter") e.preventDefault();
            } else if (e.key === "Backspace" && !text && value.length) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text");
            if (/[\s,;]/.test(pasted.trim())) {
              e.preventDefault();
              commit(`${text}${pasted}`);
            }
          }}
          onBlur={() => { if (text.trim()) commit(text); }}
        />
      </div>
      {showError && <p id={errId} className="text-xs text-destructive">{showError}</p>}
    </div>
  );
}
