import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { localizeHref } from "@/lib/teasers/teaser";
import type { TeaserView } from "./view";

export default function TeaserExperience({ v }: { v: TeaserView }) {
  const { c, images, locale } = v;
  const x = c.experience;
  const items = x.items.filter((i) => i.title);

  return (
    <section id="teaser-experience" aria-labelledby="teaser-experience-title" className="bg-muted py-16 sm:py-24">
      <div id="teaser-experience-container" className="main-container grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <Reveal y={0} id="teaser-experience-media" className="lg:sticky lg:top-28 lg:self-start">
          <div id="teaser-experience-media-frame" className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-200">
            <Image
              id="teaser-experience-image-main"
              src={images.experienceMain}
              alt={x.imageMainAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div id="teaser-experience-body">
          <Reveal id="teaser-experience-heading">
            <h2 id="teaser-experience-title" className="max-w-[16ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {x.title}
            </h2>
            {x.desc && (
              <p id="teaser-experience-desc" className="mt-4 max-w-[52ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {x.desc}
              </p>
            )}
          </Reveal>

          {items.length > 0 && (
            <ol id="teaser-experience-list" className="mt-10 border-t border-border">
              {items.map((it, i) => {
                const n = i + 1;
                const href = localizeHref(it.linkHref, locale);
                const external = /^https?:\/\//.test(href);
                return (
                  <li
                    key={n}
                    id={`teaser-experience-item-${n}`}
                    className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-border py-6 sm:grid-cols-[3.5rem_1fr]"
                  >
                    <span id={`teaser-experience-item-${n}-number`} aria-hidden className="font-mono text-sm text-primary">
                      {String(n).padStart(2, "0")}
                    </span>
                    <div id={`teaser-experience-item-${n}-body`}>
                      <h3 id={`teaser-experience-item-${n}-title`} className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        {it.title}
                      </h3>
                      {it.desc && (
                        <p id={`teaser-experience-item-${n}-desc`} className="mt-1.5 max-w-[56ch] text-pretty text-base leading-relaxed text-muted-foreground">
                          {it.desc}
                        </p>
                      )}
                      {href && it.linkLabel && (
                        <Link
                          id={`teaser-experience-item-${n}-link`}
                          href={href}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                        >
                          {it.linkLabel}
                          {external ? (
                            <ArrowUpRight id={`teaser-experience-item-${n}-link-icon`} aria-hidden className="h-4 w-4" />
                          ) : (
                            <ArrowRight id={`teaser-experience-item-${n}-link-icon`} aria-hidden className="h-4 w-4" />
                          )}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <Reveal y={0} id="teaser-experience-lounge" className="relative mt-10 aspect-[3/2] overflow-hidden rounded-2xl bg-neutral-200">
            <Image
              id="teaser-experience-image-lounge"
              src={images.experienceLounge}
              alt={x.imageLoungeAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
