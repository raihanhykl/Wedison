"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { cn } from "@/lib/utils";

export type CarouselSlide = {
  id: string;
  label: string;
  render: (active: boolean) => ReactNode;
};
export type CarouselHandle = { goTo: (id: string) => void };

type Props = {
  slides: CarouselSlide[];
  label: string;
  /** Dipanggil saat pengunjung mengganti kartu aktif (panah, geser, trackpad, klik kartu, keyboard). */
  onActiveChange: (id: string) => void;
  ref?: Ref<CarouselHandle>;
};

/** Ukuran kartu belakang relatif kartu aktif. */
const BACK_SCALE = 0.86;
/** Loop Embla butuh deretan lebih panjang dari viewport: daftar pendek diulang sampai ≥ ini. */
const MIN_SLIDES = 8;

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

/**
 * Deretan kartu melingkar (loop) gaya coverflow: kartu aktif di tengah & paling depan, sisanya
 * mengecil dan meredup berbaris di belakangnya. Ganti kartu lewat panah, drag mouse/sentuh,
 * geser dua jari di trackpad (WheelGesturesPlugin), klik kartu belakang, atau tombol ← →.
 */
export function ShowroomCarousel({
  slides,
  label,
  onActiveChange,
  ref,
}: Props) {
  const { t } = useLanguage();
  const n = slides.length;
  const loop = n > 1;
  const reduced = useRef(false);

  // Salinan hanya untuk memenuhi loop; indeks asli dipakai untuk label "x dari n" & titik navigasi.
  const items = useMemo(() => {
    const copies = loop ? Math.ceil(MIN_SLIDES / n) : 1;
    return Array.from({ length: copies }, (_, c) =>
      slides.map((s, i) => ({ ...s, key: `${s.id}~${c}`, index: i })),
    ).flat();
  }, [slides, n, loop]);

  const [viewportRef, api] = useEmblaCarousel(
    { loop, align: "center", duration: 32 },
    loop ? [WheelGesturesPlugin()] : [],
  );
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const tweenNodes = useRef<HTMLElement[]>([]);

  /** Skala, geser ke tengah (agar jarak antarkartu tetap rapat), dan redup sesuai jarak dari tengah. */
  const tween = useCallback((embla: EmblaCarouselType) => {
    const engine = embla.internalEngine();
    const progress = embla.scrollProgress();
    const snaps = embla.scrollSnapList();
    snaps.forEach((snap, snapIndex) => {
      engine.slideRegistry[snapIndex].forEach((slideIndex) => {
        let diff = snap - progress;
        // Kartu yang sedang dipindah oleh loop: hitung jaraknya dari sisi seberang.
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((point) => {
            const target = point.target();
            if (slideIndex === point.index && target !== 0)
              diff =
                Math.sign(target) === -1
                  ? snap - (1 + progress)
                  : snap + (1 - progress);
          });
        }
        const node = tweenNodes.current[slideIndex];
        if (!node) return;
        const d = Math.abs(diff * snaps.length); // jarak dalam satuan kartu
        const shrink = (node.offsetWidth * (1 - BACK_SCALE)) / 2;
        const shift = -Math.sign(diff) * shrink * (d <= 1 ? d : 2 * d - 1);
        const scale = 1 - (1 - BACK_SCALE) * Math.min(d, 1);
        node.style.transform = `translate3d(${shift.toFixed(2)}px,0,0) scale(${scale.toFixed(4)})`;
        node.style.opacity = String(
          1 - 0.35 * Math.min(d, 1) - 0.25 * clamp(d - 1, 0, 1),
        );
        node.style.zIndex = String(10 - Math.round(d));
      });
    });
  }, []);

  useEffect(() => {
    if (!api) return;
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const setNodes = (embla: EmblaCarouselType) => {
      tweenNodes.current = embla
        .slideNodes()
        .map((s) => s.firstElementChild as HTMLElement);
    };
    const onSelect = (embla: EmblaCarouselType) =>
      setActive(embla.selectedScrollSnap());
    setNodes(api);
    tween(api);
    onSelect(api);
    setReady(true);
    api
      .on("reInit", setNodes)
      .on("reInit", tween)
      .on("scroll", tween)
      .on("slideFocus", tween)
      .on("select", onSelect);
    return () => {
      api
        .off("reInit", setNodes)
        .off("reInit", tween)
        .off("scroll", tween)
        .off("slideFocus", tween)
        .off("select", onSelect);
    };
  }, [api, tween]);

  // Kabari induk (peta) hanya bila kartu aktif berganti setelah init, bukan saat pertama tampil.
  const first = useRef(true);
  const activeId = items[active]?.id;
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (activeId) onActiveChange(activeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const go = useCallback(
    (i: number) => api?.scrollTo(i, reduced.current),
    [api],
  );
  const step = useCallback(
    (dir: 1 | -1) =>
      dir === 1
        ? api?.scrollNext(reduced.current)
        : api?.scrollPrev(reduced.current),
    [api],
  );

  /** Ke salinan kartu `id` yang terdekat dari posisi sekarang (arah mana pun, karena melingkar). */
  const goTo = useCallback(
    (id: string) => {
      if (!api) return;
      const total = items.length;
      const cur = api.selectedScrollSnap();
      let best = -1;
      let bestDist = Infinity;
      items.forEach((it, i) => {
        if (it.id !== id) return;
        const raw = Math.abs(i - cur);
        const dist = loop ? Math.min(raw, total - raw) : raw;
        if (dist < bestDist) {
          best = i;
          bestDist = dist;
        }
      });
      if (best >= 0 && best !== cur) go(best);
    },
    [api, items, loop, go],
  );
  useImperativeHandle(ref, () => ({ goTo }), [goTo]);

  const activeIndex = items[active]?.index ?? 0;

  return (
    <div
      role="region"
      aria-roledescription={t("showroomPage.locations.carousel")}
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        }
      }}
      // Sedikit lebih lebar dari peta (.main-container) di desktop, tetap di tengah; mobile selebar layar.
      className="relative mx-auto w-full max-w-[1328px] outline-none focus-visible:ring-2 focus-visible:ring-ring/50 lg:px-6"
    >
      <div className="relative">
        <div
          ref={viewportRef}
          className={cn(
            "relative overflow-hidden py-2 transition-opacity duration-500",
            "cursor-grab active:cursor-grabbing [&.is-wheel-dragging]:cursor-grabbing",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="-ml-3 flex touch-pan-y items-stretch sm:-ml-4">
            {items.map((it, i) => {
              const isActive = i === active;
              return (
                <div
                  key={it.key}
                  role="group"
                  aria-roledescription={t("showroomPage.locations.slide")}
                  aria-label={`${it.index + 1} / ${n}: ${it.label}`}
                  aria-hidden={!isActive || undefined}
                  className="flex min-w-0 shrink-0 grow-0 basis-auto pl-3 sm:pl-4"
                >
                  {/* Simpul tween (skala/geser/redup) terpisah dari slide yang digeser Embla. */}
                  <div className="relative flex origin-center will-change-transform">
                    <div inert={!isActive} className="flex">
                      {it.render(isActive)}
                    </div>
                    {!isActive && (
                      // Kartu belakang: klik = jadikan aktif. Isi kartu inert agar tak bisa di-Tab.
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-hidden
                        onClick={() => go(i)}
                        className="absolute inset-0 cursor-pointer rounded-2xl"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Tepi kiri/kanan: blur bertingkat (di dalam viewport, terpotong bersama kartu)… */}
          <EdgeBlur side="left" />
          <EdgeBlur side="right" />
        </div>
        {/* …lalu gradasi warna latar, di desktop 1px melewati tepi potong: tepi itu bisa jatuh di setengah
            piksel sehingga sisa kartu tembus sebagai garis tipis bila hanya ditutup dari dalam. */}
        <EdgeTint side="left" />
        <EdgeTint side="right" />

        {loop && (
          <>
            <ArrowButton
              side="left"
              label={t("showroomPage.locations.prev")}
              onClick={() => step(-1)}
              className="absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 sm:grid lg:left-8"
            />
            <ArrowButton
              side="right"
              label={t("showroomPage.locations.next")}
              onClick={() => step(1)}
              className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 sm:grid lg:right-8"
            />
          </>
        )}
      </div>

      {loop && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <ArrowButton
            side="left"
            label={t("showroomPage.locations.prev")}
            onClick={() => step(-1)}
            className="grid sm:hidden"
          />
          <div className="flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.label}
                aria-current={i === activeIndex || undefined}
                onClick={() => goTo(s.id)}
                className="grid h-6 cursor-pointer place-items-center px-0.5"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                    i === activeIndex
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-foreground/20 hover:bg-foreground/40",
                  )}
                />
              </button>
            ))}
          </div>
          <ArrowButton
            side="right"
            label={t("showroomPage.locations.next")}
            onClick={() => step(1)}
            className="grid sm:hidden"
          />
        </div>
      )}
    </div>
  );
}

