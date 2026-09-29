# Libraries Wiring Guide — Motion + shadcn Registry (React Bits)

> Stack: Next.js 15.5 (App Router, SSR standalone) · React 19 · Tailwind v4 (CSS-first `@theme`) ·
> shadcn/ui new-york (`cssVariables: true`). Goal: replace hand-rolled animations with **ready-made
> libraries** to imitate Ather's motion (scroll reveals, hero shrink+round on scroll, per-image marquees)
> **without bloat or jank**. All commands/imports below are quoted from the **official 2025-2026 docs**.

---

## 0. What we install (exact commands)

```bash
# Motion for React — package is "motion" (NOT framer-motion). Source: motion.dev/docs/react-installation
npm install motion

# React Bits marquee/text via the shadcn registry already wired in components.json (@react-bits).
# Source: ui.shadcn.com/docs/cli — namespaced add syntax is `add @namespace/name`
npx shadcn@latest add @react-bits/scroll-velocity
# (browse https://reactbits.dev/ for the exact slug; install only the leaf you use)
```

**Compatibility (verified):**
- **Motion + React 19 / Next 15:** fully supported. `motion` v11+ targets React 19. Import the client
  entry `motion/react` only inside `"use client"` files. Motion also ships `motion/react-client`
  (pre-marked client) but we keep our own `"use client"` leaves, so plain `motion/react` is correct.
- **Tailwind v4:** Motion is JS-driven (inline styles / Web Animations API) — **no Tailwind plugin, no
  config**. It does not touch our `@theme`. Zero conflict with CSS-first setup.
- **shadcn CLI + Tailwind v4:** the CLI reads `components.json` (`style: new-york`, `cssVariables: true`,
  `css: src/app/globals.css`). It writes CSS vars into `globals.css` and components into `@/components/ui`.
  Because our tokens live in `@theme inline`, **review any vars the CLI appends** to `:root` and delete
  duplicates — React Bits components are mostly self-styled, so usually nothing is appended.
- **`tailwindcss-animate`** stays for shadcn primitives; it does not overlap with Motion.

---

## 1. Shared motion config + reusable wrappers — file map

Create one client module so every page imports the **same** tuned primitives (consistency + one place to
kill motion globally). Animations stay on **leaf** components; pages stay **server components**.

| File | Type | Purpose |
|---|---|---|
| `src/components/motion/config.ts` | shared consts | EASE, durations, distances, viewport, variants. No `"use client"` needed (pure data). |
| `src/components/motion/lazy-motion-provider.tsx` | `"use client"` | `LazyMotion` with `domAnimation` features (tree-shakes Motion). |
| `src/components/motion/reveal.tsx` | `"use client"` | `<Reveal>` / `<FadeIn>` — fade+rise on `whileInView`. Drop-in replacement for old `reveal.tsx`. |
| `src/components/motion/stagger.tsx` | `"use client"` | `<Stagger>` + `<StaggerItem>` — orchestrated children reveal. |
| `src/components/motion/shrink-hero.tsx` | `"use client"` | Scroll-linked hero shrink+round via `useScroll`+`useTransform`. |
| `src/components/motion/marquee.tsx` | `"use client"` | Per-image running text — React Bits `ScrollVelocity`, or a thin `m.div` fallback. |

> **`m` not `motion`:** every wrapper uses the lightweight `m` component (`motion/react-m`, ~4.6kb) under a
> single `LazyMotion` at the layout. The full `motion` import (`+34kb`) is never shipped.

### Provider placement (keep pages server-rendered)
Mount `LazyMotion` **once** inside the existing `[locale]/layout.tsx`, wrapping `{children}`. `LazyMotion`
is a client boundary but renders children as-is, so server pages below it stay server components.

```tsx
// src/app/[locale]/layout.tsx  (add the provider; rest unchanged)
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
// ...
<LanguageProvider locale={locale}>
  <Navbar />
  <LazyMotionProvider>
    <div>{children}</div>
  </LazyMotionProvider>
  <Footer />
</LanguageProvider>
```

```tsx
// src/components/motion/lazy-motion-provider.tsx
"use client";
import { LazyMotion, domAnimation } from "motion/react";
// domAnimation (+15kb): animations, variants, exit, hover/tap/focus + whileInView. Enough for all our
// reveals/marquees. Use domMax only if a page needs drag/layout animations (it doesn't today).
export function LazyMotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
}
```

`strict` makes Motion throw if anyone imports the heavy `motion.*` instead of `m.*` — a build-time guard
against accidental bloat.

---

## 2. The shared config + wrapper code (copy-paste)

