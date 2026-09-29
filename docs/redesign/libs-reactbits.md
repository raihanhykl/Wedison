# React Bits — Library Research (Ather-style Wedison redesign)

> Source of truth: [reactbits.dev](https://reactbits.dev) · [github.com/DavidHDev/react-bits](https://github.com/DavidHDev/react-bits)
> Researched June 2026 against the LATEST registry JSON (`https://reactbits.dev/r/{name}.json`).
> Target stack: **Next.js 15.5 (App Router) · React 19 · Tailwind CSS v4 (@theme) · shadcn/ui new-york · TS**.

React Bits is a **copy-in** library (like shadcn): the CLI writes the component **source** into your repo — nothing is imported from an `npm` package at runtime, only the animation engine (`motion` or `gsap`) is added to `package.json`. This is exactly how the registry is already wired in `components.json`:

```jsonc
"registries": {
  "@react-bits": "https://reactbits.dev/r/{name}.json"
}
```

---

## 1. Exact install pattern for THIS project

### 1.1 Component name = `Name-LANG-STYLE`

Every React Bits component ships **4 variants**. Pick the one that matches our stack — **TS + Tailwind = `-TS-TW`**:

| Suffix      | Language   | Styling      | Use for us? |
| ----------- | ---------- | ------------ | ----------- |
| **`-TS-TW`**| TypeScript | Tailwind v4  | ✅ **YES**  |
| `-TS-CSS`   | TypeScript | vanilla CSS  | no          |
| `-JS-TW`    | JavaScript | Tailwind     | no          |
| `-JS-CSS`   | JavaScript | vanilla CSS  | no          |

### 1.2 Install command (shadcn CLI — preferred, registry already configured)

```bash
# generic
npx shadcn@latest add @react-bits/<Name>-TS-TW

# real examples for this redesign
npx shadcn@latest add @react-bits/SplitText-TS-TW
npx shadcn@latest add @react-bits/ScrollVelocity-TS-TW
npx shadcn@latest add @react-bits/AnimatedContent-TS-TW
```

The CLI resolves `@react-bits/<name>` → `https://reactbits.dev/r/<name>.json`, installs the listed `dependencies` (e.g. `gsap`, `motion`) via your package manager, and writes the component file.

**Default target path:** the registry files target `ComponentName/ComponentName.tsx`. With our `components.json` aliases (`"components": "@/components"`), they land under **`src/components/<Name>/<Name>.tsx`**. After install, import with:

```ts
import SplitText from "@/components/SplitText/SplitText";
```

> Tip: review the diff after each `add` — React Bits ships plain `.tsx`, so you can relocate to `src/components/animations/` and fix the import if you prefer a flatter tree. Re-running `add` overwrites, so move + commit once.

### 1.3 Alternative install (no shadcn) — jsrepo / manual

Each component page also offers **jsrepo** and a **copy-paste** tab. If the shadcn registry ever rate-limits or you want zero CLI:

```bash
npx jsrepo add @react-bits/<Name>-TS-TW
```

…or just copy the `.tsx` from the component page into `src/components/`. Then `npm i motion` and/or `npm i gsap @gsap/react` yourself (see §3).

### 1.4 Tailwind v4 notes (IMPORTANT)

- React Bits `-TW` variants are **already authored for Tailwind v4** (utility classes only, no `tailwind.config.js` plugin needed). Our `components.json` correctly has `tailwind.config: ""` (empty) for v4 — leave it empty.
- A few components rely on **arbitrary values / inline `style`** (e.g. `ScrollVelocity`, `GradientText`) — these are framework-agnostic and need no `@theme` changes.
- Where a component exposes a `className` prop, pass our design tokens directly: `font-display`, `text-foreground`, `text-primary`, `bg-forest`. No token remap required.
- If a component hard-codes a color, override via `className` (Tailwind v4 cascade) rather than editing the vendored file, so future re-installs stay clean.

---

## 2. CATALOG — most useful components for an Ather-style premium EV site

Grouped by the four motion patterns we're imitating. **Install id** is the `-TS-TW` name; engine column = runtime dependency (see §3).

### A. Animated / clip text reveals (for headings — the Ather "letters assemble" look)

| Component        | One-line use                                                            | Install id                  | Engine |
| ---------------- | ----------------------------------------------------------------------- | --------------------------- | ------ |
| **SplitText**    | Per-character/word/line staggered entrance on scroll — hero & H2s.      | `SplitText-TS-TW`           | gsap   |
| **BlurText**     | Words fade in from blur — softer, premium sub-headings.                 | `BlurText-TS-TW`            | motion |
| **ScrollFloat**  | Characters float/scale up tied to scroll position — section titles.     | `ScrollFloat-TS-TW`         | gsap   |
| **ScrollReveal** | Paragraph reveals word-by-word with blur+opacity as it enters view.     | `ScrollReveal-TS-TW`        | gsap   |
| **GradientText** | Live animated gradient sweep across text — accent words / CTAs.         | `GradientText-TS-TW`        | motion |
| **RotatingText** | Cycles through a list of words in one slot — "Ride / Charge / Own".     | `RotatingText-TS-TW`        | motion |
| **TextPressure** | Variable-font weight reacts to cursor proximity — interactive wordmark. | `TextPressure-TS-TW`        | none   |

### B. Scroll-velocity / running-text marquee (the per-image infinite marquees)

| Component          | One-line use                                                              | Install id              | Engine |
| ------------------ | ------------------------------------------------------------------------- | ----------------------- | ------ |
| **ScrollVelocity** | Infinite marquee whose speed/skew reacts to scroll velocity — over images.| `ScrollVelocity-TS-TW`  | motion |

> This is the single best match for "per-image infinite running-text marquees." Wrap each product image and feed it the product name; it loops forever and accelerates with scroll. (No dedicated `Marquee` component exists in core React Bits — `ScrollVelocity` is the canonical one.)

### C. Animated content / section reveals (scroll-triggered entrance)

| Component           | One-line use                                                          | Install id               | Engine |
| ------------------- | --------------------------------------------------------------------- | ------------------------ | ------ |
| **AnimatedContent** | Wrap any block; it slides/fades/scales in on scroll — the workhorse.   | `AnimatedContent-TS-TW`  | gsap   |
| **AnimatedList**    | Staggered list-item reveal with scale/opacity on enter — spec lists.  | `AnimatedList-TS-TW`     | motion |
| **CountUp**         | Animated number count when in view — range km, top speed, 0-60 stats. | `CountUp-TS-TW`          | motion |

### D. Image / card hover effects (product cards)

| Component           | One-line use                                                            | Install id               | Engine |
| ------------------- | ----------------------------------------------------------------------- | ------------------------ | ------ |
| **TiltedCard**      | 3D perspective tilt + image that follows the pointer — product cards.   | `TiltedCard-TS-TW`       | motion |
| **SpotlightCard**   | Radial spotlight follows cursor over a card — feature/spec cards.       | `SpotlightCard-TS-TW`    | none   |
| **PixelTransition** | Pixel-dissolve to reveal a second image on hover — color/variant swap.  | `PixelTransition-TS-TW`  | gsap   |

> **Hero that shrinks + rounds on scroll** (the headline Ather effect): React Bits has **no single drop-in** for this. Build it ourselves with `motion`'s `useScroll` + `useTransform` (scale + `borderRadius`) — covered in the `libs-motion` research, not here. React Bits `AnimatedContent`/`ScrollFloat` complement it but don't replace it.

---

## 3. Dependency & compatibility flags

### 3.1 Two animation engines — you'll pull in BOTH if you mix the catalog

| Engine                          | Pulled in by (above)                                              | npm install                          |
| ------------------------------- | ---------------------------------------------------------------- | ------------------------------------ |
| **`motion@^12`** (ex-Framer)    | BlurText, GradientText, RotatingText, ScrollVelocity, AnimatedList, CountUp, TiltedCard | `npm i motion`     |
| **`gsap@^3.13` + `@gsap/react`**| SplitText, ScrollFloat, ScrollReveal, AnimatedContent, PixelTransition | `npm i gsap @gsap/react`      |
| **none** (native rAF / CSS)     | TextPressure, SpotlightCard                                      | — (zero new deps)                    |

The shadcn CLI installs these automatically, but **decide deliberately**: shipping both `motion` (~50KB) and `gsap` (~70KB+plugins) is heavy. **Recommendation: standardize on `motion`** for our redesign (hero shrink, marquee, reveals, counters all work with it) and only adopt the `gsap`-based ones (SplitText, AnimatedContent, ScrollReveal) if their look is essential — or reimplement their effect on `motion` to keep a single engine.

> Note `import` path is **`motion/react`** (NOT `framer-motion`). The old `framer-motion` package still works but `motion` is the current name. None of these are currently in our `package.json` — every one is a NEW dependency.

### 3.2 React 19 / Next 15 / Tailwind v4 compatibility

- **`motion@^12`**: ✅ fully supports **React 19** and **Next.js 15**. All components are **client-only** — they `'use client'` already, but **any wrapper you write around them must also be `'use client'`** or you'll get hydration errors in the App Router. Safe with the React Compiler.
- **`gsap@^3.13` + `@gsap/react`**: ✅ works with React 19 / Next 15. `@gsap/react`'s `useGSAP()` hook is SSR-safe (effects run client-side). Plugins used by these components — `ScrollTrigger`, **`SplitText`** (now free in GSAP 3.13) — are registered inside the component, no license/registration step needed.
- **Tailwind v4**: ✅ `-TW` variants are v4-native; keep `components.json → tailwind.config: ""`. No `@theme` edits required to install; use our tokens via `className`.
- **SSR-standalone build**: components are client islands, so they're excluded from the server bundle — no impact on `next build` standalone output. Just ensure each is rendered inside a client boundary.

### 3.3 prefers-reduced-motion (REQUIRED — must add ourselves)

React Bits components do **not** ship `prefers-reduced-motion` handling. Add a global guard so we honor accessibility:

```css
/* src/app/globals.css — global safety net */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

For `motion`-based components, prefer a runtime gate so the effect is skipped (not just sped up):

```tsx
"use client";
import { useReducedMotion } from "motion/react";

export function Reveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;      // render static, no animation
  // ...render the React Bits component here
}
```

For `gsap` components, wrap the timeline in `gsap.matchMedia()` with
`"(prefers-reduced-motion: no-preference)"` so animations only build when motion is allowed. (The CSS net above is the minimum; per-component gating is the correct fix.)

---

## Quick start for the redesign

```bash
# single-engine path (recommended): motion only
npm i motion
npx shadcn@latest add @react-bits/ScrollVelocity-TS-TW   # per-image marquee
npx shadcn@latest add @react-bits/BlurText-TS-TW          # heading reveal
npx shadcn@latest add @react-bits/CountUp-TS-TW           # stat counters
npx shadcn@latest add @react-bits/TiltedCard-TS-TW        # product cards
# add gsap ONLY if you want SplitText/AnimatedContent's exact look:
npm i gsap @gsap/react
npx shadcn@latest add @react-bits/SplitText-TS-TW
npx shadcn@latest add @react-bits/AnimatedContent-TS-TW
```

Sources: [reactbits.dev](https://reactbits.dev) · [React Bits GitHub README](https://github.com/DavidHDev/react-bits/blob/main/README.md) · registry JSON `https://reactbits.dev/r/<Name>-TS-TW.json` · [Motion React upgrade/compat](https://motion.dev/docs/react-upgrade-guide) · [shadcn Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4)
