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
import { useLanguage } from "../lib/language-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function OjolClient() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const carouselApi = React.useRef<any>(null);
  const { t } = useLanguage();
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
  }[] = [
    {
      //   image: "/edpower/edpower-landing-hero.webp",
      image: "/ojol/wedison-bersama-ojol-desktop.webp",
      imageAlt: "EDPower in Gray",
      imageMobile: "/ojol/wedison-bersama-ojol-mobile.webp",
      // imageMobile: "/promotions/subsidi-8-jt-mobile.webp",

      cardMobile: "/edpower/edpower-landing-card-mobile.webp",
      //   title: t("edpower.productPage.hero.title"),
      title: "Wedison Bersama",
      description: t("edpower.productPage.hero.description"),
      link: "/edpower/",
      position: "top-center",
      contentWidth: "wider",
      backgroundStyle: "object-cover md:object-[50%_50%] object-center",
      textAlign: "center",
      height: "screen",
      overlay: "none",
      theme: "dark",
      className:
        "w-[254px] h-[249px] lg:w-[781px] lg:h-[147px] md:w-full pt-8 md:pt-26 xl:pt-14 ",
    },
    {
      image: "/ojol/wedison-hero-sewa-harian.webp",
      imageAlt: "Athena in Gray",
      imageMobile: "/athena/athena-landing-hero-mobile.webp",
      cardMobile: "/athena/athena-landing-card-mobile.webp",
      // title: t("athena.productPage.hero.title"),
      // titleHighlight: "Ojol",
      // description: t("athena.productPage.hero.description"),
      link: "/athena/",
      contentWidth: "wider",
      textAlign: "center",
      height: "screen",
      position: "center",
      overlay: "none",
      theme: "dark",
      className: "w-full pt-8",
      children: (
        <div className=" flex w-full h-full">
          <div className="flex-1 flex"></div>
          <div className="w-fit flex-col items-start justify-start gap-4">
            {/* <div className="flex w-[40%] flex-col items-start justify-start gap-4 bg-amber-200/40"> */}
            <h2 className="pr-6 lg:pr-16 text-lg font-semibold w-full text-start text-white text-shadow-[0px_1px_2px_rgb(0_0_0/_0.3)]">
              <span>Mulai dari</span>
              <br />
              <div className="text-[169px]/30 text-center font-extrabold text-primary ">
                50K
              </div>
              <div className="text-2xl font-[900] text-end w-full pt-2 text-white">
                /Hari
              </div>
              <div className=" flex flex-col justify-end items-end w-full  my-8 gap-1">
                <p className=" text-5xl font-extrabold">SEWA HARIAN</p>
                {/* <p>HARIAN</p> */}
                <p className=" text-3xl font-semibold">#JadiLebihMudah</p>
              </div>
              <div className=" w-full flex justify-end ">
                <Link
                  href="https://wa.me/628581230128123"
                  className="w-full h-full flex justify-end cursor-pointer"
                  target="_blank"
                >
                  <Button
                    className=" w-[80%] font-semibold tracking-wider cursor-pointer text-2xl py-6 rounded-2xl shadow-[inset_0_2px_2px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.12)]
                             border-[1px] border-black/10
                              transition-all duration-200
                                hover:shadow-[inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_6px_rgba(0,0,0,0.18),0_8px_16px_rgba(0,0,0,0.16)]
                                active:translate-y-[1px]
                                active:shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)]
                            "
                    // className=" w-[80%] font-normal text-lg py-4 mx-auto bg-white/30 border-1 border-white text-white
                    // "
                  >
                    Coba Gratis!
                  </Button>
                </Link>
              </div>
            </h2>
          </div>
        </div>
      ),
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
          // plugins={[
          //   Autoplay({
          //     delay: 4000,
          //     stopOnFocusIn: false,
          //   }),
          // ]}
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
                >
                  {item.children}
                </HeroSlide>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute top-1/2 left-2 sm:left-4 md:left-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-300/50 text-white hover:text-white hover:bg-gray-300/80" />
          <CarouselNext className="hidden md:flex absolute top-1/2 right-2 sm:right-4 md:right-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-300/50 text-white hover:text-white hover:bg-gray-300/80" />
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 sm:gap-3">
            {items.map((_, index) => (
              <button
                key={index}
                className={`h-2.5 sm:h-3 rounded-full cursor-pointer overflow-hidden transition-all duration-300 ${
                  selectedIndex === index
                    ? "w-10 sm:w-12 bg-gray-400"
                    : "w-2.5 sm:w-3 bg-gray-400 hover:bg-gray-400/50"
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
      <div className="py-8 w-full px-8 md:px-16 md:my-16 max-w-[2480px] mx-auto">
        {/* benefits */}
        <div className="w-full">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 md:mb-8">
            Narik Lebih Banyak, Kerja Lebih Efisien
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 md:mb-0 text-md md:text-xl">
            Bosen antre BBM? Capek mikirin biaya bensin yang makin mahal?
            Tenang, Wedison solusinya! Irit biaya operasional, gak perlu antre,
            dan perawatan lebih ringan. Waktunya upgrade cara narik kamu!
          </p>
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-0 md:gap-8 lg:gap-8 h-full">
            {/* <div className="w-full flex flex-wrap justify-between"> */}
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className=" aspect-square  w-[90%]  mx-auto lg:w-full rounded-lg overflow-hidden object-cover "
              >
                <Image
                  key={num}
                  className=" aspect-square object-cover w-full h-full bg-red-400 rounded-lg"
                  src={`/ojol/benefit-${num}.webp`}
                  width={1000}
                  height={1000}
                  // fill
                  alt="benefit"
                  // className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* hot campaign */}
        <div className=" w-full">
          <h2 className="text-4xl md:text-6xl font-bold text-center my-8 md:my-16">
            Hot Campaign
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 lg:gap-8 h-full">
            {[1, 2].map((num) => (
              <div
                key={num}
                className=" aspect-video w-full rounded-lg overflow-hidden object-cover "
              >
                <Image
                  key={num}
                  className=" aspect-video object-cover w-full h-full bg-gray-200 rounded-lg"
                  src={`/ojol/wedison-hero-sewa-harian.webp`}
                  width={1000}
                  height={1000}
                  // fill
                  alt="benefit"
                  // className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supercharge Section */}
      <div className="w-full bg-white py-8 md:py-16 overflow-hidden border-1 border-b-gray-300 border-t-gray-300">
        <div className="max-w-[2480px] mx-auto px-8 md:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden">
                {/* Image Container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/super-charge/supercharge-hero.webp"
                    alt="Wedison Supercharge"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-block mb-4">
                <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
                  10% - 80% dalam 15 menit
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
                {/* <p className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-600 mt-2">
                  Penghasilan Kamu!
                </p> */}
              </div>

              {/* Description */}
              <p className="text-gray-500 text-md md:text-xl mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Waktu adalah uang, dan Supercharge bikin kamu gak buang-buang
                waktu! Cukup{" "}
                <span className="font-bold text-gray-700">15 menit</span> aja,
                baterai langsung terisi dari 10% ke 80%. Langsung gas narik
                lagi, gak perlu nunggu lama! Sekali charge bisa tempuh hingga
                165 km*. Lebih banyak orderan, cuan lebih banyak!
              </p>

              {/* Features List */}
              {/* <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                {[
                  { icon: "⚡", text: "Charging Cepat" },
                  { icon: "🛣️", text: "Jarak Tempuh 165 km*" },
                  { icon: "💰", text: "Hemat Waktu & Cuan" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors duration-300"
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-gray-700 text-sm font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div> */}

              {/* Disclaimer */}
              <p className="text-gray-400 text-xs mb-6 max-w-xl mx-auto lg:mx-0">
                *Jarak tempuh 165 km berlaku untuk model EdPro Extended Battery
              </p>

              {/* CTA Button */}
              <Link href="/super-charge">
                <Button
                  className="group relative px-8 py-6 text-lg font-semibold rounded-xl
                    bg-primary hover:bg-primary/90 text-white
                    shadow-lg hover:shadow-xl
                    transition-all duration-300
                    hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    Pelajari Lebih Lanjut
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
