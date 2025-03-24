"use client";
import React from "react";
import Navbar from "./components/navbar";
import { ChevronRight } from "lucide-react";
import KalkulatorPenghematan from "./components/calculator/calculator";
import Product from "./components/products/product";

type Props = {};

export default function Page({}: Props) {
  return (
    <div>
      <Navbar />
      <div className="bg-[url(https://wedison.co/wp-content/uploads/2024/10/banner-web-7.png)] bg-cover bg-right flex justify-center w-full">
        <div className="max-w-[1200px] w-full pt-10 mb-20 px-4 flex justify-start">
          <div className=" max-w-[600px] w-full ">
            <div
              className=" pb-10 font-extrabold
        text-3xl"
            >
              Wedison Super Charge
            </div>
            <div className=" pb-10 font-bold text-2xl">
              Driving the Future of Green Mobility with Indonesia’s First
              Fast-Charging Electric Motorbike and EV Network
            </div>
            <div className="flex gap-5">
              <div className=" rounded-4xl px-4 py-2 bg-[#05AB6D] text-white flex text-[15px] items-center">
                Learn More <ChevronRight />
              </div>
              <div className=" rounded-4xl px-4 py-2 bg-[#white] border-[#05AB6D] border-2 text-[#05AB6D] flex text-[15px] items-center">
                View Product <ChevronRight />
              </div>
            </div>
          </div>
        </div>
      </div>
      <KalkulatorPenghematan />
      <Product />
    </div>
  );
}
