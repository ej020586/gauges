// Generate random changes for simulation
export const getRandomChange = (maxChange: number) => {
  return (Math.random() * 2 - 1) * maxChange;
};

export const clampValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
