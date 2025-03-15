import React, { memo } from "react";
import { useSimulateGameData } from "../store/useSimulateGameData";

const GameSimulationButtons = () => {
  const { start, stop } = useSimulateGameData();

  return (
    <div className="flex flex-row items-center justify-center">
      <button className="bg-cyan-500 p-2 mr-2" onClick={start}>
        Start
      </button>
      <button className="bg-cyan-500 p-2" onClick={stop}>
        Stop
      </button>
    </div>
  );
};

export default memo(GameSimulationButtons);
