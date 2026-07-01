# 03 — Competitive UX / Brand Research: EV-Mobility Websites

**Prepared for:** Wedison (wedison.co) redesign
**Scope:** Competitive teardown of electric-motorcycle / EV-mobility brand **websites** — positioning & tone, color, typography, hero/configurator patterns, motion, page structure, mobile, and what to emulate vs. avoid.
**Method:** Live inspection via headless browser (computed `font-family`, computed background colors → hex, DOM/nav structure, viewport screenshots) plus web research. Colors below are read from the live DOM, so they are the real brand values, not guesses.
**Date:** 2026-06-30

---

## 0. Wedison baseline (what we are differentiating FROM)

Read directly from this repo so the gap is concrete:

- **Font:** `Geist` + `Geist Mono` via `next/font/google` (`src/app/[locale]/layout.tsx`). Geist is on the user's explicit "do-not-use" list — it is the generic Vercel default and reads as AI-slop.
- **Primary color:** `--primary: oklch(0.6731 0.1424 158.78)` = **`#2bb075`** (`src/app/globals.css:64`), a mid-green. Also hardcoded gradient `#2BB075 → #1a8a5a` in `career/client.tsx`. The user strongly dislikes this green and wants OFF green as primary.

**The single most important finding of this report:** green/mint/lime is the *default cliché* of the entire Indonesian (and much of the global) EV two-wheeler category. Moving off green is not just a preference — it is the clearest available path to visual differentiation. See §3.

---

## 1. The market at a glance (color + type audit)

| Brand | Market | Primary/Accent (live hex) | Headline typeface | Tone |
|---|---|---|---|---|
| **Gogoro** | TW/global | Near-black `#121215` + electric blue `#0074FF` | Graphik (grotesk) | Premium, dark, tech |
| **Zero Motorcycles** | US/global | White/black, photo-led, red region accents | Clean sans (system-ish) | Premium moto, restrained |
| **Ather Energy** | India | B/W/grey + red `#FF0000` | **Neurial Grotesk** | Editorial, product-hero |
| **Ola Electric** | India | Green `#16AA51` + ink `#181E22` | Gentona (humanist) | Mass-tech, busy |
| **Cake** | SE/global | Muted slate `#6A7883` + green `#42BA7F` | Aeonis | Scandi-minimal, calm |
| **Super73** | US/global | Black + burnt-orange + cream, indigo `#5A31F4` | **Bebas Neue Pro** (condensed) | Streetwear/moto-culture |
| **Tesla** (ref) | global | White/black, image-led | Universal Sans (custom) | Clinical, configurator-first |
| **Rivian** (ref) | global | Warm sand/khaki + yellow `#FECE00` | Custom geometric | Adventure, warm-premium |
| **Alva** | 🇮🇩 ID | Mint `#33FFC9` + blue `#1734E8` + green `#00664B` | **MADE Outer Sans** (futuristic) | Youthful, "Change the Game" |
| **Electrum** (Gojek/TBS) | 🇮🇩 ID | Navy `#1F4989`/`#103856` + teal `#40C0C0` + coral `#F04C3E` | Gilroy (rounded geo) | Friendly mass-market |
| **Polytron EV** | 🇮🇩 ID | Red `#ED1C24` + black/white | **Montserrat + Roboto** | Generic electronics-corporate |
| **Volta** | 🇮🇩 ID | Lime `#BCF164` + yellow `#F1EB64` + red | **Inter + Poppins** | Value/utility, swap-battery |

**Type takeaway:** Indonesian competitors lean on exactly the fonts Wedison wants to avoid — Volta (Inter+Poppins), Polytron (Montserrat+Roboto). The brands that look *expensive* all use a distinctive grotesk or a licensed display face: Ather (Neurial Grotesk), Gogoro (Graphik), Super73 (Bebas Neue Pro), Alva (MADE Outer Sans), Tesla/Rivian (custom). This is the clearest typographic lesson: **a single confident, non-default grotesk is the price of entry to "premium."**

