import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ArrowIcon from "images/arrow.svg";
import CalendarHeatMap, { IDay } from "components/CalendarHeatMap";
import {
  getDateRange,
  getDateText,
  getYMD,
} from "components/CalendarHeatMap/utils";

const randomNum = (max: number) => Math.ceil(Math.random() * max);

const getData = (length: number) => {
  const data = [];
  for (let i = 0; i < length; i++) {
    const startMonth = randomNum(12);
    const startDay = randomNum(30);
    data.push({
      value: randomNum(30),
      date: getDateText(new Date(2023, startMonth - 1, startDay)),
    });
  }
  return data;
};

interface ICalendarDate {
  startDate: Date;
  endDate: Date;
}

function CalendarHeatMapPage() {
  const viewMonthRange = 5;

  const [calendarDate, setCalendarDate] = useState<ICalendarDate>();

  const colors = [
    { color: "#6DCDFF", value: 1 },
    { color: "#2EB7FF", value: 4 },
    { color: "#0099FE", value: 7 },
    { color: "#0276E3", value: 10 },
    { color: "#025EB6", value: 15 },
  ];

  const onChangeMonth = useCallback(
    (type: "prev" | "next") => {
      if (!calendarDate) return;
      if (type === "prev") {
        const { year, month } = getYMD(calendarDate.startDate);
        const { startDate, endDate } = getDateRange(
          year,
          month - 1,
          viewMonthRange - 1
        );
        setCalendarDate({ startDate, endDate });
      }
      if (type === "next") {
        const { year, month } = getYMD(calendarDate.endDate);
        const { startDate, endDate } = getDateRange(
          year,
          month + viewMonthRange,
          viewMonthRange - 1
        );
        setCalendarDate({ startDate, endDate });
      }
    },
    [calendarDate]
  );

  const onClickCalendar = (calendarData: IDay) => console.log(calendarData);

  useEffect(() => {
    const { year, month } = getYMD(new Date());
    const { startDate, endDate } = getDateRange(
      year,
      month,
      viewMonthRange - 1
    );
    setCalendarDate({ startDate, endDate });
  }, []);
  return (
    <Container>
      <RelativeBox>
        {calendarDate && (
          <CalendarHeatMap
            data={getData(300)}
            colors={colors}
            emptyColor="#E1E5E9"
            weekdayTicks={["일", "월", "화", "수", "목", "금", "토"]}
            margin={{ left: 20, right: 40 }}
            daySpacing={3}
            dayRadius={6}
            onClick={onClickCalendar}
            {...calendarDate}
          />
        )}
        <AbsoluteCenterButton
          onClick={() => onChangeMonth("next")}
          top="40%"
          right="20px"
        >
          <img src={ArrowIcon} />
        </AbsoluteCenterButton>
        <AbsoluteCenterButton
          onClick={() => onChangeMonth("prev")}
          top="40%"
          left="0"
        >
          <img src={ArrowIcon} style={{ transform: "rotate(180deg)" }} />
        </AbsoluteCenterButton>
      </RelativeBox>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;

  margin: 40px 0;
  padding: 40px;
`;

const RelativeBox = styled.div`
  position: relative;
  width: 1000px;
  height: 350px;
`;

interface IAbsoluteCenterButton {
  top?: string;
  right?: string;
  left?: string;
}

const AbsoluteCenterButton = styled.button<IAbsoluteCenterButton>`
  all: unset;

  position: absolute;
  top: ${({ top }) => (top === undefined ? "unset" : top)};
  right: ${({ right }) => (right === undefined ? "unset" : right)};
  left: ${({ left }) => (left === undefined ? "unset" : left)};
  transform: translateY(-50%);

  cursor: pointer;
`;

export default CalendarHeatMapPage;
