// Brand typefaces (Sage + Ink system). All variable, OFL, self-hosted at build via next/font.
// Display = Schibsted Grotesk · Body/UI = Hanken Grotesk · Data = Martian Mono.
// Variable fonts: do NOT pass `weight` (the whole axis ships). See docs/redesign/DESIGN.md §3.
import { Schibsted_Grotesk, Hanken_Grotesk, Martian_Mono } from "next/font/google";

export const fontDisplay = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const fontSans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = `${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`;
