import React, { useEffect, useState } from "react";
import Speedometer from "./Speedometer";
import Tachometer from "./Tachometer";
import { useEngineRev } from "../hooks/useEngineRev";

function App() {
  const [payloads, setPayloads] = useState<{ timestamp: string; data: any }[]>(
    []
  );

  useEffect(() => {
    function handleSetup(event) {
      const payload = {
        timestamp: new Date().toISOString(),
        data: event.detail,
      };
      console.log("Received LuaSetup event");
      setPayloads([...payloads, payload]);
    }

    function handleDataUpdate(event) {
      const payload = {
        timestamp: new Date().toISOString(),
        data: event.detail,
      };
      setPayloads([...payloads, payload]);
    }

    document.addEventListener("LuaSetup", handleSetup);
    document.addEventListener("LuaDataUpdate", handleDataUpdate);

    return () => {
      document.removeEventListener("LuaSetup", handleSetup);
      document.removeEventListener("LuaDataUpdate", handleDataUpdate);
    };
  }, [payloads]);

  const [speed, setSpeed] = useState(0);
  const { rpm, startRevving, stopRevving, redLine, maxRPM } = useEngineRev({
    idleRPM: 800,
    maxRPM: 8500,
    redLine: 8000,
    revUpRate: 4000,
    revDownRate: 2000,
    throttleResponse: 0.2,
    idleFluctuation: 200,
    powerLossThreshold: 0.85,
  });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSpeed((prev) => {
  //       const change = Math.random() * 10 - 5; // Random change between -5 and 5
  //       return Math.max(0, Math.min(220, prev + change)); // Clamp between 0 and 220
  //     });
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Debug Panel */}
      <div className="fixed top-0 left-0 p-4 max-w-md max-h-screen overflow-auto">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h1 className="text-2xl font-bold mb-4">BeamNG Debug Panel</h1>
          <div className="space-y-2">
            {payloads.map((payload, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded text-sm">
                <div className="text-gray-600">
                  {new Date(payload.timestamp).toLocaleString()}
                </div>
                <pre className="mt-1 text-xs overflow-x-auto">
                  {JSON.stringify(payload.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Speedometer */}
      <div className="fixed top-20 p-8 w-screen">
        <div className="flex flex-row items-center justify-center">
          <div>
            <Speedometer value={speed} />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={() =>
                setSpeed((prev) => (prev + 10 > 160 ? 160 : prev + 10))
              }
            >
              Increase Speed
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setSpeed((prev) => (prev > 10 ? prev - 10 : 0))}
            >
              Decrease Speed
            </button>
          </div>
          <div className="flex flex-col items-center">
            <Tachometer value={rpm} redLine={redLine} maxValue={maxRPM} />
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold mt-4 focus:outline-none active:bg-red-700 transition-colors"
              onMouseDown={startRevving}
              onMouseUp={stopRevving}
              onMouseLeave={stopRevving}
              onTouchStart={startRevving}
              onTouchEnd={stopRevving}
            >
              Rev Engine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
