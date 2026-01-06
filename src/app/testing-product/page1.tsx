"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PeekCarousel, { carouselData } from "./peek";

export default function Page() {
  const ProductData: carouselData[] = [
    {
      image: "/bees-hero.webp",
      alt: "Bees Hero",
      title: "Compact & Feature-Rich",
      desc: "Compact yet packed with features—Bees delivers XL underseat storage, a sleek digital LED display, and confident dual disc brakes. Easy home charging makes every day effortless.",
    },
    {
      image: "/edmax-hero.webp",
      alt: "Edmax Hero",
      className: "object-100%_0% object-cover w-full ",
      title: "Even Quieter",
      desc: "  An updated wheel and tire package offers a smoother driving experience. Redesigned body castings reduce parts from 70 to 1 for fewer gaps. All to create a whisper-quiet ride.",
    },
    {
      image: "/athena-hero.webp",
      alt: "Athena Hero",
      title: "Even Quieter",
      desc: "  An updated wheel and tire package offers a smoother driving experience. Redesigned body castings reduce parts from 70 to 1 for fewer gaps. All to create a whisper-quiet ride.",
    },
  ];
  const ChargingData: carouselData[] = [
    {
      image: "/supercharge-chip.webp",
      alt: "SuperCharge",
      className: "object-[10%_10%] object-cover w-full",
      title: "SuperCharge",
      desc: (
        <>
          Experience lightning-fast charging with our advanced SuperCharge
          technology, designed to keep you on the road with charge your battery
          from 10% to 80% in just 15 Minutes.{" "}
          <Link href="/super-charge" className="underline text-primary">
            Learn More
          </Link>
        </>
      ),
    },
    {
      image: "/supercharge-hero.webp",
      alt: "Home Charging",
      className: "object-[100%_40%] object-cover w-full",
      title: "Home Charging",
      desc: (
        <>
          Enjoy the convenience of charging your vehicle at home, where you can
          fully charge your EdPower in just 4 hours, ensuring it&apos;s ready
          whenever you are.
        </>
      ),
    },
  ];
  return (
    <div>
      {/* hero */}
      <div className=" relative w-full">
        <div className="flex flex-col items-center justify-center w-full h-[96vh] md:h-[96vh]">
          <Image
            src={"/bees-hero.webp"}
            alt={`contoh-hero`}
            width={1000}
            quality={100}
            height={1000}
            className=" object-cover object-[65%_100%] lg:object-[90%_80%] w-full h-full "
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex items-start py-10 md:py-24">
          <div className=" flex flex-col items-center justify-center items gap-2 w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-center text-white">
              Ed-Power
            </h1>
            <p className="text-sm md:text-lg text-center text-white">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum
              tenetur placeat libero asperiores impedit facere atque,
            </p>
            <div className="flex w-full justify-center gap-4 mt-2">
              <Button className="px-8 md:px-16 rounded-sm" size={"lg"}>
                <Link href="/edpower">Learn More</Link>
              </Button>
              <Button
                className=" text-[var(--primary)] px-8 md:px-16 rounded-sm"
                size={"lg"}
                variant={"outline"}
                disabled
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* technical spec */}
      <div className="py-26 w-full px-8 md:px-16 md:my-16">
        <div className="flex justify-center container mx-auto">
          <div className="  flex items-center justify-center w-full max-w-6xl">
            <div className=" flex flex-col md:flex-row items-center md:items-start md:justify-evenly h-full w-fit md:w-full">
              <div className=" max-md:w-full">
                <div className=" flex justify-start  w-full">
                  <div className="text-6xl md:text-7xl font-medium md:font-bold ">
                    357
                  </div>
                  <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold">
                    mi
                  </div>
                </div>
                <div className="text-lg font-medium md:font-semibold">
                  {"Range (EPA est.)"}
                </div>
              </div>
              <div className=" w-[80%] h-[1px] bg-gradient-to-r md:w-[1px] md:h-full my-3 md:my-0 md:bg-gradient-to-b from-white from-0% via-black/40 to-100%  to-white"></div>
              <div className=" max-md:w-full">
                <div className=" flex justify-start ">
                  <div className="text-6xl md:text-7xl font-medium md:font-bold">
                    182
                  </div>
                  <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold">
                    mi
                  </div>
                </div>
                <div className="text-lg font-medium md:font-semibold">
                  {"Charge in 15 min"}
                </div>
              </div>

              <div className=" w-[80%] h-[1px] bg-gradient-to-r md:w-[1px] md:h-full my-3 md:my-0 md:bg-gradient-to-b from-white from-0% via-black/40 to-100% to-white"></div>

              <div className=" max-md:w-full">
                <div className=" flex justify-start ">
                  <div className="text-6xl md:text-7xl font-medium md:font-bold">
                    FSD
                  </div>
                  <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold"></div>
                </div>
                <div className="text-lg font-medium md:font-semibold">
                  Full Self-Driving {"(Supervised)"} <br /> Comptatible
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Product Overview */}
      <div className="w-full xl:px-16 flex flex-col justify-center">
        <div className=" w-full h-[490px] sm:h-[576px] lg:h-[600px]">
          <Image
            src={"/bees-hero.webp"}
            alt={`wedison-sidebyside`}
            width={1000}
            height={1000}
            className="w-full h-full object-cover object-center xl:rounded-md"
          />
        </div>

        <div className=" w-full flex items-center justify-center ">
          <div className="w-full sm:mt-14 mt-8 px-6 sm:mx-[72px]">
            <h2 className="text-5xl xl:text-6xl font-medium mb-1">
              Redesigned From End to End
            </h2>
            <p className="text-2xl xl:text-2xl font-normal mb-10 sm:mb-32  text-muted-foreground">
              From the front bumper to the taillight, the exterior is completely
              redesigned to unlock maximum efficiency so you can get the most
              range out of every charge. With updated suspension, wheels and
              tires, your ride will be smoother and quieter.
            </p>
          </div>
        </div>
      </div>
      {/* Product Highlight */}
      <div className="">
        <PeekCarousel data={ProductData} for="bees" perView={1.35} />
      </div>

      {/* Supercharge Overview */}
      <div className="w-full xl:px-16 flex flex-col justify-center">
        <div className=" w-full h-[490px] sm:h-[576px] lg:h-[600px]">
          <Image
            src={"/edmax-charging.webp"}
            alt={`wedison charging`}
            width={1000}
            height={1000}
            className="w-full h-full object-cover object-center xl:rounded-md"
          />
        </div>

        <div className=" w-full flex items-center justify-center ">
          <div className="w-full sm:mt-14 mt-8 px-6 sm:mx-[72px]">
            <h2 className="text-5xl xl:text-6xl font-medium mb-1">
              Flexible ways to charge your EdPower
            </h2>
            <p className="text-2xl xl:text-2xl font-normal mb-10 sm:mb-32  text-muted-foreground">
              With EdPower, you have two convenient ways to charge. Supercharge
              your vehicle from 10% to 80% in just 15 minutes at any of Wedisons
              showrooms. Alternatively, enjoy the convenience of home charging,
              where you can fully charge your EdPower in just 4 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Supercharge Highlight */}
      <div className="">
        <PeekCarousel data={ChargingData} for="supercharge" perView={1.35} />
      </div>
    </div>
  );
}