**Color takeaway:** Green is everywhere in two-wheel EV — Ola `#16AA51`, Cake `#42BA7F`, Alva mint `#33FFC9` + dark green `#00664B`, Volta lime `#BCF164`, Electrum teal `#40C0C0`, and Wedison's own `#2bb075`. The brands that stand out did so by *escaping green*: Super73 (orange/indigo), Gogoro (electric blue on black), Rivian (sand/yellow), Polytron (red). "Eco = green" is a category default, not a differentiator.

---

## 2. The 8 most relevant teardowns

### 2.1 Ather Energy (India) — *emulate the editorial product-hero*
**Positioning/tone:** Confident, design-led, "smart scooter" premium-mass. Headlines are tiny in word count, huge in size ("Meet Rizta.", "Loved by 3,00,000+ families").
**Color:** Disciplined black/white/light-grey with a single red used sparingly. The product floats on a soft light gradient — the bike is the color.
**Typography:** Neurial Grotesk — a humanist grotesk with character (open apertures, slightly quirky). Large, tight-leading display headings; small grey supporting copy.
**Hero/configurator:** Center-stage product cut-out on a light backdrop, pill-shaped dual CTAs ("Learn more" / "Explore offers"), a slim auto-rotating "ticker" of proof points across the bottom ("Most awarded scooter", "159 km range"). Model pages have deep spec storytelling and a build/compare flow.
**Motion:** Restrained, scroll-reveal sections; product imagery does the work, not gratuitous animation.
**Mobile:** Strong — the single-product, single-headline hero collapses cleanly to mobile; sticky bottom CTA.
**WELL:** The "one giant headline + floating product + proof-ticker" hero is the cleanest template in the category and is directly adaptable to Wedison's Athena/Bees/Victory. Excellent spec-page IA.
**POORLY:** Cookie/consent UI is heavy; nav has a lot of secondary items (Investor Relations) competing with product.

### 2.2 Gogoro (Taiwan/global) — *emulate the dark, single-word confidence*
**Positioning/tone:** The most "Apple-like" of the set. Platform/energy company, not just a scooter brand ("Swap&Go", "Ride Smarter. Refuel in seconds.").
**Color:** Full-black hero (`#121215`) with white type and a precise electric-blue (`#0074FF`) accent. Premium and unmistakably tech.
**Typography:** Graphik — neutral, expensive, Swiss. One enormous centered word as the hero.
**Hero:** Black canvas, single centered statement, one quiet CTA. Extreme restraint = perceived premium.
**Motion:** Tasteful section transitions; case-study storytelling (Taiwan, India) with stat blocks.
**Mobile:** The centered single-statement hero is inherently responsive.
**WELL:** Demonstrates that *subtraction* reads as premium. The dark-canvas + electric accent is a proven "energy" aesthetic that avoids green entirely — highly relevant to Wedison's Edison/electricity brand idea.
**POORLY:** Corporate/IR framing can feel cold for a consumer purchase; little emotional lifestyle imagery.

### 2.3 Zero Motorcycles (US/global) — *emulate the model-line IA, avoid menu bloat*
**Positioning/tone:** Premium performance motorcycle that happens to be electric. Photography-driven, masculine, restrained.
**Color:** White/black with full-bleed motorcycle photography carrying all the color. Mega-menu organizes bikes into S / DS / FX / X lines.
**Typography:** Clean sans, legibility-first.
**Hero/configurator:** Big product photography, "Compare Models" and a build/configure + dealer-locator + financing/incentives flow — a genuinely useful purchase funnel.
**WELL:** Clear product-line taxonomy and a real compare/configure path — a model for Wedison's Athena/Bees/Victory/EDPower lineup.
**POORLY:** Dense nested mega-menu is hostile on mobile; no strong single hero focal point — the homepage feels like a catalog index rather than a statement.

### 2.4 Cake (Sweden/global) — *emulate the calm minimalism + use-case segmentation*
**Positioning/tone:** "Light, quiet & clean." Scandinavian, sustainable-premium, almost fashion-like calm.
**Color:** Muted desaturated slate-grey canvas (`#6A7883`), white type, restrained green (`#42BA7F`). Lowercase wordmark.
**Typography:** Aeonis — clean, quiet, lots of whitespace.
**Hero:** Oversized calm headline + a single line of **use-case tabs**: "Explore bikes developed for: Commute / :work / Off-road." That intent-based entry is smart IA.
**WELL:** Whitespace and quiet confidence; segmenting the lineup by *use-case* (commute / fleet / off-road) rather than by spec — directly relevant to Wedison's consumer vs. B2B/ojol split.
**POORLY:** Even Cake defaults to green; the muted palette can feel low-energy for a market (Indonesia) that responds to vibrancy and value messaging.

