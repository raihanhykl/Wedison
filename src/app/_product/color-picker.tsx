"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { AnimatePresence, useReducedMotion, type Transition, type Variants } from "motion/react";
import { RadioGroup } from "radix-ui";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { BookingTrigger } from "@/components/booking/booking-trigger";
import { LocaleLink } from "@/components/locale-link";
import { Reveal } from "@/components/motion/reveal";
import { EASE_OUT_EXPO } from "@/components/motion/config";
import { pushDataLayer } from "@/lib/booking/analytics";
import { PRODUCT_NAMES } from "@/lib/pricing/select";
import type { ProductId } from "@/lib/pricing/types";
import { paintsFor, type Paint } from "@/lib/product-paints";
import { cn } from "@/lib/utils";

/** +1 = cat baru masuk dari kanan, -1 = dari kiri (mengikuti posisi swatch / arah geser). */
type Dir = 1 | -1;
type Layer = { key: number; slug: string; dir: Dir; animate: boolean };

const URL_PARAM = "color";
const SWIPE_MIN_PX = 40;
const TRACK_DELAY_MS = 800;
// Pengaman saja (mis. tombol panah ditahan); normalnya layer dipangkas oleh settle().
const MAX_LAYERS = 12;
const IMAGE_SIZES = "(min-width: 1024px) 560px, 80vw";

// Sapuan larut: kurva lembut di awal dan akhir (bukan expo) supaya zona baur bergerak rata.
const SWEEP: Transition = { duration: 0.9, ease: [0.4, 0, 0.2, 1] };
const FADE: Transition = { duration: 0.2, ease: "easeOut" };
/** Lebar zona baur antara warna lama dan baru, dalam % lebar gambar. */
const FEATHER = 60;
/** Blur maksimum saat dua foto bertumpuk; menyamarkan selisih geometri antar foto. */
const SOFTEN = "blur(3px)";
const SHARP = "blur(0px)";
const SNAP: Transition = { duration: 0.35, ease: EASE_OUT_EXPO };

const nameRoll: Variants = {
  enter: (d: Dir) => ({ y: d > 0 ? "100%" : "-100%" }),
  center: { y: "0%" },
  exit: (d: Dir) => ({ y: d > 0 ? "-100%" : "100%" }),
};

const fill = (s: string, vars: Record<string, string>) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), s);

/**
 * Pilihan warna di halaman produk.
 *
 * Transisi "sapuan larut": tiap warna dirender sebagai layer bertumpuk. Layer baru muncul lewat
 * mask bertepi lembut (zona baur {@link FEATHER}%) yang menyapu dari arah swatch; layer lama
 * memudar dengan mask kebalikan yang persis sama, dan keduanya dijumlahkan (plus-lighter) jadi
 * crossfade presisi. Foto tiap warna tidak identik 100% (sudut kamera, spion, standar) dan berupa
 * cutout transparan, jadi layer lama tidak boleh sekadar "ditimpa": ia harus sudah 0% saat
 * dibuang. Layer dibuang setelah penggantinya selesai, jadi klik beruntun tetap mulus.
 *
 * Aksesibilitas: Radix RadioGroup (roving focus, panah kiri/kanan, aria-checked). Gesture geser
 * di stage hanya tambahan untuk layar sentuh. Reduced motion: sapuan diganti fade singkat.
 */
