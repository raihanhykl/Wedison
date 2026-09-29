# Wedison — Codebase Design Audit (01)

> Senior design-systems engineer review of the live `ssr-version` branch.
> Scope: design tokens, typography, component system, per-page section
> inventory, accessibility, performance, maintainability. Goal context:
> escape AI-slop, one design guideline, non-green palette, brand font,
> mobile-first, light-speed, Awwwards-caliber.

Stack confirmed: Next.js 15.5 (App Router, `/[locale]` = `id|en`), React 19,
Tailwind **v4 (CSS-first, no `tailwind.config`)**, shadcn/ui (new-york),
TypeScript, `output: "standalone"` SSR on VPS. 69 `.tsx` files, **39 of them
`"use client"`**.

---

## TL;DR — the 10 things that matter most

1. **The design "system" is one CSS file of half-abandoned experiments.**
   `globals.css` opens with a 37-line fully commented-out `:root` block, then a
   live `:root` where every color has 2–3 commented-out predecessors (teal →
   emerald → current green). There is no token scale for spacing, no shadow
   tokens, no typography tokens.
2. **The primary color the user hates (`#2bb075` green) is hardcoded in OKLCH
   in one place** (`--primary: oklch(0.6731 0.1424 158.78)`) and then referenced
   **158 times** as raw `var(--primary)` across TSX. Changing the brand color
   is a one-line CSS edit *for the token*, but the palette is polluted by
   ~9 hardcoded `teal-*` Tailwind classes and gradients that bypass the token.
3. **Undefined utility classes are used as if they exist.** `shadow-soft`,
   `shadow-soft-lg`, `shadow-teal`, `animate-float`, `animate-slide-down` are
   referenced across components but **defined nowhere** (no `tailwind.config`,
   not in `globals.css`). They silently no-op — every "soft shadow" card on
   About/Contact/Showroom currently renders with **no shadow at all**.
4. **Typography is stock Geist** — exactly the generic font the user wants to
   avoid — loaded via `next/font/google` and wired to `--font-sans`. There is
   no type scale; every heading re-declares an ad-hoc responsive `text-*`
   ladder inline.
5. **A 2,942-line client translations blob** (`translations.tsx`, `"use
   client"`) is imported by the language context and shipped to the browser on
   every route. Both `id` and `en` dictionaries load regardless of locale.
6. **`images.unoptimized: true`** in `next.config.ts` — no resizing, no
   AVIF/WebP negotiation, no `srcset`. Combined with `width={9000}` hero
   `<Image>` calls and `quality={100}`, this is the single biggest PageSpeed
   liability.
7. **A forced 2-second white preloader** (`Preloader.tsx`) blocks the home
   page's perceived load with a `setTimeout` — actively fighting the
   "light-speed fast" goal.
8. **The home page is carousel-heavy and 100% client** (`landing.tsx`): two
   embla carousels (one autoplaying), a lazy comparison table, plus the
   global navbar/footer — all `"use client"`. Near-zero static HTML.
9. **Dead dark-mode infrastructure.** A full `.dark { … }` token block exists
   but no theme provider/toggle is wired (only `sonner` reads `next-themes`).
   It is maintenance weight with no payoff.
10. **The navbar is a 643-line client mega-component** with triple-duplicated
    dropdown JSX, ~6 boolean state flags, and color logic smeared through
    `cn()` calls referencing `var(--primary)`, `whitePage`, `scrolled`, and
    three `open*` flags simultaneously. It is the least maintainable file.

---

## (a) Design tokens

### Colors
All color lives in `src/app/globals.css`, expressed in OKLCH.

- **Commented-out graveyard (lines 12–48):** an entire first `:root` is
  commented out (including a "double comment" note on line 14). This is the
  shadcn default scaffold left in place.
- **Live `:root` (lines 50–139):** every brand color carries its evolution as
  comments — `teal-500` → `emerald-500` → current. Example
  (line 60–64):
  ```css
  /* --primary: oklch(0.7 0.14 182.503); teal-500 */
  /* --primary: oklch(69.6% 0.17 162.48); emerald-500 */
  --primary: oklch(0.6731 0.1424 158.78); /* #2bb075 */   ← the disliked green
  ```
