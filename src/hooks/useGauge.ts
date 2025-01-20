import { useState, useEffect } from "react";

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

export const useGauge = (initialValue: number, config: GaugeConfig) => {
  const [value, setValue] = useState(initialValue);
  const [targetValue, setTargetValue] = useState(initialValue);

  const { minValue, maxValue, startAngle = -120, endAngle = 120 } = config;

  // Convert value to angle for needle rotation
  const valueToAngle = (val: number): number => {
    // Ensure the value is within bounds
    const boundedValue = Math.max(minValue, Math.min(maxValue, val));
    const normalizedValue = (boundedValue - minValue) / (maxValue - minValue);
    // Map the value to the angle range
    return startAngle + normalizedValue * (endAngle - startAngle);
  };

  // Convert angle to value
  const angleToValue = (angle: number): number => {
    const normalizedAngle =
      (-angle - 90 - startAngle) / (endAngle - startAngle);
    return minValue + normalizedAngle * (maxValue - minValue);
  };

  // Calculate the SVG path for the gauge arc
  const calculateArcPath = (radius: number): string => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Calculate the SVG path for a segment of the gauge
  const calculateSegmentPath = (
    radius: number,
    fromValue: number,
    toValue: number
  ): string => {
    const startRad = ((valueToAngle(fromValue) - 180) * Math.PI) / 180;
    const endRad = ((valueToAngle(toValue) - 180) * Math.PI) / 180;

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    const largeArc =
      valueToAngle(toValue) - valueToAngle(fromValue) <= 180 ? 0 : 1;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Helper function to determine appropriate rounding increment
  const calculateRoundingIncrement = (
    range: number,
    targetTickCount: number
  ): number => {
    const roughIncrement = range / (targetTickCount - 1);
    const magnitude = Math.floor(Math.log10(roughIncrement));
    const normalized = roughIncrement / Math.pow(10, magnitude);

    // Choose the nearest nice number from common increments
    const niceIncrements = [1, 2, 2.5, 5, 10, 100, 500, 1000];
    const niceIncrement = niceIncrements.reduce((prev, curr) =>
      Math.abs(curr - normalized) < Math.abs(prev - normalized) ? curr : prev
    );

    return niceIncrement * Math.pow(10, magnitude);
  };

  // Generate tick marks positions with nice rounded values
  const generateTicks = (
    targetMajorTickCount: number,
    minorTicksPerMajor: number
  ) => {
    const majorTicks: TickMark[] = [];
    const minorTicks: TickMark[] = [];

    // Calculate nice increment for major ticks
    const increment = calculateRoundingIncrement(
      maxValue - minValue,
      targetMajorTickCount
    );

    // Adjust start value to nearest nice number
    const startVal = Math.ceil(minValue / increment) * increment;
    const endVal = Math.floor(maxValue / increment) * increment;
    const actualMajorTickCount =
      Math.floor((endVal - startVal) / increment) + 1;

    for (let i = 0; i < actualMajorTickCount; i++) {
      const tickValue = startVal + i * increment;
      const normalizedPosition = (tickValue - minValue) / (maxValue - minValue);
      const angle = startAngle + normalizedPosition * (endAngle - startAngle);

      majorTicks.push({ angle, value: tickValue });

      // Generate minor ticks between major ticks
      if (i < actualMajorTickCount - 1) {
        const minorIncrement = increment / (minorTicksPerMajor + 1);
        for (let j = 1; j <= minorTicksPerMajor; j++) {
          const minorValue = tickValue + j * minorIncrement;
          const minorNormalizedPosition =
            (minorValue - minValue) / (maxValue - minValue);
          const minorAngle =
            startAngle + minorNormalizedPosition * (endAngle - startAngle);
          minorTicks.push({ angle: minorAngle, value: minorValue });
        }
      }
    }

    return { majorTicks, minorTicks };
  };

  // Add animation effect when value changes
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      if (Math.abs(targetValue - value) > 0.1) {
        setValue(value + (targetValue - value) * 0.1);
      } else {
        setValue(targetValue);
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [value, targetValue]);

  return {
    value,
    setValue: setTargetValue,
    angle: valueToAngle(value),
    calculateArcPath,
    calculateSegmentPath,
    generateTicks,
    valueToAngle,
    angleToValue,
  };
};
