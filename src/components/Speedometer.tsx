import React from "react";
import RadialGauge from "./RadialGauge";
import RadialGaugeMotionAPI from "./RadialGaugeMotionAPI";

interface SpeedometerProps {
  value: number;
  className?: string;
}

const Speedometer: React.FC<SpeedometerProps> = ({ value, className }) => {
  return (
    <div className="relative">
      <RadialGaugeMotionAPI
        value={value}
        minValue={0}
        maxValue={160}
        className={className}
        size={250}
        startAngle={-120}
        endAngle={90}
        majorTickCount={15}
      />
    </div>
  );
};

export default Speedometer;
