# 06 — Typography: Brand Typeface System for Wedison

Research date: 2026-06-30
Author role: Typographer
Scope: Select a non-generic, high-readability **brand typeface system** for wedison.co (Next.js 15, App Router, i18n /id /en, React 19, Tailwind v4, SSR standalone on VPS).

---

## Brief recap & constraints

**Goal:** A distinctive-but-legible brand typeface system for an Indonesian electric-motorcycle / energy brand. Must escape AI-slop, work as one consistent guideline across all pages, be mobile-first, light-speed fast (PageSpeed), and maintainable.

**Hard avoid list (overused / "AI-slop" defaults):** Geist, Inter, Roboto, Poppins, Montserrat, Open Sans, Lato, Nunito.

**Requirements:**
- Excellent Latin + **Indonesian** readability at body sizes. Note: Bahasa Indonesia uses **no diacritics beyond basic ASCII Latin** (no accents), so language coverage is trivially satisfied by any quality Latin font — the real bar is *screen legibility at small sizes*, not glyph coverage. (Latin-ext is still nice-to-have for loanwords/brand names and for the /en audience.)
- Strong display/heading personality fit for a modern EV/energy brand (electricity, speed, precision, optimism).
- Available via `next/font/google` **or** self-hostable with permissive license (OFL / Apache / ITF FFL).
- Good weight range; ideally a **variable font** for performance (one file, all weights).

**Performance principle (applies to all options below):**
- Prefer **variable** fonts → single WOFF2, fewer requests.
- Self-host via `next/font/local` (or `next/font/google`, which self-hosts at build time) → no third-party origin, no layout shift (`size-adjust`/`adjustFontFallback`), and `display: swap`.
- Subset to `latin` + (optionally) `latin-ext`; for Indonesian-only you can ship `latin` and save bytes.
- Pair at most **two** families (display + text) + optional mono. More families = more weight + more inconsistency.

---

## Candidate type systems (researched)

### 1. Space Grotesk (display) + Hanken Grotesk (text) — *with optional Space Mono / Martian Mono*

