# Impeccable Principles + Slop Audit — Wedison Landing

> Research artifact 02 of the Wedison redesign. Distills the Impeccable design toolkit
> (`.claude/skills/impeccable`) into an actionable checklist, then maps the concrete AI-slop
> findings in this codebase to files/lines, and prioritizes the highest-impact fixes.
>
> Register for this project: **Brand** (a consumer EV landing site — the design *is* the product).
> So brand-register rules apply (committed color, fluid type, distinctive fonts, imagery-led),
> not the product-register defaults (system fonts, restrained accent).

---

## Detector headline

```
npx impeccable@latest detect src/ --json   →  exit 2 (findings present)
18 anti-patterns found — ALL of type `gradient-text` (severity: warning)
--gpt --gemini provider tells: no additional findings (still 18)
```

The bundled detector is a **regex/AST scanner** that only flags a narrow set of mechanically
detectable tells (gradient-text, a handful of others). It is NOT a full design review. Every other
principle below was checked **manually** against the source per the Impeccable references, because
the CLI cannot see typography scale, color strategy, spacing rhythm, reduced-motion, or hierarchy.

### Detector findings by file (18 total, all `gradient-text` = `bg-clip-text` + `bg-gradient`)

| Count | File |
|---|---|
| 7 | `src/app/[locale]/corporate/about/structure.tsx` (lines 63, 71, 114, 134, 211, 266, 322) |
| 3 | `src/app/[locale]/corporate/contact/structure.tsx` (lines 95, 232, 264) |
| 3 | `src/app/[locale]/showroom/components/structure.tsx` (lines 106, 125, 217) |
| 1 | `src/app/not-found.tsx` (line 51) |
| 1 | `src/components/contact3.tsx` (line 179) |
| 1 | `src/components/footer.tsx` (line 13) |
| 1 | `src/components/hero/HeroSlide.tsx` (line 390) |
| 1 | `src/components/hero-section.tsx` (line 118) |

All 18 are the **same brand move**: a green→teal gradient (`from-[var(--primary)]`/`from-[var(--primary-light)] to-teal-300`) clipped to heading text. This is doubly bad here: it's an Impeccable absolute-ban (gradient text) *and* it is built entirely from the `#2bb075` green the user wants to abandon. Removing it serves both goals at once.

---

## Part A — Distilled Impeccable principles checklist

### A1. Typography

- [ ] **Brand register → fluid `clamp()` scale, ≥1.25 ratio between steps.** Flat 1.1× scales read as uncommitted. (Body text stays fixed `rem`.)
- [ ] **Cap body line length at 65–75ch** (`max-width: 65ch`). The most-ignored rule.
- [ ] **Hero/display ceiling: `clamp()` max ≤ 6rem (~96px).** Above that the page is shouting.
- [ ] **Display letter-spacing floor: ≥ −0.04em.** Tighter and letters touch.
- [ ] **Body text ≥ 16px / 1rem**, in `rem` not `px` (respects user zoom). Never `user-scalable=no`.
- [ ] **`text-wrap: balance` on h1–h3; `text-wrap: pretty` on prose.**
- [ ] **Don't pair similar-but-not-identical fonts** (two geometric sans). Pair on a contrast axis (serif+sans, geometric+humanist) or one family in multiple weights.
- [ ] **Max 2–3 families, max 3–4 weights.** Load only the weights used; preload only the critical (above-fold body) weight.
- [ ] **Reflex-reject font list (ban for greenfield):** Inter, Geist (implied by the reflex-modern-geometric warning), DM Sans/Serif, Plus Jakarta, Outfit, Space Grotesk/Mono, IBM Plex *, Fraunces, Newsreader, Lora, Crimson, Playfair, Cormorant, Syne, Instrument Sans/Serif, Roboto, Open Sans, Poppins, Montserrat. "Modern" does NOT require a geometric sans — the most modern move is not using the font everyone else uses.
- [ ] **Metric-matched fallback (`size-adjust`/`*-override`) + `font-display: swap`** to kill FOUT/CLS; `optional` when zero shift matters most.
- [ ] **Hierarchy from size+weight+color+space combined**, not size alone. 5 sizes cover most needs. Avoid muddy 14/15/16 steps.

### A2. Color

