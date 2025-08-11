"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/app/lib/language-context";

export default function SpecificationsAccordion({
  motorType,
}: {
  motorType: string;
}) {
  const { t } = useLanguage();

  const specifications = [
    {
      category: t("specs.category.engine"),
      details: [
        {
          label: t("specs.category.engine.motorType"),
          value: t(`${motorType}.specs.engine.motorType`),
        },
        {
          label: t("specs.category.engine.motorPower"),
          value: t(`${motorType}.specs.engine.motorPower`),
        },
        {
          label: t("specs.category.engine.topSpeed"),
          value: t(`${motorType}.specs.engine.topSpeed`),
        },
        // { label: "Top Speed", value: "150 km/h (93 mph)" },
        {
          label: t("specs.category.engine.acceleration"),
          value: t(`${motorType}.specs.engine.acceleration`),
        },
      ],
    },
    {
      category: t("specs.category.battery"),
      details: [
        {
          label: t("specs.category.battery.batteryType"),
          value: t(`${motorType}.specs.battery.batteryType`),
        },
        {
          label: t("specs.category.battery.batteryCapacity"),
          value: t(`${motorType}.specs.battery.batteryCapacity`),
        },
        {
          label: t("specs.category.battery.voltage"),
          value: t(`${motorType}.specs.battery.voltage`),
        },
        {
          label: t("specs.category.battery.chargingTimeSuperCharge"),
          value: t(`${motorType}.specs.battery.chargingTimeSuperCharge`),
        },
        {
          label: t("specs.category.battery.chargingTimeHome"),
          value: t(`${motorType}.specs.battery.chargingTimeHome`),
        },
        {
          label: t("specs.category.battery.range"),
          value: t(`${motorType}.specs.battery.range`),
        },
      ],
    },
    {
      category: t("specs.category.brake"),
      details: [
        {
          label: t("specs.category.brake.frontBrake"),
          value: t(`${motorType}.specs.brake.frontBrake`),
        },
        {
          label: t("specs.category.brake.rearBrake"),
          value: t(`${motorType}.specs.brake.rearBrake`),
        },
        {
          label: t("specs.category.brake.cbsSupport"),
          value: t(`${motorType}.specs.brake.cbsSupport`),
        },
        // { label: "Regenerative Braking", value: "Yes, with adjustable levels" },
      ],
    },
    {
      category: t("specs.category.dimension"),
      details: [
        {
          label: t("specs.category.dimension.length"),
          value: t(`${motorType}.specs.dimension.length`),
        },
        {
          label: t("specs.category.dimension.width"),
          value: t(`${motorType}.specs.dimension.width`),
        },
        {
          label: t("specs.category.dimension.height"),
          value: t(`${motorType}.specs.dimension.height`),
        },
        {
          label: t("specs.category.dimension.wheelbase"),
          value: t(`${motorType}.specs.dimension.wheelbase`),
        },
        {
          label: t("specs.category.dimension.groundClearance"),
          value: t(`${motorType}.specs.dimension.groundClearance`),
        },
        {
          label: t("specs.category.dimension.seatHeight"),
          value: t(`${motorType}.specs.dimension.seatHeight`),
        },
        {
          label: t("specs.category.dimension.weight"),
          value: t(`${motorType}.specs.dimension.weight`),
        },
      ],
    },
    {
      category: t("specs.category.tire"),
      details: [
        {
          label: t("specs.category.tire.frontTire"),
          value: t(`${motorType}.specs.tire.frontTire`),
        },
        {
          label: t("specs.category.tire.rearTire"),
          value: t(`${motorType}.specs.tire.rearTire`),
        },
        // { label: "Tire Type", value: "Tubeless Radial" },
      ],
    },
    {
      category: t("specs.category.suspension"),
      details: [
        {
          label: t("specs.category.suspension.frontSuspension"),
          value: t(`${motorType}.specs.suspension.frontSuspension`),
        },
        {
          label: t("specs.category.suspension.rearSuspension"),
          value: t(`${motorType}.specs.suspension.rearSuspension`),
        },
      ],
    },
  ];

  return (
    <Accordion
      type="multiple"
      // collapsible
      defaultValue={[
        "item-0",
        "item-1",
        "item-2",
        "item-3",
        "item-4",
        "item-5",
      ]}
      className="w-full transition-all duration-300"
    >
      {specifications.map((spec, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-b border-gray-200"
        >
          <AccordionTrigger className="text-lg font-medium py-4 hover:text-[var(--primary)] transition-colors">
            {spec.category}
          </AccordionTrigger>
          <AccordionContent className="pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
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
