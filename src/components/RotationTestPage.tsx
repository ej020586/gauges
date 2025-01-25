import React, { useState } from "react";
import RotationTest from "./RotationTest";
import { useLoopingValue } from "../hooks/useLoopingValue";

const RotationTestPage: React.FC = () => {
  const minValue = 0;
  const maxValue = 100;

  const value = useLoopingValue({
    minValue,
    maxValue,
    duration: 5000, // 5 seconds for one complete cycle
    step: 1,
  });

  return (
    <div className="p-4">
      <RotationTest value={value} minValue={minValue} maxValue={maxValue} />
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-white">
          Value: {value}
        </label>
        <div className="w-full max-w-[200px] h-4 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-500 rounded transition-all duration-100"
            style={{ width: `${(value / maxValue) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RotationTestPage;
