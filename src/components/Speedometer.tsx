import React, { memo } from "react";
import RadialGauge from "./RadialGauge";
import RadialGaugeMotionAPI from "./RadialGaugeMotionAPI";
import useStore from "../store";
interface SpeedometerProps {
}

const Speedometer: React.FC<SpeedometerProps> = () => {
  const speed = useStore((state) => state.speed);
  return (
    <div className="relative">
      <RadialGaugeMotionAPI
        value={speed}
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
