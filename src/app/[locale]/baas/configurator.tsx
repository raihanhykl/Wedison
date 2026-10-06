"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as m from "motion/react-m";
import { AnimatePresence, useMotionValue, useSpring, useMotionValueEvent } from "motion/react";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { EASE_OUT_EXPO } from "@/components/motion/config";
import { whatsappUrl } from "@/lib/seo/site";
import {
  BAAS_MODELS,
  DEFAULT_MODEL,
  DEFAULT_PLAN,
  isModelId,
  isPlanId,
  perDay,
  rupiah,
  type ModelId,
  type PlanId,
} from "./data";

const INCLUDED_KEYS = [1, 2, 3, 4, 5] as const;

/**
 * Konfigurator BaaS — momen interaktif utama halaman. Pilih model + paket baterai; kartu
 * harga memperbarui angka dengan spring, foto produk silang-pudar. Aturan kampanye dijaga:
 * harga motor dan langganan SELALU satu frame, plus satu baris "terbatas waktu & kuota".
 * State disinkronkan ke URL (?model=&plan=) supaya penawaran bisa dibagikan.
 */
export default function BaasConfigurator() {
  const { t, language } = useLanguage();
  const [modelId, setModelId] = useState<ModelId>(DEFAULT_MODEL);
  const [planId, setPlanId] = useState<PlanId>(DEFAULT_PLAN);

  const model = useMemo(() => BAAS_MODELS.find((mo) => mo.id === modelId)!, [modelId]);
  const plan = model.plans.find((p) => p.id === planId) ?? model.plans[0];
  const hasExtended = model.plans.some((p) => p.id === "extended");

  // Baca ?model=&plan= sekali saat mount (tanpa useSearchParams -> tak perlu Suspense).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const mo = q.get("model");
    const pl = q.get("plan");
    if (isModelId(mo)) setModelId(mo);
    if (isPlanId(pl)) setPlanId(pl);
  }, []);

  // Tulis balik ke URL tanpa navigasi/scroll.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set("model", modelId);
    url.searchParams.set("plan", plan.id);
    window.history.replaceState(window.history.state, "", url);
  }, [modelId, plan.id]);

  const selectModel = (id: ModelId) => {
    setModelId(id);
    const next = BAAS_MODELS.find((mo) => mo.id === id)!;
    if (!next.plans.some((p) => p.id === planId)) setPlanId("standard");
  };

  const planLabel = t(`baas.calc.plan.${plan.id}`);
  const wa = whatsappUrl(
    t("baas.calc.waMessage").replace("{model}", model.name).replace("{plan}", planLabel),
  );

  return (
    <section id="hitung" className="scroll-mt-20 bg-muted py-16 sm:py-24">
      <div className="main-container">
        <Reveal className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
            {t("baas.calc.kicker")}
          </p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("baas.calc.title")}
          </h2>
          <p className="mt-4 max-w-[52ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("baas.calc.subtitle")}
          </p>
        </Reveal>

        <Reveal y={24} className="mt-10 sm:mt-14">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
            {/* ---- Kontrol ---------------------------------------------------- */}
            <div className="flex flex-col gap-8">
              <fieldset>
                <legend className="text-sm font-semibold text-foreground">{t("baas.calc.model")}</legend>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                  {BAAS_MODELS.map((mo) => {
                    const active = mo.id === modelId;
                    return (
                      <button
                        key={mo.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => selectModel(mo.id)}
                        className={cn(
                          "group relative flex flex-col items-center rounded-xl border bg-card px-2 pb-3 pt-2 text-center transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          active
                            ? "border-primary shadow-[var(--shadow-md)]"
                            : "border-border hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-sm)]",
                        )}
                      >
                        <span className="relative block aspect-[4/3] w-full">
                          <Image
                            src={`/navbar-product/${mo.id}.webp`}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 30vw, 180px"
                            className={cn(
                              "object-contain transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                              active ? "scale-[1.04]" : "group-hover:scale-[1.04]",
                            )}
                          />
                        </span>
                        <span
                          className={cn(
                            "mt-1 font-display text-sm font-semibold sm:text-base",
                            active ? "text-primary" : "text-foreground",
                          )}
                        >
                          {mo.name}
                        </span>
                        {active ? (
                          <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3 w-3" aria-hidden />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold text-foreground">{t("baas.calc.plan")}</legend>
                <div
                  className="relative mt-3 grid grid-cols-2 rounded-xl border border-border bg-card p-1"
                  role="radiogroup"
                >
                  {/* Pil penanda meluncur di bawah tombol aktif. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-primary transition-transform duration-[380ms] ease-[cubic-bezier(.16,1,.3,1)]"
                    style={{ transform: plan.id === "extended" ? "translateX(100%)" : "translateX(0)" }}
                  />
                  {(["standard", "extended"] as const).map((id) => {
                    const available = id === "standard" || hasExtended;
                    const active = plan.id === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={!available}
                        onClick={() => setPlanId(id)}
                        className={cn(
                          "relative z-10 flex min-h-12 flex-col items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          active ? "text-primary-foreground" : "text-foreground",
                          !available && "cursor-not-allowed opacity-40",
                        )}
                      >
                        {t(`baas.calc.plan.${id}`)}
                        {id === "extended" ? (
                          <span
                            className={cn(
                              "text-[11px] font-normal",
                              active ? "text-primary-foreground/80" : "text-muted-foreground",
                            )}
                          >
                            {hasExtended ? t("baas.calc.plan.extended.hint") : t("baas.calc.plan.onlyStandard")}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <p className="text-sm font-semibold text-foreground">{t("baas.calc.included")}</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {INCLUDED_KEYS.map((n) => (
                    <li key={n} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>{t(`baas.included.${n}.title`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ---- Kartu harga ------------------------------------------------ */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-lg)]">
              <div className="relative aspect-[16/9] w-full bg-muted sm:aspect-[2/1]">
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={model.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                  >
                    <Image
                      src={model.image}
                      alt={model.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 640px"
                      className="object-cover object-center"
                    />
                  </m.div>
                </AnimatePresence>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-4 left-5 sm:left-7">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Wedison
                  </span>
                  <p className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {model.name}{" "}
                    <span className="text-base font-medium text-muted-foreground">· {planLabel}</span>
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {/* Aturan #1: harga unit & langganan selalu bersebelahan, satu frame. */}
                <dl className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                  <div className="rounded-xl bg-muted p-4 sm:p-5">
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {t("baas.calc.unitPrice")}
                    </dt>
                    <dd className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      <AnimatedRupiah value={model.unitPrice} locale={language} />
                    </dd>
                    <dd className="mt-1 text-xs text-muted-foreground">{t("baas.calc.unitPrice.note")}</dd>
                  </div>
                  <div className="rounded-xl bg-primary p-4 text-primary-foreground sm:p-5">
                    <dt className="text-xs uppercase tracking-[0.14em] text-primary-foreground/75">
                      {t("baas.calc.monthly")}
                    </dt>
                    <dd className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                      <AnimatedRupiah value={plan.monthly} locale={language} />
                      <span className="ml-1 text-sm font-medium text-primary-foreground/75">
                        {t("baas.calc.perMonth")}
                      </span>
                    </dd>
                    <dd className="mt-1 text-xs text-primary-foreground/80">
                      {t("baas.calc.perDay.note")}{" "}
                      <span className="font-semibold text-primary-foreground">
                        ≈ {rupiah(perDay(plan.monthly), language)}
                        {t("baas.calc.perDay")}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="flex-1">
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5" />
                      {t("baas.calc.cta")}
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="flex-1">
                    <Link href={`/${language}${model.href}`}>
                      {t("baas.calc.ctaSecondary")}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                {/* Aturan #4: batas waktu & kuota, satu baris cukup. */}
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                  {t("baas.calc.disclaimer")}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Angka rupiah yang "berjalan" ke nilai baru lewat spring. SSR merender nilai akhir
 * (bukan 0) supaya crawler/no-JS membaca harga yang benar.
 */
function AnimatedRupiah({ value, locale }: { value: number; locale: "id" | "en" }) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 170, damping: 26, mass: 0.8 });
  const [text, setText] = useState(() => rupiah(value, locale));
  const target = useRef({ value, locale });
  target.current = { value, locale };

  useEffect(() => {
    mv.set(value);
  }, [mv, value]);

  useMotionValueEvent(spring, "change", (latest) => {
    setText(rupiah(Math.round(latest / 1000) * 1000, locale));
  });
  // Spring berhenti di sekitar target; pastikan teks akhir = nilai persis.
  useMotionValueEvent(spring, "animationComplete", () => {
    setText(rupiah(target.current.value, target.current.locale));
  });

  // Format mengikuti locale meski nilai tak berubah.
  useEffect(() => {
    setText(rupiah(value, locale));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return <span>{text}</span>;
}
