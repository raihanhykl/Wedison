import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArtDirectedImage } from "@/components/art-directed-image";
import { Countdown } from "./countdown";
import type { TeaserView } from "./view";

export default function TeaserHero({ v }: { v: TeaserView }) {
  const { c, facts, teaser, images } = v;

  return (
    <section
      id="teaser-hero"
      aria-labelledby="teaser-hero-title"
      data-nav-tone="dark"
      className="relative min-h-[100svh] w-full overflow-hidden bg-forest-deep"
    >
      <div id="teaser-hero-media" className="absolute inset-0">
        <ArtDirectedImage
          desktop={images.heroDesktop}
          mobile={images.heroMobile}
          alt={c.hero.imageAlt}
          priority
          className="object-cover"
        />
      </div>
      {/* Scrim: kuat di bawah (teks), tipis di atas (navbar) */}
      <div id="teaser-hero-scrim" aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

      <div id="teaser-hero-content" className="relative flex min-h-[100svh] flex-col justify-end pb-16 pt-32 sm:pb-20">
        <div id="teaser-hero-container" className="main-container">
          {c.hero.eyebrow && (
            <p id="teaser-hero-eyebrow" className="font-mono text-xs uppercase tracking-[0.22em] text-on-forest-accent">
              {c.hero.eyebrow}
            </p>
          )}
          <h1
            id="teaser-hero-title"
            className="mt-4 max-w-[18ch] text-balance font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {c.hero.title}
          </h1>
          <p id="teaser-hero-desc" className="mt-5 max-w-[54ch] text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
            {c.hero.desc}
          </p>
          <p id="teaser-hero-date" className="mt-6 text-base font-semibold text-white sm:text-lg">
            <time id="teaser-hero-date-time" dateTime={teaser.startAt}>
              {facts.date} · {facts.time}
            </time>
          </p>

          <div id="teaser-hero-actions" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
              <a id="teaser-hero-cta-inquiry" href="#teaser-inquiry">
                {c.hero.ctaPrimary}
              </a>
            </Button>
            {c.hero.ctaSecondary && (
              <Button asChild size="lg" className="border border-white/40 bg-white/10 text-white hover:bg-white/20">
                <a id="teaser-hero-cta-promo" href="#teaser-promo">
                  {c.hero.ctaSecondary}
                </a>
              </Button>
            )}
          </div>

          {teaser.showCountdown && (
            <div id="teaser-hero-countdown" className="mt-10 border-t border-white/20 pt-6">
              <Countdown target={teaser.startAt} labels={c.countdown} />
            </div>
          )}
        </div>
      </div>
      <ChevronDown
        id="teaser-hero-scroll-hint"
        aria-hidden
        className="absolute bottom-5 left-1/2 hidden h-6 w-6 -translate-x-1/2 animate-float text-white/60 lg:block"
      />
    </section>
  );
}
