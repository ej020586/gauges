import React, { memo } from "react";
import RadialGaugeMotionAPI from "./RadialGaugeMotionAPI";
import { useGameDataStore } from "../store/useGameData";
interface SpeedometerProps {}

const Speedometer: React.FC<SpeedometerProps> = () => {
  const speed = useGameDataStore((state) => state.speed);
  console.log("Speedometer", speed);
  return (
    <div className="relative">
      <RadialGaugeMotionAPI
        value={speed ?? 0}
        minValue={0}
        maxValue={160}
        size={250}
        startAngle={-120}
        endAngle={90}
        majorTickCount={15}
      />
    </div>
  );
};

export default memo(Speedometer);
