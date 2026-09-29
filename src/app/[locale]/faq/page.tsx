import React from "react";
import { notFound } from "next/navigation";
import FaqStructure from "./structure";
import { getSEOMetadata } from "@/app/lib/seo1";
// import Baru from "./components/baru";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/faq" });
}

export default function Page() {
  const dev = true;
  if (!dev) return notFound();
  return (
    <div>
      <div className=" ">
        <FaqStructure />
      </div>
      {/* <Baru /> */}
    </div>
  );
}
