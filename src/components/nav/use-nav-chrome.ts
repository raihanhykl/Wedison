"use client";

import { useEffect, useState } from "react";
import { stripLocale } from "@/app/lib/locale";

/**
 * Halaman yang bagian paling atasnya BUKAN media gelap, jadi navbar transparan di
 * atasnya harus memakai teks tinta (gelap) supaya tetap terbaca.
 *
 * Dulu daftar ini digandakan di navbar.tsx dan language-toggle2.tsx dan sempat
 * berbeda isinya. Sekarang satu tempat saja.
 */
const LIGHT_TOP_ROUTES = [
  "/corporate/about/",
  "/corporate/contact/",
  "/showroom/",
  "/super-charge/lokasi/",
];

function routeHasLightTop(pathname: string): boolean {
  const path = stripLocale(pathname);
  if (LIGHT_TOP_ROUTES.includes(path)) return true;
  // Halaman detail berita: banner terang, indeksnya tidak.
  if (path.startsWith("/media-center/") && path !== "/media-center/") return true;
  return false;
}

const CONDENSE_AT = 24; // px — bar mengecil + latar solid
const HIDE_AFTER = 220; // px — auto-hide baru boleh aktif setelah lewat hero
const DELTA = 6; // px — abaikan getaran scroll kecil
const PROBE_Y = 32; // px — titik ukur "apa yang ada di balik navbar"

export type NavChrome = {
  /** Sudah lewat ambang scroll: bar mengecil dan latar jadi solid. */
  condensed: boolean;
  /** Sedang scroll ke bawah: bar disembunyikan (translate, bukan display). */
  hidden: boolean;
  /** Permukaan di balik navbar terang -> pakai teks tinta. */
  lightSurface: boolean;
};

/**
 * Satu listener scroll (rAF-throttled) untuk seluruh perilaku chrome navbar.
 *
 * Nada warna ditentukan dua lapis:
 *  1. Elemen mana pun boleh menulis `data-nav-tone="light" | "dark"`. Elemen yang
 *     sedang berada di balik navbar menang. Ini membuat halaman baru tidak perlu
 *     lagi didaftarkan manual, dan section terang di tengah halaman gelap ikut benar.
 *  2. Kalau halaman belum memakai atribut itu, jatuh ke daftar rute di atas.
 */
export function useNavChrome(pathname: string): NavChrome {
  const [chrome, setChrome] = useState<NavChrome>(() => ({
    condensed: false,
    hidden: false,
    lightSurface: routeHasLightTop(pathname),
  }));

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let wantHidden = false;
    let probes: HTMLElement[] = [];

    const collectProbes = () => {
      probes = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-tone]"));
    };

    const read = () => {
      frame = 0;
      const y = window.scrollY;

      let tone: "light" | "dark" | null = null;
      for (const el of probes) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= PROBE_Y && rect.bottom > PROBE_Y) {
          tone = el.dataset.navTone === "light" ? "light" : "dark";
        }
      }

      // Arah scroll dihitung DI LUAR updater: updater React harus murni
      // (di dev ia dipanggil dua kali, dan mutasi `lastY` di dalamnya akan meleset).
      const delta = y - lastY;
      if (Math.abs(delta) > DELTA) {
        wantHidden = delta > 0;
        lastY = y;
      }
      const condensed = y > CONDENSE_AT;
      const hidden = wantHidden && y > HIDE_AFTER;
      const lightSurface = tone ? tone === "light" : routeHasLightTop(pathname);

      setChrome((prev) =>
        prev.condensed === condensed &&
        prev.hidden === hidden &&
        prev.lightSurface === lightSurface
          ? prev
          : { condensed, hidden, lightSurface },
      );
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    collectProbes();
    read();
    // Sekali lagi setelah paint pertama, menangkap section yang baru ada usai hydration.
    const settle = requestAnimationFrame(() => {
      collectProbes();
      read();
    });

    const onResize = () => {
      collectProbes();
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(settle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return chrome;
}
