import React, { useEffect } from "react";
import { useGaugeAnimate } from "../hooks/useGaugeAnimate";

interface RadialGaugeBasicProps {
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

const RadialGaugeBasic: React.FC<RadialGaugeBasicProps> = ({
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
  const gauge = useGaugeAnimate(value, {
    minValue,
    maxValue,
    startAngle,
    endAngle,
  });

  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  const tickLength = size * 0.05;
  const { majorTicks, minorTicks } = gauge.generateTicks(majorTickCount, 4);

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
        <g
          transform={`translate(${centerX} ${centerY}) rotate(${gauge.angle})`}
        >
          <g>
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-size * 0.35}
              stroke="#DC2626"
              strokeWidth={size * 0.01}
              strokeLinecap="round"
            />
          </g>
          {/* Center cap */}
          <circle r={size * 0.04} fill="#DC2626" />
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

export default RadialGaugeBasic;
