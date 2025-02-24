import React from "react";
import Speedometer from "./Speedometer";
import Tachometer from "./Tachometer";
import TemperatureGauge from "./TemperatureGague";
import { useSimulateGameData } from "../store/useSimulateGameData";
import useGameData from "../store/useGameData";

function AppDev() {
  const { start, stop } = useSimulateGameData();

  useGameData();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="fixed top-0 w-screen">
        <div className="flex flex-row items-center justify-center">
          <div className="bg-gray-900">
            <Speedometer />
          </div>
          <div className="flex flex-col items-center justify-center">
            <TemperatureGauge />
          </div>
          <div className="flex flex-col items-center bg-gray-900">
            <Tachometer redLine={8000} maxValue={9000} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-screen">
        <button className="bg-cyan-500 p-2" onClick={start}>
          Start
        </button>
        <button className="bg-cyan-500 p-2" onClick={stop}>
          Stop
        </button>
      </div>
    </div>
  );
}

export default AppDev;
