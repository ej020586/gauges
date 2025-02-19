import { Electrics } from "./store/useGameData";

export interface GameData {
  electrics: Electrics;
}

declare global {
  interface Window {
    setup: (gameData: GameData) => void;
    updateData: (gameData: GameData) => void;
  }
}

export const SETUP_EVENT: string = "LuaSetup";
export const UPDATE_DATA_EVENT: string = "LuaDataUpdate";

export function initializeGameInterface() {
  window.setup = function (gameData: GameData) {
    console.log("window.setup", gameData);
    document.dispatchEvent(new CustomEvent(SETUP_EVENT, { detail: gameData }));
  };

  window.updateData = function (gameData: GameData) {
    console.log("window.updateData", gameData);
    document.dispatchEvent(
      new CustomEvent(UPDATE_DATA_EVENT, { detail: gameData })
    );
  };
}
