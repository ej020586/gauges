import React, { memo } from "react";
import RadialGaugeBasic from "./RadialGauageBasic";
import { useGameDataStore } from "../store/useGameData";
import RadialGauge from "./RadialGauge/RadialGauge";

interface TemperatureGaugeProps {
  value: number;
}

const TemperatureGauge = () => {
  const temperature = useGameDataStore((state) => state.watertemp || 0);
  console.log("temperature", temperature);
  return (
    <RadialGauge
      value={temperature}
      minValue={50}
      maxValue={130}
      majorTickCount={4}
      startAngle={-90}
      endAngle={45}
      size={200}
    />
  );
};

export default memo(TemperatureGauge);
