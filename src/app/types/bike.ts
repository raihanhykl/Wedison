export interface BikeSpecs {
  id: string;
  name: string;
  image: string;
  engine: {
    motorType: string;
    motorPower: string;
    topSpeed: string;
    acceleration: string;
  };
  battery: {
    batteryType: string;
    batteryCapacity: string;
    voltage: string;
    superChargeTime: string;
    homeChargeTime: string;
    cruisingRange: string;
  };
  brake: {
    frontBrake: string;
    rearBrake: string;
    cbs: string;
  };
  dimension: {
    length: string;
    width: string;
    height: string;
    wheelbase: string;
    groundClearance: string;
    seatHeight: string;
    weight: string;
  };
  tire: {
    frontTire: string;
    rearTire: string;
  };
  suspension: {
    frontSuspension: string;
    rearSuspension: string;
  };
}

export interface ComparisonTableProps {
  //   bikes: BikeSpecs[];
  primaryBikeId: string;
  mode?: "overview" | "comparison";
}
