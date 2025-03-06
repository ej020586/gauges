import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { generateTicks, useGauge } from "../../hooks/useGauge";
import GaugeBackground from "./GaugeBackground";
import GaugeNeedle from "./GaugeNeedle";

interface RadialGaugeProps {
  minValue: number;
  maxValue: number;
  size?: number;
  startAngle?: number;
  endAngle?: number;
  majorTickCount?: number;
  className?: string;
  showText?: boolean;
}

const RadialGauge: React.FC<RadialGaugeProps> = ({
  minValue,
  maxValue,
  size = 400,
  startAngle = -120,
  endAngle = 120,
  majorTickCount = 12,
}) => {

  console.count("RadialGauge");

  const dimensions = useMemo(
    () => ({
      radius: size / 2,
      centerX: size / 2,
      tickLength: size * 0.05,
    }),
    [size]
  );

  const { majorTicks, minorTicks } = useMemo(
    () => {

      const angleRange = endAngle - startAngle;
      const valueRange = maxValue - minValue;

      return generateTicks(majorTickCount, 4, {
        startAngle,
        valueRange,
        minValue,
        maxValue,
        angleRange,
      })
    },
    [majorTickCount, startAngle, endAngle, minValue, maxValue]
  );

  const gaugeBackgroundDimensions = useMemo(
    () => {
      const dimensions = {
        radius: size / 2,
        centerX: size / 2,
        tickLength: size * 0.05,
        centerY: size / 2,
      }
      return dimensions;
    },
    [size]
  );

  return (
    <div style={{ width: size, height: size }} className={`relative`}>
      {/* Render the static background */}
      <GaugeBackground
        size={size}
        dimensions={gaugeBackgroundDimensions}
        majorTicks={majorTicks}
        minorTicks={minorTicks}
        majorTickCount={majorTickCount}
      />
      {/* Overlay the dynamic needle */}
      <GaugeNeedle size={size} centerX={dimensions.centerX} />
    </div>
  );
};

export default memo(RadialGauge);
