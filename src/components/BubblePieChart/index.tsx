import React, { useEffect } from "react";
import * as d3 from "d3";
import { PieArcDatum } from "d3-shape";
import { getArcLayout, getArcTween } from "./utils";

export interface IDataSet {
  children?: IDataSet[];
  key: number | string;
  label: string;
  value: number;
  pieData?: number[];
}

interface IRendeNodes {
  data: d3.HierarchyCircularNode<IDataSet>[];
  tooltip:
    | d3.Selection<d3.BaseType, unknown, HTMLElement, any>
    | d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
}

interface IRenderPie {
  tooltip:
    | d3.Selection<d3.BaseType, unknown, HTMLElement, any>
    | d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
}

interface IBubblePieChart {
  dataSet: IDataSet[];
  colors: string[];
  onClick: (key: string | number) => void;
}

function BubblePieChart({ dataSet, colors, onClick }: IBubblePieChart) {
  const id = "bubble-chart";
  const selectionId = `svg-${id}`;

  const width = 1000;
  const height = 700;
  const color = d3.scaleOrdinal(colors);

  const renderPie = (
    selection: d3.Selection<
      SVGGElement,
      d3.HierarchyCircularNode<IDataSet>,
      d3.BaseType,
      unknown
    >,
    { tooltip }: IRenderPie
  ) => {
    selection.each((node, i) => {
      const { r: radius, data } = node;
      const select = d3.select<d3.BaseType, d3.HierarchyNode<IDataSet>>(
        `#pie${i}`
      );
      if (data.pieData) {
        const arcLayout = getArcLayout(radius);

        const pie = d3
          .pie()
          .sort(null)
          .value((d) => d.valueOf());

        const g = select.selectAll(".arc").data(pie(data.pieData)).enter();

        g.append("path").attr("fill", (_, i) => color(i + ""));

        g.append("text")
          .attr("transform", (d) => `translate(${arcLayout.centroid(d)})`)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", () =>
            radius / 2 > 15 ? "15px" : `${radius / 2}px`
          )
          .text((d) => d.value);

        select
          .selectAll<d3.BaseType, PieArcDatum<number>>("path")
          .transition()
          .duration(750)
          .attrTween("d", getArcTween(arcLayout, 0));

        // select
        // .on('mousemove', () => {
        //   setPieTooltipData({
        //     label: data.label,
        //     pieData,
        //     x: x + radius,
        //     y,
        //     colors,
        //   });
        // })
        // .on('mouseleave', () => setPieTooltipData(undefined));
      } else {
        select
          .append("circle")
          .transition()
          .duration(500)
          .style("fill", (_, i: number) => color(i + ""))
          .attr("r", radius > 2 ? radius : 2);

        select
          .append("text")
          .attr("dy", ".2em")
          .attr("font-family", "Open Sans")
          .attr("font-size", () =>
            radius / 2 > 15 ? "15px" : `${radius / 2}px`
          )
          .attr("fill", "white")
          .style("pointer-events", "none")
          .style("text-anchor", "middle")
          .text((d) => (radius > 20 ? d.data.label : ""))
          .each((_) => {
            const self = select.select("text");

            let text = self.text();
            let textLength = self.property("clientWidth");

            while (textLength > radius && text.length > 0) {
              text = text.slice(0, -1);
              self.text(text + "...");
              textLength = self.property("clientWidth");
            }
          });

        // select
        // .on('mousemove', () => {
        //   setCircleTooltipData({
        //     ...data,
        //     value: data.tooltipValue,
        //     color,
        //     x: x + radius,
        //     y,
        //   });
        // })
        // .on('mouseleave', () => setCircleTooltipData(undefined));
      }
      select.on("click", () => onClick(data.label)).style("cursor", "pointer");
    });
  };

  const renderNodes = (
    selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    { data, tooltip }: IRendeNodes
  ) => {
    selection.selectAll("g").remove();

    const filteredData = data.filter(function (d) {
        return !d.children;
      }),
      nodes = selection.selectAll("g").data(filteredData);

    nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);

    const pies = nodes
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("id", (_, i) => {
        return `pie${i}`;
      })
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    renderPie(pies, { tooltip });

    nodes.exit().remove();
  };

  const drawBubbles = () => {
    const svg = d3.select(`#${selectionId}`);

    const bubble = d3.pack<IDataSet>().size([width, height]).padding(2),
      tooltip = d3.select(".d3-tooltip").empty()
        ? d3.select(`body`).append("div").attr("class", "d3-tooltip")
        : d3.select(".d3-tooltip");

    const hierarchyData: IDataSet = {
      children: dataSet,
      value: 0,
      label: "",
      key: "",
    };

    const root = d3.hierarchy(hierarchyData).sum((d) => d.value ?? 0);
    const data = bubble(root).descendants();

    renderNodes(svg, { data, tooltip });
  };

  useEffect(() => {
    drawBubbles();
  }, [dataSet]);

  return (
    <div id={id} className="bubbles-d3-chart">
      <svg id={selectionId} className="bubble" width={width} height={height} />
    </div>
  );
}

export default BubblePieChart;
