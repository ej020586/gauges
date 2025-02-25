// This file now serves as an entry point that renders the React AppCanvas component

// Import the necessary dependencies
import { GaugeType } from "./abstractions/Gauge.ts";
import {
  GameData,
  initializeGameInterface,
  UPDATE_DATA_EVENT,
} from "./beam.ts";
import { GaugeFactory } from "./GaugeFactory.ts";

// Initialize the gauge when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize game interface
  initializeGameInterface();

  // Create a container for the React app
  const container = document.createElement("div");
  container.id = "app-root";
  document.body.appendChild(container);

  // Create a container for the gauge
  const gaugeContainer = document.createElement("div");
  gaugeContainer.style.width = "100vw";
  gaugeContainer.style.height = "100vh";
  document.body.appendChild(gaugeContainer);

  // Create a gauge factory
  const gaugeFactory = new GaugeFactory();

  // Create a speedometer using the factory
  const gauge = gaugeFactory.createGauge({
    type: GaugeType.SPEEDOMETER,
    container: gaugeContainer,
    minValue: 40,
    maxValue: 140,
    initialValue: 0,
    size: 1.0,
    startAngle: 0,
    endAngle: 360,
  });

  // Listen for game data updates
  document.addEventListener(UPDATE_DATA_EVENT, ((
    event: CustomEvent<GameData>
  ) => {
    if (event.detail && event.detail.electrics) {
      const speed = event.detail.electrics.wheelspeed ?? 0;
      gauge.setValue(speed);
    }
  }) as EventListener);

  // Cleanup on window unload
  window.addEventListener("beforeunload", () => {
    gauge.dispose();
  });
});
