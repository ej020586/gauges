import { useState, useEffect } from "react";

interface UseLoopingValueProps {
  minValue: number;
  maxValue: number;
  duration?: number; // Duration in milliseconds for one complete cycle
  step?: number;
}

export const useLoopingValue = ({
  minValue,
  maxValue,
  duration = 5000,
  step = 1,
}: UseLoopingValueProps) => {
  const [value, setValue] = useState(minValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((currentValue) => {
        const nextValue = currentValue + step;
        return nextValue > maxValue ? minValue : nextValue;
      });
    }, duration / ((maxValue - minValue) / step));

    return () => clearInterval(interval);
  }, [minValue, maxValue, duration, step]);

  return value;
};
