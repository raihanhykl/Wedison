import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

type Props = {};

export default function Product({}: Props) {
  return (
    <div className=" w-full bg-gray-50">
      <div className=" max-w-7xl w-full mx-auto">
        <div className=" w-full flex justify-between items-center">
          <h1 className=" text-3xl font-bold py-8">Our Product</h1>
          <Button className=" rounded-full px-8 text-xl mx-8">
            View All Product
          </Button>
        </div>
        {/* card */}
        <div className=" flex rounded-md gap-10">
          <div className=" flex-auto w-full flex-col items-end">
            <div className=" text-2xl font-bold mb-5">DASH</div>
            <div className=" mb-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
              blanditiis nostrum exercitationem magni ipsam quo tempora
              voluptas. Itaque, nostrum laboriosam nemo facere totam atque,
              expedita mollitia quidem quasi voluptatibus eligendi! Sint
              distinctio ratione culpa labore dicta alias, quasi maxime dolorum
              nisi consectetur totam sapiente mollitia accusantium veritatis ad
              qui aspernatur necessitatibus beatae?
            </div>
            <div className=" flex gap-10 w-full">
              <Button className="  rounded-full px-8 font-bold">
                Order Now
              </Button>
              <Button
                variant={"secondary"}
                className=" border-[1px] text-[#05ab6d] rounded-full px-8 font-bold"
              >
                More Information
              </Button>
            </div>
          </div>
          <div className=" flex-2/3 bg-red-500 w-full rounded-l-md">
            <Image
              src={"/dash-motor.png"}
              height={100}
              width={100}
              alt=""
              className="w-full rounded-l-md h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
