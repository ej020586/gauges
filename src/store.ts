import { create } from "zustand";

interface Store {
  temperature: number;
  gear: string;
  speed: number;
  rpm: number;
}

interface Actions {
  setTemperature: (temperature: number) => void;
  setGear: (gear: string) => void;
  setSpeed: (speed: number) => void;
  setRpm: (rpm: number) => void;
}

const useStore = create<Store & Actions>((set) => ({
  temperature: 0,
  gear: "N",
  speed: 0,
  rpm: 0,
  setTemperature: (temperature: number) => set({ temperature }),
  setGear: (gear: string) => set({ gear }),
  setSpeed: (speed: number) => set({ speed }),
  setRpm: (rpm: number) => set({ rpm }),
}));


export default useStore;
