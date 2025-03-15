import React, { memo } from "react";
import useFuelTechData from "../hooks/useFuelTechData";
import useRpmBarCanvas from "../hooks/useRpmBarCanvas";
import GameSimulationButtons from "./GameSimulationButtons";

interface FuelTechGaugeProps {
  className?: string;
}

const FuelTechGauge: React.FC<FuelTechGaugeProps> = ({ className }) => {
  const data = useFuelTechData();
  const maxRpm = 9000; // Maximum RPM for the gauge
  const { canvasRef } = useRpmBarCanvas({ rpm: data.rpm, maxRpm });

  // Format numbers for display
  const formatNumber = (num: number, decimals: number = 0) => {
    return num.toFixed(decimals);
  };

  // Helper to conditionally render data or empty placeholder
  const renderValue = (
    value: number | null | undefined,
    format: (val: number) => string
  ) => {
    if (value === null || value === undefined) return "";
    return format(value);
  };

  // Calculate battery percentage (10-20V range)
  const getBatteryPercentage = () => {
    if (!data.battery) return 0;
    // Map 10-20V to 0-100%
    const percentage = ((data.battery - 10) / 10) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  return (
    <>
      <GameSimulationButtons />
      <div
        className={`bg-[#111827] text-white p-4 rounded-lg ${className}`}
        style={{ width: "600px", maxWidth: "100%" }}
      >
        {/* Main Display */}
        <div className="bg-[#111827] p-4 rounded-lg relative">
          {/* Top Row - RPM Display */}
          <div className="flex items-start relative z-10">
            {/* RPM Value - Large on left */}
            <div className="text-6xl font-bold font-mono text-white w-[160px]">
              {formatNumber(data.rpm)}
            </div>

            {/* RPM Max - Top right */}
            <div className="flex flex-col items-end">
              <div className="text-xl text-gray-400">{maxRpm}</div>
              <div className="text-xl text-gray-400">RPM</div>
            </div>

            {/* REC indicator - Far right */}
            <div
              className={`flex items-center ml-4  ${
                data.recording ? "text-red-600" : "text-gray-400"
              }`}
            >
              <div
                className={`bg-red-600 h-4 w-4 m-1 rounded-full ${
                  data.recording ? "opacity-100" : "opacity-0"
                }`}
              ></div>
              REC
            </div>
          </div>

          {/* RPM Bar */}
          <div className="mb-2 absolute top-8">
            <canvas
              ref={canvasRef}
              width={580}
              height={40}
              className="w-full rounded-none"
            />
          </div>

          {/* RPM Bar Labels */}
          <div className="grid grid-cols-9 mb-6 text-center">
            <div className="col-span-3">
              <div className="text-yellow-300 text-sm">MAP</div>
            </div>
            <div className="col-span-2">
              <div className="text-yellow-300 text-sm">O2 Left</div>
            </div>
            <div className="col-span-4">
              <div className="text-yellow-300 text-sm">O2 Right</div>
            </div>
          </div>

          {/* Main Values */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold font-mono text-white">
                {renderValue(data.map, (val) => val.toFixed(2))}
              </div>
              <div className="text-gray-400 text-lg mt-1">PSI</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold font-mono text-white">
                {renderValue(data.o2Left, (val) => val.toFixed(3))}
              </div>
              <div className="text-gray-400 text-lg mt-1">AFR</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold font-mono text-white">
                {renderValue(data.o2Right, (val) => val.toFixed(3))}
              </div>
              <div className="text-gray-400 text-lg mt-1">AFR</div>
            </div>
          </div>

          {/* Secondary Values - with yellow labels */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            <div className="flex flex-col items-center">
              <div className="text-yellow-300 text-sm mb-2">F Brake</div>
              <div className="text-3xl font-bold font-mono text-white">
                {renderValue(data.fBrake, (val) => val.toFixed(1))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-yellow-300 text-sm mb-2">Inj. T. P.</div>
              <div className="text-3xl font-bold font-mono text-white">
                {renderValue(data.injectorPulse, (val) => val.toFixed(3))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-yellow-300 text-sm mb-2">Fuel P.</div>
              <div className="text-3xl font-bold font-mono text-white">
                {renderValue(data.fuelPressure, (val) => val.toFixed(2))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-yellow-300 text-sm mb-2">TPS</div>
              <div className="text-3xl font-bold font-mono text-white">
                {renderValue(data.tps, (val) => val.toFixed(0))}
              </div>
            </div>
            <div className="flex flex-col">
              {/* TPS Bar */}
              <div className="w-full h-10 bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${data.tps}%` }}
                ></div>
              </div>
              <div className="flex justify-between w-full text-sm text-gray-400 mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Bottom Row - Gauges */}
          <div className="grid grid-cols-5 gap-2">
            <div className="flex flex-col items-center">
              <div className="text-yellow-300 text-sm mb-2">Data</div>
              <div className="border border-gray-600 rounded-sm p-0.5">
                <div className="bg-green-500 text-black text-sm px-2 py-1 font-mono">
                  {renderValue(
                    data.dataPercentage,
                    (val) => `${val.toFixed(1)}%`
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-yellow-300 text-sm mb-2">O2 Corr</div>
              <div className="text-3xl font-bold font-mono text-white">
                {renderValue(data.o2Correction, (val) => val.toFixed(1))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-yellow-300 text-sm mb-2">Timing</div>
              <div className="text-3xl font-bold font-mono text-white">
                {renderValue(data.timing, (val) => val.toFixed(2))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-yellow-300 text-sm mb-2">Oil P.</div>
              <div className="text-3xl font-bold font-mono text-white">
                {renderValue(data.oilPressure, (val) => val.toFixed(2))}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-yellow-300 text-sm mb-2">Battery</div>
              <div className="w-full h-10 bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${getBatteryPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between w-full text-sm text-gray-400 mt-1">
                <span>10</span>
                <span>15</span>
                <span>20</span>
              </div>
            </div>
          </div>

          {/* Bottom Logo */}
          <div className="flex justify-center mt-10">
            <div className="text-gray-500 font-bold text-2xl tracking-wider">
              FT550
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(FuelTechGauge);
