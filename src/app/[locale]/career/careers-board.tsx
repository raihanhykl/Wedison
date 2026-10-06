"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Clock, MapPin, Search, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import type { CareersResponse, PublicJob } from "@/lib/cms/api";
import { CAREER_COPY, EMPLOYMENT, WORKPLACE, jobLocations, mailtoFor, salaryText, type CareerLocale } from "./copy";

const selectCls = "h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function CareersBoard({ data, locale }: { data: CareersResponse; locale: CareerLocale }) {
  const { t } = useLanguage();
  const c = CAREER_COPY[locale];
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [loc, setLoc] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");

  const countries = useMemo(() => [...new Map(data.filters.locations.map((l) => [l.countryCode, l.country])).entries()], [data.filters.locations]);
  const types = useMemo(() => [...new Set(data.items.map((j) => j.employmentType))], [data.items]);
  const filtered = data.items.filter((j) => {
    if (dept && j.department?.slug !== dept) return false;
    if (loc && !j.locations.some((l) => l.slug === loc)) return false;
    if (country && !j.locations.some((l) => l.countryCode === country)) return false;
    if (type && j.employmentType !== type) return false;
    if (q.trim()) {
      const hay = `${j.title} ${j.department?.name ?? ""} ${jobLocations(j)}`.toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });
  const hasFilter = !!(q || dept || loc || country || type);
  const s = data.settings;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Banner */}
      <div className="relative h-[480px] w-full overflow-hidden md:h-[520px]">
        <Image src="/career/career-banner.webp" alt="" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 via-70% to-black/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="main-container">
            <Reveal as="div" className="max-w-3xl">
              <h1 className="mb-4 font-display text-[clamp(2.4rem,5.6vw,4.5rem)] font-bold tracking-tight text-white md:mb-6">
                {t("career.banner.title")}
                <br />
                <span className="text-on-forest-accent">{t("career.banner.titleHighlight")}</span>
              </h1>
              <p className="mb-6 text-lg text-white/80 md:mb-8 md:text-xl lg:text-2xl">{t("career.banner.description")}</p>
              <div className="flex flex-wrap gap-3">
                {(["career.banner.badge1", "career.banner.badge2", "career.banner.badge3"] as const).map((k) => (
                  <span key={k} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">{t(k)}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="main-container py-12 md:py-16">
        <div className="mb-8 md:mb-10">
          <h2 className="font-display text-[clamp(1.9rem,4vw,2.9rem)] font-bold tracking-tight text-foreground">{c.boardTitle}</h2>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{c.boardSub}</p>
        </div>

        {data.items.length > 0 && (
          <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.search} className="h-10 pl-9" aria-label={c.search} />
            </div>
            {data.filters.departments.length > 1 && (
              <select className={selectCls} value={dept} onChange={(e) => setDept(e.target.value)} aria-label={c.allDivisions}>
                <option value="">{c.allDivisions}</option>
                {data.filters.departments.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            )}
            {countries.length > 1 && (
              <select className={selectCls} value={country} onChange={(e) => { setCountry(e.target.value); setLoc(""); }} aria-label={c.allCountries}>
                <option value="">{c.allCountries}</option>
                {countries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
              </select>
            )}
            {data.filters.locations.length > 1 && (
              <select className={selectCls} value={loc} onChange={(e) => setLoc(e.target.value)} aria-label={c.allLocations}>
                <option value="">{c.allLocations}</option>
                {data.filters.locations.filter((l) => !country || l.countryCode === country).map((l) => <option key={l.slug} value={l.slug}>{l.city}</option>)}
              </select>
            )}
            {types.length > 1 && (
              <select className={selectCls} value={type} onChange={(e) => setType(e.target.value)} aria-label={c.allTypes}>
                <option value="">{c.allTypes}</option>
                {types.map((tp) => <option key={tp} value={tp}>{EMPLOYMENT[locale][tp]}</option>)}
              </select>
            )}
            <div className="flex items-center gap-3 lg:ml-auto">
              <span className="text-sm text-muted-foreground" aria-live="polite">{c.results(filtered.length)}</span>
              {hasFilter && <button type="button" onClick={() => { setQ(""); setDept(""); setLoc(""); setCountry(""); setType(""); }} className="flex items-center gap-1 text-sm text-primary hover:underline"><X className="size-3.5" />{c.reset}</button>}
            </div>
          </div>
        )}

        {data.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <Briefcase className="mx-auto size-8 text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{c.noJobsTitle}</h3>
            <p className="mx-auto mt-2 max-w-lg text-muted-foreground">{c.noJobsSub}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <h3 className="font-display text-lg font-bold tracking-tight">{c.noMatchTitle}</h3>
            <p className="mt-1 text-muted-foreground">{c.noMatchSub}</p>
          </div>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {filtered.map((j) => <JobRow key={j.id} job={j} locale={locale} />)}
          </ul>
        )}

        {s.openApplicationEnabled && (
          <div className="mt-12 flex flex-col gap-6 rounded-2xl bg-forest p-8 text-forest-foreground md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl font-bold tracking-tight">{c.openTitle}</h3>
              <p className="mt-2 text-forest-muted">{c.openSub}</p>
            </div>
            <Button asChild size="lg" className="shrink-0 bg-on-forest-accent text-forest-deep hover:bg-on-forest-accent/90">
              <a href={mailtoFor(s.contactEmail, c.openSubject, c.openSubject, null, s.ccEmail)}><Send /> {c.openCta}</a>
            </Button>
          </div>
        )}

        {s.companyPortals.length > 0 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {c.findUs}{" "}
            {s.companyPortals.map((p, i) => (
              <span key={p.name}>{i > 0 && " · "}<a href={p.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">{p.name}</a></span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

function JobRow({ job: j, locale }: { job: PublicJob; locale: CareerLocale }) {
  const c = CAREER_COPY[locale];
  const salary = salaryText(j.salary, locale);
  return (
    <li>
      <Link href={`/${locale}/career/${j.slug}/`} className="group flex flex-col gap-3 p-5 transition-colors hover:bg-muted/50 md:flex-row md:items-center md:gap-6 md:p-6">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {j.department && <span className="font-mono text-xs uppercase tracking-wider text-primary">{j.department.name}</span>}
            {j.isUrgent && <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">{c.urgent}</span>}
          </div>
          <h3 className="font-display text-lg font-bold tracking-tight text-foreground group-hover:text-primary md:text-xl">{j.title}</h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {j.locations.length > 0 && <span className="flex items-center gap-1.5"><MapPin className="size-4" />{jobLocations(j)}</span>}
            <span className="flex items-center gap-1.5"><Clock className="size-4" />{EMPLOYMENT[locale][j.employmentType]} · {WORKPLACE[locale][j.workplaceType]}</span>
            {j.openings > 1 && <span>{c.positions(j.openings)}</span>}
            {salary && <span className="font-medium text-foreground">{salary}</span>}
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">{c.viewJob} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
      </Link>
    </li>
  );
}
