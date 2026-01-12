/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { HeroSlide, HeroSlideProps } from "@/components/hero";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { useLanguage } from "../lib/language-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// Campaign data
const campaignData = [
  {
    id: "milik",
    title: "Sewa Milik",
    tagline: "Cicil Motor, Jadi Milik Sendiri!",
    description:
      "Program sewa dengan opsi kepemilikan selama 3,5 tahun (42 bulan). Setelah kontrak selesai, motor jadi milik kamu!",
    image: "/ojol/sewa-milik-banner.webp",
    waLink:
      "https://wa.me/6282124657804?text=Halo%20Wedison,%20saya%20tertarik%20dengan%20program%20Sewa%20Milik",
    benefits: [
      "1x Gratis charging adapter regular (senilai Rp 1.000.000)",
      "1x Gratis ganti ban depan & belakang (senilai Rp 385.000)",
      "1x Gratis ganti kampas rem (1 set depan & belakang)",
      "2x Kunci mekanik",
      "Garansi baterai 3 tahun",
      "Garansi motor 2 tahun",
    ],
    terms: [
      "Skema sewa milik berlaku selama 3 tahun 6 bulan (42 bulan)",
      "Rider berhak libur 1 hari per minggu (maksimal 48 hari per tahun)",
      "Setelah kontrak 42 bulan selesai, kepemilikan motor akan dialihkan ke rider",
      "Tabungan akan digunakan untuk biaya asuransi, servis, sparepart, dan BPKB. Sisa tabungan di akhir kontrak akan ditransfer ke rider",
      "DP tidak dapat dikembalikan setelah dinyatakan eligible",
      "Denda tilang/pelanggaran lalu lintas ditanggung rider",
      "Rider wajib mengikuti proses screening dari Wedison",
    ],
    scheme: [
      { label: "Athena/Victory Regular", value: "Rp 58.000/hari" },
      { label: "Athena/Victory Extended", value: "Rp 63.000/hari" },
      { label: "EdPower Extended", value: "Rp 83.000/hari" },
      { label: "Deposit", value: "Rp 530.000 - Rp 780.000" },
    ],
  },
  {
    id: "harian",
    title: "Sewa Harian",
    tagline: "Narik Dulu, Fleksibel Tanpa Beban!",
    description:
      "Sewa motor listrik harian dengan kontrak 3 tahun. Cocok buat kamu yang mau narik tanpa mikir cicilan!",
    image: "/ojol/sewa-harian-banner.webp",
    waLink:
      "https://wa.me/6282124657804?text=Halo%20Wedison,%20saya%20tertarik%20dengan%20program%20Sewa%20Harian",
    benefits: [
      "1x Gratis charging adapter regular",
      "1x Gratis ganti ban depan & belakang (senilai Rp 385.000)",
      "1x Gratis ganti kampas rem (1 set depan & belakang)",
      "1x Gratis servis berkala",
      "2x Kunci mekanik",
      "Garansi baterai 3 tahun",
      "Garansi motor 2 tahun",
    ],
    terms: [
      "Skema sewa harian berlaku selama 3 tahun (36 bulan)",
      "Rider berhak libur 1 hari per minggu (maksimal 48 hari per tahun)",
      "DP tidak dapat dikembalikan setelah dinyatakan eligible",
      "Motor sepenuhnya milik PT. Wedison Nusantara Energi",
      "Denda tilang/pelanggaran lalu lintas ditanggung rider",
      "Kerusakan akibat kelalaian atau kecelakaan ditanggung rider",
      "Rider wajib mengikuti proses screening dari Wedison",
      "Warna motor ditentukan secara acak",
    ],
    scheme: [
      { label: "Athena/Victory Regular", value: "Rp 50.000/hari" },
      { label: "Athena/Victory Extended", value: "Rp 55.000/hari" },
      { label: "EdPower Extended", value: "Rp 75.000/hari" },
      { label: "Deposit", value: "Rp 500.000 - Rp 750.000" },
    ],
  },
];

