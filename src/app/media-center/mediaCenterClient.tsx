"use client";
import Image from "next/image";
import React from "react";
import { LinkPreview } from "../lib/fetchPreview";
import { NewsCard } from "./components/newsCard";
import InstagramEmbed from "./components/instagramEmbed";
import type { InstagramPostData } from "./components/fetchInstagram";
import { useLanguage } from "../lib/language-context";

type Props = {
  previews: LinkPreview[];
  instagramPosts: InstagramPostData[];
};

export default function MediaCenterClient({ previews, instagramPosts }: Props) {
  // const [previews, setPreviews] = useState<LinkPreview[]>([]);
  const { t } = useLanguage();

  return (
    <div className=" w-full">
      {/* <div className=" h-[200vh]"> */}
      {/* banner */}

      {/* <div className="w-full relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[5400/1400]"> */}
      <div className="relative h-[50vh] w-full bg-black/10">
        
        <Image
          src="/media-center/banner-media-center.webp"
          width={1000}
          height={100}
          alt="banner"
          // className="absolute w-full object-cover object-top md:h-full"
          className=" h-full w-full object-cover object-[60%_100%] absolute inset-0 z-10"

        />
        <div className=" absolute inset-0 z-20 bg-gradient-to-b  from-black/30 to-black/50 w-full h-full flex items-center justify-evenly">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white font-semibold tracking-wide px-4 text-center">
            {t("mediaCenter.landing.h1")}
          </h1>
        </div>
      </div>

      {/* Berita */}
      <div className="main-container">
        <div className="my-6 md:my-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
            {t("mediaCenter.landing.news.title")}
          </h2>
          <div className="w-full h-[2px] mt-2 bg-gray-200"></div>
        </div>

        <div className="py-8">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {previews.map((p) => (
              <div key={p.url} className="rounded-xl">
                <NewsCard data={p} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instagram */}
      <div className="main-container">
        <div className="my-6 md:my-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
            Instagram
          </h2>
          <p className="mt-2 text-gray-500">
            <a
              href="https://www.instagram.com/wedison.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              @wedison.id
            </a>
          </p>
          <div className="w-full h-[2px] mt-2 bg-gray-200"></div>
        </div>

        <div className="py-8">
          <InstagramEmbed posts={instagramPosts} />
        </div>
      </div>
    </div>
  );
}
