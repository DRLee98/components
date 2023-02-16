import React, { memo } from "react";
import { IChartData, ITooltipData } from ".";

interface IBoxShape extends IChartData {
  addTooltipData: (
    x: number,
    y: number,
    name: string,
    data: ITooltipData
  ) => void;
  removeTooltipData: (key: ITooltipData["key"] | "all") => void;
}

function BoxShape({
  name,
  x,
  x1,
  x2,
  maximum,
  maximumY,
  Q3,
  Q3Y,
  Q2,
  Q2Y,
  Q1,
  Q1Y,
  minimum,
  minimumY,
  IQR,
  addTooltipData,
  removeTooltipData,
}: IBoxShape) {
  const onMouseMove = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;

    const tooltipDataControl = (
      y1: number,
      y2: number,
      key: ITooltipData["key"],
      value: number
    ) => {
      if (offsetY >= y1 && offsetY <= y2) {
        addTooltipData(offsetX, offsetY, name, { key, value });
      } else {
        removeTooltipData(key);
      }
    };

    tooltipDataControl(maximumY - 5, maximumY + 5, "maximum", maximum);
    tooltipDataControl(minimumY - 5, minimumY + 5, "minimum", minimum);
    tooltipDataControl(Q3Y - 5, Q1Y + 5, "IQR", IQR);
    tooltipDataControl(Q1Y - 5, Q1Y + 5, "Q1", Q1);
    tooltipDataControl(Q2Y - 5, Q2Y + 5, "Q2", Q2);
    tooltipDataControl(Q3Y - 5, Q3Y + 5, "Q3", Q3);
  };

  return (
    <g key={`box_plot_${name}`}>
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
        strokeWidth={2}
      />
      <line
        y1={minimumY}
        y2={minimumY}
        x1={x1}
        x2={x2}
        stroke="#202020"
        strokeWidth={2}
      />
      <rect y={Q3Y} height={Q1Y - Q3Y} x={x1} width={x2 - x1} fill="#0099FE" />
      <line
        y1={Q2Y}
        y2={Q2Y}
        x1={x1}
        x2={x2}
        stroke="#202020"
        strokeWidth={1}
      />
      <g>
        <rect
          x={x1 - 10}
          y={maximumY - 10}
          width={x2 - x1 + 20}
          height={minimumY - maximumY + 20}
          fill="transparent"
          onMouseMove={onMouseMove}
          onMouseOut={() => removeTooltipData("all")}
        />
      </g>
    </g>
  );
}

export default memo(
  BoxShape,
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);
