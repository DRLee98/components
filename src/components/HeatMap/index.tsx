import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export type TDomain = [number | "auto", number | "auto"];

interface ISize {
  width: number;
  height: number;
}

interface IMargin {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface IRangeValue {
  y: number;
  value: number;
}

interface ICenterX {
  x1: number;
  x2: number;
}

interface IHeatMap {
  data: number[][];
  ticks: string[];
  domain?: TDomain;
  size?: [number, number];
  yTickWidth?: number;
  xTickHeight?: number;
  margin?: IMargin;
}

function HeatMap({
  size,
  data,
  ticks,
  domain,
  yTickWidth = 80,
  xTickHeight = 30,
  margin,
}: IHeatMap) {
  const ref = useRef(null);
  const topSpace = 20;
  const colorRangeWidth = 100;

  const [svgSize, setSvgSize] = useState<ISize>({ width: 0, height: 0 });
  const [rectSize, setRectSize] = useState<number>(0);
  const [rangeValues, setRangeValues] = useState<IRangeValue[]>([]);
  const [centerX, setCenterX] = useState<ICenterX>({ x1: 0, x2: 0 });

  const valueFormatter = (value: number) => {
    const stringValue = "" + value;
    const targetLength = value > 0 ? 5 : 6;
    return stringValue.length > targetLength
      ? stringValue.slice(0, targetLength)
      : value;
  };

  const tickFormatter = (tick: string) => {
    return tick.length > 10 ? tick.slice(0, 9) + "..." : tick;
  };

  useEffect(() => {
    if (data.length > 0 && svgSize.width > 0 && svgSize.height > 0) {
      const rowCount = data[0].length;
      const columnCount = data.length;
      const height = (svgSize.height - xTickHeight - topSpace) / columnCount;
      const width = (svgSize.width - yTickWidth - colorRangeWidth) / rowCount;
      const size = height > width ? width : height;
      setRectSize(size);
      const x1 =
        (svgSize.width - (size * rowCount + colorRangeWidth + yTickWidth)) / 2;
      const x2 = svgSize.width - x1;
      setCenterX({ x1, x2 });
    }
  }, [data, svgSize]);

  useEffect(() => {
    const nums = domain
      ? [
          domain[0] === "auto" ? -1 : domain[0],
          domain[1] === "auto" ? 1 : domain[1],
        ]
      : [-1, 1];
    for (let i = 0; i < 3; i++) {
      const length = nums.length;
      for (let j = 1; j < length; j++) {
        const num = (nums[j] + nums[j - 1]) / 2;
        nums.push(num);
      }
      nums.sort((a, b) => {
        if (a > b) return 1;
        if (a === b) return 0;
        return -1;
      });
    }
    const step = (rectSize * data.length) / (nums.length - 1);
    const list = nums.reverse().map((value, i) => ({
      y: i * step + topSpace,
      value,
    }));
    setRangeValues(list);
  }, [domain, svgSize]);

  useEffect(() => {
    if (ref.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setSvgSize({
            width: margin
              ? width - (margin.left || 0) - (margin.right || 0)
              : width,
            height: margin
              ? height - (margin.top || 0) - (margin.bottom || 0)
              : height,
          });
        }
      });

      observer.observe(ref.current);
    }
  }, [ref.current]);

  return (
    <Wrapper ref={ref} size={size}>
      <svg {...svgSize}>
        <g>
          {ticks.map((tick, i) => (
            <g key={`heat_map_y_tick_${tick}`}>
              <line
                x1={centerX.x1 + yTickWidth}
                x2={centerX.x1 + yTickWidth - 5}
                y1={i * rectSize + rectSize / 2 + topSpace}
                y2={i * rectSize + rectSize / 2 + topSpace}
                stroke="#828D99"
              />
              <text
                textAnchor="end"
                alignmentBaseline="hanging"
                fill="#828D99"
                fontSize={10}
                fontWeight={400}
                fontFamily="Noto Sans KR"
                transform={`translate(${centerX.x1 + yTickWidth - 10}, ${
                  i * rectSize + rectSize / 2 + topSpace
                }) rotate(30)`}
              >
                {tickFormatter(tick)}
              </text>
            </g>
          ))}
        </g>

        <g>
          {ticks.map((tick, i) => (
            <g key={`heat_map_x_tick_${tick}`}>
              <line
                x1={centerX.x1 + i * rectSize + yTickWidth + rectSize / 2}
                x2={centerX.x1 + i * rectSize + yTickWidth + rectSize / 2}
                y1={data.length * rectSize + topSpace}
                y2={data.length * rectSize + 5 + topSpace}
                stroke="#828D99"
              />
              <text
                textAnchor="start"
                alignmentBaseline="middle"
                fill="#828D99"
                fontSize={10}
                fontWeight={400}
                fontFamily="Noto Sans KR"
                transform={`translate(${
                  centerX.x1 + i * rectSize + yTickWidth + rectSize / 2
                }, ${
                  data.length * rectSize + xTickHeight / 2 + topSpace
                }) rotate(30)`}
              >
                {tickFormatter(tick)}
              </text>
            </g>
          ))}
        </g>

        <g>
          {data.map((row, i) => (
            <React.Fragment
              // eslint-disable-next-line react/no-array-index-key
              key={`heat_map_column_${i}`}
            >
              {row.map((value, j) => (
                <g // eslint-disable-next-line react/no-array-index-key
                  key={`heat_map_column_${i}_row_${j}`}
                >
                  <rect
                    width={rectSize}
                    height={rectSize}
                    x={centerX.x1 + i * rectSize + yTickWidth}
                    y={j * rectSize + topSpace}
                    fill={
                      value > 0
                        ? `rgba(255, 0, 0, ${value})`
                        : `rgba(0, 143, 255, ${Math.abs(value)})`
                    }
                  />
                  <text
                    x={centerX.x1 + i * rectSize + yTickWidth + rectSize / 2}
                    y={j * rectSize + rectSize / 2 + topSpace}
                    fill={Math.abs(value) < 0.3 ? "rgb(30, 30, 30)" : "#ffffff"}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={10}
                  >
                    {valueFormatter(value)}
                  </text>
                </g>
              ))}
            </React.Fragment>
          ))}
        </g>

        <g>
          <defs>
            <linearGradient id="Gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgb(255, 0, 0)" />
              <stop offset="50%" stopColor="rgb(255, 255, 255)" />
              <stop offset="100%" stopColor="rgb(0, 143, 255)" />
            </linearGradient>
          </defs>
          <rect
            x={centerX.x2 - colorRangeWidth + 20}
            y={topSpace}
            width={20}
            height={rectSize * data.length}
            fill="url(#Gradient)"
          />
          {rangeValues.map(({ y, value }) => (
            <g key={`color_range_${value}_${y}`}>
              <line
                x1={centerX.x2 - colorRangeWidth + 40}
                x2={centerX.x2 - colorRangeWidth + 45}
                y1={y}
                y2={y}
                stroke="#828D99"
              />
              <text
                x={centerX.x2 - colorRangeWidth + 55}
                y={y}
                textAnchor="start"
                alignmentBaseline="middle"
                fill="#828D99"
                fontSize={10}
                fontWeight={400}
                fontFamily="Noto Sans KR"
              >
                {value}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </Wrapper>
  );
}

interface IWrapper {
  size?: [number, number];
}

const Wrapper = styled.div<IWrapper>`
  width: ${({ size }) => (size ? size[0] + "px" : "100%")};
  height: ${({ size }) => (size ? size[1] + "px" : "80%")};
`;

export default HeatMap;
