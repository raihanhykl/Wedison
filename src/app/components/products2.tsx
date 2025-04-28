"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const products = [
  {
    name: "Volt X1",
    description: "Urban commuter with sleek design and 150-mile range",
    image: "/placeholder.svg?height=400&width=600",
    price: "$8,999",
  },
  {
    name: "Thunder GT",
    description: "High-performance sport model with 0-60 in 2.8 seconds",
    image: "/placeholder.svg?height=400&width=600",
    price: "$12,499",
  },
  {
    name: "Eco Rider",
    description: "Affordable entry model with impressive 120-mile range",
    image: "/placeholder.svg?height=400&width=600",
    price: "$6,799",
  },
  {
    name: "Phantom Pro",
    description: "Premium touring model with advanced comfort features",
    image: "/placeholder.svg?height=400&width=600",
    price: "$15,999",
  },
  {
    name: "Apex S",
    description: "Track-focused performance with cutting-edge technology",
    image: "/placeholder.svg?height=400&width=600",
    price: "$18,499",
  },
  {
    name: "Urban Glide",
    description: "Compact city model with innovative storage solutions",
    image: "/placeholder.svg?height=400&width=600",
    price: "$7,299",
  },
];

export default function Products() {
  const productsRef = useRef<HTMLDivElement>(null);

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

    const productsElement = productsRef.current;
    if (productsElement) {
      observer.observe(productsElement);
    }

    return () => {
      if (productsElement) {
        observer.unobserve(productsElement);
      }
    };
  }, []);

  return (
    <section className="py-20 bg-gray-950" ref={productsRef}>
      <div className="container mx-auto px-4 opacity-100 md:opacity-100 transition-opacity duration-1000">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-[oklch(0.65_0.1503_158.66)] to-emerald-400 bg-clip-text text-transparent">
              Electric Models
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our range of electric motorcycles designed for every type
            of rider and riding style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[oklch(0.65_0.1503_158.66)]/10 hover:-translate-y-1"
            >
              <div className="relative h-64">
                <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-xl flex items-center justify-center">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="object-contain h-48"
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  {/* <span className="text-[oklch(0.65_0.1503_158.66)] font-bold">
                    {product.price}
                  </span> */}
                </div>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-white bg-black hover:text-white hover:bg-gray-800 flex-1"
                  >
                    Learn More
                  </Button>
                  <Button className="bg-[oklch(0.65_0.1503_158.66)] hover:bg-[oklch(0.65_0.1503_158.66)]/90 text-black font-medium flex-1">
                    Order Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
