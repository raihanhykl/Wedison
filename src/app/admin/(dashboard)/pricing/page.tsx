import type { Metadata } from "next";
import { PricingView } from "./pricing-view";

export const metadata: Metadata = { title: "Prices & Schemes · Wedison Admin" };

export default function PricingPage() {
  return <PricingView />;
}
