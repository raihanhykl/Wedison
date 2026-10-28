import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { MODEL_CATALOG } from "@/lib/teasers/teaser";
import type { TeaserView } from "./view";

export default function TeaserModels({ v }: { v: TeaserView }) {
  const { c, teaser, locale } = v;
  const m = c.models;
  if (!teaser.models.length) return null;
  const altPrefix = locale === "en" ? "Wedison electric motorcycle" : "Motor listrik Wedison";

  return (
    <section id="teaser-models" aria-labelledby="teaser-models-title" className="py-16 sm:py-24">
      <div id="teaser-models-container" className="main-container">
        <Reveal id="teaser-models-heading">
          <h2 id="teaser-models-title" className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {m.title}
          </h2>
          {m.desc && (
            <p id="teaser-models-desc" className="mt-4 max-w-[52ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {m.desc}
            </p>
          )}
        </Reveal>

        <ul id="teaser-models-list" className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {teaser.models.map((key) => {
            const model = MODEL_CATALOG[key];
            if (!model) return null;
            return (
              <li key={key} id={`teaser-models-item-${key}`}>
                <Link id={`teaser-models-link-${key}`} href={`/${locale}${model.href}`} className="group block">
                  <span id={`teaser-models-media-${key}`} className="relative block aspect-square overflow-hidden rounded-2xl bg-card">
                    <Image
                      id={`teaser-models-image-${key}`}
                      src={model.image}
                      alt={`${altPrefix} ${model.name}`}
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </span>
                  <span id={`teaser-models-name-${key}`} className="mt-4 block font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {model.name}
                  </span>
                  {m.taglines[key] && (
                    <span id={`teaser-models-tagline-${key}`} className="mt-1 block text-sm text-muted-foreground sm:text-base">
                      {m.taglines[key]}
                    </span>
                  )}
                  {m.detail && (
                    <span id={`teaser-models-cta-${key}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      {m.detail}
                      <span id={`teaser-models-cta-${key}-name`} className="sr-only"> {model.name}</span>
                      <ArrowRight id={`teaser-models-cta-${key}-icon`} aria-hidden className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
