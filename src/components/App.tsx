import React, { useEffect, useState } from "react";
import Speedometer from "./Speedometer";
import Tachometer from "./Tachometer";
import { useEngineRev } from "../hooks/useEngineRev";
import BackgroundGrid from "./BackgroundGrid";
import { isDev } from "../config";
import TemperatureGauge from "./TemperatureGague";
import { convertToFahrenheit } from "../lib";

function App() {
  const [payloads, setPayloads] = useState<{ timestamp: string; data: any }[]>(
    []
  );

  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState("N");
  const [rpm, setRpm] = useState(1500);
  const {
    rpm: testingRpm,
    startRevving,
    stopRevving,
    redLine,
    maxRPM,
  } = useEngineRev({
    idleRPM: 800,
    maxRPM: 8500,
    redLine: 8000,
    revUpRate: 4000,
    revDownRate: 2000,
    throttleResponse: 0.2,
    idleFluctuation: 200,
    powerLossThreshold: 0.85,
  });

  const [temperature, setTemperature] = useState(15);

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

      if (event.detail.gear) {
        setGear(event.detail.gear);
      }

      if (event.detail.electrics.wheelspeed) {
        const speed = Number(event.detail.electrics.wheelspeed * 2.3);
        console.log("speed", speed);
        setSpeed(speed);
      }

      if (event.detail.electrics.rpmTacho) {
        const rpm = Number(event.detail.electrics.rpmTacho);
        console.log("rpm", rpm);
        setRpm(rpm);
      }
      if (event.detail.electrics.oil) {
        const oilTempInCelsius = Math.round(event.detail.electrics.oil * 130);
        const oilTempInFahrenheit = convertToFahrenheit(oilTempInCelsius);
        console.log("oilTempInFahrenheit", oilTempInFahrenheit);
        setTemperature(oilTempInFahrenheit);
      }
    }

    document.addEventListener("LuaSetup", handleSetup);
    document.addEventListener("LuaDataUpdate", handleDataUpdate);

    return () => {
      document.removeEventListener("LuaSetup", handleSetup);
      document.removeEventListener("LuaDataUpdate", handleDataUpdate);
    };
  }, [payloads]);

  return (
    <div className="min-h-screen bg-gray-900">
      {payloads.length > 0 && (
        <>
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
          <BackgroundGrid />
        </>
      )}
      {/* Debug Panel */}

      {/* Speedometer */}
      <div className="fixed top-0 w-screen">
        <div className="flex flex-row items-center justify-center">
          <div className="bg-gray-900">
            <Speedometer value={speed} />
            {isDev && (
              <>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() =>
                    setSpeed((prev) => (prev > 10 ? prev - 10 : 0))
                  }
                >
                  - Speed
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() =>
                    setSpeed((prev) => (prev + 10 > 160 ? 160 : prev + 10))
                  }
                >
                  + Speed
                </button>
              </>
            )}
          </div>
          <div className="flex flex-col items-center justify-center">
            <TemperatureGauge value={temperature} />
            {isDev && (
              <>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setTemperature((prev) => prev + 10)}
                >
                  + temp
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setTemperature((prev) => prev - 10)}
                >
                  - temp
                </button>
              </>
            )}
          </div>
          <div className="flex flex-col items-center bg-gray-900">
            <Tachometer
              value={isDev ? testingRpm : rpm}
              redLine={redLine}
              maxValue={maxRPM}
            />
            {isDev && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
