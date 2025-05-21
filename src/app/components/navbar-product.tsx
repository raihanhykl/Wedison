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
      image: "/mini-grey.webp",
      href: "/mini/",
    },
    {
      name: "Athena",
      image: "/athena-beige.webp",
      href: "/athena/",
    },
    {
      name: "Victory",
      image: "/victory-grey.webp",
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
        className={cn(
          " sticky top-0 left-0 w-full overflow-hidden bg-white md:transition-discrete duration-300 hidden md:flex justify-center items-center shadow-sm ",
          // open ? "block h-16" : "hidden"
          open ? "max-h-60 h-60 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {product.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 lg:h-32 lg:w-32 h-20 w-20 mx-14"
          >
            <Link
              href={item.href}
              className="flex flex-col items-center justify-center "
            >
              <p className=" w-full text-center text-lg font-bold tracking-widest">
                {/* {item.name} */}
                {item.name.toUpperCase()}
              </p>

              <Image
                src={item.image}
                alt={item.name}
                width={1000}
                height={1000}
                className="lg:h-32 lg:w-32 h-20 w-20"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* mobile */}
    </>
  );
}
