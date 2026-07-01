# 05 — Tech Stack: Fonts, Theming, Images, Performance, Caching, Motion

> Research for the Wedison redesign. Verified against official docs (nextjs.org, tailwindcss.com,
> web.dev, developer.chrome.com) in June 2026. The repo runs **Next 15.5.19, React 19, Tailwind v4,
> SSR `output: "standalone"` on a Node VPS behind nginx**. Where docs already show Next 16, the
> behaviour described below is identical for 15.x unless explicitly noted.

---

## 0. Current repo audit — what is outdated / risky

Snapshot of what exists today (so the redesign knows what to change):

| Area | Current state | Verdict |
| --- | --- | --- |
| **Font** | `Geist` + `Geist_Mono` via `next/font/google`, wired to `--font-geist-sans`/`--font-geist-mono` in `src/app/[locale]/layout.tsx` and `@theme` in `globals.css` | ❌ Geist is explicitly on the user's ban list. Replace. The wiring pattern itself is correct and reusable. |
| **Image optimization** | `images.unoptimized: true` in `next.config.ts`; `sharp@0.34.5` already in `dependencies` | ❌ Optimization is OFF. This ships full-size originals → bad LCP/PageSpeed. Re-enable (see §3). |
| **Raw `<img>`** | One in `src/components/hero-section.tsx` (the LCP hero) | ❌ Worst possible place for a raw `<img>`. Must be `next/image` with `priority`. |
| **Color tokens** | Primary `#2bb075` green (`oklch(0.6731 0.1424 158.78)`); `--border`/`--input`/`--ring` hardcode a *different* teal `oklch(0.7 0.14 182.5)` that doesn't match primary | ❌ User wants to drop green. Token system also has a mismatch bug + ~130 lines of commented dead code in `globals.css`. Rebuild tokens (see §2). |
| **Dark mode** | `@custom-variant dark (&:is(.dark *))`, `next-themes` installed | ⚠️ Works, but `:is(.dark *)` excludes the `.dark` element *itself*. Use `:where(.dark, .dark *)` (see §2.4). |
| **Caching headers** | nginx caches `/_next/static/` immutable only | ⚠️ Missing `/_next/image`, `/public` static assets, font caching, and gzip/brotli (see §5). |
| **Motion** | No library; `html { scroll-behavior: smooth }` set globally and unconditionally | ⚠️ Smooth scroll ignores `prefers-reduced-motion`; no motion system yet (see §6). |
| **`trailingSlash: true`** | set | ✅ Keep — SEO continuity. Just make sure nginx/redirects agree. |

---

## 1. Fonts — `next/font` in Next 15 App Router

`next/font` **self-hosts** every font at build time (Google or local), injects `@font-face`, and
generates a matched **fallback metric override** (`size-adjust`, `ascent-override`) so there is
**zero layout shift**. No browser request ever goes to Google. This is the only font method you should use.

### 1.1 The brand font choice (non-generic, highly readable, NOT Geist/Inter/Roboto/Poppins/Montserrat)

Pick a **variable** font (one file, all weights, smallest payload). Strong, readable, non-AI-slop options
all available on Google Fonts (so `next/font/google` self-hosts them automatically):

- **Body / UI:** `Hanken Grotesk`, `Onest`, `Instrument Sans`, `Schibsted Grotesk`, or `Figtree` — humanist grotesks with high x-height and excellent screen legibility, none of which read as "default AI font."
- **Display / headlines (pairing):** `Bricolage Grotesque` (characterful, editorial), `Clash Display` (via local font), `Unbounded`, or `Fraunces` (variable serif) for an Awwwards-grade contrast against a clean body face.
- **Mono (specs tables, EDPower data):** `Geist Mono` is banned by association — use `JetBrains Mono`, `Spline Sans Mono`, or `Martian Mono`.

> Indonesian copy is full Latin — `subsets: ['latin']` covers it. Add `'latin-ext'` only if you use
> currency/typographic glyphs outside basic Latin. Do **not** preload subsets you don't use (each adds a `<link rel=preload>`).

### 1.2 Google variable font — copy-paste pattern

Put font defs in **one file** (`src/app/fonts.ts`) so each face is instantiated once and reused.

