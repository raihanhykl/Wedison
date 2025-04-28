// "use client";
// import React, { useEffect, useRef } from "react";

// export default function Hero() {
//   const heroRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("animate-fade-in");
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     const heroElement = heroRef.current;
//     if (heroElement) {
//       observer.observe(heroElement);
//     }

//     return () => {
//       if (heroElement) {
//         observer.unobserve(heroElement);
//       }
//     };
//   }, []);
//   return (
//     <section
//       id="home"
//       ref={heroRef}
//       className="relative min-h-screen flex items-center pt-20 opacity-100 transition-opacity duration-1000"
//     >
//       <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 z-10" />
//       <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[oklch(0.65_0.1503_158.66)]/20 rounded-full blur-3xl z-0" />
//     </section>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const heroElement = heroRef.current;
    if (heroElement) {
      observer.observe(heroElement);
    }

    return () => {
      if (heroElement) {
        observer.unobserve(heroElement);
      }
    };
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-20 opacity-100 transition-opacity duration-1000"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 z-0" />

      {/* Circular gradient accent */}
      <div className="absolute top-1/4 right-3/5 w-96 h-96 bg-[oklch(0.65_0.1503_158.66)]/20 rounded-full blur-3xl z-0" />

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            The Future of{" "}
            <span className="bg-gradient-to-r from-[oklch(0.65_0.1503_158.66)] to-emerald-400 bg-clip-text text-transparent">
              Electric Mobility
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-lg">
            Experience the perfect blend of power, sustainability, and
            cutting-edge technology with Wedison Motors electric motorcycles.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              className="bg-[oklch(0.65_0.1503_158.66)] hover:bg-[oklch(0.65_0.1503_158.66)]/90 text-black font-bold px-6 py-6"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("features");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Explore Models
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 bg-black text-white hover:bg-gray-800 px-6 py-6"
              size="lg"
            >
              Book a Test Ride
            </Button>
          </div>
        </div>
        <div className="relative h-[400px] md:h-[500px] mt-8 md:mt-0">
          <div className="w-full h-full rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 relative">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Wedison Electric Motorcycle"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-gray-400 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
