import React, { memo, useEffect, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { useGauge } from "../hooks/useGauge";

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

// Memoize static SVG components
const NeedleCap = memo(
  ({ size, centerX }: { size: number; centerX: number }) => (
    <circle r={size * 0.04} fill="#DC2626" cx={centerX} />
  )
);

const Needle = memo(({ size, angle }: { size: number; angle: number }) => (
  <motion.g
    animate={{ rotate: angle }}
    transition={{
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 0.5,
    }}
    style={{
      originX: 0,
      originY: 1,
    }}
  >
    <line
      x1={0}
      y1={0}
      x2={0}
      y2={-size * 0.35}
      stroke="#DC2626"
      strokeWidth={size * 0.01}
      strokeLinecap="round"
    />
  </motion.g>
));

const ValueDisplay = memo(({ value }: { value: number }) => (
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
    <div className="bg-black px-4 py-2">
      <span className="font-mono text-2xl text-white tabular-nums">
        {value.toFixed(2)}
      </span>
    </div>
  </div>
));

const MajorTick = memo(
  ({
    tick,
    centerX,
    radius,
    tickLength,
    size,
  }: {
    tick: { angle: number; value: number };
    centerX: number;
    radius: number;
    tickLength: number;
    size: number;
  }) => {
    const textRotate = -Number(tick.angle).toFixed(2);
    const textY = radius * 0.15 + tickLength + 20;

    return (
      <g transform={`rotate(${tick.angle} ${centerX} ${radius})`}>
        <line
          x1={centerX}
          y1={radius * 0.15}
          x2={centerX}
          y2={radius * 0.15 + tickLength}
          stroke="#E5E7EB"
          strokeWidth={2}
        />
        <text
          x={centerX}
          y={textY}
          fill="#E5E7EB"
          fontSize={size * 0.035}
          textAnchor="middle"
          transform={`rotate(${textRotate} ${centerX} ${textY})`}
        >
          {Math.round(tick.value)}
        </text>
      </g>
    );
  }
);

const MinorTick = memo(
  ({
    tick,
    centerX,
    radius,
    tickLength,
  }: {
    tick: { angle: number };
    centerX: number;
    radius: number;
    tickLength: number;
  }) => (
    <g transform={`rotate(${tick.angle} ${centerX} ${radius})`}>
      <line
        x1={centerX}
        y1={radius * 0.15}
        x2={centerX}
        y2={radius * 0.15 + tickLength * 0.5}
        stroke="#9CA3AF"
        strokeWidth={1}
      />
    </g>
  )
);

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
  const gauge = useGauge(value, {
    minValue,
    maxValue,
    startAngle,
    endAngle,
  });

  const dimensions = useMemo(
    () => ({
      radius: size / 2,
      centerX: size / 2,
      centerY: size / 2,
      tickLength: size * 0.05,
    }),
    [size]
  );

  const { majorTicks, minorTicks } = useMemo(
    () => gauge.generateTicks(majorTickCount, 4),
    [gauge, majorTickCount]
  );

  useEffect(() => {
    gauge.setValue(value);
  }, [value, gauge]);

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative ${className}`}
    >
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        {/* Tick marks */}
        {majorTicks.map((tick, index) => (
          <MajorTick
            key={`major-${index}`}
            tick={tick}
            centerX={dimensions.centerX}
            radius={dimensions.radius}
            tickLength={dimensions.tickLength}
            size={size}
          />
        ))}

        {minorTicks.map((tick, index) => (
          <MinorTick
            key={`minor-${index}`}
            tick={tick}
            centerX={dimensions.centerX}
            radius={dimensions.radius}
            tickLength={dimensions.tickLength}
          />
        ))}

        {/* Needle */}
        <g transform={`translate(${dimensions.centerX} ${dimensions.centerY})`}>
          <Needle size={size} angle={gauge.angle} />
          <NeedleCap size={size} centerX={dimensions.centerX} />
        </g>
      </svg>

      {showText && <ValueDisplay value={value} />}
    </div>
  );
};

export default memo(RadialGauge);
