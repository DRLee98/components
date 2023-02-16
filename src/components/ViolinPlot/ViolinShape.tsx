import React, { memo } from "react";
import * as d3 from "d3";
import { IChartData, ITooltipData } from ".";

interface IVerticalViolinShape extends IChartData {
  binNumber: number;
  yScale: d3.ScaleLinear<number, number, never>;
  width: number;
  marginTop: number;
  addTooltipData: (
    x: number,
    y: number,
    name: string,
    data: ITooltipData
  ) => void;
  removeTooltipData: (key: ITooltipData["key"] | "all") => void;
}

function VerticalViolinShape({
  name,
  values,
  maximum,
  maximumY,
  median,
  medianY,
  minimum,
  minimumY,
  quartileInterval,
  quartileIntervalY,
  confidenceInterval,
  confidenceIntervalY,
  binNumber,
  yScale,
  width,
  marginTop,
  addTooltipData,
  removeTooltipData,
}: IVerticalViolinShape) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  const binBuilder = d3
    .bin()
    .domain([min, max])
    .thresholds(yScale.ticks(binNumber))
    .value((d) => d);
  const bins = binBuilder(values);

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

  const onMouseMove = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const y = offsetY - marginTop;
    const tooltipDataControl = (
      y1: number,
      y2: number,
      key: ITooltipData["key"],
      value: number | [number, number]
    ) => {
      if (y >= y1 && y <= y2) {
        addTooltipData(offsetX, y, name, { key, value });
      } else {
        removeTooltipData(key);
      }
    };

    tooltipDataControl(maximumY - 5, maximumY + 5, "maximum", maximum);
    tooltipDataControl(medianY - 5, medianY + 5, "median", median);
    tooltipDataControl(minimumY - 5, minimumY + 5, "minimum", minimum);
    tooltipDataControl(
      quartileIntervalY[1] - 5,
      quartileIntervalY[0] + 5,
      "quartileInterval",
      quartileInterval
    );
    tooltipDataControl(
      confidenceIntervalY[1] - 5,
      confidenceIntervalY[0] + 5,
      "confidenceInterval",
      confidenceInterval
    );
  };

  return (
    <g>
      <path
        d={areaPath || undefined}
        opacity={1}
        stroke="#0099FE"
        fill="#0098fe74"
        fillOpacity={0.1}
        strokeWidth={2}
      />
      <line
        x1={width / 2}
        x2={width / 2}
        y1={confidenceIntervalY[0]}
        y2={confidenceIntervalY[1]}
        stroke="#0099FE"
        strokeWidth={3}
      />
      <line
        x1={width / 2}
        x2={width / 2}
        y1={quartileIntervalY[0]}
        y2={quartileIntervalY[1]}
        stroke="#0099FE"
        strokeWidth={7}
      />
      <circle cx={width / 2} cy={medianY} r={3} fill="#ffffff" />
      <rect
        x={-5}
        y={maximumY - 5}
        width={width + 5}
        height={minimumY - maximumY + 5}
        fill="transparent"
        transform={"translate(2, 5)"}
        onMouseMove={onMouseMove}
        onMouseOut={() => removeTooltipData("all")}
      />
    </g>
  );
}

export default memo(
  VerticalViolinShape,
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);
