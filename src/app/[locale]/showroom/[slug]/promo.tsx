import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import type { TeaserView } from "./view";

export default function TeaserPromo({ v }: { v: TeaserView }) {
  const { c, images } = v;
  const p = c.promo;
  const items = p.items.filter((i) => i.title);

  return (
    <section
      id="teaser-promo"
      aria-labelledby="teaser-promo-title"
      data-nav-tone="dark"
      className="scroll-mt-24 bg-forest-deep py-16 text-forest-foreground sm:py-24"
    >
      <div id="teaser-promo-container" className="main-container grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
        <div id="teaser-promo-body">
          <Reveal id="teaser-promo-heading">
            <h2 id="teaser-promo-title" className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {p.title}
            </h2>
            {p.desc && (
              <p id="teaser-promo-desc" className="mt-4 max-w-[50ch] text-pretty text-base leading-relaxed text-forest-muted sm:text-lg">
                {p.desc}
              </p>
            )}
          </Reveal>

          <ol id="teaser-promo-list" className="mt-10 border-t border-white/15">
            {items.map((it, i) => (
              <li
                key={i}
                id={`teaser-promo-item-${i + 1}`}
                className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-white/15 py-6 sm:grid-cols-[3.5rem_1fr]"
              >
                <span id={`teaser-promo-item-${i + 1}-number`} aria-hidden className="font-mono text-sm text-on-forest-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div id={`teaser-promo-item-${i + 1}-body`}>
                  <h3 id={`teaser-promo-item-${i + 1}-title`} className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {it.title}
                  </h3>
                  {it.desc && (
                    <p id={`teaser-promo-item-${i + 1}-desc`} className="mt-1.5 max-w-[56ch] text-pretty text-base leading-relaxed text-forest-muted">
                      {it.desc}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {p.terms && (
            <p id="teaser-promo-terms" className="mt-6 max-w-[60ch] text-sm leading-relaxed text-forest-muted">
              {p.terms}
            </p>
          )}
          {p.cta && (
            <Button asChild size="lg" className="mt-8 bg-white text-foreground hover:bg-white/90">
              <a id="teaser-promo-cta" href="#teaser-inquiry">
                {p.cta}
              </a>
            </Button>
          )}
        </div>

        <Reveal y={0} id="teaser-promo-media" className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-forest">
          <Image
            id="teaser-promo-image"
            src={images.promo}
            alt={p.imageAlt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
