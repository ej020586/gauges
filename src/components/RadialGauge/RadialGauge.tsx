import React, { memo, useEffect, useMemo } from "react";
import { useGauge } from "../../hooks/useGauge";
import GaugeBackground from "./GaugeBackground";
import GaugeNeedle from "./GaugeNeedle";

interface RadialGaugeProps {
  value: number;
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
  value,
  minValue,
  maxValue,
  size = 400,
  startAngle = -120,
  endAngle = 120,
  majorTickCount = 12,
  className = "",
  showText = true,
}) => {
  const { generateTicks, setValue, angle, ...gauge } = useGauge(value, {
    minValue,
    maxValue,
    startAngle,
    endAngle,
  });

  const dimensions = useMemo(
    () => ({
      radius: size / 2,
      centerX: size / 2,
      tickLength: size * 0.05,
    }),
    [size]
  );

  const { majorTicks, minorTicks } = useMemo(
    () => generateTicks(majorTickCount, 4),
    [generateTicks, majorTickCount]
  );

  const gaugeBackgroundDimensions = useMemo(
    () => ({
      radius: dimensions.radius,
      centerX: dimensions.centerX,
      tickLength: dimensions.tickLength,
      centerY: dimensions.radius,
    }),
    [dimensions]
  );

  useEffect(() => {
    setValue(value);
  }, [value, setValue]);

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative ${className}`}
    >
      {/* Render the static background */}
      <GaugeBackground
        size={size}
        dimensions={gaugeBackgroundDimensions}
        majorTicks={majorTicks}
        minorTicks={minorTicks}
        majorTickCount={majorTickCount}
      />
      {/* Overlay the dynamic needle */}
      <GaugeNeedle size={size} angle={angle} centerX={dimensions.centerX} />
      {showText && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <div className="bg-black px-4 py-2">
            <span className="font-mono text-2xl text-white tabular-nums">
              {value.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(RadialGauge);
