"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/app/lib/language-context";

export default function SpecificationsAccordion() {
  const { t } = useLanguage();

  const specifications = [
    {
      category: t("edmax.specs.engine"),
      details: [
        { label: "Motor Type", value: "Brushless DC Electric Motor" },
        { label: "Maximum Power", value: "12 kW (16.1 hp)" },
        { label: "Maximum Torque", value: "42 Nm" },
        { label: "Top Speed", value: "150 km/h (93 mph)" },
        { label: "Acceleration (0-60 km/h)", value: "3.2 seconds" },
      ],
    },
    {
      category: t("edmax.specs.battery"),
      details: [
        { label: "Battery Type", value: "Lithium-ion" },
        { label: "Battery Capacity", value: "7.2 kWh" },
        { label: "Voltage", value: "72V" },
        { label: "Charging Time (0-80%)", value: "20 minutes (Super Charge)" },
        { label: "Charging Time (0-100%)", value: "3 hours (Standard Outlet)" },
        { label: "Range", value: "120 km (75 miles)" },
      ],
    },
    {
      category: t("edmax.specs.brake"),
      details: [
        {
          label: "Front Brake",
          value: "Dual 320mm Disc with 4-piston Caliper",
        },
        {
          label: "Rear Brake",
          value: "Single 240mm Disc with 2-piston Caliper",
        },
        { label: "ABS", value: "Dual-channel ABS" },
        { label: "Regenerative Braking", value: "Yes, with adjustable levels" },
      ],
    },
    {
      category: t("edmax.specs.dimension"),
      details: [
        { label: "Length", value: "2,100 mm" },
        { label: "Width", value: "780 mm" },
        { label: "Height", value: "1,150 mm" },
        { label: "Seat Height", value: "780 mm" },
        { label: "Ground Clearance", value: "160 mm" },
        { label: "Wheelbase", value: "1,450 mm" },
        { label: "Weight", value: "185 kg" },
      ],
    },
    {
      category: t("edmax.specs.tire"),
      details: [
        { label: "Front Tire", value: "120/70 ZR17" },
        { label: "Rear Tire", value: "180/55 ZR17" },
        { label: "Tire Type", value: "Tubeless Radial" },
      ],
    },
    {
      category: t("edmax.specs.suspension"),
      details: [
        {
          label: "Front Suspension",
          value: "43mm USD Forks, fully adjustable, 120mm travel",
        },
        {
          label: "Rear Suspension",
          value: "Mono-shock, adjustable preload and rebound, 130mm travel",
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
