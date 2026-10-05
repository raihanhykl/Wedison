"use client";

import { useState } from "react";
import { Check, ExternalLink, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CareerSettings, PublicJob } from "@/lib/cms/api";
import { CAREER_COPY, mailtoFor, type CareerLocale } from "../copy";

/** Catat klik tombol lamar (fire-and-forget) untuk metrik di admin HR. */
function track(slug: string, channel: string) {
  try {
    fetch(`/api/v1/public/careers/${encodeURIComponent(slug)}/click/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ channel }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export function ApplyPanel({ job, settings, locale }: { job: PublicJob; settings: CareerSettings; locale: CareerLocale }) {
  const c = CAREER_COPY[locale];
  const [copied, setCopied] = useState(false);
  const email = job.applyEmail || settings.contactEmail;
  const href = mailtoFor(email, settings.emailSubject, job.title, job.department?.name, settings.ccEmail);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: job.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* dibatalkan pengguna */
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold tracking-tight">{c.applyTitle}</h2>
      <Button asChild size="lg" className="mt-4 w-full">
        <a href={href} onClick={() => track(job.slug, "email")}><Mail /> {c.applyEmail}</a>
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">{c.applyEmailHint(email)}</p>

      {job.portals.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.applyPortals}</p>
          <div className="grid gap-2">
            {job.portals.map((p) => (
              <Button key={p.name + p.url} asChild variant="outline" className="justify-between">
                <a href={p.url} target="_blank" rel="noopener noreferrer" onClick={() => track(job.slug, p.name)}>{p.name} <ExternalLink className="size-4" /></a>
              </Button>
            ))}
          </div>
        </div>
      )}

      {settings.applicationNote && <p className="mt-5 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">{settings.applicationNote}</p>}

      <button type="button" onClick={share} className="mt-4 flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        {copied ? <><Check className="size-4" /> {c.copied}</> : <><Share2 className="size-4" /> {c.share}</>}
      </button>
    </div>
  );
}
