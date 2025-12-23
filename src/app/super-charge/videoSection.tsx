import React from "react";

export default function VideoSection() {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-28">
      <div className=" flex items-start justify-start flex-col">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
          SuperCharge: Solusi Charging Masa Depan
        </h2>
        <p className="text-base sm:text-lg text-gray-500  max-w-2xl w-full text-justify">
          SuperCharge hadir untuk memberikan pengalaman isi daya yang lebih
          cepat, aman, dan praktis bagi kendaraan listrik Anda.
        </p>
      </div>
      <div className="w-auto h-auto mt-10 px-12 aspect-video flex items-start justify-center bg-white">
        {/* <iframe
          width="1000"
          height="100%"
          src="/SuperCharge/lv_0_20250709174532.mp4"
          title="YouTube video player"
          frameBorder="0"
          //   allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          //   allowFullScreen
          className="bg-white rounded-xl"
        ></iframe> */}
        <video
          width="1200"
          height="600"
          controls
          autoPlay={false}
          muted
          className="bg-white rounded-xl"
          src="/super-charge/overview-supercharge.mov"
        ></video>
      </div>
    </div>
  );
}
