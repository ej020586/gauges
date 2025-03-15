import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  PropsWithChildren,
} from "react";
import { generateTicks, useGauge } from "../../hooks/useGauge";
import GaugeBackground from "./GaugeBackground";
import GaugeNeedle, { Needle } from "./GaugeNeedle";

type RadialGaugeProps = {
  minValue: number;
  maxValue: number;
  size?: number;
  startAngle?: number;
  endAngle?: number;
  majorTickCount?: number;
  className?: string;
  showText?: boolean;
  value?: number;
};

const RadialGauge: React.FC<PropsWithChildren<RadialGaugeProps>> = ({
  minValue,
  maxValue,
  children,
  size = 400,
  startAngle = -120,
  endAngle = 120,
  majorTickCount = 12,
  value,
}) => {
  const dimensions = useMemo(
    () => ({
      radius: size / 2,
      centerX: size / 2,
      tickLength: size * 0.05,
    }),
    [size]
  );

  const { majorTicks, minorTicks } = useMemo(() => {
    const angleRange = endAngle - startAngle;
    const valueRange = maxValue - minValue;

    return generateTicks(majorTickCount, 4, {
      startAngle,
      valueRange,
      minValue,
      maxValue,
      angleRange,
    });
  }, [majorTickCount, startAngle, endAngle, minValue, maxValue]);

  const gaugeBackgroundDimensions = useMemo(() => {
    const dimensions = {
      radius: size / 2,
      centerX: size / 2,
      tickLength: size * 0.05,
      centerY: size / 2,
    };
    return dimensions;
  }, [size]);

  return (
    <div style={{ width: size, height: size }} className={`relative`}>
      {/* Render the static background */}
      <GaugeBackground
        size={size}
        dimensions={gaugeBackgroundDimensions}
        majorTicks={majorTicks}
        minorTicks={minorTicks}
        majorTickCount={majorTickCount}
      />
      {/* Overlay the dynamic needle */}
      <GaugeNeedle size={size} centerX={dimensions.centerX}>
        {value && (
          <Needle
            size={size}
            value={value}
            minValue={minValue}
            maxValue={maxValue}
            startAngle={startAngle}
            endAngle={endAngle}
          />
        )}
        {!value && children}
      </GaugeNeedle>
    </div>
  );
};

export default memo(RadialGauge);
