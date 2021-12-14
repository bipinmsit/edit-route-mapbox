import React, { useContext, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { MapContextMapbox } from "../Map/Mapbox";
import "./Controls.css";

const LayerSwitcher = () => {
  const { map } = useContext(MapContextMapbox);

  const [toggleableLayerIds, setToggleableLayerIds] = useState([
    {
      id: 1,
      layerId: "Route",
    },
    { id: 2, layerId: "NewATS" },
    { id: 3, layerId: "NewWayPoint" },
    { id: 4, layerId: "NewWayPointLabels" },
  ]);

  const [style, setStyle] = useState("rgb(200, 200, 200)");

  useEffect(() => {
    if (!map) {
      return;
    }

    map.on("idle", () => {
      if (
        !map.getLayer("Route") ||
        !map.getLayer("RoutePoints") ||
        !map.getLayer("RoutePointsLabel") ||
        !map.getLayer("NewATS") ||
        !map.getLayer("NewWayPoint") ||
        !map.getLayer("NewWayPointLabels")
      ) {
        return;
      }
    });
  }, [map]);

  const toggleLegend = (legendLayerId) => {
    const clickedLayer = legendLayerId;

    const clickedTag = document.getElementById(clickedLayer);
    clickedTag.style.backgroundColor =
      clickedTag.style.backgroundColor === "rgb(255, 255, 255)"
        ? "rgb(200, 200, 200)"
        : "rgb(255, 255, 255)";

    const visibility = map.getLayoutProperty(clickedLayer, "visibility");

    // Toggle layer visibility by changing the layout object's visibility property.
    if (visibility === "visible") {
      map.setLayoutProperty(clickedLayer, "visibility", "none");
      // this.className = "";
    } else {
      // this.className = "active";
      map.setLayoutProperty(clickedLayer, "visibility", "visible");
    }
  };

  return (
    <div>
      <nav id="menu">
        {toggleableLayerIds.map((layer) => {
          return (
            <a
              href="#"
              key={layer.id}
              id={layer.layerId}
              style={{ backgroundColor: style }}
              onClick={() => {
                toggleLegend(layer.layerId);
              }}
            >
              {layer.layerId}
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default LayerSwitcher;
