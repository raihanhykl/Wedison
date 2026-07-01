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
      perView: isDesktop ? 1 : 1.1,
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
      <div className="sm:mx-[72px] xl:mx-[138px] px-4 max-w-[1600px] overflow-visible">
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
                <div className="relative h-[370px] w-full overflow-hidden rounded-xl sm:h-[404px] xl:h-[580px]">
                  <Image
                    src={isDesktop ? src.image : src.imageMobile || src.image}
                    alt={src.alt}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1280px) 70vw, 1100px"
                    className={cn("object-cover object-center", src.className)}
                  />
                </div>
                <div className="mt-6 w-full">
                  <h3 className="font-display text-3xl font-bold tracking-tight text-foreground xl:text-4xl">
                    {src.title}
                  </h3>

                  <div className="mt-3 w-[90%] text-lg leading-relaxed text-muted-foreground lg:w-[80%]">
                    {src.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
