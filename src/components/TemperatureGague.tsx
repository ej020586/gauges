import React, { memo } from "react";
import RadialGaugeBasic from "./RadialGauageBasic";
import { useGameDataStore } from "../store/useGameData";

interface TemperatureGaugeProps {
  value: number;
}

const TemperatureGauge = () => {
  const temperature = useGameDataStore((state) => state.watertemp || 0);
  console.log("temperature", temperature);
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
