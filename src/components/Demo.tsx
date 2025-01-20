import React, { useState } from "react";
import Speedometer from "./Speedometer";

const Demo: React.FC = () => {
  const [speed, setSpeed] = useState(0);

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(event.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Speedometer Demo
        </h1>

        <div className="rounded-lg bg-gray-800 p-8 shadow-lg">
          <Speedometer value={speed} className="mx-auto" />

          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-300">
              Speed: {speed} km/h
            </label>
            <input
              type="range"
              min="0"
              max="220"
              value={speed}
              onChange={handleSpeedChange}
              className="mt-2 w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
