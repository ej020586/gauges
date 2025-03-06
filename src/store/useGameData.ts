import { create } from "zustand";
import {
  GameData,
  initializeGameInterface,
  SETUP_EVENT,
  UPDATE_DATA_EVENT,
} from "../beam";
import { useEffect, useRef, useCallback, RefObject } from "react";
import { devtools } from "zustand/middleware";

export interface Electrics {
  gear?: number;
  wheelspeed?: number;
  rpmTacho?: number;
  watertemp?: number;
  [key: string]: any;
}

type GameDataState = {
  gear: number | null;
  speed: number | null;
  rpm: number | null;
  watertemp: number | null;
  oiltemp: number | null;
};

interface GameDataActions {
  set: (data: Partial<GameData>) => void;
}
// TODO : use dynamic value from game
const wheelspeedRatio = 1.60934;

const convertElectricsToGameData = (electrics: Electrics) => {
  let gear = "N";
  if (electrics.gear !== undefined) {
    gear = electrics.gear === 0 ? "N" : electrics.gear.toString();
    if (electrics.gear === -1) {
      gear = "R";
    }
  }
  let speed = 0;
  if (electrics.wheelspeed !== undefined) {
    speed = electrics.wheelspeed * wheelspeedRatio;
  }
  let rpm = 0;
  if (electrics.rpmTacho !== undefined) {
    rpm = electrics.rpmTacho;
  }
  let watertemp = 0;
  if (electrics.watertemp !== undefined) {
    watertemp = electrics.watertemp;
  }
  let oiltemp = 0;
  if (electrics.oiltemp !== undefined) {
    oiltemp = electrics.oiltemp;
  }
  return {
    gear: electrics.gear,
    speed: electrics.wheelspeed,
    rpm: electrics.rpmTacho,
    watertemp: electrics.watertemp,
    oiltemp: electrics.oiltemp,
  };
};

export const useGameDataStore = create<GameDataState & GameDataActions>()(
  devtools((set) => ({
    gear: null,
    speed: null,
    rpm: null,
    watertemp: null,
    oiltemp: null,
    set: (data: Partial<GameData>) => {
      if (data.electrics) {
        const gaugeData = convertElectricsToGameData(data.electrics);
        set((state) => ({ ...state, ...gaugeData }));
      }
    },
  }))
);

// Metrics interface to track event calls
interface EventMetrics {
  totalCalls: number;
  startTime: number;
}

const THROTTLE_MS = 15; // Approximately 60fps

const getAverageCallsPerSecond = (metrics: EventMetrics) => {
  const currentTime = Date.now();
  const elapsedSeconds = (currentTime - metrics.startTime) / 1000;
  return metrics.totalCalls / elapsedSeconds;
};

const useGameData = () => {
  const set = useGameDataStore((state) => state.set);
  const metricsRef = useRef<EventMetrics>({ totalCalls: 0, startTime: Date.now() });
  const lastUpdateRef = useRef<number>(0);
  

  const throttledDataUpdate = useCallback((event: CustomEvent<GameData>) => {
    const now = Date.now();
    if (now - lastUpdateRef.current >= THROTTLE_MS) {
      if (event.detail) {
        metricsRef.current.totalCalls++;
        // console.log(`handleDataUpdate ${JSON.stringify(event.detail)}`);
        console.log(`Average calls per second: ${getAverageCallsPerSecond(metricsRef.current).toFixed()}`);
        set(event.detail);
      }
      lastUpdateRef.current = now;
    } else {
      console.log(`Throttled data update: ${now - lastUpdateRef.current}`);
    }
  }, [set]);

  useEffect(() => {
    const handleSetup = ((event: CustomEvent<GameData>) => {
      if (event.detail) {
        set(event.detail);
      }
    }) as EventListener;

    const handleDataUpdate = throttledDataUpdate as EventListener;

    document.addEventListener(SETUP_EVENT, handleSetup);
    document.addEventListener(UPDATE_DATA_EVENT, handleDataUpdate);

    initializeGameInterface();

    return () => {
      document.removeEventListener(SETUP_EVENT, handleSetup);
      document.removeEventListener(UPDATE_DATA_EVENT, handleDataUpdate);
    };
  }, [throttledDataUpdate]);

  useEffect(() => {
    // initialize game data
    initializeGameInterface();
  }, []);

  return null;
};

export default useGameData;
