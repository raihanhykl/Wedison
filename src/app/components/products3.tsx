"use client";

import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Battery, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";
import Image from "next/image";
import Link from "next/link";

export default function Products() {
  const { t } = useLanguage();
  // const { t, language } = useLanguage();

  // Convert miles to kilometers for Indonesian language
  const convertDistance = (miles: number) => {
    // if (language === "id") {
    return Math.round(miles * 1.60934);
    // }
    // return miles;
  };

  // Convert mph to km/h for Indonesian language
  const convertSpeed = (mph: number) => {
    // if (language === "id") {
    return Math.round(mph * 1.60934);
    // }
    // return mph;
  };

  const products = [
    {
      name: "Mini",
      description: "Compact urban commuter with nimble handling",
      specs: [
        {
          icon: <Battery className="h-4 w-4" />,
          text: `${t("products.range")}: ${convertDistance(37)} ${t(
            "products.miles"
          )}`,
        },
        {
          icon: <Gauge className="h-4 w-4" />,
          text: `${t("products.topSpeed")}: ${convertSpeed(34)} ${t(
            "products.mph"
          )}`,
        },
      ],
      image: "/mini-hero.webp",
    },
    // {
    //   name: "Mini-Pro",
    //   description: "Enhanced urban commuter with extended range",
    //   specs: [
    //     {
    //       icon: <Battery className="h-4 w-4" />,
    //       text: `${t("products.range")}: ${convertDistance(150)} ${t(
    //         "products.miles"
    //       )}`,
    //     },
    //     {
    //       icon: <Gauge className="h-4 w-4" />,
    //       text: `${t("products.topSpeed")}: ${convertSpeed(85)} ${t(
    //         "products.mph"
    //       )}`,
    //     },
    //   ],
    //   image: "/placeholder.svg?height=300&width=400",
    // },
    {
      name: "Athena",
      description: "Elegant design with premium comfort features",
      specs: [
        {
          icon: <Battery className="h-4 w-4" />,
          text: `${t("products.range")}: ${convertDistance(62)} ${t(
            "products.miles"
          )}`,
        },
        {
          icon: <Gauge className="h-4 w-4" />,
          text: `${t("products.topSpeed")}: ${convertSpeed(46)} ${t(
            "products.mph"
          )}`,
        },
      ],
      image: "/athena-feature1.webp",
    },
    {
      name: "Victory",
      description: "Sport performance with advanced handling",
      specs: [
        {
          icon: <Battery className="h-4 w-4" />,
          text: `${t("products.range")}: ${convertDistance(62)} ${t(
            "products.miles"
          )}`,
        },
        {
          icon: <Gauge className="h-4 w-4" />,
          text: `${t("products.topSpeed")}: ${convertSpeed(49)} ${t(
            "products.mph"
          )}`,
        },
      ],
      image: "/victory-hero.webp",
    },
    {
      name: "Dash",
      description: "Lightweight and agile for urban delivery",
      specs: [
        {
          icon: <Battery className="h-4 w-4" />,
          text: `${t("products.range")}: ${convertDistance(62)} ${t(
            "products.miles"
          )}`,
        },
        {
          icon: <Gauge className="h-4 w-4" />,
          text: `${t("products.topSpeed")}: ${convertSpeed(49)} ${t(
            "products.mph"
          )}`,
        },
      ],
      image: "/dash-hero.webp",
    },
    {
      name: "EdPower",
      description: "Flagship model with ultimate performance",
      specs: [
        {
          icon: <Battery className="h-4 w-4" />,
          text: `${t("products.range")}: ${convertDistance(49)} ${t(
            "products.miles"
          )}`,
        },
        {
          icon: <Gauge className="h-4 w-4" />,
          text: `${t("products.topSpeed")}: ${convertSpeed(52)} ${t(
            "products.mph"
          )}`,
        },
      ],
      image: "/edmax-chatgpt.webp",
    },
  ];

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className="py-16 md:py-20 lg:py-24 bg-gray-50"
      id="products"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block px-4 py-1 mb-4 border border-teal-200 rounded-full bg-teal-50 text-teal-600">
            <span className="text-sm font-medium">{t("products.tag")}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            {t("products.title")}{" "}
            <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent relative">
              {t("products.titleHighlight")}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t("products.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <Link key={index} href={`/${product.name.toLowerCase()}`}>
              <div
                key={index}
                className={cn(
                  "bg-white rounded-xl overflow-hidden shadow-soft transition-all duration-700 transform group hover:shadow-soft-lg hover:-translate-y-1",
                  inView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                )}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="h-auto  aspect-auto bg-gray-100 relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={`Wedison ${product.name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    height={1000}
                    width={1500}
                  />

                  {/* Product name overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-xl font-bold text-white">
                      {product.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 sm:p-5 md:p-6">
                  <p className="text-gray-600 mb-4">{product.description}</p>

                  <div className="flex flex-col space-y-2 mb-6">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="flex items-center text-gray-700">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 mr-2 text-teal-500">
                          {spec.icon}
                        </div>
                        <span className="text-sm">{spec.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-between items-center">
                    <Button
                      variant="outline"
                      className="text-[var(--outline-foreground)] transition-all duration-300 text-sm sm:text-base px-3 sm:px-4"
                    >
                      {/* <Link href={`/${product.name.toLowerCase()}`}> */}
                      {t("products.learnMore")}
                      {/* </Link> */}
                    </Button>

                    {/* <Button className=" text-white group transition-all duration-300 text-sm sm:text-base px-3 sm:px-4">
                    {t("products.orderNow")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button> */}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
