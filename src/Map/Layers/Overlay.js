import { memo, useContext, useEffect, useState } from "react";
import { MapContextMapbox } from "../Mapbox";
import NewATS from "../../Data/NewATS.geojson";
import { NewWayPoint, Route, RoutePoints, RouteMerged } from "./GeoJSONFile";
import * as turf from "@turf/turf";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const Overlay = () => {
  const { map } = useContext(MapContextMapbox);
  // const [currentFeatureId, setCurrentFeatureId] = useState(undefined);
  // const [atsFile, setAtsFile] = useState([]);
  // const [linesArray, setLinesArray] = useState([]);

  let currentFeatureId = null;
  let linesArray = [];
  const buffered = turf.buffer(RouteMerged, 100, { units: "kilometers" });

  useEffect(() => {
    if (!map) {
      return;
    }

    const getATSFile = async () => {
      await fetch(NewATS)
        .then((res) => res.json())
        .then((output) => {
          turf.featureEach(output, (line) => {
            if (
              turf.booleanContains(
                buffered.features[0],
                turf.bboxPolygon(turf.bbox(line))
              )
            ) {
              linesArray.push(line);
            }
          });
        });
    };

    getATSFile().then(() => {
      console.log(turf.featureCollection(linesArray));
      map.on("load", () => {
        map.addSource("filteredFeature", {
          type: "geojson",
          data: turf.featureCollection(linesArray),
        });
        map.addLayer({
          id: "filteredFeature",
          type: "line",
          source: "filteredFeature",
          paint: {},
          layout: {
            visibility: "visible",
          },
        });
      });
    });
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    let canvas = map.getCanvasContainer();

    function onMove(e) {
      let coords = e.lngLat;

      // Set a UI indicator for dragging.
      canvas.style.cursor = "grabbing";
    }

    function onUp(e) {
      if (
        currentFeatureId > 1 &&
        currentFeatureId < RoutePoints.features.length
      ) {
        let coords = e.lngLat;

        let nearestWayPoint = turf.nearestPoint(
          [coords.lng, coords.lat],
          NewWayPoint
        );

        let nearestWayPointCoords = nearestWayPoint.geometry.coordinates;

        let newPoint = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: nearestWayPointCoords,
          },
          properties: {
            id: currentFeatureId + 1,
          },
        };

        RoutePoints.features.splice(currentFeatureId - 1, 1, newPoint);
        for (let i = 0; i < RoutePoints.features.length; i++) {
          RoutePoints.features[i].properties.Seq = i + 1;
        }
        map.getSource("RoutePoints").setData(RoutePoints);

        let curLine = 0;
        if (currentFeatureId >= 2) {
          curLine = currentFeatureId - 1;
        }
        if (curLine > 0 && curLine < Route.features.length) {
          let isFirstSeg = false;
          let isLastSeg = false;
          let firstSeg;
          let lastSeg;
          if (Route.features.length - 2 === curLine - 1) {
            isLastSeg = true;
            lastSeg = [
              Route.features[Route.features.length - 1].geometry.coordinates[0],
              Route.features[Route.features.length - 1].geometry.coordinates[1],
            ];
          } else if (curLine - 1 === "0") {
            isFirstSeg = true;
            firstSeg = [
              Route.features[0].geometry.coordinates[0],
              Route.features[0].geometry.coordinates[1],
            ];
          }
          Route.features.splice(curLine - 1, 2);

          let vertexOne = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                isFirstSeg
                  ? firstSeg[0]
                  : [...Route.features[curLine - 2].geometry.coordinates[1]],
                nearestWayPointCoords,
              ],
            },
            properties: {
              id: currentFeatureId + 1,
            },
          };
          let vertexTwo = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                nearestWayPointCoords,
                isLastSeg
                  ? lastSeg[1]
                  : [...Route.features[curLine - 1].geometry.coordinates[0]],
              ],
            },
            properties: {
              id: currentFeatureId + 1,
            },
          };
          Route.features.splice(curLine - 1, 0, vertexOne, vertexTwo);

          for (let j = 0; j < Route.features.length; j++) {
            Route.features[j].properties.id = j + 1;
          }
          map.getSource("Route").setData(Route);
          canvas.style.cursor = "";
          // Unbind mouse/touch events
          map.off("mousemove", onMove);
          map.off("touchmove", onMove);
        }
      }
    }

    // Load all the layers
    map.on("load", () => {
      // Adding Route Layer
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
          "circle-radius": 2,
          "circle-color": "black",
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-opacity": 0.5,
        },
        layout: {
          visibility: "visible",
        },
      });

      // Adding NewWayPoint Labels
      map.addSource("NewWayPointLabels", {
        type: "vector",
        url: "mapbox://rahulsds.a2ttfiym",
      });
      map.addLayer({
        id: "NewWayPointLabels",
        type: "symbol",
        source: "NewWayPointLabels",
        "source-layer": "NewWayPoint-6ug16e",
        layout: {
          visibility: "visible",
          "text-field": ["get", "PNAME"],
          "text-variable-anchor": ["top", "bottom", "left", "right"],
          "text-radial-offset": 0.5,
          "text-justify": "auto",
          "text-size": 8,
        },
        paint: {
          // "text-color": "blue",
        },
      });

      // Adding Route Points
      map.addSource("RoutePoints", {
        type: "geojson",
        data: RoutePoints,
      });
      map.addLayer({
        id: "RoutePoints",
        type: "circle",
        source: "RoutePoints",
        paint: {
          "circle-radius": 3.5,
          "circle-color": "blue",
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-opacity": 0.5,
        },
        layout: {
          visibility: "visible",
        },
      });

      // Adding Route Points Labels
      map.addSource("RoutePointsLabel", {
        type: "geojson",
        data: RoutePoints,
      });
      map.addLayer({
        id: "RoutePointsLabel",
        type: "symbol",
        source: "RoutePointsLabel",
        paint: { "text-color": "blue" },
        layout: {
          "text-field": ["get", "PointFromName"],
          "text-variable-anchor": ["right"],
          "text-radial-offset": 1,
          "text-justify": "auto",
          "text-size": 8,
        },
      });

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

      // When the cursor enters a feature in the point layer, prepare for dragging.
      map.on("mouseenter", "RoutePoints", function () {
        // map.setPaintProperty("RoutePoints", "circle-color", "#3bb2d0");
        canvas.style.cursor = "default";
      });

      map.on("mousemove", "RoutePoints", function (e) {
        map.setPaintProperty("RoutePoints", "circle-radius", [
          "case",
          ["==", ["get", "Seq"], e.features[0].properties.Seq],
          8,
          4,
        ]);
      });

      map.on("mouseleave", "RoutePoints", function (e) {
        map.setPaintProperty("RoutePoints", "circle-radius", 4);
        map.setPaintProperty("RoutePoints", "circle-color", "blue");

        canvas.style.cursor = "";
      });

      map.on("mousedown", "RoutePoints", function (e) {
        // setCurrentFeatureId(e.features[0].properties.Seq);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentFeatureId = e.features[0].properties.Seq;
        // Prevent the default map drag behavior.
        e.preventDefault();
        canvas.style.cursor = "grab";

        map.on("mousemove", onMove);
        map.once("mouseup", onUp);
      });

      map.on("touchstart", "RoutePoints", function (e) {
        if (e.points.length !== 1) return;

        // Prevent the default map drag behavior.
        e.preventDefault();

        map.on("touchmove", onMove);
        map.once("touchend", onUp);
      });

      // // It will list all the layers
      // console.log(map.getStyle().layers);

      // console.log(map.getSource("Route"));

      return () => {
        map.removeLayer("Route");
        map.removeSource("Route");

        map.removeLayer("RoutePoints");
        map.removeSource("RoutePoints");

        map.removeLayer("RoutePointsLabel");
        map.removeSource("RoutePointsLabel");

        map.removeLayer("NewATS");
        map.removeSource("NewATS");

        map.removeLayer("NewWayPoint");
        map.removeSource("NewWayPoint");

        map.removeLayer("NewWayPointLabels");
        map.removeSource("NewWayPointLabels");

        map.off();
        map.remove();
      };
    });
  }, [map]);

  return null;
};

export default memo(Overlay);
