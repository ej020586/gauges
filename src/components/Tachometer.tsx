import React from "react";
import RadialGauge from "./RadialGauge";
import RadialGaugeMotionAPI from "./RadialGaugeMotionAPI";

interface TachometerProps {
  value: number;
  redLine: number;
  className?: string;
  maxValue: number;
}

const useTachometerLogic = (value: number, redLine: number) => {
  const isInRedLine = value >= redLine;

  return {
    isInRedLine,
  };
};

const Tachometer: React.FC<TachometerProps> = ({
  value,
  redLine,
  maxValue,
  className,
}) => {
  const { isInRedLine } = useTachometerLogic(value, redLine);

  return (
    <div className="relative">
      <RadialGauge
        value={value}
        minValue={0}
        maxValue={maxValue}
        className={className}
        size={250}
        startAngle={-120}
        endAngle={60}
        majorTickCount={8}
        showText={false}
      />
      {/* Red line indicator light */}
      <div
        className={`absolute top-1/2 right-4 w-4 h-4 rounded-full ${
          isInRedLine ? "bg-red-600 animate-pulse" : "bg-red-200"
        }`}
        title="Red Line Indicator"
      />
    </div>
  );
};

export default Tachometer;
