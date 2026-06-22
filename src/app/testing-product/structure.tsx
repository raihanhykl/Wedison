/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import PeekCarousel from "./peek";
import { cn } from "@/lib/utils";
import GetProductData from "../lib/product-data";
import { useLanguage } from "../lib/language-context";
import ComparisonTable from "../components/comparison-table";
import UserManualSection from "../components/user-manual-section";
import { useInView } from "react-intersection-observer";

type Props = {
  motorType: string;
};

export default function ProductPageComponent({ motorType }: Props) {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const product = GetProductData(motorType);
  const [count1, setCount1] = useState<number | string>(0);
  const [count2, setCount2] = useState<number | string>(0);
  const [count3, setCount3] = useState<number | string>(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
  });
  const { t } = useLanguage();
  useEffect(() => {
    const incrementer = (num: any, countSetter: any) => {
      if (typeof num !== "number") return countSetter(num);
      const finalCount = num;
      let currentCount = 0;
      // const increment = Math.ceil(1);
      const increment = Math.ceil(finalCount / 80);
      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= finalCount) {
          currentCount = finalCount;
          clearInterval(timer);
        }
        countSetter(currentCount);
      }, 20);

      return () => clearInterval(timer);
    };
    const checkScreen = () => setIsDesktop(window.innerWidth >= 640);
    // const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
    if (inView) {
      incrementer(product?.techSpec[0].title, setCount1);
      incrementer(product?.techSpec[1].title, setCount2);
      incrementer(product?.techSpec[2].title, setCount3);
    }
    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [inView]);

  // if (!product || isDesktop === undefined) return null;
  if (!product) return null;

  return (
    <div>
      {/* hero */}
      <div className=" relative w-full">
        <div className="flex flex-col items-center justify-center w-full h-[100vh] md:h-[100vh] overflow-hidden">
          {/* <div className="flex flex-col items-center justify-center w-full h-[90vh] md:h-[96vh] overflow-hidden"> */}
          <div className="relative w-full h-full scale-100 md:scale-100">
            <Image
              src={
                isDesktop
                  ? product?.hero.imageUrl
                  : product?.hero.imageUrlMobile || product?.hero.imageUrl
              }
              alt={product?.hero.imageAlt}
              width={1000}
              quality={100}
              height={1000}
              loading="eager"
              className={cn(
                " object-cover object-center w-full h-full",
                // " object-cover object-[50%_50%] lg:object-[90%_0%] w-full h-full",
                product?.hero.className,
              )}
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex items-start py-10 md:py-24">
          <div className="mt-8 flex flex-col items-center justify-center items gap-2 w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-center text-white">
              {product?.hero.title}
            </h1>
            <p className="text-sm md:text-lg text-center text-white">
              {product?.hero.desc}
            </p>
            <div className="flex w-full justify-center gap-4 mt-2">
              {/* <Link href={`/corporate/contact/`}> */}
              <Link
                href={`https://www.tokopedia.com/wedison-store`}
                target="_blank" rel="noopener noreferrer"
              >
                <Button
                  // className="px-4 md:px-4 rounded-sm cursor-pointer flex items-center justify-between font-semibold"
                  className="px-4 md:px-4 rounded-sm cursor-pointer flex items-center justify-between font-semibold bg-white text-black border border-black w-full hover:bg-white hover:text-primary"
                  size={"lg"}
                >
                  <Image
                    // src="/icons/tokopedia.svg"
                    src="/icons/Tokopedia_Mascot.png"
                    alt="Tokopedia Logo"
                    width={100}
                    height={100}
                    loading="eager"
                    className="w-6 h-6 md:w-8 md:h-8"
                  />
                  <p>{t("btn.buy.on.tokopedia")}</p>
                </Button>
              </Link>

              <Link
                href={`/brochure/brochure-${motorType}.pdf`}
                target="_blank" rel="noopener noreferrer"
              >
                <Button
                  className=" text-white px-8 md:px-12 cursor-pointer font-medium rounded-sm border-white bg-white/15 hover:text-white hover:bg-white/20"
                  // className=" text-[var(--primary)] px-8 md:px-16 cursor-pointer font-medium rounded-sm"
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
      {/* technical spec */}
      <div className="py-26 w-full px-8 md:px-16 md:my-16 max-w-[2480px] mx-auto">
        <div className="flex justify-center container mx-auto">
          <div className="  flex items-center justify-center w-full max-w-6xl">
            <div className=" flex flex-col md:flex-row items-center md:items-start md:justify-evenly h-full w-fit md:w-full">
              <div className=" max-md:w-full">
                <div className=" flex justify-start  w-full">
                  <div
                    ref={ref}
                    className="text-6xl md:text-7xl font-medium md:font-bold "
                  >
                    {/* {product?.techSpec[0].title} */}
                    {count1}
                  </div>
                  <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold">
                    {product?.techSpec[0].unit}
                  </div>
                </div>
                <div className="text-lg font-medium md:font-semibold">
                  {product?.techSpec[0].desc}
                </div>
              </div>
              <div className=" w-[80%] h-[1px] bg-gradient-to-r md:w-[1px] md:h-full my-3 md:my-0 md:bg-gradient-to-b from-white from-0% via-black/40 to-100% mx-[1px] to-white"></div>

              <div className=" max-md:w-full">
                <div className=" flex justify-start ">
                  <div className="text-6xl md:text-7xl font-medium md:font-bold">
                    {/* {product?.techSpec[1].title} */}
                    {count2}
                  </div>
                  <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold">
                    {product?.techSpec[1].unit}
                  </div>
                </div>
                <div className="text-lg font-medium md:font-semibold">
                  {product?.techSpec[1].desc}
                </div>
              </div>
              <div className=" w-[80%] h-[1px] bg-gradient-to-r md:w-[1px] md:h-full my-3 md:my-0 md:bg-gradient-to-b from-white from-0% via-black/40 to-100% mx-[1px] to-white"></div>

              <div className=" max-md:w-full">
                <div className=" flex justify-start ">
                  <div className="text-6xl md:text-7xl font-medium md:font-bold">
                    {/* {product?.techSpec[2].title} */}
                    {count3}
                  </div>
                  <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold">
                    {product?.techSpec[2].unit}
                  </div>
                </div>
                <div className="text-lg font-medium md:font-semibold">
                  {product?.techSpec[2].desc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Product Overview */}
      <div className="w-full xl:px-16 flex flex-col justify-center max-w-[2480px] mx-auto">
        <div className=" w-full h-[490px] sm:h-[576px] lg:h-[600px] xl:h-[700px] max-w-[2480px] mx-auto">
          <Image
            src={
              isDesktop
                ? product?.productOverview.imageUrl
                : product?.productOverview.imageUrlMobile ||
                  product?.productOverview.imageUrl
            }
            alt={product?.productOverview.imageAlt}
            width={1000}
            height={1000}
            className={cn(
              "w-full h-full object-cover object-center xl:rounded-md",
              product.productOverview.className,
            )}
          />
        </div>

        <div className=" w-full flex items-center justify-center ">
          <div className="w-full sm:mt-14 mt-8 px-4 sm:mx-[72px]">
            <h2 className="text-5xl xl:text-6xl font-medium mb-1">
              {product?.productOverview.title}
            </h2>
            <p className="text-2xl xl:text-2xl text-justify font-normal mb-10 sm:mb-32  text-muted-foreground">
              {product?.productOverview.desc}
            </p>
          </div>
        </div>
      </div>
      {/* Product Highlight */}
      <div className=" max-w-[2880px] mx-auto overflow-visible">
        <PeekCarousel
          data={product.productHighlight}
          for={motorType}
          perView={1.35}
          // perView={1.35}
        />
      </div>

      {/* Supercharge Overview */}
      {product?.chargingOverview && (
        <div className="w-full xl:px-16 flex flex-col justify-center max-w-[2480px] mx-auto">
          <div className=" w-full h-[490px] sm:h-[576px] lg:h-[600px] xl:h-[700px] max-w-[2480px] mx-auto ">
            <Image
              src={
                isDesktop
                  ? product?.chargingOverview.imageUrl
                  : product?.chargingOverview.imageUrlMobile ||
                    product?.chargingOverview.imageUrl
              }
              alt={product?.chargingOverview.imageAlt}
              width={1000}
              height={1000}
              className={cn(
                "w-full h-full object-cover object-center xl:rounded-md ",
                product.chargingOverview.className,
              )}
            />
          </div>

          <div className=" w-full flex items-center justify-center ">
            <div className="w-full sm:mt-14 mt-8 px-6 sm:mx-[72px]">
              <h2 className="text-5xl xl:text-6xl font-medium mb-1">
                {product?.chargingOverview.title}
              </h2>
              <p className="text-2xl xl:text-2xl text-justify font-normal mb-10 sm:mb-32  text-muted-foreground">
                {product?.chargingOverview.desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Supercharge Highlight */}
      {product.chargingHighlight && (
        <div className="max-w-[2880px] mx-auto overflow-visible">
          <PeekCarousel
            data={product.chargingHighlight}
            for="supercharge"
            perView={1.35}
          />
        </div>
      )}

      {/* Specification Accordion */}
      {/* <div className="py-6 w-full px-8 md:px-16 md:my-6 max-w-[2480px] mx-auto flex items-center justify-center">

        <SpecificationsAccordion motorType={motorType} />
      </div> */}

      <div className="py-6 w-full px-8 md:px-16 md:my-6 max-w-[2480px] mx-auto flex items-center justify-center">
        <ComparisonTable
          // bikes={bikesData}
          primaryBikeId={motorType}
          mode="comparison"
        />
      </div>

      {/* User Manual */}
      <UserManualSection
        variant="single"
        motorType={motorType as "bees" | "athena" | "victory" | "edpower"}
      />
    </div>
  );
}
