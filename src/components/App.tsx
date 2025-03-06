import React from "react";
import Speedometer from "./Speedometer";
import Tachometer from "./Tachometer";
import TemperatureGauge from "./TemperatureGague";
import Gear from "./Gear";
import useGameData from "../store/useGameData";

function App() {
  const redline = 8000;
  const maxRPM = 8500;

  useGameData();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="fixed top-0 w-screen">
        <div className="flex flex-row items-center justify-center">
          {/* <div className="bg-gray-900">
            <Speedometer />
          </div>
          */}
          <div className="flex">
            <TemperatureGauge />
            <Gear />
          </div>
          <div className="flex flex-col items-center bg-gray-900">
            <Tachometer redLine={redline} maxValue={maxRPM} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
