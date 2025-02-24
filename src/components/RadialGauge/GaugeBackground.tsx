import React, { memo, useMemo } from "react";

interface GaugeBackgroundProps {
  size: number;
  dimensions: {
    radius: number;
    centerX: number;
    centerY: number;
    tickLength: number;
  };
  majorTicks: { angle: number; value: number }[];
  minorTicks: { angle: number }[];
  majorTickCount: number;
}

const GaugeBackground: React.FC<GaugeBackgroundProps> = memo(
  ({ size, dimensions, majorTicks, minorTicks }) => {
    return (
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        {majorTicks.map((tick, index) => {
          const textRotate = -Number(tick.angle).toFixed(2);
          const textY = dimensions.radius * 0.15 + dimensions.tickLength + 20;
          return (
            <g
              key={`major-${index}`}
              transform={`rotate(${tick.angle} ${dimensions.centerX} ${dimensions.radius})`}
            >
              <line
                x1={dimensions.centerX}
                y1={dimensions.radius * 0.15}
                x2={dimensions.centerX}
                y2={dimensions.radius * 0.15 + dimensions.tickLength}
                stroke="#E5E7EB"
                strokeWidth={2}
              />
              <text
                x={dimensions.centerX}
                y={textY}
                fill="#E5E7EB"
                fontSize={size * 0.035}
                textAnchor="middle"
                transform={`rotate(${textRotate} ${dimensions.centerX} ${textY})`}
              >
                {Math.round(tick.value)}
              </text>
            </g>
          );
        })}
        {minorTicks.map((tick, index) => (
          <g
            key={`minor-${index}`}
            transform={`rotate(${tick.angle} ${dimensions.centerX} ${dimensions.radius})`}
          >
            <line
              x1={dimensions.centerX}
              y1={dimensions.radius * 0.15}
              x2={dimensions.centerX}
              y2={dimensions.radius * 0.15 + dimensions.tickLength * 0.5}
              stroke="#9CA3AF"
              strokeWidth={1}
            />
          </g>
        ))}
      </svg>
    );
  }
);

export default GaugeBackground;
