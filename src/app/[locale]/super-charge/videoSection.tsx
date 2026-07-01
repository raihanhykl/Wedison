"use client";
import React from "react";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";

export default function VideoSection() {
  const { t } = useLanguage();
  return (
    <div className="main-container flex h-auto w-full flex-col items-center justify-center py-12 md:py-20">
      <Reveal className="flex flex-col items-start justify-start">
        <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("supercharge.video.title")}
        </h2>
        <p className="w-full max-w-2xl text-base text-muted-foreground sm:text-lg">
          {t("supercharge.video.description")}
        </p>
      </Reveal>
      <Reveal className="mt-10 flex aspect-video w-full max-w-4xl items-start justify-center" y={28} amount={0.3}>
        {/* <iframe
          width="1000"
          height="100%"
          src="/SuperCharge/lv_0_20250709174532.mp4"
          title="YouTube video player"
          frameBorder="0"
          //   allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          //   allowFullScreen
          className="bg-card rounded-xl"
        ></iframe> */}
        <video
          width="1200"
          height="600"
          controls
          autoPlay={false}
          muted
          preload="metadata"
          playsInline
          poster="/super-charge/overview-supercharge-poster.jpg"
          className="w-full rounded-xl bg-card"
        >
          {/* WebM (lebih ringan) diprioritaskan; MP4 H.264 fallback lintas-browser (termasuk Firefox/Safari) */}
          <source src="/super-charge/overview-supercharge.webm" type="video/webm" />
          <source src="/super-charge/overview-supercharge.mp4" type="video/mp4" />
        </video>
      </Reveal>
    </div>
  );
}
