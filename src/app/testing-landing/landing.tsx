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
import React, { useEffect, useState } from "react";
import { useLanguage } from "../lib/language-context";
import Link from "next/link";
import Preloader from "../components/Preloader";
import ComparisonTable from "../components/comparison-table";

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
  }[] = [
    {
      image: "/edpower-landing-hero.webp",
      imageAlt: "EDPower in Gray",
      imageMobile: "/edpower-landing-hero-mobile.webp",
      cardMobile: "/edpower-landing-card-mobile.webp",
      title: t("edpower.productPage.hero.title"),
      description: t("edpower.productPage.hero.description"),
      link: "/edpower/",
    },
    {
      image: "/athena-landing-hero.webp",
      imageAlt: "Athena in Gray",
      imageMobile: "/athena-landing-hero-mobile.webp",
      cardMobile: "/athena-landing-card-mobile.webp",
      title: t("athena.productPage.hero.title"),
      description: t("athena.productPage.hero.description"),
      link: "/athena/",
    },
    {
      image: "/mini-landing-hero.webp",
      imageAlt: "Mini in Gray",
      imageMobile: "/mini-landing-hero-mobile.webp",
      cardMobile: "/mini-landing-card-mobile.webp",

      title: t("mini.productPage.hero.title"),
      description: t("mini.productPage.hero.description"),
      link: "/mini/",
    },
    {
      image: "/victory-landing-hero.webp",
      imageAlt: "Victory in Gray",
      imageMobile: "/victory-landing-hero-mobile.webp",
      cardMobile: "/victory-landing-card-mobile.webp",
      title: t("victory.productPage.hero.title"),
      description: t("victory.productPage.hero.description"),
      link: "/victory/",
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
  const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 640);
    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <>
      <Preloader />

      <div>
        {/* Hero */}
        <div>
          <Carousel
            opts={{
              loop: true,
            }}
            setApi={(api: CarouselApi) => {
              carouselApi.current = api;
              api?.on("select", () =>
                setSelectedIndex(api.selectedScrollSnap())
              );
            }}
          >
            <CarouselContent>
              {" "}
              {items.map((item, index) => (
                <CarouselItem key={index} className="w-full">
                  <div className=" relative w-full h-[100vh] overflow-hidden">
                    <div className="flex flex-col items-center justify-center w-full h-full scale-100 ">
                      <Image
                        src={isDesktop ? item.image : item.imageMobile}
                        alt={item.imageAlt}
                        width={1000}
                        height={1000}
                        quality={100}
                        className=" object-cover object-center w-full h-full "
                      />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full flex items-start py-10 md:py-24">
                      <div className="mt-8 flex flex-col items-center justify-center items gap-2 w-full">
                        <h1 className="text-4xl md:text-6xl font-bold text-center text-white">
                          {item.title}
                        </h1>
                        <p className="text-sm md:text-lg text-center text-white font-semibold">
                          {item.description}
                        </p>
                        <div className="flex w-full justify-center gap-4 mt-2">
                          {" "}
                          <Link href={item.link}>
                            <Button
                              className="px-8 md:px-16 rounded-sm font-semibold cursor-pointer"
                              size={"lg"}
                            >
                              {t("btn.learn.more")}
                            </Button>
                          </Link>
                          <Link
                            href={"/brochure/brochure-wedison.pdf"}
                            target="_blank"
                          >
                            <Button
                              className=" text-[var(--primary)] px-8 md:px-16 rounded-sm cursor-pointer font-semibold"
                              size={"lg"}
                              variant={"outline"}
                              // disabled
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
            <CarouselPrevious className="absolute top-1/2 left-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-16 h-16 bg-gray-300/50 text-white hover:text-white hover:bg-gray-300/80 " />
            <CarouselNext className="absolute top-1/2 right-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-16 h-16 bg-gray-300/50 text-white hover:text-white hover:bg-gray-300/80 " />
            <div className="absolute bottom-10 right-1/2 translate-x-1/2 flex justify-center gap-3 mt-4">
              {items.map((_, index) => (
                <button
                  key={index}
                  className={`h-3 w-3 rounded-full cursor-pointer ${
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
                  setSelectedProductIndex(api.selectedScrollSnap())
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
                      <Image
                        src={isDesktop ? item.image : item.cardMobile}
                        alt={item.imageAlt}
                        width={1000}
                        height={1000}
                        className={`object-cover md:object-center w-full h-full rounded-xl`}
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
                          <div className="flex flex-col md:flex-row justify-center gap-2 mt-2 w-full">
                            <Link href={item.link} className=" w-[50%]">
                              <Button className="px-4 md:px-8 text-xs  md:text-sm rounded-sm cursor-pointer">
                                {t("btn.learn.more")}
                              </Button>
                            </Link>

                            <Link
                              href={"/corporate/contact/"}
                              className=" w-[50%]"
                            >
                              <Button
                                className=" text-[var(--primary)] px-4 text-xs  md:text-sm cursor-pointer md:px-8 rounded-sm"
                                variant={"outline"}
                              >
                                {t("btn.book.test.ride")}
                              </Button>
                            </Link>
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
            src="/supercharge-testing.png"
            alt="supercharge"
            width={1000}
            height={1000}
            className=" object-cover object-[10%_50%] lg:object-[0%_37%] w-full h-full "
          />
          <div className="absolute top-0 right-0 w-full h-full flex items-end md:items-center justify-center md:justify-end md:px-10 md:py-24">
            <div className=" flex flex-col items-center justify-center px-1 md:px-5 items gap-0 w-full md:w-fill md:max-w-[60%] xl:bg-none bg-gradient-to-t from-[#000000]/40 via-[#000000]/30 to-transparent p-5">
              <h1 className="text-3xl md:text-5xl font-bold text-center text-white xl:flex text-nowrap">
                <div className=" p-0 flex flex-col xl:flex-row items-center justify-center gap-2 bg-red-100/0">
                  <Image
                    src="/supercharge-typo-nobg.png"
                    alt="Super Charge"
                    width={500}
                    height={500}
                    className="p-0 "
                  />{" "}
                </div>
              </h1>
              <p className="text-sm md:text-lg text-center text-white">
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

        <div className="container mx-auto my-24 px-4">
          <ComparisonTable mode="overview" primaryBikeId="" />
        </div>

        {/* environmental advantage */}
        <div className="relative w-full h-[90vh] md:h-[70vh]">
          <Image
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z3JlZW4lMjBlbnZpcm9ubWVudHxlbnwwfHwwfHx8MA%3D%3D"
            alt="environmental-advantage"
            width={1000}
            height={1000}
            className=" object-cover object-[50%_50%] lg:object-[0%_55%] w-full h-full "
          />
          <div className="absolute top-0  right-0 w-full h-full flex items-start py-6 md:py-10">
            <div className=" flex flex-col items-center justify-center items gap-2 w-full h-full">
              <h1 className="text-xl md:text-4xl font-bold text-center text-white">
                Environmental Advantage
              </h1>
              <p className="text-sm md:text-md text-center text-white">
                {t("features.title") + " " + t("features.titleHighlight")}
              </p>
              <div className="flex flex-col md:flex-row items-start w-full justify-evenly gap-4 mt-12 p-2">
                {features.map((feature: any, index: any) => (
                  <div
                    key={index}
                    className="flex flex-col md:items-center md:justify-center items-start justify-start md:w-[22%] gap-2 "
                  >
                    <div className="flex md:flex-row justify-start items-center gap-2">
                      <div className="text-[var(--primary)] mb-2">
                        {feature.icon}
                      </div>
                      <h2 className="text-sm md:text-lg font-semibold text-white ">
                        {feature.title}
                      </h2>
                    </div>
                    <p className="text-xs md:text-sm text-white text-start md:text-center">
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
