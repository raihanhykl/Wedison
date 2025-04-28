"use client";

import { useEffect, useRef } from "react";
import { Battery, Zap, Gauge, Leaf, Shield, Wrench } from "lucide-react";

const features = [
  {
    icon: <Battery className="h-10 w-10 text-[oklch(0.65_0.1503_158.66)]" />,
    title: "Extended Range",
    description:
      "Up to 300 miles on a single charge with our advanced battery technology.",
  },
  {
    icon: <Zap className="h-10 w-10 text-[oklch(0.65_0.1503_158.66)]" />,
    title: "Rapid Charging",
    description:
      "80% charge in just 30 minutes with our fast-charging technology.",
  },
  {
    icon: <Gauge className="h-10 w-10 text-[oklch(0.65_0.1503_158.66)]" />,
    title: "Impressive Performance",
    description: "0-60 mph in under 3 seconds with instant torque delivery.",
  },
  {
    icon: <Leaf className="h-10 w-10 text-[oklch(0.65_0.1503_158.66)]" />,
    title: "Eco-Friendly",
    description:
      "Zero emissions and sustainable materials for a greener future.",
  },
  {
    icon: <Shield className="h-10 w-10 text-[oklch(0.65_0.1503_158.66)]" />,
    title: "Advanced Safety",
    description:
      "Cutting-edge safety features including ABS, traction control, and more.",
  },
  {
    icon: <Wrench className="h-10 w-10 text-[oklch(0.65_0.1503_158.66)]" />,
    title: "Low Maintenance",
    description:
      "Fewer moving parts means less maintenance and lower operating costs.",
  },
];

export default function Features() {
  const featuresRef = useRef<HTMLDivElement>(null);

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

    const featuresElement = featuresRef.current;
    if (featuresElement) {
      observer.observe(featuresElement);
    }

    return () => {
      if (featuresElement) {
        observer.unobserve(featuresElement);
      }
    };
  }, []);

  return (
    <section id="features" className="py-20 bg-gray-900" ref={featuresRef}>
      <div className="container mx-auto px-4 opacity-100 md:opacity-100 transition-opacity duration-1000">
        <div className="text-center mb-16 mt-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[oklch(0.65_0.1503_158.66)] to-emerald-400 bg-clip-text text-transparent">
              Wedison
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the advantages of electric motorcycles with innovative
            features designed for performance, sustainability, and convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-8 transition-all duration-300 hover:bg-gray-750 hover:shadow-lg hover:shadow-[oklch(0.65_0.1503_158.66)]/10 hover:-translate-y-1"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
