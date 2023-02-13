import React from "react";
import { IChartData } from ".";

function BoxShape({
  x,
  x1,
  x2,
  maximumY,
  minimumY,
  Q1Y,
  Q2Y,
  Q3Y,
}: IChartData) {
  return (
    <g>
      <line
        y1={maximumY}
        y2={maximumY}
        x1={x1}
        x2={x2}
        stroke="#202020"
        strokeWidth={2}
      />
      <line
        y1={maximumY}
        y2={minimumY}
        x1={x}
        x2={x}
        stroke="#202020"
        strokeDasharray="3 3"
        strokeWidth={4}
      />
      <line
        y1={minimumY}
        y2={minimumY}
        x1={x1}
        x2={x2}
        stroke="#202020"
        strokeWidth={2}
      />
      <rect y={Q3Y} height={Q1Y - Q3Y} x={x1} width={x2 - x1} fill="#c884f0" />
      <line
        y1={Q2Y}
        y2={Q2Y}
        x1={x1}
        x2={x2}
        stroke="#202020"
        strokeWidth={2}
      />
    </g>
  );
}

export default BoxShape;
