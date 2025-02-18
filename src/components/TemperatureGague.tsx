import React, { memo } from "react";
import RadialGaugeBasic from "./RadialGauageBasic";
import useStore from "../store";

interface TemperatureGaugeProps {
  value: number;
}

const TemperatureGauge = () => {
  const temperature = useStore((state) => state.temperature);
  return (
    <RadialGaugeBasic
      value={temperature}
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
