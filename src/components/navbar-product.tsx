import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { forwardRef } from "react";

type Props = {
  open: boolean;
};

interface Product {
  name: string;
  image: string;
  href: string;
}

const NavbarProduct = forwardRef<HTMLDivElement, Props>(
  ({ open }: Props, ref) => {
    // export default function NavbarProduct({ open, ref }: Props) {
    const product: Product[] = [
      {
        name: "Bees",
        image: "/navbar-product/bees.webp",
        // image: "/bees-green.webp",
        href: "/bees/",
      },
      {
        name: "Athena",
        image: "/navbar-product/athena.webp",
        // image: "/athena-tosca.webp",
        href: "/athena/",
      },
      {
        name: "Victory",
        image: "/navbar-product/victory.webp",
        // image: "/victory-lightblue.webp",
        href: "/victory/",
      },
      //     {
      //     name: "Dash",
      //     image: "/mini-grey.webp",
      //     href: "/mini/",
      // },
      {
        name: "EdPower",
        image: "/navbar-product/edpower.webp",
        // image: "/edpower-black.webp",
        href: "/edpower/",
      },
    ];
    return (
      <>
        {/* desktop */}
        {/* <div
        className={cn(
          " sticky top-0 left-0 w-full overflow-hidden bg-card md:transition-discrate duration-300 hidden md:flex justify-center items-center shadow-sm ",
          open
            ? "max-h-60 h-60 opacity-100 pointer-events-auto"
            : "max-h-0 pointer-events-none"
        )} */}
        <div
          ref={ref}
          className={cn(
            "sticky top-0 left-0 w-full overflow-hidden bg-card flex md:flex justify-center items-center shadow-sm transition-all duration-300",
            open
              ? "max-h-60 h-60 opacity-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          )}
          // className={cn(
          //   "sticky top-0 left-0 w-full overflow-hidden bg-card transform origin-top transition-all duration-300 hidden md:flex justify-center items-center shadow-sm",
          //   open
          //     ? "opacity-100 scale-y-100 pointer-events-auto"
          //     : "opacity-0 scale-y-0 pointer-events-none"
          // )}
        >
          {product.map((item, index) => (
            <div
              key={index}
              className={cn(
                `flex flex-col items-center justify-center  hover:scale-105 transition-all duration-300 lg:h-36 lg:w-36 h-20 w-20 mx-14`,
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
                    width={128}
                    height={128}
                    sizes="(max-width: 1024px) 80px, 128px"
                    className={"object-contain lg:h-32 lg:w-32 h-20 w-20"}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </>
    );
  }
);

NavbarProduct.displayName = "NavbarProduct";

export default NavbarProduct;
