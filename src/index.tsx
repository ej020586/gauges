import React, { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./components/App.tsx";
import { isDev } from "./config";
import AppDev from "./components/AppDev.tsx";
import AppFuelTech from "./components/AppFuelTech.tsx";

// Component to handle app selection
const AppSelector = () => {
  const [selectedApp, setSelectedApp] = useState<string>(
    localStorage.getItem("selectedApp") || "default"
  );

  useEffect(() => {
    localStorage.setItem("selectedApp", selectedApp);
  }, [selectedApp]);

  const renderApp = () => {
    switch (selectedApp) {
      case "fueltech":
        return <AppFuelTech />;
      case "dev":
        return <AppDev />;
      case "default":
      default:
        return <App />;
    }
  };

  return (
    <div>
      <div className="fixed top-0 right-0 z-50 p-2 bg-black bg-opacity-50 rounded-bl-lg">
        <select
          value={selectedApp}
          onChange={(e) => setSelectedApp(e.target.value)}
          className="bg-gray-800 text-white p-1 rounded"
        >
          <option value="default">Default Gauges</option>
          <option value="fueltech">FuelTech Dashboard</option>
          {isDev && <option value="dev">Dev Mode</option>}
        </select>
      </div>
      {renderApp()}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppSelector />
  </StrictMode>
);