- **Internal inconsistency / bug:** the primary family is green
  (`hue 158.78`), but `--input`, `--border`, `--ring` are set to a **different
  hue** — `oklch(0.7 0.14 182.503)` (teal, hue 182) — with the comment "pakai
  warna primary agar senada" (lines 113–115). They are *not* the same color.
  `--muted`/`--accent` are also on the old teal hue (182.5). So borders and
  primary fills don't actually match.
- **Ad-hoc extensions** not in the standard shadcn set: `--primary-light`,
  `--primary-lighter`, `--primary-dark`, `--secondary-light`,
  `--outline-foreground`. These are referenced widely (e.g. footer gradient,
  hero tags) and are part of the de-facto system but undocumented.
- **`@theme inline` (lines 177–214)** correctly re-exports tokens as
  `--color-*` so Tailwind v4 utilities (`bg-primary`, `text-muted-foreground`)
  work — **but** the `-light/-lighter/-dark` variants are **not** exported, so
  they are only reachable via `var(--primary-light)` in arbitrary-value
  classes, which is exactly why there are 158 raw `var(--primary*)` usages.
- **Bypass colors:** ~9 hardcoded `teal-*` classes (hero tag chips, footer
  "to-teal-300" gradient), 250 hardcoded `gray-*` utilities, plus literal hex
  in a JS fallback (`career/client.tsx`: `linear-gradient(135deg, #2BB075 …)`).

### Spacing
No spacing tokens. One container helper exists:
```css
.main-container { @apply w-full px-8 md:px-16 max-w-[2480px] mx-auto; }
```
But it competes with **at least three other container patterns**: navbar uses
`container mx-auto px-4 sm:px-6 lg:px-8 max-w-[2400px]`, product pages use
`px-8 md:px-16 max-w-[2480px] mx-auto` inline, peek carousel uses
`sm:mx-[72px] xl:mx-[138px]`. Max-widths drift between 2400 / 2480 / 2486 /
2880 px. Vertical rhythm is freehand (`py-16 md:py-20`, `py-26`, `my-24`,
`py-12 md:py-16`, `sm:mb-32` magic numbers everywhere).

### Radius
`--radius: 0.625rem` is defined and `@theme inline` derives `sm/md/lg/xl`.
Good — but components ignore it: cards mix `rounded-md`, `rounded-xl`,
`rounded-2xl`, `rounded-3xl`, `rounded-sm`, `rounded-none`, `rounded-full`
with no rule for which goes where.

### Shadows
**No shadow tokens exist.** Components reference `shadow-soft`,
`shadow-soft-lg`, `shadow-teal`, `shadow-xs` (the last is a real Tailwind v4
util; the first three are **undefined and render nothing**). This is a
systemic, invisible bug: every "elevated" card on About/Contact/Showroom is
flat.

---

## (b) Typography

- **Font:** `Geist` + `Geist_Mono` via `next/font/google`
  (`[locale]/layout.tsx`), `display: "swap"`, wired to `--font-sans/-mono` in
  `@theme`. Geist is precisely the generic geometric sans the brief rules out.
- **No type scale / no semantic text styles.** Every heading hand-rolls a
  responsive ladder, and they disagree:
  - Home hero `h1`: `text-3xl … lg:text-6xl xl:text-7xl`
  - Product hero `h1`: `text-4xl md:text-6xl`
  - HeroSection `h1`: `text-3xl … 2xl:text-6xl`
  - Media/FAQ banner: `text-3xl … lg:text-7xl`
  - Product overview `h2`: `text-5xl xl:text-6xl`
  There is no `h1/h2/h3` base style; sizing is a per-component decision.
- **Weight inconsistency:** `font-bold`, `font-semibold`, `font-medium`,
  `font-[750]`, `font-[900]`, `font-extrabold` all appear for "headline."
- **`bg-clip-text` gradient text** is the de-facto heading treatment on
  corporate/showroom pages (`from-[var(--primary)] to-[var(--primary-light)]`)
  — green gradient headings are a signature AI-slop tell and tie directly to
  the color the user is removing.

---

## (c) Component inventory & inconsistency

### shadcn/ui primitives present (`src/components/ui/`)
`accordion, alert-dialog, button, card, carousel, checkbox, form, input,
label, select, sonner, textarea`. These are mostly stock new-york.

