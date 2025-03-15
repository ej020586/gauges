import { useGameDataStore } from "../store/useGameData";

interface FuelTechData {
  rpm: number;
  speed: number | null;
  map: number | null; // Manifold Absolute Pressure
  o2Left: number | null; // Left O2 sensor (AFR)
  o2Right: number | null; // Right O2 sensor (AFR)
  fBrake: number | null; // Front Brake pressure
  injectorPulse: number | null; // Injector pulse width
  throttlePosition: number | null; // Throttle position
  fuelPressure: number | null; // Fuel pressure
  tps: number | null; // Throttle Position Sensor
  o2Correction: number | null; // O2 correction
  timing: number | null; // Ignition timing
  oilPressure: number | null; // Oil pressure
  battery: number | null; // Battery voltage
  dataPercentage: number | null; // Data logging percentage
  recording: boolean; // Recording status
}

/**
 * Custom hook to provide data for the FuelTech gauge
 *
 * This hook gets real data from the game data store when available,
 * and provides mock data for demonstration purposes for values not available
 * in the current game data.
 */
export const useFuelTechData = (): FuelTechData => {
  // Get data from the game data store
  const rpm = useGameDataStore((state) => state.rpm || 0);
  const speed = useGameDataStore((state) => state.speed);
  const waterTemp = useGameDataStore((state) => state.watertemp);
  const oilTemp = useGameDataStore((state) => state.oiltemp);

  // For demonstration purposes, we'll use the screenshot values
  // In a real implementation, these would come from the game or be null if not available
  return {
    rpm,
    speed,
    recording: false,
    map: null, // 25.45, // PSI
    o2Left: null, // 3.699, // AFR
    o2Right: null, // 4.55, // AFR
    fBrake: null, // 10.1,
    injectorPulse: null, // 6.573,
    throttlePosition: null, // 50, // Percentage
    fuelPressure: null, // 110.12,
    tps: 50, // Percentage
    o2Correction: 785.3,
    timing: 14.0,
    oilPressure: 83.43,
    battery: 12.8,
    dataPercentage: 42.3,
  };
};

export default useFuelTechData;
