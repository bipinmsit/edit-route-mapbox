import React from "react";
import { Mapbox } from "./Map/Mapbox";
import { Layers, Overlay } from "./Map/Layers";
import { Controls, LayerSwitcher } from "./Map/Controls";
import UIWork from "./Components/UIWork/UIWork";
import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <div className="container-fluid mt-1">
        <div className="row">
          <div className="col-3" style={{ backgroundColor: "#87CEEB" }}>
            <UIWork />
          </div>
          <div className="col-9">
            <Mapbox zoom={5} center={[78, 18]}>
              <Layers>
                <Overlay />
              </Layers>
              <Controls>
                <LayerSwitcher />
              </Controls>
            </Mapbox>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