- **`button.tsx`**: stock cva. `outline` variant is subtly broken —
  `hover:bg-background/90` (background hovering to background = no visible
  change) instead of a hover token. Despite a real variant API, call sites
  **override it constantly** with `className="bg-[var(--primary)]
  hover:bg-[var(--primary-dark)] …"` (hero-section, about, showroom), so the
  variant system is bypassed.
- **`card.tsx`**: stock. **Barely used** — most "cards" across the site are
  hand-built `<div className="bg-white rounded-xl p-6 shadow-soft">` (About,
  Contact, Showroom), not `<Card>`. So the one real card component is
  abandoned in favor of an undefined-shadow div pattern.
- **`alert-dialog` exists but is ignored:** both `ojol/client.tsx` (907 lines)
  and `career/client.tsx` (582 lines) hand-roll their own modal/backdrop/
  scroll-lock dialogs from scratch instead of using it.

### Shared components (`src/components/`)
`navbar, footer, hero-section, feature-section, comparison-table, contact3,
app-download-teaser, store-badges, phone-mockup, user-manual-section,
language-toggle2, navbar-product, navbar-dropdown, recaptcha-checkbox,
Preloader`, plus `hero/HeroSlide`.

Smells:
- **Hardcoded color in `cn()` everywhere** — `text-[var(--primary)]`,
  `bg-[var(--primary)]`, `hover:text-[var(--primary)]` (158 occurrences). A
  global color change still requires touching the token *and* auditing teal
  gradients/grays.
- **Magic numbers as layout API**: `feature-section` takes a numeric `feature`
  prop and computes order via `feature % 2 != 0 ? "order-0" : "order-2"`.
  Image dims are arbitrary: `width={9000} height={1000}`, `width={1000}
  height={1000}`, `width={800} height={450}` for the same visual slot.
- **Duplicated dropdown JSX** in navbar — the Products/Corporate/Discover
  buttons are three near-identical ~40-line blocks differing only in which
  `open*` flag they read.
- **`feature-section.tsx` imports a page-specific child**
  (`edpower/components/headunit-carousel`) — a "shared" component reaching into
  a route folder; layering violation.
- Naming inconsistency: `Preloader.tsx` (PascalCase) vs everything else
  kebab-case; `contact3.tsx`, `language-toggle2.tsx` carry version suffixes
  that imply earlier abandoned copies.

---

## (d) Per-page SECTION INVENTORY

**Home** (`_home/landing.tsx`, client): (1) Preloader overlay (2s forced) ·
(2) Hero carousel — 4 product slides, autoplay 4s, prev/next + dots ·
(3) Product carousel — peek/`basis-[80%]`, dots · (4) SuperCharge banner
(full-bleed image + CTA) · (5) `AppDownloadTeaser` · (6) `ComparisonTable`
(lazy, overview mode) · (7) Environmental Advantage (bg image + 3 icon
features Leaf/HeartPulse/Wind).

**Product pages — Athena / Bees / Victory / EdPower** (thin `page.tsx` →
`_product/structure.tsx`, client; data from `lib/product-data`): (1) Hero
(full-screen image, title/desc, Tokopedia + brochure buttons) · (2) Technical
spec strip (3 count-up animated stats with divider rules) · (3) Product
Overview (image + title + justified paragraph) · (4) Product Highlight
(`PeekCarousel`, keen-slider) · (5) Supercharge Overview (conditional) ·
(6) Supercharge Highlight (conditional `PeekCarousel`) · (7) `ComparisonTable`
(comparison mode) · (8) `UserManualSection` (single).

**SuperCharge** (`super-charge/page.tsx`): (1) `HeroSection` (dark, noButton) ·
(2) `VideoSection` (Suspense) · (3–5) three `FeatureSection2` (alternating
chip/location/charging) · (6) `AppShowcase` (multi-subsection: AppIntro phone
mockup, store badges, feature list).

**Ojol** (`ojol/client.tsx`, 907 lines): (1) Hero carousel (`HeroSlide`,
2 slides — brand + "50K/day" promo) · (2) Benefits · (3) Hot Campaign cards
(milik/harian) → (4) hand-rolled Campaign Detail Dialog (scheme/benefits/
terms/footer CTA, WhatsApp deep-links) · (5) SuperCharge section · (6) Model
grid (Bees/Athena/Victory/EdPower cards with highlight badges).

