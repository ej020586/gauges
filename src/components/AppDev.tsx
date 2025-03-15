import React from "react";
import Speedometer from "./Speedometer";
import Tachometer from "./Tachometer";
import TemperatureGauge from "./TemperatureGague";
import { useSimulateGameData } from "../store/useSimulateGameData";
import useGameData from "../store/useGameData";
import GameSimulationButtons from "./GameSimulationButtons";

function AppDev() {
  useGameData();

  return (
    <>
      <GameSimulationButtons />
      <div className="min-h-screen bg-gray-900">
        <div className="fixed top-10 w-screen">
          <div className="flex flex-row items-center justify-center bg-white">
            <div>
              <Speedometer />
            </div>
            <div className="flex flex-col items-center justify-center">
              <TemperatureGauge />
            </div>
            <div className="flex flex-col items-center">
              <Tachometer redLine={8000} maxValue={9000} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppDev;
