import React from "react";
import OjolClient from "./client";
import { getSEOMetadata } from "@/app/lib/seo1";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getSEOMetadata({ locale: locale as "id" | "en", path: "/ojol" });
}

export default function OjolPage() {
  return (
    <div>
      <OjolClient />
    </div>
  );
}
