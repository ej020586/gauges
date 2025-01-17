import React, { useState, useEffect } from "react";

interface GridCell {
  x: number;
  y: number;
  index: number;
  color: string;
}

export const useGridCalculations = () => {
  const [gridCells, setGridCells] = useState<GridCell[]>([]);

  useEffect(() => {
    const calculateGrid = () => {
      const cells: GridCell[] = [];
      const width = Math.ceil(window.innerWidth / 100);
      const height = Math.ceil(window.innerHeight / 100);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = y * width + x;
          // Generate UV-like colors based on position
          const r = Math.floor((x / width) * 255);
          const g = Math.floor((y / height) * 255);
          const b = Math.floor(((x + y) / (width + height)) * 255);

          cells.push({
            x,
            y,
            index,
            color: `rgb(${r}, ${g}, ${b})`,
          });
        }
      }
      setGridCells(cells);
    };

    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, []);

  return gridCells;
};

const BackgroundGrid = () => {
  const gridCells = useGridCalculations();

  return (
    <div className="absolute w-screen h-screen top-0 left-0 bg-gray-100">
      {gridCells.map(({ x, y, index, color }) => (
        <div
          key={index}
          className="absolute border-collapse border border-gray-200 flex flex-col justify-between box-content"
          style={{
            left: x * 100,
            top: y * 100,
            width: 100,
            height: 100,
            backgroundColor: color,
          }}
        >
          <div className="flex justify-between p-1 text-xs text-white font-mono">
            <span>{`${x},${y}`}</span>
            <span>{index}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BackgroundGrid;
