import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type Props = {
  open: boolean;
};

export default function NavbarCorporate({ open }: Props) {
  return (
    <>
      {/* desktop */}
      <div
        className={cn(
          " sticky top-0 left-0 w-full overflow-hidden bg-white md:transition-discrete duration-300 hidden md:flex justify-center items-center shadow-sm ",
          open
            ? "max-h-60 h-60 opacity-100 pointer-events-auto"
            : "max-h-0 pointer-events-none"
        )}
      >
        <div className="w-[50%] h-full flex justify-evenly items-center">
          <Link
            href="/corporate/about/"
            className=" text-2xl font-bold text-black px-4 underline"
          >
            About Us
          </Link>
          <Link
            href="/corporate/contact/"
            className=" text-2xl font-bold text-black px-4 underline"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}
