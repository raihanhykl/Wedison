import Image from "next/image";
import { ArrowUpRight, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { localeUrl } from "@/lib/seo/site";
import { googleCalendarUrl } from "@/lib/teasers/teaser";
import type { TeaserView } from "./view";

export default function TeaserEvent({ v }: { v: TeaserView }) {
  const { c, facts, teaser, images, locale } = v;
  const e = c.event;
  const pageUrl = localeUrl(locale, `/showroom/${teaser.slug}`);
  const rows = [
    { key: "date", label: e.dateLabel, value: <time id="teaser-event-date-time" dateTime={teaser.startAt}>{facts.date}</time> },
    { key: "time", label: e.timeLabel, value: facts.time },
    {
      key: "location",
      label: e.locationLabel,
      value: (
        <address id="teaser-event-address" className="not-italic">
          <span id="teaser-event-address-name" className="block font-semibold">{teaser.showroomName}</span>
          {facts.address}
        </address>
      ),
    },
    ...(e.entryLabel && e.entryValue ? [{ key: "entry", label: e.entryLabel, value: e.entryValue }] : []),
  ];

  return (
    <section id="teaser-event" aria-labelledby="teaser-event-title" className="scroll-mt-24 py-16 sm:py-24">
      <div id="teaser-event-container" className="main-container grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
        <Reveal y={0} id="teaser-event-media" className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          <Image
            id="teaser-event-image"
            src={images.event}
            alt={e.imageAlt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <div id="teaser-event-body">
          <Reveal id="teaser-event-heading">
            <h2 id="teaser-event-title" className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {e.title}
            </h2>
            {e.desc && (
              <p id="teaser-event-desc" className="mt-4 max-w-[48ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {e.desc}
              </p>
            )}
          </Reveal>

          <dl id="teaser-event-details" className="mt-8 border-t border-border">
            {rows.map((r) => (
              <div
                key={r.key}
                id={`teaser-event-${r.key}`}
                className="grid grid-cols-1 gap-1 border-b border-border py-4 sm:grid-cols-[8rem_1fr] sm:gap-4"
              >
                <dt id={`teaser-event-${r.key}-label`} className="text-sm text-muted-foreground">
                  {r.label}
                </dt>
                <dd id={`teaser-event-${r.key}-value`} className="text-foreground">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>

          <div id="teaser-event-actions" className="mt-8 flex flex-col gap-3 sm:flex-row">
            {e.addToCalendar && (
              <Button asChild size="lg">
                <a
                  id="teaser-event-add-calendar"
                  href={googleCalendarUrl(teaser, e.calendarTitle, [e.calendarDetails, pageUrl].filter(Boolean).join("\n"))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CalendarPlus id="teaser-event-add-calendar-icon" aria-hidden />
                  {e.addToCalendar}
                </a>
              </Button>
            )}
            {teaser.mapsUrl && e.directions && (
              <Button asChild size="lg" variant="outline">
                <a id="teaser-event-directions" href={teaser.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {e.directions}
                  <ArrowUpRight id="teaser-event-directions-icon" aria-hidden />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
