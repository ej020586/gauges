import { useState, useEffect, useCallback } from "react";

interface EngineConfig {
  idleRPM?: number;
  maxRPM?: number;
  redLine?: number;
  revUpRate?: number;
  revDownRate?: number;
  throttleResponse?: number;
  idleFluctuation?: number;
  powerLossThreshold?: number;
}

export const useEngineRev = ({
  idleRPM = 800,
  maxRPM = 8000,
  redLine = 7500,
  revUpRate = 3000,
  revDownRate = 2000,
  throttleResponse = 0.15,
  idleFluctuation = 50, // RPM variation at idle
  powerLossThreshold = 0.95, // Percentage of maxRPM where power loss starts
}: EngineConfig = {}) => {
  const [rpm, setRPM] = useState(idleRPM);
  const [isRevving, setIsRevving] = useState(false);

  // Function to add randomness to idle RPM
  const getIdleVariation = useCallback(() => {
    const randomVariation = (Math.random() - 0.5) * 2 * idleFluctuation;
    return idleRPM + randomVariation;
  }, [idleRPM, idleFluctuation]);

  // Function to simulate power loss at high RPMs
  const calculatePowerLoss = useCallback(
    (currentRPM: number) => {
      const powerLossStart = maxRPM * powerLossThreshold;
      if (currentRPM > powerLossStart) {
        // Calculate how far into the power loss zone we are (0 to 1)
        const powerLossZoneProgress =
          (currentRPM - powerLossStart) / (maxRPM - powerLossStart);
        // Random power loss that gets more severe as RPM increases
        const randomLoss = Math.random() * powerLossZoneProgress * 500;
        return randomLoss;
      }
      return 0;
    },
    [maxRPM, powerLossThreshold]
  );

  const calculateRPM = useCallback(
    (currentRPM: number, throttle: boolean, deltaTime: number) => {
      if (throttle) {
        // Exponential acceleration curve when revving
        const acceleration = (maxRPM - currentRPM) * throttleResponse;
        let newRPM = currentRPM + acceleration * (revUpRate * deltaTime);

        // Apply power loss at high RPMs
        const powerLoss = calculatePowerLoss(newRPM);
        newRPM -= powerLoss;

        return Math.min(newRPM, maxRPM);
      } else {
        // Logarithmic deceleration curve when releasing
        const deceleration = (currentRPM - idleRPM) * 0.1;
        const newRPM = currentRPM - deceleration * (revDownRate * deltaTime);

        // If we're near idle, add idle fluctuation
        if (newRPM <= idleRPM + idleFluctuation) {
          return getIdleVariation();
        }

        return Math.max(newRPM, getIdleVariation());
      }
    },
    [
      idleRPM,
      maxRPM,
      revUpRate,
      revDownRate,
      throttleResponse,
      getIdleVariation,
      calculatePowerLoss,
    ]
  );

  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId: number;

    const updateRPM = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      setRPM((current) => calculateRPM(current, isRevving, deltaTime));
      animationFrameId = requestAnimationFrame(updateRPM);
    };

    animationFrameId = requestAnimationFrame(updateRPM);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRevving, calculateRPM]);

  const startRevving = useCallback(() => {
    setIsRevving(true);
  }, []);

  const stopRevving = useCallback(() => {
    setIsRevving(false);
  }, []);

  return {
    rpm,
    isRevving,
    startRevving,
    stopRevving,
    maxRPM,
    redLine,
    isInRedLine: rpm >= redLine,
  };
};