```ts
// src/app/fonts.ts
import { Hanken_Grotesk, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

// Variable font → DO NOT pass `weight`; you get the whole 100–900 range in one file.
export const sans = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",          // default; render fallback immediately, swap when ready
  variable: "--font-sans",  // exposes a CSS var Tailwind can consume
  fallback: ["system-ui", "arial"], // metric-matched fallback list
  // adjustFontFallback: true (default) → auto size-adjust to kill CLS. Leave on.
  // preload: true (default) → injects <link rel=preload> for the latin subset.
});

export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});
```

Wire the variables on `<html>`/`<body>` in `src/app/[locale]/layout.tsx`:

```tsx
import { sans, display, mono } from "@/app/fonts";
// ...
<html lang={locale} className={`${sans.variable} ${display.variable} ${mono.variable}`}>
  <body className="font-sans antialiased">{/* ... */}</body>
</html>
```

### 1.3 Self-hosted / local variable font (`next/font/local`)

Use this for a *purchased or custom* display face (e.g. Clash Display, a foundry licence). Prefer a
single **variable `.woff2`** file. Co-locate it under `src/app/fonts/`.

```ts
import localFont from "next/font/local";

export const display = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2", // single variable file = best
  weight: "200 700",        // declare the variable axis range
  display: "swap",
  variable: "--font-display",
  // For local fonts, adjustFontFallback is 'Arial' by default; set the closest
  // system metric or `false` to disable. Keep a metric match to avoid CLS.
  adjustFontFallback: "Arial",
  declarations: [{ prop: "font-feature-settings", value: '"ss01"' }], // optional OpenType features
});
```

For **non-variable** multi-weight local fonts, pass `src` as an array of `{ path, weight, style }` objects.

### 1.4 Font rules (must-follow)

1. **Variable font, one file.** Never enumerate `weight: ['400','500','700']` for a variable face — that defeats the purpose and bloats the bundle.
2. **`display: 'swap'`** for body/brand text (fast first paint). Consider `'optional'` only for purely decorative text where a font swap flash would be jarring.
3. **Keep `adjustFontFallback` ON** (default). This is what eliminates CLS; turning it off reintroduces layout shift.
4. **Subset to `['latin']`** (+ `latin-ext` only if needed). Fewer subsets = smaller preload.
5. **One body + at most one display + (optional) one mono.** Each extra family is an extra download — the docs explicitly warn to "use multiple fonts conservatively."
6. Root-layout fonts are **preloaded on all routes** automatically; page-level fonts only on that route. Put brand fonts in the layout.

---

## 2. Tailwind v4 theming — token system, oklch, dark mode

Tailwind v4 is **CSS-first**: config lives in `globals.css` via `@theme`, not `tailwind.config.js`.
There is no JS config file in this repo (`components.json` → `"config": ""`), which is correct for v4.

### 2.1 `@theme` vs `:root` vs `@theme inline` (the rule that trips people up)

- `@theme { --color-x: … }` → generates **both** a utility (`bg-x`) **and** a CSS variable. Use for static design tokens.
- `:root { --x: … }` → a plain CSS variable, **no utility**. Use for values that change per-mode (light/dark) or per-context.
- `@theme inline { --color-x: var(--x) }` → generates the utility but **emits the `var()` reference literally** (`background: var(--x)`), so the value resolves through the cascade at use-time. **This is the correct pattern when your token value comes from another CSS variable** (theme switching, `next/font` variables). Without `inline`, Tailwind snapshots the variable's value at definition and dark-mode overrides won't apply.

The repo already uses `@theme inline` for the shadcn token bridge — keep that structure, just fix the values.

### 2.2 Recommended token architecture (move away from green)

Two layers. **Layer 1 = raw palette in `:root`** (semantic-neutral, theme-able). **Layer 2 = `@theme inline` bridge** mapping semantic names to utilities.

