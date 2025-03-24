import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, MenuIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <div className=" w-full bg-white border-b-[1px] flex justify-center sticky top-0 z-50 shadow-2xs shadow-gray-700">
      <div
        className=" max-w-[1200px] w-full h-full p-4 flex justify-between
      items-center"
      >
        <div>
          <Image
            src="https://wedison.co/wp-content/uploads/2024/10/WEDISON-LOGO-01-edited-300x192.png"
            alt="Vercel Logo"
            width={100}
            height={100}
          />
        </div>
        <div className="hidden min-sm:flex justify-between *:flex *:gap-1 gap-5 *:font-extralight mx-2">
          <div>
            Electric Motorcycles <ChevronDown width={15} />
          </div>
          <div>
            Experience Center <ChevronDown width={15} />
          </div>
          <div>
            Super Charge <ChevronDown width={15} />
          </div>
          <div>
            Corporate <ChevronDown width={15} />
          </div>
        </div>
        <div>
          <div className="bg-green-400 text-white rounded-4xl py-2 px-4 hidden min-[400px]:flex">
            Book A Test Ride <ChevronRight width={25} />
          </div>
        </div>
        <div className=" min-sm:hidden">
          <MenuIcon />
        </div>
        <Button>EKI FIKRIL</Button>
      </div>
    </div>
  );
}
