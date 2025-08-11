import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { useLanguage } from "../lib/language-context";

export default function SpecTable() {
  const { t } = useLanguage();
  const specifications = [
    "engine.motorType",
    "engine.motorPower",
    "engine.topSpeed",
    "engine.acceleration",

    "battery.batteryType",
    "battery.batteryCapacity",
    "battery.voltage",
    "battery.chargingTimeSuperCharge",
    "battery.chargingTimeHome",
    "battery.range",

    "brake.frontBrake",
    "brake.rearBrake",
    "brake.cbsSupport",

    "dimension.length",
    "dimension.width",
    "dimension.height",
    "dimension.wheelbase",
    "dimension.groundClearance",
    "dimension.seatHeight",
    "dimension.weight",

    "tire.frontTire",
    "tire.rearTire",

    "suspension.frontSuspension",
    "suspension.rearSuspension",
  ];

  return (
    <div className=" container w-full mx-auto">
      <Table>
        <TableHeader>
          <TableRow className=" *:text-3xl *:font-normal mb-6 border-none hover:bg-transparent">
            <TableHead></TableHead>
            <TableHead>Mini</TableHead>
            <TableHead>Athena</TableHead>
            <TableHead>Victory</TableHead>
            <TableHead>EDPower</TableHead>
          </TableRow>
        </TableHeader>
        <TableHeader>
          <TableRow className=" bg-amber-50 border-black border-t-1">
            <TableHead>ENGINE</TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* <TableHead className=" bg-primary/30">ENGINE</TableHead>
          <TableHead className=" bg-primary/30"></TableHead>
          <TableHead className=" bg-primary/30"></TableHead>
          <TableHead className=" bg-primary/30"></TableHead>
          <TableHead className=" bg-primary/30"></TableHead> */}
          {specifications.map((spec, index) => (
            <TableRow
              key={index}
              className=" border-none"
              //   className={` ${
              //     index % 2 === 0 ? "bg-primary/20" : ""
              //   } *:text-black`}
            >
              <TableCell className=" font-semibold">
                {t(`specs.category.${spec}`)}
              </TableCell>
              <TableCell className=" font-medium">
                {t(`mini.specs.${spec}`)}
              </TableCell>
              <TableCell className=" font-medium">
                {t(`athena.specs.${spec}`)}
              </TableCell>
              <TableCell className=" font-medium">
                {t(`victory.specs.${spec}`)}
              </TableCell>
              <TableCell className=" font-medium">
                {t(`edpower.specs.${spec}`)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
