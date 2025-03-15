import React from "react";
import FuelTechGauge from "./FuelTechGauge";
import useGameData from "../store/useGameData";

const AppFuelTech: React.FC = () => {
  // Initialize game data
  useGameData();

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <FuelTechGauge />
      </div>
    </div>
  );
};

export default AppFuelTech;