```ts
// src/components/motion/config.ts
import type { Variants, Transition } from "motion/react";

// Ather feel: ease-out expo, ~0.6–0.7s, 16px rise. Matches our old cubic-bezier(.16,1,.3,1).
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const REVEAL_DURATION = 0.7;
export const REVEAL_Y = 16;

// Fire once, when 15% visible, slightly before fully on-screen (mirrors old rootMargin -8%).
export const VIEWPORT_ONCE = { once: true, amount: 0.15, margin: "0px 0px -8% 0px" } as const;

export const transition: Transition = { duration: REVEAL_DURATION, ease: EASE_OUT_EXPO };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: REVEAL_Y },
  show: { opacity: 1, y: 0, transition },
};

// Parent that orchestrates children; children use `fadeUp` and inherit the cascade.
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
```

```tsx
// src/components/motion/reveal.tsx  — REPLACES src/components/reveal.tsx (same <Reveal> name + API)
"use client";
import * as m from "motion/react-m";
import { fadeUp, VIEWPORT_ONCE, transition } from "./config";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** entrance delay in seconds (kept for stagger parity; old API used ms — see migration note) */
  delay?: number;
  /** vertical offset px before reveal (default 16) */
  y?: number;
  as?: keyof typeof m; // "div" | "section" | "li" | "h2" ...
};

export function Reveal({ children, className, delay = 0, y, as = "div" }: RevealProps) {
  const Comp = m[as] as typeof m.div;
  // prefers-reduced-motion is handled GLOBALLY by Motion's reducedMotion — see §6. No per-component guard.
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_ONCE}
      variants={{
        hidden: { opacity: 0, y: y ?? 16 },
        show: { opacity: 1, y: 0, transition: { ...transition, delay } },
      }}
    >
      {children}
    </Comp>
  );
}

// Alias so call-sites can read semantically; identical behavior.
export const FadeIn = Reveal;
```

```tsx
// src/components/motion/stagger.tsx
"use client";
import * as m from "motion/react-m";
import { staggerParent, fadeUp, VIEWPORT_ONCE } from "./config";

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div className={className} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE} variants={staggerParent}>
      {children}
    </m.div>
  );
}
// Each direct child of <Stagger> wraps in <StaggerItem> to inherit the cascade (no per-item delay math).
export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <m.div className={className} variants={fadeUp}>{children}</m.div>;
}
```

```tsx
// src/components/motion/shrink-hero.tsx — scroll-LINKED (smooth), replaces the scrollY>24 boolean toggle
"use client";
import { useRef } from "react";
import * as m from "motion/react-m";
import { useScroll, useTransform } from "motion/react";

export function ShrinkHero({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Track the first ~70vh of scroll on this element.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "70vh start"] });
  const padding = useTransform(scrollYProgress, [0, 1], ["0rem", "0.75rem"]);
  const radius = useTransform(scrollYProgress, [0, 1], ["0rem", "1.75rem"]);
  const height = useTransform(scrollYProgress, [0, 1], ["100svh", "90svh"]);
  return (
    <m.div ref={ref} style={{ paddingTop: padding, paddingLeft: padding, paddingRight: padding }}>
      <m.div style={{ borderRadius: radius, height, overflow: "hidden" }}>{children}</m.div>
    </m.div>
  );
}
```

> Scroll-linked values are driven off a single `requestAnimationFrame` by Motion — **smoother than the
> old `scroll` listener + boolean** (which snapped at 24px). `useScroll`/`useTransform` import from
> `motion/react` (hooks), elements from `motion/react-m`. Confirmed against motion.dev/docs/react-scroll-animations.

---

## 3. shadcn-registry (React Bits) install specifics for Tailwind v4

Our `components.json` already declares the registry:
```json
"registries": { "@react-bits": "https://reactbits.dev/r/{name}.json" }
```
So no `init` is needed — only **add**:
```bash
npx shadcn@latest add @react-bits/scroll-velocity      # the running-text marquee
```
The CLI respects `style: "new-york"`, `cssVariables: true`, and writes into `@/components/ui` (alias from
`components.json`). **After every React Bits add:**
1. Open the diff on `src/app/globals.css` — if the CLI appended `:root` vars, **delete any that duplicate
   our `@theme inline` tokens** (keeps the design system single-sourced).
2. Re-tokenize the component's hard-coded colors to our utilities (`text-foreground`, `text-on-forest-accent`).
3. Convert the file's `framer-motion`/`motion` import to **`motion/react-m`** so it rides our `LazyMotion`.

If a React Bits leaf is heavy or not worth the dependency, prefer the **tiny in-house marquee** in §4 — it
needs no new package and reuses our existing tokens.

---

## 4. Bundle-size discipline

- **`LazyMotion` + `m`**: ship ~4.6kb core; `domAnimation` (+15kb) loads once. Never import `motion.*`
  directly — `strict` mode enforces this.
- **Tree-shaking**: only import the hooks you use (`useScroll`, `useTransform`) from `motion/react`.
- **Dynamic import for heavy/below-fold effects**: keep the existing pattern (`next/dynamic`, e.g.
  `ComparisonTable`). For any expensive React Bits effect that's below the fold:
  ```tsx
  const ScrollVelocity = dynamic(() => import("@/components/ui/scroll-velocity"), { ssr: false });
  ```