- [ ] **Use OKLCH throughout** (perceptually uniform). Reduce chroma near white/black.
- [ ] **Pick a color *strategy* before colors:** Restrained (neutral + 1 accent ≤10%) · Committed (one saturated color owns 30–60%) · Full palette (3–4 named roles) · Drenched (surface IS the color). Brand surfaces have permission for Committed/Drenched — use it; a beige-and-slate landing page ignores the register.
- [ ] **Name a real reference before committing** ("Stripe purple-on-white restraint", "Liquid Death acid-green full palette"). Unnamed ambition decays to beige.
- [ ] **Don't reach for the default hues by reflex** (blue ~250, warm-orange ~60). The cream/sand/beige warm-neutral body (`L 0.84–0.97, C<0.06, hue 40–100`) is the saturated AI default of 2026 — token names like `--paper`/`--sand`/`--linen` are themselves tells.
- [ ] **Tinted neutrals:** add 0.005–0.015 chroma toward *this brand's* hue (not default-warm/cool). Pure gray is dead.
- [ ] **Contrast: body ≥4.5:1; large (≥18px / bold ≥14px) ≥3:1; UI/icons ≥3:1; placeholders ≥4.5:1.** Light gray body text on tinted near-white is the #1 AI readability fail.
- [ ] **Never gray text on a colored background** — use a darker shade of that bg's own hue, or a transparency of the text color.
- [ ] **Don't convey meaning by color alone** (8% of men can't distinguish red/green).
- [ ] **Alpha is a design smell** — heavy rgba/opacity usually means an incomplete palette; define explicit overlay tokens (focus rings exempt).
- [ ] **Two-layer tokens** (primitive → semantic). Dark mode redefines only the semantic layer; dark depth comes from surface lightness, not shadows.

### A3. Spacing / Layout

- [ ] **4pt base scale** (4/8/12/16/24/32/48/64/96), values from a defined set — never arbitrary (no random 13px).
- [ ] **Vary spacing for rhythm:** tight grouping (8–12px between siblings) + generous separation (48–96px between sections). Equal padding everywhere = no rhythm.
- [ ] **Flexbox for 1D, Grid for 2D.** Responsive grids without breakpoints: `repeat(auto-fit, minmax(280px, 1fr))`.
- [ ] **Use `gap`, not margins,** for sibling spacing.
- [ ] **Semantic z-index scale** (dropdown→sticky→modal-backdrop→modal→toast→tooltip). Never 999/9999.
- [ ] **Squint test:** primary/secondary/groupings still legible with blurred vision.
- [ ] **Touch targets ≥ 44×44px** even when the visual element is smaller (expand hit area with padding/pseudo-element).

### A4. Motion

- [ ] **`prefers-reduced-motion` is NOT optional** — every animation needs a reduce alternative (crossfade or instant).
- [ ] **Reveal animations must enhance an already-visible default.** Don't gate content *visibility* on a class-triggered transition — transitions pause on hidden tabs/headless renders, so the section ships blank.
- [ ] **Ease-out with exponential curves** (`ease-out-quart` `(.25,1,.5,1)` / `quint` `(.22,1,.36,1)` / `expo` `(.16,1,.3,1)`). **No bounce, no elastic** (dated/tacky).
- [ ] **Duration: 100–150ms feedback · 200–300ms state · 300–500ms layout · 500–800ms entrance.** Exits ~75% of entrance. Nothing >500ms for feedback.
- [ ] **Don't animate layout props casually** (`width/height/top/left/margin`) — use transform/opacity, FLIP, or `grid-template-rows`.
- [ ] **Sibling stagger is legit** (`animation-delay: calc(var(--i)*50ms)`, cap total ~500ms). The **uniform fade-rise-on-every-scrolled-section reflex is the tell**, not motion itself.
- [ ] **Premium materials beyond transform/opacity:** blur, backdrop-filter, clip-path, mask, shadow/glow — when they materially help and stay smooth; bound expensive paint areas.
- [ ] **IntersectionObserver (unobserve after fire), not scroll listeners.** `will-change` only on `:hover`/`.animating`, never page-wide.

### A5. Interaction

