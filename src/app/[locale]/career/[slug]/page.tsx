import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Briefcase, Calendar, Clock, MapPin, Users } from "lucide-react";
import { getSEOMetadata } from "@/app/lib/seo1";
import { getCareer } from "@/lib/cms/api";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, jobPostingSchema } from "@/lib/seo/schema";
import { localeUrl } from "@/lib/seo/site";
import type { Locale } from "@/app/lib/locale";
import { CAREER_COPY, EMPLOYMENT, LEVEL, WORKPLACE, jobLocations, salaryText } from "../copy";
import { ApplyPanel } from "./apply-panel";

type Params = Promise<{ locale: string; slug: string }>;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const data = await getCareer(loc, slug);
  if (!data) return {};
  const { job } = data;
  const where = jobLocations(job);
  const title = loc === "en" ? `${job.title}${where ? ` – ${where}` : ""} | Careers at Wedison` : `Lowongan ${job.title}${where ? ` – ${where}` : ""} | Wedison`;
  return getSEOMetadata({
    locale: loc,
    path: `/career/${slug}`,
    title: title.length > 65 ? `${job.title} | Wedison` : title,
    description: job.summary.length > 155 ? `${job.summary.slice(0, 152).trimEnd()}…` : job.summary,
    image: "/og/career.jpg",
    noIndex: job.status !== "PUBLISHED",
  });
}

export default async function JobPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const data = await getCareer(loc, slug);
  if (!data) notFound();
  const { job, settings } = data;
  const c = CAREER_COPY[loc];
  const open = job.status === "PUBLISHED";
  const fmt = (d: string) => new Date(d).toLocaleDateString(loc === "en" ? "en-US" : "id-ID", { day: "numeric", month: "long", year: "numeric" });
  const salary = salaryText(job.salary, loc);
  const sections: [string, string[]][] = [
    [c.responsibilities, job.responsibilities],
    [c.qualifications, job.qualifications],
    [c.niceToHave, job.niceToHave],
    [c.benefits, job.benefits],
  ];

  const descriptionHtml = [
    `<p>${esc(job.summary).replace(/\n\n/g, "</p><p>")}</p>`,
    ...sections.filter(([, l]) => l.length).map(([h, l]) => `<h3>${esc(h)}</h3><ul>${l.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`),
  ].join("");

  const jsonLd = [
    breadcrumbSchema(loc, [
      { name: loc === "en" ? "Home" : "Beranda", path: "/" },
      { name: loc === "en" ? "Careers" : "Karier", path: "/career" },
      { name: job.title, path: `/career/${job.slug}` },
    ]),
    ...(open
      ? [
          jobPostingSchema({
            locale: loc,
            url: localeUrl(loc, `/career/${job.slug}`),
            id: job.id,
            title: job.title,
            descriptionHtml,
            datePosted: job.publishedAt,
            validThrough: job.closesAt,
            employmentType: job.employmentType,
            workplaceType: job.workplaceType,
            department: job.department?.name,
            openings: job.openings,
            locations: job.locations,
            salary: job.salary,
          }),
        ]
      : []),
  ];

  return (
    <div className="mt-14 min-h-screen bg-background">
      <JsonLd data={jsonLd} />
      <div className="main-container py-10 md:py-14">
        <Link href={`/${loc}/career/`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {c.back}
        </Link>

        {!open && (
          <div className="mb-8 rounded-2xl border border-border bg-muted/60 p-6">
            <h2 className="font-display text-lg font-bold tracking-tight">{c.closedTitle}</h2>
            <p className="mt-1 text-muted-foreground">{c.closedSub}</p>
            <Link href={`/${loc}/career/`} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">{c.seeOpenings} →</Link>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            <header className="mb-8 border-b border-border pb-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {job.department && <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary">{job.department.name}</span>}
                {job.isUrgent && open && <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">{c.urgent}</span>}
              </div>
              <h1 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-tight tracking-tight text-foreground text-balance">{job.title}</h1>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {job.locations.length > 0 && <li className="flex items-center gap-2"><MapPin className="size-4" />{jobLocations(job)}</li>}
                <li className="flex items-center gap-2"><Clock className="size-4" />{EMPLOYMENT[loc][job.employmentType]} · {WORKPLACE[loc][job.workplaceType]}</li>
                {job.experienceLevel && <li className="flex items-center gap-2"><Briefcase className="size-4" />{LEVEL[loc][job.experienceLevel]}</li>}
                {job.openings > 1 && <li className="flex items-center gap-2"><Users className="size-4" />{c.positions(job.openings)}</li>}
                {job.closesAt && open && <li className="flex items-center gap-2"><Calendar className="size-4" />{c.closesOn(fmt(job.closesAt))}</li>}
              </ul>
              {salary && <p className="mt-4 text-lg font-semibold text-foreground">{salary}</p>}
            </header>

            <section className="mb-10">
              <h2 className="mb-3 font-display text-xl font-bold tracking-tight">{c.about}</h2>
              {job.summary.split(/\n{2,}/).map((p, i) => <p key={i} className="mb-3 leading-relaxed text-foreground/90">{p}</p>)}
            </section>

            {sections.filter(([, list]) => list.length > 0).map(([heading, list]) => (
              <section key={heading} className="mb-10">
                <h2 className="mb-3 font-display text-xl font-bold tracking-tight">{heading}</h2>
                <ul className="space-y-2.5">
                  {list.map((item, i) => (
                    <li key={i} className="flex gap-3 leading-relaxed text-foreground/90"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </section>
            ))}

            {job.publishedAt && <p className="text-xs text-muted-foreground">{c.postedOn(fmt(job.publishedAt))}</p>}
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            {open && <ApplyPanel job={job} settings={settings} locale={loc} />}
            {(settings.phone || settings.whatsapp) && (
              <div className="mt-4 rounded-2xl border border-border p-5 text-sm">
                <p className="font-medium">{c.contact}</p>
                <p className="mt-1 text-muted-foreground">{settings.contactName}</p>
                {settings.phone && <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="mt-1 block text-primary hover:underline">{settings.phone}</a>}
                {settings.whatsapp && <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="mt-1 block text-primary hover:underline">WhatsApp</a>}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