export function ColorPicker({ model }: { model: ProductId }) {
  const { t, language } = useLanguage();
  const locale = language === "en" ? "en" : "id";
  const { paints, aspectRatio } = paintsFor(model);
  const name = PRODUCT_NAMES[model];
  const reduce = useReducedMotion() ?? false;

  const [layers, setLayers] = useState<Layer[]>(() => [{ key: 0, slug: paints[0].slug, dir: 1, animate: false }]);
  const [touched, setTouched] = useState(false);
  const keyRef = useRef(0);
  const trackTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);

  const top = layers[layers.length - 1];
  const active = paints.find((p) => p.slug === top.slug) ?? paints[0];
  const indexOf = (slug: string) => paints.findIndex((p) => p.slug === slug);

  // Deep link (?color=pink) — dibaca setelah hydration supaya HTML SSR tetap deterministik.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get(URL_PARAM);
    if (!wanted || wanted === paints[0].slug || !paints.some((p) => p.slug === wanted)) return;
    setLayers([{ key: ++keyRef.current, slug: wanted, dir: 1, animate: false }]);
  }, [paints]);

  useEffect(() => () => clearTimeout(trackTimer.current), []);

  function choose(slug: string, dir?: Dir) {
    if (slug === top.slug || indexOf(slug) < 0) return;
    const layer: Layer = {
      key: ++keyRef.current,
      slug,
      dir: dir ?? (indexOf(slug) > indexOf(top.slug) ? 1 : -1),
      animate: true,
    };
    setLayers((prev) => [...prev, layer].slice(-MAX_LAYERS));
    setTouched(true);

    // URL bisa dibagikan tanpa memicu navigasi/scroll (Next menyinkronkan history native).
    const url = new URL(window.location.href);
    url.searchParams.set(URL_PARAM, slug);
    window.history.replaceState(null, "", url);

    // Catat pilihan yang "mendarat" saja, bukan tiap langkah saat menelusuri dengan panah.
    clearTimeout(trackTimer.current);
    trackTimer.current = setTimeout(() => {
      pushDataLayer({ event: "product_color_select", product_model: model, product_color: slug });
    }, TRACK_DELAY_MS);
  }

  function step(dir: Dir) {
    const next = paints[(indexOf(top.slug) + dir + paints.length) % paints.length];
    choose(next.slug, dir);
  }

  function settle(key: number) {
    // Layer `key` sudah menutup penuh -> semua layer di bawahnya tak terlihat lagi.
    setLayers((prev) => {
      const i = prev.findIndex((l) => l.key === key);
      return i > 0 ? prev.slice(i) : prev;
    });
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") return;
    swipe.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy)) return;
    step(dx < 0 ? 1 : -1);
  }

  const altFor = (p: Paint) => fill(t("product.colors.imageAlt"), { model: name, color: p.name[locale] });
  const headingId = `colors-heading-${model}`;

  return (
    <section id="colors" aria-labelledby={headingId} className="scroll-mt-20 py-16 sm:py-24">
      <div
        className={cn(
          "main-container grid gap-8 [grid-template-areas:'head'_'stage'_'ctrl']",
          "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-14 lg:gap-y-0",
          "lg:[grid-template-areas:'stage_.'_'stage_head'_'stage_ctrl'_'stage_.']",
        )}
      >
        {/* ── Judul ─────────────────────────────────────────────── */}
        <Reveal className="[grid-area:head]">
          <h2 id={headingId} className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {fill(t("product.colors.title"), { model: name })}
          </h2>
          <p className="mt-4 max-w-[44ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {fill(t("product.colors.desc"), { count: String(paints.length) })}
          </p>
        </Reveal>

        {/* ── Stage ─────────────────────────────────────────────── */}
        <Reveal y={0} className="[grid-area:stage]">
          <div
            className="relative flex aspect-[4/3] touch-pan-y select-none items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary/60 sm:aspect-[16/11] lg:aspect-[5/4]"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current = null)}
          >
            <div className="relative h-[80%] sm:h-[74%]" style={{ aspectRatio }}>
              {/* Bayangan kontak: menapakkan motor ke "lantai" stage. Statis. */}
              <div aria-hidden className="absolute inset-x-[8%] -bottom-[2.5%] h-[6%] rounded-[50%] bg-foreground/20 blur-md" />

              {/* Pemanasan cache: semua warna ikut lazy-load saat stage mendekati viewport,
                  sehingga sapuan pertama tidak menunggu unduhan. URL identik dengan layer. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0">
                {paints.map((p) => (
                  <Image key={p.slug} src={p.src} alt="" fill sizes={IMAGE_SIZES} className="object-contain" />
                ))}
              </div>

              {/* Grup terisolasi: layer dijumlahkan (plus-lighter) satu sama lain saja, lalu
                  grup ditempel normal ke stage, bukan ke bayangan atau latar. */}
              <div className="absolute inset-0 isolate">
                {layers.map((layer, i) => {
                  const paint = paints.find((p) => p.slug === layer.slug) ?? paints[0];
                  return (
                    <PaintLayer
                      key={layer.key}
                      paint={paint}
                      alt={layer === top ? altFor(paint) : ""}
                      dir={layer.dir}
                      animate={layer.animate}
                      exitDir={layers[i + 1]?.dir}
                      reduce={reduce}
                      onDone={() => settle(layer.key)}
                    />
                  );
                })}
              </div>
            </div>

            <p
              aria-hidden
              className={cn(
                "pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-background/85 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-opacity duration-300 pointer-coarse:block",
                touched && "opacity-0",
              )}
            >
              {t("product.colors.swipeHint")}
            </p>
          </div>
        </Reveal>

        {/* ── Kontrol ───────────────────────────────────────────── */}
        <Reveal y={20} delay={0.08} className="[grid-area:ctrl] lg:mt-10">
          <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">{t("product.colors.label")}</p>
              <p className="relative mt-1 overflow-hidden font-display text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl">
                <AnimatePresence initial={false} mode="popLayout" custom={top.dir}>
                  <m.span
                    key={active.slug}
                    custom={top.dir}
                    variants={nameRoll}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={SNAP}
                    className="block truncate"
                  >
                    {active.name[locale]}
                  </m.span>
                </AnimatePresence>
              </p>
            </div>
            <span className="shrink-0 pb-1.5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t(`product.colors.finish.${active.finish}`)}
            </span>
          </div>

          <RadioGroup.Root
            value={active.slug}
            onValueChange={(slug) => choose(slug)}
            orientation="horizontal"
            loop
            aria-label={fill(t("product.colors.groupLabel"), { model: name })}
            className="mt-5 flex flex-wrap gap-2"
          >
            {paints.map((p) => {
              const checked = p.slug === active.slug;
              return (
                <RadioGroup.Item
                  key={p.slug}
                  value={p.slug}
                  aria-label={`${p.name[locale]}, ${t(`product.colors.finish.${p.finish}`)}`}
                  className="group relative grid size-11 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {checked ? (
                    <m.span
                      layoutId={`paint-ring-${model}`}
                      transition={SNAP}
                      aria-hidden
                      className="absolute inset-0 rounded-full border-2 border-foreground"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full border border-foreground/25 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    />
                  )}
                  <span aria-hidden className="size-8 rounded-full" style={swatchStyle(p)} />
                </RadioGroup.Item>
              );
            })}
          </RadioGroup.Root>

          <div className="mt-8">
            <BookingTrigger asChild purpose="testRide" source="product-colors">
              <Button size="lg">{t("btn.testRide.short")}</Button>
            </BookingTrigger>
          </div>
          <p className="mt-5 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
            {t("product.colors.note")}{" "}
            <LocaleLink href="/showroom" className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">
              {t("product.colors.seeShowroom")}
            </LocaleLink>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Mask sapuan: `entry` membuka layer dari sisi asal (hitam = terlihat); `exit` adalah kebalikan
 * persisnya, dipasang pada layer lama dengan arah & progres yang sama milik layer penggantinya.
 * Di tiap titik porsi lama + porsi baru = 1, sehingga layer lama sudah 0% saat dibuang.
 */
