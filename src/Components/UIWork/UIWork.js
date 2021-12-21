import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./UIWork.css";

const UIWork = () => {
  const [fromToData, setFromToData] = useState([]);
  const [fromData, setFromData] = useState("");
  const [toData, setToData] = useState("");
  const [routeList, setRouteList] = useState([]);

  useEffect(() => {
    const url = "http://localhost:8090/api/get/fromTo";
    const getFromToData = async () => {
      await fetch(url)
        .then((data) => data.json())
        .then((res) => setFromToData(res));
    };

    getFromToData();
  }, []);

  useEffect(() => {
    const url = "http://localhost:8090/api/get/routeList";
    const getrouteList = async () => {
      await fetch(url)
        .then((data) => data.json())
        .then((res) => setRouteList(res));
    };

    getrouteList();
  }, [fromData, toData]);

  return (
    <div style={{ backgroundColor: "#87CEEB" }}>
      <div className="d-flex flex-row justify-content-around">
        <div>
          <label>From : &nbsp;</label>
          <select
            name="fromData"
            id="fromData"
            onChange={(e) => setFromData(e.target.value)}
          >
            <option value="select">From</option>
            {fromToData.map((fromData, index) => {
              return (
                <option value={fromData.ICAO} key={index}>
                  {fromData.ICAO}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label>To : &nbsp;</label>
          <select
            name="toData"
            id="toData"
            onChange={(e) => setToData(e.target.value)}
          >
            <option value="select">To</option>
            {fromToData.map((toData, index) => {
              return (
                <option value={toData.ICAO} key={index}>
                  {toData.ICAO}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div>
        <button
          className="existing_route"
          onClick={() => {
            console.log("getting routeList");
          }}
        >
          Existing Route
        </button>
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
          <label className="form-check-label">ATS</label>
        </div>

        <button className="primary ">Edit Route</button>
      </div>
    </div>
  );
};

export default UIWork;
