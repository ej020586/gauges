import React from "react";
import BackgroundGrid from "./BackgroundGrid";

interface ElectricsDisplayProps {
  electrics: Record<string, any>;
}

const ElectricsDisplay: React.FC<ElectricsDisplayProps> = ({ electrics }) => {
  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-8 p-4">
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(electrics).map(([key, value]) => (
            <div key={key} className="bg-gray-800 rounded-lg p-4 text-center">
              <h3 className="text-gray-400 text-sm mb-1 font-mono">{key}</h3>
              <p className="text-white text-lg font-mono">
                {typeof value === "number" ? value.toFixed(3) : String(value)}
              </p>
            </div>
          ))}
        </div>
      </div>
      <BackgroundGrid />
    </>
  );
};

export default ElectricsDisplay;
