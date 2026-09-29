# Marquee Library — Per-Slide Infinite Running Text

**Decision: Magic UI `Marquee`** (shadcn registry-installable). Verified against official docs/registry on 2025–2026.

## Why Magic UI wins (vs react-fast-marquee, vs React Bits)

| Criteria | Magic UI Marquee | react-fast-marquee | React Bits ScrollVelocity |
|---|---|---|---|
| Install | shadcn CLI (registry) — you own the code | `npm i` (black-box dep) | registry, but scroll-velocity is **scroll-driven**, not auto-loop |
| Tailwind v4 | Native (`@theme` CSS vars + `@keyframes`) | CSS-in-JS, ignores our tokens | varies |
| React 19 / Next 15 | **Officially supported** | peer dep caps at React 18 → needs `--legacy-peer-deps` | OK |
| Seamless w/ ~4 short items | `repeat` duplicates the WHOLE children block N× (default 4) | `autoFill` (undocumented behavior) | n/a (velocity-based) |
| Styling | Pure Tailwind classes → our `font-display`, `text-forest` etc. drop straight in | requires `gradientColor` hex, fights tokens | n/a |
| Ownership | Source vendored into `components/ui/` — editable | external | external |

**react-fast-marquee** is excellent but: its npm peer deps are `react: ">= 16.8.0 || ^18.0.0"` (no `^19`), so `npm i react-fast-marquee` warns/errors on our React 19 — you'd install with `--legacy-peer-deps`. It also styles via JS props (`gradientColor="#hex"`), so it can't consume our CSS tokens cleanly. **React Bits' ScrollVelocity** ties speed to scroll position (great for an *interactive* band, NOT a constant auto-running marquee). For Ather-style always-on running text per slide, Magic UI is the correct primitive.

## Seamless infinite loop — how it's guaranteed

Magic UI does NOT rely on measuring item width. It renders the children block `repeat` times (default `4`) inside an `overflow-hidden` flex row, then each block runs `animate-marquee`: `translateX(0)` → `translateX(calc(-100% - var(--gap)))`. Because `-100%` is exactly one block's width plus the `--gap`, when block #1 scrolls fully out, block #2 is pixel-perfectly in its place — no blank, no jump. With only ~4 short items, set `repeat={6}` (or more) so the duplicated blocks always over-fill the viewport width; the loop stays gapless regardless of how few/short the items are. This is content auto-duplication, not width math, which is why it's robust.

## Exact install command

```bash
pnpm dlx shadcn@latest add @magicui/marquee
# npm equivalent:
npx shadcn@latest add @magicui/marquee
```

This writes `components/ui/marquee.tsx` AND auto-injects the `@theme`/`@keyframes` CSS below into your `globals.css` (shadcn registry `cssVars`/`css` blocks). **Verify** these landed in `app/globals.css`; if not, paste manually:

```css
/* app/globals.css — Tailwind v4 CSS-first */
@theme inline {
  --animate-marquee: marquee var(--duration) infinite linear;
  --animate-marquee-vertical: marquee-vertical var(--duration) linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% - var(--gap))); }
}
@keyframes marquee-vertical {
  from { transform: translateY(0); }
  to   { transform: translateY(calc(-100% - var(--gap))); }
}
```

## The component (verbatim from registry — `components/ui/marquee.tsx`)

Props: `reverse` (bool, default `false`), `pauseOnHover` (bool, `false`), `vertical` (bool, `false`), `repeat` (number, `4`), plus all `<div>` props + `className`. Speed and gap are CSS vars on the wrapper: `[--duration:40s] [--gap:1rem]` — override per-instance (e.g. `[--duration:25s] [--gap:3rem]`).

```tsx
import { type ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  reverse?: boolean        // @default false
  pauseOnHover?: boolean   // @default false
  children: React.ReactNode
  vertical?: boolean       // @default false
  repeat?: number          // @default 4
}

export function Marquee({
  className, reverse = false, pauseOnHover = false,
  children, vertical = false, repeat = 4, ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        { "flex-row": !vertical, "flex-col": vertical },
        className
      )}
    >
      {Array(repeat).fill(0).map((_, i) => (
        <div key={i}
          className={cn("flex shrink-0 justify-around gap-(--gap)", {
            "animate-marquee flex-row": !vertical,
            "animate-marquee-vertical flex-col": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
```

> Note: the registry source has NO `"use client"` and no React hooks — it's a pure render, so it works in a Server Component too. But for our scroll-linked hero it'll live inside a client component anyway.

## Usage with our design tokens (Ather-style hero running text)

`app/(site)/_components/hero-marquee.tsx`:

```tsx
"use client"

import { Marquee } from "@/components/ui/marquee"

const ITEMS = ["WEDISON", "ELECTRIC", "ZERO EMISSION", "RIDE THE FUTURE"]

export function HeroMarquee() {
  return (
    <div className="relative w-full bg-forest">
      <Marquee
        repeat={6}                 // ~4 short items -> over-fill, gapless
        pauseOnHover               // optional; Ather runs non-stop, drop this for pure auto
        className="
          py-4 [--duration:28s] [--gap:3rem]
          motion-reduce:[--duration:0s]   /* reduced-motion: freeze (see below) */
        "
      >
        {ITEMS.map((t) => (
          <span
            key={t}
            className="font-display text-foreground/90 text-4xl font-semibold tracking-tight md:text-6xl"
          >
            {t}
            <span className="text-primary mx-6">•</span>
          </span>
        ))}
      </Marquee>

      {/* Token-driven fade edges (left + right) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-forest to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-forest to-transparent" />
    </div>
  )
}
```

**Token styling:** style the *children*, not the wrapper — use `font-display`, `text-foreground`, `text-primary`, and `from-forest`/`from-background` for fade gradients so everything tracks your `@theme`. Per-instance speed/gap via the `[--duration:Ns] [--gap:Nrem]` utilities on `className`.

## prefers-reduced-motion (REQUIRED)

The registry CSS hardcodes `infinite linear` and has no reduced-motion guard, so add ONE global rule to `app/globals.css`. This fully stops the marquee for users who opt out:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-marquee,
  .animate-marquee-vertical {
    animation: none !important;
    transform: none !important;
  }
}
```

Belt-and-suspenders per instance: add `motion-reduce:[animation-play-state:paused]` (Tailwind's built-in `motion-reduce:` variant) to the wrapper, or `motion-reduce:[--duration:0s]`. The global media query is the reliable one — keep it.

## Compatibility flags (React 19 / Next 15 / Tailwind v4)

- **Magic UI:** officially supports React 19 + Tailwind v4. No incompatibilities. Component is hook-free (SSR/standalone safe).
- **Tailwind v4:** uses `@theme inline` + raw `@keyframes` (CSS-first) — matches our setup. The `gap-(--gap)` / `[--duration:40s]` shorthand is v4 arbitrary-value syntax; correct, no `tailwind.config.js` needed.
- **react-fast-marquee (rejected):** v1.6.5 peer deps `react ">= 16.8.0 || ^18.0.0"` — install on React 19 needs `npm i react-fast-marquee --legacy-peer-deps`. Avoid.

## Sources
- https://magicui.design/docs/components/marquee
- https://magicui.design/r/marquee.json (registry source, verbatim)
- https://github.com/magicuidesign/magicui/blob/main/content/docs/components/marquee.mdx
- https://www.npmjs.com/package/react-fast-marquee (peer deps via `npm view`)
