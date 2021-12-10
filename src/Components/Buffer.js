import React, { useState } from "react";
import { RouteMerged } from "./Layers/GeoJSONFile";
import * as turf from "@turf/turf";


const Buffer = () => {
  const [bufferRadius, setBufferRadius] = useState("");

  const createBuffer = () => {
    const buffered = turf.buffer(RouteMerged, 50, { units: "kilometers" });
  };
  return (
    <div>
      <input
        type="number"
        onChange={(e) => setBufferRadius(e.target.value)}
        value={bufferRadius}
        placeholder="Enter Buffer Radius"
      />
      <button onClick={createBuffer()}>Create Buffer</button>
    </div>
  );
};

export default Buffer;
