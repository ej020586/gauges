import React, { useEffect, useState } from "react";
import BackgroundGrid from "./BackgroundGrid";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    function handleSetup() {
      // Initialization logic once Lua calls setup()
      console.log("Received LuaSetup event");
    }

    function handleDataUpdate(event) {
      // Data from Lua
      setData(event.detail);
    }

    document.addEventListener("LuaSetup", handleSetup);
    document.addEventListener("LuaDataUpdate", handleDataUpdate);

    return () => {
      document.removeEventListener("LuaSetup", handleSetup);
      document.removeEventListener("LuaDataUpdate", handleDataUpdate);
    };
  }, []);

  return (
    <>
      <div className="p-4">
        <div className="absolute top-10 left-10 z-10 bg-white text-black">
          <h1 className="text-2xl mb-4">BeamNG Debug Panel</h1>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
      <BackgroundGrid />
    </>
  );
}

export default App;
