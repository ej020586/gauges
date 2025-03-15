import { useEffect, useRef } from "react";

interface UseRpmBarCanvasProps {
  rpm: number;
  maxRpm: number;
  width?: number;
  height?: number;
}

/**
 * Custom hook to handle drawing the RPM bar on a canvas
 */
const useRpmBarCanvas = ({
  rpm,
  maxRpm,
  width = 580,
  height = 80,
}: UseRpmBarCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate RPM percentage
  const rpmPercentage = Math.min(100, (rpm / maxRpm) * 100);

  // Draw the RPM bar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions if needed
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw dark background (matching the screenshot's darker navy/black background)
    ctx.fillStyle = "#111827"; // Dark navy/black
    ctx.fillRect(0, 0, width, height);

    // Calculate the filled portion width based on RPM
    const filledWidth = width * (rpmPercentage / 100);

    // Create gradient for the RPM bar - matching the screenshot's yellow-to-orange gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#ffff00"); // Yellow at start
    gradient.addColorStop(0.7, "#ff9900"); // Orange in middle
    gradient.addColorStop(1, "#ff6600"); // Darker orange at end

    // Create a mask for the RPM bar
    // Save the current state
    ctx.save();

    // Create a clipping path for the mask
    ctx.beginPath();

    // Start at bottom left
    ctx.moveTo(0, height);

    // Left edge - start at 40% of height
    const sideHeight = height * 0.6;
    ctx.lineTo(0, sideHeight);

    // Create a curve that peaks at the center
    // The peak should be 2.5x higher than the sides
    const peakHeight = -height * 1.5; // Negative to go upward

    ctx.lineTo(width * 0.5, sideHeight);

    // Draw the curve using bezier for more control
    ctx.bezierCurveTo(
      width * 0.8,
      peakHeight / 2,
      width,
      peakHeight,
      width,
      peakHeight
    );

    // Right edge
    ctx.lineTo(width, height);

    // Close the path
    ctx.closePath();

    // Create the clipping region
    ctx.clip();

    // Draw the rectangular RPM bar within the clipping region
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, filledWidth, height);

    // Restore the context
    ctx.restore();

    // Draw numbers below the bar
    ctx.fillStyle = "#ffffff"; // White numbers
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    for (let i = 1; i <= 9; i++) {
      const x = (width / 9) * i;
      ctx.fillText(i.toString(), x, height + 16); // Position below the bar
    }

    // We don't draw the labels here anymore as they'll be positioned in the component
  }, [rpm, maxRpm, width, height, rpmPercentage]);

  return { canvasRef };
};

export default useRpmBarCanvas;
