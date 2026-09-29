"use client";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StoreBadgesProps {
  appStoreUrl?: string;
  googlePlayUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { width: 120, height: 40 },
  md: { width: 150, height: 50 },
  lg: { width: 180, height: 60 },
};

export default function StoreBadges({
  appStoreUrl = "https://apps.apple.com/id/app/wedison-supercharge/id6744643866",
  googlePlayUrl = "https://play.google.com/store/apps/details?id=co.wedison.rider",
  size = "md",
  className,
}: StoreBadgesProps) {
  const { width, height } = sizeMap[size];

  return (
    <div
      className={cn("flex flex-wrap items-center gap-3 sm:gap-4", className)}
    >
      <Link
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-all duration-300 hover:opacity-80 hover:-translate-y-0.5"
      >
        <Image
          src="/icons/app-store-badge.png"
          alt="Download on the App Store"
          width={width}
          height={height}
          className="h-auto"
          style={{ width: `${width}px` }}
        />
      </Link>
      <Link
        href={googlePlayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-all duration-300 hover:opacity-80 hover:-translate-y-0.5"
      >
        <Image
          src="/icons/google-play-badge.png"
          alt="Get it on Google Play"
          width={width}
          height={height}
          className="h-auto"
          style={{ width: `${width}px` }}
        />
      </Link>
    </div>
  );
}
