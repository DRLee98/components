import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Calendar from "./Calendar";
import { getToday } from "./utils";
import { ReactComponent as CalendarIcon } from "./assets/calendar.svg";

interface IDate {
  year: number;
  month: number;
}

interface IDatePicker {
  onChange: (date: string | Date) => void;
  returnType?: "string" | "date";
  min?: string | Date;
  max?: string | Date;
}

const testSelectDateList = [
  ["2022.07.01", "2022.07.08"],
  ["2022.07.12", "2022.07.15"],
  ["2022.07.18", "2022.07.21"],
];

function DatePicker({
  onChange,
  returnType = "string",
  min,
  max,
}: IDatePicker) {
  const [date, setDate] = useState<IDate>();
  const [dateStr, setDateStr] = useState<string>("");
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);

  const handleInputClick = useCallback(() => {
    setOpenCalendar((prev) => !prev);
  }, []);

  const changeDate = useCallback(
    (date: string) => {
      const newDate = new Date(date);
      if (min) {
        const minDate = typeof min === "string" ? new Date(min) : min;
        if (minDate > newDate) {
          return alert("최소 에러");
        }
      }
      if (max) {
        const maxDate = typeof max === "string" ? new Date(max) : max;
        if (maxDate < newDate) {
          return alert("최대 에러");
        }
      }
      setDateStr(date);
      // setOpenCalendar(false);
      const returnVal = returnType === "string" ? date : newDate;
      onChange(returnVal);
      const [y, m] = date.split(".");
      setDate({ year: +y, month: +m });
    },
    [max, min, onChange, returnType]
  );

  useEffect(() => {
    const { year, month } = getToday();
    setDate({ year, month });
  }, []);

  return (
    <Container>
      <CalendarButton onClick={handleInputClick} open={openCalendar}>
        <CalendarIcon />
        {dateStr && <DateText>{dateStr}</DateText>}
      </CalendarButton>
      {date && openCalendar && (
        <Calendar
          year={date.year}
          month={date.month}
          selectedList={testSelectDateList}
          onChangeValue={changeDate}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

interface ICalendarButton {
  open: boolean;
}

const CalendarButton = styled.button<ICalendarButton>`
  margin: auto;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  & > span {
    color: ${({ open }) => (open ? "#0099FE" : "#828282")};
  }
  & > svg > path {
    fill: ${({ open }) => (open ? "#0099FE" : "#828282")};
  }
`;

const DateText = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  line-height: 154.52%;

  display: flex;
  align-items: center;

  color: #828282;
`;

export default DatePicker;
