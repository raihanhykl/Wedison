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
    title: string;
    description: string;
    link: string;
    children?: React.ReactNode;
  }[] = [
    {
      //   image: "/edpower/edpower-landing-hero.webp",
      image: "/ojol/wedison-bersama-ojol-desktop.webp",
      imageAlt: "EDPower in Gray",
      imageMobile: "/ojol/wedison-bersama-ojol-mobile.webp",
      cardMobile: "/edpower/edpower-landing-card-mobile.webp",
      //   title: t("edpower.productPage.hero.title"),
      title: "Wedison Bersama",
      description: t("edpower.productPage.hero.description"),
      link: "/edpower/",
    },
    {
      image: "/ojol/wedison-hero-sewa-harian.webp",
      imageAlt: "Athena in Gray",
      imageMobile: "/athena/athena-landing-hero-mobile.webp",
      cardMobile: "/athena/athena-landing-card-mobile.webp",
      title: t("athena.productPage.hero.title"),
      description: t("athena.productPage.hero.description"),
      link: "/athena/",
    },
    {
      image: "/mini/mini-landing-hero.webp",
      imageAlt: "Mini in Gray",
      imageMobile: "/mini/mini-landing-hero-mobile.webp",
      cardMobile: "/mini/mini-landing-card-mobile.webp",

      title: t("mini.productPage.hero.title"),
      description: t("mini.productPage.hero.description"),
      link: "/mini/",
    },
    {
      image: "/victory/victory-landing-hero.webp",
      imageAlt: "Victory in Gray",
      imageMobile: "/victory/victory-landing-hero-mobile.webp",
      cardMobile: "/victory/victory-landing-card-mobile.webp",
      title: t("victory.productPage.hero.title"),
      description: t("victory.productPage.hero.description"),
      link: "/victory/",
    },
  ];
  return (
    <div className="w-full">
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
            {/* {items.map((item, index) => ( */}
            <CarouselItem className="w-full">
              <HeroSlide
                position="top-center"
                contentWidth="wider"
                backgroundStyle="object-cover md:object-[50%_50%] object-center"
                textAlign="center"
                backgroundImage={items[0].image}
                backgroundImageMobile={items[0].imageMobile}
                title={items[0].title}
                titleHighlight="Ojol"
                description={items[0].description}
                height="screen"
                overlay="none"
                theme="dark"
                contentClassName="w-[254px] h-[249px] lg:w-[781px] lg:h-[147px] md:w-full pt-8 md:pt-16 xl:pt-14  "
              />
            </CarouselItem>

            <CarouselItem className="w-full">
              <HeroSlide
                contentWidth="wider"
                backgroundImage={items[1].image}
                backgroundImageMobile={items[1].imageMobile}
                height="screen"
                overlay="none"
                //   theme="dark"
                overlayOpacity={0}
                textAlign="center"
                position="center"
                contentClassName={"w-full pt-8"}
              >
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
                        <p className=" text-3xl font-semibold">
                          #JadiLebihMudah
                        </p>
                      </div>
                      <div className=" w-full flex justify-end ">
                        <Link
                          href="https://wa.me/628581230128123"
                          className="w-full h-full flex justify-end"
                          target="_blank"
                        >
                          <Button
                            className=" w-[80%] font-semibold tracking-wider text-2xl py-6 rounded-2xl shadow-[inset_0_2px_2px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.12)]
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
              </HeroSlide>
            </CarouselItem>
            <CarouselItem className="w-full">
              <HeroSlide
                position="top-center"
                contentWidth="wider"
                backgroundStyle="object-cover md:object-[50%_50%] object-center"
                textAlign="center"
                backgroundImage={items[0].image}
                backgroundImageMobile={items[0].imageMobile}
                title={items[0].title}
                titleHighlight="Ojol"
                description={items[0].description}
                height="screen"
                overlay="none"
                theme="dark"
                contentClassName="w-[254px] h-[249px] lg:w-[781px] lg:h-[147px] md:w-full pt-8 md:pt-16 xl:pt-14  "
              />
            </CarouselItem>

            <CarouselItem className="w-full">
              <HeroSlide
                contentWidth="wider"
                backgroundImage={items[1].image}
                backgroundImageMobile={items[1].imageMobile}
                height="screen"
                overlay="none"
                //   theme="dark"
                overlayOpacity={0}
                textAlign="center"
                position="center"
                contentClassName={"w-full pt-8"}
              >
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
                        <p className=" text-3xl font-semibold">
                          #JadiLebihMudah
                        </p>
                      </div>
                      <div className=" w-full flex justify-end ">
                        <Link
                          href="https://wa.me/628581230128123"
                          className="w-full h-full flex justify-end"
                          target="_blank"
                        >
                          <Button
                            className=" w-[80%] font-semibold tracking-wider text-2xl py-6 rounded-2xl shadow-[inset_0_2px_2px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.12)]
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
              </HeroSlide>
            </CarouselItem>

            {/* ))} */}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-2 sm:left-4 md:left-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-300/50 text-white hover:text-white hover:bg-gray-300/80" />
          <CarouselNext className="absolute top-1/2 right-2 sm:right-4 md:right-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-300/50 text-white hover:text-white hover:bg-gray-300/80" />
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 sm:gap-3">
            {[0, 1, 2, 3].map((_, index) => (
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
            minus vel, aut maiores molestias reiciendis impedit! Temporibus,
            itaque doloremque id, obcaecati quos quibusdam fuga atque cupiditate
            aspernatur quod inventore rerum?
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

        {/* supercharge. teaser super charge */}
      </div>
    </div>
  );
}
