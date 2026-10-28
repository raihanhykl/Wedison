"use client";

import { useEffect, useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { MODEL_CATALOG, MODEL_KEYS, type TeaserContent, type TeaserLocale } from "@/lib/teasers/teaser";
import { TEASER_TEMPLATE } from "@/lib/teasers/template";
import { LocaleSwitch, RepeatList, TextField, TokenHelp } from "./fields";
import type { EditorProps } from "./form-state";

type SectionKey = Exclude<keyof TeaserContent, "seo">;

const SECTIONS: { key: SectionKey; title: string; where: string }[] = [
  { key: "hero", title: "Hero", where: "Top of the page, over the main image." },
  { key: "countdown", title: "Countdown", where: "Labels under the hero buttons." },
  { key: "event", title: "Event details", where: "Date, time, address and calendar button." },
  { key: "experience", title: "What you can do", where: "Numbered list beside the interior photo." },
  { key: "promo", title: "Promotions", where: "Dark green section with the promotion list." },
  { key: "models", title: "Models", where: "Motorcycle line-up with links to product pages." },
  { key: "inquiry", title: "Inquiry form", where: "Heading above the form and the WhatsApp/email box." },
  { key: "faq", title: "FAQ", where: "Questions at the bottom (also shown in Google results)." },
];

export function TextTab(props: EditorProps & {
  locale: TeaserLocale; onLocale: (l: TeaserLocale) => void; issueCount: (prefix: string) => number;
  /** section yang dituju dari checklist; `n` berubah tiap klik agar klik ulang tetap menggulir */
  focus: { section: string; n: number } | null;
}) {
  const { s, edit, readOnly, facts, locale, onLocale, issueCount, focus } = props;
  const [open, setOpen] = useState<string[]>(["hero"]);
  useEffect(() => {
    if (!focus) return;
    setOpen((o) => (o.includes(focus.section) ? o : [...o, focus.section]));
    const t = setTimeout(() => document.getElementById(`teaser-sec-${focus.section}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    return () => clearTimeout(t);
  }, [focus]);
  const c = s.content[locale];
  const f = facts[locale];
  const [reset, setReset] = useState<SectionKey | null>(null);
  const up = (fn: (c: TeaserContent) => void) => edit(locale, fn);
  const t = (label: string, value: string, onChange: (v: string) => void, max: number, opts: Partial<Parameters<typeof TextField>[0]> = {}) => (
    <TextField label={label} value={value} onChange={onChange} max={max} facts={f} {...opts} />
  );

  const body: Record<SectionKey, ReactNode> = {
    hero: (
      <>
        {t("Small label above the headline", c.hero.eyebrow, (v) => up((d) => { d.hero.eyebrow = v; }), 60, { optional: true, hint: "Empty = no label." })}
        {t("Headline (H1)", c.hero.title, (v) => up((d) => { d.hero.title = v; }), 120, { required: true, hint: "The main title of the page. Keep it under ~60 characters so it fits on 3 lines." })}
        {t("Description", c.hero.desc, (v) => up((d) => { d.hero.desc = v; }), 320, { multiline: true, required: true })}
        <div className="grid gap-3 sm:grid-cols-2">
          {t("Main button", c.hero.ctaPrimary, (v) => up((d) => { d.hero.ctaPrimary = v; }), 40, { required: true, hint: "Scrolls to the inquiry form." })}
          {t("Second button", c.hero.ctaSecondary, (v) => up((d) => { d.hero.ctaSecondary = v; }), 40, { optional: true, hint: "Scrolls to the promotions. Empty = hidden." })}
        </div>
      </>
    ),
    countdown: (
      <>
        {t("Label for screen readers", c.countdown.label, (v) => up((d) => { d.countdown.label = v; }), 80)}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {t("Days", c.countdown.days, (v) => up((d) => { d.countdown.days = v; }), 20)}
          {t("Hours", c.countdown.hours, (v) => up((d) => { d.countdown.hours = v; }), 20)}
          {t("Minutes", c.countdown.minutes, (v) => up((d) => { d.countdown.minutes = v; }), 20)}
          {t("Seconds", c.countdown.seconds, (v) => up((d) => { d.countdown.seconds = v; }), 20)}
        </div>
        {t("Message after the opening starts", c.countdown.open, (v) => up((d) => { d.countdown.open = v; }), 160, { multiline: true, rows: 2, hint: "Replaces the countdown once the start time has passed." })}
      </>
    ),
    event: (
      <>
        {t("Heading", c.event.title, (v) => up((d) => { d.event.title = v; }), 80, { required: true })}
        {t("Description", c.event.desc, (v) => up((d) => { d.event.desc = v; }), 320, { multiline: true, optional: true })}
        <div className="grid gap-3 sm:grid-cols-3">
          {t("“Date” label", c.event.dateLabel, (v) => up((d) => { d.event.dateLabel = v; }), 30)}
          {t("“Time” label", c.event.timeLabel, (v) => up((d) => { d.event.timeLabel = v; }), 30)}
          {t("“Location” label", c.event.locationLabel, (v) => up((d) => { d.event.locationLabel = v; }), 30)}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {t("Extra row: label", c.event.entryLabel, (v) => up((d) => { d.event.entryLabel = v; }), 30, { optional: true, hint: "e.g. “Entry”. Empty label or value = row hidden." })}
          {t("Extra row: value", c.event.entryValue, (v) => up((d) => { d.event.entryValue = v; }), 80, { optional: true, hint: "e.g. “Free, open to the public”." })}
          {t("Calendar button", c.event.addToCalendar, (v) => up((d) => { d.event.addToCalendar = v; }), 40, { optional: true, hint: "Opens Google Calendar. Empty = hidden." })}
          {t("Directions button", c.event.directions, (v) => up((d) => { d.event.directions = v; }), 40, { optional: true, hint: "Only shown when a Google Maps link is set." })}
        </div>
        {t("Calendar event title", c.event.calendarTitle, (v) => up((d) => { d.event.calendarTitle = v; }), 120, { hint: "Also the event name in Google search results." })}
        {t("Calendar event notes", c.event.calendarDetails, (v) => up((d) => { d.event.calendarDetails = v; }), 500, { multiline: true, rows: 2, optional: true, hint: "The page link is added automatically." })}
      </>
    ),
    experience: (
      <>
        {t("Heading", c.experience.title, (v) => up((d) => { d.experience.title = v; }), 80, { required: true })}
        {t("Description", c.experience.desc, (v) => up((d) => { d.experience.desc = v; }), 320, { multiline: true, optional: true })}
        <RepeatList
          items={c.experience.items}
          onChange={(v) => up((d) => { d.experience.items = v; })}
          max={6}
          disabled={readOnly}
          addLabel="Add item"
          itemLabel={(i) => `Item ${String(i + 1).padStart(2, "0")}`}
          make={() => ({ title: "", desc: "", linkLabel: "", linkHref: "" })}
          render={(it, upd) => (
            <>
              <TextField label="Title" value={it.title} onChange={(v) => upd({ title: v })} max={80} facts={f} required />
              <TextField label="Text" value={it.desc} onChange={(v) => upd({ desc: v })} max={300} facts={f} multiline rows={2} optional />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Link text" value={it.linkLabel} onChange={(v) => upd({ linkLabel: v })} max={60} optional />
                <TextField label="Link to" value={it.linkHref} onChange={(v) => upd({ linkHref: v })} max={500} optional placeholder="/baas/ or https://…" hint="A page on this site (/baas/) or a full https:// link." />
              </div>
            </>
          )}
        />
      </>
    ),
    promo: (
      <>
        {t("Heading", c.promo.title, (v) => up((d) => { d.promo.title = v; }), 80, { required: true })}
        {t("Description", c.promo.desc, (v) => up((d) => { d.promo.desc = v; }), 320, { multiline: true, optional: true })}
        <RepeatList
          items={c.promo.items}
          onChange={(v) => up((d) => { d.promo.items = v; })}
          max={6}
          disabled={readOnly}
          addLabel="Add promotion"
          itemLabel={(i) => `Promotion ${i + 1}`}
          make={() => ({ title: "", desc: "" })}
          render={(it, upd) => (
            <>
              <TextField label="Title" value={it.title} onChange={(v) => upd({ title: v })} max={80} facts={f} required />
              <TextField label="Details" value={it.desc} onChange={(v) => upd({ desc: v })} max={300} facts={f} multiline rows={2} optional hint="Replace every [placeholder] with the real value." />
            </>
          )}
        />
        {t("Terms note", c.promo.terms, (v) => up((d) => { d.promo.terms = v; }), 400, { multiline: true, rows: 2, optional: true })}
        {t("Button", c.promo.cta, (v) => up((d) => { d.promo.cta = v; }), 40, { optional: true, hint: "Scrolls to the inquiry form. Empty = hidden." })}
      </>
    ),
    models: (
      <>
        {t("Heading", c.models.title, (v) => up((d) => { d.models.title = v; }), 80, { required: true })}
        {t("Description", c.models.desc, (v) => up((d) => { d.models.desc = v; }), 320, { multiline: true, optional: true })}
        {t("Link text under each model", c.models.detail, (v) => up((d) => { d.models.detail = v; }), 30, { optional: true })}
        <div className="grid gap-3 sm:grid-cols-2">
          {MODEL_KEYS.map((k) => (
            <TextField
              key={k}
              label={`${MODEL_CATALOG[k].name} tagline${s.models.includes(k) ? "" : " (hidden)"}`}
              value={c.models.taglines[k]}
              onChange={(v) => up((d) => { d.models.taglines[k] = v; })}
              max={60}
              optional
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Choose which models appear in Event & contact › Models shown.</p>
      </>
    ),
    inquiry: (
      <>
        {t("Heading", c.inquiry.title, (v) => up((d) => { d.inquiry.title = v; }), 80, { required: true })}
        {t("Description", c.inquiry.desc, (v) => up((d) => { d.inquiry.desc = v; }), 320, { multiline: true, optional: true })}
        <p className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          The form fields themselves (name, email, phone, topic, message) use the standard site form and are translated automatically.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {t("Side box heading", c.inquiry.directTitle, (v) => up((d) => { d.inquiry.directTitle = v; }), 80)}
          {t("Side box text", c.inquiry.directDesc, (v) => up((d) => { d.inquiry.directDesc = v; }), 200, { optional: true })}
          {t("WhatsApp link text", c.inquiry.whatsappLabel, (v) => up((d) => { d.inquiry.whatsappLabel = v; }), 40)}
          {t("Email label (screen readers)", c.inquiry.emailLabel, (v) => up((d) => { d.inquiry.emailLabel = v; }), 30)}
        </div>
        {t("Pre-filled WhatsApp message", c.inquiry.whatsappText, (v) => up((d) => { d.inquiry.whatsappText = v; }), 300, { multiline: true, rows: 2, optional: true, hint: "The text visitors see in WhatsApp when they tap the link." })}
      </>
    ),
    faq: (
      <>
        {t("Heading", c.faq.title, (v) => up((d) => { d.faq.title = v; }), 80, { required: true })}
        <RepeatList
          items={c.faq.items}
          onChange={(v) => up((d) => { d.faq.items = v; })}
          max={12}
          disabled={readOnly}
          addLabel="Add question"
          itemLabel={(i) => `Question ${i + 1}`}
          make={() => ({ q: "", a: "" })}
          render={(it, upd) => (
            <>
              <TextField label="Question" value={it.q} onChange={(v) => upd({ q: v })} max={200} facts={f} required />
              <TextField label="Answer" value={it.a} onChange={(v) => upd({ a: v })} max={800} facts={f} multiline rows={3} required />
            </>
          )}
        />
      </>
    ),
  };

  const issues = { id: issueCount("content.id."), en: issueCount("content.en.") };

  return (
    <fieldset disabled={readOnly} className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <LocaleSwitch value={locale} onChange={onLocale} issues={issues} />
        <p className="text-xs text-muted-foreground">Both languages are required: the site has /id and /en versions.</p>
      </div>
      <TokenHelp facts={f} />
      <Accordion type="multiple" value={open} onValueChange={setOpen} className="rounded-xl border border-border bg-card">
        {SECTIONS.map((sec) => {
          const n = issueCount(`content.${locale}.${sec.key}`);
          return (
            <AccordionItem key={sec.key} id={`teaser-sec-${sec.key}`} value={sec.key} className="scroll-mt-32 border-border px-4 last:border-b-0">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex flex-1 items-center gap-2 text-left">
                  <span className="font-medium">{sec.title}</span>
                  {n > 0 && <span className="rounded-full bg-chart-4/20 px-1.5 font-mono text-[10px]">{n}</span>}
                  <span className="hidden text-xs font-normal text-muted-foreground sm:inline">· {sec.where}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-5">
                {body[sec.key]}
                {!readOnly && (
                  <div className="flex justify-end">
                    <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setReset(sec.key)}>
                      <RotateCcw /> Reset this section to the template
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <ConfirmDialog
        open={!!reset}
        onOpenChange={(o) => !o && setReset(null)}
        title="Reset this section?"
        description={`The ${locale === "id" ? "Indonesian" : "English"} text of “${SECTIONS.find((x) => x.key === reset)?.title}” goes back to the template wording. Image descriptions are kept. Nothing is saved until you press Save.`}
        confirmLabel="Reset"
        destructive={false}
        onConfirm={() => {
          if (!reset) return;
          const key = reset;
          edit(locale, (d) => {
            const fresh = structuredClone(TEASER_TEMPLATE[locale][key]) as Record<string, unknown>;
            const current = d[key] as Record<string, unknown>;
            // Alt text gambar diatur di tab Images: jangan ikut ter-reset.
            for (const k of Object.keys(current)) if (k.toLowerCase().includes("alt")) fresh[k] = current[k];
            (d as Record<string, unknown>)[key] = fresh;
          });
          setReset(null);
        }}
      />
    </fieldset>
  );
}
