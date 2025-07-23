import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  open: boolean;
};

interface Product {
  name: string;
  image: string;
  href: string;
}

export default function NavbarProduct({ open }: Props) {
  const product: Product[] = [
    {
      name: "Mini",
      image: "/mini-green.webp",
      href: "/mini/",
    },
    {
      name: "Athena",
      image: "/athena-tosca.webp",
      href: "/testing-product/",
    },
    {
      name: "Victory",
      image: "/victory-lightblue.webp",
      href: "/victory/",
    },
    //     {
    //     name: "Dash",
    //     image: "/mini-grey.webp",
    //     href: "/mini/",
    // },
    {
      name: "EdPower",
      image: "/edpower-black.webp",
      href: "/edpower/",
    },
  ];
  return (
    <>
      {/* desktop */}
      <div
        // className={cn(
        //   "origin-top transition-all duration-300 transform hidden md:flex justify-center items-center shadow-sm bg-white w-full sticky top-0 left-0 z-50",
        //   open
        //     ? "scale-y-100 opacity-100 pointer-events-auto"
        //     : "scale-y-0 opacity-0 pointer-events-none"
        // )}
        className={cn(
          " sticky top-0 left-0 w-full overflow-hidden bg-white md:transition-discrete duration-300 hidden md:flex justify-center items-center shadow-sm ",
          open
            ? "max-h-60 h-60 opacity-100 pointer-events-auto"
            : "max-h-0 pointer-events-none"
        )}
      >
        {product.map((item, index) => (
          <div
            key={index}
            className={cn(
              `flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 lg:h-36 lg:w-36 h-20 w-20 mx-14`,
              item.name === "Victory" && "lg:h-36 lg:w-36 h-20 w-20"
            )}
          >
            <Link
              href={item.href}
              className="flex flex-col items-center justify-center "
            >
              <p className=" w-full text-center text-lg font-bold tracking-widest">
                {/* {item.name} */}
                {item.name.toUpperCase()}
              </p>

              <div className="overflow-hidden w-34 h-34 items-center justify-center flex">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={1000}
                  height={1000}
                  className={
                    item.name === "Victory"
                      ? "lg:h-36 lg:w-36 h-20 w-20 object-contain scale-[1.05] object-[100%_40%] "
                      : "object-contain lg:h-32 lg:w-32 h-20 w-20"
                  }
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