export default function OjolClient() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState<string | null>(null);
  const carouselApi = React.useRef<any>(null);
  const { t } = useLanguage();
  const items: {
    image: string;
    imageMobile: string;
    imageAlt: string;
    cardMobile: string;
    title?: string;
    titleHighlight?: string;
    description?: string;
    link: string;
    children?: React.ReactNode;
    position?: HeroSlideProps["position"];
    textAlign?: HeroSlideProps["textAlign"];
    contentWidth?: HeroSlideProps["contentWidth"];
    backgroundStyle?: HeroSlideProps["backgroundStyle"];
    overlayOpacity?: HeroSlideProps["overlayOpacity"];
    variant?: HeroSlideProps["variant"];
    height?: HeroSlideProps["height"];
    overlay?: HeroSlideProps["overlay"];
    theme?: HeroSlideProps["theme"];
    className?: string;
    responsivePosition?: HeroSlideProps["responsivePosition"];
    responsiveTextAlign?: HeroSlideProps["responsiveTextAlign"];
  }[] = [
    {
      //   image: "/edpower/edpower-landing-hero.webp",
      image: "/ojol/wedison-bersama-ojol-desktop.webp",
      imageAlt: "EDPower in Gray",
      imageMobile: "/ojol/wedison-bersama-ojol-mobile.webp",
      // imageMobile: "/promotions/subsidi-8-jt-mobile.webp",

      cardMobile: "/edpower/edpower-landing-card-mobile.webp",
      //   title: t("edpower.productPage.hero.title"),
      title: "Wedison Bersama",
      titleHighlight: "Ojol",
      description: t("edpower.productPage.hero.description"),
      link: "/edpower/",
      position: "top-center",
      contentWidth: "wider",
      backgroundStyle: "object-cover md:object-[50%_50%] object-center",
      textAlign: "center",
      height: "screen",
      overlay: "none",
      theme: "dark",
      className:
        "w-[254px] h-[249px] lg:w-[781px] lg:h-[147px] md:w-full pt-8 md:pt-26 xl:pt-14 ",
    },
    {
      image: "/ojol/wedison-hero-sewa-harian.webp",
      imageAlt: "Athena in Gray",
      imageMobile: "/ojol/wedison-hero-sewa-harian-mobile.webp",
      cardMobile: "/athena/athena-landing-card-mobile.webp",
      // title: t("athena.productPage.hero.title"),
      // titleHighlight: "Ojol",
      // description: t("athena.productPage.hero.description"),
      link: "/athena/",
      contentWidth: "wider",
      textAlign: "center",
      height: "screen",
      position: "center",
      overlay: "none",
      theme: "dark",
      className: "w-full pt-0 sm:pt-8",
      responsivePosition: {
        mobile: "top-left",
        desktop: "center",
      },
      children: (
        <div>
          <div className=" flex w-full h-full ">
            <div className="flex-1 hidden sm:flex"></div>
            <div className="w-fit flex-col items-start justify-start gap-4">
              {/* <div className="flex w-[40%] flex-col items-start justify-start gap-4 bg-amber-200/40"> */}
              <h2 className="pr-6 lg:pr-16 text-lg font-semibold w-full text-start text-white text-shadow-[0px_1px_2px_rgb(0_0_0/_0.3)]">
                <span>Mulai dari</span>
                <br />
                <div className="text-[169px]/30 text-center font-extrabold text-primary ">
                  50K
                </div>
                <div className="text-2xl font-[900] text-end w-full pt-2 text-white">
                  /Hari
                </div>
                <div className=" flex flex-col justify-end items-end w-full  my-8 gap-1">
                  <p className=" text-5xl font-extrabold">SEWA HARIAN</p>
                  {/* <p>HARIAN</p> */}
                  <p className=" text-3xl font-semibold">#JadiLebihMudah</p>
                </div>
                <div className=" w-full flex justify-end ">
                  <a
                    href="#campaign"
                    className="w-full h-full flex justify-end cursor-pointer"
                    // target="_blank"
                  >
                    <Button
                      className=" w-[80%] font-semibold tracking-wider cursor-pointer text-2xl py-6 rounded-2xl shadow-[inset_0_2px_2px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.12)]
                             border-[1px] border-black/10
                              transition-all duration-200
                                hover:shadow-[inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_6px_rgba(0,0,0,0.18),0_8px_16px_rgba(0,0,0,0.16)]
                                active:translate-y-[1px]
                                active:shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)]
                            "
                      // className=" w-[80%] font-normal text-lg py-4 mx-auto bg-white/30 border-1 border-white text-white
                      // "
                    >
                      Coba Gratis!
                    </Button>
                  </a>
                </div>
              </h2>
            </div>
          </div>

          {/* <div className=" flex md:hidden w-full h-full">
            <div className="flex-1 flex"></div>
            <div className="w-fit flex-col items-start justify-start gap-4">
              <h2 className="pr-4 text-sm font-semibold w-full text-start text-white text-shadow-[0px_1px_2px_rgb(0_0_0/_0.3)]">
                <span>Mulai dari</span>
                <br />
                <div className="text-[100px]/20 text-center font-extrabold text-primary">
                  50K
                </div>
                <div className="text-lg font-[900] text-end w-full pt-1 text-white">
                  /Hari
                </div>
                <div className=" flex flex-col justify-end items-end w-full my-4 gap-1">
                  <p className=" text-3xl font-extrabold">SEWA HARIAN</p>
                  <p className=" text-xl font-semibold">#JadiLebihMudah</p>
                </div>
                <div className=" w-full flex justify-end ">
                  <a
                    href="#campaign"
                    className="w-full h-full flex justify-end cursor-pointer"
                  >
                    <Button
                      className=" w-[80%] font-semibold tracking-wider cursor-pointer text-lg py-4 rounded-xl shadow-[inset_0_2px_2px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.12)]
                             border-[1px] border-black/10
                              transition-all duration-200
                                hover:shadow-[inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_6px_rgba(0,0,0,0.18),0_8px_16px_rgba(0,0,0,0.16)]
                                active:translate-y-[1px]
                                active:shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)]
                            "
                    >
                      Coba Gratis!
                    </Button>
                  </a>
                </div>
              </h2>
            </div>
          </div> */}
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full">
      {/* Hero */}
      <div className="relative">
        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnFocusIn: false,
            }),
          ]}
          setApi={(api: CarouselApi) => {
            carouselApi.current = api;
            api?.on("select", () => setSelectedIndex(api.selectedScrollSnap()));
          }}
        >
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index} className="w-full">
                <HeroSlide
                  position={item.position}
                  contentWidth={item.contentWidth}
                  backgroundStyle={item.backgroundStyle}
                  textAlign={item.textAlign}
                  backgroundImage={item.image}
                  backgroundImageMobile={item.imageMobile}
                  title={item.title}
                  titleHighlight={item.titleHighlight}
                  description={item.description}
                  height={item.height}
                  variant={item.variant}
                  overlay={item.overlay}
                  theme={item.theme}
                  contentClassName={item.className}
                  responsivePosition={{ ...item.responsivePosition }}
                >
                  {item.children}
                </HeroSlide>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute top-1/2 left-2 sm:left-4 md:left-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-300/50 text-white hover:text-white hover:bg-gray-300/80" />
          <CarouselNext className="hidden md:flex absolute top-1/2 right-2 sm:right-4 md:right-6 z-10 -translate-y-1/2 rounded-none border-white outline-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-300/50 text-white hover:text-white hover:bg-gray-300/80" />
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 sm:gap-3">
            {items.map((_, index) => (
              <button
                key={index}
                className={`h-2.5 sm:h-3 rounded-full cursor-pointer overflow-hidden transition-all duration-300 ${
                  selectedIndex === index
                    ? "w-10 sm:w-12 bg-gray-400"
                    : "w-2.5 sm:w-3 bg-gray-400 hover:bg-gray-400/50"
                }`}
                onClick={() => carouselApi.current?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                {selectedIndex === index && (
                  <div
                    key={selectedIndex}
                    className="h-full bg-white rounded-full animate-[progress_4000ms_linear_forwards]"
                    style={{
                      animation: "progress 4000ms linear forwards",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </Carousel>
      </div>

      {/* Content */}
      <div className="py-8 w-full px-8 md:px-16 md:my-16 max-w-[2480px] mx-auto">
        {/* benefits */}
        <div className="w-full">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 md:mb-8">
            Narik Lebih Banyak, Kerja Lebih Efisien
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 md:mb-0 text-md md:text-xl">
            Bosen antre BBM? Capek mikirin biaya bensin yang makin mahal?
            Tenang, Wedison solusinya! Irit biaya operasional, gak perlu antre,
            dan perawatan lebih ringan. Waktunya upgrade cara narik kamu!
          </p>
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-0 md:gap-8 lg:gap-8 h-full">
            {/* <div className="w-full flex flex-wrap justify-between"> */}
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className=" aspect-square  w-[90%]  mx-auto lg:w-full rounded-lg overflow-hidden object-cover "
              >
                <Image
                  key={num}
                  className=" aspect-square object-cover w-full h-full bg-red-400 rounded-lg"
                  src={`/ojol/benefit-${num}.webp`}
                  width={1000}
                  height={1000}
                  // fill
                  alt="benefit"
                  // className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* hot campaign */}
        <div className="w-full" id="campaign">
          <h2 className="text-4xl md:text-6xl font-bold text-center my-8 md:my-16">
            Hot Campaign
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {campaignData.map((campaign) => (
              <div
                key={campaign.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Banner Image */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={campaign.image}
                    width={1000}
                    height={600}
                    alt={campaign.title}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    {/* <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                      PROMO
                    </span> */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      {campaign.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Tagline */}
                  <p className="text-primary font-semibold text-lg mb-2">
                    {campaign.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">{campaign.description}</p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Daftar Button */}
                    <Link
                      href={campaign.waLink}
                      target="_blank"
                      className="flex-1"
                    >
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Daftar Sekarang
                        </span>
                      </Button>
                    </Link>

                    {/* Lihat Detail Button */}
                    <Button
                      variant="outline"
                      onClick={() => setOpenDialog(campaign.id)}
                      className="flex-1 border-gray-300 hover:border-primary hover:bg-gray-50 font-semibold py-5 rounded-xl transition-all duration-300"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Lihat Detail
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Detail Dialog */}
      {openDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpenDialog(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

          {/* Dialog Content */}
          <div
            className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/80 text-white p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                    PROGRAM
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {campaignData.find((c) => c.id === openDialog)?.title}
                  </h3>
                  <p className="text-white/80 mt-1">
                    {campaignData.find((c) => c.id === openDialog)?.tagline}
                  </p>
                </div>
                <button
                  onClick={() => setOpenDialog(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
              {/* Scheme Section */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  Skema Pembayaran
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {campaignData
                    .find((c) => c.id === openDialog)
                    ?.scheme.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                      >
                        <p className="text-gray-500 text-sm">{item.label}</p>
                        <p className="text-gray-900 font-bold text-lg">
                          {item.value}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Benefits Section */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  Keuntungan
                </h4>
                <ul className="space-y-2">
                  {campaignData
                    .find((c) => c.id === openDialog)
                    ?.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Terms Section */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  Syarat & Ketentuan
                </h4>
                <ul className="space-y-2">
                  {campaignData
                    .find((c) => c.id === openDialog)
                    ?.terms.map((term, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 mt-0.5 flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700">{term}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <Link
                href={
                  campaignData.find((c) => c.id === openDialog)?.waLink || "#"
                }
                target="_blank"
                onClick={() => setOpenDialog(null)}
              >
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Daftar Program Ini Sekarang
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Supercharge Section */}
      <div className="w-full bg-white py-8 md:py-16 overflow-hidden border-1 border-b-gray-300 border-t-gray-300">
        <div className="max-w-[2480px] mx-auto px-8 md:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden">
                {/* Image Container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/super-charge/supercharge-hero.webp"
                    alt="Wedison Supercharge"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-block mb-4">
                <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
                  10% - 80% dalam 15 menit
                </span>
              </div>

              {/* Title Image */}
              <div className="mb-6">
                <Image
                  src="/super-charge/supercharge-typo-nobg.png"
                  alt="Supercharge"
                  width={400}
                  height={100}
                  className="h-16 md:h-20 lg:h-24 w-auto mx-auto lg:mx-0"
                />
                {/* <p className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-600 mt-2">
                  Penghasilan Kamu!
                </p> */}
              </div>

              {/* Description */}
              <p className="text-gray-500 text-md md:text-xl mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Waktu adalah uang, dan Supercharge bikin kamu gak buang-buang
                waktu! Cukup{" "}
                <span className="font-bold text-gray-700">15 menit</span> aja,
                baterai langsung terisi dari 10% ke 80%. Langsung gas narik
                lagi, gak perlu nunggu lama! Sekali charge bisa tempuh hingga
                165 km*. Lebih banyak orderan, cuan lebih banyak!
              </p>

              {/* Features List */}
              {/* <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                {[
                  { icon: "⚡", text: "Charging Cepat" },
                  { icon: "🛣️", text: "Jarak Tempuh 165 km*" },
                  { icon: "💰", text: "Hemat Waktu & Cuan" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors duration-300"
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-gray-700 text-sm font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div> */}

              {/* Disclaimer */}
              <p className="text-gray-400 text-xs mb-6 max-w-xl mx-auto lg:mx-0">
                *Jarak tempuh 165 km berlaku untuk model EdPro Extended Battery
              </p>

              {/* CTA Button */}
              <Link href="/super-charge">
                <Button
                  className="group relative px-8 py-6 text-lg font-semibold rounded-xl
                    bg-primary hover:bg-primary/90 text-white
                    shadow-lg hover:shadow-xl
                    transition-all duration-300
                    hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    Pelajari Lebih Lanjut
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Model Section */}
      <div className="w-full bg-gray-50 py-16 md:py-24">
        <div className="max-w-[2480px] mx-auto px-8 md:px-16">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Pilih Motor yang Cocok Buat Kamu
            </h2>
            <p className="text-gray-500 text-lg md:text-xl max-w-3xl mx-auto">
              Mau yang gesit buat gang sempit atau yang kuat buat jarak jauh?
              Wedison punya pilihan lengkap yang pas buat gaya narik kamu!
            </p>
          </div>

          {/* Model Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                name: "Bees",
                tagline: "Compact & Lincah",
                image: "/bees/bees-grey.webp",
                link: "/bees",
                specs: [
                  { label: "Jarak Tempuh", value: "80 km" },
                  { label: "Kecepatan Max", value: "55 km/h" },
                  { label: "Baterai", value: "1600Wh" },
                ],
                highlight: "Cocok buat gang sempit",
              },
              {
                name: "Victory",
                tagline: "Stylish & Bertenaga",
                image: "/victory/victory-grey.webp",
                link: "/victory",
                specs: [
                  { label: "Jarak Tempuh", value: "120 km*" },
                  { label: "SuperCharge", value: "15 menit" },
                  { label: "Motor", value: "3kW" },
                ],
                highlight: "Balance antara gaya & performa",
              },
              {
                name: "Athena",
                tagline: "Premium & Nyaman",
                image: "/athena/athena-grey.webp",
                link: "/athena",
                specs: [
                  { label: "Jarak Tempuh", value: "120 km*" },
                  { label: "SuperCharge", value: "15 menit" },
                  { label: "Motor", value: "2.5kW" },
                ],
                highlight: "Narik seharian tetap nyaman",
              },
              {
                name: "EdPower",
                tagline: "Tangguh & Jarak Jauh",
                image: "/edpower/edpower-black.webp",
                link: "/edpower",
                specs: [
                  { label: "Jarak Tempuh", value: "160 km*" },
                  { label: "SuperCharge", value: "15 menit" },
                  { label: "Motor", value: "3kW" },
                ],
                highlight: "Raja jarak jauh",
              },
            ].map((model, index) => (
              <div
                key={model.name}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden">
                  <Image
                    src={model.image}
                    alt={model.name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Highlight Badge */}
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {model.highlight}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Name & Tagline */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {model.name}
                    </h3>
                    <p className="text-primary font-medium">{model.tagline}</p>
                  </div>

                  {/* Specs */}
                  <div className="space-y-2 mb-6">
                    {model.specs.map((spec, specIndex) => (
                      <div
                        key={specIndex}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-500">{spec.label}</span>
                        <span className="font-semibold text-gray-800">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link href={model.link}>
                    <Button
                      variant="outline"
                      className="w-full group/btn border-gray-300 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Lihat Detail
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Footnote */}
          <p className="text-center text-gray-400 text-sm mt-8">
            *Jarak tempuh dengan Extended Battery
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 md:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-[2480px] mx-auto px-8 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
                Program Khusus Driver
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Siap Narik Lebih Cuan
              <br />
              <span className="text-primary">Bareng Wedison?</span>
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Gabung sekarang dan nikmati berbagai keuntungan eksklusif: sewa
              harian mulai 50K, charging cepat gratis, hingga program cicilan
              ringan. Yuk, upgrade cara narik kamu!
            </p>

            {/* Benefits List */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                "Sewa Harian Mulai 50K",
                "SuperCharge Gratis",
                "Cicilan Ringan",
                "Servis Prioritas",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2"
                >
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-sm font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href="https://wa.me/6282124657804?text=Halo%20Wedison,%20saya%20tertarik%20dengan%20program%20untuk%20driver%20ojol"
              target="_blank"
            >
              <Button
                className="group relative px-10 py-7 text-lg md:text-xl font-bold rounded-2xl
                  bg-primary hover:bg-primary/90 text-white
                  shadow-[0_0_30px_rgba(43,176,117,0.4)]
                  hover:shadow-[0_0_50px_rgba(43,176,117,0.6)]
                  transition-all duration-300
                  hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Hubungi Sales Wedison
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Button>
            </Link>

            {/* Trust Text */}
            <p className="text-gray-500 text-sm mt-6">
              Respon cepat, konsultasi gratis!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
