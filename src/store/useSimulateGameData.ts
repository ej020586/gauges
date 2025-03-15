// a hook that simulates data being sent from Lua scripts at a rapid rate.
// this is used to test the gauges and ensure they are working correctly.

import { useEffect, useCallback, useState, useRef } from "react";
import { GameData } from "../beam";

interface ElectricsLimits {
  rpmTacho: { min: number; max: number; maxChange: number };
  wheelspeed: { min: number; max: number; maxChange: number };
  gear: { min: number; max: number; maxChange: number };
  watertemp: { min: number; max: number; maxChange: number };
}

const ELECTRICS_LIMITS: ElectricsLimits = {
  rpmTacho: { min: 0, max: 8000, maxChange: 8000 },
  wheelspeed: { min: 0, max: 200, maxChange: 200 }, // km/h
  gear: { min: -1, max: 6, maxChange: 1 }, // -1 for reverse, 0 for neutral, 1-6 for gears
  watertemp: { min: 100, max: 400, maxChange: 350 }, // degrees Celsius
};

const getRandomChange = (maxChange: number) => {
  return (Math.random() * 2 - 1) * maxChange; // Random value between -maxChange and +maxChange
};

const clampValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const generateMockData = (lastValues: GameData) => {
  const lastElectrics = lastValues.electrics;
  if (!lastElectrics) {
    throw new Error("lastElectrics is not defined");
  }
  const newData: GameData = {
    electrics: {
      rpmTacho: clampValue(
        (lastElectrics.rpmTacho ?? 0) +
          getRandomChange(ELECTRICS_LIMITS.rpmTacho.maxChange),
        ELECTRICS_LIMITS.rpmTacho.min,
        ELECTRICS_LIMITS.rpmTacho.max
      ),
      wheelspeed: clampValue(
        (lastElectrics.wheelspeed ?? 0) +
          getRandomChange(ELECTRICS_LIMITS.wheelspeed.maxChange),
        ELECTRICS_LIMITS.wheelspeed.min,
        ELECTRICS_LIMITS.wheelspeed.max
      ),
      gear: Math.round(
        clampValue(
          (lastElectrics.gear ?? 0) +
            getRandomChange(ELECTRICS_LIMITS.gear.maxChange),
          ELECTRICS_LIMITS.gear.min,
          ELECTRICS_LIMITS.gear.max
        )
      ),
      watertemp: clampValue(
        (lastElectrics.watertemp ?? 0) +
          getRandomChange(ELECTRICS_LIMITS.watertemp.maxChange),
        ELECTRICS_LIMITS.watertemp.min,
        ELECTRICS_LIMITS.watertemp.max
      ),
    },
  };

  return newData;
};

export const useSimulateGameData = () => {
  const [rate, setRate] = useState(33); // Update rate in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const timeoutRef = useRef<number>();
  const lastValuesRef = useRef<GameData>({
    electrics: {
      rpmTacho: 0,
      wheelspeed: 0,
      gear: 0,
      watertemp: 60,
    },
  });

  const changeMockData = useCallback(() => {
    const lastRecievedValues = lastValuesRef.current;
    if (!lastRecievedValues) {
      throw new Error("lastElectrics is not defined");
    }
    const updateData = generateMockData(lastRecievedValues);
    return updateData;
  }, []);

  const scheduleNextUpdate = useCallback(() => {
    const updateData = changeMockData();
    if (window.updateData) {
      window.updateData(updateData);
    } else {
      throw new Error("window.updateData is not defined");
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    if (isRunning) {
      timeoutRef.current = window.setTimeout(scheduleNextUpdate, rate);
    }
  }, [rate, generateMockData, isRunning]);

  const start = useCallback(() => {
    // Initial setup
    const setupData = changeMockData();
    if (window.setup) {
      window.setup(setupData);
    } else {
      throw new Error("window.setup is not defined");
    }
    setIsRunning(true);
  }, [generateMockData, scheduleNextUpdate]);

  useEffect(() => {
    if (isRunning) {
      scheduleNextUpdate();
    }
  }, [isRunning, scheduleNextUpdate]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const config = useCallback(
    (newRate: number) => {
      setRate(newRate);
      // Restart simulation if it's running
      if (isRunning) {
        stop();
        start();
      }
    },
    [start, stop, isRunning]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    start,
    stop,
    config,
  };
};
