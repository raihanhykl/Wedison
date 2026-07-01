# Wedison — Art Direction: 3 Design Directions

> Source brief: `docs/redesign/research/00-brief.md`. Three genuinely distinct directions
> (not variations of one idea). Each is production-ready: real hex + OKLCH, real loadable
> fonts (no Geist/Inter/Roboto/Poppins/Montserrat), one committed accent, motion that stays
> fast. Author all color in OKLCH and bridge through Tailwind v4 `@theme inline`.
>
> Non-negotiables honored in all three: **no green as primary** (retire `#2bb075`), one
> saturated accent, near-monochrome base, tinted (not dead-gray) neutrals, body contrast
> ≥4.5:1, two-font max, `prefers-reduced-motion` gating, image optimization ON.

---

## How to read this

Each direction names a **real reference** (the brief warns: "unnamed ambition decays to
beige"), commits to **one accent hue**, and gives a full token table mapping to the existing
semantic names already wired in `globals.css` `@theme inline` (`background/foreground/
primary/accent/muted/border/...`) so implementation is a token swap, not a rewrite.

The codebase already ships the assets these directions need: Bees photographed in **red,
grey, black, white, green and smoke** colorways on clean sets (`public/bees/*`), plus
Athena/Victory/EDPower/SuperCharge folders. That means the "single floating product on a
near-monochrome set" hero and a "Build your Wedison" colorway switcher are achievable with
existing photography — no new shoot required to ship v1.

---

## Direction 1 — "FILAMENT" (RECOMMENDED)

**Personality:** Warm, premium, ownable.
**Theme:** dark-led with a warm-white editorial body (dark hero, light long-form).
**Reference:** *Rivian warm-premium without green* — Rivian replaced the cold-blue CTA with a
warm amber that "evokes campfire and sunrise" on a charcoal/black base (Solar Yellow `#ffac00`,
Charcoal `#212121`). We do the same but tie it to **Edison's incandescent filament**: the amber
*is* the glowing tungsten. ([Rivian design system](https://styles.refero.design/style/a5dc5626-1103-42e3-9edb-a6d52fb9a210), [Blake Crosley teardown](https://blakecrosley.com/guides/design/rivian))

**Why it wins for Wedison.** It is the single most *ownable* and *differentiated* option. Every
local competitor lives in green or blue — Ola `#16AA51`, Cake `#42BA7F`, Electrum teal/navy,
Alva mint, Volta lime, and Wedison's own `#2bb075`. A warm amber-gold filament world is in *no
one's* lane locally, it maps directly to the Wedison→Edison brand equity (light, glow, voltage),
and warm-on-charcoal photographs the existing matte-black/grey Bees images beautifully. It proves
"clean energy" can be warm rather than cold-tech — without a single green leaf.

### Palette — "Filament / Tungsten"

| Role (token) | Name | Hex | OKLCH | Usage |
|---|---|---|---|---|
| `--background` | Ink | `#0E0E10` | `oklch(0.16 0.004 60)` | dark hero/cinematic sections, footer |
| `--foreground` | Warm white | `#F4F1EC` | `oklch(0.955 0.006 80)` | text on ink |
| `--card` | Charcoal | `#1A1A1D` | `oklch(0.22 0.005 60)` | elevated dark surfaces |
| `--secondary` (light body) | Bone | `#FAF8F4` | `oklch(0.98 0.005 85)` | warm-white editorial body bg (NOT cream/beige) |
| `--primary` | Filament amber | `#F0A92C` | `oklch(0.80 0.155 75)` | CTAs, active states, key data — the ONLY saturated color |
| `--primary-foreground` | Ink | `#141416` | `oklch(0.18 0.004 60)` | text/icon on amber |
| `--muted-foreground` | Tungsten grey | `#9A958C` | `oklch(0.66 0.007 80)` | secondary text (≥4.5:1 on both bg's) |
| `--border` | Hairline | `#2A2A2E` / `#E7E3DB` | `oklch(0.27 0.004 60)` / `oklch(0.92 0.005 85)` | dark / light borders — tinted, matched to surface |
| `--accent` (glow) | Ember | `#C8741A` | `oklch(0.63 0.13 55)` | rare hover/charging-state deepening of amber |
| `--destructive` | Signal red | `#E5484D` | `oklch(0.63 0.21 25)` | errors only |

Neutrals are tinted ~0.004–0.007 chroma toward hue 60–85 (warm) so nothing reads as dead gray,
but the base is pushed to true **ink/charcoal**, never latte — the brief's explicit warning
against the cream/sand/beige AI-default. Fixes the current `--border`/`--input`/`--ring` hue-182
teal mismatch by matching them to surface.

### Typography
**Display:** Space Grotesk · **Text:** Hanken Grotesk · **Mono:** Space Mono — all OFL, all
`next/font/google`, all variable, self-hosted at build (zero third-party origin), all with
tabular figures. Space Grotesk's monospace-derived, engineered character reads as *precision
instrumentation* — battery %, range km, kW — the perfect metaphor for an electric brand and
distinctly non-generic without the geometric-roundness cliché. Hanken Grotesk is the strongest
free screen body grotesk (open apertures, warm, fully Bahasa-legible). Space Mono carries spec
tables and kW/Wh/km figures only, sparingly.

> **Fallback rule:** if QA finds Space Grotesk too techy on corporate/career/B2B pages, swap
> display to **Schibsted Grotesk** — a zero-risk single-family `@theme` token change (same OFL/
> variable/`next/font/google` profile). This is the bridge to Direction 2.

### Motion & signature
Ember-glow CTAs that warm on hover (200–300ms, ease-out expo, transform/opacity only). One
signature hero moment: the bike lit by a single warm key-light that "ignites" on scroll-in
(opacity + slight scale, IntersectionObserver, unobserve after fire, static fallback under
`prefers-reduced-motion`). Animated **tabular spec counters** (range / top speed / charge time)
in Space Mono. Native View Transitions for model→model nav.

### Best for
The default. Maximum brand ownership and differentiation; warmest, most premium read; strongest
Edison story; lowest risk because the existing product photography already suits warm-on-dark.

---

## Direction 2 — "VOLTAGE" (cinematic alternative)

**Personality:** Cinematic, confident, electric.
**Theme:** dark-led, near-black canvas throughout (committed single mode).
**Reference:** *Gogoro / Rimac — dark cinematic, one accent.* Gogoro's site wakes the eye with
white-on-electric-blue and crisp story animations; Rimac runs a single teal accent on black.
We commit to a **distinctive cyan-leaning electric blue** (not Electrum's navy, not Gogoro's
exact royal blue) on a deep cinematic black. ([Gogoro](https://www.gogoro.com/), [DesignRush teardown](https://www.designrush.com/best-designs/websites/gogoro))

**Why it's the strong alternative.** Dark-canvas confidence is perceived premium via subtraction
— the most "Awwwards-forward" of the three and the most photogenic for a single floating bike
under a hard rim-light. It reads instantly as *energy / charging / voltage*. The risk the brief
flags: Electrum already owns navy locally and Gogoro owns royal blue globally, so we push the hue
toward a brighter **electric cyan-blue** (`oklch ~0.70 hue 230`) and a darker, more cinematic
base than either, so it never reads "Electrum-adjacent" and never drifts back toward green.

### Palette — "Voltage"

| Role (token) | Name | Hex | OKLCH | Usage |
|---|---|---|---|---|
| `--background` | Voltage black | `#0A0A0C` | `oklch(0.13 0.004 250)` | the canvas, everywhere |
| `--foreground` | Cold white | `#F2F4F8` | `oklch(0.96 0.004 250)` | primary text |
| `--card` | Carbon | `#15161A` | `oklch(0.19 0.006 255)` | surfaces, spec panels |
| `--primary` | Electric blue | `#1FA8FF` | `oklch(0.70 0.16 240)` | CTAs, active, charging/data — the ONLY saturated color |
| `--primary-foreground` | Voltage black | `#08090B` | `oklch(0.12 0.004 250)` | text on the blue |
| `--muted-foreground` | Steel | `#8A909C` | `oklch(0.63 0.012 255)` | secondary text (≥4.5:1 on black) |
| `--border` | Carbon line | `#23252B` | `oklch(0.25 0.006 255)` | hairlines, matched to surface |
| `--accent` (glow) | Plasma cyan | `#3DE0FF` | `oklch(0.84 0.13 215)` | rare high-energy highlights, charging pulse |
| `--secondary` (rare light) | Cool paper | `#EEF1F6` | `oklch(0.95 0.005 250)` | the few inverted/light blocks (spec sheets) |
| `--destructive` | Signal red | `#FF5A5F` | `oklch(0.68 0.20 22)` | errors only |

Neutrals tinted ~0.004–0.012 chroma toward hue 240–255 (cool) — cool to match the blue, but
kept low-chroma so they never compete with the accent. Single committed dark mode: no toggle,
the dead `.dark` block gets deleted, not wired.

### Typography
**Display + Text:** Schibsted Grotesk (single OFL variable superfamily, one file display→body)
· **Mono:** Martian Mono for spec/data. One family means **zero pairing risk** and the least to
maintain — it directly serves "one consistent design guideline" and reads premium/Scandi/digital-
first on a dark canvas without going quirky. ([Schibsted Grotesk on Google Fonts](https://fonts.google.com/specimen/Schibsted+Grotesk), [GitHub/OFL](https://github.com/schibsted/schibsted-grotesk))

### Motion & signature
The most aggressive motion budget of the three (still PageSpeed-safe): a hard rim-light sweep
across the bike on hero entrance, a charging-pulse on the plasma-cyan accent, Lenis smooth-scroll
(~4kb) for the cinematic feel. This is the one direction where **one** lazy-loaded WebGL/Three.js
hero moment (a slow 360° or headlight ignition) would be justified — `next/dynamic`, static
fallback, gated by `prefers-reduced-motion`.

### Best for
Maximum cinematic wow and Awwwards-forward impact; product-as-hero photography; a brand that
wants to read as pure high-tech energy. Trade-off: less ownable than Filament (blue is a more
crowded EV space) and a single dark mode is less flexible for dense B2B/spec/corporate reading.

---

## Direction 3 — "SPARK" (expressive consumer hybrid)

**Personality:** Energetic, editorial, modern.
**Theme:** dual — editorial-light body with dark cinematic breakout sections (one token set).
**Reference:** *Edison's spark/bolt* — a confident electric **indigo** primary carries the brand
and CTAs, with a **voltage-amber** used very sparingly (≤10%) only for energy/charging/data
highlights. Think bold technical editorial (Awwwards-forward, vibrant) rather than minimal-
cinematic — the most expressive, most "consumer/lifestyle" of the three.

**Why it earns a slot.** It spans the space the other two leave open: not warm-minimal (1),
not dark-cinematic (2), but a **light-led, energetic editorial** system with a modern-tech
indigo primary and an amber spark that still nods to the filament/electricity story. Indigo is
distinctive (no local EV owns it), flexible across consumer + B2B + corporate, and the light
body keeps dense spec/career/media pages maximally readable while dark breakout sections give
hero/story moments their cinematic punch.

### Palette — "Spark / Indigo-Volt"

| Role (token) | Name | Hex | OKLCH | Usage |
|---|---|---|---|---|
| `--background` | Snow | `#FBFBFD` | `oklch(0.985 0.002 280)` | editorial-light body (cool, not cream) |
| `--foreground` | Near-black indigo-ink | `#101014` | `oklch(0.17 0.01 280)` | primary text |
| `--card` | Paper | `#FFFFFF` | `oklch(1 0 0)` | cards, panels |
| `--background-dark` (breakout) | Indigo-ink | `#0D0D14` | `oklch(0.15 0.015 280)` | full-bleed cinematic sections |
| `--primary` | Electric indigo | `#4F46F5` | `oklch(0.55 0.22 275)` | brand color, CTAs, active states |
| `--primary-foreground` | Snow | `#FBFBFD` | `oklch(0.985 0.002 280)` | text on indigo |
| `--accent` | Voltage amber | `#F4B43C` | `oklch(0.82 0.15 80)` | spark — energy/charging/data ONLY, ≤10% of surface |
| `--accent-foreground` | Indigo-ink | `#101014` | `oklch(0.17 0.01 280)` | text on amber |
| `--muted-foreground` | Slate | `#5C5C6E` | `oklch(0.50 0.02 280)` | secondary text (≥4.5:1 on snow) |
| `--border` | Cool hairline | `#E6E6EE` | `oklch(0.92 0.006 280)` | borders, tinted toward indigo |
| `--destructive` | Signal red | `#E5484D` | `oklch(0.63 0.21 25)` | errors only |

Two accents demand **discipline**: indigo is the brand and carries ~90% of all colored elements;
amber is reserved strictly for charge/range/energy data and the rare "spark" highlight. If in
doubt, drop amber — collapsing to single-accent indigo keeps it from becoming a full-palette
look. Neutrals tinted toward indigo hue 280, kept cool (the brief warns off cream/beige).

### Typography
**Display:** Clash Display · **Text:** General Sans — same foundry (Fontshare / Indian Type
Foundry), cohesive neo-grotesk pairing, both variable, self-hosted via `next/font/local`. ITF
Free Font License: free for commercial use, self-host fine (not OFL, so files can't be
redistributed and aren't on Google's CDN — slightly more setup). Clash Display's small-aperture,
futuristic display character is excellent for the EV product names (Athena / Bees / Victory) and
gives the most distinctive headline voice of the three. Mono accent: **Space Mono** for data.
([Clash Display + General Sans on Fontshare](https://www.fontshare.com/fonts/clash-display))

> If a pure-OFL/`next/font/google` profile is required for licensing simplicity, substitute
> **Space Grotesk + Hanken Grotesk** (Direction 1's pair) with no loss of register.

### Motion & signature
Editorial, varied choreography (kills the uniform fade-rise): horizontal scroll for the bento
lineup, indigo→amber color transitions on charging-flow visualizations, amber "spark" micro-
bursts on stat reveals. Light body keeps motion cheap; dark breakout sections get the parallax/
cinematic moments. View Transitions for nav, Lenis optional.

### Best for
An energetic, consumer-lifestyle, e-commerce-forward brand that wants vibrancy and a strong
editorial voice while keeping dense pages readable. Most expressive; requires the most color
discipline to not slide into AI-slop.

---

## Sections — take out / add (all directions)

**Remove / fix**
- Carousel heroes (home + ojol) → one giant headline + single floating product on the
  near-monochrome set (existing `bees-*` colorway photography supports this today).
- The forced 2-second white preloader (`Preloader.tsx`) → delete (fights "light-speed fast").
- All 18 gradient-text headings → solid color, emphasis via weight/size (also removes a green carrier).
- Hand-rolled ojol/career/campaign dialogs → shadcn `alert-dialog` (focus trap, role, Esc).
- Undefined `shadow-soft*` / `shadow-teal` / `animate-float` utilities → define real shadow/motion
  tokens (cards currently render flat).
- Per-section uppercase eyebrow pills → one named kicker max.
- Placeholder "123 Electric Avenue, San Francisco" in corporate/contact → real Indonesian locations.
- The dead commented `:root` block + per-token color predecessors + dead `.dark` block (in single-
  mode directions) → delete.

**Keep (retokenize only)**
- The comparison table UX (mobile horizontal-scroll vs desktop grid, expand/collapse, highlight) —
  genuinely good; swap green tokens for the new accent.
- Per-page SEO scaffolding, locale routing, `product-data`/`data-job` separation.

**Add (award-grade)**
- One signature hero moment per the chosen direction (ignite / rim-light sweep / spark), static
  fallback + `prefers-reduced-motion`.
- **Bento model-lineup** (Athena / Bees / Victory / EDPower) with hover reveals + animated tabular
  spec counters.
- **Use-case nav IA:** Commute (Athena/Bees) · Performance (Victory) · Fleet/Ojol (B2B) · EDPower —
  replaces the route-coupled 643-line navbar logic.
- **"Build your Wedison" colorway/spec switcher** — viable now using existing multi-colorway Bees
  photography; the foundation for a future configurator.
- **SuperCharge ecosystem story** (bike + network + app) told with restraint.
- Native **View Transitions** for app-like model→model browsing.
- **Real art-directed product photography** as the photography matures — the #1 anti-AI-slop lever.

---

## Recommendation

**Ship Direction 1 — "Filament."** It is the only option that is simultaneously the most
*ownable* (literal Edison/filament equity), the most *differentiated* (every local and global EV
competitor is green or blue; a warm amber-on-charcoal world is empty space), and the *lowest risk*
to execute because the existing matte-black/grey product photography already suits warm-on-dark.
Pair **Space Grotesk + Hanken Grotesk + Space Mono**, with **Schibsted Grotesk** pre-approved as
the one-token display fallback if Space Grotesk reads too techy on B2B/corporate pages — which
also keeps Direction 2 ("Voltage") one swap away as the cinematic alternative if the brand wants
to go darker and more high-tech. **Direction 3 ("Spark")** is the move only if the brand
deliberately wants a lighter, more expressive consumer/e-commerce energy.
