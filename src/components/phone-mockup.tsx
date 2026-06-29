"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  screenshot: string;
  alt: string;
  className?: string;
}

export default function PhoneMockup({
  screenshot,
  alt,
  className,
}: PhoneMockupProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Phone frame */}
      <div className="relative bg-gray-900 rounded-[2.5rem] p-[5px] shadow-xl">
        {/* Inner bezel */}
        <div className="relative bg-black rounded-[2.2rem] overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-center pt-3">
            <div className="w-[80px] h-[24px] bg-black rounded-full" />
          </div>

          {/* Screen content */}
          <div className="relative aspect-[9/19.5] w-full">
            <Image
              src={screenshot}
              alt={alt}
              fill
              sizes="(max-width: 768px) 250px, 320px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
