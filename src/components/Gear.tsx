import useStore from "../store";
import React, { memo } from "react";
const Gear = () => {
  const gear = useStore((state) => state.gear);
  let gearText = gear;
  if (gear === "0") {
    gearText = "N";
  } else if (gear === "-1") {
    gearText = "R";
  }
  return <div className="mt-2 p-2 bg-black text-white">{gearText}</div>
};

export default memo(Gear);

