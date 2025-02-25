// This file now serves as an entry point that renders the React AppCanvas component

// Import the necessary dependencies
import { GaugeType } from "./abstractions/Gauge.ts";
import {
  GameData,
  initializeGameInterface,
  UPDATE_DATA_EVENT,
} from "./beam.ts";
import { getRandomChange, clampValue } from "./utils/math.ts";
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
    minValue: 0,
    maxValue: 140,
    initialValue: 0,
    size: 1,
    startAngle: 140,
    endAngle: 360,
    showKph: true,
  });

  // Create a control panel
  const controlPanel = document.createElement("div");
  controlPanel.style.position = "absolute";
  controlPanel.style.top = "20px";
  controlPanel.style.right = "20px";
  controlPanel.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  controlPanel.style.color = "white";
  controlPanel.style.padding = "15px";
  controlPanel.style.borderRadius = "10px";
  controlPanel.style.width = "250px";
  controlPanel.style.zIndex = "1000";
  document.body.appendChild(controlPanel);

  // Add title
  const title = document.createElement("h3");
  title.textContent = "Gauge Simulation Controls";
  title.style.margin = "0 0 15px 0";
  title.style.textAlign = "center";
  controlPanel.appendChild(title);

  // Add simulation rate control
  const rateContainer = document.createElement("div");
  rateContainer.style.marginBottom = "10px";
  controlPanel.appendChild(rateContainer);

  const rateLabel = document.createElement("label");
  rateLabel.textContent = "Update Rate (ms): ";
  rateContainer.appendChild(rateLabel);

  const rateInput = document.createElement("input");
  rateInput.type = "number";
  rateInput.min = "10";
  rateInput.max = "1000";
  rateInput.value = "33";
  rateInput.style.width = "60px";
  rateInput.style.marginLeft = "10px";
  rateContainer.appendChild(rateInput);

  // Add simulation controls
  const buttonsContainer = document.createElement("div");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.justifyContent = "space-between";
  buttonsContainer.style.marginBottom = "15px";
  controlPanel.appendChild(buttonsContainer);

  const startButton = document.createElement("button");
  startButton.textContent = "Start Simulation";
  startButton.style.padding = "8px 12px";
  startButton.style.backgroundColor = "#4CAF50";
  startButton.style.border = "none";
  startButton.style.borderRadius = "4px";
  startButton.style.color = "white";
  startButton.style.cursor = "pointer";
  buttonsContainer.appendChild(startButton);

  const stopButton = document.createElement("button");
  stopButton.textContent = "Stop Simulation";
  stopButton.style.padding = "8px 12px";
  stopButton.style.backgroundColor = "#f44336";
  stopButton.style.border = "none";
  stopButton.style.borderRadius = "4px";
  stopButton.style.color = "white";
  stopButton.style.cursor = "pointer";
  stopButton.disabled = true;
  buttonsContainer.appendChild(stopButton);

  // Add data display
  const dataDisplay = document.createElement("div");
  dataDisplay.style.fontFamily = "monospace";
  dataDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  dataDisplay.style.padding = "10px";
  dataDisplay.style.borderRadius = "4px";
  dataDisplay.style.marginBottom = "15px";
  dataDisplay.innerHTML = "No simulation data yet";
  controlPanel.appendChild(dataDisplay);

  // Add preset buttons
  const presetTitle = document.createElement("div");
  presetTitle.textContent = "Preset Values:";
  presetTitle.style.marginBottom = "5px";
  controlPanel.appendChild(presetTitle);

  const presetContainer = document.createElement("div");
  presetContainer.style.display = "grid";
  presetContainer.style.gridTemplateColumns = "1fr 1fr";
  presetContainer.style.gap = "5px";
  controlPanel.appendChild(presetContainer);

  const presetValues = [0, 30, 60, 90, 120, 140];
  presetValues.forEach((value) => {
    const presetButton = document.createElement("button");
    presetButton.textContent = `${value} mph`;
    presetButton.style.padding = "5px";
    presetButton.style.backgroundColor = "#2196F3";
    presetButton.style.border = "none";
    presetButton.style.borderRadius = "4px";
    presetButton.style.color = "white";
    presetButton.style.cursor = "pointer";
    presetButton.addEventListener("click", () => {
      gauge.animateTo(value, 1000);
    });
    presetContainer.appendChild(presetButton);
  });

  // Simulation variables
  let isSimulationRunning = false;
  let simulationTimeoutId: number | null = null;
  let lastValues: GameData = {
    electrics: {
      rpmTacho: 0,
      wheelspeed: 0,
      gear: 0,
      waterTemp: 60,
      oilTemp: 60,
    },
  };

  const generateMockData = () => {
    const lastElectrics = lastValues.electrics;
    const newData: GameData = {
      electrics: {
        rpmTacho: clampValue(
          (lastElectrics.rpmTacho ?? 0) + getRandomChange(500),
          0,
          8000
        ),
        wheelspeed: clampValue(
          (lastElectrics.wheelspeed ?? 0) + getRandomChange(10),
          0,
          140
        ),
        gear: Math.round(
          clampValue((lastElectrics.gear ?? 0) + getRandomChange(0.5), -1, 6)
        ),
        waterTemp: clampValue(
          (lastElectrics.waterTemp ?? 60) + getRandomChange(2),
          40,
          120
        ),
        oilTemp: 0,
      },
    };
    lastValues = newData;
    return newData;
  };

  // Listen for game data updates
  document.addEventListener(UPDATE_DATA_EVENT, ((
    event: CustomEvent<GameData>
  ) => {
    if (event.detail && event.detail.electrics) {
      const speed = event.detail.electrics.wheelspeed ?? 0;
      gauge.setValue(speed);

      // Update data display
      dataDisplay.innerHTML = `
        Speed: ${Math.round(speed)} mph<br>
        RPM: ${Math.round(event.detail.electrics.rpmTacho ?? 0)}<br>
        Gear: ${
          event.detail.electrics.gear === -1
            ? "R"
            : event.detail.electrics.gear === 0
            ? "N"
            : event.detail.electrics.gear
        }<br>
        Water Temp: ${Math.round(event.detail.electrics.waterTemp ?? 0)}°C
      `;
    }
  }) as EventListener);

  // Start simulation
  startButton.addEventListener("click", () => {
    if (isSimulationRunning) return;

    isSimulationRunning = true;
    startButton.disabled = true;
    stopButton.disabled = false;

    // Initial setup
    const setupData = generateMockData();
    window.setup(setupData);

    // Schedule updates
    const scheduleNextUpdate = () => {
      if (!isSimulationRunning) return;

      const updateData = generateMockData();
      window.updateData(updateData);

      const rate = parseInt(rateInput.value, 10);
      simulationTimeoutId = window.setTimeout(scheduleNextUpdate, rate);
    };

    scheduleNextUpdate();
  });

  // Stop simulation
  stopButton.addEventListener("click", () => {
    isSimulationRunning = false;
    startButton.disabled = false;
    stopButton.disabled = true;

    if (simulationTimeoutId !== null) {
      window.clearTimeout(simulationTimeoutId);
      simulationTimeoutId = null;
    }
  });

  // Update rate
  rateInput.addEventListener("change", () => {
    if (isSimulationRunning) {
      stopButton.click();
      startButton.click();
    }
  });

  // Cleanup on window unload
  window.addEventListener("beforeunload", () => {
    if (simulationTimeoutId !== null) {
      window.clearTimeout(simulationTimeoutId);
    }
    gauge.dispose();
  });
});
