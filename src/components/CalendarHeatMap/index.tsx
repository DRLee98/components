import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  getDateText,
  getDayCount,
  getKORDateString,
  getMonthList,
  getYMD,
} from "./utils";
import styled from "styled-components";

interface ISize {
  width: number;
  height: number;
}

interface IPosition {
  x: number;
  y: number;
}

interface IData {
  date: Date;
  value: number;
}

export interface IColor {
  color: string;
  value: number;
}

interface IMargin {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface IDay extends IData {
  korDate: string;
  fill: string;
}

interface ITooltipData extends IPosition {
  data: IDay | null;
}

interface ICalendarHeatMap {
  data: IData[];
  startDate: Date;
  endDate: Date;

  colors: IColor[];
  emptyColor: string;

  weekdayTicks?: string[];
  weekdayTickStyle?: React.SVGProps<SVGTextElement>;
  weekdayLegendOffset?: number;

  monthTickStyle?: React.SVGProps<SVGTextElement>;
  monthLegendOffset?: number;

  dayRadius?: number;
  daySpacing?: number;

  width?: string;
  height?: string;
  margin?: IMargin;

  onClick: (day: IDay) => void;
}

function CalendarHeatMap({
  data,
  colors,
  emptyColor,
  weekdayTicks = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
  weekdayTickStyle,
  weekdayLegendOffset = 30,
  monthTickStyle,
  monthLegendOffset = 30,
  width,
  height,
  margin,
  startDate,
  endDate,
  dayRadius,
  daySpacing,
  onClick,
}: ICalendarHeatMap) {
  const ref = useRef(null);

  const [svgSize, setSvgSize] = useState<ISize>({ width: 0, height: 0 });
  const [rectSize, setRectSize] = useState<ISize>({ width: 0, height: 0 });
  const [weekdayTickPosition, setWeekdayTickPosition] = useState<IPosition>({
    x: 0,
    y: 0,
  });
  const [monthTickPosition, setMonthTickPosition] = useState<IPosition>({
    x: 0,
    y: 0,
  });
  const [weekArray, setWeekArray] = useState<IDay[][]>([]);
  const [monthArray, setMonthArray] = useState<number[]>([]);
  const [tooltipData, setTooltipData] = useState<ITooltipData>({
    x: 0,
    y: 0,
    data: null,
  });

  const setTooltipDataFn = useCallback(
    (x: number, y: number, targetData: IDay | null) => {
      setTooltipData({ x, y, data: targetData });
    },
    []
  );

  const resetTooltipDataFn = useCallback(() => {
    setTooltipData((prev) => ({ ...prev, data: null }));
  }, []);

  useEffect(() => {
    if (startDate && endDate && data) {
      const { year, month, date } = getYMD(startDate);

      const count = getDayCount(startDate, endDate);
      const array: IDay[][] = [];

      const sortColors = colors ? colors.sort((a, b) => b.value - a.value) : [];

      let week = 0;
      for (let i = 0; i < count; i += 1) {
        const targetDate = new Date(year, month, date + i);
        const dateString = getDateText(targetDate);
        const korDate = getKORDateString(targetDate);
        const day = targetDate.getDay();

        const targetData = data.find((item) => item.date === dateString);

        let fill = emptyColor;
        if (targetData) {
          for (let j = 0; j < sortColors.length; j += 1) {
            if (targetData.value >= sortColors[j].value) {
              const targetColor = sortColors[j].color;
              fill = targetColor;
              break;
            }
          }
        }

        if (!array[week]) array[week] = [];
        array[week][day] = {
          date: dateString,
          korDate,
          fill,
          value: 0,
          ...targetData,
        };
        if (day === 6) {
          week += 1;
        }
      }
      setWeekArray(array);
      setMonthArray(getMonthList(startDate, endDate));
    }
  }, [startDate, endDate, data]);

  useEffect(() => {
    if (svgSize.width > 0 && svgSize.height > 0) {
      setRectSize({
        width: (svgSize.width - weekdayLegendOffset) / weekArray.length,
        height: (svgSize.height - monthLegendOffset) / 7,
      });
      setWeekdayTickPosition({
        x: weekdayLegendOffset / 2,
        y: (svgSize.height - monthLegendOffset) / 7,
      });
      setMonthTickPosition({
        x: (svgSize.width - weekdayLegendOffset) / monthArray.length,
        y: svgSize.height - monthLegendOffset / 2,
      });
    }
  }, [svgSize, weekArray]);

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
    <Wrapper ref={ref} width={width} height={height} margin={margin}>
      <svg {...svgSize}>
        {weekdayTicks.map((weekday, i) => (
          <text
            key={`calendar_map_weekday_${weekday}`}
            x={weekdayTickPosition.x}
            y={i * weekdayTickPosition.y + weekdayTickPosition.y / 2}
            textAnchor="middle"
            alignmentBaseline="central"
            fill="#828D99"
            fontSize={10}
            fontWeight={400}
            fontFamily="Noto Sans KR"
            {...weekdayTickStyle}
          >
            {weekday}
          </text>
        ))}
        {weekArray.map((week, i) => (
          <React.Fragment
            // eslint-disable-next-line react/no-array-index-key
            key={`calendar_map_week_${i}`}
          >
            {week.map((day, j) =>
              day ? (
                <rect
                  // eslint-disable-next-line react/no-array-index-key
                  key={`calendar_map_week_${i}_day_${j}`}
                  {...rectSize}
                  x={i * rectSize.width + weekdayLegendOffset}
                  y={j * rectSize.height}
                  fill={day.fill}
                  strokeWidth={daySpacing || 1.5}
                  stroke="#ffffff"
                  rx={dayRadius || 4}
                  onMouseEnter={() =>
                    setTooltipDataFn(
                      i * rectSize.width + weekdayLegendOffset,
                      j * rectSize.height,
                      day
                    )
                  }
                  onMouseLeave={resetTooltipDataFn}
                  onClick={() => onClick(day)}
                />
              ) : null
            )}
          </React.Fragment>
        ))}
        {monthArray.map((month, i) => (
          <text
            key={`calendar_map_month_${month}`}
            x={
              i * monthTickPosition.x +
              monthTickPosition.x / 2 +
              weekdayLegendOffset
            }
            y={monthTickPosition.y}
            textAnchor="end"
            alignmentBaseline="central"
            fill="#828D99"
            fontSize={10}
            fontWeight={400}
            fontFamily="Noto Sans KR"
            {...monthTickStyle}
          >
            {month}월
          </text>
        ))}
      </svg>

      <TooltipWrapper opacity={tooltipData.data ? 1 : 0} {...tooltipData}>
        {tooltipData.data && (
          <TooltipContent>
            <TooltipText>{tooltipData.data.korDate}</TooltipText>
            <Divider />
            <TooltipText color={tooltipData.data.fill}>
              {tooltipData.data.value}개
            </TooltipText>
          </TooltipContent>
        )}
      </TooltipWrapper>
    </Wrapper>
  );
}

