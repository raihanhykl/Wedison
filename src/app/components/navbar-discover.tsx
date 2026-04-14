import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { forwardRef } from "react";
import { useLanguage } from "../lib/language-context";

type Props = {
  open: boolean;
};

const NavbarDiscover = forwardRef<HTMLDivElement, Props>(
  ({ open }: Props, ref) => {
    const { t } = useLanguage();
    const path = usePathname();
    return (
      <>
        {/* desktop */}
        <div
          ref={ref}
          className={cn(
            " sticky top-0 left-0 overflow-hidden bg-white md:transition-discrete duration-300 hidden md:flex justify-center items-center shadow-sm ",
            open
              ? // ? "h-full opacity-100 pointer-events-auto"
                "max-h-[420px] h-[420px] opacity-100 pointer-events-auto"
              : "max-h-0 pointer-events-none"
          )}
        >
          <div className="w-full h-full relative">
            <div className=" absolute inset-0 h-full w-full z-10">
              <Image
                width={500}
                height={500}
                src={"/logo/wedison-logogram.svg"}
                alt="Wedison Logo"
                className=" h-full w-full object-contain opacity-10 scale-600 object-[55%_100%]"
              />
            </div>

            <div className=" absolute inset-0 flex items-center bg-transparent justify-center z-20 ">
              <div className=" w-[70%] h-full bg-red- p-4 z-20 bg-transparent">
                <div className=" w-full h-full gap-4 flex bg-white/0 rounded-lg justify-evenly items-center">
                  {/* left side */}
                  {/* <div className="flex flex-1 h-full w-full select-none flex-col justify-center items-center text-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"> */}
                  <div className="flex flex-1 h-full w-full select-none flex-col justify-center items-center text-center rounded-md bg-gray-100 p-6 no-underline outline-none focus:shadow-md">
                    <div className="mb-3 text-2xl font-medium">
                      {t("nav.discover.leftCard.title")}
                    </div>
                    <p className="text-sm leading-tight text-gray-700">
                      {t("nav.discover.leftCard.description")}
                    </p>
                  </div>

                  {/* right side */}
                  <div className=" flex flex-1 flex-col gap-4 items-center justify-start h-full">
                    <Link
                      href="/showroom/"
                      className={cn(
                        " bg-white hover:bg-gray-100 px-4 rounded-lg py-2 flex-1 w-full",
                        path === "/showroom/"
                          ? "cursor-not-allowed bg-gray-100"
                          : ""
                      )}
                    >
                      <div className=" text-black font-medium text-xl">
                        Experience Center
                      </div>
                      <div className="text-gray-500 text-sm">
                        {t("nav.experienceCenter.description")}
                      </div>
                    </Link>

                    <Link
                      href="/faq/"
                      className={cn(
                        " bg-white hover:bg-gray-100 px-4  rounded-lg py-2 flex-1 w-full",
                        path === "/faq/"
                          ? // ? "cursor-not-allowed bg-gray-100 shadow-[inset_0px_0px_36px_-15px_rgba(0,0,0,0.25)]"

                            "cursor-not-allowed bg-gray-100 "
                          : ""
                      )}
                    >
                      <div className=" text-black font-medium text-xl">FAQ</div>
                      <div className="text-gray-500 text-sm">
                        {t("nav.faq.description")}
                      </div>
                    </Link>

                    <Link
                      href="/media-center/"
                      className={cn(
                        " bg-white hover:bg-gray-100 px-4  rounded-lg py-2 flex-1 w-full",
                        path === "/media-center/"
                          ? "cursor-not-allowed bg-gray-100 "
                          : ""
                      )}
                    >
                      <div className=" text-black font-medium text-xl">
                        Media Center
                      </div>
                      <div className="text-gray-500 text-sm">
                        {t("nav.mediaCenter.description")}
                      </div>
                    </Link>

                    <Link
                      href="/ojol/"
                      className={cn(
                        " bg-white hover:bg-gray-100 px-4  rounded-lg py-2 flex-1 w-full",
                        path === "/ojol/"
                          ? "cursor-not-allowed bg-gray-100 "
                          : ""
                      )}
                    >
                      <div className=" text-black font-medium text-xl">
                        Wedison Ojol
                      </div>
                      <div className="text-gray-500 text-sm">
                        {t("nav.ojol.description")}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

NavbarDiscover.displayName = "NavbarDiscover";

export default NavbarDiscover;