**Showroom** (`showroom/components/structure.tsx`): (1) Hero (tag chip + clip
heading + `ShowroomCarousel`) · (2) Locations (Jakarta/Bandung/Bali cards,
each with `MapComponent`, hours, book/maps buttons) · (3) "What You Can Do"
(4 activity cards: test ride/consult/financing/service).

**Corporate / About** (`corporate/about/structure.tsx`): (1) Hero (image +
overview card) · (2) Mission · (3) Core Values (3 cards) · (4) Projects
(2 cards) · (5) What We Offer (2 cards) · (6) CTA. Every heading is a green
`bg-clip-text` gradient; cards use undefined `shadow-soft`.

**Corporate / Contact** (`corporate/contact/structure.tsx`): (1) Hero ·
(2) Contact info (4 cards) + social links · (3) Form (`Contact`/contact3) +
`MapComponent` · (4) FAQ (4 hardcoded items). Note: map link still points to a
placeholder "123 Electric Avenue, San Francisco" Google URL.

**Career** (`career/client.tsx`): (1) Banner (image + 3 badge chips, has a
`#2BB075` JS gradient fallback) · (2) Job listings grid (`data-job.ts`) →
(3) hand-rolled Job Detail Dialog → (4) hand-rolled Job Portals dialog
(LinkedIn/Indeed/Glints/JobStreet/Kalibrr/Dribbble/Behance + email apply).

**Media Center** (`media-center/mediaCenterClient.tsx` + `news/[slug]`):
(1) Banner · (2) Berita/news grid (`NewsCard`, server-fetched `LinkPreview`) ·
(3) Instagram embeds. Plus dynamic `news/[slug]` article pages.

**FAQ** (`faq/structure.tsx`): (1) Banner · (2) Intro paragraph ·
(3) `UserManualSection` (grid) · (4) Category tabs (Battery/Charging/
Performance/Safety/Servicing/SmartFeatures/Tires) + `DropdownFAQ` accordion.

**EdPower** also exposes `components/headunit-carousel`. **not-found**,
`robots.ts`, `sitemap.ts`, `seo1.ts` exist (SEO is reasonably handled).

---

## (e) Accessibility

- **6 `aria-label`s across 69 files.** Carousel dot buttons have them; most
  interactive `<div onClick>` (peek carousel slides, product card images) and
  the hand-rolled dialogs do not.
- **Hand-rolled dialogs** (ojol, career) lack `role="dialog"`,
  `aria-modal`, focus trap, and `Esc` handling that `alert-dialog` would give.
- **Contrast risk:** white text over photographic hero backgrounds with only a
  `bg-black/30` overlay (hero-section) — likely fails WCAG AA on bright images.
- **Gradient `bg-clip-text` headings** can drop to transparent if the gradient
  fails, and reduce contrast.
- **Icon-only social links** in footer rely on `<Image alt>` only; no visible
  or `sr-only` label on the link itself (good `sr-only` exists on the mobile
  menu button and contact SVGs, so the pattern is known but inconsistent).
- `scroll-behavior: smooth` is global with no `prefers-reduced-motion` guard;
  many entrance animations (`translate-y`, `opacity`) also ignore reduced
  motion. Autoplay hero carousel has no pause control surfaced for a11y.
- No skip-link; navbar is `fixed` and overlaps content focus order.

---

## (f) Performance

- **`images.unoptimized: true`** (next.config.ts) — disables Next's resizing/
  format negotiation site-wide. `sharp` is installed and the comment says "just
  delete this line to enable," but it is still on.
- **Oversized image intrinsics:** `width={9000} height={1000}` (hero-section,
  about) and `quality={100}` (product hero, peek carousel) ship enormous
  source bytes with no `sizes`/`srcset` because optimization is off.
- **Forced 2s preloader** delays perceived/interaction readiness on home.
- **Client-heavy home:** `landing.tsx` is `"use client"` with two embla
  carousels (one `Autoplay`), `Preloader`, and a dynamically-imported (but
  still client) `ComparisonTable`. Navbar (client, scroll listener) + Footer
  (client) wrap every page, so even content pages hydrate a large client tree.
