// import { BikeSpecs } from "@/app/types/bike";

export interface SpecificationCategory {
  title: string;
  key: string;
  specs: SpecificationDetail[];
}

export interface SpecificationDetail {
  key: string;
  label: string;
}

export const createSpecifications = (
  t: (key: string) => string
): SpecificationCategory[] => [
  {
    title: t("specs.category.engine"),
    key: "engine",
    specs: [
      { key: "motorType", label: t("specs.category.engine.motorType") },
      { key: "motorPower", label: t("specs.category.engine.motorPower") },
      { key: "topSpeed", label: t("specs.category.engine.topSpeed") },
      { key: "acceleration", label: t("specs.category.engine.acceleration") },
    ],
  },
  {
    title: t("specs.category.battery"),
    key: "battery",
    specs: [
      { key: "batteryType", label: t("specs.category.battery.batteryType") },
      {
        key: "batteryCapacity",
        label: t("specs.category.battery.batteryCapacity"),
      },
      { key: "voltage", label: t("specs.category.battery.voltage") },
      {
        key: "chargingTimeSuperCharge",
        label: t("specs.category.battery.chargingTimeSuperCharge"),
      },
      {
        key: "chargingTimeHome",
        label: t("specs.category.battery.chargingTimeHome"),
      },
      {
        key: "range",
        label: t("specs.category.battery.range"),
      },
    ],
  },
  {
    title: t("specs.category.brake"),
    key: "brake",
    specs: [
      { key: "frontBrake", label: t("specs.category.brake.frontBrake") },
      { key: "rearBrake", label: t("specs.category.brake.rearBrake") },
      { key: "cbsSupport", label: t("specs.category.brake.cbsSupport") },
    ],
  },
  {
    title: t("specs.category.dimension"),
    key: "dimension",
    specs: [
      { key: "length", label: t("specs.category.dimension.length") },
      { key: "width", label: t("specs.category.dimension.width") },
      { key: "height", label: t("specs.category.dimension.height") },
      { key: "wheelbase", label: t("specs.category.dimension.wheelbase") },
      {
        key: "groundClearance",
        label: t("specs.category.dimension.groundClearance"),
      },
      { key: "seatHeight", label: t("specs.category.dimension.seatHeight") },
      { key: "weight", label: t("specs.category.dimension.weight") },
    ],
  },
  {
    title: t("specs.category.tire"),
    key: "tire",
    specs: [
      { key: "frontTire", label: t("specs.category.tire.frontTire") },
      { key: "rearTire", label: t("specs.category.tire.rearTire") },
    ],
  },
  {
    title: t("specs.category.suspension"),
    key: "suspension",
    specs: [
      {
        key: "frontSuspension",
        label: t("specs.category.suspension.frontSuspension"),
      },
      {
        key: "rearSuspension",
        label: t("specs.category.suspension.rearSuspension"),
      },
    ],
  },
];

export const getSpecificationValue = (
  bike: string,
  categoryKey: string,
  specKey: string,
  t: (key: string) => string
): string => {
  const translationKey = `${bike}.specs.${categoryKey}.${specKey}`;
  return t(translationKey) || "-";
};
