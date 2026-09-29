/* eslint-disable @typescript-eslint/no-explicit-any */
import { carouselData } from "../_product/peek";
import { useLanguage } from "./language-context";

interface overview {
  imageUrl: string;
  imageUrlMobile?: string;
  imageAlt: string;
  className?: string;
  title: string;
  desc: string;
}
interface TechSpecItem {
  title: string | number;
  unit?: string;
  desc: any;
}

interface ProductData {
  hero: {
    imageUrl: string;
    imageUrlMobile?: string;
    imageAlt: string;
    className?: string;
    title: string;
    desc: string;
  };
  techSpec: [TechSpecItem, TechSpecItem, TechSpecItem];
  productOverview: overview;
  productHighlight: carouselData[];
  chargingOverview?: overview;
  chargingHighlight?: carouselData[];
}

export default function GetProductData(bikeType: string) {
  const { t } = useLanguage();
  // const mini: ProductData = {
  //   hero: {
  //     // imageUrl: "/edpower-hero1.webp",
  //     imageUrl: "/mini-hero1.webp",
  //     imageAlt: t("mini.productPage.hero.imageAlt"),
  //     imageUrlMobile: "/mini-heroMobile.webp",
  //     className: "object-100%_0% object-cover w-full ",
  //     title: t("mini.productPage.hero.title"),
  //     desc: t("mini.productPage.hero.description"),
  //   },
  //   techSpec: [
  //     {
  //       title: t("mini.productPage.techSpecs1.title"),
  //       unit: t("mini.productPage.techSpecs1.unit"),
  //       desc: t("mini.productPage.techSpecs1.desc"),
  //     },
  //     {
  //       title: t("mini.productPage.techSpecs2.title"),
  //       desc: t("mini.productPage.techSpecs2.desc"),
  //       unit:
  //         t("mini.productPage.techSpecs2.unit") !==
  //         "mini.productPage.techSpecs2.unit"
  //           ? t("mini.productPage.techSpecs2.unit")
  //           : "",
  //     },
  //     {
  //       title: t("mini.productPage.techSpecs3.title"),
  //       desc: t("mini.productPage.techSpecs3.desc"),
  //       unit: t("mini.productPage.techSpecs3.unit"),
  //     },
  //   ],
  //   productOverview: {
  //     imageUrl: "/mini-ProductOverview.webp",
  //     imageAlt: t("mini.productPage.productOverview.imageAlt"),
  //     className: "object-100%_0% object-cover w-full ",
  //     title: t("mini.productPage.productOverview.title"),
  //     desc: t("mini.productPage.productOverview.description"),
  //   },
  //   productHighlight: [
  //     {
  //       image: "/mini-ProductCard1.webp",
  //       alt: t("mini.productPage.productHighlight1.imageAlt"),
  //       title: t("mini.productPage.productHighlight1.title"),
  //       desc: t("mini.productPage.productHighlight1.description"),
  //     },
  //     {
  //       image: "/mini-ProductCard2.webp",
  //       className: "object-100%_0% object-cover w-full ",
  //       alt: t("mini.productPage.productHighlight2.imageAlt"),
  //       title: t("mini.productPage.productHighlight2.title"),
  //       desc: t("mini.productPage.productHighlight2.description"),
  //     },
  //     {
  //       image: "/mini-ProductCard3.webp",
  //       alt: t("mini.productPage.productHighlight3.imageAlt"),
  //       title: t("mini.productPage.productHighlight3.title"),
  //       desc: t("mini.productPage.productHighlight3.description"),
  //     },
  //   ],
  //   chargingOverview: {
  //     imageUrl: "/mini-ChargingOverview.webp",
  //     imageAlt: t("mini.productPage.chargingOverview.imageAlt"),
  //     className: "object-100%_0% object-cover w-full ",
  //     title: t("mini.productPage.chargingOverview.title"),
  //     desc: t("mini.productPage.chargingOverview.description"),
  //   },
  // };
  // const athena: ProductData = {
  //   hero: {
  //     imageUrl: "/athena-hero2.webp",
  //     imageUrlMobile: "/athena-hero2mobile.webp",
  //     imageAlt: t(`athena.productPage.hero.imageAlt`),
  //     className: "object-100%_0% object-cover w-full ",
  //     title: t(`athena.productPage.hero.title`),
  //     desc: t(`athena.productPage.hero.description`),
  //   },
  //   techSpec: [
  //     {
  //       title: t(`athena.productPage.techSpecs1.title`),
  //       unit: t(`athena.productPage.techSpecs1.unit`),
  //       desc: t(`athena.productPage.techSpecs1.desc`),
  //     },
  //     {
  //       title: t(`athena.productPage.techSpecs2.title`),
  //       unit: t(`athena.productPage.techSpecs2.unit`),
  //       desc: t(`athena.productPage.techSpecs2.desc`),
  //     },
  //     {
  //       title: t(`athena.productPage.techSpecs3.title`),
  //       unit: t(`athena.productPage.techSpecs3.unit`),
  //       desc: t(`athena.productPage.techSpecs3.desc`),
  //     },
  //   ],
  //   productOverview: {
  //     imageUrl: "/athena-overview3.webp",
  //     imageUrlMobile: "/athena-overview3.webp",
  //     // imageUrlMobile: "/athena-overviewMobile.webp",
  //     imageAlt: t(`athena.productPage.productOverview.imageAlt`),
  //     className: "object-100%_0% object-cover w-full ",
  //     title: t(`athena.productPage.productOverview.title`),
  //     desc: t(`athena.productPage.productOverview.description`),
  //   },
  //   productHighlight: [
  //     {
  //       image: "/athena-ProductCard1.webp",
  //       imageMobile: "/athena-ProductCard1.webp",
  //       alt: t(`athena.productPage.productHighlight1.imageAlt`),
  //       title: t(`athena.productPage.productHighlight1.title`),
  //       desc: t(`athena.productPage.productHighlight1.description`),
  //     },
  //     {
  //       image: "/athena-ProductCard2.webp",
  //       alt: "Edmax Hero",
  //       className: "object-100%_0% object-cover w-full ",
  //       title: t(`athena.productPage.productHighlight2.title`),
  //       desc: t(`athena.productPage.productHighlight2.description`),
  //     },
  //     {
  //       image: "/athena-productCard3.webp",
  //       alt: t(`athena.productPage.productHighlight3.imageAlt`),
  //       title: t(`athena.productPage.productHighlight3.title`),
  //       desc: t(`athena.productPage.productHighlight3.description`),
  //     },
  //   ],
  //   chargingOverview: {
  //     imageUrl: "/athena-ChargingOverview.webp",
  //     imageAlt: t(`athena.productPage.chargingOverview.imageAlt`),
  //     className: "object-100%_0% object-cover w-full ",

  //     title: t(`athena.productPage.chargingOverview.title`),
  //     desc: t(`athena.productPage.chargingOverview.description`),
  //   },
  //   chargingHighlight: [
  //     {
  //       image: "/athena-ChargingCard1.webp",
  //       alt: t(`athena.productPage.chargingHighlight1.imageAlt`),
  //       className: "object-[10%_10%] object-cover w-full",
  //       title: t(`athena.productPage.chargingHighlight1.title`),
  //       desc: t(`athena.productPage.chargingHighlight1.description`),
  //     },
  //     {
  //       image: "/athena-ChargingCard2.webp",
  //       alt: t(`athena.productPage.chargingHighlight2.imageAlt`),
  //       className: "object-[100%_40%] object-cover w-full",
  //       title: t(`athena.productPage.chargingHighlight2.title`),
  //       desc: t(`athena.productPage.chargingHighlight2.description`),
  //     },
  //   ],
  // };
  // const victory: ProductData = {
  //   hero: {
  //     imageUrl: "/victory-hero1.webp",
  //     // imageUrlMobile: "/athena-hero2mobile.webp",
  //     imageAlt: t(`victory.productPage.hero.imageAlt`),
  //     imageUrlMobile: "/victory-heroMobile.webp",
  //     className: "object-100%_0% object-cover w-full ",
  //     title: t(`victory.productPage.hero.title`),
  //     desc: t(`victory.productPage.hero.description`),
  //   },
  //   techSpec: [
  //     {
  //       title: t(`athena.productPage.techSpecs1.title`),
  //       unit: t(`athena.productPage.techSpecs1.unit`),
  //       desc: t(`athena.productPage.techSpecs1.desc`),
  //     },
  //     {
  //       title: t(`athena.productPage.techSpecs2.title`),
  //       unit: t(`athena.productPage.techSpecs2.unit`),
  //       desc: t(`athena.productPage.techSpecs2.desc`),
  //     },
  //     {
  //       title: t(`athena.productPage.techSpecs3.title`),
  //       unit: t(`athena.productPage.techSpecs3.unit`),
  //       desc: t(`athena.productPage.techSpecs3.desc`),
  //     },
  //   ],
  //   productOverview: {
  //     imageUrl: "/victory-ProductOverview.webp",
  //     // imageUrlMobile: "/athena-overview3.webp",
  //     // imageUrlMobile: "/athena-overviewMobile.webp",
  //     imageAlt: t(`victory.productPage.productOverview.imageAlt`),
  //     className: "object-100%_0% object-cover w-full ",
  //     title: t(`victory.productPage.productOverview.title`),
  //     desc: t(`victory.productPage.productOverview.description`),
  //   },
  //   productHighlight: [
  //     {
  //       image: "/victory-ProductHighlight1.webp",
  //       // imageMobile: "/athena-ProductCard1.webp",
  //       alt: t(`victory.productPage.productHighlight1.imageAlt`),
  //       title: t(`victory.productPage.productHighlight1.title`),
  //       desc: t(`victory.productPage.productHighlight1.description`),
  //     },
  //     {
  //       image: "/victory-ProductHighlight2.webp",
  //       alt: "Edmax Hero",
  //       className: "object-100%_0% object-cover w-full ",
  //       title: t(`victory.productPage.productHighlight2.title`),
  //       desc: t(`victory.productPage.productHighlight2.description`),
  //     },
  //     {
  //       image: "/victory-ProductHighlight3.webp",
  //       alt: t(`victory.productPage.productHighlight3.imageAlt`),
  //       title: t(`victory.productPage.productHighlight3.title`),
  //       desc: t(`victory.productPage.productHighlight3.description`),
  //     },
  //   ],
  //   chargingOverview: {
  //     imageUrl: "/athena-ChargingOverview.webp",
  //     imageAlt: t(`victory.productPage.chargingOverview.imageAlt`),
  //     className: "object-100%_0% object-cover w-full ",

  //     title: t(`victory.productPage.chargingOverview.title`),
  //     desc: t(`victory.productPage.chargingOverview.description`),
  //   },
  //   chargingHighlight: [
  //     {
  //       image: "/athena-ChargingCard1.webp",
  //       alt: t(`victory.productPage.chargingHighlight1.imageAlt`),
  //       className: "object-[10%_10%] object-cover w-full",
  //       title: t(`victory.productPage.chargingHighlight1.title`),
  //       desc: t(`victory.productPage.chargingHighlight1.description`),
  //     },
  //     {
  //       image: "/athena-ChargingCard2.webp",
  //       alt: t(`victory.productPage.chargingHighlight2.imageAlt`),
  //       className: "object-[100%_40%] object-cover w-full",
  //       title: t(`victory.productPage.chargingHighlight2.title`),
  //       desc: t(`victory.productPage.chargingHighlight2.description`),
  //     },
  //   ],
  // };

  const product: ProductData = {
    hero: {
      imageUrl: `/${bikeType}/${bikeType}-product-hero.webp`,

      imageAlt: t(`${bikeType}.productPage.hero.imageAlt`),
      imageUrlMobile: `/${bikeType}/${bikeType}-product-hero-mobile.webp`,
      className: "object-100%_0% object-cover w-full ",
      title: t(`${bikeType}.productPage.hero.title`),
      desc: t(`${bikeType}.productPage.hero.description`),
    },
    techSpec: [
      {
        title: t(`${bikeType}.productPage.techSpecs1.title`),
        unit: t(`${bikeType}.productPage.techSpecs1.unit`),
        desc: t(`${bikeType}.productPage.techSpecs1.desc`),
      },
      {
        title: t(`${bikeType}.productPage.techSpecs2.title`),
        desc: t(`${bikeType}.productPage.techSpecs2.desc`),
        ...(bikeType !== "bees" && {
          unit: t(`${bikeType}.productPage.techSpecs2.unit`),
        }),
      },
      {
        title: t(`${bikeType}.productPage.techSpecs3.title`),
        unit: t(`${bikeType}.productPage.techSpecs3.unit`),
        desc: t(`${bikeType}.productPage.techSpecs3.desc`),
      },
    ],
    productOverview: {
      imageUrl: `/${bikeType}/${bikeType}-product-overview.webp`,
      imageUrlMobile: `/${bikeType}/${bikeType}-product-overview-mobile.webp`,
      imageAlt: t(`${bikeType}.productPage.productOverview.imageAlt`),
      className: "object-100%_0% object-cover w-full ",
      title: t(`${bikeType}.productPage.productOverview.title`),
      desc: t(`${bikeType}.productPage.productOverview.description`),
    },
    productHighlight: [
      {
        image: `/${bikeType}/${bikeType}-product-card1.webp`,
        imageMobile: `/${bikeType}/${bikeType}-product-card1-mobile.webp`,
        alt: t(`${bikeType}.productPage.productHighlight1.imageAlt`),
        title: t(`${bikeType}.productPage.productHighlight1.title`),
        desc: t(`${bikeType}.productPage.productHighlight1.description`),
      },
      {
        image: `/${bikeType}/${bikeType}-product-card2.webp`,
        alt: "Edmax Hero",
        imageMobile: `/${bikeType}/${bikeType}-product-card2-mobile.webp`,

        className: "object-100%_0% object-cover w-full ",
        title: t(`${bikeType}.productPage.productHighlight2.title`),
        desc: t(`${bikeType}.productPage.productHighlight2.description`),
      },
      {
        image: `/${bikeType}/${bikeType}-product-card3.webp`,
        imageMobile: `/${bikeType}/${bikeType}-product-card3-mobile.webp`,

        alt: t(`${bikeType}.productPage.productHighlight3.imageAlt`),
        title: t(`${bikeType}.productPage.productHighlight3.title`),
        desc: t(`${bikeType}.productPage.productHighlight3.description`),
      },
      ...(bikeType == "edpower"
        ? [
            {
              image: `/${bikeType}/${bikeType}-product-card4.webp`,
              alt: "Edmax Hero",
              imageMobile: `/${bikeType}/${bikeType}-product-card4-mobile.webp`,

              className: "object-100%_0% object-cover w-full ",
              title: t(`${bikeType}.productPage.productHighlight4.title`),
              desc: t(`${bikeType}.productPage.productHighlight4.description`),
            },
          ]
        : []),
    ],
    chargingOverview: {
      imageUrl: `/${bikeType}/${bikeType}-charging-overview.webp`,
      imageUrlMobile: `/${bikeType}/${bikeType}-charging-overview-mobile.webp`,
      imageAlt: t(`${bikeType}.productPage.chargingOverview.imageAlt`),
      className: "object-100%_0% object-cover w-full ",
      title: t(`${bikeType}.productPage.chargingOverview.title`),
      desc: t(`${bikeType}.productPage.chargingOverview.description`),
    },
    ...(bikeType !== "bees" && {
      chargingHighlight: [
        {
          image: `/${bikeType}/${bikeType}-charging-card1.webp`,
          imageMobile: `/${bikeType}/${bikeType}-charging-card1-mobile.webp`,
          alt: t(`${bikeType}.productPage.chargingHighlight1.imageAlt`),
          className: "object-center object-cover w-full",
          title: t(`${bikeType}.productPage.chargingHighlight1.title`),
          desc: t(`${bikeType}.productPage.chargingHighlight1.description`),
        },
        {
          image: `/${bikeType}/${bikeType}-charging-card2.webp`,
          imageMobile: `/${bikeType}/${bikeType}-charging-card2-mobile.webp`,

          alt: t(`${bikeType}.productPage.chargingHighlight2.imageAlt`),
          className: "object-center object-cover w-full",
          title: t(`${bikeType}.productPage.chargingHighlight2.title`),
          desc: t(`${bikeType}.productPage.chargingHighlight2.description`),
        },
      ],
    }),
  };
  // switch (bikeType) {
  //   case "mini":
  //     return mini;
  //   case "edpower":
  //     return mini;
  //   case "athena":
  //     return athena;
  //   case "victory":
  //     return victory;
  //   default:
  //     return null;
  // }
  return product;
}
