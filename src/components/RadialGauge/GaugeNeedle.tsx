import React, { memo } from "react";
import { motion } from "motion/react";
import { useNeedleAnimation } from "../../hooks/useNeedleAnimation";

interface GaugeNeedleProps {
  size: number;
  angle: number;
  centerX: number;
}

const NeedleCap = memo(
  ({ size, centerX }: { size: number; centerX: number }) => (
    <circle r={size * 0.04} fill="#DC2626" cx={centerX} />
  )
);

const Needle = memo(({ size, angle }: { size: number; angle: number }) => {
  const controls = useNeedleAnimation(angle);

  return (
    <motion.g
      animate={controls}
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
  );
});

const GaugeNeedle: React.FC<GaugeNeedleProps> = memo(
  ({ size, angle, centerX }) => {
    console.log("centerX : ", centerX);
    console.log("angle : ", angle);
    return (
      <svg
        width={size}
        height={size}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none", // if you want to ignore mouse events on the needle layer
        }}
      >
        <g transform={`translate(${centerX} ${centerX})`}>
          <Needle size={size} angle={angle} />
          <NeedleCap size={size} centerX={0} />
        </g>
      </svg>
    );
  }
);

export default GaugeNeedle;
