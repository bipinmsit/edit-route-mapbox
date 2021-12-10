import React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Mapbox } from "./Map/Mapbox";
import Layers from "./Layers/Layers";

function App() {
  return (
    <>
      <Mapbox zoom={7} center={[78, 18]}>
        <Layers />
      </Mapbox>
    </>
  );
}

export default App;
