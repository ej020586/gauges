import React, { memo } from "react";
import RadialGaugeMotionAPI from "./RadialGaugeMotionAPI";
import { useGameDataStore } from "../store/useGameData";
import RadialGauge from "./RadialGauge/RadialGauge";
import { Needle } from "./RadialGauge/GaugeNeedle";
import GaugeLabel from "./GaugeLabel";
interface SpeedometerProps {}

const Speedometer: React.FC<SpeedometerProps> = () => {
  const speed = useGameDataStore((state) => state.speed);
  console.log("Speedometer", speed);
  return (
    <div className="relative">
      <RadialGauge
        value={speed ?? 0}
        minValue={0}
        maxValue={160}
        size={250}
        startAngle={-120}
        endAngle={90}
        majorTickCount={15}
      >
        <Needle
          size={250}
          value={speed ?? 0}
          minValue={0}
          maxValue={160}
          startAngle={-120}
          endAngle={90}
        />
      </RadialGauge>
      <GaugeLabel value={speed ?? 0} />
    </div>
  );
};

export default memo(Speedometer);