const EDGE_WIDTH = "w-5 sm:w-24 lg:w-40";

/** Tiga lapis blur, makin kuat ke tepi (progressive blur). */
function EdgeBlur({ side }: { side: "left" | "right" }) {
  const dir = side === "left" ? "to right" : "to left";
  const layers = [
    { blur: 2, stop: "100%" },
    { blur: 5, stop: "66%" },
    { blur: 10, stop: "33%" },
  ];
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 z-20",
        EDGE_WIDTH,
        side === "left" ? "left-0" : "right-0",
      )}
    >
      {layers.map((l) => {
        const mask = `linear-gradient(${dir}, black, transparent ${l.stop})`;
        return (
          <div
            key={l.blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${l.blur}px)`,
              WebkitBackdropFilter: `blur(${l.blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}

/** Gradasi ke warna latar section, kartu yang keluar seolah memudar. */
function EdgeTint({ side }: { side: "left" | "right" }) {
  const dir = side === "left" ? "to right" : "to left";
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 z-20",
        EDGE_WIDTH,
        side === "left" ? "left-0 lg:-left-px" : "right-0 lg:-right-px",
      )}
      style={{
        background: `linear-gradient(${dir}, var(--muted) 14%, color-mix(in oklab, var(--muted) 65%, transparent) 50%, transparent)`,
      }}
    />
  );
}

function ArrowButton({
  side,
  label,
  onClick,
  className,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
  className?: string;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "h-11 w-11 cursor-pointer place-items-center rounded-full border border-border bg-card/90 text-foreground shadow-[var(--shadow-md)] backdrop-blur transition-[transform,border-color] duration-200 hover:border-primary/50 active:scale-95",
        className,
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}
