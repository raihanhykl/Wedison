# 00 — Wedison Redesign: Audit & Research Brief

> **Decision-ready synthesis** of six research streams (01 codebase audit · 02
> Impeccable principles + slop · 03 competitor teardown · 04 awwwards patterns ·
> 05 tech stack · 06 typography). This is the single source the Art Director and
> implementation team work from. Full detail lives in `01..06` alongside this file.
>
> **Project register:** *Brand* — this is a consumer EV landing site; the design
> *is* the product. Brand-register rules apply (committed color, fluid type,
> distinctive fonts, imagery-led), not product-register defaults.
>
> **Stack:** Next.js 15.5 (App Router, `/[locale]` = `id|en`), React 19, Tailwind
> v4 (CSS-first), shadcn/ui (new-york), TypeScript, `output: "standalone"` SSR on
> a Node VPS behind nginx. 69 `.tsx` files, 39 of them `"use client"`.
>
> **North-star goals (verbatim user intent):** escape AI-slop · ONE consistent
> design guideline across all pages · a non-generic, highly-readable brand font
> (NOT Geist/Inter/Roboto/Poppins/Montserrat) · mobile-first · interactive but
> light-speed fast · a consistent palette moving *away from green `#2bb075`* ·
> maintainable code · high PageSpeed · Awwwards-caliber result.

---

## 1. Current state — the 8 biggest problems

Ordered by leverage. Each is specific and file-referenced so it can be ticketed.

### P0 — Green `#2bb075` is structural, not just "the primary color"
The user's #1 dislike is entangled across the whole token layer, not isolated to one
variable.
- `globals.css:64` — `--primary: oklch(0.6731 0.1424 158.78)` = `#2bb075`, referenced
  **158×** as raw `var(--primary)` and **312×** total as `primary`.
- `globals.css:113–115` — `--border`/`--input`/`--ring` are hardcoded to a *different*
  teal (`oklch(0.7 0.14 182.5)`, hue 182) than primary (hue 158). So borders don't
  even match fills, **and the "neutrals" are themselves green.** `--muted`/`--accent`
  also sit on the hue-182 teal.
- Bypass carriers the token can't reach: ~9 hardcoded `teal-*` classes, every
  `to-teal-300` gradient endpoint, and a literal `#2BB075` JS gradient in
  `career/client.tsx`.
- The color strategy is currently **un-named** (neither cleanly Restrained nor
  Committed) — it is green-by-default, the exact thing the user wants gone.
- **Implication:** moving off green is a central token-layer job + a literal sweep, not
  a find-replace. Do it first; it unblocks everything else.

### P1 — Font is Geist: a banned, generic, brand-register miss
- `[locale]/layout.tsx:1,10–20` + `globals.css:9–11` — `Geist`/`Geist_Mono` wired to
  `--font-sans`. Geist is on the user's explicit ban list and is the canonical "modern
  AI geometric sans." No brand personality, no contrast-axis pairing, no metric-matched
  fallback → CLS risk. There is **no type scale** at all — every heading hand-rolls its
  own responsive ladder (home hero `text-3xl…xl:text-7xl`, product hero `text-4xl
  md:text-6xl`, etc.) and weights disagree (`font-bold/semibold/medium/[750]/[900]`).

### P1 — 18 gradient-text headings (absolute Impeccable ban + a green carrier)
`npx impeccable@latest detect src/ --json` → exit 2, **18 findings, all `gradient-text`.**
Concentrated in `corporate/about/structure.tsx` (×7), `corporate/contact` (×3),
`showroom/components/structure.tsx` (×3), plus `not-found.tsx`, `contact3.tsx`,
`footer.tsx`, `hero/HeroSlide.tsx`, `hero-section.tsx`. Every one is
`from-[var(--primary)]…to-teal-300` clipped to text — banned *and* a green carrier, so
fixing them serves two goals at once. Latent bug: `about/structure.tsx:71` uses
`bg-clip-text` **without** `text-transparent`, so it renders nothing.

### P1 — Motion is an accessibility and SSR liability
- **Zero `prefers-reduced-motion` coverage** in `src/**` (grep = 0). Global
  `html{scroll-behavior:smooth}` is unconditional; carousels, reveals, and
  `@keyframes progress` have no reduce alternative — an accessibility violation.
- **Scroll-reveals gate content visibility on a class transition** (`opacity-0
  translate-y-10` in 11 files) with **0 `IntersectionObserver`** — driven by state/timer
  flags. On a headless renderer or backgrounded tab the transition never fires and the
  section **ships blank** (SSR/SEO risk on this SSR build). It is also the uniform
  fade-rise-on-every-section reflex — the textbook AI-grammar tell.

