"use client";

import { useEffect, useState } from "react";
// import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";
import LanguageToggle from "./language-toggle";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropworn-menu";
import { usePathname } from "next/navigation";
import NavbarProduct from "./navbar-product";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const route = usePathname();
  const [open, setOpen] = useState(false);

  // let tone: string | null = null;
  // let bgTone: string | null = null;
  // let bgAccent: string | null = null;

  // const pageTone = () => {
  //   if (route == "/edpower") {
  //     tone = " text-[var(--primary-light)] hover:bg-black";
  //     bgTone = "bg-black";
  //     bgAccent = "bg-[var(--primary-light)]";
  //   } else if (route == "/dash") {
  //     tone = " text-[#fdc600] hover:text-[#fdc600]/80 hover:bg-black";
  //     // bgTone = " bg-white";
  //     bgTone = " bg-black";
  //     // bgTone = " bg-gradient-to-l from-black from-50% to-[#fdeecb]";
  //     bgAccent = "bg-[#fdc600]";
  //   } else if (route == "/victory") {
  //     tone = " text-white hover:text-white/80 hover:bg-black";
  //     bgTone = "bg-black";
  //     bgAccent = "bg-white";
  //   } else if (route == "/mini") {
  //     tone = " text-[#7fa3a4] hover:text-[#7fa3a4]/80 hover:bg-black";
  //     bgTone = "bg-black";
  //     bgAccent = "bg-[#7fa3a4]";
  //   } else if (route == "/athena") {
  //     tone = " text-[#ff7db6] hover:text-[#ff7db6]/80 hover:bg-black";
  //     bgTone = "bg-black";
  //     bgAccent = "bg-[#ff7db6]";
  //   }
  // };

  // pageTone();

  const [tone, setTone] = useState("");
  const [bgTone, setBgTone] = useState("");
  const [bgAccent, setBgAccent] = useState("");

  useEffect(() => {
    if (route === "/edpower/" || route === "/edpower") {
      setTone("text-[var(--primary-light)] hover:bg-black");
      setBgTone("bg-black");
      setBgAccent("bg-[var(--primary-light)]");
    } else if (route === "/dash/" || route === "/dash") {
      setTone("text-[#fdc600] hover:text-[#fdc600]/80 hover:bg-black");
      setBgTone("bg-black");
      setBgAccent("bg-[#fdc600]");
    } else if (route === "/victory/" || route === "/victory") {
      setTone("text-white hover:text-white/80 hover:bg-black");
      setBgTone("bg-black");
      setBgAccent("bg-white");
    } else if (route === "/mini/" || route === "/mini") {
      setTone("text-[#7fa3a4] hover:text-[#7fa3a4]/80 hover:bg-black");
      setBgTone("bg-black");
      setBgAccent("bg-[#7fa3a4]");
    } else if (route === "/athena/" || route === "/athena") {
      setTone("text-[#ff7db6] hover:text-[#ff7db6]/80 hover:bg-black");
      setBgTone("bg-black");
      setBgAccent("bg-[#ff7db6]");
    } else {
      setTone("");
      setBgTone("");
      setBgAccent("");
    }
    setOpen(false);
  }, [route]);

  const navItems = [
    {
      name: t("nav.products"),
      href: "#",
      subMenu: [
        { name: "Mini", href: "/mini/", image: "/mini-grey.webp" },
        { name: "Athena", href: "/athena/", image: "/athena-tosca.webp" },
        { name: "Victory", href: "/victory/", image: "/victory-grey.webp" },
        // { name: "Dash", href: "/dash" },
        { name: "EdPower", href: "/edpower/", image: "/edpower-black.webp" },
      ],
    },
    {
      name: t("nav.experienceCenter"),
      href: "/showroom",
    },
    // {
    //   name: t("nav.experienceCenter"),
    //   href: "#",
    //   subMenu: [
    //     { name: t("nav.showroom"), href: "/experience/showroom" },
    //     {
    //       name: t("nav.serviceLocation"),
    //       href: "/experience/service-location",
    //     },
    //   ],
    // },
    {
      name: t("nav.superCharge"),
      href: "/super-charge",
    },
    {
      name: t("nav.corporate"),
      href: "#",
      subMenu: [
        { name: t("nav.aboutUs"), href: "/corporate/about", image: "" },
        { name: t("nav.contactUs"), href: "/corporate/contact", image: "" },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled, route]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    // <div className="relative">
    <header
      className={cn(
        // "sticky top-0 left-0 right-0 z-50 transition-all duration-300 w-full bg-white",
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full bg-white",
        bgTone
        // route == "/products/edmax" ? "bg-black text-[var(--primary-light)]" : ""
        // "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent",
        // scrolled ? "bg-white/90 backdrop-blur-md shadow-soft" : "bg-transparent"
        // scrolled ? "bg-white/50 backdrop-blur-md shadow-soft" : ""
      )}
    >
      {/* <div className="container mx-auto"> */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="flex items-center justify-between"> */}
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 overflow-hidden">
          <div className="flex-shrink-0 h-fit inset-0 p-0 ">
            <Link
              href="/"
              className="flex items-center cursor-pointer shadow-xs h-full"
            >
              {/* <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
                Wedison Motors
                </span> */}
              <Image
                src={
                  bgTone
                    ? "/wedison-sidebyside-white.png"
                    : "/wedison-sidebyside.png"
                }
                alt="Wedison Logo"
                width={150}
                height={1000}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}

          <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {/* <div key={item.name} className="relative group"> */}
                {item.subMenu ? (
                  item.name === t("nav.products") ? (
                    <button
                      className={cn(
                        "flex items-center text-gray-800 hover:text-[var(--primary)] px-3 py-2 rounded-md text-sm font-medium relative",
                        activeDropdown === item.name && "text-[var(--primary)]",
                        tone
                      )}
                      onClick={() => setOpen(!open)}
                    >
                      {item.name}
                      <ChevronDown
                        className={cn(
                          "ml-1 h-4 w-4 transition-transform duration-200",
                          open && "rotate-180"
                        )}
                      />
                      <span
                        className={cn(
                          "absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full",
                          bgAccent
                        )}
                      />
                    </button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        className=" border-none outline-none ring-0"
                      >
                        <button
                          className={cn(
                            "flex items-center text-gray-800 hover:text-[var(--primary)] px-3 py-2 rounded-md text-sm font-medium relative",
                            activeDropdown === item.name &&
                              "text-[var(--primary)]",
                            // route == "/products/edmax" &&
                            //   "text-[var(--primary-light)]"
                            tone
                          )}
                        >
                          {item.name}
                          <ChevronDown
                            className={cn(
                              "ml-1 h-4 w-4 transition-transform duration-200",
                              activeDropdown === item.name && "rotate-180"
                            )}
                          />
                          <span
                            className={cn(
                              "absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full",
                              bgAccent
                            )}
                          />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className=" mt-2 rounded-md shadow-soft bg-white border border-[var(--primary-light)]">
                        {item.subMenu.map((subItem) => (
                          <DropdownMenuItem key={subItem.name} asChild>
                            <Link
                              href={subItem.href}
                              className="block w-full px-0 py-2 text-sm text-black hover:bg-red-500 hover:text-red-500"
                            >
                              {subItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center text-gray-800 hover:text-[var(--primary)] transition-colors px-3 py-2 rounded-md text-sm font-medium relative",
                      // route == "/products/edmax" &&
                      //   "text-[var(--primary-light)]"
                      tone
                    )}
                  >
                    {item.name}
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full",
                        bgAccent
                      )}
                    />
                  </Link>
                )}
              </div>
            ))}

            <LanguageToggle />
          </nav>

          {/* Mobile menu button and language toggle */}
          <div className="md:hidden flex items-center">
            <LanguageToggle className="mr-2" />
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-[var(--primary)] hover:bg-gray-100 focus:outline-none",
                tone
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${mobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${mobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
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
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:hidden bg-white shadow-soft absolute top-full left-0 right-0 z-20`}
      >
        <div className="px-4 pt-2 pb-4 space-y-0 divide-y divide-gray-100">
          {navItems.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center",
                  item.subMenu && "justify-between w-full"
                )}
                onClick={() => {
                  if (item.subMenu) return;
                  setMobileMenuOpen(false);
                  setActiveDropdown(null);
                }}
              >
                <button
                  className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-[var(--primary)] hover:bg-gray-100"
                  onClick={() => toggleDropdown(item.name)}
                >
                  {item.name}
                  {item.subMenu && (
                    <ChevronDown
                      className={cn(
                        "ml-1 h-4 w-4 transition-transform duration-200",
                        activeDropdown === item.name && "rotate-180"
                      )}
                    />
                  )}
                </button>
              </Link>

              {item.subMenu && activeDropdown === item.name && (
                // <div className="pl-4 py-2 space-y-1 animate-slide-down bg-gray-50 rounded-md my-1">
                //   {item.subMenu.map((subItem) => (
                //     <Link
                //       key={subItem.name}
                //       href={subItem.href}
                //       onClick={() => setMobileMenuOpen(false)}
                //       className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[var(--primary)] hover:bg-gray-50"
                //     >
                //       {subItem.name}
                //     </Link>
                //   ))}
                // </div>
                <div
                  className={` md:hidden ${
                    item.subMenu[0].image != "" && "grid grid-cols-2 gap-7 p-4"
                  } p-4 bg-white shadow-sm`}
                >
                  {item.subMenu.map((item, index) =>
                    item.image != "" ? (
                      <div
                        key={index}
                        className={cn(
                          "flex flex-col items-center justify-center hover:scale-105 h-16 w-16 mx-auto",
                          item.name === "Victory" && ""
                        )}
                      >
                        <Link
                          href={item.href}
                          className="flex flex-col items-center justify-center "
                        >
                          <p className=" w-full text-center text-sm font-bold tracking-widest">
                            {/* {item.name} */}
                            {item.name.toUpperCase()}
                          </p>
                          <div className="overflow-hidden w-16 h-16 items-center justify-center flex">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={10}
                              height={10}
                              className={cn(
                                "lg:h-32 lg:w-32 h-16 w-16",
                                item.name === "Victory" &&
                                  "lg:h-36 lg:w-36 h-20 w-20 object-contain scale-[1.16] object-[100%_40%]"
                                // "scale-125"
                              )}
                              loading="eager"
                            />
                          </div>
                        </Link>
                      </div>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[var(--primary)] hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
          <Button
            onClick={() =>
              console.log("INI PUBLIC KEY" + process.env.EMAIL_CONFIG_publicKey)
            }
          >
            TEST
          </Button>
        </div>
      </div>
      <NavbarProduct open={open} />
    </header>
    // {/* </div> */}
  );
}
