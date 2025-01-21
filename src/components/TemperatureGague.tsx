import React, { memo } from "react";
import RadialGaugeBasic from "./RadialGauageBasic";

interface TemperatureGaugeProps {
  value: number;
}

const TemperatureGauge = ({ value = 15 }: TemperatureGaugeProps) => {
  return (
    <RadialGaugeBasic
      value={value}
      minValue={0}
      maxValue={320}
      majorTickCount={4}
      startAngle={-90}
      endAngle={90}
      size={200}
    />
  );
};

export default memo(TemperatureGauge);
