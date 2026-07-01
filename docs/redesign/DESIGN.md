# Wedison — Design Guideline (Sage + Ink)

> Single source of truth for the redesign. Direction **"Sage + Ink"** (Opsi I): light-led,
> airy, premium, with deep-green "Forest" sections for product drama. Green is retained
> (logo equity) but moved to a serious, deep register. **One accent only: green.** No gradients-as-text,
> no metallic, no neon. Author all color in OKLCH; consume only via semantic Tailwind utilities.

---

## 1. Brand essence

- **Personality:** tenang, serius, premium, bersih (quiet-luxury, not loud-tech).
- **Story:** Wedison → Edison → energi/listrik. Energi yang *tenang*, bukan dingin/agresif.
- **Differentiation:** kompetitor lokal pakai hijau terang/mint/lime. Wedison memakai **hijau-tua serius** = tetap "hijau logo" tapi premium dan tak terlihat murah.

## 2. Color tokens

Two surface worlds on **one** committed light theme (no user dark toggle). "Forest" is a set of
section tokens for full-bleed dramatic blocks (hero/product/SuperCharge/footer), not a theme mode.

### Light (default)
| Token | Name | Hex | OKLCH | Usage |
|---|---|---|---|---|
| `background` | Snow | `#FAFAF7` | `oklch(.985 .003 150)` | page background |
| `card` / `popover` | White | `#FFFFFF` | `oklch(1 0 0)` | cards, panels, menus |
| `foreground` | Ink | `#1A1F1C` | `oklch(.235 .008 160)` | primary text |
| `primary` | Deep Green | `#1E5B40` | `oklch(.455 .085 159)` | CTAs, links, brand, active, key data — the ONLY accent |
| `primary-hover` | — | `#184A34` | `oklch(.40 .078 159)` | primary hover/active |
| `primary-foreground` | Snow | `#FAFAF7` | `oklch(.985 .003 150)` | text on primary |
| `secondary` | Sage | `#DCE4DA` | `oklch(.90 .018 156)` | tinted surface, secondary button |
| `muted` | Sage 50 | `#EFF2EC` | `oklch(.952 .010 156)` | subtle fills, alt sections |
| `muted-foreground` | Slate Green | `#4F5E55` | `oklch(.455 .018 158)` | secondary text (≥4.5:1 on Snow) |
| `accent` | Sage 100 | `#E7EDE3` | `oklch(.93 .014 152)` | hover surface, chips |
| `border` / `input` | Hairline | `#E3E7DE` | `oklch(.915 .008 152)` | borders, dividers, inputs |
| `ring` | = primary | `#1E5B40` | — | focus ring |
| `destructive` | Signal | `#BE4139` | `oklch(.55 .16 27)` | errors only |

### Forest (inverse sections)
| Token | Hex | OKLCH | Usage |
|---|---|---|---|
| `forest` | `#123A28` | `oklch(.34 .055 160)` | dramatic section bg |
| `forest-deep` | `#0E2C1E` | `oklch(.28 .05 160)` | deepest bg / footer |
| `forest-foreground` | `#EEF3EE` | `oklch(.96 .006 156)` | text on forest |
| `forest-muted` | `#9FB3A4` | `oklch(.74 .02 158)` | secondary text on forest |
| `on-forest-accent` | `#9FE3B9` | `oklch(.86 .10 158)` | kickers/highlights on forest |

**Rules:** never gray text on the green; never convey meaning by color alone; neutrals are
green-tinted (no dead gray, no cream/beige); confine saturation to `primary`. On Forest, CTAs are
`forest-foreground` (bone) solids or ghost; data/kickers use `on-forest-accent`.

## 3. Typography

- **Display** (`font-display`): **Schibsted Grotesk** — H1–H3, hero, kickers, CTA labels, big numerals.
- **Body/UI** (`font-sans`, default): **Hanken Grotesk** — paragraphs, UI, labels. Warm, open, Bahasa-legible.
- **Data** (`font-mono`): **Martian Mono** — spec/range/price/kW numerals only, sparingly. Tabular.
- All variable, OFL, via `next/font/google` (self-hosted at build, `display:swap`, `subsets:['latin']`).

**Scale (fluid `clamp`, ratio ~1.25):**
- display: `clamp(2.4rem,5.6vw,4.4rem)` / 800 — hero only, cap ≤ ~4.5rem
- h1: `clamp(1.9rem,4vw,2.9rem)` / 800
- h2: `clamp(1.5rem,3vw,2.1rem)` / 700
- h3: `1.25–1.4rem` / 600
- body: `1rem` (min 16px) / 400 · lead `1.0625–1.18rem`
- small/label: `.8125–.875rem` · mono kicker `.72rem` tracked `.18–.22em`

