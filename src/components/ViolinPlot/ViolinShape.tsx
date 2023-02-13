import React from "react";
import * as d3 from "d3";

type IVerticalViolinShape = {
  data: number[];
  median: number;
  quartileInterval: [number, number];
  confidenceInterval: [number, number];
  yDomain: [number, number];
  binNumber: number;
  yScale: d3.ScaleLinear<number, number, never>;
  width: number;
  height: number;
};

function VerticalViolinShape({
  data,
  median,
  quartileInterval,
  confidenceInterval,
  yDomain,
  binNumber,
  yScale,
  width,
  height,
}: IVerticalViolinShape) {
  const min = Math.min(...data);
  const max = Math.max(...data);

  const binBuilder = d3
    .bin()
    .domain([min, max])
    .thresholds(yScale.ticks(binNumber))
    .value((d) => d);
  const bins = binBuilder(data);

  const biggestBin = Math.max(...bins.map((b) => b.length));

  const wScale = d3
    .scaleLinear()
    .domain([-biggestBin, biggestBin])
    .range([0, width]);

  const areaBuilder = d3
    .area<d3.Bin<number, number>>()
    .x0((d) => wScale(-d.length))
    .x1((d) => wScale(d.length))
    .y((d) => yScale(d.x0 || 0))
    .curve(d3.curveBumpY);

  const areaPath = areaBuilder(bins);

  const getY = (value: number) => {
    const range = yDomain[1] - yDomain[0];
    const target = 1 - (value - yDomain[0]) / range;
    return height * target;
  };

  return (
    <g>
      <path
        d={areaPath || undefined}
        opacity={1}
        stroke="#9a6fb0"
        fill="#9a6fb0"
        fillOpacity={0.1}
        strokeWidth={2}
      />
      <line
        x1={width / 2}
        x2={width / 2}
        y1={getY(confidenceInterval[0])}
        y2={getY(confidenceInterval[1])}
        stroke="#2e2e2e"
        strokeWidth={3}
      />
      <line
        x1={width / 2}
        x2={width / 2}
        y1={getY(quartileInterval[0])}
        y2={getY(quartileInterval[1])}
        stroke="#2e2e2e"
        strokeWidth={7}
      />
      <circle cx={width / 2} cy={getY(median)} r={3} fill="#ffffff" />
    </g>
  );
}

export default VerticalViolinShape;