- **2,942-line translations module is `"use client"`** and imported by the
  context provider → both `id` + `en` dictionaries are in the client bundle on
  every page; no per-locale code-splitting.
- **39/69 components are client.** Pages that could be largely static
  (About, Contact, Showroom, FAQ) are client because they call `useLanguage()`
  / `useInView()`.
- **`react-intersection-observer`** entrance animations are used pervasively;
  cheap individually but they force client boundaries on otherwise-static
  marketing copy.
- Positives: home hero first slide uses `priority`; carousels lazy-ish; embla
  is light; `display: "swap"` on fonts avoids FOIT.

---

## (g) Maintainability & code smells

- **Comment graveyards** in nearly every file: dead `:root` block, commented
  color history, commented-out nav/state (`tone`, `bgTone`, `bgAccent`),
  commented JSX alternatives, leftover `placeholder.svg` references.
- **Type escape hatches:** `t()` is typed `=> string` but returns `ReactNode`
  via cast (acknowledged in a comment); `landing.tsx` and several clients
  `/* eslint-disable @typescript-eslint/no-explicit-any */` and use
  `useRef<any>` for carousel APIs.
- **Stateful color theming in the navbar** (`whitePage`, `scrolled`,
  `openProduct/Corporate/Discover`) hardcodes per-route logic
  (`path === "/corporate/about/"` …) — adding a page means editing the navbar.
- **Duplication:** product pages (athena/bees/victory/edpower) are 4 identical
  18-line wrappers (acceptable), but the dialogs, dropdowns, hero "tag chip,"
  and gradient-heading pattern are copy-pasted rather than componentized.
- **Mixed language in comments** (Indonesian + English) — fine for the team,
  but inconsistent.
- **Undefined utilities** (`shadow-soft` et al.) mean the codebase doesn't
  match its rendered output; high risk during redesign.
- Version-suffixed files (`contact3`, `language-toggle2`) signal abandoned
  predecessors not cleaned up.

---

## (h) What's genuinely good — keep / build on

- **Tailwind v4 CSS-first + `@theme inline` token export** is the right
  foundation; the redesign can define a real token scale here without new deps.
- **OKLCH color authoring** is modern and perceptually uniform — perfect for
  re-theming away from green by changing hue in one block.
- **shadcn/ui primitives are present** (button/card/dialog/accordion/form/
  select) — adopt them consistently instead of hand-rolled divs/dialogs.
- **Locale routing is clean**: URL is the source of truth, `generateMetadata`
  per page, `seo1.ts` + `sitemap.ts` + `robots.ts` + hreflang handled,
  `not-found` present. SEO scaffolding is a strength.
- **`.main-container` helper** is a good seed for a single layout primitive.
- **Data is reasonably separated** (`product-data`, `data-job`,
  `specifications` service, `translations`) — content vs. presentation split
  exists, just needs typing.
- **Comparison table** is genuinely thoughtful (mobile horizontal-scroll vs.
  desktop grid, expand/collapse, primary-bike highlighting) — worth keeping
  the UX, just retokenizing the colors.
- **SSR standalone + i18n + per-page metadata** is a solid platform; perf wins
  are mostly config (turn on image optimization, drop the preloader, push
  static content server-side), not rewrites.

---

## Highest-leverage fixes for the redesign (preview)

1. Define one token layer in `globals.css`: color (new non-green hue),
   spacing scale, radius, **real shadow tokens**, and a **type scale** — then
   delete the comment graveyards and the dead `.dark` block (or wire it
   properly).
2. Replace Geist with the chosen brand font via `next/font`; add base
   `h1–h3`/`body` styles so headings stop being per-component.
3. Re-export `--primary-light/-lighter/-dark` through `@theme inline` and
   sweep the 158 raw `var(--primary)` + 9 `teal-*` usages onto utilities.
4. `images.unoptimized: false`, sane `width/height/sizes`, drop `quality=100`
   and `width={9000}`.
5. Kill the 2s preloader; move About/Contact/Showroom/FAQ static content
   server-side; split translations per-locale.
6. Consolidate dialogs/cards/dropdowns onto shadcn primitives; fix the broken
   `button` outline hover; add a11y (labels, focus trap, reduced-motion).
