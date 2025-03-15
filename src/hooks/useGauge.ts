import { useState, useEffect, useMemo, useCallback } from "react";

interface GaugeConfig {
  minValue: number;
  maxValue: number;
  startAngle?: number;
  endAngle?: number;
}

interface GaugeSegment {
  from: number;
  to: number;
  color: string;
}

interface TickMark {
  angle: number;
  value: number;
}

// Keep these utility functions as they are since they're not frequently called
const calculateArcPath = (radius: number, { startAngle, endAngle }: { startAngle: number, endAngle: number }): string => {
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;

  const x1 = radius + radius * Math.cos(startRad);
  const y1 = radius + radius * Math.sin(startRad);
  const x2 = radius + radius * Math.cos(endRad);
  const y2 = radius + radius * Math.sin(endRad);

  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
};

// const calculateSegmentPath = (radius: number, { startAngle, endAngle }: { startAngle: number, endAngle: number }): string => {
//   const startRad = ((startAngle - 180) * Math.PI) / 180;
//   const endRad = ((endAngle - 180) * Math.PI) / 180;

//   const x1 = radius + radius * Math.cos(startRad);
//   const y1 = radius + radius * Math.sin(startRad);
//   const x2 = radius + radius * Math.cos(endRad);
//   const y2 = radius + radius * Math.sin(endRad);

//   const largeArc = valueToAngle(toValue) - valueToAngle(fromValue) <= 180 ? 0 : 1;

//   return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
// };

type GenerateTicksConfig = {
  startAngle: number;
  valueRange: number;
  minValue: number;
  maxValue: number;
  angleRange: number;
}

export const generateTicks = (targetMajorTickCount: number, minorTicksPerMajor: number, { startAngle, valueRange, minValue, maxValue, angleRange }: GenerateTicksConfig) => {
  const increment = calculateRoundingIncrement(valueRange, targetMajorTickCount);
  const startVal = Math.ceil(minValue / increment) * increment;
  const endVal = Math.floor(maxValue / increment) * increment;
  const actualMajorTickCount = Math.floor((endVal - startVal) / increment) + 1;

  const majorTicks: TickMark[] = [];
  const minorTicks: TickMark[] = [];

  for (let i = 0; i < actualMajorTickCount; i++) {
    const tickValue = startVal + i * increment;
    const normalizedPosition = (tickValue - minValue) / valueRange;
    const angle = startAngle + normalizedPosition * angleRange;

    majorTicks.push({ angle, value: tickValue });

    if (i < actualMajorTickCount - 1) {
      const minorIncrement = increment / (minorTicksPerMajor + 1);
      for (let j = 1; j <= minorTicksPerMajor; j++) {
        const minorValue = tickValue + j * minorIncrement;
        const minorNormalizedPosition = (minorValue - minValue) / valueRange;
        const minorAngle = startAngle + minorNormalizedPosition * angleRange;
        minorTicks.push({ angle: minorAngle, value: minorValue });
      }
    }
  }

  return { majorTicks, minorTicks };
}

export const useGauge = (initialValue: number, config: GaugeConfig) => {
  const [value, _setValue] = useState(initialValue);
  const { minValue, maxValue, startAngle = -120, endAngle = 120 } = config;

  // Memoize config-dependent calculations
  const angleRange = useMemo(() => endAngle - startAngle, [startAngle, endAngle]);
  const valueRange = useMemo(() => maxValue - minValue, [maxValue, minValue]);

  const setValue = useCallback((val: number) => {
    const clampedValue = Math.min(Math.max(val, minValue), maxValue);
    _setValue(clampedValue);
  }, [minValue, maxValue]);

  // Memoize the value to angle conversion
  const valueToAngle = useCallback((val: number): number => {
    const boundedValue = Math.max(minValue, Math.min(maxValue, val));
    const normalizedValue = (boundedValue - minValue) / valueRange;
    return Math.floor(startAngle + normalizedValue * angleRange);
  }, [minValue, maxValue, startAngle, angleRange, valueRange]);

  // Memoize the angle to value conversion
  const angleToValue = useCallback((angle: number): number => {
    const normalizedAngle = (-angle - 90 - startAngle) / angleRange;
    return minValue + normalizedAngle * valueRange;
  }, [minValue, startAngle, angleRange, valueRange]);

  // Memoize the current angle
  const angle = useMemo(() => valueToAngle(value), [value, valueToAngle]);

  // Memoize the tick generation function




  const state = useMemo(() => ({
    value,
    setValue,
    angle,
    calculateArcPath,
    generateTicks,
    valueToAngle,
    angleToValue,
  }), [value, setValue, angle, calculateArcPath, generateTicks, valueToAngle, angleToValue]);

  return state;
};

// Helper function moved outside the hook since it doesn't depend on hook state
const calculateRoundingIncrement = (range: number, targetTickCount: number): number => {
  const roughIncrement = range / (targetTickCount - 1);
  const magnitude = Math.floor(Math.log10(roughIncrement));
  const normalized = roughIncrement / Math.pow(10, magnitude);

  const niceIncrements = [1, 2, 2.5, 5, 10, 100, 500, 1000];
  const niceIncrement = niceIncrements.reduce((prev, curr) =>
    Math.abs(curr - normalized) < Math.abs(prev - normalized) ? curr : prev
  );

  return niceIncrement * Math.pow(10, magnitude);
};
