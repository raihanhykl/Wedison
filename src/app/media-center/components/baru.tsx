/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

export default function BaruFix() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeGray, setActiveGray] = useState(false);
  const [activeGreen, setActiveGreen] = useState(false);

  const toggleActive = (item: any) => {
    if (item === "gray") {
      if (activeGreen) {
        setActiveGreen(false);
      } else {
        setActiveGray(!activeGray);
      }
    } else if (item === "green") {
      if (activeGray) {
        setActiveGray(false);
      } else {
        setActiveGreen(!activeGreen);
      }
    }
  };
  return (
    <div ref={ref} className="relative w-full h-[80vh] overflow-hidden">
      {/* kiri */}
      <div
        className={cn(
          " absolute inset-0 bg-emerald-900 text-white p-4 transition-all duration-1500 ",
          inView ? "translate-x-0" : "-translate-x-full",
          activeGreen
            ? "[clip-path:polygon(0_0,80%_0,80%_100%,0_100%)] duration-800"
            : "[clip-path:polygon(0_0,65%_0,35%_100%,0_100%)] duration-800",
          activeGray &&
            "[clip-path:polygon(0_0,20%_0,20%_100%,0_100%)] duration-800"
        )}
        onClick={() => toggleActive("green")}
      >
        <h2
          className={cn(
            "font-bold absolute left-65 top-25 text-[5rem] tracking-[0.5em] transition-all duration-1500",
            inView ? "translate-x-0 delay-100" : "-translate-x-[200%]",
            activeGreen ? "left-130 top-5" : "",
            activeGray ? "left-3 top-30 tracking-widest duration-800" : ""
          )}
        >
          ATHENA
        </h2>
        <div
          className={cn(
            "absolute top-10 left-0 transition-all duration-1500",
            inView ? "translate-x-0 delay-100" : "-translate-x-full",
            activeGreen ? "left-70 -top-10 scale-75" : ""
          )}
        >
          <Image
            src="/navbar-product/athena.webp"
            width={1000}
            height={1000}
            alt="baru"
            className=" w-[60%] h-[60%] object-cover"
          />
        </div>
        <div
          className={cn(
            "absolute -bottom-full left-0 w-full text-center transition-all duration-1500",
            activeGreen ? " -bottom-5 -left-50" : ""
          )}
        >
          <div className=" w-full px-8 md:px-16 md:my-16 max-w-[2480px] mx-auto">
            <div className="flex justify-center container mx-auto">
              <div className="  flex items-center justify-center w-full max-w-6xl">
                <div className=" flex flex-col md:flex-row items-center md:items-start md:justify-evenly h-full w-fit md:w-full">
                  <div className=" max-md:w-full">
                    <div className=" flex justify-start  w-full">
                      <div className="text-6xl md:text-7xl font-medium md:font-bold ">
                        90
                      </div>
                      <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold">
                        mil
                      </div>
                    </div>
                    <div className="text-lg font-medium md:font-semibold">
                      anjay
                    </div>
                  </div>
                  <div className=" w-[80%] h-[1px] bg-gradient-to-r md:w-[1px] md:h-full my-3 md:my-0 md:bg-gradient-to-b from-transparent from-0% via-white to-100% mx-[1px] to-transparent"></div>

                  <div className=" max-md:w-full">
                    <div className=" flex justify-start ">
                      <div className="text-6xl md:text-7xl font-medium md:font-bold">
                        90
                      </div>
                      <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold">
                        mil
                      </div>
                    </div>
                    <div className="text-lg font-medium md:font-semibold">
                      anjay
                    </div>
                  </div>
                  <div className=" w-[80%] h-[1px] bg-gradient-to-r md:w-[1px] md:h-full my-3 md:my-0 md:bg-gradient-to-b from-transparent from-0% via-white to-100% mx-[1px] to-transparent"></div>

                  <div className=" max-md:w-full">
                    <div className=" flex justify-start ">
                      <div className="text-6xl md:text-7xl font-medium md:font-bold">
                        90
                      </div>
                      <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold">
                        mil
                      </div>
                    </div>
                    <div className="text-lg font-medium md:font-semibold">
                      anjay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* kanan */}
      <div
        className={cn(
          "absolute inset-0 bg-gray-900 text-white p-4 transition-all duration-800",
          inView ? "translate-x-0" : "translate-x-full",
          activeGray
            ? "[clip-path:polygon(20%_0,100%_0,100%_100%,20%_100%)] duration-800"
            : "[clip-path:polygon(65%_0,100%_0,100%_100%,35%_100%)] duration-800",
          activeGreen &&
            "[clip-path:polygon(80%_0,100%_0,100%_100%,80%_100%)] duration-800"
        )}
        onClick={() => toggleActive("gray")}
      >
        <h2
          className={cn(
            "font-bold absolute right-15 top-25 text-[5rem] tracking-[0.5em] transition-all duration-800",
            inView
              ? "translate-x-0 delay-100 duration-700"
              : "translate-x-[200%]",
            activeGray ? "right-110 top-5" : " duration-800",
            activeGreen
              ? "right-3 top-30 tracking-widest text-[4rem] duration-700"
              : "duration-700"
          )}
        >
          EDPOWER
        </h2>
        <div
          className={cn(
            "absolute top-10 -right-120 transition-all duration-800",
            inView ? "translate-x-0 delay-100" : "-translate-x-full",
            activeGray ? "-right-20 -top-10 scale-75" : "",
            activeGreen && "-right-230"
          )}
        >
          <Image
            src="/navbar-product/edpower.webp"
            width={1000}
            height={1000}
            alt="baru"
            className=" w-[60%] h-[60%] object-cover"
          />
        </div>
        <div
          className={cn(
            "absolute -bottom-full -right-40 w-full text-center transition-all duration-1500",
            activeGray ? " -bottom-5 -right-40" : ""
          )}
        >
          <div className=" w-full px-8 md:px-16 md:my-16 max-w-[2480px] mx-auto">
            <div className="flex justify-center container mx-auto">
              <div className="  flex items-center justify-center w-full max-w-6xl">
                <div className=" flex flex-col md:flex-row items-center md:items-start md:justify-evenly h-full w-fit md:w-full">
                  <div className=" max-md:w-full">
                    <div className=" flex justify-start  w-full">
                      <div className="text-6xl md:text-7xl font-medium md:font-bold ">
                        90
                      </div>
                      <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold">
                        mil
                      </div>
                    </div>
                    <div className="text-lg font-medium md:font-semibold">
                      anjay
                    </div>
                  </div>
                  <div className=" w-[80%] h-[1px] bg-gradient-to-r md:w-[1px] md:h-full my-3 md:my-0 md:bg-gradient-to-b from-transparent from-0% via-white to-100% mx-[1px] to-transparent"></div>

                  <div className=" max-md:w-full">
                    <div className=" flex justify-start ">
                      <div className="text-6xl md:text-7xl font-medium md:font-bold">
                        90
                      </div>
                      <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold">
                        mil
                      </div>
                    </div>
                    <div className="text-lg font-medium md:font-semibold">
                      anjay
                    </div>
                  </div>
                  <div className=" w-[80%] h-[1px] bg-gradient-to-r md:w-[1px] md:h-full my-3 md:my-0 md:bg-gradient-to-b from-transparent from-0% via-white to-100% mx-[1px] to-transparent"></div>

                  <div className=" max-md:w-full">
                    <div className=" flex justify-start ">
                      <div className="text-6xl md:text-7xl font-medium md:font-bold">
                        90
                      </div>
                      <div className=" flex items-end text-left text-2xl md:text-3xl font-medium md:font-semibold">
                        mil
                      </div>
                    </div>
                    <div className="text-lg font-medium md:font-semibold">
                      anjay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
    </div>
  );
}
