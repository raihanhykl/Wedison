/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import PeekCarousel from "./peek";
import { cn } from "@/lib/utils";
import GetProductData from "../lib/product-data";
import { useLanguage } from "../lib/language-context";
import CompareStructure from "@/app/[locale]/compare/structure";
import UserManualSection from "@/components/user-manual-section";
import { useInView } from "react-intersection-observer";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

type Props = {
  motorType: string;
};

export default function ProductPageComponent({ motorType }: Props) {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const product = GetProductData(motorType);
  // Seed dengan nilai spesifikasi asli -> SSR/no-JS menampilkan angka benar (bukan 0).
  const [counts, setCounts] = useState<(number | string)[]>(() =>
    product ? product.techSpec.map((s) => s.title) : [0, 0, 0],
  );
  const { ref, inView } = useInView({ triggerOnce: true });
  const { t, language } = useLanguage();

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Client-only: turunkan angka numerik ke 0 (saat section masih di luar viewport) supaya
  // count-up punya titik mulai; SSR tetap membawa nilai asli untuk aksesibilitas/crawler.
  useEffect(() => {
    if (!product) return;
    setCounts(product.techSpec.map((s) => (typeof s.title === "number" ? 0 : s.title)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motorType]);

  useEffect(() => {
    if (!inView || !product) return;
    const timers: ReturnType<typeof setInterval>[] = [];
    product.techSpec.forEach((s, i) => {
      const target = s.title;
      if (typeof target !== "number") {
        setCounts((p) => p.map((v, j) => (j === i ? target : v)));
        return;
      }
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounts((p) => p.map((v, j) => (j === i ? current : v)));
      }, 22);
      timers.push(timer);
    });
    return () => timers.forEach(clearInterval);
  }, [inView]);

  if (!product) return null;

  const kicker = language === "id" ? "Motor Listrik Wedison" : "Wedison Electric";

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <Image
          src={
            isDesktop
              ? product.hero.imageUrl
              : product.hero.imageUrlMobile || product.hero.imageUrl
          }
          alt={product.hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className={cn("object-cover object-center", product.hero.className)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 sm:pb-28">
          <div className="main-container flex flex-col items-center text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/75">
              {kicker}
            </p>
            <h1 className="mt-4 text-balance text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-7xl lg:text-8xl">
              {product.hero.title}
            </h1>
            <p className="mt-4 max-w-[46ch] text-base text-white/85 sm:text-lg">
              {product.hero.desc}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="https://www.tokopedia.com/wedison-store"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2 bg-white text-foreground hover:bg-white/90">
                  <Image
                    src="/icons/Tokopedia_Mascot.png"
                    alt=""
                    width={28}
                    height={28}
                    className="h-6 w-6"
                  />
                  {t("btn.buy.on.tokopedia")}
                </Button>
              </Link>
              <Link
                href={`/brochure/brochure-${motorType}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="border border-white/40 bg-white/10 text-white hover:bg-white/20"
                >
                  {t("btn.see.brochure")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <ChevronDown className="absolute bottom-8 left-1/2 h-6 w-6 -translate-x-1/2 animate-float text-white/70" />
      </section>

      {/* ============ STICKY SUB-NAV ============ */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/95">
        <div className="main-container flex items-center justify-between gap-4 py-3">
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            {product.hero.title}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/brochure/brochure-${motorType}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <Button variant="ghost" size="sm">
                {t("btn.see.brochure")}
              </Button>
            </Link>
            <Link
              href="https://www.tokopedia.com/wedison-store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm">{t("btn.buy.on.tokopedia")}</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ============ TECH SPEC (mono counters) ============ */}
      <section ref={ref} className="main-container py-16 sm:py-24">
        <Stagger className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
          {product.techSpec.map((s, i) => (
            <StaggerItem
              key={i}
              className={cn(
                "flex flex-col items-center text-center sm:items-start sm:text-left",
                i > 0 && "sm:border-l sm:border-border sm:pl-6",
              )}
            >
              <div className="flex items-end gap-1">
                <span className="font-mono text-6xl font-semibold leading-none tracking-tight text-foreground sm:text-7xl">
                  {counts[i]}
                </span>
                {s.unit && (
                  <span className="mb-1 font-mono text-xl font-medium text-primary sm:text-2xl">
                    {s.unit}
                  </span>
                )}
              </div>
              <div className="mt-3 text-base font-medium text-muted-foreground">{s.desc}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ============ PRODUCT OVERVIEW ============ */}
      <FeatureBlock
        image={
          isDesktop
            ? product.productOverview.imageUrl
            : product.productOverview.imageUrlMobile || product.productOverview.imageUrl
        }
        imageClass={product.productOverview.className}
        alt={product.productOverview.imageAlt}
        title={product.productOverview.title}
        desc={product.productOverview.desc}
      />

      {/* ============ PRODUCT HIGHLIGHT ============ */}
      <div className="py-8 sm:py-12">
        <PeekCarousel data={product.productHighlight} for={motorType} perView={1.35} />
      </div>

      {/* ============ SUPERCHARGE OVERVIEW ============ */}
      {product.chargingOverview && (
        <FeatureBlock
          image={
            isDesktop
              ? product.chargingOverview.imageUrl
              : product.chargingOverview.imageUrlMobile || product.chargingOverview.imageUrl
          }
          imageClass={product.chargingOverview.className}
          alt={product.chargingOverview.imageAlt}
          title={product.chargingOverview.title}
          desc={product.chargingOverview.desc}
        />
      )}

      {/* ============ SUPERCHARGE HIGHLIGHT ============ */}
      {product.chargingHighlight && (
        <div className="py-8 sm:py-12">
          <PeekCarousel data={product.chargingHighlight} for="supercharge" perView={1.35} />
        </div>
      )}

      {/* ============ COMPARISON ============ */}
      <CompareStructure embedded initialColumns={[motorType]} />

      {/* ============ USER MANUAL ============ */}
      <UserManualSection
        variant="single"
        motorType={motorType as "bees" | "athena" | "victory" | "edpower"}
      />
    </div>
  );
}

function FeatureBlock({
  image,
  imageClass,
  alt,
  title,
  desc,
}: {
  image: string;
  imageClass?: string;
  alt: string;
  title: string;
  desc: any;
}) {
  return (
    <section className="main-container py-16 sm:py-24">
      <Reveal className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:aspect-[16/8]" y={0}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 1280px) 100vw, 1200px"
          className={cn("object-cover object-center", imageClass)}
        />
      </Reveal>
      <Reveal className="mt-8 max-w-3xl" y={28} amount={0.4}>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        <div className="mt-4 text-lg leading-relaxed text-muted-foreground">{desc}</div>
      </Reveal>
    </section>
  );
}
