import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import { formatNum } from "./utils";

type TSelected = "start" | "end" | "between" | boolean;

interface IDay {
  date: number;
  day: number;
  weekNum: number;
}

interface IDateList {
  year: number;
  month: number;
  selectedList?: string[][];
  selectingList: string | string[];
  selectFc: (date: string) => void;
}

function DateList({
  year,
  month,
  selectedList,
  selectingList,
  selectFc,
}: IDateList) {
  const [days, setDays] = useState<IDay[]>([]);
  const [weekCount, setWeekCount] = useState<number>(1);

  const dayList = [1, 2, 3, 4, 5, 6, 0];

  const getSelected = (date: string, target?: string | string[]): TSelected => {
    if (Array.isArray(target)) {
      if (target.length === 1) return date === target[0];
      if (date === target[0]) return "start";
      if (date === target[1]) return "end";
      if (date > target[0] && date < target[1]) return "between";
    }
    return date === target;
  };

  const getSelectedFn = (
    date: string,
    day: number
  ): { selected: TSelected; color: string } => {
    if (day === 0 || day === 6) return { selected: false, color: "" };
    if (selectedList) {
      const findList = selectedList.find((selectDate) => {
        if (selectDate.length === 1) return date === selectDate[0];
        return date >= selectDate[0] && date <= selectDate[1];
      });
      if (findList) {
        return { selected: getSelected(date, findList), color: "#C4C4C4" };
      }
    }

    return { selected: getSelected(date, selectingList), color: "#0099FE" };
  };

  const getDisabled = (date: string, day: number) => {
    if (day === 0 || day === 6) return true;
    if (selectedList) {
      const findList = selectedList.find((selectDate) => {
        if (selectDate.length === 1) return date === selectDate[0];
        return date >= selectDate[0] && date <= selectDate[1];
      });
      if (findList) {
        return Boolean(getSelected(date, findList));
      }
    }
    return false;
  };

  useEffect(() => {
    const lastDate = new Date(year, month, 0).getDate();

    let dayList: IDay[] = [];
    let weekNum = 1;
    for (let i = 1; i <= lastDate; i++) {
      const day = new Date(year, month - 1, i).getDay();
      dayList = [...dayList, { date: i, day, weekNum }];
      if (day === 0) weekNum++;
    }
    setWeekCount(weekNum);
    setDays(dayList);
  }, [year, month]);
  console.log("render", year, month);
  return (
    <Container weekCount={weekCount} dayList={dayList}>
      {days.map(({ date, day, weekNum }) => (
        <DayItem
          dayStr={`d_${day}_${weekNum}`}
          day={day}
          key={`year_${year}_month_${month}_date_${date}`}
          onClick={() => {
            day > 0 &&
              day < 6 &&
              !getDisabled(
                `${year}.${formatNum(month)}.${formatNum(date)}`,
                day
              ) &&
              selectFc(`${year}.${formatNum(month)}.${formatNum(date)}`);
          }}
          disabled={getDisabled(
            `${year}.${formatNum(month)}.${formatNum(date)}`,
            day
          )}
          {...getSelectedFn(
            `${year}.${formatNum(month)}.${formatNum(date)}`,
            day
          )}
        >
          {date}
        </DayItem>
      ))}
    </Container>
  );
}

interface IContainer {
  dayList: number[];
  weekCount: number;
}

const Container = styled.ul<IContainer>`
  width: calc(100% / 3);
  height: 100%;
  display: grid;
  grid-template-areas: ${(props) => {
    let areas = "";
    for (let i = 0, length = props.weekCount; i < length; i++) {
      const area = props.dayList.map((day) => `d_${day}_${i + 1}`);
      areas += `"${area.join(" ")}"`;
    }
    return areas;
  }};
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
  align-items: center;
`;

interface IDayItem {
  dayStr: string;
  selected: TSelected;
  disabled: boolean;
  day: number;
}

const DayItem = styled.li<IDayItem>`
  position: relative;

  grid-area: ${(props) => props.dayStr};
  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 26px;

  background: #f1f1f1;
  border-radius: 5px;

  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  line-height: 154.52%;

  color: #c4c4c4;

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  ${({ selected, day, color }) =>
    selected &&
    `
    &:after {
      content: "";
      position: absolute;

      width: ${
        selected === true
          ? "12px"
          : selected === "start" || selected === "end"
          ? "75%"
          : "200%"
      };
      height: 12px;

      right: ${
        selected === "start" || (selected === "between" && day === 5)
          ? "0px"
          : "unset"
      };
      left: ${
        selected === "end" || (selected === "between" && day === 1)
          ? "0px"
          : "unset"
      };

      border-radius: ${
        selected === true
          ? "999px"
          : selected === "start"
          ? "999px 0 0 999px"
          : selected === "end"
          ? "0 999px 999px 0"
          : "0"
      };

      background-color: ${color};
    }
  `}

  ${({ disabled, selected }) =>
    !disabled &&
    !selected &&
    `
    &:hover {
      &:after {
        content: "";
        position: absolute;
        right: unset;
        left: unset;

        width: 12px;
        height: 12px;

        border-radius: 999px;
        background-color: #0099fe;

        opacity: 0.5;
      }
    }
  `}
`;

export default memo(
  DateList,
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);
