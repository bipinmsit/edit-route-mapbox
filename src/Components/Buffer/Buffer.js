import React, { useContext, useState } from "react";
import { RouteMerged } from "../../Map/Layers/GeoJSONFile";
import * as turf from "@turf/turf";
import "./Buffer.css";
import { MapContextMapbox } from "../../Map/Mapbox";

const Buffer = () => {
  const [bufferRadius, setBufferRadius] = useState("");

  const { map } = useContext(MapContextMapbox);

  const createBuffer = () => {
    const buffered = turf.buffer(RouteMerged, 500, { units: "kilometers" });
    console.log(buffered);

    if (map) {
      map.on("load", () => {
        map.addSource("Buffer", {
          type: "geojson",
          data: buffered,
        });
        map.addLayer({
          id: "Buffer",
          type: "fill",
          source: "Buffer",
          paint: {
            "fill-color": "grey",
            "fill-opacity": 0.2,
          },
          layout: {
            visibility: "visible",
          },
        });
      });
    }
  };
  return (
    <div className="Buffer">
      <input
        type="number"
        onChange={(e) => setBufferRadius(e.target.value)}
        value={bufferRadius}
        placeholder="Enter Buffer Radius"
      />
      <button onClick={createBuffer}>Create Buffer</button>
    </div>
  );
};

export default Buffer;
