import React, { useContext, useEffect } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import { Route, RouteMerged, RoutePoints } from "./GeoJSONFile";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import {
  SnapPolygonMode,
  SnapPointMode,
  SnapLineMode,
  SnapModeDrawStyles,
} from "mapbox-gl-draw-snap-mode";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const Layers = () => {
  const { map } = useContext(MapContextMapbox);

  const coordinates = document.getElementById("coordinates");

  useEffect(() => {
    if (!map) {
      return;
    }

    // Adding Buffer Layer
    const buffered = turf.buffer(RouteMerged, 50, { units: "kilometers" });
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
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    // Load all the layers
    map.on("load", () => {
      // Adding of Route Layer
      map.addSource("Route", {
        type: "geojson",
        data: Route,
      });
      map.addLayer({
        id: "Route",
        type: "line",
        source: "Route",
        paint: {
          "line-color": "blue",
          "line-width": 2,
          "line-opacity": 1,
        },
        layout: {
          visibility: "visible",
        },
      });

      // Adding Route Points Labels
      map.addSource("RoutePoints", {
        type: "geojson",
        data: RoutePoints,
      });
      map.addLayer({
        id: "RoutePoints",
        type: "symbol",
        source: "RoutePoints",
        paint: { "text-color": "blue" },
        layout: {
          "text-field": ["get", "PointFromName"],
          "text-variable-anchor": ["right"],
          "text-radial-offset": 1,
          "text-justify": "auto",
          "text-size": 8,
        },
      });

      // Adding ATS Line
      map.addSource("NewATS", {
        type: "vector",
        url: "mapbox://rahulsds.2sjl9bsx",
      });
      map.addLayer({
        id: "NewATS",
        type: "line",
        source: "NewATS",
        "source-layer": "NewATS",
        paint: {
          "line-color": "grey",
          "line-width": 0.5,
          "line-opacity": 1,
        },
        layout: {
          visibility: "visible",
        },
      });

      // Addomg Way Points
      map.addSource("NewWayPoint", {
        type: "vector",
        url: "mapbox://rahulsds.a2ttfiym",
      });
      map.addLayer({
        id: "NewWayPoint",
        type: "circle",
        source: "NewWayPoint",
        "source-layer": "NewWayPoint-6ug16e",
        paint: {
          "circle-radius": 3,
          "circle-color": "blue",
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-opacity": 0.5,
        },
        layout: {
          visibility: "visible",
        },
      });
      // Adding NewWayPoint Labels
      map.addLayer({
        id: "NewWayPointLabels",
        type: "symbol",
        source: "NewWayPoint",
        "source-layer": "NewWayPoint-6ug16e",
        layout: {
          visibility: "visible",
          "text-field": ["get", "PNAME"],
          "text-variable-anchor": ["top", "bottom", "left", "right"],
          "text-radial-offset": 0.5,
          "text-justify": "auto",
          "icon-image": ["concat", ["get", "icon"], "-15"],
          "text-size": 8,
        },
        paint: {
          // "text-color": "blue",
        },
      });

      const draw = new MapboxDraw({
        modes: {
          ...MapboxDraw.modes,
          draw_point: SnapPointMode,
          draw_polygon: SnapPolygonMode,
          draw_line_string: SnapLineMode,
        },
        styles: SnapModeDrawStyles,
        userProperties: true,
        snap: true,
        snapOptions: {
          snapPx: 15, // defaults to 15
          snapToMidPoints: true, // defaults to false
          snapVertexPriorityDistance: 1.25, // defaults to 1.25
        },
        guides: true,
      });
      map.addControl(draw, "top-right");

      draw.add(RouteMerged);

      return () => {
        map.removeLayer("RoutePoints");
        map.removeSource("RoutePoints");

        map.removeLayer("Route");
        map.removeSource("Route");

        map.removeControl(draw);
      };
    });
  }, [coordinates, map]);

  return (
    <div>
      <div id="coordinates"></div>
    </div>
  );
};

export default Layers;
