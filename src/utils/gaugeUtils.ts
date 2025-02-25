/**
 * Gauge utilities for creating and manipulating gauge components
 * These utilities can be used across different implementations (Three.js, React, etc.)
 */

import { GaugeConfig } from "../abstractions/Gauge";

export interface GaugeTextureConfig extends GaugeConfig {
  startAngle: number;
  endAngle: number;
  tickColor?: string;
  showKph?: boolean;
  majorTickInterval?: number;
  minorTicksPerMajor?: number;
}

/**
 * Creates a canvas texture for gauge markings
 * @param config Configuration for the gauge texture
 * @returns HTMLCanvasElement with the gauge markings
 */
export function createGaugeTexture(
  config: GaugeTextureConfig
): HTMLCanvasElement {
  const {
    startAngle,
    endAngle,
    minValue,
    maxValue,
    tickColor = "#8080ff",
    showKph = true,
    majorTickInterval = 20,
    minorTicksPerMajor = 1,
  } = config;

  const canvas = document.createElement("canvas");
  canvas.width = 2048; // High resolution
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = canvas.width * 0.4;

  // Angle system explanation:
  // 0° = right (3 o'clock), 90° = bottom (6 o'clock), 180° = left (9 o'clock), 270° = top (12 o'clock)
  // We use the same angle system for both the needle rotation and the gauge markings
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  const totalRange = endAngle - startAngle;

  // MPH scale (outer)
  ctx.font = "bold 60px Arial";
  ctx.fillStyle = tickColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw major ticks and numbers
  for (let value = minValue; value <= maxValue; value += majorTickInterval) {
    // Calculate the normalized value (0 to 1) and the corresponding angle
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const angle =
      startAngleRad + normalizedValue * (endAngleRad - startAngleRad);

    // Draw major tick
    const tickStart = radius - 100;
    const tickEnd = radius - 20;
    drawTick(ctx, centerX, centerY, angle, tickStart, tickEnd, 4, tickColor);

    // Draw number
    const distance = radius - 140;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    // Text orientation
    ctx.save();
    ctx.translate(x, y);

    // Calculate the angle to the point from the center
    const angleToPoint = Math.atan2(y - centerY, x - centerX);

    // Rotate text to be perpendicular to the radius and face inward
    const rotationAngle = angleToPoint + Math.PI / 2;

    ctx.rotate(rotationAngle);
    ctx.fillText(value.toString(), 0, 0);
    ctx.restore();
  }

  // KPH scale (inner) - only if showKph is true
  if (showKph) {
    ctx.font = "bold 45px Arial";

    // Calculate KPH values corresponding to MPH major ticks
    for (
      let value = minValue;
      value <= maxValue;
      value += majorTickInterval * 2
    ) {
      // Convert MPH to KPH (1 mph ≈ 1.60934 kph)
      const kphValue = Math.round(value * 1.60934);

      const normalizedValue = (value - minValue) / (maxValue - minValue);
      const angle =
        startAngleRad + normalizedValue * (endAngleRad - startAngleRad);

      // Draw inner tick
      const tickStart = radius - 260;
      const tickEnd = radius - 220;
      drawTick(
        ctx,
        centerX,
        centerY,
        angle,
        tickStart,
        tickEnd,
        1.5,
        tickColor
      );

      // Draw KPH number
      const distance = radius - 300;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      // Text orientation
      ctx.save();
      ctx.translate(x, y);

      // Calculate the angle to the point from the center
      const angleToPoint = Math.atan2(y - centerY, x - centerX);

      // Rotate text to be perpendicular to the radius and face inward
      const rotationAngle = angleToPoint + Math.PI / 2;

      ctx.rotate(rotationAngle);
      ctx.fillText(kphValue.toString(), 0, 0);
      ctx.restore();
    }
  }

  // Draw minor ticks
  for (
    let value = minValue;
    value <= maxValue;
    value += majorTickInterval / (minorTicksPerMajor + 1)
  ) {
    if (value % majorTickInterval !== 0) {
      const normalizedValue = (value - minValue) / (maxValue - minValue);
      const angle =
        startAngleRad + normalizedValue * (endAngleRad - startAngleRad);

      const tickStart = radius - 80;
      const tickEnd = radius - 20;
      drawTick(ctx, centerX, centerY, angle, tickStart, tickEnd, 2, tickColor);
    }
  }

  return canvas;
}

/**
 * Draws a tick mark on the gauge
 */
function drawTick(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  angle: number,
  innerRadius: number,
  outerRadius: number,
  lineWidth: number,
  color: string
): void {
  const startX = centerX + Math.cos(angle) * innerRadius;
  const startY = centerY + Math.sin(angle) * innerRadius;
  const endX = centerX + Math.cos(angle) * outerRadius;
  const endY = centerY + Math.sin(angle) * outerRadius;

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

/**
 * Converts a value to an angle based on the gauge configuration
 */
export function valueToAngle(
  value: number,
  minValue: number,
  maxValue: number,
  startAngle: number,
  endAngle: number
): number {
  // Ensure the value is within the valid range
  const clampedValue = Math.min(Math.max(value, minValue), maxValue);

  // Calculate the normalized value (0 to 1)
  const normalizedValue = (clampedValue - minValue) / (maxValue - minValue);

  // Map the normalized value to the angle range
  return startAngle + normalizedValue * (endAngle - startAngle);
}

/**
 * Converts an angle to a value based on the gauge configuration
 */
export function angleToValue(
  angle: number,
  minValue: number,
  maxValue: number,
  startAngle: number,
  endAngle: number
): number {
  const normalizedAngle = (angle - startAngle) / (endAngle - startAngle);
  return minValue + normalizedAngle * (maxValue - minValue);
}

/**
 * Calculates a nice rounding increment for tick marks
 */
export function calculateNiceIncrement(
  range: number,
  targetTickCount: number
): number {
  const roughIncrement = range / (targetTickCount - 1);
  const magnitude = Math.floor(Math.log10(roughIncrement));
  const normalized = roughIncrement / Math.pow(10, magnitude);

  const niceIncrements = [1, 2, 2.5, 5, 10];
  const niceIncrement = niceIncrements.reduce((prev, curr) =>
    Math.abs(curr - normalized) < Math.abs(prev - normalized) ? curr : prev
  );

  return niceIncrement * Math.pow(10, magnitude);
}

/**
 * Test function to validate needle rotation direction
 * This function takes a value and gauge parameters and returns the angle in degrees and radians
 * for easy testing and validation of the needle rotation direction.
 */
export function testNeedleRotation(
  value: number,
  minValue: number,
  maxValue: number,
  startAngle: number,
  endAngle: number
): { degrees: number; radians: number; normalizedValue: number } {
  // Ensure the value is within the valid range
  const clampedValue = Math.min(Math.max(value, minValue), maxValue);

  // Calculate the normalized value (0 to 1)
  const normalizedValue = (clampedValue - minValue) / (maxValue - minValue);

  // Calculate the angle in degrees
  const angleInDegrees = startAngle + normalizedValue * (endAngle - startAngle);

  // Convert to radians and apply the negative sign for proper rotation direction
  // THREE.js uses a different coordinate system, so we negate the angle
  const angleInRadians = -(angleInDegrees * Math.PI) / 180;

  return {
    degrees: angleInDegrees,
    radians: angleInRadians,
    normalizedValue: normalizedValue,
  };
}
