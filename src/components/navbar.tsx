"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";
import { stripLocale } from "@/app/lib/locale";
import LanguageSwitch from "./nav/language-switch";
import NavSheet from "./nav/nav-sheet";
import { NavPanelBody } from "./nav/nav-panels";
import { activeNavKey, buildNav } from "./nav/nav-config";
import { useNavChrome } from "./nav/use-nav-chrome";

const CTA_HREF = "/showroom/";
const OPEN_DELAY = 90; // ms — hover-intent, biar tak "meletup" saat kursor lewat
const CLOSE_DELAY = 190; // ms — masa tenggang menyeberang ke panel

export default function Navbar() {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const path = stripLocale(pathname);
  const base = `/${language}`;

  const items = useMemo(() => buildNav(t), [t]);
  const activeKey = useMemo(() => activeNavKey(items, path), [items, path]);

  const [openKey, setOpenKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { condensed, hidden, lightSurface } = useNavChrome(pathname);

  const solid = condensed || openKey !== null || sheetOpen;
  const tone = solid || lightSurface ? "ink" : "bone";
  const markerKey = hoverKey ?? openKey;

  // ---- buka/tutup panel dengan hover-intent -------------------------------
  const timer = useRef<number | undefined>(undefined);
  const clearTimer = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = undefined;
  };

  const openPanel = useCallback((key: string, immediate = false) => {
    clearTimer();
    setMounted((prev) => (prev.includes(key) ? prev : [...prev, key]));
    if (immediate) {
      setOpenKey(key);
      return;
    }
    timer.current = window.setTimeout(() => setOpenKey(key), OPEN_DELAY);
  }, []);

  const closePanel = useCallback((immediate = false) => {
    clearTimer();
    if (immediate) {
      setOpenKey(null);
      return;
    }
    timer.current = window.setTimeout(() => setOpenKey(null), CLOSE_DELAY);
  }, []);

  useEffect(() => clearTimer, []);

  // Pindah halaman -> semua tertutup.
  useEffect(() => {
    clearTimer();
    setOpenKey(null);
    setHoverKey(null);
    setSheetOpen(false);
  }, [pathname]);

  // Escape menutup dan mengembalikan fokus ke pemicunya.
  useEffect(() => {
    if (!openKey && !sheetOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openKey) {
        const trigger = navRef.current?.querySelector<HTMLElement>(
          `[data-nav-key="${openKey}"]`,
        );
        closePanel(true);
        trigger?.focus();
      }
      setSheetOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openKey, sheetOpen, closePanel]);

  // Kunci scroll halaman selama sheet terbuka.
  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sheetOpen]);

  // ---- chip penanda yang meluncur -----------------------------------------
  const navRef = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<{ x: number; w: number } | null>(null);
  const [primed, setPrimed] = useState(false);

  const measureMarker = useCallback((key: string | null) => {
    if (!key || !navRef.current) return;
    const el = navRef.current.querySelector<HTMLElement>(`[data-nav-key="${key}"]`);
    if (el) setMarker({ x: el.offsetLeft, w: el.offsetWidth });
  }, []);

  useLayoutEffect(() => {
    measureMarker(markerKey);
  }, [markerKey, measureMarker, language]);

  useEffect(() => {
    if (!marker || primed) return;
    // Kemunculan pertama harus langsung di tempat, bukan meluncur dari x=0.
    const frame = requestAnimationFrame(() => setPrimed(true));
    return () => cancelAnimationFrame(frame);
  }, [marker, primed]);

  useEffect(() => {
    const onResize = () => measureMarker(markerKey);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [markerKey, measureMarker]);

  // ---- tinggi panel yang bertransformasi ----------------------------------
  const bodyRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [panelH, setPanelH] = useState(0);

  useLayoutEffect(() => {
    if (!openKey) return;
    const el = bodyRefs.current[openKey];
    if (el) setPanelH(el.offsetHeight);
  }, [openKey, mounted, language]);

  useEffect(() => {
    if (!openKey) return;
    const el = bodyRefs.current[openKey];
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setPanelH(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, [openKey]);

  const onTriggerKeyDown = (event: React.KeyboardEvent, key: string) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openPanel(key, true);
      window.setTimeout(() => {
        bodyRefs.current[key]?.querySelector<HTMLElement>("a")?.focus();
      }, 60);
    }
  };

  return (
    <header
      className="nav-root fixed inset-x-0 top-0 z-40"
      data-tone={tone}
      data-surface={solid ? "solid" : "clear"}
      data-condensed={condensed}
      data-hidden={hidden && !openKey && !sheetOpen}
    >
      <a
        href="#konten"
        className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
      >
        {t("nav.skipToContent")}
      </a>

      {/* Pelat latar terpisah supaya bisa cross-fade tanpa mengecat ulang teks di atasnya. */}
      <div
        aria-hidden
        className="nav-scrim absolute inset-0 border-b border-border bg-card/85 backdrop-blur-xl"
      />

      <div className="main-container relative">
        <div className="nav-bar grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Logo — dua varian ditumpuk, saling silih ganti mengikuti nada. */}
          <Link
            href={`${base}/`}
            aria-label="Wedison"
            className="relative block h-5 w-[137px] shrink-0 sm:h-[22px] sm:w-[151px] lg:h-6 lg:w-[165px]"
          >
            <Image
              src="/logo/wedison-wordmark.webp"
              alt="Wedison"
              fill
              sizes="170px"
              priority
              className={cn(
                "object-contain object-left transition-opacity duration-[340ms]",
                tone === "ink" ? "opacity-100" : "opacity-0",
              )}
            />
            <Image
              src="/logo/wedison-wordmark-white.webp"
              alt=""
              fill
              sizes="170px"
              priority
              className={cn(
                "object-contain object-left transition-opacity duration-[340ms]",
                tone === "ink" ? "opacity-0" : "opacity-100",
              )}
            />
          </Link>

          {/* Navigasi desktop — di tengah, jadi logo dan aksi jadi dua jangkar seimbang. */}
          <nav
            aria-label={t("nav.primary")}
            className="hidden justify-center lg:flex"
            onPointerLeave={(event) => {
              if (event.pointerType !== "mouse") return;
              setHoverKey(null);
              closePanel();
            }}
          >
            <div ref={navRef} className="relative flex items-center">
              <span
                aria-hidden
                className="nav-marker"
                data-on={markerKey !== null}
                data-instant={!primed}
                style={
                  {
                    "--marker-x": `${marker?.x ?? 0}px`,
                    "--marker-w": `${marker?.w ?? 0}px`,
                  } as CSSProperties
                }
              />
              {items.map((item) => {
                const isOpen = openKey === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    data-nav-key={item.key}
                    aria-expanded={isOpen}
                    aria-controls={`nav-panel-${item.key}`}
                    aria-haspopup="true"
                    onPointerEnter={(event) => {
                      if (event.pointerType !== "mouse") return;
                      setHoverKey(item.key);
                      openPanel(item.key, openKey !== null);
                    }}
                    onClick={() => (isOpen ? closePanel(true) : openPanel(item.key, true))}
                    onKeyDown={(event) => onTriggerKeyDown(event, item.key)}
                    onFocus={() => setHoverKey(item.key)}
                    className={cn(
                      "nav-ink relative rounded-md px-3.5 py-2 font-display text-[15px] font-medium tracking-[-0.01em]",
                      activeKey === item.key && "nav-current",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Aksi kanan */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <LanguageSwitch className="hidden sm:flex" />
            <LanguageSwitch size="sm" className="flex sm:hidden" />

            <Link
              href={`${base}${CTA_HREF}`}
              className="nav-cta hidden h-10 items-center rounded-md px-5 font-display text-sm font-semibold tracking-[-0.01em] md:inline-flex"
            >
              {t("nav.cta.testRide")}
            </Link>

            <button
              type="button"
              aria-expanded={sheetOpen}
              aria-controls="nav-sheet"
              aria-label={sheetOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              onClick={() => setSheetOpen((prev) => !prev)}
              className="nav-ink -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span aria-hidden className="relative block h-4 w-6">
                <span
                  className={cn(
                    "nav-burger-line absolute left-0 h-[1.5px] w-6 rounded-full bg-current",
                    sheetOpen
                      ? "top-1/2 -translate-y-1/2 rotate-45"
                      : "top-[3px] rotate-0",
                  )}
                />
                <span
                  className={cn(
                    "nav-burger-line absolute left-0 h-[1.5px] w-6 rounded-full bg-current",
                    sheetOpen
                      ? "top-1/2 -translate-y-1/2 -rotate-45"
                      : "bottom-[3px] rotate-0",
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Megamenu: SATU kartu yang tingginya berubah antar panel, isinya saling silang-pudar. */}
        <div
          className="absolute left-12 right-12 top-full hidden pt-2 lg:block"
          style={{ pointerEvents: openKey ? "auto" : "none" }}
          onPointerEnter={() => {
            if (openKey) clearTimer();
          }}
          onPointerLeave={(event) => {
            if (event.pointerType !== "mouse") return;
            setHoverKey(null);
            closePanel();
          }}
        >
          <div
            className="nav-panel relative mx-auto max-w-[1040px] rounded-xl border border-border bg-card shadow-[var(--shadow-lg)]"
            data-open={openKey !== null}
            style={{ "--panel-h": `${panelH}px` } as CSSProperties}
          >
            {items
              .filter((item) => mounted.includes(item.key))
              .map((item) => (
                <div
                  key={item.key}
                  id={`nav-panel-${item.key}`}
                  ref={(node) => {
                    bodyRefs.current[item.key] = node;
                  }}
                  className="nav-panel-body"
                  data-active={openKey === item.key}
                  // Panel yang sudah pernah dibuka tetap ter-mount (biar tak ada
                  // flash saat dibuka lagi); `inert` menjaganya keluar dari urutan
                  // tab dan dari a11y tree selama tidak aktif.
                  inert={openKey !== item.key}
                >
                  <NavPanelBody
                    item={item}
                    base={base}
                    current={path}
                    onNavigate={() => closePanel(true)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      <NavSheet
        open={sheetOpen}
        items={items}
        base={base}
        current={path}
        activeKey={activeKey}
        ctaLabel={t("nav.cta.testRide")}
        ctaHref={CTA_HREF}
        onNavigate={() => setSheetOpen(false)}
      />
    </header>
  );
}
