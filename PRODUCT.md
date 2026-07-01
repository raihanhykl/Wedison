# PRODUCT.md — Wedison

> Design context for Impeccable + the team. Register: **Brand** (marketing/landing — the design *is* the product).
> Full design system: `docs/redesign/DESIGN.md`.

## What it is
Wedison (wedison.co) — Indonesian electric-motorcycle ("motor listrik") brand. Consumer e-motorcycles
(Athena, Bees, Victory), EDPower, a "SuperCharge" charging network, plus B2B/fleet (ojol/ride-hailing).
Next.js 15 (App Router, i18n `/id` `/en`), React 19, Tailwind v4, shadcn/ui, SSR standalone on a VPS.

## Audience
- **Primary:** urban Indonesian consumers considering their first premium electric motorcycle — value quiet, clean, trustworthy quality over flashy spec wars.
- **Secondary:** B2B fleet/ride-hailing (ojol) operators evaluating EDPower; corporate/press/career.

## Brand voice (three words)
**Tenang · Percaya-diri · Jernih** (calm, confident, clear). Bilingual ID/EN, plain and human — no template filler, no hype.

## Visual references
- Rivian, Polestar, Aesop — restraint, premium light/dark balance, product-as-hero.
- Heritage "deep green + quiet luxury" rather than bright-tech EV green.

## Anti-references (what to avoid)
- Bright mint/lime/teal EV green (Alva/Volta/Ola/Cake) — looks cheap & category-generic.
- AI-slop: gradient text, glass-everywhere, purple gradients, uniform fade-rise, eyebrow-on-every-section, identical card grids.
- Geist/Inter/Poppins/Montserrat fonts; light-gray text that fails contrast.

## Color & type (summary)
- One accent: **Deep Green `#1E5B40`** on a Snow `#FAFAF7` / Ink `#1A1F1C` base, Sage tints, deep "Forest" sections for drama. Green-only (no metallic).
- **Schibsted Grotesk** (display) + **Hanken Grotesk** (body) + **Martian Mono** (data). All variable, OFL, `next/font`.

## Hard rules
Mobile-first · `prefers-reduced-motion` respected · body contrast ≥4.5:1 · image optimization ON ·
semantic tokens only (no inline hex) · high PageSpeed (LCP ≤2.5s, CLS ≤0.1, INP ≤200ms).
