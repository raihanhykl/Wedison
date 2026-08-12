"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowRight,
  GitCompareArrows,
  Zap,
  MapPin,
  BatteryCharging,
  Wallet,
  Headphones,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ShrinkHero } from "@/components/motion/shrink-hero";
import { useLanguage } from "../lib/language-context";
import AppDownloadTeaser from "@/components/app-download-teaser";

type Lang = "id" | "en";

const NAMES: Record<string, string> = {
  athena: "Athena",
  bees: "Bees",
  victory: "Victory",
  edpower: "EdPower",
};

const MODELS = [
  {
    id: "athena",
    line: "Style",
    productImage: "/new-looks/01-HERO CARD-LP.webp",
  },
  {
    id: "bees",
    line: "Commute",
    productImage: "/new-looks/02-HERO CARD-LP.webp",
  },
  {
    id: "victory",
    line: "Fleet",
    productImage: "/new-looks/04-HERO CARD-LP.webp",
  },
  {
    id: "edpower",
    line: "Performance",
    productImage: "/new-looks/03-HERO CARD-LP.webp",
  },
] as const;

/**
 * Hero = 3 babak BRAND (bukan per-model — jajaran model punya section `#lineup` sendiri).
 * Copy diturunkan dari isi gambar, satu CTA per slide dengan tujuan yang berbeda.
 * `pos` = object-position agar subjek selamat saat gambar 16:9 di-crop jadi potret di mobile.
 */
const HERO_SLIDES = [
  {
    // 4 motor + 4 orang di distrik perkantoran -> keluasan jajaran
    id: "lineup",
    img: "/new-looks/HERO 1.webp",
    pos: "object-center",
    href: "#lineup",
    logo: false,
  },
  {
    // Charging pile ber-brand + pengguna membuka aplikasi -> jaringan SuperCharge
    id: "charge",
    img: "/new-looks/HERO 3.webp",
    pos: "object-[58%_center]",
    href: "/super-charge/lokasi/",
    logo: true,
  },
  {
    // Berboncengan di taman rimbun -> berkendara senyap & bersih
    id: "green",
    img: "/new-looks/test image.webp",
    pos: "object-[28%_center]",
    href: "/corporate/contact/",
    logo: false,
  },
] as const;

