import React, { memo } from "react";

const GaugeLabel = ({ value }: { value: number }) => {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
      <div className="px-4 py-2">
        <span className="font-mono text-2xl text-black tabular-nums">
          {value.toFixed(0)}
        </span>
      </div>
    </div>
  );
};

export default memo(GaugeLabel);
