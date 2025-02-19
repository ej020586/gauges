import React, { memo } from "react";
import RadialGauge from "./RadialGauge";
import RadialGaugeMotionAPI from "./RadialGaugeMotionAPI";
import useStore from "../store";
import { useGameDataStore } from "../store/useGameData";

interface TachometerProps {
  redLine: number;
  maxValue: number;
}

const Tachometer: React.FC<TachometerProps> = ({ redLine, maxValue }) => {
  const rpm = useGameDataStore((state) => state.rpm || 0);
  const isInRedLine = rpm >= redLine;

  return (
    <div className="relative">
      <RadialGauge
        value={rpm}
        minValue={0}
        maxValue={maxValue}
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
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className="bg-black px-4 py-2">
          <span className="font-mono text-2xl text-white tabular-nums">
            {rpm.toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Tachometer);
