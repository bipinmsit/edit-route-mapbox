import React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Mapbox } from "./Map/Mapbox";
import Layers from "./Layers/Layers";
import { Controls, LayerSwitcher } from "./Controls";

function App() {
  return (
    <>
      <Mapbox zoom={5} center={[78, 18]}>
        <Layers />
        <Controls>
          <LayerSwitcher />
        </Controls>
      </Mapbox>
    </>
  );
}

export default App;