### 2.5 Super73 (US/global) — *emulate the lifestyle identity + lightning motif*
**Positioning/tone:** Moto-culture/streetwear lifestyle brand first, EV second. Community, scene, swagger.
**Color:** Black + cream + burnt-orange, electric indigo (`#5A31F4`) and gold (`#F2C94C`) accents. Retro halftone/collage art direction. **No green.**
**Typography:** Bebas Neue Pro — bold condensed display ("Last Chance!", "Z-Series") — instantly ownable. Neue Haas Unica for body.
**Hero:** Editorial collage hero, lightning-bolt logo mark, e-commerce-grade nav (search, account, cart).
**WELL:** Proof that an e-mobility brand can own a *culture*, not just specs. The **lightning-bolt mark + electric accent** maps perfectly onto Wedison's Edison/electricity equity. Bold condensed display type is a cheap, high-impact differentiator.
**POORLY:** Promo-heavy, busy hero (discount banners) dilutes the premium; collage style is polarizing and can date quickly.

### 2.6 Alva (🇮🇩 Indonesia) — *AVOID copying; this is the green/mint cliché incarnate*
**Positioning/tone:** Youthful, hype-driven ("#HanyaALVAyangBisa", "Change The Game"). Hashtag-campaign energy aimed at Gen-Z.
**Color:** Bright mint/teal `#33FFC9` + electric blue `#1734E8` + dark green `#00664B` — i.e., the exact green-family Wedison is fleeing, dialed to maximum.
**Typography:** MADE Outer Sans — a futuristic geometric display (distinctive, but very "EV startup").
**Hero:** Diagonal split, lifestyle photo on one side, oversized stacked headline on the other, carousel arrows, live chat bubble.
**WELL:** Energetic, localized Bahasa copy; ties hardware to a charging network ("Boost Charge Station", "180+ konektor Jawa-Bali") — exactly Wedison's SuperCharge story.
**POORLY/AVOID:** Mint-green is now the category default in Indonesia — Alva *owns the cliché*. Carousel hero + diagonal split + neon mint = the "AI-slop EV" look Wedison must escape. **Do not** adopt this palette or the hashtag-hero pattern.

### 2.7 Electrum (Gojek/TBS, 🇮🇩 Indonesia) — *the local benchmark to beat; learn the ecosystem story*
**Positioning/tone:** "Merk Motor Listrik No. 1 di Indonesia", "It's a Smart Move." Mass-market, trustworthy, backed by Gojek — strongest local incumbent.
**Color:** Navy/blue gradient (`#1F4989`, `#103856`) + teal (`#40C0C0`) + coral-red accent (`#F04C3E`). Notably **blue-led** — the smartest local color move, though product accents stay teal (still green-adjacent).
**Typography:** Gilroy — rounded geometric, friendly, approachable.
**Hero:** Whole product *family* (H1/H3/H5 + swap cabinets + batteries) lined up on a blue gradient, with city line-art behind — communicates "ecosystem," not one bike. WhatsApp float for conversion.
**WELL:** Sells the *ecosystem* (bikes + battery-swap + app) in one hero; clear model taxonomy in nav; blue base proves you can win this market without green.
**POORLY:** Hero is busy (many objects competing); Gilroy is friendly but not distinctive; lots of gradients can muddy the premium.

### 2.8 Polytron EV & Volta (🇮🇩 Indonesia) — *the "generic" floor; avoid this entirely*
**Polytron** — Montserrat + Roboto, red (`#ED1C24`) on black/white, "SAATNYA TINGGALKAN BATASAN." Corporate-electronics generic; the typefaces alone signal commodity.
**Volta** — Inter + Poppins, lime (`#BCF164`) + yellow + red, "Era Baru Energi Bersih," utility/value framing around battery-swap.
**AVOID:** Both use the precise default-font stack (Inter/Poppins/Montserrat/Roboto) the user banned, plus lime/red. They are the visual *floor* of the market and define exactly what "AI-slop / template" looks like locally. Wedison clearing this bar is table stakes.

