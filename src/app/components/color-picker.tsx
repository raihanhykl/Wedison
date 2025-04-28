"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ProductColor } from "../products/edmax/components/product-pick";

type Props = {
  name: string;
  product: ProductColor[];
  descColor?: string;
};

export default function ColorPicker({ name, product, descColor }: Props) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product?.[0]
  );
  //   const [selectedColor, setSelectedColor] = useState<Color>(colors[0]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full max-w-3xl mx-auto mb-8 rounded-xl overflow-hidden shadow-soft-lg">
        {/* <img
          src="/placeholder.svg?height=450&width=800"
          alt={`Edmax in ${selectedColor.name}`}
          className="w-full h-full object-cover"
        /> */}
        <Image
          src={`/${name}-${selectedColor?.name}.webp`}
          alt={`${name} in ${selectedColor?.name}`}
          // className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          className="w-full h-full object-cover object-[20%_70%]"
          height={450}
          width={800}
        />
        <div
        //   className={`absolute inset-0 ${selectedColor.bgClass} opacity-10`}
        ></div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        {product?.map((color) => (
          <button
            key={color.name}
            onClick={() => setSelectedColor(color)}
            className={cn(
              "w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
              selectedColor.name === color.name
                ? "border-teal-500 scale-110 shadow-md"
                : "border-gray-200 hover:border-teal-300"
            )}
            aria-label={`Select ${color.name}`}
          >
            <span
              className="w-10 h-10 rounded-full"
              style={{ backgroundColor: color.hex }}
            ></span>
          </button>
        ))}
      </div>

      <p className={cn("text-lg font-medium text-gray-900", descColor)}>
        {selectedColor?.name.charAt(0).toUpperCase() +
          selectedColor?.name.slice(1)}
      </p>
    </div>
  );
}
