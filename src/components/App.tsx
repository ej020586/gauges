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
    <div className="min-h-screen bg-white">
      <div className="fixed top-4 w-screen">
        <div className="flex flex-row items-center justify-center">
          <div>
            <Speedometer />
          </div>
          <div className="flex">
            <TemperatureGauge />
            <Gear />
          </div>
          <div className="flex flex-col items-center">
            <Tachometer redLine={redline} maxValue={maxRPM} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
