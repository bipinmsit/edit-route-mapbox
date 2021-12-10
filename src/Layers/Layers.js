import React, { useContext, useEffect, useState, useRef } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import { Route, RouteMerged, RoutePoints } from "./GeoJSONFile";
import * as turf from "@turf/turf";
// import Route from "../data/Route.geojson";
// import RoutePoints from "../data/RoutePoints.geojson";

const Layers = () => {
  const { map } = useContext(MapContextMapbox);
  // const [currentFeatureId, setCurrentFeatureId] = useState("");

  const coordinates = document.getElementById("coordinates");

  // Creating Buffer

  useEffect(() => {
    if (!map) {
      return;
    }

    const canvas = map.getCanvasContainer();
    let currentFeatureId;

    const buffered = turf.buffer(RouteMerged, 50, { units: "kilometers" });

    const onMove = (e) => {
      const coords = e.lngLat;

      // console.log(coords);

      // Set a UI indicator for dragging.
      canvas.style.cursor = "grabbing";

      // const currentMarker = RoutePoints.features.find((obj) => {
      //   return obj.properties.Seq === currentFeatureId;
      // });
      // console.log(currentMarker);
      // currentMarker.geometry.coordinates = [coords.lng, coords.lat];
      // map.getSource("RoutePoints").setData(RoutePoints);
    };

    const onUp = (e) => {
      const coords = e.lngLat;

      // console.log(coords);

      const newPoint = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [coords.lng, coords.lat],
        },
        properties: {
          id: currentFeatureId + 1,
        },
      };

      RoutePoints.features.splice(currentFeatureId, 0, newPoint);
      for (let i = 0; i < RoutePoints.features.length; i++) {
        RoutePoints.features[i].properties.Seq = i + 1;
      }
      map.getSource("RoutePoints").setData(RoutePoints);

      //const prevPoint = updatedLineList.features.findIndex(x => x.properties.id === currentFeatureId - 1);

      let curLine = 0;
      console.log(currentFeatureId);
      if (currentFeatureId === 1 || currentFeatureId === 2) {
        curLine = 0;
      } else if (currentFeatureId > 2) {
        curLine = currentFeatureId - 2;
      }

      console.log(curLine);
      console.log(Route.features);
      console.log(...Route.features[curLine + 1].geometry.coordinates[1]);

      // const NextPoint = updatedLineList.features.findIndex(x => x.properties.id === currentFeatureId + 1);
      const newLine = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [coords.lng, coords.lat],
            [...Route.features[curLine + 1].geometry.coordinates[1]],
          ],
        },
        properties: {
          id: currentFeatureId + 1,
        },
      };

      Route.features[curLine].geometry.coordinates[1] = [
        coords.lng,
        coords.lat,
      ];

      Route.features.splice(currentFeatureId, 0, newLine);
      for (let i = 0; i < Route.features.length; i++) {
        Route.features[i].properties.id = i + 1;
      }

      map.getSource("Route").setData(Route);

      // Print the coordinates of where the point had
      // finished being dragged to on the map.
      coordinates.style.display = "block";
      coordinates.innerHTML =
        "Longitude: " + coords.lng + "<br />Latitude: " + coords.lat;
      canvas.style.cursor = "";

      // Snapping to the vertex
      let snapTo = map.getSource("NewWayPoint");

      console.log(snapTo);

      turf.featureEach(snapTo, (feature) => {
        console.log(feature);
        let dist = turf.distance(feature, turf.point([coords.lng, coords.lat]));
        console.log(dist);
        // if the distance of the dragging point is under a certain threshold
        if (dist < 10000) {
          // set the location of the dragging point to the location of the snapping point
          RoutePoints.features[0].geometry.coordinates =
            feature.geometry.coordinates;
          map.getSource("RoutePoints").setData(RoutePoints);
        }
      });

      // Unbind mouse/touch events
      map.off("mousemove", onMove);
      map.off("touchmove", onMove);
    };

    // When the cursor enters a feature in the point layer, prepare for dragging.
    map.on("mouseenter", "RoutePoints", function () {
      map.setPaintProperty("RoutePoints", "circle-color", "#3bb2d0");
      canvas.style.cursor = "move";
    });

    map.on("mouseleave", "RoutePoints", function (e) {
      map.setPaintProperty("RoutePoints", "circle-color", "#3887be");
      canvas.style.cursor = "";
    });

    map.on("mousedown", "RoutePoints", function (e) {
      e.preventDefault();

      // setCurrentFeatureId({ id: e.features[0].properties.Seq });
      currentFeatureId = e.features[0].properties.Seq;
      // Prevent the default map drag behavior.
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

      // Adding Buffer Layer
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

      // map.addLayer({
      //   id: "Route",
      //   type: "line",
      //   source: {
      //     type: "vector",
      //     url: "mapbox://rahulsds.dtu3uhh2",
      //   },
      //   "source-layer": "Route-7c76pt",
      //   paint: {
      //     "line-color": "blue",
      //     "line-width": 2,
      //     "line-opacity": 1,
      //   },
      //   layout: {
      //     visibility: "visible",
      //   },
      // });

      // map.addLayer({
      //   id: "NewATS",
      //   type: "line",
      //   source: {
      //     type: "vector",
      //     url: "mapbox://rahulsds.2sjl9bsx",
      //   },
      //   "source-layer": "NewATS",
      //   paint: {
      //     "line-color": "grey",
      //     "line-width": 0.5,
      //     "line-opacity": 1,
      //   },
      //   layout: {
      //     visibility: "visible",
      //   },
      // });

      return () => {
        map.removeLayer("RoutePoints");
        map.removeSource("RoutePoints");

        map.removeLayer("Route");
        map.removeSource("Route");
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
