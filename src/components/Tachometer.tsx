import React, { memo, useEffect, useRef } from "react";
import RadialGauge from "./RadialGauge/RadialGauge";
import RadialGaugeMotionAPI from "./RadialGaugeMotionAPI";
import useStore from "../store";
import { useGameDataStore } from "../store/useGameData";
import { Needle } from "./RadialGauge/GaugeNeedle";
import GaugeLabel from "./GaugeLabel";

interface TachometerProps {
  redLine: number;
  maxValue: number;
}

const Tachometer: React.FC<TachometerProps> = ({ redLine, maxValue }) => {
  const rpm = useGameDataStore((state) => state.rpm || 0);
  const isInRedLine = rpm >= redLine;

  console.count("Tachmoeter");

  return (
    <div className="relative">
      <RadialGauge
        minValue={0}
        maxValue={maxValue}
        size={300}
        startAngle={-120}
        endAngle={60}
        majorTickCount={8}
        showText={false}
        value={rpm}
      >
        <Needle
          size={250}
          value={rpm}
          minValue={0}
          maxValue={maxValue}
          startAngle={-120}
          endAngle={60}
        />
      </RadialGauge>
      {/* Red line indicator light */}
      <div
        className={`absolute top-1/2 right-4 w-4 h-4 rounded-full ${
          isInRedLine ? "bg-red-600 animate-pulse" : "bg-red-200"
        }`}
        title="Red Line Indicator"
      />
      <GaugeLabel value={rpm} />
    </div>
  );
};

export default memo(Tachometer);
