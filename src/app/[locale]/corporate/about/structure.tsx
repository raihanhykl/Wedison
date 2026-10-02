"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { ArtDirectedImage } from "@/components/art-directed-image";
import { cn } from "@/lib/utils";

/**
 * Foto halaman About. SEMUANYA SEMENTARA (foto yang ada di repo) — ganti dengan aset final
 * sesuai brief tim GD (ID aset di komentar).
 */
const IMG = {
  hero: "/wedison-factory.webp", // ASET-A01 hero kantor/gedung (16:9 + 9:16)
  intro: "/ShowRoom-Receptionist.webp", // ASET-A02 tim di kantor (4:5)
  values: "/super-charge/supercharge-ojol.webp", // ASET-A03 orang & produk (4:5)
  officeMain: "/wedison-factory.webp", // ASET-A05a fasad kantor pusat (3:2)
  officeA: "/ShowRoom-Receptionist.webp", // ASET-A05b ruang kerja (1:1)
  officeB: "/showroom-waitingroom.webp", // ASET-A05c area tamu (1:1)
};

/** Werigo: layanan sewa motor listrik Wedison di Bali (situs terpisah). */
const WERIGO = "https://werigo.co";

export default function AboutPage() {
  const { t, language } = useLanguage();
  const href = (path: string) => `/${language}${path}`;

  const ecosystem = [
    {
      key: "motorcycles",
      title: t("about.offers.motorcycles.title"),
      desc: t("about.offers.motorcycles.description"),
      cta: t("aboutPage.eco.motorcycles.cta"),
      href: href("/products/"),
      image: "/new-looks/01-HERO CARD-LP.webp", // ASET-A04a
      external: false,
    },
    {
      key: "charging",
      title: t("about.offers.charging.title"),
      desc: t("about.offers.charging.description"),
      cta: t("aboutPage.eco.charging.cta"),
      href: href("/super-charge/"),
      image: "/super-charge/supercharge-hero-1.webp", // ASET-A04b
      external: false,
    },
    {
      key: "app",
      title: t("aboutPage.eco.app.title"),
      desc: t("supercharge.app.hero.description"),
      cta: t("aboutPage.eco.app.cta"),
      href: href("/super-charge/#app"),
      image: "/new-looks/HERO 3.webp", // ASET-A04c
      external: false,
    },
    {
      key: "werigo",
      title: "Werigo",
      desc: t("aboutPage.eco.werigo.desc"),
      cta: t("aboutPage.eco.werigo.cta"),
      href: WERIGO,
      image: "/new-looks/test image.webp", // ASET-A04d
      external: true,
    },
  ];

  const values = ["innovation", "partnerships", "experience"] as const;

  return (
    // Bukan <main>: landmark <main> tunggal disediakan layout locale (#konten).
    <div className="bg-background">
      {/* ============ HERO ============ */}
      <section className="relative h-[88svh] min-h-[540px] w-full overflow-hidden bg-forest-deep">
        <ArtDirectedImage
          desktop={IMG.hero}
          mobile={IMG.hero}
          alt={t("aboutPage.hero.imageAlt")}
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end pb-16 sm:pb-20">
          <div className="main-container">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-on-forest-accent">
              {t("about.tag")}
            </p>
            <h1 className="mt-4 max-w-[18ch] text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t("aboutPage.hero.title")}
            </h1>
            <p className="mt-5 max-w-[52ch] text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
              {t("about.overview.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* ============ INTRO (pernyataan besar + foto) ============ */}
      <section className="py-16 sm:py-28">
        <div className="main-container grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <Reveal>
            <p className="text-pretty font-display text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-4xl sm:leading-tight">
              {t("about.overview.p1")}
            </p>
          </Reveal>
          <Reveal y={0} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
            <Image
              src={IMG.intro}
              alt={t("aboutPage.intro.imageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 35vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* ============ MISI (forest, tipografi besar) ============ */}
      <section className="bg-forest py-16 text-forest-foreground sm:py-24">
        <div className="main-container">
          <Reveal>
            <h2 className="font-display text-lg font-semibold text-on-forest-accent">
              {t("about.mission.title")}
            </h2>
          </Reveal>
          <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
            {["about.mission.p1", "about.mission.p2"].map((k, i) => (
              <Reveal key={k} delay={i * 0.08}>
                <p className="max-w-[28ch] py-8 text-balance font-display text-3xl font-bold leading-tight tracking-tight text-white sm:py-10 sm:text-5xl">
                  {t(k)}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <p className="max-w-[60ch] text-pretty leading-relaxed text-forest-foreground/85 sm:text-lg">
              {t("about.projects.future.description")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ NILAI (baris editorial + satu foto) ============ */}
      <section className="py-16 sm:py-24">
        <div className="main-container grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal y={0} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted lg:sticky lg:top-28 lg:aspect-[4/5] lg:self-start">
            <Image
              src={IMG.values}
              alt={t("aboutPage.values.imageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </Reveal>
          <div>
            <Reveal>
              <h2 className="max-w-[16ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t("about.values.title")}
              </h2>
            </Reveal>
            <dl className="mt-10 border-t border-border">
              {values.map((v) => (
                <Reveal key={v} className="border-b border-border py-8">
                  <dt className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {t(`about.values.${v}.title`)}
                  </dt>
                  <dd className="mt-3 max-w-[52ch] text-pretty leading-relaxed text-muted-foreground sm:text-lg">
                    {t(`about.values.${v}.description`)}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ============ EKOSISTEM (tile bergambar, bento) ============ */}
      <section className="bg-muted py-16 sm:py-24">
        <div className="main-container">
          <Reveal className="max-w-2xl">
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("aboutPage.eco.title")}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("aboutPage.eco.desc")}
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
            {ecosystem.map((e, i) => {
              // Bento 6 kolom: 4+2 lalu 2+4, supaya ukuran tile tidak seragam.
              const span = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4"][i];
              const Comp = e.external ? "a" : Link;
              return (
                <Reveal key={e.key} y={20} delay={i * 0.05} className={span}>
                  <Comp
                    href={e.href}
                    {...(e.external ? { target: "_blank", rel: "noopener" } : {})}
                    className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl bg-forest-deep p-6 sm:aspect-[16/11] md:aspect-auto md:h-[420px] sm:p-8"
                  >
                    <Image
                      src={e.image}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="relative">
                      <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        {e.title}
                      </h3>
                      <p className="mt-2 max-w-[44ch] text-pretty text-sm leading-relaxed text-white/85 sm:text-base">
                        {e.desc}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-on-forest-accent">
                        {e.cta}
                        {e.external ? (
                          <ArrowUpRight className="h-4 w-4" aria-hidden />
                        ) : (
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                        )}
                      </span>
                    </div>
                  </Comp>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TEMPAT KAMI BEKERJA + BERGABUNG ============ */}
      <section className="py-16 sm:py-24">
        <div className="main-container">
          <div className="grid grid-cols-1 gap-4 sm:h-[460px] sm:grid-cols-3 sm:grid-rows-2 sm:gap-5 lg:h-[560px]">
            <Reveal y={0} className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-muted sm:col-span-2 sm:row-span-2 sm:aspect-auto">
              <Image src={IMG.officeMain} alt={t("aboutPage.place.imageMain")} fill sizes="(max-width: 640px) 100vw, 66vw" className="object-cover" />
            </Reveal>
            <Reveal y={0} delay={0.05} className="relative hidden overflow-hidden rounded-2xl bg-muted sm:block">
              <Image src={IMG.officeA} alt={t("aboutPage.place.imageA")} fill sizes="33vw" className="object-cover" />
            </Reveal>
            <Reveal y={0} delay={0.1} className="relative hidden overflow-hidden rounded-2xl bg-muted sm:block">
              <Image src={IMG.officeB} alt={t("aboutPage.place.imageB")} fill sizes="33vw" className="object-cover" />
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("aboutPage.place.title")}
              </h2>
              <p className="mt-4 max-w-[48ch] text-pretty leading-relaxed text-muted-foreground sm:text-lg">
                {t("aboutPage.place.desc")}
              </p>
              <Link
                href={href("/showroom/")}
                className="mt-5 inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
              >
                {t("aboutPage.place.cta")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
            <Reveal delay={0.08} className={cn("rounded-2xl bg-forest p-8 text-forest-foreground sm:p-10")}>
              <h2 className="text-balance font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {t("about.joinUs")}
              </h2>
              <p className="mt-3 max-w-[48ch] text-pretty leading-relaxed text-forest-foreground/85">
                {t("about.joinUsDescription")}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-on-forest-accent text-forest-deep hover:bg-white">
                  <Link href={href("/career/")}>{t("aboutPage.join.career")}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                >
                  <Link href={href("/corporate/contact/")}>{t("about.contactUs")}</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
