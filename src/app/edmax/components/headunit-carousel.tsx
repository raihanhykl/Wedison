import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

export default function HeadunitCarousel() {
  return (
    <Carousel
      className=" w-50%"
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent>
        <CarouselItem>
          <Image
            src={"/edmax-digital.webp"}
            alt="Edmax Digital Headunit"
            width={500}
            height={500}
            className=" object-cover w-full h-full"
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src={"/edmax-map1.webp"}
            alt="Edmax Digital Headunit"
            width={500}
            height={500}
            className=" object-cover w-full h-full"
          />
        </CarouselItem>
        {/* <CarouselItem>
          <Image
            src={"/edmax-edit.webp"}
            alt="Edmax Digital Headunit"
            width={500}
            height={500}
            className=" object-cover w-full h-full"
          />
        </CarouselItem> */}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
