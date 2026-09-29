# Ather Playbook → Wedison (ATM)

> Observed from atherenergy.com (Next.js + Swiper; **no GSAP/Lenis/canvas** — motion is CSS +
> IntersectionObserver + sticky + Swiper). We imitate **layout, motion, image placement, section
> rhythm** — NOT brand identity. Keep Wedison's green Sage+Ink palette, Schibsted/Hanken, our menu, our assets.

## Motion principles (lightweight, fast)
- **Scroll reveal:** sections fade + rise (~16px, 600–700ms, ease-out expo) as they enter the viewport,
  via `IntersectionObserver` (`<Reveal>` primitive). Reduced-motion → instant. Above-fold reveals fire immediately.
- **Sticky:** nav sticks; a quick-action bar sticks under the hero; product media can sticky-pin while text scrolls.
- **Carousels:** embla (already a dep) for the cinematic hero + any sliders.
- **Hover:** image scale 1.03–1.05, card lift, arrow nudge. Transform/opacity only.

## Homepage section rhythm (Ather → Wedison)
1. **Cinematic hero carousel** — full-bleed `*-landing-hero.webp` per model, dark gradient for legibility,
   centered model name + tagline + CTA, slide dots, autoplay. Bottom **value-prop strip** (4 quick props).
2. **Sticky quick-action bar** — Test Ride · Bandingkan Model · SuperCharge · Showroom (icon + label + chevron).
3. **"Keluarga Listrik Wedison"** — centered header + **immersive model cards** (2×2): full-bleed lifestyle
   photo, model name + use-case pill overlaid, hover zoom, CTA. (Ather's "Electric Family".)
4. **SuperCharge spotlight** — forest band, statement + pill CTA (Ather's centered product spotlight, our brand).
5. **"Keunggulan Wedison"** — pill eyebrow + 2-line headline + **4 image-overlay advantage cards**
   (jaringan SuperCharge · garansi baterai · hemat biaya · layanan & showroom).
6. **"Lanjut Jelajahi"** — 4 **icon-top utility cards** (Showroom · Bandingkan · SuperCharge · Media/Karir).
7. **Comparison table** (kept, retokenized).
8. **App teaser** + mega footer.

## Product pages (Ather 450/Rizta → athena/bees/victory/edpower) — for Phase 4d
- Sticky model sub-nav with price + "Book" CTA.
- Hero: full-bleed bike + name + key stats.
- **Sticky-pinned feature sections:** media sticks while feature copy scrolls (battery, motor, smart, safety).
- Spec block with elegant tabular numbers (Martian Mono).
- Colorway switcher (ties into "Build your Wedison").

## Components to build (reusable)
- `Reveal` (IO fade-up) — done.
- `HeroCarousel`, `StickyActionBar`, `ImmersiveCard`, `AdvantageCard`, `ExploreCard` — compose in landing + reuse on other pages.
