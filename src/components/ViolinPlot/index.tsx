import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";
import styled from "styled-components";
import VerticalViolinShape from "./ViolinShape";
import Tooltip from "components/Tooltip";
import FlexBox from "components/FlexBox";

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
  median: number;
  minimum: number;
  quartileInterval: [number, number];
  confidenceInterval: [number, number];
  values: number[];
}

export interface IChartData extends IData, Y<Omit<IData, "name" | "values">> {}

type Y<T> = {
  [key in keyof T as key extends string ? `${key}Y` : key]: T[key];
};

export interface ITooltipData {
  key: keyof IData;
  value: number | [number, number];
}

interface ITooltip {
  x: number;
  y: number;
  name: string;
  data: ITooltipData[];
}

interface IViolinPlot {
  data: IData[];
  yDomain: [number, number];
  margin?: IMargin;
}

function Chart({ data, yDomain, margin }: IViolinPlot) {
  const ref = useRef(null);
  const axisRef = useRef(null);
  const defaultMargin = 30;

  const [svgSize, setSvgSize] = useState<ISize>({ width: 0, height: 0 });
  const [boundsSize, setBoundsSize] = useState<ISize>({ width: 0, height: 0 });
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [tooltipData, setTooltipData] = useState<ITooltip>({
    x: 0,
    y: 0,
    name: "",
    data: [],
  });

  const [binNumber, setBinNumber] = useState(30);

  const onChangeBinNumber = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBinNumber(+e.target.value);

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

  const names = useMemo(() => data.map((d) => d.name), [data]);

  // Compute scales
  const yScale = d3.scaleLinear().domain(yDomain).range([boundsSize.height, 0]);

  const xScale = useMemo(
    () =>
      d3.scaleBand().range([0, boundsSize.width]).domain(names).padding(0.25),
    [data, boundsSize]
  );

  const getY = useCallback((value: number, height: number) => {
    const range = yDomain[1] - yDomain[0];
    const target = 1 - (value - yDomain[0]) / range;
    return height * target;
  }, []);

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axisRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsSize.height + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsSize.height]);

  useEffect(() => {
    if (data.length > 0) {
      const getYWithHeight = (value: number) => getY(value, boundsSize.height);
      const mapData = data.map((item) => ({
        maximumY: getYWithHeight(item.maximum),
        medianY: getYWithHeight(item.median),
        minimumY: getYWithHeight(item.minimum),
        quartileIntervalY: item.quartileInterval.map((v) =>
          getYWithHeight(v)
        ) as [number, number],
        confidenceIntervalY: item.confidenceInterval.map((v) =>
          getYWithHeight(v)
        ) as [number, number],
        ...item,
      }));
      setChartData(mapData);
    }
  }, [data, boundsSize.height]);

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
              (margin?.right || defaultMargin),
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
      <FlexBox justifyContent="flex-start" gap={10}>
        <label>bin number</label>
        <input
          type="range"
          min={10}
          max={100}
          step={1}
          value={binNumber}
          onChange={onChangeBinNumber}
        />
        <span>{binNumber}</span>
      </FlexBox>
      <svg width={svgSize.width} height={svgSize.height}>
        <g
          width={boundsSize.width}
          height={boundsSize.height}
          transform={`translate(${[
            margin?.left || defaultMargin,
            margin?.top || defaultMargin,
          ].join(",")})`}
        >
          {chartData.map((item) => (
            <g
              key={`violin_plot_shape_${item.name}`}
              transform={`translate(${xScale(item.name)},0)`}
            >
              <VerticalViolinShape
                {...item}
                yScale={yScale}
                width={xScale.bandwidth()}
                binNumber={binNumber}
                marginTop={margin?.top || defaultMargin}
                addTooltipData={addTooltipData}
                removeTooltipData={removeTooltipData}
              />
            </g>
          ))}
        </g>

        <g
          width={boundsSize.width}
          height={boundsSize.height}
          ref={axisRef}
          transform={`translate(${[
            margin?.left || defaultMargin,
            margin?.top || defaultMargin,
          ].join(",")})`}
        />
      </svg>
      <Tooltip<IData> {...tooltipData} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export default memo(Chart);
