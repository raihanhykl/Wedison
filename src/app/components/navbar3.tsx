"use client";

import { useEffect, useRef, useState } from "react";
// import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";
import LanguageToggle from "./language-toggle";
import Image from "next/image";

export default function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  //   const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    {
      name: t("nav.products"),
      href: "#",
      subMenu: [
        { name: "Mini", href: "/products/mini" },
        { name: "Mini-Pro", href: "/products/mini-pro" },
        { name: "Athena", href: "/products/athena" },
        { name: "Victory", href: "/products/victory" },
        { name: "Dash", href: "/products/dash" },
        { name: "Edmax", href: "/products/edmax" },
      ],
    },
    {
      name: t("nav.experienceCenter"),
      href: "#",
      subMenu: [
        { name: t("nav.showroom"), href: "/experience/showroom" },
        {
          name: t("nav.serviceLocation"),
          href: "/experience/service-location",
        },
      ],
    },
    {
      name: t("nav.superCharge"),
      href: "/products/edmax",
    },
    {
      name: t("nav.corporate"),
      href: "#",
      subMenu: [
        { name: t("nav.aboutUs"), href: "/corporate/about" },
        { name: t("nav.careers"), href: "/corporate/careers" },
        { name: t("nav.contactUs"), href: "/corporate/contact" },
        { name: t("nav.helpCenter"), href: "/corporate/help" },
      ],
    },
  ];

  //   useEffect(() => {
  //     const handleClickOutside = (event: MouseEvent) => {
  //       if (
  //         dropdownRef.current &&
  //         !dropdownRef.current.contains(event.target as Node)
  //       ) {
  //         setActiveDropdown(null);
  //       }
  //     };

  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, []);

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
  }, [scrolled]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        // scrolled ? "bg-white/90 backdrop-blur-md shadow-soft" : "bg-transparent"
        scrolled ? "bg-white/50 backdrop-blur-md shadow-soft" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {/* <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent">
                Wedison Motors
              </span> */}
              <Image
                src={"/logo.png"}
                alt="Wedison Logo"
                width={100}
                height={100}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <button
                  className={cn(
                    "flex items-center text-gray-800 hover:text-teal-500 transition-colors px-3 py-2 rounded-md text-sm font-medium relative",
                    activeDropdown === item.name && "text-teal-500"
                  )}
                  onClick={() => item.subMenu && toggleDropdown(item.name)}
                >
                  <Link key={item.name} href={item.href}>
                    {item.name}
                  </Link>
                  {item.subMenu && (
                    <ChevronDown
                      className={cn(
                        "ml-1 h-4 w-4 transition-transform duration-200",
                        activeDropdown === item.name && "rotate-180"
                      )}
                    />
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                </button>

                {item.subMenu && (
                  <div
                    className={cn(
                      "absolute left-0 mt-2 w-48 rounded-md shadow-soft bg-white border-[1px] border-[var(--primary-light)]  transition-all duration-200 transform origin-top-right",
                      activeDropdown === item.name
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    )}
                    // ref={dropdownRef}
                    // onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      {item.subMenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => console.log("klik submenu")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-500"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-teal-500 hover:bg-gray-100 focus:outline-none"
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
              <button
                className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-teal-500 hover:bg-gray-100"
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

              {item.subMenu && activeDropdown === item.name && (
                <div className="pl-4 py-2 space-y-1 animate-slide-down bg-gray-50 rounded-md my-1">
                  {item.subMenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-teal-500 hover:bg-gray-50"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