```css
@import "tailwindcss";
@plugin "tailwindcss-animate"; /* note: v4 also ships native animation utilities; this plugin is the shadcn-era dep */

@custom-variant dark (&:where(.dark, .dark *));

/* ---- Layer 1: brand palette + semantic tokens (oklch: L C H) ---- */
:root {
  /* Pick a NON-GREEN brand hue. "Wedison = Edison/electric" → an electric
     blue-violet or amber/voltage-yellow reads as energy without the green.
     Examples (tune in a perceptual picker like oklch.com):           */
  --brand:        oklch(0.62 0.20 264);   /* electric indigo  */
  --brand-hover:  oklch(0.56 0.21 264);
  --brand-subtle: oklch(0.95 0.04 264);
  --accent-volt:  oklch(0.86 0.17 95);    /* voltage amber accent (sparingly) */

  --background: oklch(1 0 0);
  --foreground: oklch(0.18 0.01 264);
  --card: oklch(1 0 0);
  --card-foreground: var(--foreground);
  --muted: oklch(0.97 0.005 264);
  --muted-foreground: oklch(0.50 0.01 264);

  /* FIX the repo bug: border/input/ring must derive from neutrals or brand,
     not a leftover teal. */
  --border: oklch(0.92 0.004 264);
  --input:  oklch(0.92 0.004 264);
  --ring:   var(--brand);

  --destructive: oklch(0.58 0.22 27);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.16 0.01 264);
  --foreground: oklch(0.98 0 0);
  --card: oklch(0.20 0.01 264);
  --muted: oklch(0.26 0.01 264);
  --muted-foreground: oklch(0.72 0.01 264);
  --border: oklch(1 0 0 / 10%);
  --input:  oklch(1 0 0 / 12%);
  --brand:  oklch(0.68 0.18 264);  /* lift L in dark for contrast */
}

/* ---- Layer 2: bridge to utilities (inline so dark-mode vars resolve) ---- */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--brand);
  --color-primary-foreground: oklch(0.99 0 0);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* fonts from next/font */
  --font-sans: var(--font-sans);
  --font-display: var(--font-display);
  --font-mono: var(--font-mono);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-lg: var(--radius);
}
```

### 2.3 Why oklch (keep it)

oklch is **perceptually uniform**: changing only `L` (lightness) gives an even tint/shade ramp, and a
fixed `C`/`H` keeps hue consistent across the scale — ideal for generating a brand ramp (50→950) by
walking `L`. It also unlocks wide-gamut P3 color on modern displays. Tailwind v4's default palette is
already oklch, so brand tokens should match. Author colors at oklch.com.

### 2.4 Dark mode — exact v4 syntax

The repo's `@custom-variant dark (&:is(.dark *))` is subtly wrong: `.dark *` matches *descendants*
of `.dark` but **not the `.dark` element itself**. Use the official selector-list form so the toggled
element is included:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

`next-themes` (already installed) drives the `.dark` class on `<html>`. To avoid a flash of wrong
theme (FOUC) on SSR, render `<ThemeProvider attribute="class">` and let next-themes inject its
pre-hydration script. `:where()` keeps specificity at 0 so dark utilities don't fight base styles.

### 2.5 Token rules (must-follow)

1. **One source of truth.** Semantic tokens in `:root`/`.dark`; bridge in `@theme inline`. Components only ever use semantic utilities (`bg-primary`, `text-muted-foreground`) — never raw hex/oklch inline.
2. **No green as primary.** Replace `#2bb075`. Keep the green only if it survives as a tertiary chart color.
3. **Delete the ~130 lines of commented dead CSS** in `globals.css` and the duplicated/mismatched teal in `--border`/`--input`/`--ring`.
4. **`@theme inline` for anything backed by a CSS variable** (theme tokens, font vars); plain `@theme` only for truly static tokens.

---

## 3. `next/image` — re-enable optimization on the standalone VPS

### 3.1 The headline fix

