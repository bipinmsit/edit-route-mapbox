import React from "react";
import { Dropdown } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "./UIWork.css";

const UIWork = () => {
  return (
    <div style={{ backgroundColor: "#87CEEB" }}>
      <div className="d-flex flex-row justify-content-around">
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              From
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              To
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="d-flex justify-content-around">
        <Button variant="primary" className="existing_route">
          Existing Route
        </Button>
      </div>

      <hr />

      <textarea className="text_area" style={{ backgroundColor: "#87CEEB" }} />
      <div className="d-flex justify-content-around">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
          />
          <label className="form-check-label" for="flexCheckDefault">
            Default checkbox
          </label>
        </div>

        <Button variant="primary" className="">
          Edit Route
        </Button>
      </div>
    </div>
  );
};

export default UIWork;
