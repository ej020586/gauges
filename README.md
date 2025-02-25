# Gauge Implementations

This repository contains multiple implementations of a gauge component using different technologies and frameworks. The goal is to provide developers with reusable gauge components that can be easily integrated into their projects, regardless of their preferred technology stack.

## Overview

The repository is structured to provide:

1. A set of shared utility functions for gauge-related calculations
2. Multiple implementations of gauges using different technologies
3. Example usage for each implementation
4. Simulated data functionality for testing

## Implementations

### Three.js Gauge

A vanilla JavaScript implementation using Three.js for 3D rendering. This implementation provides a realistic-looking gauge with depth and lighting effects.

**Features:**
- Customizable min/max values and angle range
- MPH and KPH scales
- Smooth animations
- Realistic 3D appearance with proper lighting and materials

**Usage:**
```javascript
// Create a container element
const container = document.getElementById('gauge-container');

// Create the gauge
const gauge = new ThreeJSGauge({
  container,
  minValue: 0,
  maxValue: 140,
  startAngle: 140,  // Bottom left (around 7:30 position)
  endAngle: 400,    // Bottom right (around 4:30 position)
  initialValue: 0,
  showKph: true
});

// Set a value
gauge.setValue(70);

// Animate to a value
gauge.animateTo(120, 1000); // Animate to 120 over 1 second
```

### React Gauge

A React component implementation that uses Three.js for rendering. This implementation provides the same visual appearance as the vanilla JavaScript version but with a React-friendly API.

**Features:**
- React component API
- Custom hook for animations
- Click interaction for setting values
- All the visual features of the Three.js implementation

**Usage:**
```jsx
import { ReactGauge, useGaugeAnimation } from './implementations/ReactGauge';

const GaugeExample = () => {
  const { value, animateTo } = useGaugeAnimation(0);
  
  return (
    <div>
      <ReactGauge
        minValue={0}
        maxValue={140}
        startAngle={140}
        endAngle={400}
        value={value}
        width={300}
        height={300}
        onChange={(newValue) => animateTo(Math.round(newValue))}
      />
      <button onClick={() => animateTo(0)}>0</button>
      <button onClick={() => animateTo(70)}>70</button>
      <button onClick={() => animateTo(140)}>140</button>
    </div>
  );
};
```

## Shared Utilities

The `gaugeUtils.ts` file contains shared utility functions that are used across all implementations:

- `createGaugeTexture`: Creates a canvas texture for gauge markings
- `valueToAngle`: Converts a value to an angle based on the gauge configuration
- `angleToValue`: Converts an angle to a value based on the gauge configuration
- `calculateNiceIncrement`: Calculates a nice rounding increment for tick marks

## Examples

The repository includes example usage for each implementation:

- `src/examples/threeJSExample.ts`: Example of using the Three.js gauge
- `src/examples/reactExample.tsx`: Example of using the React gauge
- `src/examples/reactSimulatedExample.tsx`: Example of using the React gauge with simulated data

## Simulated Data

The repository includes functionality to simulate real-time data updates, which is useful for testing and demonstration purposes:

### Vanilla JavaScript Implementation

The `threeJSExample.ts` and `AppCanvas.ts` files include a simulation system that:

- Generates random changes to vehicle data (speed, RPM, gear, water temperature)
- Updates the gauge at a configurable rate
- Provides controls to start/stop the simulation and adjust the update rate

**Usage:**
```javascript
// Simulation variables
let isSimulationRunning = false;
let simulationTimeoutId = null;
let lastValues = {
  electrics: {
    rpmTacho: 0,
    wheelspeed: 0,
    gear: 0,
    waterTemp: 60,
  },
};

// Generate mock data
const generateMockData = () => {
  // Implementation details...
};

// Start simulation
startButton.addEventListener("click", () => {
  // Implementation details...
  window.setup(setupData);
  // Schedule updates...
});
```

### React Implementation

The `reactSimulatedExample.tsx` file includes a custom React hook `useSimulatedGameData` that:

- Manages simulation state using React hooks
- Provides methods to start/stop the simulation and adjust the update rate
- Updates the gauge component with simulated data

**Usage:**
```jsx
// Use the custom hook
const {
  gameData,
  isRunning,
  updateRate,
  startSimulation,
  stopSimulation,
  updateSimulationRate,
} = useSimulatedGameData();

// Update gauge when data changes
useEffect(() => {
  if (gameData.electrics.wheelspeed !== undefined) {
    animateTo(gameData.electrics.wheelspeed);
  }
}, [gameData]);
```

## Customization

All implementations support the following customization options:

- `minValue`: The minimum value of the gauge
- `maxValue`: The maximum value of the gauge
- `startAngle`: The starting angle of the gauge in degrees
- `endAngle`: The ending angle of the gauge in degrees
- `gaugeRadius`: The radius of the gauge
- `backgroundColor`: The background color of the gauge
- `tickColor`: The color of the tick marks and numbers
- `needleColor`: The color of the needle
- `showKph`: Whether to show the KPH scale

## Contributing

Contributions are welcome! If you'd like to add a new implementation or improve an existing one, please submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.