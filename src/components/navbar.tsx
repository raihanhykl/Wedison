"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/lib/language-context";
import { stripLocale } from "@/app/lib/locale";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavbarProduct from "./navbar-product";
import LanguageToggle2 from "./language-toggle2";
import NavbarDropdown from "./navbar-dropdown";

export default function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const route = usePathname();
  const [openProduct, setOpenProduct] = useState(false);
  const [openCorporate, setOpenCorporate] = useState(false);
  const [openDiscover, setOpenDiscover] = useState(false);
  // const [tone, setTone] = useState("");
  // const [bgTone, setBgTone] = useState("");
  // const [bgAccent, setBgAccent] = useState("");
  const [whitePage, setWhitePage] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const productOpenerRef = useRef<HTMLButtonElement>(null);
  const discoverRef = useRef<HTMLDivElement>(null);
  const discoverOpenerRef = useRef<HTMLButtonElement>(null);
  const corporateRef = useRef<HTMLDivElement>(null);
  const corporateOpenerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (
        productRef.current &&
        !productRef.current.contains(target) &&
        productOpenerRef.current &&
        !productOpenerRef.current.contains(target)
      ) {
        setOpenProduct(false);
      }
      if (
        discoverRef.current &&
        !discoverRef.current.contains(target) &&
        discoverOpenerRef.current &&
        !discoverOpenerRef.current.contains(target)
      ) {
        setOpenDiscover(false);
      }
      if (
        corporateRef.current &&
        !corporateRef.current.contains(target) &&
        corporateOpenerRef.current &&
        !corporateOpenerRef.current.contains(target)
      ) {
        setOpenCorporate(false);
      }
    };

    if (openProduct || openCorporate || openDiscover) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openProduct, openCorporate, openDiscover]);

  useEffect(() => {
    const path = stripLocale(route); // toleran prefix /id|/en
    if (
      path === "/corporate/about/" ||
      path === "/corporate/contact/" ||
      path === "/showroom/" ||
      // path === "/super-charge/" ||
      (path.startsWith("/media-center/") && path !== "/media-center/")
    ) {
      setWhitePage(true);
    } else {
      setWhitePage(false);
    }
    setOpenProduct(false);
    setOpenCorporate(false);
    setOpenDiscover(false);
    setMobileMenuOpen(false);
  }, [route]);

  const navItems = [
    {
      name: t("nav.products"),
      href: "#",
      subMenu: [
        { name: "Bees", href: "/bees/", image: "/navbar-product/bees.webp" },
        {
          name: "Athena",
          href: "/athena/",
          image: "/navbar-product/athena.webp",
        },
        {
          name: "Victory",
          href: "/victory/",
          image: "/navbar-product/victory.webp",
        },
        // { name: "Dash", href: "/dash" },
        {
          name: "EdPower",
          href: "/edpower/",
          image: "/navbar-product/edpower.webp",
        },
      ],
    },
    {
      name: t("nav.discover"),
      href: "#",
      subMenu: [
        {
          name: "Experience Center",
          href: "/showroom/",
          image: "",
        },
        {
          name: "Media Center",
          href: "/media-center/",
          image: "",
        },
        {
          name: "FAQ",
          href: "/faq/",
          image: "",
        },
        {
          name: "Wedison Ojol",
          href: "/ojol/",
          image: "",
        },
      ],
    },
    {
      name: t("nav.superCharge"),
      href: "/super-charge/",
    },
    {
      name: t("nav.corporate"),
      href: "#",
      subMenu: [
        {
          name: t("nav.aboutUs"),
          href: "/corporate/about/",
          image: "",
        },
        { name: t("nav.contactUs"), href: "/corporate/contact/", image: "" },
        { name: t("nav.careers"), href: "/career/", image: "" },
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

  const toggleOpen = (state: string) => {
    if (state === "openProduct") {
      if (openCorporate || openDiscover) {
        setOpenCorporate(false);
        setOpenDiscover(false);
      }
      setOpenProduct(!openProduct);
    } else if (state === "openCorporate") {
      if (openProduct || openDiscover) {
        setOpenProduct(false);
        setOpenDiscover(false);
      }
      setOpenCorporate(!openCorporate);
    } else {
      if (openProduct || openCorporate) {
        setOpenProduct(false);
        setOpenCorporate(false);
      }
      setOpenDiscover(!openDiscover);
    }
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const corporateLinks = [
    {
      href: "/corporate/about/",
      title: t("nav.aboutUs"),
      description: t("nav.aboutUs.description"),
    },
    {
      href: "/corporate/contact/",
      title: t("nav.contactUs"),
      description: t("nav.contactUs.description"),
    },
    {
      href: "/career/",
      title: t("nav.careers"),
      description: t("nav.careers.description"),
    },
  ];

  const discoverLinks = [
    {
      href: "/showroom/",
      title: "Experience Center",
      description: t("nav.experienceCenter.description"),
    },
    {
      href: "/faq/",
      title: "FAQ",
      description: t("nav.faq.description"),
    },
    {
      href: "/media-center/",
      title: "Media Center",
      description: t("nav.mediaCenter.description"),
    },
    {
      href: "/ojol/",
      title: "Wedison Ojol",
      description: t("nav.ojol.description"),
    },
  ];

  return (
    <div className="relative">
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
          // "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full bg-white",
          scrolled ||
            openProduct ||
            openCorporate ||
            openDiscover ||
            mobileMenuOpen
            ? "bg-white backdrop-blur-md shadow-soft"
            : "bg-transparent"
          // bgTone
        )}
      >
        {/* <div className="container mx-auto"> */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[2400px]">
          {/* <div className="flex items-center justify-between"> */}
          <div className="flex items-center justify-between h-12 overflow-hidden sm:h-14 md:h-16">
            <div className="inset-0 flex-shrink-0 p-0 h-fit ">
              <Link
                href="/"
                className="flex items-center h-full shadow-xs cursor-pointer"
              >
                <Image
                  src={
                    scrolled ||
                    openProduct ||
                    openCorporate ||
                    openDiscover ||
                    mobileMenuOpen
                      ? "/wedison-sidebyside.png"
                      : whitePage
                      ? "/wedison-sidebyside.png"
                      : "/wedison-sidebyside-white.png"
                  }
                  alt="Wedison Logo"
                  width={150}
                  height={40}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}

            <nav className="items-center hidden space-x-4 border-none outline-none md:flex lg:space-x-8 ring-0">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.subMenu ? (
                    item.name === t("nav.products") ? (
                      <button
                        ref={productOpenerRef}
                        className={cn(
                          "flex items-center text-white  px-3 py-2 rounded-md text-sm font-bold relative",
                          scrolled ||
                            openProduct ||
                            openCorporate ||
                            openDiscover
                            ? "text-black hover:text-[var(--primary)]"
                            : whitePage
                            ? "text-black"
                            : "text-white",
                          activeDropdown === item.name &&
                            "text-[var(--primary)]"
                          // tone
                        )}
                        onClick={() => toggleOpen("openProduct")}
                      >
                        {item.name}
                        <ChevronDown
                          className={cn(
                            "ml-1 h-4 w-4 transition-transform duration-200",
                            openProduct && "rotate-180"
                          )}
                        />
                        <span
                          className={cn(
                            "absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full",
                            whitePage ? "bg-black" : "bg-white",

                            // "absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full",
                            (scrolled ||
                              openProduct ||
                              openCorporate ||
                              openDiscover) &&
                              "bg-[var(--primary)]"
                            // bgAccent
                          )}
                        />
                      </button>
                    ) : item.name === t("nav.corporate") ? (
                      <button
                        ref={corporateOpenerRef}
                        className={cn(
                          "flex items-center text-white  px-3 py-2 rounded-md text-sm font-bold relative",
                          whitePage ? "text-black" : "text-white",
                          // "flex items-center text-gray-800 hover:text-[var(--primary)] px-3 py-2 rounded-md text-sm font-medium relative",
                          scrolled ||
                            openProduct ||
                            openCorporate ||
                            openDiscover
                            ? "text-black hover:text-[var(--primary)]"
                            : "",
                          activeDropdown === item.name &&
                            "text-[var(--primary)]"
                          // tone
                        )}
                        onClick={() => toggleOpen("openCorporate")}
                      >
                        {item.name}
                        <ChevronDown
                          className={cn(
                            "ml-1 h-4 w-4 transition-transform duration-200",
                            openCorporate && "rotate-180"
                          )}
                        />
                        <span
                          className={cn(
                            "absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full",
                            whitePage ? "bg-black" : "bg-white",

                            // "absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full",
                            (scrolled ||
                              openProduct ||
                              openCorporate ||
                              openDiscover) &&
                              "bg-[var(--primary)]"
                            // bgAccent
                          )}
                        />
                      </button>
                    ) : (
                      <button
                        ref={discoverOpenerRef}
                        className={cn(
                          "flex items-center text-white  px-3 py-2 rounded-md text-sm font-bold relative",
                          whitePage ? "text-black" : "text-white",
                          // "flex items-center text-gray-800 hover:text-[var(--primary)] px-3 py-2 rounded-md text-sm font-medium relative",
                          scrolled ||
                            openProduct ||
                            openCorporate ||
                            openDiscover
                            ? "text-black hover:text-[var(--primary)]"
                            : "",
                          activeDropdown === item.name &&
                            "text-[var(--primary)]"
                          // tone
                        )}
                        onClick={() => toggleOpen("openDiscover")}
                      >
                        {item.name}
                        <ChevronDown
                          className={cn(
                            "ml-1 h-4 w-4 transition-transform duration-200",
                            openDiscover && "rotate-180"
                          )}
                        />
                        <span
                          className={cn(
                            "absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full",
                            whitePage ? "bg-black" : "bg-white",

                            // "absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full",
                            (scrolled ||
                              openProduct ||
                              openCorporate ||
                              openDiscover) &&
                              "bg-[var(--primary)]"
                            // bgAccent
                          )}
                        />
                      </button>
                    )
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center text-white  px-3 py-2 rounded-md text-sm font-bold relative",
                        whitePage ? "text-black" : "text-white",

                        // "flex items-center text-gray-800 hover:text-[var(--primary)] transition-colors px-3 py-2 rounded-md text-sm font-medium relative",
                        // route == "/products/edmax" &&
                        //   "text-[var(--primary-light)]"
                        scrolled || openProduct || openCorporate || openDiscover
                          ? "text-black hover:text-[var(--primary)]"
                          : ""
                        // tone
                      )}
                    >
                      {item.name}
                      <span
                        className={cn(
                          "absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full",
                          whitePage ? "bg-black" : "bg-white",

                          // "absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full",
                          (scrolled || openProduct) && "bg-[var(--primary)]"
                          // bgAccent
                        )}
                      />
                    </Link>
                  )}
                </div>
              ))}

              {/* <LanguageToggle /> */}
              <LanguageToggle2
                toggleOpen={openProduct || openCorporate || openDiscover}
              />
            </nav>

            {/* Mobile menu button and language toggle */}
            <div className="flex items-center md:hidden">
              {/* <LanguageToggle className="mr-2" /> */}
              <LanguageToggle2 />

              <button
                type="button"
                className={cn(
                  "inline-flex bg-none items-center justify-center p-2 rounded-md text-gray-800 hover:scale-120 hover:bg-gray-100/0 transition-all duration-300 focus:outline-none",
                  scrolled || mobileMenuOpen
                    ? " text-black"
                    : whitePage
                    ? "text-black"
                    : "text-white"
                  // tone
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
                  // <div className="py-2 pl-4 my-1 space-y-1 rounded-md animate-slide-down bg-gray-50">
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
                      item.subMenu[0].image != "" &&
                      "grid grid-cols-2 gap-7 p-4"
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
                            <p className="w-full text-sm font-bold tracking-widest text-center ">
                              {/* {item.name} */}
                              {item.name.toUpperCase()}
                            </p>
                            <div className="flex items-center justify-center w-16 h-16 overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className={cn(
                                  "lg:h-32 lg:w-32 h-16 w-16 object-contain"
                                )}
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
          </div>
        </div>

        <NavbarProduct open={openProduct} ref={productRef} />

        <NavbarDropdown
          open={openCorporate}
          ref={corporateRef}
          heightClass="max-h-80 h-80"
          leftCard={{
            title: t("nav.corporate.leftCard.title"),
            description: t("nav.corporate.leftCard.description"),
          }}
          links={corporateLinks}
        />

        <NavbarDropdown
          open={openDiscover}
          ref={discoverRef}
          heightClass="max-h-[420px] h-[420px]"
          leftCard={{
            title: t("nav.discover.leftCard.title"),
            description: t("nav.discover.leftCard.description"),
          }}
          links={discoverLinks}
        />
      </header>
    </div>
  );
}
