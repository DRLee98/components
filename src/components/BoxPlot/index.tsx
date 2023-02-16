import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import BoxShape from "./BoxShape";
import Tooltip from "components/Tooltip";

interface IMargin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface ISize {
  width: number;
  height: number;
}

export interface IData {
  name: string;
  maximum: number;
  Q3: number;
  Q2: number;
  Q1: number;
  minimum: number;
  IQR: number;
}

export interface IChartData extends IData, Y<Omit<IData, "name" | "IQR">> {}

type Y<T> = {
  [key in keyof T as key extends string ? `${key}Y` : key]: T[key];
} & {
  x: number;
  x1: number;
  x2: number;
};

interface ITick {
  text: string;
  x: number;
  y: number;
}

export interface ITooltipData {
  key: keyof IData;
  value: number;
}

interface ITooltip {
  x: number;
  y: number;
  name: string;
  data: ITooltipData[];
}

interface IBoxPlot {
  data: IData[];
  yDomain: [number, number];
  yTicks: number[];
  margin?: IMargin;
}

function Chart({ data, yDomain, yTicks, margin }: IBoxPlot) {
  const ref = useRef(null);
  const defaultMargin = 0;

  const topSpace = 20;
  const xTicksHeight = 30;
  const yTicksWidth = 30;
  const boxPadding = 20;

  const [svgSize, setSvgSize] = useState<ISize>({ width: 0, height: 0 });
  const [boundsSize, setBoundsSize] = useState<ISize>({ width: 0, height: 0 });

  const [xTickList, setXTickList] = useState<ITick[]>([]);
  const [yTickList, setYTickList] = useState<ITick[]>([]);
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [tooltipData, setTooltipData] = useState<ITooltip>({
    x: 0,
    y: 0,
    name: "",
    data: [],
  });

  const getY = useCallback((value: number, height: number) => {
    const range = yDomain[1] - yDomain[0];
    const target = 1 - (value - yDomain[0]) / range;
    return (height - xTicksHeight - topSpace) * target + topSpace;
  }, []);

  const addTooltipData = (
    x: number,
    y: number,
    name: string,
    d: ITooltipData
  ) => {
    setTooltipData((prev) => ({
      x,
      y,
      name,
      data: Boolean(prev.data.find((item) => item.key === d.key))
        ? prev.data
        : [...prev.data, d],
    }));
  };

  const removeTooltipData = (key: ITooltipData["key"] | "all") => {
    setTooltipData((prev) => ({
      ...prev,
      data: key === "all" ? [] : prev.data.filter((item) => item.key !== key),
    }));
  };

  useEffect(() => {
    if (yTicks.length > 0) {
      const h = boundsSize.height - xTicksHeight;
      const step = (h - topSpace) / (yTicks.length - 1);
      const mapYTicks = yTicks.map((text, i) => ({
        text: text + "",
        x: yTicksWidth / 2,
        y: h - i * step,
      }));
      setYTickList(mapYTicks);
    }
  }, [yTicks, boundsSize]);

  useEffect(() => {
    if (data.length > 0) {
      const w = boundsSize.width - yTicksWidth;
      const step = w / data.length;
      const mapXTicks = data.map(({ name }, i) => ({
        text: name,
        x: yTicksWidth + (i + 1) * step - step / 2,
        y: boundsSize.height - xTicksHeight / 2,
      }));
      setXTickList(mapXTicks);

      const mapData = data.map((item, i) => ({
        x: yTicksWidth + (i + 1) * step - step / 2,
        x1:
          i === 0
            ? yTicksWidth + boxPadding
            : yTicksWidth + i * step + boxPadding,
        x2: yTicksWidth + (i + 1) * step - boxPadding,
        maximumY: getY(item.maximum, boundsSize.height),
        minimumY: getY(item.minimum, boundsSize.height),
        Q1Y: getY(item.Q1, boundsSize.height),
        Q2Y: getY(item.Q2, boundsSize.height),
        Q3Y: getY(item.Q3, boundsSize.height),
        ...item,
      }));
      setChartData(mapData);
    }
  }, [data, boundsSize]);

  useEffect(() => {
    if (ref.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setSvgSize({ width, height });
          setBoundsSize({
            width:
              width -
              (margin?.left || defaultMargin) -
              (margin?.right || defaultMargin + yTicksWidth),
            height:
              height -
              (margin?.top || defaultMargin) -
              (margin?.bottom || defaultMargin),
          });
        }
      });

      observer.observe(ref.current);
    }
  }, [ref.current]);

  return (
    <Wrapper ref={ref}>
      <svg width={svgSize.width} height={svgSize.height}>
        <g>
          <line
            x1={yTicksWidth}
            x2={yTicksWidth}
            y1={topSpace}
            y2={boundsSize.height - xTicksHeight}
            stroke="#828D99"
          />
          {yTickList.map(({ text, x, y }) => (
            <g key={`y_tick_${text}_${x}_${y}`}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="#828D99"
                fontSize={10}
                fontWeight={400}
              >
                {text}
              </text>
              {/* {i > 0 && (
                <line
                  x1={yTicksWidth}
                  x2={boundsSize.width}
                  y1={y}
                  y2={y}
                  stroke="#E1E5E9"
                  strokeDasharray="3 3"
                />
              )} */}
            </g>
          ))}
        </g>
        <g>
          <line
            x1={yTicksWidth}
            x2={boundsSize.width}
            y1={boundsSize.height - xTicksHeight}
            y2={boundsSize.height - xTicksHeight}
            stroke="#828D99"
          />
          {xTickList.map(({ text, x, y }) => (
            <g key={`x_tick_${text}_${x}_${y}`}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="#828D99"
                fontSize={10}
                fontWeight={400}
              >
                {text}
              </text>
              <line
                x1={x}
                x2={x}
                y1={topSpace}
                y2={boundsSize.height - xTicksHeight}
                stroke="#E1E5E9"
                strokeDasharray="3 3"
              />
            </g>
          ))}
        </g>
        <g>
          {chartData.map((d) => (
            <BoxShape
              key={`box_plot_${d.name}`}
              {...d}
              addTooltipData={addTooltipData}
              removeTooltipData={removeTooltipData}
            />
          ))}
        </g>
      </svg>
      <Tooltip {...tooltipData} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;

  width: 100%;
  height: 100%;
`;

export default memo(Chart);
