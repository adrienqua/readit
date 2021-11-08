import React, { useState, useEffect } from "react";

const Score = (props) => {
  useEffect(() => {}, []);

  const { data, updateScore } = props;

  let colorUp = "";
  let colorDown = "";
  let colorScore = "";
  if (data.votes[0]) {
    if (data.votes[0].isUp) {
      colorUp = "text-danger";
      colorScore = "text-danger";
    } else if (data.votes[0].isDown) {
      colorDown = "text-primary";
      colorScore = "text-primary";
    } else {
      colorUp = "";
      colorDown = "";
      colorScore = "";
    }
  }

  return (
    <React.Fragment>
      <div className="score g-0 p-2">
        <button
          className="btn btn-light"
          onClick={() => updateScore(data, "-")}
        >
          <i className={`fa fa-arrow-down ${colorDown}`}></i>
        </button>{" "}
        <span className={`fw-bold ${colorScore}`}>{data.score}</span>{" "}
        <button className="btn btn-light" onClick={() => updateScore(data)}>
          <i className={`fa fa-arrow-up ${colorUp}`}></i>
        </button>
      </div>
    </React.Fragment>
  );
};

export default Score;