**Rules:** body line-length 60–75ch; `text-wrap:balance` on h1–h3, `pretty` on prose; display
tracking −0.02 to −0.03em; ~5 sizes max; hierarchy via size+weight+color+space, not size alone.

## 4. Spacing, radius, shadow, z-index

- **Spacing:** Tailwind's 4px base scale (4·8·12·16·24·32·48·64·96). Section padding generous
  (clamp ~48–96px). Group tightly (8–12), separate generously. Use `gap`, not margins.
- **Radius:** `--radius: 10px` → sm 6 / md 8 / lg 10 / xl 14. Buttons 8px, cards 10–14px. Premium = crisp, not pill-round.
- **Shadow (green-tinted, subtle):** sm `0 1px 3px rgba(20,31,24,.06)` · md `0 6px 18px /.07` · lg `0 16px 40px /.10`. No glow, no neon.
- **Z-index:** semantic scale 10/20/30/40/50 (nav 40, modal 50). Never 999/9999.

## 5. Motion

- **Curve:** ease-out expo `cubic-bezier(.16,1,.3,1)` (also quint/quart). **No bounce/elastic.**
- **Durations:** 120–150ms feedback · 200–300ms state · 320–500ms layout · 500–800ms entrance; exits ~75%.
- **Animate transform/opacity only** (compositor). Never width/height/top/left.
- **Reveals enhance an already-visible default:** content visible in markup; `IntersectionObserver`
  adds `is-revealed` (unobserve after fire). Never gate visibility on a transition (SSR-safe). **Vary**
  choreography per section — kill the uniform fade-rise.
- **`prefers-reduced-motion`:** one global block collapses durations + gates smooth-scroll; reduced ≠ none (keep subtle fades).
- **Cost ladder:** CSS → native View Transitions (model→model nav) → Lenis (optional) → Motion/Framer behind `next/dynamic` for ≤1 signature moment.

## 6. Components

- **Buttons:** `primary` (green), `secondary` (sage), `ghost` (border), `link`. All 8 states; hover = `translateY(-1px)` + `primary-hover`; **`:focus-visible` ring 2px `ring` offset 2** (never `outline:none` alone).
- **Cards:** white on snow, `border` hairline, `shadow-sm` → hover `shadow-lg` + `-3px`. No nested cards.
- **Forms:** visible `<label>` (not placeholder-as-label); validate on blur; error below field via `aria-describedby`; consolidate hand-rolled dialogs onto shadcn `alert-dialog` (focus trap, role, Esc).
- **Kicker:** one mono uppercase kicker per section max (no eyebrow-on-every-block).

## 7. Layout

- **One container:** `.main-container` = `w-full mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12` (retire the 2400/2480/2880 drift).
- Flexbox 1D, Grid 2D; responsive grids `repeat(auto-fit,minmax(…,1fr))`.
- **Bento** for model lineup; intentional asymmetric breakouts on hero/story; full-bleed Forest sections alternate with tight editorial columns.
- Touch targets ≥44×44px. Mobile-first.

## 8. Anti-AI-slop bans (Impeccable)

No gradient text · no side-stripe borders · no glass-by-default · no hero-metric template clichés ·
no identical card grids everywhere · no per-section uppercase eyebrows · no `01/02/03` markers ·
no purple gradients/bounce easing · no >2 em-dashes in body copy · no light-gray-for-elegance (fails contrast).

## 9. Section take-out / add (EV site)

**Remove/fix:** carousel heroes (home+ojol) → one headline + single floating product · 2s preloader →
delete · 18 gradient-text headings → solid · hand-rolled dialogs → `alert-dialog` · undefined
`shadow-soft*`/`animate-float` → real tokens · "123 Electric Avenue, San Francisco" → real ID locations.
**Keep (retokenize):** comparison table, SEO/locale routing, shadcn primitives.
**Add:** one signature hero moment (reduced-motion-safe) · bento model-lineup + animated tabular spec
counters · use-case nav IA (Commute/Performance/Fleet-Ojol/EDPower) · "Build your Wedison" colorway switcher ·
SuperCharge ecosystem story · native View Transitions.

## 10. Implementation mapping

Tokens live in `src/app/globals.css`: primitives in `:root`, bridged via `@theme inline`.
Use semantic utilities only: `bg-background text-foreground`, `bg-primary text-primary-foreground hover:bg-primary-hover`,
`bg-secondary`, `text-muted-foreground`, `border-border`, `bg-forest text-forest-foreground`, `font-display`, `font-mono`.
**Never** inline hex/oklch or `text-[var(--primary)]` in components. Fonts in `src/app/fonts.ts`.
