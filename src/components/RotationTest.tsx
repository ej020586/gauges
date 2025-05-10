import React, { useEffect, useRef, useState } from "react";

interface RotationTestProps {
  value: number;
  minValue: number;
  maxValue: number;
  size?: number;
}

const RotationTest: React.FC<RotationTestProps> = ({
  value,
  minValue,
  maxValue,
  size = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(0);

  // Calculate rotation angle based on value
  useEffect(() => {
    const range = maxValue - minValue;
    const normalizedValue = (value - minValue) / range;
    const newAngle = normalizedValue * 240 - 120; // -120 to 120 degrees
    setAngle(newAngle);
  }, [value, minValue, maxValue]);

  // Canvas rotation implementation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Set center point
    const centerX = size / 2;
    const centerY = size / 2;

    // Save context state
    ctx.save();

    // Move to center, rotate, draw needle
    ctx.translate(centerX, centerY);
    ctx.rotate((angle * Math.PI) / 180);

    // Draw needle
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size * 0.35);
    ctx.strokeStyle = "#DC2626";
    ctx.lineWidth = size * 0.02;
    ctx.lineCap = "round";
    ctx.stroke();

    // Draw center cap
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.04, 0, Math.PI * 2);
    ctx.fillStyle = "#DC2626";
    ctx.fill();

    // Restore context state
    ctx.restore();
  }, [angle, size]);

  return (
    <div className="grid grid-cols-4 gap-2 p-1">
      {/* Method 1: CSS Transform */}
      <div className="flex flex-col items-center bg-white rounded-lg p-2">
        <h3 className="text-sm font-medium mb-2">CSS Transform</h3>
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className="absolute top-1/2 left-1/2 w-1 bg-red-600 rounded-full origin-bottom"
            style={{
              height: size * 0.35,
              transform: `translate(-50%, -100%) rotate(${angle}deg)`,
              transition: "transform 0.1s linear",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-600 rounded-full"
            style={{ transform: "translate(-50%, -50%)" }}
          />
        </div>
      </div>

      {/* Method 2: Canvas */}
      <div className="flex flex-col items-center bg-white rounded-lg p-2">
        <h3 className="text-sm font-medium mb-2">Canvas</h3>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="border border-gray-200 rounded"
        />
      </div>

      {/* Method 3: SVG with transform attribute */}
      <div className="flex flex-col items-center bg-white rounded-lg p-2">
        <h3 className="text-sm font-medium mb-2">SVG Transform</h3>
        <svg
          width={size}
          height={size}
          className="border border-gray-200 rounded"
        >
          <g transform={`translate(${size / 2} ${size / 2})`}>
            <g transform={`rotate(${angle})`}>
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={-size * 0.35}
                stroke="#DC2626"
                strokeWidth={size * 0.02}
                strokeLinecap="round"
              />
            </g>
            <circle r={size * 0.04} fill="#DC2626" />
          </g>
        </svg>
      </div>

      {/* Method 4: SVG with matrix transform */}
      <div className="flex flex-col items-center bg-white rounded-lg p-2">
        <h3 className="text-sm font-medium mb-2">SVG Matrix</h3>
        <svg
          width={size}
          height={size}
          className="border border-gray-200 rounded"
        >
          <g transform={`translate(${size / 2} ${size / 2})`}>
            <g
              transform={`matrix(${Math.cos(
                (angle * Math.PI) / 180
              )}, ${Math.sin((angle * Math.PI) / 180)}, ${-Math.sin(
                (angle * Math.PI) / 180
              )}, ${Math.cos((angle * Math.PI) / 180)}, 0, 0)`}
            >
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={-size * 0.35}
                stroke="#DC2626"
                strokeWidth={size * 0.02}
                strokeLinecap="round"
              />
            </g>
            <circle r={size * 0.04} fill="#DC2626" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default RotationTest;