// CATATAN: gambar Unsplash di bawah = PLACEHOLDER sementara (lisensi bebas, host
// sudah di-allow di next.config). Ganti dengan aset final dari tim desain sesuai
// spesifikasi (rasio 4:5, subjek di 2/3 atas, 1/3 bawah bersih untuk overlay teks).
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=entropy&w=900&h=1125&q=80`;

const ADVANTAGE = [
  { img: UNSPLASH("1602918386084-58983c3bafac"), Icon: Zap, key: "charge" },
  {
    img: UNSPLASH("1592318348310-f31b61a931c8"),
    Icon: BatteryCharging,
    key: "battery",
  },
  { img: UNSPLASH("1579621970588-a35d0e7ab9b6"), Icon: Wallet, key: "cost" },
  {
    img: UNSPLASH("1771402382481-de35db6c4159"),
    Icon: Headphones,
    key: "service",
  },
];

const EXPLORE = [
  { Icon: Newspaper, key: "media", href: "/media-center/" },
  { Icon: GitCompareArrows, key: "compare", href: "/compare/" },
  { Icon: MapPin, key: "showroom", href: "/showroom/" },
  { Icon: Zap, key: "charge", href: "/super-charge/" },
];

const COPY: Record<Lang, Record<string, string>> = {
  id: {
    // ── Hero: 3 babak brand (kicker / judul / sub / CTA / running text) ──
    h_lineup_kicker: "Motor Listrik Wedison",
    h_lineup_title: "Motor listrik untuk cara kamu bergerak.",
    h_lineup_sub:
      "Dari harian di kota sampai kebutuhan armada, ada satu yang paling pas buat kamu.",
    h_lineup_cta: "Jelajahi Model",
    h_lineup_mq: "Athena|Bees|Victory|EdPower",

    h_charge_kicker: "Jaringan Pengisian",
    h_charge_title: "Isi daya cepat di jaringan",
    h_charge_titleFull: "Isi daya cepat di jaringan SuperCharge",
    h_charge_sub:
      "Cari stasiun terdekat lewat peta, mulai pengisian dari aplikasi, lalu lanjut jalan.",
    h_charge_cta: "Temukan Lokasi",
    h_charge_mq: "Cari stasiun di peta|Mulai dari aplikasi|Paket isi daya",

    h_green_kicker: "Nol Emisi",
    h_green_title: "Senyap di jalan. Bersih untuk kota.",
    h_green_sub:
      "Tanpa bensin, tanpa asap, dan perawatannya sedikit. Perjalanan harian jadi terasa lebih tenang.",
    h_green_cta: "Jadwalkan Test Ride",
    h_green_mq: "Nol emisi|Tanpa bensin|Perawatan minimal",

    familyLabel: "Jajaran Model",
    familyTitle: "Empat motor, satu standar.",
    familySub:
      "Beda karakter, beda kebutuhan, tapi semuanya dirakit dengan patokan yang sama.",
    learn: "Jelajahi",
    Commute: "Harian",
    Style: "Gaya",
    Performance: "Performa",
    Fleet: "Armada",
    superLabel: "Jaringan SuperCharge",
    superTitle: "Isi daya cepat, di kota tempat kamu berkendara.",
    superCta: "Lihat SuperCharge",
    advLabel: "Keunggulan Wedison",
    advTitle: "Enak dipakai harian, tenang dimiliki jangka panjang.",
    adv_charge_t: "Jaringan SuperCharge",
    adv_charge_d: "Isi daya 15 menit di titik yang terus bertambah.",
    adv_battery_t: "Garansi Baterai",
    adv_battery_d: "Baterai bergaransi 3 tahun, motornya 2 tahun.",
    adv_cost_t: "Biaya Harian Lebih Ringan",
    adv_cost_d: "Tanpa bensin, servisnya sedikit, ongkosnya jauh menurun.",
    adv_service_t: "Servis & Showroom",
    adv_service_d: "Bengkel resmi dan showroom yang terus bertambah.",
    exLabel: "Lanjut Jelajahi",
    exTitle: "Selangkah lebih dekat.",
    ex_media_t: "Berita Wedison",
    ex_media_d: "Cerita, peluncuran, dan liputan terbaru.",
    ex_compare_t: "Bandingkan Model",
    ex_compare_d: "Temukan motor yang paling cocok buat kamu.",
    ex_showroom_t: "Cari Showroom",
    ex_showroom_d: "Alamat, kontak, dan jam operasional.",
    ex_charge_t: "SuperCharge",
    ex_charge_d: "Pelajari cara kerja pengisian Wedison.",
    chatBadge: "Asisten AI • Dion",
    chatTitle: "Ada yang mau ditanyakan? Ngobrol dengan Dion.",
    chatSub:
      "Soal spesifikasi, harga, atau jadwal test ride, Dion siap menjawab kapan saja. Kalau perlu, kamu bisa langsung terhubung ke tim kami.",
    chatCta: "Mulai Ngobrol",
  },
  en: {
    // ── Hero: 3 brand beats (kicker / title / sub / CTA / running text) ──
    h_lineup_kicker: "Wedison Electric",
    h_lineup_title: "Electric motorcycles for the way you move.",
    h_lineup_sub:
      "From daily city commuting to fleet duty, there is a model built to suit you.",
    h_lineup_cta: "Explore the Lineup",
    h_lineup_mq: "Athena|Bees|Victory|EdPower",

    h_charge_kicker: "Charging Network",
    h_charge_title: "Fast charging, powered by",
    h_charge_titleFull: "Fast charging, powered by SuperCharge",
    h_charge_sub:
      "Locate the nearest station on the map, begin charging from the app, then continue your journey.",
    h_charge_cta: "Find a Station",
    h_charge_mq:
      "Find stations on the map|Start from the app|Charging packages",

    h_green_kicker: "Zero Emission",
    h_green_title: "Quiet on the road. Clean for the city.",
    h_green_sub:
      "No petrol, no fumes, and minimal servicing. Daily riding becomes considerably calmer.",
    h_green_cta: "Book a Test Ride",
    h_green_mq: "Zero emission|No petrol|Minimal maintenance",

    familyLabel: "The Lineup",
    familyTitle: "Four motorcycles, one standard.",
    familySub:
      "Distinct characters for different needs, all built to the same standard.",
    learn: "Explore",
    Commute: "Commute",
    Style: "Style",
    Performance: "Performance",
    Fleet: "Fleet",
    superLabel: "SuperCharge Network",
    superTitle: "Fast charging, in the cities where you ride.",
    superCta: "See SuperCharge",
    advLabel: "The Wedison Advantage",
    advTitle: "Effortless to ride daily, dependable to own for years.",
    adv_charge_t: "SuperCharge Network",
    adv_charge_d: "A 15-minute charge at a growing number of locations.",
    adv_battery_t: "Battery Warranty",
    adv_battery_d: "Three years on the battery, two on the motorcycle.",
    adv_cost_t: "Lower Running Costs",
    adv_cost_d:
      "No petrol, fewer service visits, and a substantially lower cost per kilometer.",
    adv_service_t: "Service & Showroom",
    adv_service_d:
      "Official workshops and a steadily expanding showroom network.",
    exLabel: "Keep Exploring",
    exTitle: "One step closer.",
    ex_media_t: "Wedison News",
    ex_media_d: "Stories, launches, and the latest coverage.",
    ex_compare_t: "Compare Models",
    ex_compare_d: "Find the motorcycle that fits you best.",
    ex_showroom_t: "Find a Showroom",
    ex_showroom_d: "Address, contact, and opening hours.",
    ex_charge_t: "SuperCharge",
    ex_charge_d: "Understand how Wedison charging works.",
    chatBadge: "AI Assistant • Dion",
    chatTitle: "Have a question? Speak with Dion.",
    chatSub:
      "Whether the question concerns specifications, pricing, or booking a test ride, Dion is available at any hour. Should you prefer to speak with someone, our team is reachable directly.",
    chatCta: "Start Chatting",
  },
};

export default function Landing() {
  const { t, language } = useLanguage();
  const c = COPY[(language as Lang) ?? "id"];

  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);
  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <>
      {/* ============ HERO (scroll-linked shrink + per-slide running text) ============ */}
      <section className="relative">
        <ShrinkHero>
          <Carousel
            setApi={setApi}
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 5500, stopOnInteraction: false })]}
          >
            <CarouselContent className="ml-0">
              {HERO_SLIDES.map((s, i) => {
                const ph = c[`h_${s.id}_mq`].split("|");
                return (
                  <CarouselItem key={s.id} className="pl-0">
                    <div className="relative h-[100svh] w-full overflow-hidden">
                      {/* Satu sumber gambar untuk semua breakpoint; `pos` menjaga subjek
                          tetap terlihat saat 16:9 di-crop jadi potret di mobile. */}
                      <Image
                        src={s.img}
                        alt=""
                        aria-hidden
                        fill
                        priority={i === 0}
                        sizes="100vw"
                        className={`object-cover ${s.pos}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/45" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center *:select-none">
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/80">
                          {c[`h_${s.id}_kicker`]}
                        </p>
                        {s.logo ? (
                          // Sebutan SuperCharge dibawakan oleh wordmark-nya sendiri, bukan teks.
                          <h1 className="mt-4 flex flex-col items-center">
                            <span className="sr-only">
                              {c.h_charge_titleFull}
                            </span>
                            <span
                              aria-hidden
                              className="max-w-[26ch] text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
                            >
                              {c.h_charge_title}
                            </span>
                            <Image
                              src="/super-charge/supercharge-typo-nobg.webp"
                              alt=""
                              aria-hidden
                              width={1920}
                              height={143}
                              priority={i === 0}
                              className="mt-4 h-auto w-[min(84vw,340px)] sm:mt-5 sm:w-[500px] lg:w-[640px]"
                            />
                          </h1>
                        ) : (
                          <h1 className="mt-4 max-w-[18ch] text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                            {c[`h_${s.id}_title`]}
                          </h1>
                        )}
                        <p className="mt-5 max-w-[46ch] text-base text-white/85 sm:text-lg">
                          {c[`h_${s.id}_sub`]}
                        </p>
                        <div className="mt-8">
                          <Link href={s.href}>
                            <Button size="lg">{c[`h_${s.id}_cta`]}</Button>
                          </Link>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-black/45">
                        <Marquee
                          repeat={6}
                          className="[--duration:34s] [--gap:0rem] py-3 select-none"
                        >
                          {ph.map((p, idx) => (
                            <span
                              key={idx}
                              className="flex items-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/85"
                            >
                              {p}
                              <span className="mx-6 text-on-forest-accent">
                                /
                              </span>
                            </span>
                          ))}
                        </Marquee>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => api?.scrollTo(i)}
                  aria-label={c[`h_${s.id}_kicker`]}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    selected === i
                      ? "w-7 bg-white"
                      : "w-2 bg-white/45 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </Carousel>
        </ShrinkHero>
      </section>

      {/* Sticky quick-action bar dihapus: keempat tautannya (Test Ride, Bandingkan,
          SuperCharge, Showroom) kini semuanya sudah ada di navbar. */}

      {/* ============ ELECTRIC FAMILY (immersive cards) ============ */}
      <section
        id="lineup"
        className="main-container scroll-mt-24 py-16 sm:py-24"
      >
        <Reveal className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {c.familyLabel}
          </p>
          <h2 className="mx-auto mt-3 max-w-[20ch] text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {c.familyTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-[44ch] text-muted-foreground">
            {c.familySub}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {MODELS.map((m) => (
            <Link
              key={m.id}
              href={`/${m.id}/`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[16/10]"
            >
              {/* Card image reveals on its own viewport entry (opacity) */}
              <Reveal className="absolute inset-0" y={0}>
                <Image
                  src={m.productImage}
                  alt={NAMES[m.id]}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              </Reveal>
              {/* Text overlay reveals separately, when it enters view (rise + fade) */}
              <Reveal
                className="absolute inset-x-0 bottom-0 p-6 sm:p-8"
                y={28}
                amount={0.4}
              >
                <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-sm">
                  {c[m.line]}
                </span>
                <h3 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {NAMES[m.id]}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  {c.learn}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Reveal>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ SUPERCHARGE SPOTLIGHT (forest) ============ */}
      <section className="main-container pb-16 sm:pb-24">
        <Reveal>
          <div className="relative min-h-[460px] overflow-hidden rounded-3xl bg-forest sm:min-h-[540px]">
            <Image
              src="/new-looks/SUPERCHARGE CARD-LP.webp"
              alt="SuperCharge"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-[40%_100%]"
            />
            {/* Brand tint + right-side darkening so the text stays legible (subject is on the left) */}
            {/* <div className="absolute inset-0 bg-forest/45" /> */}
            {/* <div className="absolute inset-0 bg-gradient-to-l from-forest via-forest/70 to-transparent" /> */}
            <div className="relative flex h-full min-h-[460px] items-center justify-end px-6 py-16 sm:min-h-[540px] sm:px-14 sm:py-24">
              <div className="max-w-lg">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-on-forest-accent">
                  {c.superLabel}
                </p>
                <h2 className="mt-4 max-w-[18ch] text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  {c.superTitle}
                </h2>
                <p className="mt-4 max-w-[48ch] text-white/80">
                  {t("supercharge.landing.description")}
                </p>
                <div className="mt-8">
                  <Link href="/super-charge/">
                    <Button
                      size="lg"
                      className="bg-forest-foreground text-forest hover:bg-white"
                    >
                      {c.superCta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ APP DOWNLOAD ============ */}
      <AppDownloadTeaser />

      {/* ============ ADVANTAGE (image-overlay cards) ============ */}
      <section className="bg-muted py-16 sm:py-24">
        <div className="main-container">
          <Reveal>
            <span className="inline-block rounded-full bg-secondary px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-primary">
              {c.advLabel}
            </span>
            <h2 className="mt-4 max-w-[22ch] text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              {c.advTitle}
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGE.map(({ img, Icon, key }) => (
              <div
                key={key}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
              >
                <Reveal className="absolute inset-0" y={0}>
                  <Image
                    src={img}
                    alt={c[`adv_${key}_t`]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                </Reveal>
                <Reveal
                  className="absolute inset-x-0 bottom-0 p-5"
                  y={24}
                  amount={0.4}
                >
                  <Icon className="h-6 w-6 text-on-forest-accent" />
                  <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-white">
                    {c[`adv_${key}_t`]}
                  </h3>
                  <p className="mt-1.5 text-sm text-white/80">
                    {c[`adv_${key}_d`]}
                  </p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ KEEP EXPLORING (icon cards) ============ */}
      {/* <section className="main-container py-16 sm:py-24">
        <Reveal className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {c.exLabel}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {c.exTitle}
          </h2>
        </Reveal>
        <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EXPLORE.map(({ Icon, key, href }) => (
            <StaggerItem key={key} className="h-full">
              <Link
                href={href}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">
                  {c[`ex_${key}_t`]}
                </h3>
                <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                  {c[`ex_${key}_d`]}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {c.learn}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section> */}

      {/* ============ TALK TO DION (chat CTA) — section terakhir ============ */}
      <section className="relative w-full overflow-hidden">
        {/* GANTI src dengan aset CTA final dari desainer (spesifikasi ada di catatan).
            Sementara pakai foto showroom sebagai placeholder. */}
        <Image
          src="/new-looks/Banner Footer.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[95%_100%]"
        />
        {/* Scrim: jaga kontras teks putih di atas gambar apa pun (WCAG AA). */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="relative main-container flex flex-col items-center py-14 text-center sm:py-16 md:py-20">
          <Reveal className="flex w-full flex-col items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-white/90 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-on-forest-accent" />
              {c.chatBadge}
            </span>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {c.chatTitle}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              {c.chatSub}
            </p>
            <Link
              href={`https://wa.me/6282124657804?text=${encodeURIComponent(
                language === "id"
                  ? "Halo Dion, saya ingin tahu lebih lanjut tentang motor listrik Wedison."
                  : "Hi Dion, I'd like to know more about Wedison electric motorcycles.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-on-forest-accent px-7 py-3.5 text-base font-semibold text-forest-deep shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
            >
              {c.chatCta}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
