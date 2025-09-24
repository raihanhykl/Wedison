/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { useEffect, useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export interface carouselData {
  image: string;
  imageMobile?: string;
  alt: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  title: string;
  desc: any;
}

interface PeekCarousel {
  for: string;
  data: carouselData[];
  origin?: number | "center" | "auto" | undefined;
  perView?: number;
  spacing?: number;
}

export default function PeekCarousel(data: PeekCarousel) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: "snap",
    slides: {
      origin: "center",
      perView: 1,
      // perView: isDesktop ? 1.23 : data.perView ? data.perView : 1.75,
      spacing: data.spacing ? data.spacing : 25,
    },
    defaultAnimation: {
      duration: 500,
      easing: (t) => t,
    },

    animationEnded(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 640);

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (currentSlide > 0) {
      instanceRef.current?.moveToIdx(currentSlide);
    }
  }, [currentSlide, instanceRef]);

  return (
    <div className="w-full overflow-hidden">
      <div className="mx-[136px] px-6 max-w-[2486px] overflow-visible">
        <div
          ref={sliderRef}
          className="keen-slider overflow-visible mb-32 "
          style={{ overflow: "visible" }}
        >
          <div
            className=" keen-slider overflow-visible"
            style={{ overflow: "visible" }}
          >
            {data.data.map((src, index) => (
              <div
                key={index}
                className={`keen-slider__slide overflow-visible z-0  ${
                  currentSlide === index ? "" : "cursor-pointer"
                }`}
                // style={{ overflow: "visible" }}
                onClick={() => {
                  if (index !== currentSlide)
                    instanceRef.current?.moveToIdx(index);
                }}
              >
                <div className="relative w-full rounded-xl">
                  <Image
                    src={isDesktop ? src.image : src.imageMobile || src.image}
                    alt={src.alt}
                    width={1000}
                    height={500}
                    quality={100}
                    className={cn(
                      "rounded-xl w-full xl:h-[580px] xl:w-full sm:h-[404px]  h-[370px]   object-cover object-center",
                      src.className
                    )}
                  />
                </div>
                <div className="pl-3 mt-6 w-full">
                  <h3 className=" text-4xl xl:text-5xl font-medium">
                    {src.title}
                  </h3>

                  <p className=" mt-2 text-xl text-muted-foreground font-normal w-[90%] sm:w-[90%] lg:w-[80%] overflow-visible text-align">
                    {src.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
