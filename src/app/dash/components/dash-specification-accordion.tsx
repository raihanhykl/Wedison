"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/app/lib/language-context";

export default function DashSpecificationsAccordion() {
  const { t } = useLanguage();

  const specifications = [
    {
      category: t("dash.specs.engine"),
      details: [
        { label: "Motor Type", value: "Brushless DC Electric Motor" },
        { label: "Maximum Power", value: "6.5 kW (8.7 hp)" },
        { label: "Maximum Torque", value: "28 Nm" },
        { label: "Top Speed", value: "80 km/h (50 mph)" },
        { label: "Acceleration (0-50 km/h)", value: "4.5 seconds" },
      ],
    },
    {
      category: t("dash.specs.battery"),
      details: [
        { label: "Battery Type", value: "Lithium-ion" },
        { label: "Battery Capacity", value: "4.8 kWh" },
        { label: "Voltage", value: "60V" },
        { label: "Charging Time (0-80%)", value: "2 hours (Fast Charge)" },
        { label: "Charging Time (0-100%)", value: "4 hours (Standard Outlet)" },
        { label: "Range", value: "140 km (87 miles)" },
      ],
    },
    {
      category: t("dash.specs.brake"),
      details: [
        { label: "Front Brake", value: "240mm Disc with 2-piston Caliper" },
        { label: "Rear Brake", value: "220mm Disc with single-piston Caliper" },
        { label: "ABS", value: "Single-channel ABS (front)" },
        { label: "Regenerative Braking", value: "Yes, with 3 levels" },
      ],
    },
    {
      category: t("dash.specs.dimension"),
      details: [
        { label: "Length", value: "1,950 mm" },
        { label: "Width", value: "720 mm" },
        { label: "Height", value: "1,080 mm" },
        { label: "Seat Height", value: "760 mm" },
        { label: "Ground Clearance", value: "150 mm" },
        { label: "Wheelbase", value: "1,350 mm" },
        { label: "Weight", value: "140 kg" },
      ],
    },
    {
      category: t("dash.specs.tire"),
      details: [
        { label: "Front Tire", value: "110/70-17" },
        { label: "Rear Tire", value: "140/70-17" },
        { label: "Tire Type", value: "Tubeless" },
      ],
    },
    {
      category: t("dash.specs.suspension"),
      details: [
        {
          label: "Front Suspension",
          value: "37mm Telescopic Forks, 110mm travel",
        },
        {
          label: "Rear Suspension",
          value: "Mono-shock, adjustable preload, 100mm travel",
        },
      ],
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {specifications.map((spec, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-b border-gray-200"
        >
          <AccordionTrigger className="text-lg font-medium py-4 hover:text-[var(--primary)] transition-colors">
            {spec.category}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-2">
              {spec.details.map((detail, detailIndex) => (
                <div
                  key={detailIndex}
                  className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-600">{detail.label}</span>
                  <span className="text-gray-900 font-medium">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
