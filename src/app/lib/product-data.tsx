/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { carouselData } from "../testing-product/peek";

interface overview {
  imageUrl: string;
  imageAlt: string;
  className?: string;
  title: string;
  desc: string;
}
interface TechSpecItem {
  title: string;
  unit?: string;
  desc: any;
}

interface ProductData {
  hero: {
    imageUrl: string;
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

export default function getProductData(bikeType: string) {
  const mini: ProductData = {
    hero: {
      imageUrl: "/mini-hero.webp",
      imageAlt: "Mini Hero",
      className: "object-100%_0% object-cover w-full ",
      title: "Mini",
      desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum tenetur placeat libero asperiores impedit facere atque,",
    },
    techSpec: [
      {
        title: "357",
        unit: "mi",
        desc: "Range (EPA est.)",
      },
      {
        title: "182",
        unit: "mi",
        desc: "Charge in 15 min",
      },
      {
        title: "FSD",
        desc: (
          <>
            Full Self-Driving {"(Supervised)"} <br /> Comptatible
          </>
        ),
      },
    ],
    productOverview: {
      imageUrl: "/mini-hero.webp",
      imageAlt: "Mini Hero",
      className: "object-100%_0% object-cover w-full ",
      title: "Even Quieter",
      desc: "  An updated wheel and tire package offers a smoother driving experience. Redesigned body castings reduce parts from 70 to 1 for fewer gaps. All to create a whisper-quiet ride.",
    },
    productHighlight: [
      {
        image: "/mini-hero.webp",
        alt: "Mini Hero",
        title: "Even Quieter",
        desc: "  An updated wheel and tire package offers a smoother driving experience. Redesigned body castings reduce parts from 70 to 1 for fewer gaps. All to create a whisper-quiet ride.",
      },
      {
        image: "/edmax-hero.webp",
        alt: "Edmax Hero",
        className: "object-100%_0% object-cover w-full ",
        title: "Even Quieter",
        desc: "  An updated wheel and tire package offers a smoother driving experience. Redesigned body castings reduce parts from 70 to 1 for fewer gaps. All to create a whisper-quiet ride.",
      },
      {
        image: "/athena-hero.webp",
        alt: "Athena Hero",
        title: "Even Quieter",
        desc: "  An updated wheel and tire package offers a smoother driving experience. Redesigned body castings reduce parts from 70 to 1 for fewer gaps. All to create a whisper-quiet ride.",
      },
    ],
    chargingOverview: {
      imageUrl: "/mini-hero.webp",
      imageAlt: "Mini Hero",
      className: "object-100%_0% object-cover w-full ",
      title: "Even Quieter",
      desc: "  An updated wheel and tire package offers a smoother driving experience. Redesigned body castings reduce parts from 70 to 1 for fewer gaps. All to create a whisper-quiet ride.",
    },
    chargingHighlight: [
      {
        image: "/supercharge-chip.webp",
        alt: "SuperCharge",
        className: "object-[10%_10%] object-cover w-full",
        title: "SuperCharge",
        desc: (
          <>
            Experience lightning-fast charging with our advanced SuperCharge
            technology, designed to keep you on the road with charge your
            battery from 10% to 80% in just 15 Minutes.{" "}
            <Link href="/super-charge" className="underline text-primary">
              Learn More
            </Link>
          </>
        ),
      },
      {
        image: "/supercharge-hero.webp",
        alt: "Home Charging",
        className: "object-[100%_40%] object-cover w-full",
        title: "Home Charging",
        desc: (
          <>
            Enjoy the convenience of charging your vehicle at home, where you
            can fully charge your EdPower in just 4 hours, ensuring it&apos;s
            ready whenever you are.
          </>
        ),
      },
    ],
  };
  const athena: ProductData = {
    hero: {
      imageUrl: "/athena-hero2.webp",
      imageAlt: "Mini Hero",
      className: "object-100%_0% object-cover w-full ",
      title: "ATHENA",
      desc: "Gaya Retro, Tenaga Masa Kini",
    },
    techSpec: [
      {
        title: "357",
        unit: "mi",
        desc: "Range (EPA est.)",
      },
      {
        title: "182",
        unit: "mi",
        desc: "Charge in 15 min",
      },
      {
        title: "FSD",
        desc: (
          <>
            Full Self-Driving {"(Supervised)"} <br /> Comptatible
          </>
        ),
      },
    ],
    productOverview: {
      imageUrl: "/mini-hero.webp",
      imageAlt: "Mini Hero",
      className: "object-100%_0% object-cover w-full ",
      title: "Timeless Elegance, Recharged",
      desc: "Athena by Wedison combines timeless European scooter elegance with cutting-edge electric technology. Designed to stand out while staying quiet, Athena brings a fresh sophistication to city streets—delivering smooth, silent rides with every journey. With up to 100 km range per charge, robust CBS disc brakes, and advanced hydraulic suspension, Athena isn’t just a ride. It’s an experience, crafted for those who crave effortless style and next-generation performance. Fast-charge at any Wedison showroom or enjoy convenient home charging—Athena adapts perfectly to your modern lifestyle.",
    },
    productHighlight: [
      {
        image: "/mini-hero.webp",
        alt: "Mini Hero",
        title: "Effortless Control",
        desc: " Navigate with confidence using Athena’s modern LCD instrument cluster—clear, bright, and intuitive, giving you all the info you need at a glance. Experience digital connectivity that puts you in control, every moment of the ride.",
      },
      {
        image: "/edmax-hero.webp",
        alt: "Edmax Hero",
        className: "object-100%_0% object-cover w-full ",
        title: "Super Charge",
        desc: "Power up from 10% to 80% in just 15 minutes with Wedison Super Charge (available at all showrooms), or conveniently charge at home with a full charge in under 4 hours. Athena is engineered for the non-stop city pace.",
      },
      {
        image: "/athena-hero.webp",
        alt: "Athena Hero",
        title: "Designed for the City",
        desc: "With CBS disc brakes front and rear, plus a stable wide-tire setup, Athena offers agile handling and confident braking—so you can move through city streets with poise, comfort, and unmistakable style.",
      },
    ],
    chargingOverview: {
      imageUrl: "/mini-hero.webp",
      imageAlt: "Mini Hero",
      className: "object-100%_0% object-cover w-full ",
      title: "Charging Made Effortless",
      desc: "Stay in motion with Athena’s flexible charging solutions. Plug in at home for everyday convenience, or experience rapid Super Charge at any Wedison showroom. Athena gives you the freedom to choose—charge where you live, or power up fast when you're on the go.",
    },
    chargingHighlight: [
      {
        image: "/supercharge-chip.webp",
        alt: "SuperCharge",
        className: "object-[10%_10%] object-cover w-full",
        title: "15-Minute Super Charge",
        desc: (
          <>
            Experience lightning-fast charging with our advanced SuperCharge
            technology, designed to keep you on the road with charge your
            battery from 10% to 80% in just 15 Minutes.{" "}
            <Link href="/super-charge" className="underline text-primary">
              Learn More
            </Link>
          </>
        ),
      },
      {
        image: "/supercharge-hero.webp",
        alt: "Home Charging",
        className: "object-[100%_40%] object-cover w-full",
        title: "Convenient Home Charging",
        desc: (
          <>
            Charge overnight, or anytime it suits you. Athena&apos;s included
            home charger delivers a full battery in under four hours—seamless,
            silent, and ready when you are.
          </>
        ),
      },
    ],
  };
  switch (bikeType) {
    case "mini":
      return mini;
    case "edpower":
      return mini;
    case "athena":
      return athena;
    case "victory":
      return mini;
    default:
      return null;
  }
}
