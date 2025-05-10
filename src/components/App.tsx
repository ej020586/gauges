import React, { useEffect, useLayoutEffect, useState } from "react";
import Speedometer from "./Speedometer";
import Tachometer from "./Tachometer";
import TemperatureGauge from "./TemperatureGague";
import { convertToFahrenheit } from "../lib";
import useStore from "../store";
import Gear from "./Gear";

function App() {

  const setGear = useStore((state) => state.setGear);
  const setSpeed = useStore((state) => state.setSpeed);
  const setRpm = useStore((state) => state.setRpm);
  const setTemperature = useStore((state) => state.setTemperature);

  const redline = 8000;
  const maxRPM = 8500;

  useEffect(() => {
    function handleSetup(event) {
      // const payload = {
      //   timestamp: new Date().toISOString(),
      //   data: event.detail,
      // };
      // console.log("Received LuaSetup event");
      // setPayloads([...payloads, payload]);
      if (event.detail.electrics.gear !== undefined) {
        setGear(`${event.detail.electrics.gear}`);
      }
    }

    function handleDataUpdate(event) {
      // const payload = {
      //   timestamp: new Date().toISOString(),
      //   data: event.detail,
      // };
      // setPayloads([...payloads, payload]);

      // if (event.detail.electrics) {
      //   setElectrics(event.detail.electrics);
      // }

      if (event.detail.electrics.gear !== undefined) {
        setGear(`${event.detail.electrics.gear}`);
      }

      if (event.detail.electrics.wheelspeed) {
        const speed = Math.round(Number(event.detail.electrics.wheelspeed * 2.3));
        console.log("speed", speed);
        setSpeed(speed);
      }

      if (event.detail.electrics.rpmTacho) {
        const rpm = Math.round(Number(event.detail.electrics.rpmTacho));
        console.log("rpm", rpm);
        setRpm(rpm);
      }
      if (event.detail.electrics.watertemp) {
        const waterTempInCelsius = Math.round(event.detail.electrics.watertemp);
        const waterTempInFahrenheit = convertToFahrenheit(waterTempInCelsius);
        console.log("waterTempInFahrenheit", waterTempInFahrenheit);
        setTemperature(waterTempInFahrenheit);
      }
    }

    document.addEventListener("LuaSetup", handleSetup);
    document.addEventListener("LuaDataUpdate", handleDataUpdate);

    return () => {
      document.removeEventListener("LuaSetup", handleSetup);
      document.removeEventListener("LuaDataUpdate", handleDataUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="fixed top-0 w-screen">
        <div className="flex flex-row items-center justify-center">
          <div className="bg-gray-900">
            <Speedometer />
          </div>
          <div className="flex">
            <TemperatureGauge  />
            <Gear />
          </div>
          <div className="flex flex-col items-center bg-gray-900">
            <Tachometer
              redLine={redline}
              maxValue={maxRPM}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
