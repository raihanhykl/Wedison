"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { fillTokens, type TeaserLocale } from "@/lib/teasers/teaser";
import { Field, LocaleSwitch, TextField } from "./fields";
import type { EditorProps } from "./form-state";

export function SeoTab({ s, set, edit, readOnly, facts, locale, onLocale, issueCount }: EditorProps & {
  locale: TeaserLocale; onLocale: (l: TeaserLocale) => void; issueCount: (prefix: string) => number;
}) {
  const seo = s.content[locale].seo;
  const f = facts[locale];
  const title = fillTokens(seo.title, f);
  const desc = fillTokens(seo.description, f);
  const url = `wedison.co › ${locale} › showroom › ${s.slug || "…"}`;
  const [keywords, setKeywords] = useState(seo.keywords.join(", "));
  const [kwLocale, setKwLocale] = useState(locale);
  // Sinkronkan teks keyword saat bahasa berganti.
  if (kwLocale !== locale) { setKwLocale(locale); setKeywords(seo.keywords.join(", ")); }

  return (
    <fieldset disabled={readOnly} className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <LocaleSwitch value={locale} onChange={onLocale} issues={{ id: issueCount("content.id.seo"), en: issueCount("content.en.seo") }} />
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search result</CardTitle>
          <CardDescription>How the page can appear on Google. The title and description should read naturally and mention the city.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="truncate text-xs text-muted-foreground">{url}</p>
            <p className={cn("mt-1 line-clamp-1 text-lg leading-snug text-blue-800 dark:text-blue-300", !title && "text-muted-foreground")}>{title || "Page title"}</p>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{desc || "Page description"}</p>
          </div>
          <TextField
            label="Title" value={seo.title} max={70} idealMax={60} facts={f} required
            onChange={(v) => edit(locale, (c) => { c.seo.title = v; })}
            hint="Up to 60 characters after placeholders are filled, or Google cuts it off."
          />
          <TextField
            label="Description" value={seo.description} max={170} idealMax={155} facts={f} required multiline rows={3}
            onChange={(v) => edit(locale, (c) => { c.seo.description = v; })}
            hint={`Aim for 120–155 characters (now ${desc.length}). Mention the opening, the promotions and the test ride.`}
          />
          <Field label="Keywords" htmlFor="t-keywords" optional hint="Comma-separated. Placeholders like {city} work here too.">
            <Input
              id="t-keywords"
              value={keywords}
              onChange={(e) => {
                setKeywords(e.target.value);
                const list = e.target.value.split(",").map((k) => k.trim()).filter(Boolean).slice(0, 15);
                edit(locale, (c) => { c.seo.keywords = list; });
              }}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="t-noindex">Hide from search engines</Label>
              <p className="text-xs text-muted-foreground">The page stays reachable by link (ads, WhatsApp blasts) but Google won’t list it and it is left out of the sitemap.</p>
            </div>
            <Switch id="t-noindex" checked={s.noIndex} onCheckedChange={(v) => set("noIndex", v)} />
          </div>
          <p className="text-xs text-muted-foreground">The share image (WhatsApp, Facebook, X) is set in the Images tab.</p>
        </CardContent>
      </Card>
    </fieldset>
  );
}
