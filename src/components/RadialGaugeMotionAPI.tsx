import React, { memo, useEffect } from "react";
import { motion, useAnimate } from "motion/react";
import { useGauge } from "../hooks/useGauge";
import { transform } from "motion";

interface RadialGaugeMotionAPIProps {
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

const RadialGaugeMotionAPI: React.FC<RadialGaugeMotionAPIProps> = ({
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

  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  const tickLength = size * 0.05;
  const circleRadius = 7.5;
  const originX = 0.5;
  const originY = 1 - (circleRadius * 2) / size;
  const { majorTicks, minorTicks } = gauge.generateTicks(majorTickCount, 4);

  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animateNeedle = async () => {
      console.log("originY", originY);
      await animate(
        scope.current,
        {
          transform: `rotate(${gauge.angle}deg)`,
          originX,
          originY,
          rotate: gauge.angle,
        },
        {
          duration: 0.5,
          ease: "easeOut",
          onComplete: () => {
            console.log("animateNeedle complete");
          },
        }
      );
    };

    animateNeedle();
  }, [gauge.angle]);

  useEffect(() => {
    gauge.setValue(value);
  }, [value]);

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative ${className}`}
    >
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        {/* Tick marks */}
        {majorTicks.map((tick, index) => {
          const textRotate = -Number(tick.angle).toFixed(2);
          const textY = radius * 0.15 + tickLength + 20;
          return (
            <g
              key={`major-${index}`}
              transform={`rotate(${tick.angle} ${centerX} ${centerY})`}
            >
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
        })}

        {minorTicks.map((tick, index) => (
          <g
            key={`minor-${index}`}
            transform={`rotate(${tick.angle} ${centerX} ${centerY})`}
          >
            <line
              x1={centerX}
              y1={radius * 0.15}
              x2={centerX}
              y2={radius * 0.15 + tickLength * 0.5}
              stroke="#9CA3AF"
              strokeWidth={1}
            />
          </g>
        ))}

        {/* Needle */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          <motion.g ref={scope} style={{ originX, originY }}>
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-radius * 0.75}
              stroke="#DC2626"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <circle cx={0} cy={0} r={circleRadius} fill="#DC2626" />
          </motion.g>
        </g>
      </svg>

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

export default memo(RadialGaugeMotionAPI);