`images.unoptimized: true` disables the optimizer entirely — every image ships at full resolution in
its original format. **Remove that line.** `sharp` (in `dependencies`) is the right engine; on Next 15
`output: "standalone"`, the server uses `sharp` automatically — no extra wiring beyond having it
installed (the repo already does). The optimizer writes resized/re-encoded images to `.next/cache`, so
the **PM2/Node process must have read/write on `.next/cache`** (it does, since you copy it in `postbuild`;
just don't make that dir read-only).

### 3.2 Recommended `next.config.ts` `images` block

```ts
const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  images: {
    // unoptimized: true,  ← DELETE THIS LINE
    formats: ["image/avif", "image/webp"], // AVIF first (≈20% smaller), WebP fallback
    minimumCacheTTL: 2678400,              // 31d — long TTL = fewer re-encodes on the VPS
    qualities: [60, 75, 90],               // Next 16 requires whitelisting qualities used by `quality`
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // default; trim if you never serve 4K
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],            // default; for sub-viewport images
    remotePatterns: [
      { protocol: "https", hostname: "wedison.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // dangerouslyAllowSVG stays OFF unless you must optimize SVG (it's a XSS vector).
  },
};
```

Notes from the docs: format **array order matters** (first `Accept` match wins, so AVIF→WebP).
AVIF encodes ~50% slower but caches and compresses better; the long `minimumCacheTTL` keeps the VPS
from re-encoding hot images. **Because nginx sits in front, it MUST forward the `Accept` header** to
the Next server, or every browser gets the same (wrong) format — see §5.

### 3.3 Component usage rules

- **LCP hero** (`hero-section.tsx`, currently a raw `<img>`): convert to `next/image` with `priority`
  (preloads, disables lazy-load). One `priority` image per page max.
  ```tsx
  <Image src="/hero.jpg" alt="Wedison Athena" fill priority
         sizes="100vw" placeholder="blur" blurDataURL={heroBlur} />
  ```
- **`sizes` is mandatory for `fill` images.** Without it the browser downloads the largest candidate.
  The repo's `_home/landing.tsx` already does this well (`sizes="(max-width:768px) 80vw, 60vw"`) — replicate that everywhere, fix anything using `fill` without `sizes`.
- **`placeholder="blur"`**: automatic for **static imports** (`import hero from "./hero.jpg"`); for
  remote/dynamic `src` you must supply `blurDataURL` (generate a tiny base64 with Plaiceholder or a build script). Prefer static imports where possible — they also get a content hash + `immutable` cache forever.
- **Below-the-fold images stay lazy** (default). Never put `priority`/`loading="eager"` on them.
- Set explicit `width`/`height` (or `fill` + sized parent) on **every** image to reserve space → CLS = 0.

---

## 4. Performance & Core Web Vitals (high PageSpeed)

Targets (web.dev, 75th percentile): **LCP ≤ 2.5s · CLS ≤ 0.1 · INP ≤ 200ms** (INP "needs improvement" 201–500ms, "poor" >500ms).

### 4.1 LCP
- LCP is almost always the hero image or hero heading. Use `next/image` + `priority` on it; self-hosted fonts via `next/font` (no render-blocking Google request).
- Keep the hero **server-rendered** (RSC) — no client JS needed before paint.
- Preload only what's above the fold; `next/font` preloads the brand subset automatically.

### 4.2 CLS
- `next/font` + `adjustFontFallback` → no font-swap shift. `next/image` with dimensions → no image shift.
- Reserve space for anything async (carousels, embeds). The repo's `embla`/`keen-slider` hero is a CLS risk — give the track a fixed aspect-ratio container.

### 4.3 INP (the one most sites fail now)
Three phases: **input delay → processing → presentation**. Fixes:
- **Ship less JS.** Default to **React Server Components**; add `"use client"` only at the leaf that needs interactivity. The landing pages are mostly static content + a few interactive widgets (navbar, language toggle, carousel, contact form) — those should be the *only* client components.
- **`next/dynamic`** for heavy, below-the-fold or interaction-gated client widgets (e.g. the contact form with `react-hook-form`/`zod`, the comparison table, recaptcha):
  ```tsx
  const ContactForm = dynamic(() => import("@/components/contact3"), { ssr: false });
  ```
- **Yield to the main thread** in any long handler; debounce scroll/resize listeners; avoid synchronous layout thrash.
- **`content-visibility: auto`** on long off-screen sections (FAQ list, media grid) to skip rendering work until scrolled near.
- **Trim the bundle:** `react-intersection-observer`, two carousel libs (`embla` *and* `keen-slider` are both installed — pick one), and `@emailjs/browser` should all be code-split or removed. Run `next build` and watch the per-route first-load JS; keep shared JS lean.

### 4.4 RSC vs Client — the discipline
Server by default. A component needs `"use client"` only if it uses state/effects, browser APIs, or event handlers. Pass server-fetched data down as props; never fetch in a client component what a server component could fetch.

---

## 5. Caching — Next 15 model + nginx/VPS headers

### 5.1 Next 15 caching model (changed from 14)
In Next 15+, **less is cached by default**:
- `fetch()` is **not cached** by default (`cache: 'force-cache'` to opt in; `next: { revalidate: N }` for ISR-style; `next: { tags: [...] }` + `revalidateTag()` for on-demand).
- **GET Route Handlers** and the **client Router Cache** for page segments are uncached by default.
- For DB/ORM (no `fetch`): wrap in `unstable_cache(fn, keys, { revalidate, tags })` or React `cache()` for per-request dedupe.
- **Route segment config:** `export const dynamic = 'force-static' | 'force-dynamic' | 'error' | 'auto'`; `export const revalidate = false | 0 | N`.

**For this mostly-static marketing site:** the pages have no per-request data, so they should be
**statically prerendered** (the default for routes with no dynamic APIs). `generateStaticParams` for
`[locale]` is already in place. Keep pages static; only the middleware (locale redirect) runs per
request, which is fine. **Do not sprinkle `force-dynamic`** — it would needlessly make pages dynamic
and hurt TTFB. If/when you add a real data source, opt **into** caching explicitly with `revalidate`/tags.

### 5.2 Static-asset / nginx headers (VPS)
Current nginx caches `/_next/static/` immutable only. Add the rest:

```nginx
# Next build assets — content-hashed, safe to cache forever.
location /_next/static/ {
    proxy_pass http://127.0.0.1:3002;
    proxy_set_header Host $host;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# Optimized images — let Next set Cache-Control (driven by minimumCacheTTL);
# CRITICAL: forward Accept so AVIF/WebP negotiation works behind the proxy.
location /_next/image {
    proxy_pass http://127.0.0.1:3002;
    proxy_set_header Host $host;
    proxy_set_header Accept $http_accept;
}

# /public static files (logos, fonts you self-host, og images).
location ~* \.(woff2|jpg|jpeg|png|webp|avif|svg|ico)$ {
    proxy_pass http://127.0.0.1:3002;
    proxy_set_header Host $host;
    add_header Cache-Control "public, max-age=2592000"; # 30d (raise to immutable if hashed)
}

# Compress text responses (HTML/CSS/JS/JSON/SVG). Brotli > gzip if module available.
gzip on;
gzip_types text/css application/javascript application/json image/svg+xml;
gzip_comp_level 6;
# brotli on; brotli_types text/css application/javascript application/json image/svg+xml; # if ngx_brotli installed
```

Also forward the existing `X-Forwarded-*` headers (the repo already does — middleware relies on them).
Keep `proxy_http_version 1.1`. The HSTS/nosniff/Referrer-Policy headers already present are good; add a
`Content-Security-Policy` when the design settles.

### 5.3 Caching rules (must-follow)
1. Marketing pages = **static prerender**; don't force dynamic.
2. Re-enabled image optimizer caches to `.next/cache` — ensure write perms and **a long `minimumCacheTTL`**.
3. nginx: immutable for `/_next/static/`, forward `Accept` to `/_next/image`, 30d for `/public`, gzip/brotli on text.
4. Opt **into** data caching explicitly (Next 15 default is uncached); use tags + `revalidateTag` for future CMS content.

---

## 6. Motion — tasteful and fast

Hierarchy of cost (cheapest → most expensive): **CSS transitions/keyframes → View Transitions API → Motion One (Web Animations) → Framer/`motion`**.

### 6.1 Default to CSS / compositor-only props
Animate **only `transform` and `opacity`** (compositor thread, no layout/paint). Tailwind v4 has
native transition/animation utilities; `tailwindcss-animate` is already available. Reserve JS animation
for genuinely stateful, interruptible, gesture-driven UI.

### 6.2 View Transitions API (the 2025/26 sweet spot)
Reached **Baseline "newly available" Oct 2025** (Chrome/Edge 111+, Firefox 144+, Safari 18+ ≈ 89% traffic).
Runs on the **compositor thread**; the browser snapshots old/new states and interpolates — JS can't
match it for cost (typically 1–5ms overhead). Use it for page/section transitions. Pair with the
Speculation Rules API (prerender next page) to remove the LCP penalty entirely. CSS opt-in:
```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }
}
```
> Next.js has an experimental `ViewTransition` component; on a mostly-MPA marketing site, the native
> CSS `@view-transition` for cross-document navigations is simpler and dependency-free — prefer it.

### 6.3 When a JS motion library is worth it
- **Motion One** (`motion` package, ~5KB, uses the native Web Animations API) for occasional scroll-linked or spring micro-interactions — far lighter than Framer.
- **Framer Motion / `motion/react`** only if you need orchestrated layout animations, drag, or shared-element choreography that CSS can't express. It pulls real JS weight (hurts INP/first-load) — gate it behind `next/dynamic`, use on client leaves only, and never on the hero/above-the-fold path.
- The repo currently has **no** motion lib — keep it that way until a specific interaction demands one.

### 6.4 `prefers-reduced-motion` (accessibility, non-negotiable)
- The repo's global `html { scroll-behavior: smooth }` ignores the user preference. Gate it:
  ```css
  @media (prefers-reduced-motion: no-preference) {
    html { scroll-behavior: smooth; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- Reduced-motion ≠ no motion: keep **subtle fades** (vestibular-safe), drop **slide/zoom/parallax**.
- In JS, branch on `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before calling `startViewTransition`/heavy animations.

---

## 7. Must-follow checklist (apply during redesign)

1. **Font:** one variable brand font via `next/font` (NOT Geist/Inter/Roboto/Poppins/Montserrat) + optional display + mono; `display:'swap'`, `subsets:['latin']`, keep `adjustFontFallback`; wire via CSS variable + `@theme inline`.
2. **Color:** kill green `#2bb075`; build a 2-layer oklch token system (`:root`/`.dark` + `@theme inline`); fix the border/input/ring teal mismatch; delete dead CSS.
3. **Dark mode:** `@custom-variant dark (&:where(.dark, .dark *))` + next-themes `attribute="class"`.
4. **Images:** delete `unoptimized:true`; `formats:["image/avif","image/webp"]`, `minimumCacheTTL` high, `qualities` whitelisted; convert the raw hero `<img>` to `next/image` + `priority`; `sizes` on every `fill`; blur placeholders; static imports where possible.
5. **Perf:** RSC by default, `"use client"` only on interactive leaves; `next/dynamic` for form/recaptcha/heavy widgets; drop one of the two carousel libs; `content-visibility:auto` on long sections; hit LCP≤2.5s / CLS≤0.1 / INP≤200ms.
6. **Caching:** keep pages static (don't force dynamic); nginx immutable `/_next/static/`, forward `Accept` to `/_next/image`, 30d `/public`, enable gzip/brotli; opt into data caching explicitly when a CMS lands.
7. **Motion:** CSS/transform+opacity first; native View Transitions for page nav; Motion One/Framer only behind `next/dynamic`; always honor `prefers-reduced-motion` (gate the global smooth-scroll).

---

## Sources

- Next.js Font Optimization — https://nextjs.org/docs/app/getting-started/fonts
- Next.js `next/font` API (options, adjustFontFallback, preload, variable, Tailwind v4 wiring) — https://nextjs.org/docs/app/api-reference/components/font
- Next.js `next/image` API (formats, qualities, minimumCacheTTL, placeholder, sizes, deviceSizes) — https://nextjs.org/docs/app/api-reference/components/image
- Next.js caching model (fetch/segment config/unstable_cache/revalidate) — https://nextjs.org/docs/app/guides/caching
- Sharp in standalone/self-hosted — https://nextjs.org/docs/messages/sharp-missing-in-production · https://github.com/vercel/next.js/discussions/59460
- Tailwind v4 theme variables (@theme, namespaces, oklch, @theme inline) — https://tailwindcss.com/docs/theme
- Tailwind v4 dark mode (@custom-variant) — https://tailwindcss.com/docs/dark-mode
- INP thresholds & phases — https://web.dev/articles/inp
- View Transitions API status, compositor, reduced-motion — https://developer.chrome.com/docs/web-platform/view-transitions/same-document · https://web.dev/learn/css/view-transitions-spas · https://matthiasott.com/notes/view-transitions-the-smooth-parts
