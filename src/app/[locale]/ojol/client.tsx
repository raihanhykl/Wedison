/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { HeroSlide, HeroSlideProps } from "@/components/hero";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

// Campaign meta (translatable strings live in language-context.tsx)
const campaignMeta = [
  {
    id: "milik",
    image: "/ojol/sewa-milik-banner.webp",
    waLink:
      "https://wa.me/6282124657804?text=Halo%20Wedison,%20saya%20tertarik%20dengan%20program%20Sewa%20Milik",
    benefitsCount: 6,
    termsCount: 7,
    schemeCount: 4,
  },
  {
    id: "harian",
    image: "/ojol/sewa-harian-banner.webp",
    waLink:
      "https://wa.me/6282124657804?text=Halo%20Wedison,%20saya%20tertarik%20dengan%20program%20Sewa%20Harian",
    benefitsCount: 7,
    termsCount: 8,
    schemeCount: 4,
  },
];

export default function OjolClient() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState<string | null>(null);
  const carouselApi = React.useRef<any>(null);
  const { t } = useLanguage();

  const activeCampaign = campaignMeta.find((c) => c.id === openDialog);
  const items: {
    image: string;
    imageMobile: string;
    imageAlt: string;
    cardMobile: string;
    title?: string;
    titleHighlight?: string;
    description?: string;
    link: string;
    children?: React.ReactNode;
    position?: HeroSlideProps["position"];
    textAlign?: HeroSlideProps["textAlign"];
    contentWidth?: HeroSlideProps["contentWidth"];
    backgroundStyle?: HeroSlideProps["backgroundStyle"];
    overlayOpacity?: HeroSlideProps["overlayOpacity"];
    variant?: HeroSlideProps["variant"];
    height?: HeroSlideProps["height"];
    overlay?: HeroSlideProps["overlay"];
    theme?: HeroSlideProps["theme"];
    className?: string;
    responsivePosition?: HeroSlideProps["responsivePosition"];
    responsiveTextAlign?: HeroSlideProps["responsiveTextAlign"];
  }[] = [
    {
      image: "/ojol/wedison-bersama-ojol-desktop.webp",
      imageAlt: "Wedison Bersama Ojol",
      imageMobile: "/ojol/wedison-bersama-ojol-mobile.webp",
      cardMobile: "/edpower/edpower-landing-card-mobile.webp",
      title: t("ojol.hero.title"),
      titleHighlight: t("ojol.hero.titleHighlight"),
      description: t("ojol.hero.description"),
      link: "/ojol/",
      position: "top-center",
      contentWidth: "wider",
      backgroundStyle: "object-cover md:object-[50%_50%] object-center",
      textAlign: "center",
      height: "screen",
      overlay: "none",
      theme: "dark",
      className:
        "w-full max-w-[calc(100%-1.5rem)] lg:max-w-none lg:w-[781px] lg:h-[147px] md:w-full pt-8 md:pt-26 xl:pt-14 ",
    },
    {
      image: "/ojol/wedison-hero-sewa-harian.webp",
      imageAlt: "Sewa Harian Wedison Ojol",
      imageMobile: "/ojol/wedison-hero-sewa-harian-mobile.webp",
      cardMobile: "/athena/athena-landing-card-mobile.webp",
      link: "/ojol/",
      contentWidth: "full",
      textAlign: "center",
      height: "screen",
      position: "center",
      overlay: "none",
      theme: "dark",
      className: "w-full pt-0",
      responsivePosition: {
        mobile: "top-center",
        tablet: "center",
        desktop: "center",
      },
      children: (
        <div className="flex w-full h-full justify-center md:justify-end">
          {/* Tablet & Desktop: offset text to center of blur box */}
          <div className="hidden md:flex md:w-[35%] lg:w-[40%]"></div>

          {/* Text content */}
          <div className="w-full md:flex-1 flex flex-col items-center gap-0.5 sm:gap-1 md:gap-3 lg:gap-4 md:pr-8 lg:pr-12">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white text-shadow-[0px_1px_2px_rgb(0_0_0/_0.3)]">
              {t("ojol.hero.startFrom")}
            </p>
            <div className="flex items-baseline justify-center w-full">
              <span className="font-display text-[clamp(3.5rem,14vw,7rem)]/[0.85] font-extrabold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                50K
              </span>
              <span className="text-base sm:text-lg md:text-2xl lg:text-3xl font-[900] text-white ml-0.5 md:ml-1">
                {t("ojol.hero.perDay")}
              </span>
            </div>
            <p className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white text-shadow-[0px_2px_4px_rgb(0_0_0/_0.3)] mt-0.5 md:mt-2 lg:mt-4">
              {t("ojol.hero.dailyRental")}
            </p>
            <p className="text-sm sm:text-base md:text-xl lg:text-3xl font-semibold text-white/90 text-shadow-[0px_1px_2px_rgb(0_0_0/_0.3)]">
              {t("ojol.hero.tagline")}
            </p>
            <a
              href="#campaign"
              className="mt-1.5 sm:mt-2 md:mt-4 lg:mt-6 cursor-pointer"
            >
              <Button
                className="px-8 sm:px-10 md:px-12 lg:px-14 font-semibold tracking-wider cursor-pointer text-sm sm:text-base md:text-xl lg:text-2xl py-2 sm:py-2.5 md:py-4 lg:py-6 rounded-lg md:rounded-xl lg:rounded-2xl shadow-[inset_0_2px_2px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.12)]
                  border-[1px] border-black/10
                  transition-all duration-200
                  hover:shadow-[inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_6px_rgba(0,0,0,0.18),0_8px_16px_rgba(0,0,0,0.16)]
                  active:translate-y-[1px]
                  active:shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)]
                "
              >
                {t("ojol.hero.tryFree")}
              </Button>
            </a>
          </div>
        </div>
      ),
    },
  ];

  const models = [
    {
      name: "Bees",
      taglineKey: "ojol.models.bees.tagline",
      highlightKey: "ojol.models.bees.highlight",
      image: "/bees/bees-grey.webp",
      link: "/bees",
      specs: [
        { labelKey: "ojol.models.spec.range", value: "80 km" },
        { labelKey: "ojol.models.spec.maxSpeed", value: "55 km/h" },
        { labelKey: "ojol.models.spec.battery", value: "1600Wh" },
      ],
    },
    {
      name: "Victory",
      taglineKey: "ojol.models.victory.tagline",
      highlightKey: "ojol.models.victory.highlight",
      image: "/victory/victory-grey.webp",
      link: "/victory",
      specs: [
        { labelKey: "ojol.models.spec.range", value: "120 km*" },
        {
          labelKey: "ojol.models.spec.supercharge",
          valueKey: "ojol.models.value.minutes",
        },
        { labelKey: "ojol.models.spec.motor", value: "3kW" },
      ],
    },
    {
      name: "Athena",
      taglineKey: "ojol.models.athena.tagline",
      highlightKey: "ojol.models.athena.highlight",
      image: "/athena/athena-grey.webp",
      link: "/athena",
      specs: [
        { labelKey: "ojol.models.spec.range", value: "120 km*" },
        {
          labelKey: "ojol.models.spec.supercharge",
          valueKey: "ojol.models.value.minutes",
        },
        { labelKey: "ojol.models.spec.motor", value: "2.5kW" },
      ],
    },
    {
      name: "EdPower",
      taglineKey: "ojol.models.edpower.tagline",
      highlightKey: "ojol.models.edpower.highlight",
      image: "/edpower/edpower-black.webp",
      link: "/edpower",
      specs: [
        { labelKey: "ojol.models.spec.range", value: "160 km*" },
        {
          labelKey: "ojol.models.spec.supercharge",
          valueKey: "ojol.models.value.minutes",
        },
        { labelKey: "ojol.models.spec.motor", value: "3kW" },
      ],
    },
  ];

  return (
    <div className="w-full h-full">
      {/* Hero */}
      <div className="relative">
        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnFocusIn: false,
            }),
          ]}
          setApi={(api: CarouselApi) => {
            carouselApi.current = api;
            api?.on("select", () => setSelectedIndex(api.selectedScrollSnap()));
          }}
        >
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index} className="w-full">
                <HeroSlide
                  position={item.position}
                  contentWidth={item.contentWidth}
                  backgroundStyle={item.backgroundStyle}
                  textAlign={item.textAlign}
                  backgroundImage={item.image}
                  backgroundImageMobile={item.imageMobile}
                  title={item.title}
                  titleHighlight={item.titleHighlight}
                  description={item.description}
                  height={item.height}
                  variant={item.variant}
                  overlay={item.overlay}
                  theme={item.theme}
                  contentClassName={item.className}
                  responsivePosition={{ ...item.responsivePosition }}
                >
                  {item.children}
                </HeroSlide>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute top-1/2 left-2 sm:left-4 md:left-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-black/30 text-white hover:text-white hover:bg-black/50" />
          <CarouselNext className="hidden md:flex absolute top-1/2 right-2 sm:right-4 md:right-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-black/30 text-white hover:text-white hover:bg-black/50" />
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 sm:gap-3">
            {items.map((_, index) => (
              <button
                key={index}
                className={`h-2.5 sm:h-3 rounded-full cursor-pointer overflow-hidden transition-all duration-300 ${
                  selectedIndex === index
                    ? "w-10 sm:w-12 bg-white"
                    : "w-2.5 sm:w-3 bg-white/45 hover:bg-white/70"
                }`}
                onClick={() => carouselApi.current?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                {selectedIndex === index && (
                  <div
                    key={selectedIndex}
                    className="h-full bg-white rounded-full animate-[progress_4000ms_linear_forwards]"
                    style={{
                      animation: "progress 4000ms linear forwards",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </Carousel>
      </div>

      {/* Content */}
      <div className="main-container py-8 md:my-16">
        {/* benefits */}
        <div className="w-full">
          <Reveal className="text-center">
            <h2 className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground md:mb-8 md:text-6xl">
              {t("ojol.benefits.title")}
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground text-md md:mb-0 md:text-xl">
              {t("ojol.benefits.description")}
            </p>
          </Reveal>
          <Stagger className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
            {[1, 2, 3].map((num) => (
              <StaggerItem
                key={num}
                className="mx-auto aspect-square w-full overflow-hidden rounded-lg"
              >
                <Image
                  className="aspect-square h-full w-full rounded-lg object-cover"
                  src={`/ojol/benefit-${num}.webp`}
                  width={1000}
                  height={1000}
                  alt=""
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* hot campaign */}
        <div className="w-full" id="campaign">
          <Reveal>
            <h2 className="my-8 text-center font-display text-4xl font-bold tracking-tight text-foreground md:my-16 md:text-6xl">
              {t("ojol.campaign.heading")}
            </h2>
          </Reveal>
          <Stagger className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
            {campaignMeta.map((campaign) => (
              <StaggerItem
                key={campaign.id}
                className="group overflow-hidden rounded-2xl bg-card shadow-lg transition-all duration-500 hover:shadow-2xl"
              >
                {/* Banner Image */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={campaign.image}
                    width={1000}
                    height={600}
                    alt={t(`ojol.campaign.${campaign.id}.title`)}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                      {t(`ojol.campaign.${campaign.id}.title`)}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Tagline */}
                  <p className="mb-2 text-lg font-semibold text-primary">
                    {t(`ojol.campaign.${campaign.id}.tagline`)}
                  </p>

                  {/* Description */}
                  <p className="mb-6 text-muted-foreground">
                    {t(`ojol.campaign.${campaign.id}.description`)}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Daftar Button */}
                    <Link
                      href={campaign.waLink}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          {t("ojol.btn.register")}
                        </span>
                      </Button>
                    </Link>

                    {/* Lihat Detail Button */}
                    <Button
                      variant="outline"
                      onClick={() => setOpenDialog(campaign.id)}
                      className="flex-1 border-border hover:border-primary hover:bg-muted font-semibold py-5 rounded-xl transition-all duration-300"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {t("ojol.btn.detail")}
                      </span>
                    </Button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      {/* Campaign Detail Dialog */}
      {openDialog && activeCampaign && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpenDialog(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

          {/* Dialog Content */}
          <div
            className="relative bg-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-primary text-primary-foreground p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                    {t("ojol.dialog.programBadge")}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {t(`ojol.campaign.${activeCampaign.id}.title`)}
                  </h3>
                  <p className="text-white/80 mt-1">
                    {t(`ojol.campaign.${activeCampaign.id}.tagline`)}
                  </p>
                </div>
                <button
                  onClick={() => setOpenDialog(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
              {/* Scheme Section */}
              <div>
                <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  {t("ojol.dialog.scheme")}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: activeCampaign.schemeCount }).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        className="bg-muted rounded-xl p-4 border border-border"
                      >
                        <p className="text-muted-foreground text-sm">
                          {t(
                            `ojol.campaign.${activeCampaign.id}.scheme.${idx}.label`,
                          )}
                        </p>
                        <p className="text-foreground font-bold text-lg">
                          {t(
                            `ojol.campaign.${activeCampaign.id}.scheme.${idx}.value`,
                          )}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Benefits Section */}
              <div>
                <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  {t("ojol.dialog.benefits")}
                </h4>
                <ul className="space-y-2">
                  {Array.from({ length: activeCampaign.benefitsCount }).map(
                    (_, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-foreground">
                          {t(
                            `ojol.campaign.${activeCampaign.id}.benefit.${idx}`,
                          )}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>

              {/* Terms Section */}
              <div>
                <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  {t("ojol.dialog.terms")}
                </h4>
                <ul className="space-y-2">
                  {Array.from({ length: activeCampaign.termsCount }).map(
                    (_, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-primary mt-0.5 flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-foreground">
                          {t(`ojol.campaign.${activeCampaign.id}.term.${idx}`)}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="sticky bottom-0 bg-card border-t border-border p-4">
              <Link
                href={activeCampaign.waLink}
                target="_blank" rel="noopener noreferrer"
                onClick={() => setOpenDialog(null)}
              >
                <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {t("ojol.dialog.registerNow")}
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Supercharge Section */}
      <div className="w-full bg-card py-8 md:py-16 overflow-hidden border-y border-border">
        <div className="main-container">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Image Section */}
            <Reveal className="w-full lg:w-1/2 relative group" y={0}>
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden">
                {/* Image Container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/super-charge/supercharge-ojol.webp"
                    alt="Wedison Supercharge"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </Reveal>

            {/* Content Section */}
            <Reveal className="w-full lg:w-1/2 text-center lg:text-left" y={28} amount={0.3}>
              {/* Badge */}
              <div className="inline-block mb-4">
                <span className="bg-secondary text-primary px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
                  {t("ojol.supercharge.badge")}
                </span>
              </div>

              {/* Title Image */}
              <div className="mb-6">
                <Image
                  src="/super-charge/supercharge-typo-nobg.png"
                  alt="Supercharge"
                  width={400}
                  height={100}
                  className="h-16 md:h-20 lg:h-24 w-auto mx-auto lg:mx-0"
                />
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-md md:text-xl mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t("ojol.supercharge.descriptionPart1")}
                <span className="font-bold text-foreground">
                  {t("ojol.supercharge.descriptionBold")}
                </span>
                {t("ojol.supercharge.descriptionPart2")}
              </p>

              {/* Disclaimer */}
              <p className="text-muted-foreground text-xs mb-6 max-w-xl mx-auto lg:mx-0">
                {t("ojol.supercharge.disclaimer")}
              </p>

              {/* CTA Button */}
              <Link href="/super-charge">
                <Button
                  className="group relative px-8 py-6 text-lg font-semibold rounded-xl
                    bg-primary hover:bg-primary-hover text-primary-foreground
                    shadow-lg hover:shadow-xl
                    transition-all duration-300
                    hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    {t("ojol.supercharge.cta")}
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Button>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Model Section */}
      <div className="w-full bg-muted py-16 md:py-24">
        <div className="main-container">
          {/* Header */}
          <Reveal className="text-center mb-12 md:mb-16">
            <h2 className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t("ojol.models.title")}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
              {t("ojol.models.subtitle")}
            </p>
          </Reveal>

          {/* Model Grid */}
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {models.map((model) => (
              <StaggerItem
                key={model.name}
                className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={model.image}
                    alt={model.name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Highlight Badge */}
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {t(model.highlightKey)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Name & Tagline */}
                  <div className="mb-4">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
                      {model.name}
                    </h3>
                    <p className="text-primary font-medium">
                      {t(model.taglineKey)}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="space-y-2 mb-6">
                    {model.specs.map((spec, specIndex) => (
                      <div
                        key={specIndex}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-muted-foreground">
                          {t(spec.labelKey)}
                        </span>
                        <span className="font-semibold text-foreground">
                          {"valueKey" in spec && spec.valueKey
                            ? t(spec.valueKey)
                            : spec.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link href={model.link}>
                    <Button
                      variant="outline"
                      className="w-full group/btn border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {t("ojol.models.cta")}
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </Button>
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Footnote */}
          <p className="text-center text-muted-foreground text-sm mt-8">
            {t("ojol.models.footnote")}
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-forest-deep py-16 md:py-24 relative overflow-hidden">
        <div className="main-container relative z-10">
          <Reveal className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="bg-white/10 text-on-forest-accent px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
                {t("ojol.cta.badge")}
              </span>
            </div>

            {/* Headline */}
            <h2 className="mb-6 font-display text-3xl font-bold leading-tight tracking-tight text-forest-foreground md:text-5xl lg:text-6xl">
              {t("ojol.cta.headline.1")}
              <br />
              <span className="text-on-forest-accent">{t("ojol.cta.headline.2")}</span>
            </h2>

            {/* Description */}
            <p className="text-forest-muted text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("ojol.cta.description")}
            </p>

            {/* Benefits List */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                t("ojol.cta.benefit.1"),
                t("ojol.cta.benefit.2"),
                t("ojol.cta.benefit.3"),
                t("ojol.cta.benefit.4"),
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2"
                >
                  <svg
                    className="w-5 h-5 text-on-forest-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-forest-foreground text-sm font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href="https://wa.me/6282124657804?text=Halo%20Wedison,%20saya%20tertarik%20dengan%20program%20untuk%20driver%20ojol"
              target="_blank" rel="noopener noreferrer"
            >
              <Button
                className="group relative px-10 py-7 text-lg md:text-xl font-bold rounded-2xl
                  bg-forest-foreground text-forest hover:bg-white
                  shadow-lg
                  transition-all duration-300
                  hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("ojol.cta.button")}
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Button>
            </Link>

            {/* Trust Text */}
            <p className="text-forest-muted text-sm mt-6">{t("ojol.cta.trust")}</p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