- [ ] **Design all 8 states:** default, hover, focus, active, disabled, loading, error, success. Hover≠focus (keyboard users never see hover).
- [ ] **Never `outline:none` without replacement** — use `:focus-visible`, 2–3px ring, ≥3:1 contrast, offset from element.
- [ ] **Labels are not placeholders.** Visible `<label>`; validate on blur; errors below field with `aria-describedby`.
- [ ] **Native `<dialog>`/popover + `inert`** for modals; **Popover API / `position:fixed` / portal** for dropdowns (absolute inside `overflow:hidden`/`auto` gets clipped — the #1 dropdown bug).
- [ ] **Undo > confirm** for destructive actions; skeletons > spinners.

### A6. Slop antipatterns to refuse (the specific tells Impeccable flags)

**Absolute bans (rewrite the element, don't tweak it):**
1. **Side-stripe borders** — `border-left/right` > 1px as a colored accent on cards/alerts/list-items. Use full borders, bg tints, or leading icons/numbers.
2. **Gradient text** — `background-clip:text` + gradient. Solid color only; emphasis via weight/size.
3. **Glassmorphism as default** — decorative blur/glass cards. Rare and purposeful, or nothing.
4. **Hero-metric template** — big number + small label + supporting stats + gradient accent. SaaS cliché.
5. **Identical card grids** — same-sized icon+heading+text cards repeated endlessly.
6. **Tiny uppercase tracked eyebrow above every section** ("ABOUT" "PROCESS"). One named kicker = voice; an eyebrow on every section = AI grammar.
7. **Numbered section markers as default scaffolding** (`01 · About / 02 · Process`). Numbers earn their place only when the section IS a real ordered sequence.
8. **Text overflowing its container** — test heading copy at every breakpoint; the viewport is part of the design.

**Other strong tells:** purple/cyan-blue gradients ("bolder" reflex), bounce/elastic easing, gray text on colored bg, nested cards (always wrong), cream/sand/beige body bg, `--paper`/`--sand`/`--linen` token names, editorial-magazine aesthetic (display-serif-italic + drop caps + ruled columns) on a non-editorial brief, monospace-as-"technical"-costume, rounded-corner icon above every heading, all-caps body copy, timid palettes + average layouts, zero imagery on an imagery-implying brief.

**Category-reflex test (run twice):** first-order — if you can guess theme+palette from the category alone, it's the first reflex. Second-order — if you can guess the "anti-SaaS" aesthetic family from category+anti-reference, it's the trap one tier deeper. Rework until neither is obvious.

---

## Part B — Concrete slop findings in THIS codebase (mapped to files/lines)

### B1. Fonts — Geist (reflex-reject), single geometric sans, no fallback metrics — `[P1]`

- `src/app/[locale]/layout.tsx:1,10–20` — `Geist` + `Geist_Mono` from `next/font/google`, wired as `--font-geist-sans` / `--font-geist-mono`.
- `src/app/globals.css:9–11` — `@theme { --font-sans: var(--font-geist-sans) }`.
- **Slop:** Geist is the canonical "modern AI" geometric sans and is on the user's explicit ban list (alongside Inter/Roboto/Poppins/Montserrat). For a **brand** register this is the first-order font reflex. No brand personality, no contrast-axis pairing, no metric-matched fallback (`size-adjust`/`ascent-override`) → CLS risk on the FOUT swap. **This is the single biggest "non-generic brand font" miss.**

### B2. Color — `#2bb075` green is the de-facto everything; gradient-text spreads it — `[P0 vs user goal]`

- `src/app/globals.css:64` — `--primary: oklch(0.6731 0.1424 158.78); /* #2bb075 */` (the disliked green).
- `globals.css:113–115` — `--input`, `--border`, `--ring` all set to teal `oklch(0.7 0.14 182.503)` (hue 182) — a *second* green/teal hue, so the "neutral" borders across every input and card are actually green.
- `globals.css:104,107` — `--muted`/`--accent` also tinted toward hue 182 teal.
- **312 `primary` usages** and **teal-300 gradient endpoints** in hero/footer hard-bind the green into the brand. The **18 gradient-text instances (B3)** are all `from-[var(--primary)] … to-teal-300`.
- `globals.css:12–48` — a large fully-commented-out `:root` block (dead code) duplicating tokens; `globals.css:14` has a double-comment artifact.
- **Slop / goal conflict:** green is not just *a* color, it's structurally everywhere (primary, border, input, ring, muted, accent). Moving off green is a token-layer job (redefine `--primary` + the hue-182 neutrals), but every `to-teal-300` literal and raw `teal-*`/`emerald-*` class must also be swept. Color strategy is currently **un-named** (neither cleanly Restrained nor Committed) — it's green-by-default, the thing the user dislikes.

### B3. Gradient text ×18 (detector) — absolute ban — `[P1]`

Files/lines as tabulated above. Representative:
- `src/components/hero-section.tsx:118` — `<span className="bg-gradient-to-r from-[var(--primary-light)] to-teal-300 bg-clip-text text-transparent">` on the hero `titleHighlight`.
- `src/components/footer.tsx:13` — "Wedison Motors" wordmark as gradient text.
- `src/components/hero/HeroSlide.tsx:390`, `not-found.tsx:51` (the giant 404), `contact3.tsx:179`, plus the corporate/about (×7), corporate/contact (×3), showroom (×3) headings.
- **Latent bug:** `corporate/about/structure.tsx:71` uses `bg-clip-text` **without** `text-transparent` — the gradient is clipped to glyphs but the text stays `text-gray-900`, so the gradient renders *nothing* visible. Dead decorative code that still trips the detector.

### B4. Reduced motion — ZERO coverage — `[P1] accessibility`

- `grep prefers-reduced-motion | useReducedMotion` across `src/**` → **0 matches.**
- The site animates (CSS transitions, keen-slider/embla carousels, reveal transitions, `@keyframes progress` in `globals.css:236`) with **no reduce alternative anywhere**. Impeccable: "Reduced motion is not optional… this is an accessibility violation." A single global `@media (prefers-reduced-motion: reduce)` block in `globals.css` is the cheap fix.

### B5. Scroll-reveal gated on visibility (`opacity-0 translate-y-10`) without IntersectionObserver — `[P1]`

- Pattern present in 11 files: `corporate/about/structure.tsx`, `corporate/contact/structure.tsx`, `super-charge/app-showcase.tsx`, `_product/structure.tsx`, `hero-section.tsx`, `feature-section.tsx`, `user-manual-section.tsx`, `app-download-teaser.tsx`, `contact3.tsx`, `hero/HeroSlide.tsx`, `Preloader.tsx`.
- `grep IntersectionObserver` → **0 matches**, so reveals are class/state/timer-driven (e.g. about/structure.tsx:~110 toggles `opacity-100 translate-y-0` vs `opacity-0 translate-y-10` off an `isVisible` flag).
- **Two Impeccable violations at once:** (1) content visibility is **gated on a class-triggered transition** — on a headless renderer or a backgrounded tab the transition never fires and the section **ships blank** (also an SEO/SSR risk on this SSR build); (2) it's the **uniform fade-rise-on-every-section reflex** — the exact "AI grammar" tell, applied identically to most sections rather than choreographed per-section.

### B6. No fluid type scale; hero ceiling blown; thin line-length discipline — `[P2]`

- **0 `clamp()`** in `src/**`. Brand headings use stepped Tailwind sizes (`text-3xl … 2xl:text-6xl`) — Impeccable brand rule wants fluid `clamp()` with ≥1.25 ratio for display.
- **Hero ceiling exceeded:** `not-found.tsx:51` `text-[12rem]` (~192px) and `text-9xl`; `faq/structure.tsx:59` `text-8xl` (~96px, at the ceiling). Above ~6rem the page shouts.
- **Line length:** only **1 `ch` usage** in the whole tree; prose width relies on `max-w-2xl/3xl` (≈ ok-ish but not the 65–75ch discipline). No `text-wrap: balance/pretty`.

### B7. Hardcoded grays bypass tokens + contrast risk — `[P1] a11y + theming drift`

- **185 hardcoded `text-gray-*`** classes across `src/**` — theming drift; these don't move when tokens change (will fight the green→new-palette migration).
- **68 instances of light grays on (presumably) white:** `text-gray-400` ×34, `text-gray-500` ×29, `text-gray-300` ×5. `gray-400` ≈ **~3.0:1** on white → **fails the 4.5:1 body minimum**; `gray-300` is far worse. Exactly the "light gray for elegance" readability fail Impeccable calls out. Also `[locale]/layout.tsx:51` forces Sonner toast description to `!text-gray-500`.

### B8. Eyebrow / uppercase-tracked labels — `[P2]`

- `ojol/client.tsx:636,814` — `bg-primary/20 text-primary … text-sm font-semibold tracking-wider uppercase` pill kickers (also green-on-green-tint = washed gray-on-color risk).
- `comparison-table.tsx:192,324` — `uppercase tracking-wide/widest text-gray-900`.
- Not yet site-wide, but the pattern is starting; watch it doesn't become per-section grammar.

### B9. Undefined utility + dead CSS — `[P2/P3] polish`

- `shadow-soft` is used (e.g. `corporate/about/structure.tsx:115`) but **not defined** in `globals.css` or Tailwind config → silently renders no shadow.
- `globals.css:12–48` large commented-out `:root` duplicate block; `globals.css:14` double-comment. Dead theming code that confuses the source of truth.

### B10. Glassmorphism — present but bounded — `[P3] watch]`

- `backdrop-blur` in 8 places (`navbar.tsx`, `career/client.tsx`, `ojol/client.tsx`). Navbar blur is a legitimate use; audit the marketing-section uses (career/ojol) to confirm they're purposeful, not decorative glass cards.

### B11. Not findings (verified clean) ✓

- **Side-stripe borders:** 0. **Bounce/elastic easing:** 0. **Numbered `01/02` section markers:** 0. **Gray-text-on-`bg-primary` literal combos:** 0 (the risk is via grays-on-white, B7, and green-on-green-tint, B8). Good baseline — the worst absolute bans are already absent.

---

## Part C — Highest-impact fixes (ordered)

1. **`[P0 vs goal]` Kill green at the token layer + sweep literals.** In `globals.css`: replace `--primary` (`#2bb075`) and the hue-182 teal that leaks into `--border`/`--input`/`--ring`/`--muted`/`--accent` with the new (non-green) brand hue in OKLCH; re-tint neutrals 0.005–0.015 toward the *new* hue. Then sweep every `to-teal-300`, raw `teal-*`/`emerald-*` class, and audit the 312 `primary` usages. Delete the dead `:root` block (lines 12–48). *Command: `/impeccable colorize` then `/impeccable polish`.* This is the user's #1 stated dislike and it's structurally entangled — do it first and centrally.

2. **`[P1]` Remove all 18 gradient-text instances** (Part B3) — replace with a solid brand color; emphasis via weight/size or a deliberate single-color underline. Fix the latent `bg-clip-text`-without-`text-transparent` bug at about/structure.tsx:71. Clears the entire detector backlog (18→0) in one pass and removes a green carrier. *Command: `/impeccable typeset` / `/impeccable quieter`.*

3. **`[P1]` Replace Geist with a distinctive, highly-readable brand pairing** (off the reflex-reject list). Pick via the brand.md font procedure: 3 physical-object voice words for an Indonesian EV brand evoking Edison/energy, browse a real catalog, reject the first "designy" pick. Add metric-matched fallback + `font-display: swap`, preload only the above-fold weight. *Command: `/impeccable typeset`.* Directly serves "non-generic brand font."

4. **`[P1]` Add a global `prefers-reduced-motion: reduce` block** in `globals.css` (collapse durations to ~0.01ms / crossfade) covering carousels, reveals, and `@keyframes progress`. One block, site-wide a11y win.

5. **`[P1]` Fix the scroll-reveal pattern** (Part B5): make content **visible by default** and treat the reveal as enhancement (IntersectionObserver that adds an `is-revealed` class, content never starts at `opacity-0` in markup), and **vary** the choreography so it isn't the uniform fade-rise on every section. Protects SSR/headless/SEO rendering and removes the AI-grammar tell. *Command: `/impeccable animate`.*

6. **`[P1]` Migrate the 185 hardcoded `text-gray-*` to semantic tokens** and bump the 68 `gray-300/400/500`-on-white to ≥`gray-600`/a token that clears 4.5:1. Kills the readability fail and unblocks future theming. *Command: `/impeccable colorize` → `/impeccable audit`.*

7. **`[P2]` Establish a fluid `clamp()` display scale** (≥1.25 ratio, max ≤6rem) for headings; cap prose at 65–75ch with `ch`; add `text-wrap: balance` (h1–h3) / `pretty` (prose). Cap `not-found.tsx`/`faq` display sizes under the ceiling. *Command: `/impeccable typeset` / `/impeccable layout`.*

8. **`[P2/P3]` Polish:** define or remove `shadow-soft`; delete commented dead CSS; audit eyebrow pills (B8) and career/ojol glass (B10) for intent. *Command: `/impeccable polish`.*

---

### Method note
Detector run: `npx impeccable@latest detect src/ --json` (exit 2, 18 findings) and `--gpt --gemini` (no extra). All non-`gradient-text` findings above were derived by manual source inspection against the Impeccable references, since the CLI only mechanically detects a small rule set. Register judged **Brand** per brand.md (the design is the product).