function sweepMask(dir: Dir, variable: "--sweep" | "--out", invert: boolean) {
  const side = dir > 0 ? "to left" : "to right";
  const [from, to] = invert ? ["transparent", "#000"] : ["#000", "transparent"];
  const reach = 100 + FEATHER;
  return `linear-gradient(${side}, ${from} calc(var(${variable}) * ${reach}% - ${FEATHER}%), ${to} calc(var(${variable}) * ${reach}%))`;
}

function PaintLayer({
  paint,
  alt,
  dir,
  animate,
  exitDir,
  reduce,
  onDone,
}: {
  paint: Paint;
  alt: string;
  dir: Dir;
  animate: boolean;
  /** Arah layer yang menggantikan layer ini; undefined = layer ini yang teratas. */
  exitDir?: Dir;
  reduce: boolean;
  onDone: () => void;
}) {
  const leaving = exitDir !== undefined;
  const image = (
    <Image
      src={paint.src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      fill
      sizes={IMAGE_SIZES}
      loading={animate ? "eager" : "lazy"}
      draggable={false}
      className="object-contain"
    />
  );

  // Cutout transparan: layer baru TIDAK menutup layer lama di luar siluetnya (spion, standar,
  // tepi bodi berbeda antar foto). Karena itu layer lama selalu ikut memudar, tidak pernah
  // dibiarkan utuh lalu dihapus mendadak. plus-lighter menjumlahkan keduanya tepat jadi 100%.
  // Reduced motion memakai struktur DOM yang sama (hanya nilai animasi berbeda) supaya HTML SSR,
  // yang tidak tahu preferensi pengguna, tetap cocok saat hydration.
  const sweeping = !reduce;
  const entry = sweepMask(dir, "--sweep", false);
  const mask = leaving && sweeping ? `${entry}, ${sweepMask(exitDir, "--out", true)}` : entry;

  return (
    <m.div
      className="absolute inset-0 mix-blend-plus-lighter will-change-[filter]"
      style={{ maskImage: mask, WebkitMaskImage: mask, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
      initial={
        animate
          ? sweeping
            ? { opacity: 1, "--sweep": 0, "--out": 0, filter: SOFTEN }
            : { opacity: 0, "--sweep": 1, "--out": 0, filter: SHARP }
          : false
      }
      animate={{
        opacity: leaving && !sweeping ? 0 : 1,
        "--sweep": 1,
        "--out": leaving && sweeping ? 1 : 0,
        filter: leaving && sweeping ? SOFTEN : SHARP,
      }}
      transition={sweeping ? SWEEP : FADE}
      onAnimationComplete={animate ? onDone : undefined}
    >
      {image}
    </m.div>
  );
}

/** Swatch: glossy diberi pantulan cahaya tipis di tepi atas, doff dibiarkan datar. */
function swatchStyle(p: Paint): CSSProperties {
  const edge = "inset 0 0 0 1px rgb(20 31 24 / 0.14)";
  const gloss = "inset 0 3px 2px -1px rgb(255 255 255 / 0.45)";
  return { backgroundColor: p.hex, boxShadow: p.finish === "glossy" ? `${gloss}, ${edge}` : edge };
}
