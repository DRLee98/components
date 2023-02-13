import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import VerticalViolinShape from "./ViolinShape";
import styled from "styled-components";

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

  const names = useMemo(() => data.map((d) => d.name), [data]);

  // Compute scales
  const yScale = d3.scaleLinear().domain(yDomain).range([boundsSize.height, 0]);

  const xScale = useMemo(
    () =>
      d3.scaleBand().range([0, boundsSize.width]).domain(names).padding(0.25),
    [data, boundsSize]
  );

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

  // Build the shapes
  const allShapes = data.map((item) => {
    return (
      <g
        key={`violin_plot_shape_${item.name}`}
        transform={`translate(${xScale(item.name)},0)`}
      >
        <VerticalViolinShape
          data={item.values}
          median={item.median}
          quartileInterval={item.quartileInterval}
          confidenceInterval={item.confidenceInterval}
          yDomain={yDomain}
          yScale={yScale}
          width={xScale.bandwidth()}
          height={boundsSize.height}
          binNumber={50}
        />
      </g>
    );
  });

  return (
    <Wrapper ref={ref}>
      <svg width={svgSize.width} height={svgSize.height}>
        <g
          width={boundsSize.width}
          height={boundsSize.height}
          transform={`translate(${[
            margin?.left || defaultMargin,
            margin?.top || defaultMargin,
          ].join(",")})`}
        >
          {allShapes}
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
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export default Chart;