- **Names / foundry:** Space Grotesk by **Florian Karsten** (a proportional derivative of Colophon Foundry's Space Mono). Hanken Grotesk by **Alfredo Marco Pradil / Hanken Design Co.**
- **License:** Both **SIL Open Font License 1.1 (OFL)**.
- **Load method:** Both on **Google Fonts** → `next/font/google` (self-hosted at build). Space Grotesk is variable (weight axis); Hanken Grotesk ships as a variable weight file with true italics.
- **Why it fits an EV brand:** Space Grotesk carries the "engineered / instrument cluster / spec-sheet" DNA of its monospace origin — quirky terminals, slightly compressed forms, a precise techy character that reads as *electric and modern* without being a cliché geometric. It signals engineering precision (battery %, range, kW) which is perfect for an EV. Hanken Grotesk underneath is a warm, screen-optimized neo-grotesque ("bouba grotesk") that keeps body copy friendly and Indonesian-legible.
- **Readability:** Space Grotesk is **display-first** — excellent for H1/H2/stat numerals, but its idiosyncratic details get tiring in long paragraphs, so keep it to headings/labels. Hanken Grotesk is one of the strongest *free* body workhorses on Google Fonts (open apertures, optical spacing tuned for screen); it's explicitly positioned as the modern replacement for Lato/Open Sans/Poppins. Both have tabular figures — great for specs/pricing.
- **Indonesian support:** Space Grotesk explicitly lists Indonesian support and covers Latin Extended-A. Hanken Grotesk covers Latin + Latin-ext (plus Cyrillic-ext/Vietnamese). Both fully cover Bahasa Indonesia and /en.
- **Mono pairing:** Space Mono (its origin) or Martian Mono (Evil Martians, OFL) for spec tables / code-like accents / "kW·h" tech labels.
- **In the wild:** Space Grotesk — Versus Hotels, Type Directors Club, Buddy-Buddy, JS2 PR (per Typewolf Site of the Day features). Hanken Grotesk — widely used in modern brand/UI work, Adobe Fonts featured.

### 2. Schibsted Grotesk (single superfamily, display + text)

- **Name / foundry:** **Schibsted Grotesk** by **Bakken & Bæck + Henrik Kongsvoll**, commissioned by Schibsted (one of Scandinavia's largest media groups).
- **License:** **OFL 1.1**.
- **Load method:** **Google Fonts** → `next/font/google`. Variable weight axis (6 stops, 400–900) with true italics. Single-family solution.
- **Why it fits an EV brand:** A contemporary grotesque engineered as a *digital-first brand tool* — optically refined at small sizes yet bold and confident at headline sizes within one family. It's a "use it everywhere" superfamily, which directly serves the user's "one consistent design guideline" goal: one typeface, display through body, no pairing-mismatch risk. Clean, Scandinavian, premium — reads as trustworthy energy-tech.
- **Readability:** Built for editorial publishing + UI; balances headline punch and small-text legibility in the same file. Excellent body candidate; slightly less "look-at-me" personality than Space Grotesk in headlines.
- **Indonesian support:** Covers the Underware Latin Plus character set; Google Fonts subsets include `latin` + `latin-ext`. Full Bahasa Indonesia + /en coverage.
- **Mono pairing:** Pair with a neutral mono (Martian Mono / Space Mono) only if you want spec-table flavor.
- **In the wild:** Schibsted's own product/news ecosystem (news, magazine, digital products); increasingly adopted in modern brand systems since its Google Fonts release.

### 3. Bricolage Grotesque (display) + Hanken Grotesk or system text

- **Name / foundry:** **Bricolage Grotesque** by **Mathieu Triay (Atelier Triay)**.
- **License:** **OFL 1.1**.
- **Load method:** **Google Fonts** → `next/font/google`. Variable with **three axes: weight + width + optical size** — unusually expressive for a free font.
- **Why it fits an EV brand:** Expressive, characterful headline face with exaggerated ink traps and a confident, slightly "wonky" personality blending French/British grotesque traditions. Optical-size axis lets large display sizes look characterful while small sizes become more neutral — a genuinely premium, design-forward signal.
- **Readability:** Great display face; the optical axis improves small-size behavior, but it is **very heavily used on SaaS/startup landing pages right now** (huge ExtraBold headlines). That ubiquity is a **risk vs. the user's "non-generic / escape AI-slop" goal** — it's arguably becoming the new default "designer" font. Pair with a quieter text face.
- **Indonesian support:** Latin + Latin-ext via Google Fonts. Full coverage.
- **In the wild:** Numerous Awwwards-winning portfolios and SaaS sites (Materra, Humble, many studio/portfolio sites). High recognition = both a pro (credibility) and con (saturation).

### 4. Clash Display (display) + General Sans (text) — Fontshare / Indian Type Foundry

- **Names / foundry:** **Clash Display** + **General Sans**, both by **Indian Type Foundry (ITF)**, distributed via **Fontshare**.
- **License:** **ITF Free Font License (FFL)** — 100% free for personal & commercial use across print/web/mobile/broadcast, worldwide. (Not OFL: you may not resell/redistribute the font files or modify-and-rename. Embedding/serving on your own site is fully allowed.) Self-host via `next/font/local`.
- **Load method:** **Self-host** (`next/font/local`). Both ship variable fonts. Clash Display: 6 weights (Extralight–Bold) + variable. General Sans: neutral text face, variable.
- **Why it fits an EV brand:** Clash Display has small apertures and a tight, techy neo-grotesque personality — modern, slightly futuristic, distinctive without being gimmicky; excellent for big EV product names (Athena, Bees, Victory). General Sans is a clean, near-neutral workhorse that reads cleanly at body sizes and holds up as a display face too. The pairing is cohesive (same foundry, shared metrics sensibility).
- **Readability:** Clash Display is display-only (keep it to headings). General Sans is highly legible for body and UI; a safe, neutral Indonesian-friendly text face.
- **Indonesian support:** Latin Extended coverage; full Bahasa Indonesia + /en.
- **Caveat:** FFL is *permissive but not OFL* — must self-host (no Google Fonts CDN), and you can't redistribute the files. Slightly more setup (download WOFF2, `next/font/local`) but excellent performance once self-hosted.
- **In the wild:** Widely used across tech/startup/portfolio sites since Fontshare's launch; ITF's most popular free display family.

### 5. Cabinet Grotesk (display) + General Sans / Hanken (text) — Fontshare

- **Name / foundry:** **Cabinet Grotesk** by **ITF / Fontshare**.
- **License:** **ITF FFL** (self-host via `next/font/local`).
- **Load method:** Self-host. Variable; 8 styles (Thin–Extrabold).
- **Why it fits an EV brand:** Cabinet Grotesk has visible **stroke contrast** unusual for a sans — it reads as more *editorial, premium, and characterful* than a flat grotesque, giving an EV brand a refined, design-magazine feel rather than generic tech. Leans neo-grotesque + expressive.
- **Readability:** Strong display face; the stroke contrast is beautiful big but should not be used for long body. Pair with General Sans or Hanken Grotesk for text.
- **Indonesian support:** Latin-ext; full coverage.
- **In the wild:** Common in modern brand identities and portfolio/Awwwards work; a quieter, more sophisticated alternative to Clash Display.

### 6. Sora (single family, geometric-grotesque hybrid)

- **Name / foundry:** **Sora**, commissioned via Google Fonts (designed for the "internet of value" / Web3 context).
- **License:** **OFL 1.1**.
- **Load method:** **Google Fonts** → `next/font/google`. Variable weight axis.
- **Why it fits an EV brand:** Distinctive geometric structure with slightly wider proportions and a forward-leaning, optimistic-tech feel. Reads clearly as "modern infrastructure / future energy" without the Poppins-roundness cliché.
- **Readability:** Works as both display and UI; wider proportions are clean on screen. Slightly less personality in headlines than Space Grotesk/Clash, but a solid single-family option for maintainability.
- **Indonesian support:** Latin + Latin-ext. Full coverage.
- **In the wild:** Web3 / fintech / infrastructure product sites.

### 7. Martian Mono / Space Mono (supporting MONO — not a primary)

- **Name / foundry:** **Martian Mono** by **Evil Martians**; **Space Mono** by **Colophon Foundry**.
- **License:** Both **OFL 1.1**. Google Fonts → `next/font/google`.
- **Role:** Not a primary brand face — a **functional accent** for spec sheets, range/kW/Wh figures, "technical" labels, footnotes, and code-style microcopy. Martian Mono has weight + width axes (variable) and a brutalist engineered look that reinforces the EV/energy precision story. Space Mono pairs natively with Space Grotesk (System 1).

---

## Ranking

| Rank | System | Type | Personality | Body legibility | Distinctiveness vs AI-slop | Perf / load |
|------|--------|------|-------------|-----------------|----------------------------|-------------|
| **1** | **Space Grotesk + Hanken Grotesk (+ Space/Martian Mono)** | Display + Text (+Mono) | High (engineered/precise) | Excellent (Hanken) | High — not on avoid list, techy-EV character | Excellent (variable, Google Fonts, OFL) |
| **2** | **Schibsted Grotesk** (single superfamily) | All-in-one | Medium-High (premium, Scandi) | Excellent | High — fresh, under-used | Excellent (variable, one family) |
| 3 | Clash Display + General Sans (Fontshare) | Display + Text | High (futuristic) | Very good | High | Very good (self-host) |
| 4 | Cabinet Grotesk + General Sans | Display + Text | High (editorial contrast) | Very good | High | Very good (self-host) |
| 5 | Bricolage Grotesque + quiet text | Display + Text | Very high | Good (optical axis) | **Medium — saturated on SaaS** | Excellent (3-axis variable) |
| 6 | Sora (single family) | All-in-one | Medium | Good | Medium-High | Excellent |
| — | Martian Mono / Space Mono | Mono accent only | — | (mono) | — | Excellent |

---

## Top recommendation

### Space Grotesk (display) + Hanken Grotesk (text) + Space Mono / Martian Mono (accent)

**Rationale:**
1. **Brand fit:** Space Grotesk's monospace-derived, engineered character is a near-perfect metaphor for an electric-motorcycle/energy brand — it reads as *precision instrumentation* (battery %, range, kW), speed, and modern tech, without falling into the geometric-roundness cliché (Poppins/Montserrat) the user explicitly rejects. The Edison/electricity brand story is reinforced by a typeface that *looks measured and electric*.
2. **Escapes AI-slop:** None of the three families are on the avoid list, and Space Grotesk has a genuinely distinctive silhouette (it's recognizable, characterful, Awwwards-credible) — yet it is far less saturated than Bricolage Grotesque (#5), which is becoming the new default.
3. **Readability where it counts:** Personality is concentrated in *headings/numerals* (Space Grotesk), while **Hanken Grotesk** — currently the strongest free screen-body grotesque — carries paragraphs and UI with open apertures and warm legibility in Bahasa Indonesia and English. This split keeps the site both distinctive AND highly readable, satisfying both user goals at once.
4. **Performance + maintainability:** All three are **OFL**, all on **Google Fonts**, all loadable via `next/font/google` (self-hosted at build, zero third-party origin, no CLS, `display: swap`, automatic subsetting). All are variable → minimal bytes. Tabular figures across the system are ideal for the heavy spec/price/range content of EV product pages.
5. **System story:** A grotesque + grotesque + mono trio gives one coherent guideline across consumer pages (Athena/Bees/Victory), EDPower, SuperCharge, B2B/fleet, and corporate pages — display for impact, text for trust, mono for the "engineering data" voice.

**Suggested role mapping (Tailwind v4 `@theme` tokens):**
- `--font-display`: **Space Grotesk** → H1–H3, hero, big stat numbers, nav/CTA labels (weights 500–700).
- `--font-sans` (default/body): **Hanken Grotesk** → all body, paragraphs, UI, captions (weights 400/500/600 + italic).
- `--font-mono`: **Space Mono** or **Martian Mono** → spec tables, kW/Wh/km figures, footnotes, technical microcopy (use sparingly).

**`next/font/google` sketch:**
```ts
import { Space_Grotesk, Hanken_Grotesk, Space_Mono } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans    = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono    = Space_Mono({ subsets: ["latin"], weight: ["400","700"], variable: "--font-mono", display: "swap" });
// add "latin-ext" subset only if EN/loanword glyphs need it; "latin" alone covers Bahasa Indonesia.
```

---

## Safe second choice

### Schibsted Grotesk (single superfamily, display → body in one OFL variable file)

**Why it's the safe pick:**
- **One family, zero pairing risk** — directly serves "one consistent design guideline." Less for a small team to maintain and balance than a two-font system.
- **OFL + Google Fonts + variable** → same best-in-class loading story as the top pick.
- **Designed digital-first** by a major media group for exactly this dual job: confident headlines + optically refined small-size body, with true italics and 400–900 weights.
- It's **fresh and under-used** (released to Google Fonts relatively recently), so it reads as deliberate and non-generic — a strong escape from the avoid list — while being lower-risk than Space Grotesk's stronger display personality.
- Trade-off vs #1: slightly less *electric/engineered* character in headlines. If you want maximum brand distinctiveness, go System 1; if you want maximum simplicity and safety, go Schibsted Grotesk and optionally add a mono accent.

**Decision rule:** Start with **Space Grotesk + Hanken Grotesk**. If, during design QA, the Space Grotesk headlines feel too "techy/quirky" for the more corporate pages (career, media center, B2B), fall back to **Schibsted Grotesk** as the unifying superfamily. Both share the same OFL / variable / `next/font/google` performance profile, so switching is a low-cost token change in `@theme`.

---

## Notes & risks

- **Avoid Bricolage Grotesque as the headline face despite its quality** — it is currently the single most over-deployed "designer" font on SaaS landing pages, which undercuts the explicit "non-generic / escape AI-slop" goal. Keep it as a backup display only.
- **Fontshare (Clash/Cabinet/General Sans) requires self-hosting** (`next/font/local`) since the ITF FFL fonts are not on Google's CDN and may not be redistributed — fully fine for your own VPS-served site, just slightly more setup. Choose these only if you specifically want the ITF look over the OFL options.
- **Indonesian coverage is a non-issue** for every candidate here (Bahasa uses basic Latin only); prioritize *small-size screen legibility* and *figure styles (tabular/old-style)* over glyph counts.
- **Performance discipline:** ship `latin` subset by default, add `latin-ext` only if needed; cap weights to those actually used (e.g., 400/500/600/700); rely on variable files; let `next/font` handle `size-adjust` to eliminate CLS.

---

## Sources

- [TBH Creative — Best new Google Fonts 2025](https://www.tbhcreative.com/blog/new-google-fonts-typefaces-2025/)
- [Creative Boom — Typefaces designers love 2026](https://www.creativeboom.com/resources/15-typefaces-designers-cant-stop-using-or-admiring-in-2026/)
- [MadeGood Designs — Best Google Fonts](https://madegooddesigns.com/best-google-fonts/)
- [Typewolf — Space Grotesk (pairings & sites in use)](https://www.typewolf.com/space-grotesk)
- [Florian Karsten — Space Grotesk](https://fonts.floriankarsten.com/space-grotesk)
- [Google Fonts — Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) · [GitHub — floriankarsten/space-grotesk](https://github.com/floriankarsten/space-grotesk)
- [Google Fonts — Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) · [Adobe Fonts — Hanken Grotesk](https://fonts.adobe.com/fonts/hanken-grotesk) · [Fontsource — Hanken Grotesk](https://fontsource.org/fonts/hanken-grotesk)
- [Google Fonts — Schibsted Grotesk](https://fonts.google.com/specimen/Schibsted+Grotesk) · [GitHub — schibsted/schibsted-grotesk](https://github.com/schibsted/schibsted-grotesk)
- [Bricolage Grotesque — official site](https://ateliertriay.github.io/bricolage/) · [Google Fonts — Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) · [GitHub — ateliertriay/bricolage](https://github.com/ateliertriay/bricolage)
- [Fontshare — Clash Display](https://www.fontshare.com/fonts/clash-display) · [Fontshare — Cabinet Grotesk](https://www.fontshare.com/fonts/cabinet-grotesk) · [Fontshare — ITF Free Font License](https://www.fontshare.com/licenses/itf-ffl) · [Fontshare FAQ](https://www.fontshare.com/faq)
- [MadeGood Designs — Fontshare safety/license](https://madegooddesigns.com/fontshare/)
- [Google Fonts — Sora](https://fonts.google.com/specimen/Sora)
- [Google Fonts — Unbounded](https://fonts.google.com/specimen/Unbounded)
- [Evil Martians — Martian Mono](https://evilmartians.com/products/martian-mono) · [GitHub — evilmartians/mono](https://github.com/evilmartians/mono) · [Google Fonts — Martian Mono](https://fonts.google.com/specimen/Martian+Mono)
- [Google Fonts — Language support in fonts](https://fonts.google.com/knowledge/using_type/language_support_in_fonts)