### Reference tier — Tesla & Rivian (not motorcycles, but the quality bar)
- **Tesla:** Full-bleed product photography, sticky scroll-pinned sections, ruthless reduction to a single "Order Now" CTA, custom Universal Sans. The configurator (paint/wheels/interior with live price) is the category gold standard for a *build-your-bike* flow.
- **Rivian:** Warm sand/khaki + yellow (`#FECE00`) — proof that "clean/sustainable" can be *warm and adventurous*, not cold-tech, and again **not green**. Beautiful scroll-driven product reveals; restrained, premium motion.

---

## 3. The white-space: how Wedison differentiates in the Indonesian EV market

The Indonesian field is crowded into two corners:
1. **Green/mint hype** (Alva mint, Volta lime, Ola green) — loud, youthful, cliché.
2. **Generic corporate** (Polytron red+Montserrat, Volta Inter/Poppins) — template, commodity.
3. **Blue mass-market** (Electrum) — the one smart escape, but friendly/safe, teal-accented, busy.

**Nobody local owns a calm, premium, "energy/electricity" aesthetic** — dark-canvas confidence (à la Gogoro), editorial product-hero discipline (à la Ather), warm-premium restraint (à la Rivian), and a distinctive non-default typeface. That is Wedison's open lane. The brand name (Wedison → Edison → electricity) gives a built-in, ownable visual system — **light, filament/glow, voltage, the spark/bolt** — that no competitor is using and that has nothing to do with green leaves.

---

## 4. Patterns to EMULATE vs. AVOID

**EMULATE**
- Ather/Gogoro **one-giant-headline + single floating product hero** (replace any carousel).
- Gogoro/Rivian **dark or warm premium canvas with ONE electric accent** — perceived-premium via subtraction.
- Cake/Zero **use-case / model-line segmentation** (Commute · Fleet/Ojol · Performance) as primary nav IA — fits Wedison's consumer + B2B split.
- A **distinctive single grotesk** (Ather-style) — non-default, highly readable, one family for everything.
- Electrum's **ecosystem hero idea** (bike + SuperCharge network + app) but executed with far more restraint.
- Tesla-grade **build/compare flow** with live pricing for Athena/Bees/Victory.
- Super73's **lightning/bolt brand mark** tied to the Edison/electricity equity.
- Restrained **scroll-reveal motion** (Rivian/Ather), GPU-cheap, respects `prefers-reduced-motion` — supports the "light-speed fast" goal.

**AVOID**
- Any **green / mint / lime** as primary (Alva, Volta, Ola, current Wedison `#2bb075`).
- **Inter / Poppins / Montserrat / Roboto / Geist** (Volta, Polytron, current Wedison) — instant "generic."
- **Carousel heroes + diagonal-split + neon** (Alva) and **hashtag-campaign** hero copy.
- **Mega-menu bloat** (Zero) and **busy multi-object hero** (Electrum, Super73 promo banners) on mobile.
- Cold IR/corporate-only framing (Gogoro/Polytron) for consumer purchase pages.

---

## 5. Sources (live-inspected unless noted)

- Gogoro — https://www.gogoro.com (live)
- Zero Motorcycles — https://www.zeromotorcycles.com (live)
- Ather Energy — https://www.atherenergy.com (live)
- Ola Electric — https://www.olaelectric.com (live)
- Cake — https://ridecake.com (live)
- Super73 — https://super73.com (live)
- Tesla Model Y — https://www.tesla.com/modely (live)
- Rivian — https://www.rivian.com (research)
- Alva — https://www.alvaauto.com (live)
- Electrum — https://electrum.id (live)
- Polytron EV — https://2w.polytronev.id (live)
- Volta — https://www.voltaindonesia.com (live)
- Awwwards scroll/animation inspiration — https://www.awwwards.com/inspiration/scroll-animations
- Wedison current tokens — `src/app/globals.css` (`--primary` #2bb075), `src/app/[locale]/layout.tsx` (Geist)
