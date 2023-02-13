import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

interface IDateItem {
  date: Date;
  text: string;
  x: number;
}

interface IEventItem {
  category: string;
  text: string;
  color: string;
  startText: string;
  endText: string;
  start: Date;
  end: Date;
  x1: number;
  x2: number;
}

interface ILineItem {
  y: number;
  events: IEventItem[];
}

interface IPointEventItem {
  text: string;
  color: string;
  x: number;
  width: number;
}

interface ITooltipData {
  x: number;
  y: number;
  data?: Omit<IEventItem, "start" | "end" | "x1" | "x2">;
}

export interface IEvent {
  category: string;
  text: string;
  color: string;
  start: Date;
  end: Date;
}

export interface IPointEvent {
  text: string;
  color: string;
  date: Date;
}

interface ITimeLine {
  events: IEvent[];
  pointEvents: IPointEvent[];
}

function TimeLine({ events, pointEvents }: ITimeLine) {
  const [todayX, setTodayX] = useState(0);
  const [dateList, setDateList] = useState<IDateItem[]>([]);
  const [lineList, setLineList] = useState<ILineItem[]>([]);
  const [pointEventList, setPointEventList] = useState<IPointEventItem[]>([]);
  const [tooltipData, setTooltipData] = useState<ITooltipData>({ x: 0, y: 0 });
  const [timer, setTimer] = useState<NodeJS.Timer>();

  const dateInterval = 100;
  const lineInterval = 40;

  const animateDur = "5s";

  const formatNum = (num: number) => (num >= 10 ? num : `0${num}`);
  const getDateTime = (date: Date) => new Date(date).getTime();
  const getDateText = (date: Date) => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    return { year, month, day };
  };
  const getMonthDiff = (
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number
  ) => (endYear - startYear) * 12 + (endMonth - startMonth);
  const timeComparison = (a: Date, b: Date) => {
    const aTime = getDateTime(a);
    const bTime = getDateTime(b);
    return aTime > bTime;
  };

  const getX = (
    startYear: number,
    startMonth: number,
    year: number,
    month: number,
    day: number
  ) => {
    const lastDay = new Date(year, month, 0).getDate();
    return (
      getMonthDiff(startYear, startMonth, year, month) * dateInterval +
      (day / lastDay) * dateInterval
    );
  };

  const getStartDate = useCallback((events: IEvent[]) => {
    let target = new Date();
    if (events.length > 0) {
      const sortList = events.sort(
        (a, b) => getDateTime(a.start) - getDateTime(b.start)
      );
      target = sortList[0].start;
    }
    const { year, month } = getDateText(target);
    return { year, month };
  }, []);

  const getEndDate = useCallback((events: IEvent[]) => {
    const today = new Date();
    let target = today;
    if (events.length > 0) {
      const sortList = events.sort(
        (a, b) => getDateTime(b.end) - getDateTime(a.end)
      );
      target = timeComparison(today, sortList[0].end) ? today : sortList[0].end;
    }
    const { year, month } = getDateText(target);
    return { year, month: month + 1 };
  }, []);

  const getAnimationKeyTimes = (width: number, x1: number, x2?: number) => {
    const delay = x1 / width;
    if (x2) {
      const animate = (x2 - x1) / width;
      return `0; ${delay}; ${delay + animate}; 1`;
    }
    return `0; ${delay}; 1`;
  };

  const setTooltipDataFn = (e: React.MouseEvent, data: IEventItem) => {
    const { clientX, clientY } = e;
    if (timer) {
      clearTimeout(timer);
    }
    setTooltipData({ data, x: clientX, y: clientY });
  };

  const resetTooltipDataFn = () =>
    setTimer(
      setTimeout(
        () => setTooltipData((prev) => ({ x: prev.x, y: prev.y })),
        500
      )
    );

  useEffect(() => {
    const { year: startYear, month: startMonth } = getStartDate(events);
    const { year: endYear, month: endMonth } = getEndDate(events);

    const getDiffMonth = getMonthDiff(startYear, startMonth, endYear, endMonth);

    const dateArray: IDateItem[] = [];
    for (let i = 0; i <= getDiffMonth; i++) {
      const date = new Date(startYear, startMonth - 1 + i);
      const { year, month } = getDateText(date);
      dateArray.push({
        text: `${year}.${formatNum(month)}`,
        date,
        x: i * dateInterval,
      });
    }

    setDateList(dateArray);

    let lineArray: ILineItem[] = [];

    const categoryList: { [key: string]: IEvent[] } = {};
    events
      .sort((a, b) => getDateTime(a.start) - getDateTime(b.start))
      .forEach(({ category, ...rest }) => {
        if (categoryList[category]) {
          categoryList[category].push({ category, ...rest });
        } else {
          categoryList[category] = [{ category, ...rest }];
        }
      });

    Object.values(categoryList).forEach((evnetList) => {
      const array: IEventItem[][] = [];
      evnetList.forEach(({ category, text, color, start, end }, i) => {
        const { year: sYear, month: sMonth, day: sDay } = getDateText(start);
        const { year: eYear, month: eMonth, day: eDay } = getDateText(end);
        const item = {
          category,
          text,
          color,
          startText: `${sYear}/${formatNum(sMonth)}/${formatNum(sDay)}`,
          endText: `${eYear}/${formatNum(eMonth)}/${formatNum(eDay)}`,
          start,
          end,
          x1: getX(startYear, startMonth, sYear, sMonth, sDay),
          x2: getX(startYear, startMonth, eYear, eMonth, eDay),
        };
        let index = 0;
        while (true) {
          const targetArray = array[index];
          if (targetArray) {
            const lastItem = targetArray[targetArray.length - 1];
            if (
              timeComparison(lastItem.end, start) ||
              getDateTime(start) - getDateTime(lastItem.end) <=
                1000 * 60 * 60 * 24 * 3
            ) {
              index += 1;
            } else {
              array[index].push(item);
              break;
            }
          } else {
            array[index] = [item];
            break;
          }
        }
      });
      lineArray = [
        ...lineArray,
        ...array.map((item, i) => ({
          y: lineInterval * 5 + (lineArray.length + i) * lineInterval,
          events: item,
        })),
      ];
    });

    setLineList(lineArray);

    const pointEventArray: IPointEventItem[] = pointEvents.map(
      ({ text, color, date }) => {
        const { year, month, day } = getDateText(date);
        return {
          text,
          color,
          x: getX(startYear, startMonth, year, month, day),
          width: text.length * 15,
        };
      }
    );

    setPointEventList(pointEventArray);

    const { year, month, day } = getDateText(new Date());
    setTodayX(getX(startYear, startMonth, year, month, day));
  }, [events]);

  return (
    <Container>
      <svg
        width={dateList.length * dateInterval}
        height={(lineList.length + 5) * lineInterval}
      >
        <g transform={`translate(${dateInterval / 2}, 0)`}>
          <g>
            {dateList.map(({ text, x }) => (
              <g key={`date_text_${text}`}>
                <text
                  x={x}
                  y={20}
                  fill="#828D99"
                  fontSize={10}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {text}
                </text>
                <line
                  x1={x}
                  x2={x}
                  y1="35"
                  y2={(lineList.length + 4) * lineInterval}
                  stroke="#BBC0C5"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              </g>
            ))}
          </g>
          <g>
            <line
              x1={0}
              x2={(dateList.length - 1) * dateInterval}
              y1={lineInterval * 3}
              y2={lineInterval * 3}
              stroke="#475F7B"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {pointEventList.map(({ color, text, x, width }) => (
              <g key={`point_event_${text}_${x}`}>
                <circle r="4" cx={x} cy={lineInterval * 3} fill={color}>
                  <animate
                    attributeName="cx"
                    values={`${0};${x};${x};`}
                    keyTimes={getAnimationKeyTimes(
                      dateList.length * dateInterval,
                      x
                    )}
                    dur={animateDur}
                    repeatCount="1"
                  />
                </circle>
                <rect
                  x={x - width / 2}
                  y={lineInterval * 3 - 30}
                  rx="5"
                  width={width}
                  height={20}
                  fill={color}
                >
                  <animate
                    attributeName="x"
                    values={`${0 - width / 2};${x - width / 2};${
                      x - width / 2
                    };`}
                    keyTimes={getAnimationKeyTimes(
                      dateList.length * dateInterval,
                      x
                    )}
                    dur={animateDur}
                    repeatCount="1"
                  />
                </rect>
                <text
                  x={x}
                  y={lineInterval * 3 - 20}
                  fill="#ffffff"
                  fontSize={10}
                  fontWeight={500}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {text}
                  <animate
                    attributeName="x"
                    values={`${0};${x};${x};`}
                    keyTimes={getAnimationKeyTimes(
                      dateList.length * dateInterval,
                      x
                    )}
                    dur={animateDur}
                    repeatCount="1"
                  />
                </text>
              </g>
            ))}
          </g>
          <g>
            {lineList.map(({ y, events }, i) => (
              <g key={`line_${i}`}>
                <line
                  x1={0}
                  x2={(dateList.length - 1) * dateInterval}
                  y1={y}
                  y2={y}
                  stroke="#E3E9F0"
                  strokeWidth={1}
                />
                {events.map(
                  ({ color, x1, x2, startText, endText, ...rest }) => (
                    <g key={`line_event_${startText}_${endText}`}>
                      <circle r="4" cx={x1} cy={y} fill={color}>
                        <animate
                          attributeName="cx"
                          values={`${0};${x1};${x1};`}
                          keyTimes={getAnimationKeyTimes(
                            dateList.length * dateInterval,
                            x1
                          )}
                          dur={animateDur}
                          repeatCount="1"
                        />
                      </circle>
                      <circle r="4" cx={x2} cy={y} fill={color}>
                        <animate
                          attributeName="cx"
                          values={`${0};${x1};${x2};${x2};`}
                          keyTimes={getAnimationKeyTimes(
                            dateList.length * dateInterval,
                            x1,
                            x2
                          )}
                          dur={animateDur}
                          repeatCount="1"
                        />
                      </circle>
                      <line
                        x1={x1}
                        x2={x2}
                        y1={y}
                        y2={y}
                        stroke={color}
                        strokeWidth={2}
                      >
                        <animate
                          attributeName="x1"
                          values={`${0};${x1};${x1};`}
                          keyTimes={getAnimationKeyTimes(
                            dateList.length * dateInterval,
                            x1
                          )}
                          dur={animateDur}
                          repeatCount="1"
                        />
                        <animate
                          attributeName="x2"
                          values={`${0};${x1};${x2};${x2};`}
                          keyTimes={getAnimationKeyTimes(
                            dateList.length * dateInterval,
                            x1,
                            x2
                          )}
                          dur={animateDur}
                          repeatCount="1"
                        />
                      </line>
                      <rect
                        x={x1 - 6}
                        y={y - lineInterval / 2}
                        width={x2 - x1 + 12}
                        height={lineInterval}
                        fill="transparent"
                        onMouseEnter={(e) =>
                          setTooltipDataFn(e, {
                            color,
                            x1,
                            x2,
                            startText,
                            endText,
                            ...rest,
                          })
                        }
                        onMouseLeave={resetTooltipDataFn}
                      />
                    </g>
                  )
                )}
              </g>
            ))}
          </g>
          <g>
            <line
              x1={todayX}
              x2={todayX}
              y1="50"
              y2={(lineList.length + 4) * lineInterval}
              stroke="#95A2B0"
              strokeWidth={3}
            />
            <rect
              x={todayX - 25}
              y={lineInterval + 10}
              width="50"
              height="20"
              rx="5"
              fill="#95A2B0"
            />
            <text
              x={todayX}
              y={lineInterval + 20}
              fill="#FFFFFF"
              fontSize={10}
              fontWeight={500}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              TODAY
            </text>
          </g>
        </g>
      </svg>
      <TooltipBox
        x={tooltipData?.x}
        y={tooltipData?.y}
        opacity={tooltipData.data ? 1 : 0}
      >
        {tooltipData.data && (
          <>
            <TooltipCategoryBox>
              <TooltipCircle color={tooltipData.data.color} />
              <TooltipCategoryText>
                {tooltipData.data.category}
              </TooltipCategoryText>
            </TooltipCategoryBox>
            <TooltipTitle>{tooltipData.data.text}</TooltipTitle>
            <TooltipContentBox>
              <TooltipContentText>
                {tooltipData.data.startText} - {tooltipData.data.endText}
              </TooltipContentText>
            </TooltipContentBox>
          </>
        )}
      </TooltipBox>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;

  overflow-x: scroll;
`;

interface ITooltipBox {
  x?: number;
  y?: number;
  opacity: number;
}

const TooltipBox = styled.div<ITooltipBox>`
  position: absolute;
  top: 0px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  background: #ffffff;
  /* Basic/Grey/020 */

  border: 2px solid #f0f2f4;
  border-radius: 4px;

  padding: 16px 24px;

  transform: ${({ x, y }) =>
    `translate(calc(${x || 0}px - 50%), calc(${y || 0}px - 120%))`};
  transition: transform 0.3s ease;

  opacity: ${({ opacity }) => opacity || 0};

  filter: drop-shadow(-7px 8px 16px rgba(58, 70, 93, 0.07));
`;

const TooltipCategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

const TooltipCircle = styled.div`
  width: 8px;
  height: 8px;

  border-radius: 999px;
  background-color: ${({ color }) => color};
`;

const TooltipCategoryText = styled.span`
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  /* identical to box height, or 167% */

  text-align: right;

  /* AI Blue/Blue 100 */

  color: #304156;
`;

const TooltipTitle = styled.span`
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 160%;

  /* AI Blue/Blue 100 */

  color: #304156;
`;

const TooltipContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  border-top: 1px solid #e1e5e9;
  padding-top: 8px;
`;

const TooltipContentText = styled.span`
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 160%;
  /* Basic/Grey/070 */

  color: #828d99;
`;

export default TimeLine;
