"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-[1px] border-gray-800",
        isScrolled
          ? "bg-gray-950/80 backdrop-blur-md py-3 shadow-lg"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          {/* <span className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.65_0.1503_158.66)] to-emerald-400 bg-clip-text text-transparent">
            WEDISON
          </span>
          <span className="text-xl font-light">MOTORS</span> */}
          <Image
            src="https://wedison.co/wp-content/uploads/2024/10/WEDISON-LOGO-01-edited-300x192.png"
            alt="Vercel Logo"
            width={80}
            height={50}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {["Home", "Products", "Features", "Testimonials", "Contact"].map(
            (item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative font-semibold text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[oklch(0.65_0.1503_158.66)] after:scale-x-0 after:origin-right after:transition-transform hover:after:scale-x-100 hover:after:origin-left"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.toLowerCase());
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {item}
              </Link>
            )
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 absolute top-full left-0 right-0 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {["Home", "Products", "Features", "Testimonials", "Contact"].map(
              (item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white py-2 transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    const element = document.getElementById(item.toLowerCase());
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {item}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
