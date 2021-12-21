import React, { useContext, useState, useEffect } from "react";
import { RouteMerged } from "../../Map/Layers/GeoJSONFile";
import * as turf from "@turf/turf";
import "./Buffer.css";
import { MapContextMapbox } from "../../Map/Mapbox";

const Buffer = () => {
  const [bufferRadius, setBufferRadius] = useState(0);
  const [bufferInst, setBufferInst] = useState(
    turf.buffer(RouteMerged, 50, {
      units: "kilometers",
    })
  );

  const { map } = useContext(MapContextMapbox);

  useEffect(() => {
    if (!map) {
      return;
    }
    const buffered = turf.buffer(RouteMerged, bufferRadius, {
      units: "kilometers",
    });

    map.on("load", () => {
      map.addSource("Buffer", {
        type: "geojson",
        data: bufferInst,
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
  }, [bufferInst, bufferRadius, map]);

  return (
    <div className="Buffer">
      <input
        type="number"
        onChange={(e) => setBufferRadius(e.target.value)}
        value={bufferRadius}
        placeholder="Enter Buffer Radius"
      />
      <button
        onClick={() => {
          setBufferInst(
            turf.buffer(RouteMerged, bufferRadius, {
              units: "kilometers",
            })
          );
        }}
      >
        Create Buffer
      </button>
    </div>
  );
};

export default Buffer;
