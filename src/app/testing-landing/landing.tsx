/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HeartPulse, Leaf, Wind } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useLanguage } from "../lib/language-context";
import Link from "next/link";
import Preloader from "../components/Preloader";
import dynamic from "next/dynamic";
import Autoplay from "embla-carousel-autoplay";

// Lazy load ComparisonTable untuk mengurangi initial bundle size
const ComparisonTable = dynamic(
  () => import("../components/comparison-table"),
  {
    loading: () => (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 rounded-lg w-full h-full" />
      </div>
    ),
    ssr: true,
  },
);

export default function Landing() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const carouselApi = React.useRef<any>(null);
  const [selectedProductIndex, setSelectedProductIndex] = React.useState(0);
  const carouselProductApi = React.useRef<any>(null);
  const { t } = useLanguage();
  const items: {
    image: string;
    imageMobile: string;
    imageAlt: string;
    cardMobile: string;
    title: string;
    description: string;
    link: string;
    brochure: string;
  }[] = [
    {
      image: "/edpower/edpower-landing-hero.webp",
      imageAlt: "EDPower in Gray",
      imageMobile: "/edpower/edpower-landing-hero-mobile.webp",
      cardMobile: "/edpower/edpower-landing-card-mobile.webp",
      title: t("edpower.productPage.hero.title"),
      description: t("edpower.productPage.hero.description"),
      link: "/edpower/",
      brochure: "/brochure/brochure-edpower.pdf",
    },
    {
      image: "/athena/athena-landing-hero.webp",
      imageAlt: "Athena in Gray",
      imageMobile: "/athena/athena-landing-hero-mobile.webp",
      cardMobile: "/athena/athena-landing-card-mobile.webp",
      title: t("athena.productPage.hero.title"),
      description: t("athena.productPage.hero.description"),
      link: "/athena/",
      brochure: "/brochure/brochure-athena.pdf",
    },
    {
      image: "/bees/bees-landing-hero.webp",
      imageAlt: "Bees in Gray",
      imageMobile: "/bees/bees-landing-hero-mobile.webp",
      cardMobile: "/bees/bees-landing-card-mobile.webp",

      title: t("bees.productPage.hero.title"),
      description: t("bees.productPage.hero.description"),
      link: "/bees/",
      brochure: "/brochure/brochure-bees.pdf",
    },
    {
      image: "/victory/victory-landing-hero.webp",
      imageAlt: "Victory in Gray",
      imageMobile: "/victory/victory-landing-hero-mobile.webp",
      cardMobile: "/victory/victory-landing-card-mobile.webp",
      title: t("victory.productPage.hero.title"),
      description: t("victory.productPage.hero.description"),
      link: "/victory/",
      brochure: "/brochure/brochure-victory.pdf",
    },
  ];
  const features: any = [
    {
      icon: <Leaf className="h-14 w-14 text-[var(--primary)]" />,
      title: t("features.zeroEmissions"),
      description: t("features.zeroEmissionsDesc"),
      link: t("features.zeroEmissionsLink"),
    },
    {
      icon: <HeartPulse className="h-14 w-14 text-[var(--primary)]" />,
      title: t("features.healthBenefits"),
      description: t("features.healthBenefitsDesc"),
      link: t("features.healthBenefitsLink"),
    },
    {
      icon: <Wind className="h-14 w-14 text-[var(--primary)]" />,
      title: t("features.noiseFree"),
      description: t("features.noiseFreeDesc"),
      link: t("features.noiseFreeLink"),
    },
  ];

  return (
    <>
      <Preloader />

      <div>
        {/* Hero */}
        <div className="relative">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnFocusIn: true,
              }),
            ]}
            setApi={(api: CarouselApi) => {
              carouselApi.current = api;
              api?.on("select", () =>
                setSelectedIndex(api.selectedScrollSnap()),
              );
            }}
          >
            <CarouselContent>
              {items.map((item, index) => (
                <CarouselItem key={index} className="w-full">
                  <div className="relative w-full h-[100svh] sm:h-[100vh] overflow-hidden">
                    {/* Desktop image */}
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="object-cover object-center hidden sm:block"
                    />
                    {/* Mobile image */}
                    <Image
                      src={item.imageMobile}
                      alt={item.imageAlt}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="object-cover object-center sm:hidden"
                    />
                    <div className="absolute inset-0 flex items-start justify-center pt-16 sm:pt-20 md:pt-24 lg:pt-28 px-4 sm:px-6 md:px-8">
                      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 w-full max-w-4xl">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center text-white leading-tight">
                          {item.title}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-white font-semibold max-w-2xl px-2">
                          {item.description}
                        </p>
                        <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-center items-center gap-3 sm:gap-4 mt-2 sm:mt-4">
                          <Link href={item.link} className="w-full sm:w-auto">
                            <Button
                              className="w-full sm:w-auto px-6 sm:px-8 md:px-12 lg:px-16 rounded-sm font-semibold cursor-pointer text-sm sm:text-base"
                              size={"lg"}
                            >
                              {t("btn.learn.more")}
                            </Button>
                          </Link>
                          <Link
                            href={item.brochure}
                            target="_blank"
                            className="w-full sm:w-auto"
                          >
                            <Button
                              className="w-full sm:w-auto text-[var(--primary)] px-6 sm:px-8 md:px-12 lg:px-16 rounded-sm cursor-pointer font-semibold text-sm sm:text-base"
                              size={"lg"}
                              variant={"outline"}
                            >
                              {t("btn.see.brochure")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 left-2 sm:left-4 md:left-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-300/50 text-white hover:text-white hover:bg-gray-300/80" />
            <CarouselNext className="absolute top-1/2 right-2 sm:right-4 md:right-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-300/50 text-white hover:text-white hover:bg-gray-300/80" />
            <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex justify-center gap-2 sm:gap-3">
              {items.map((_, index) => (
                <button
                  key={index}
                  className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full cursor-pointer transition-colors ${
                    selectedIndex === index
                      ? "bg-black hover:bg-black/50"
                      : "bg-gray-400 hover:bg-gray-400/50"
                  }`}
                  onClick={() => carouselApi.current?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>

        {/* Product */}
        <div className="py-6 my-6 *:select-none">
          <div className="w-full overflow-x-auto">
            <Carousel
              opts={{
                loop: true,
              }}
              setApi={(api: CarouselApi) => {
                carouselProductApi.current = api;
                api?.on("select", () =>
                  setSelectedProductIndex(api.selectedScrollSnap()),
                );
              }}
            >
              <CarouselContent className="-mx-4">
                {" "}
                {/* <- langkah penting */}
                {items.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="px-4 basis-[80%] md:basis-[60%]"
                  >
                    <div className="relative h-full rounded-lg shadow aspect-[2/3] md:aspect-[4/3] lg:aspect-[2/1]">
                      {/* Desktop image */}
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(max-width: 768px) 80vw, 60vw"
                        className="object-cover md:object-center rounded-xl hidden md:block"
                        onClick={() =>
                          index !== selectedProductIndex
                            ? carouselProductApi.current?.scrollTo(index)
                            : null
                        }
                      />
                      {/* Mobile image */}
                      <Image
                        src={item.cardMobile}
                        alt={item.imageAlt}
                        fill
                        sizes="80vw"
                        className="object-cover rounded-xl md:hidden"
                        onClick={() =>
                          index !== selectedProductIndex
                            ? carouselProductApi.current?.scrollTo(index)
                            : null
                        }
                      />
                      <div className="absolute bottom-0 left-0 w-fit gap-2  p-4 md:p-8">
                        <div className=" flex flex-col items-start justify-center items w-fit  ">
                          <h1 className="text-[40px] md:text-3xl font-[750] text-center text-white">
                            {item.title}
                          </h1>
                          <p className="text-xs md:text-sm text-start text-white text font-medium">
                            {item.description}
                          </p>
                          <div className="flex flex-col md:flex-row justify-start gap-2 mt-2 w-full">
                            <Link href={item.link} className=" w-[50%]">
                              <Button className="px-4 md:px-8 text-xs  md:text-sm rounded-sm cursor-pointer">
                                {t("btn.learn.more")}
                              </Button>
                            </Link>

                            {/* <Link
                              href={"/corporate/contact/"}
                              className=" w-[50%]"
                            >
                              <Button
                                className=" text-[var(--primary)] px-4 text-xs  md:text-sm cursor-pointer md:px-8 rounded-sm"
                                variant={"outline"}
                              >
                                {t("btn.book.test.ride")}
                              </Button>
                            </Link> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-3 mt-4">
                {items.map((_, index) => (
                  <button
                    key={index}
                    className={`h-3 w-3 rounded-full cursor-pointer ${
                      selectedProductIndex === index
                        ? "bg-black hover:bg-black/50"
                        : "bg-gray-400 hover:bg-gray-400/50"
                    }`}
                    onClick={() => carouselProductApi.current?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        </div>

        {/* supercharge */}
        <div className="relative w-full h-[70vh] md:h-[70vh]">
          <Image
            src="/super-charge/supercharge-testing.png"
            alt="supercharge"
            fill
            sizes="100vw"
            className="object-cover object-[10%_50%] sm:object-[0%_50%] lg:object-[0%_37%]"
          />
          <div className="absolute top-0 right-0 w-full h-full flex items-end lg:items-center justify-center lg:justify-end lg:px-10 lg:py-24">
            <div className=" flex flex-col items-center justify-center px-1 md:px-5 items gap-0 w-full lg:w-fill lg:max-w-[50%] xl:bg-none max-lg:bg-gradient-to-t max-lg:from-[#000000]/60 max-lg:from-15% max-lg:via-[#000000]/30 max-md:via-80% max-md:to-transparent p-5">
              <h1 className="text-3xl md:text-5xl font-bold text-center text-white lg:flex text-nowrap">
                <div className=" max-sm:px-3 flex flex-col xl:flex-row items-center justify-center gap-2 bg-red-100/0">
                  <Image
                    src="/super-charge/supercharge-typo-nobg.png"
                    alt="SuperCharge"
                    width={500}
                    height={100}
                    sizes="(max-width: 768px) 300px, 500px"
                    className="p-0 w-auto h-auto max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
                  />{" "}
                </div>
              </h1>
              <p className="text-sm md:text-lg text-center text-white mb-4">
                {t("supercharge.landing.description")}
              </p>
              <div className="md:flex w-full justify-center gap-4 mt-0 px-6 *:mt-3">
                <Button
                  className="px-6 md:px-16 rounded-sm max-sm:w-full"
                  size={"lg"}
                >
                  <Link href="/super-charge">More Information</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="w-full my-14">
          <SpecTable />
        </div> */}

        <div className="main-container my-24">
          <ComparisonTable mode="overview" primaryBikeId="" />
        </div>

        {/* environmental advantage */}
        <div className="relative w-full min-h-[100svh] sm:min-h-[90vh] md:min-h-[80vh] lg:min-h-[70vh]">
          <Image
            src="/Environtmental-Advantage.webp"
            alt="environmental-advantage"
            fill
            sizes="100vw"
            className="object-cover object-[30%_50%] md:object-[20%_50%] lg:object-[0%_55%]"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8">
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full max-w-7xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white">
                Environmental Advantage
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-center text-white max-w-2xl px-2">
                {t("features.title") + " " + t("features.titleHighlight")}
              </p>
              <div className="flex flex-col lg:flex-row flex-wrap items-center justify-center w-full gap-8 sm:gap-6 md:gap-8 lg:gap-12 mt-8 sm:mt-14 md:mt-24 lg:mt-16">
                {features.map((feature: any, index: any) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-start w-full  lg:w-[28%] xl:w-[22%] gap-2 sm:gap-3 px-2 sm:px-4"
                    // className="flex flex-col items-center justify-start w-full sm:w-[45%] md:w-[30%] lg:w-[28%] xl:w-[22%] gap-2 sm:gap-3 px-2 sm:px-4"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                      <div className="text-[var(--primary)]">
                        {feature.icon}
                      </div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white text-center">
                        {feature.title}
                      </h2>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-white text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
