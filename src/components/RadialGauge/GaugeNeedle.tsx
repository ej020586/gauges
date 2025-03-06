import React, {
  memo,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useNeedleAnimation } from "../../hooks/useNeedleAnimation";
import { useGameDataStore } from "../../store/useGameData";

interface GaugeNeedleProps {
  size: number;
  centerX: number;
}

const NeedleCap = memo(
  ({ size, centerX }: { size: number; centerX: number }) => (
    <circle r={size * 0.04} fill="#DC2626" cx={centerX} />
  )
);

const NeedleStyle = {
  originX: 0,
  originY: 1,
};

type ValueToAngleConfig = {
  minValue: number;
  maxValue: number;
  startAngle: number;
  endAngle: number;
  valueRange: number;
  angleRange: number;
};

const valToAngleMap = new Map<number, number>();

const valueToAngle = (
  val: number,
  { minValue, maxValue, startAngle, valueRange, angleRange }: ValueToAngleConfig
): number => {
  if (valToAngleMap.has(val)) {
    console.log(`returning cached angle for ${val}`);
    return valToAngleMap.get(val) || 0;
  }
  const boundedValue = Math.max(minValue, Math.min(maxValue, val));
  const normalizedValue = (boundedValue - minValue) / valueRange;
  const angle = Math.floor(startAngle + normalizedValue * angleRange);
  valToAngleMap.set(val, angle);
  return angle;
};

type NeedleProps = {
  size: number;
  value: number;
  minValue: number;
  maxValue: number;
  startAngle: number;
  endAngle: number;
};
export const Needle = memo(
  ({ size, value, minValue, maxValue, startAngle, endAngle }: NeedleProps) => {
    const mAngle = useMotionValue(0);

    useEffect(() => {
      const angleRange = endAngle - startAngle;
      const valueRange = maxValue - minValue;
      const angle = valueToAngle(value, {
        minValue,
        maxValue,
        startAngle,
        endAngle,
        valueRange,
        angleRange,
      });
      mAngle.set(angle);
    }, [value]);

    const y2 = useMemo(() => {
      return -size * 0.35;
    }, [size]);

    const strokeWidth = useMemo(() => {
      return size * 0.01;
    }, [size]);

    console.log(`Needle value: ${value}`);
    console.log(`mAngel ${mAngle.get()}`);
    return (
      <motion.g style={{ ...NeedleStyle, rotate: mAngle }}>
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={y2}
          stroke="#DC2626"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </motion.g>
    );
  }
);

const GaugeNeedle: React.FC<PropsWithChildren<GaugeNeedleProps>> = ({
  size,
  centerX,
  children,
}) => {
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
        {children}
        <NeedleCap size={size} centerX={0} />
      </g>
    </svg>
  );
};

export default memo(GaugeNeedle);
