/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { useEffect, useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// List gambar (bisa diubah jadi props nanti)
const images = [
  "/mini-hero.webp",
  "/edmax-hero.webp",
  "/athena-hero.webp",
  // "/mini-hero.webp",
  // "/edmax-hero.webp",
  // "/athena-hero.webp",
  // "/mini-hero.webp",
  // "/edmax-hero.webp",
  // "/athena-hero.webp",
];
export interface carouselData {
  image: string;
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
  const [firstLast, setFirstLast] = useState<boolean>(true);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: "free",
    slides: {
      origin: data.origin ? data.origin : firstLast ? "center" : "center",
      perView: data.perView ? data.perView : firstLast ? 1.75 : 1.75,
      spacing: data.spacing ? data.spacing : 25,
    },
    defaultAnimation: {
      duration: 500,
      easing: (t) => t,
    },

    animationEnded(s) {
      setCurrentSlide(s.track.details.rel);
      setFirstLast(
        // s.track.details.rel === 0
        s.track.details.rel === 0 || s.track.details.rel === images.length - 1
          ? true
          : false
      );
    },
  });

  useEffect(() => {
    if (currentSlide > 0) {
      instanceRef.current?.moveToIdx(currentSlide);
    }
  }, [currentSlide, instanceRef]);

  return (
    <div
      ref={sliderRef}
      className="keen-slider overflow-hidden mb-32"
      // className="keen-slider px-6 sm:px-24 xl:px-40 overflow-hidden "
    >
      {data.data.map((src, index) => (
        <div
          key={index}
          className={`keen-slider__slide ${
            currentSlide === index ? "" : "cursor-pointer"
          }`}
          onClick={() => {
            if (index !== currentSlide) instanceRef.current?.moveToIdx(index);
            // setCurrentSlide(index);
          }}
        >
          <div className="relative w-full  rounded-xl overflow-hidden">
            <Image
              src={src.image}
              alt={src.alt}
              width={1000}
              height={500}
              className={cn(
                "rounded-xl w-full xl:h-[580px] xl:w-full sm:h-[404px]  h-[370px]   object-cover object-center",
                src.className
              )}
              // className="rounded-xl w-full xl:h-[580px] xl:w-full sm:h-[404px] sm:min-w-[606px] h-[370px] min-w-[330px]  object-cover"
            />
            {/* <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 backdrop-blur-md p-2 rounded-lg">
              <h3 className="text-lg font-semibold">Slide {index + 1}</h3>
              <Button className="text-sm text-gray-700 cursor-pointer">
                Deskripsi untuk slide {index + 1}
              </Button>
            </div> */}
          </div>
          <div className="pl-3 mt-6 w-full">
            <h3 className=" text-4xl xl:text-5xl font-medium">{src.title}</h3>

            <p className=" mt-2 text-xl text-muted-foreground font-normal w-[90%] sm:w-[90%] lg:w-[80%] overflow-visible text-align">
              {src.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
