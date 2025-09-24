import Image from "next/image";
import React from "react";
import { PRESS_URLS } from "../../../public/data/press-urls";
import { fetchAllPreviews } from "../lib/fetchPreview";
import { NewsCard } from "./components/newsCard";

export default async function MediaCenterstructure() {
  const previews = await fetchAllPreviews(PRESS_URLS);

  return (
    <div className=" w-full">
      {/* <div className=" h-[200vh]"> */}
      {/* banner */}

      <div className="  w-full relative aspect-[5400/1400]">
        <Image
          src="/media-center/banner-media-center.webp"
          width={1000}
          height={100}
          alt="banner"
          className="absolute w-full object-cover object-top md:h-full"
        />
        <div className=" absolute inset-0 bg-gradient-to-b from-black/30 to-black/50 w-full h-full flex items-center justify-evenly">
          <h1 className=" text-7xl text-white font-semibold tracking-wide">
            Media Center
          </h1>
        </div>
      </div>

      <div className=" mx-auto container">
        <div className=" m-8 ">
          <h2 className=" text-6xl font-semibold">Berita</h2>
          <div className=" w-full h-[2px] mt-2 bg-gray-200"></div>
        </div>

        <div className=" mx-auto container px-4">
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
            {/* {[1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3].map((a, i) => ( */}
            {previews.map((p) => (
              <div key={p.url} className="">
                <NewsCard data={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