### P1 — Image optimization is OFF (the biggest PageSpeed liability)
- `next.config.ts` — `images.unoptimized: true`, so every image ships full-res in its
  original format: no resize, no AVIF/WebP, no `srcset`. `sharp@0.34.5` is already
  installed; standalone uses it automatically.
- Aggravators: `width={9000}`/`quality={100}` hero `<Image>` calls; a raw `<img>` for
  the **LCP hero** in `hero-section.tsx`; and a **forced 2-second white preloader**
  (`Preloader.tsx`) that blocks perceived load, fighting "light-speed fast."

### P1 — Client-heavy architecture ships too much JS
- **39/69 components are `"use client"`.** The home page (`_home/landing.tsx`) is 100%
  client (two embla carousels, one autoplaying, + lazy comparison table) with near-zero
  static HTML. Navbar (643-line client mega-component, scroll listener) + Footer (client)
  wrap every page.
- A **2,942-line `"use client"` `translations.tsx` blob** ships **both** `id` + `en`
  dictionaries to the browser on every route, with no per-locale splitting. Pages that
  could be static (About/Contact/Showroom/FAQ) are client only because they call
  `useLanguage()` / `useInView()`.

### P1 — Hardcoded grays bypass tokens and fail contrast
- **185 hardcoded `text-gray-*`** classes; **68** of them are `gray-300/400/500` on
  white. `gray-400` ≈ 3.0:1 → **fails the 4.5:1 body minimum**; `gray-300` is far worse.
  Theming drift (they won't move with the new palette) + the "light gray for elegance"
  readability fail. Only **6 `aria-label`s in 69 files**; hand-rolled ojol/career dialogs
  lack `role="dialog"`, focus trap, and Esc handling despite `alert-dialog` being available.

### P2 — The "design system" is a graveyard of half-abandoned experiments
- `globals.css` opens with a 37-line fully commented-out `:root`, then a live `:root`
  where every color carries 2–3 commented predecessors (teal→emerald→green).
- **No spacing, shadow, or typography tokens** exist. Undefined utilities `shadow-soft`,
  `shadow-soft-lg`, `shadow-teal`, `animate-float`, `animate-slide-down` are used across
  About/Contact/Showroom but **defined nowhere** → every "elevated" card silently renders
  **flat**. Container patterns and max-widths drift (2400/2480/2486/2880). Dead `.dark`
  block exists with no theme toggle wired. Version-suffixed files (`contact3`,
  `language-toggle2`) signal abandoned predecessors.

> **Worth keeping (don't rebuild):** Tailwind v4 `@theme inline` token bridge · OKLCH
> authoring · clean locale routing + per-page `generateMetadata` + `sitemap`/`robots`/
> hreflang (SEO is a genuine strength) · shadcn primitives (button/card/dialog/accordion/
> form/select) · the thoughtful comparison table UX · data/content separation
> (`product-data`, `data-job`). The platform is sound; most perf wins are *config*, not
> rewrites.

---

## 2. Design principles we will adopt

Reconciling Impeccable rules (02) + awwwards patterns (04) + competitor insight (03).
The throughline across all award/premium references: **restraint, not variety, is the
premium tell** — a near-monochrome base, exactly ONE saturated accent, product-as-hero,
a strict two-font system, choreographed (not decorative) motion, and one token set so
every page reads as one guideline.

### Typography
- **Two-font system, max** (display + text), optional mono accent. Pair on a contrast
  axis (engineered display + humanist body) — never two similar geometric sans.
- **Fluid `clamp()` display scale**, ratio ≥1.25, **hero ceiling ≤ 6rem (~96px)** — cap
  the current `not-found.tsx:51 text-[12rem]` and `faq text-8xl`. Body stays fixed `rem`,
  ≥16px, in `rem` (respects zoom).
- **Cap body line-length at 65–75ch.** Add `text-wrap: balance` on h1–h3, `pretty` on
  prose. Hierarchy from size + weight + color + space combined, not size alone (~5 sizes).
- Display letter-spacing floor ≥ −0.04em. Tabular figures for all spec/price/range numbers.
- Metric-matched fallback + `font-display: swap`; preload only the above-fold weight.

### Color
- **OKLCH throughout** (already the case — keep it). Reduce chroma near white/black.
- **Pick a strategy first, then colors: Restrained-to-Committed** — a near-monochrome
  base (one ink/charcoal *or* one warm-white/editorial-light) + **exactly ONE saturated
  accent** used on CTAs, active states, and key data — almost nowhere else. Confine all
  saturation to that single accent; "dopamine"/high-saturation everywhere cheapens a
  vehicle brand.
- **Name a real reference before committing** (e.g. "Rimac teal-on-black restraint";
  "Rivian warm-premium without green"). Unnamed ambition decays to beige.
- **Two-layer tokens** (primitive `:root`/`.dark` → semantic `@theme inline` bridge).
  **Tinted neutrals**: push 0.005–0.015 chroma toward *this brand's* hue (pure gray is
  dead) — but avoid the cream/sand/beige warm-neutral that is the 2026 AI default, and
  avoid `--paper`/`--sand`/`--linen` token names (themselves tells).
- Contrast: body ≥4.5:1, large/UI ≥3:1. **Never gray text on a colored background.**
  Never convey meaning by color alone. Alpha-heavy overlays are a smell → define explicit
  overlay tokens.

### Spacing / layout
- **4pt base scale** (4/8/12/16/24/32/48/64/96) from a defined set — no arbitrary values.
  **Vary rhythm:** tight grouping (8–12px) + generous section separation (48–96px).
  Generous whitespace is a luxury signal.
- One container/grid primitive (consolidate the 4 competing patterns). Flexbox for 1D,
  Grid for 2D; responsive grids via `repeat(auto-fit, minmax(…,1fr))`. Use `gap`, not
  margins. Semantic z-index scale (never 999/9999). Touch targets ≥44×44px.
- **Bento grid** for the model lineup + a "why electric" feature cluster; allow
  *intentional* asymmetric breakouts on hero/story sections; full-bleed cinematic
  sections alternating with tight editorial columns.

### Motion
- **`prefers-reduced-motion` is non-negotiable** — one global `@media` block collapses
  durations and gates the smooth-scroll; reduced ≠ none (keep subtle fades, drop
  slide/zoom/parallax).
- **Reveals enhance an already-visible default** — content is visible in markup;
  IntersectionObserver (unobserve after fire) adds an `is-revealed` class. Never gate
  visibility on a class transition. **Vary** choreography per-section — kill the uniform
  fade-rise.
- Ease-out exponential curves (`expo (.16,1,.3,1)` / `quint` / `quart`). **No bounce/
  elastic.** Durations: 100–150ms feedback · 200–300ms state · 300–500ms layout ·
  500–800ms entrance; exits ~75% of entrance. Animate **transform/opacity only**
  (compositor) — never width/height/top/left/margin casually.
- **Cost hierarchy:** CSS transitions/keyframes → native **View Transitions API** (page
  nav, Baseline Oct 2025) → **Lenis** smooth-scroll (~4kb, biggest perceived-quality win)
  → Motion One / Framer **only behind `next/dynamic`** for the few signature moments.
  Reserve WebGL/Three.js for at most ONE hero moment, lazy-loaded with a static fallback.

### Interaction
- Design all **8 states** (default/hover/focus/active/disabled/loading/error/success);
  hover ≠ focus. **Never `outline:none` without a `:focus-visible` replacement** (2–3px
  ring, ≥3:1, offset). Fix the broken `button` outline hover (`hover:bg-background/90`).
- Visible `<label>`s (not placeholders); validate on blur; errors below field with
  `aria-describedby`. Consolidate the hand-rolled ojol/career dialogs onto `alert-dialog`
  (focus trap, role, Esc). Dropdowns via Popover/portal/fixed so they don't clip.

### Anti-AI craft markers (the user's core fear)
Real art-directed product photography (the single biggest anti-slop move) · one committed
color world + a distinctive licensed/non-default display font · intentional asymmetry and
variable-timing motion · a real bilingual editorial voice (not template filler) · spacing
rhythm + hover states everywhere as evidence of human decisions · performance as craft.
**Refuse the absolute bans:** gradient text, side-stripe borders, glass-by-default,
hero-metric template, identical card grids, per-section uppercase eyebrows, `01/02`
numbered markers, text overflow. (Baseline is good: the codebase already has zero
side-stripes, bounce, or numbered markers.)

---

## 3. Tech constraints & must-follow rules

Verified against nextjs.org / tailwindcss.com / web.dev (June 2026). Full detail in `05`.

**Fonts** — `next/font` only (self-hosts at build, zero third-party origin,
`adjustFontFallback` kills CLS). Variable font → **no `weight` array**; `display:'swap'`;
`subsets:['latin']` (Bahasa needs only basic Latin; add `latin-ext` only if EN/loanwords
need it). Define all faces in one `src/app/fonts.ts`; wire via `variable: '--font-*'` +
`@theme inline`; brand fonts go in the root layout (auto-preloaded all routes).

**Color / Tailwind v4 tokens** — Kill green. Two-layer OKLCH: semantic vars in
`:root`/`.dark`, bridge in **`@theme inline`** (required so dark-mode vars resolve — plain
`@theme` snapshots the value). Fix the `--border`/`--input`/`--ring` teal-vs-primary
mismatch. Delete ~130 lines of dead commented CSS + the dead `:root` block. Dark mode:
`@custom-variant dark (&:where(.dark, .dark *))` — the current `:is(.dark *)` excludes the
toggled element. Components use **semantic utilities only** (`bg-primary`,
`text-muted-foreground`), never raw hex/oklch inline.

**Images** — **Delete `unoptimized:true`.** Set `formats:["image/avif","image/webp"]`
(AVIF first), high `minimumCacheTTL` (~31d), whitelist `qualities:[60,75,90]`, set
`remotePatterns`. Convert the raw `<img>` LCP hero to `next/image` + `priority` (one per
page). **`sizes` mandatory on every `fill`.** `placeholder="blur"` (static imports auto;
remote needs `blurDataURL`). Prefer static imports (content hash + immutable cache). Drop
`quality=100`/`width=9000`. Ensure `.next/cache` is writable for the optimizer.

**Performance** — Targets **LCP ≤2.5s · CLS ≤0.1 · INP ≤200ms.** RSC by default;
`"use client"` only on interactive leaves (navbar, language toggle, carousel, contact
form). `next/dynamic` (`ssr:false`) for form/recaptcha/comparison-table. **Drop one of two
carousel libs** (embla + keen-slider both installed). `content-visibility:auto` on long
off-screen sections (FAQ, media grid). Split translations per-locale. Kill the 2s
preloader. Keep the hero server-rendered.

**Caching** — Marketing pages stay **static prerender** (Next 15 caches less by default;
**do not** sprinkle `force-dynamic`). nginx: immutable `/_next/static/`; **forward the
`Accept` header to `/_next/image`** (else AVIF/WebP negotiation breaks behind the proxy);
30d on `/public`; enable gzip/brotli on text. Opt *into* data caching explicitly
(`revalidate`/tags) only when a CMS lands.

**Motion** — CSS transform/opacity first; native `@view-transition` for nav; Motion
One/Framer only behind `next/dynamic`; gate global smooth-scroll behind
`prefers-reduced-motion: no-preference`.

---

## 4. Brand-font shortlist (top 3)

All variable, all loadable without a third-party runtime origin, all clear the ban list.
Concentrate personality in headings/numerals, keep paragraphs maximally readable.

1. **Space Grotesk (display) + Hanken Grotesk (text) + Space/Martian Mono (accent)** —
   **TOP PICK.** Space Grotesk's monospace-derived, engineered character reads as
   *precision instrumentation* (battery %, range, kW) — a near-perfect metaphor for an
   electric brand, distinctive and Awwwards-credible without the geometric-roundness
   cliché. Hanken Grotesk is the strongest free screen-body grotesk (open apertures, warm,
   Bahasa-legible). All three OFL, all `next/font/google` (self-hosted at build), all
   variable, all with tabular figures. Role map: `--font-display` = Space Grotesk (H1–H3,
   hero, stat numerals, CTA labels); `--font-sans` = Hanken Grotesk (all body/UI);
   `--font-mono` = Space/Martian Mono (spec tables, kW/Wh/km, sparingly).
   - *Risk:* Space Grotesk headlines can feel quirky on corporate/B2B pages → see #2.

2. **Schibsted Grotesk (single OFL superfamily, display → body in one variable file)** —
   **SAFE SECOND.** One family, zero pairing risk — directly serves "one consistent design
   guideline," least to maintain. Premium, Scandi, digital-first, fresh/under-used. Slightly
   less electric character in headlines than Space Grotesk. **Decision rule:** start with
   #1; if QA finds Space Grotesk too techy for career/media/B2B, fall back to Schibsted —
   a low-cost `@theme` token swap (same OFL/variable/`next/font/google` profile).

3. **Clash Display + General Sans (Fontshare/ITF, FFL, self-host via `next/font/local`)** —
   Futuristic small-aperture display + neutral text workhorse, cohesive same-foundry
   pairing; great for EV product names (Athena/Bees/Victory). FFL is permissive (free
   commercial, self-host fine) but **not OFL** — files can't be redistributed and aren't on
   Google's CDN, so slightly more setup. Choose only if the ITF look is specifically wanted.

> **Explicitly avoid as headline face:** Bricolage Grotesque — high quality but now the
> single most over-deployed "designer" font on SaaS landings; it undercuts the
> "non-generic" goal. Backup display only.
> **Mono note:** use mono as a functional *accent* only (spec/kW/Wh figures), never a
> primary face. (Geist Mono is banned by association.)

---

## 5. Color strategy options (NON-green) — three territories for the Art Director

**The single most important finding from competitor research (03):** green/mint/lime is the
*category default cliché* — Ola `#16AA51`, Cake `#42BA7F`, Alva mint `#33FFC9`, Volta lime
`#BCF164`, Electrum teal `#40C0C0`, and Wedison's own `#2bb075` all live in the same family.
**Moving off green is the single clearest differentiation lever available.** Nobody local
owns a calm, premium "energy/electricity" aesthetic — that is Wedison's open lane, and the
**Wedison → Edison** equity (light · filament/glow · voltage · spark/bolt) gives an ownable
system with nothing to do with green leaves.

Each territory below is a *Restrained-to-Committed strategy*: near-monochrome base + ONE
saturated accent. Author in OKLCH; reduce chroma near white/black; tint neutrals toward the
chosen hue.

### Territory A — "Filament / Tungsten": warm amber-gold accent on ink/charcoal + warm-white
**The lead recommendation (04).** Edison's incandescent filament made literal. A single warm
amber accent (~`oklch(0.86 0.17 95)`, e.g. `#E8A23D`/`#F2B544`) on a charcoal/ink base with a
warm-white editorial body; everything else is ink + paper + 3–4 neutral grays.
- *Why:* most ownable (ties directly to the Edison story), warmest/most premium, and
  **maximally differentiated** from both the old green and the blue-heavy Indonesian set
  (Electrum/Alva/Volta). Echoes Rivian's proof that "clean/sustainable" can be warm, not
  cold-tech, without going green. Named reference: *Rivian warm-premium without green.*
- *Watch:* keep the warm neutrals from drifting into the cream/sand/beige AI-default —
  push the base toward true charcoal/ink, not latte.

### Territory B — "Voltage": single electric blue/cyan accent on near-black (cinematic)
Reads as energy, charging, tech, premium EV — closest to Rimac's strategy but a committed
blue/cyan (pick ONE: an electric blue ~`oklch(0.62 0.20 264)` *or* a cyan `#19B6FF`) so it
never drifts back toward green. Base `#0A0A0B`→`#121214`, warm-white paper, accent on CTAs/
active/key data only.
- *Why:* proven "energy" aesthetic (Gogoro electric-blue-on-black, Rimac teal-on-black);
  dark-canvas confidence = perceived premium via subtraction. Named reference: *Gogoro/Rimac
  dark cinematic, one accent.*
- *Watch:* Electrum already owns navy/blue locally and Gogoro owns electric-blue globally —
  push toward a distinctive cyan/indigo and a darker, more cinematic base to avoid reading as
  "Electrum-adjacent."

### Territory C — "Spark / Indigo-Volt": electric indigo primary + a restrained voltage-amber as the rare second accent
A two-accent variant for a more expressive consumer feel: electric indigo
(~`oklch(0.62 0.20 264)`) as the brand color carrying CTAs, with a voltage-amber
(~`oklch(0.86 0.17 95)`) used *very* sparingly for energy/charging highlights and data.
Near-monochrome ink/paper base underneath.
- *Why:* keeps a confident modern-tech primary while the amber spark nods to the
  filament/electricity story — distinctive without going full dark-cinematic; flexible across
  consumer + B2B + corporate.
- *Watch:* discipline is everything — amber must stay ≤10% or this collapses into a
  full-palette look. If in doubt, drop to one accent (Territory A or B).

> **Recommendation to the Art Director:** explore **A first** (most ownable, most
> differentiated, strongest brand story), with **B** as the cinematic alternative and **C**
> as the more expressive consumer hybrid. Whichever wins, it must be the *only* saturated
> color, defined once in the Tailwind v4 `@theme` tokens — consistency across consumer, B2B,
> and corporate pages is itself the premium signal.

---

## 6. Section take-out / add recommendations (EV-motorcycle site)

Inventory and structure derived from 01 (per-page sections) and 03/04 (best-in-class patterns).

### Remove / fix
- **Carousel heroes → kill.** Replace home + ojol carousel heroes with one giant headline +
  a single floating product on a near-monochrome set (Ather/Gogoro template) — premium via
  subtraction, and faster. (03/04)
- **The 2-second preloader → delete.** It actively fights "light-speed fast." (01/05)
- **All 18 gradient-text headings → solid color** (emphasis via weight/size). (02)
- **Hand-rolled ojol/career/campaign dialogs → shadcn `alert-dialog`** (focus trap, role,
  Esc, a11y). (01)
- **Undefined `shadow-soft*` utilities → define real shadow tokens** (or remove). (01)
- **Per-section uppercase eyebrow pills** (ojol) and any drift toward eyebrow-on-every-section
  → one named kicker max. (02)
- **Placeholder content** still live: "123 Electric Avenue, San Francisco" map link in
  `corporate/contact`. Replace with real locations. (01)

### Keep (retokenize only)
- The **comparison table** UX (mobile horizontal-scroll vs desktop grid, expand/collapse,
  primary-bike highlight) — genuinely good; just swap the green tokens. (01)
- Per-page SEO scaffolding, locale routing, product-data/data-job separation. (01)

### Add (award-grade differentiators)
- **One signature hero moment** — a single scroll-reveal or a lazy-loaded 360°/explode
  sequence of the bike, with a static fallback + `prefers-reduced-motion`. (04)
- **Bento model-lineup section** (Athena/Bees/Victory/EDPower) with hover reveals + animated
  tabular spec counters (range, top speed, charge time). (04)
- **Use-case / model-line nav IA** segmenting the lineup — **Commute** (Athena/Bees) ·
  **Performance** (Victory) · **Fleet/Ojol** (B2B) · **EDPower** — à la Cake/Zero, fitting
  the consumer + B2B split and replacing the route-coupled navbar logic. (03)
- **"Build your Wedison" configurator** — color/spec/accessory live preview with live pricing
  (Zero/Tesla pattern) — a real award + conversion differentiator and a foundation for the
  brand's e-commerce future. (03/04)
- **SuperCharge ecosystem story** (bike + charging network + app) told like Electrum but with
  far more restraint — Wedison's unique B2B + network angle. (03)
- **Seamless route transitions** via the native View Transitions API for app-like model→model
  browsing. (04/05)
- **Real, art-directed product photography** shot like jewelry on a near-monochrome set — the
  single biggest anti-AI-slop investment, more impactful than any code. (04)

---

## 7. Open questions for the user

1. **Color direction (Section 5):** Filament-amber (A), Voltage-blue/cyan (B), or
   Indigo-Volt hybrid (C)? And the overall mode — **dark-cinematic**, **editorial-light**, or
   a **dark-hero + light-body hybrid** (all share one token set either way)?
2. **Font:** approve **Space Grotesk + Hanken Grotesk** (top pick), or prefer the safer
   single-family **Schibsted Grotesk**? Any appetite for a licensed/Fontshare display
   (Clash) over OFL?
3. **Photography budget:** is real art-directed product photography of Athena/Bees/Victory
   available or commissionable? This is the #1 anti-AI lever — if not, what's the fallback
   (studio 3D renders)?
4. **Configurator scope:** is a "Build your Wedison" configurator in scope for this redesign,
   or a later phase? It's the biggest award/conversion differentiator but the largest build.
5. **Dark mode:** ship a real light/dark toggle (next-themes is installed), or commit to a
   single committed mode? The dead `.dark` block must be either wired or deleted.
6. **Nav IA change:** OK to restructure navigation by **use-case/line** (Commute · Performance
   · Fleet/Ojol · EDPower) rather than the current page-coupled structure?
7. **Brand mark:** appetite for leaning into a **lightning/bolt or filament** mark to cement
   the Edison/electricity equity (Super73-style), and is logo work in scope?
8. **Motion ceiling:** how far on signature motion — native CSS + View Transitions + Lenis
   only (safest for PageSpeed), or budget for one WebGL/Three.js hero moment?
9. **Translations refactor:** OK to split the 2,942-line client `translations.tsx` per-locale
   and move static pages server-side (touches most pages but is the core perf + INP win)?
10. **Existing green:** fully retire `#2bb075`, or retain it only as a tertiary chart/data
    color in deep spec views?
```
