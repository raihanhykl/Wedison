import React from "react";
import MediaCenterstructure from "./structure";
import { notFound } from "next/navigation";
// import Baru from "./components/baru";

export default function Page() {
  const dev = true;
  if (!dev) return notFound();
  return (
    <div>
      <div className=" ">
        <MediaCenterstructure />
      </div>
      {/* <Baru /> */}
    </div>
  );
}