- **Critical path**: the hero's first image keeps `priority`; the `ShrinkHero` math is cheap rAF and does
  not block paint. Marquees and reveals are non-blocking (CSS/JS post-hydration).
- **Keep pages server components**: only the animated leaf (`landing.tsx`, product leaves) is `"use client"`.
  Never add `"use client"` to a `page.tsx` or `layout.tsx` beyond the single `LazyMotionProvider` boundary.

### In-house marquee (no extra dep) — preferred replacement for the CSS marquee
```tsx
// src/components/motion/marquee.tsx
"use client";
import * as m from "motion/react-m";
export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null;
  const track = [...items, ...items];
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/15 bg-black/25 py-3 backdrop-blur-sm">
      <m.div
        className="flex w-max items-center whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      >
        {track.map((it, i) => (
          <span key={i} className="flex items-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/85">
            {it}<span className="mx-6 text-on-forest-accent">/</span>
          </span>
        ))}
      </m.div>
    </div>
  );
}
```
Then **delete** `.animate-marquee` + `@keyframes marquee` from `globals.css` (lines ~165-188).

---

## 5. Concrete migration plan

**Phase A — install + scaffold (no behavior change)**
1. `npm install motion`.
2. Create `src/components/motion/{config.ts,lazy-motion-provider.tsx,reveal.tsx,stagger.tsx,shrink-hero.tsx,marquee.tsx}`.
3. Mount `<LazyMotionProvider>` in `src/app/[locale]/layout.tsx` (§1).

**Phase B — replace hand-rolled `reveal.tsx`**
4. Re-export shim during transition: make old `src/components/reveal.tsx` `export { Reveal } from "@/components/motion/reveal";` so existing imports keep working, **then** update `landing.tsx`'s import to the new path and delete the shim.
5. **API note:** old `delay` was **ms** (`delay={90}`); new `delay` is **seconds**. Update call-sites:
   `delay={(i % 2) * 90}` → `delay={(i % 2) * 0.09}`. Or better, replace those grids with `<Stagger>/<StaggerItem>` (drops the per-item index math entirely).

**Phase C — landing.tsx (`src/app/_home/landing.tsx`)**
6. Swap the local `Marquee` for `@/components/motion/marquee` (or `@react-bits/scroll-velocity`).
7. Replace the `scrolled` state + `scroll` listener + `EASE`/padding/borderRadius/height inline toggles
   (lines 37, 223-317) with `<ShrinkHero>` wrapping the `<Carousel>` block — scroll-linked, jank-free.
8. Convert `<Reveal>` grids in "Electric Family", "Advantage", "Keep Exploring" to `<Stagger>/<StaggerItem>`.

**Phase D — globals.css cleanup**
9. Remove `.animate-marquee`, its reduced-motion override, and `@keyframes marquee` (lines 165-170, 185-188).
   Keep `float`/`slide-down` until their consumers are migrated.

**Phase E — roll out across all pages**
10. Audit every `[locale]/**` page; wherever a server page renders a client leaf, add `<Reveal>`/`<Stagger>`
    inside the **leaf**. For Ather-style sticky-pinned product feature sections (per `ather-playbook.md`),
    reuse `useScroll({ target, offset })` exactly like `ShrinkHero`.
11. Establish the rule: **all** scroll motion goes through `@/components/motion/*` — no new `@keyframes`,
    no new `IntersectionObserver`, no raw `motion.*` imports.

---

## 6. prefers-reduced-motion (global, one switch)

Do **not** hand-roll per-component guards. Set Motion's global reduced-motion in the provider so every
`whileInView`/scroll animation respects the OS setting and only opacity (not transform) animates:

```tsx
// inside lazy-motion-provider.tsx
import { MotionConfig } from "motion/react";
// reducedMotion="user" => when OS prefers reduced motion, Motion disables transform/layout animations
<MotionConfig reducedMotion="user">
  <LazyMotion features={domAnimation} strict>{children}</LazyMotion>
</MotionConfig>
```
Our `globals.css` `@media (prefers-reduced-motion: reduce)` block (lines 141-148) stays as defense-in-depth
for any non-Motion CSS animation. Combined, reduced-motion users get instant, transform-free reveals.

---

## 7. Incompatibility flags (summary)
- ✅ Motion `motion` package works with React 19 + Next 15 App Router. Use `motion/react` in client files only.
- ✅ Tailwind v4 CSS-first: Motion needs **no** plugin/config; it won't touch `@theme`.
- ✅ shadcn `new-york` + `cssVariables`: CLI add works via the registered `@react-bits` namespace; review
  appended `:root` vars to avoid duplicating our tokens.
- ⚠️ React Bits components often import `framer-motion`/`motion.*` directly — rewrite to `motion/react-m`
  to keep them under `LazyMotion` (and to satisfy `strict`).
- ⚠️ `delay` unit changes ms→seconds between old and new `Reveal`; fix call-sites during Phase B.
