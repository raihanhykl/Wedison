"use client";
import React from "react";
// import { ChevronRight } from "lucide-react";
// import KalkulatorPenghematan from "./components/calculator/calculator";
// import Product from "./components/products/product";
import Hero from "./components/hero2";
import Features from "./components/features2";
import Products from "./components/products3";
import ContactForm from "./components/contact";
import KalkulatorPenghematan from "./components/calculator/calculator";

export default function Page() {
  return (
    <div className="min-h-screen">
      <div id="hero">
        <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="products">
        <Products />
      </div>
      <div>
        <KalkulatorPenghematan />
      </div>
      <div id="contact">
        <ContactForm />
      </div>
    </div>
  );
}