interface IWrapper {
  width?: string;
  height?: string;
  margin?: IMargin;
}

export const Wrapper = styled.div<IWrapper>`
  position: relative;

  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "100%"};

  margin-top: ${({ margin }) => (margin ? margin.top || 0 : 0)}px;
  margin-bottom: ${({ margin }) => (margin ? margin.bottom || 0 : 0)}px;
  margin-right: ${({ margin }) => (margin ? margin.right || 0 : 0)}px;
  margin-left: ${({ margin }) => (margin ? margin.left || 0 : 0)}px;
`;

interface ITooltipWrapper {
  x?: number;
  y?: number;
  opacity?: number;
}

export const TooltipWrapper = styled.div<ITooltipWrapper>`
  position: absolute;
  top: 0;

  padding: 8px 12px;

  background: #ffffff;
  border: 2px solid #f0f2f4;
  border-radius: 4px;

  filter: drop-shadow(-7px 8px 16px rgba(58, 70, 93, 0.07));

  transform: ${({ x, y }) =>
    `translate(calc(${x || 0}px + 20%), calc(${y || 0}px - 80%))`};
  transition: transform 0.3s ease;

  opacity: ${({ opacity }) => opacity || 0};
  z-index: 50;
`;

export const TooltipContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TooltipText = styled.span`
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;

  color: ${({ color }) => color || "#304156"};
`;

export const Divider = styled.div`
  width: 1px;
  height: 100%;
  min-height: 20px;

  margin: 0 8px;

  background-color: #e1e5e9;
`;

export default CalendarHeatMap;
