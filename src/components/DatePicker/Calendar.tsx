import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import DateList from "./DateList";
import YearList from "./YearList";
import { ReactComponent as LeftArrow } from "./assets/left_arrow.svg";
import { ReactComponent as RightArrow } from "./assets/right_arrow.svg";

enum EAction {
  prev,
  next,
}

type TSelectState = "SELECTING" | "SELECTED";

interface ICalendar {
  width?: number;
  height?: number;
  year: number;
  month: number;
  selectedList?: string[][];
  onChangeValue: (date: string) => void;
}

function Calendar({
  width,
  height,
  year,
  month,
  selectedList,
  onChangeValue,
}: ICalendar) {
  const [y, setY] = useState<number>(year);
  const [m, setM] = useState<number>(month);
  const [openList, setOpenList] = useState<boolean>(false);
  const [action, setAction] = useState<EAction | null>(null);
  const [selectState, setSelectState] = useState<TSelectState>();
  const [selectDate, setSelectDate] = useState<string | string[]>("");
  const dayNames = [
    { label: "M", value: 1 },
    { label: "T", value: 2 },
    { label: "W", value: 3 },
    { label: "T", value: 4 },
    { label: "F", value: 5 },
    { label: "S", value: 6 },
    { label: "S", value: 0 },
  ];

  const dateSelectFn = (date: string) => {
    switch (selectState) {
      case "SELECTING":
        if (selectedList) {
          const selectList = [
            ...(Array.isArray(selectDate) ? selectDate : [selectDate]),
            date,
          ].sort();
          const find = selectedList.find((selecedDate) => {
            if (selecedDate.length === 1) return selecedDate[0] === date;
            return (
              selectList[0] <= selecedDate[0] && selecedDate[1] <= selectList[1]
            );
          });
          if (find) return;
        }
        setSelectState("SELECTED");
        if (date !== selectDate) {
          setSelectDate(
            (prev) =>
              prev &&
              (Array.isArray(prev) ? [...prev, date] : [prev, date]).sort()
          );
        }
        setSelectDate((prev) => prev && (Array.isArray(prev) ? prev : [prev]));
        break;
      case "SELECTED":
        setSelectState(undefined);
        setSelectDate([]);
        break;
      default:
        setSelectState("SELECTING");
        setSelectDate(date);
        break;
    }
  };

  const toggleYearList = useCallback(() => {
    setOpenList((prev) => !prev);
  }, []);

  const setYearMonth = useCallback((y: number, m: number) => {
    const newDate = new Date(y, m - 1);
    const formatY = newDate.getFullYear();
    const formatM = newDate.getMonth() + 1;
    setY(formatY);
    setM(formatM);
    setOpenList(false);
  }, []);

  const prevAction = useCallback(() => {
    setAction(EAction.prev);
    setTimeout(() => {
      setYearMonth(y, m - 1);
      setAction(null);
    }, 300);
  }, [setYearMonth, y, m]);

  const nextAction = useCallback(() => {
    setAction(EAction.next);
    setTimeout(() => {
      setYearMonth(y, m + 1);
      setAction(null);
    }, 300);
  }, [setYearMonth, y, m]);

  useEffect(() => {
    if (selectState === "SELECTED" && selectDate) {
      if (Array.isArray(selectDate)) {
        onChangeValue(selectDate.join(" ~ "));
      } else {
        onChangeValue(selectDate);
      }
    }
  }, [selectState, selectDate, onChangeValue]);

  return (
    <Container width={width} height={height}>
      <TopBox>
        <ControllBtn onClick={prevAction}>
          <LeftArrow />
        </ControllBtn>
        <CurYearMonth onClick={toggleYearList}>
          {y}년 {m}월
        </CurYearMonth>
        <ControllBtn onClick={nextAction}>
          <RightArrow />
        </ControllBtn>
      </TopBox>
      <DayNameList>
        {dayNames.map(({ label, value }) => (
          <DayName key={`day_${label}_${value}`}>{label}</DayName>
        ))}
      </DayNameList>
      <ViewBox>
        <DateListBox action={action}>
          <DateList
            key={`${y}_${m - 1}_date_list`}
            selectFc={dateSelectFn}
            selectedList={selectedList}
            selectingList={selectDate}
            year={y}
            month={m - 1}
          />
          <DateList
            key={`${y}_${m}_date_list`}
            selectFc={dateSelectFn}
            selectedList={selectedList}
            selectingList={selectDate}
            year={y}
            month={m}
          />
          <DateList
            key={`${y}_${m + 1}_date_list`}
            selectFc={dateSelectFn}
            selectedList={selectedList}
            selectingList={selectDate}
            year={y}
            month={m + 1}
          />
        </DateListBox>
      </ViewBox>
      {openList && <YearList year={y} setFn={setYearMonth} />}
    </Container>
  );
}

interface IContainer {
  width?: number;
  height?: number;
}

const Container = styled.div<IContainer>`
  position: absolute;
  top: 200%;
  left: 50%;
  transform: translateX(-50%);
  width: ${(props) => (props.width ? props.width : "350")}px;
  height: ${(props) => (props.height ? props.height : "300")}px;
  padding: 30px 40px;
  z-index: 100;

  background: #ffffff;
  border: 2px solid #e6e6e6;
  border-radius: 4px;
  box-shadow: 8px 8px 16px rgba(58, 70, 93, 0.07);
  &:before {
    content: "";

    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);

    width: 15px;
    height: 15px;
    border-radius: 4px 0 0 0;
    border-width: 2px 0 0 2px;
    border-style: solid;
    border-color: #e6e6e6;
    background: #ffffff;

    z-index: 102;
  }
`;

const TopBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const CurYearMonth = styled.span`
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;

  color: #828282;

  cursor: pointer;
`;

const ControllBtn = styled.button``;

const DayNameList = styled.ul`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DayName = styled.li`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  line-height: 154.52%;

  text-align: center;

  color: #c4c4c4;
`;

const ViewBox = styled.div`
  width: 100%;
  height: 80%;
  overflow: hidden;
  position: relative;
`;

interface IDateListBox {
  action: EAction | null;
}

const DateListBox = styled.div<IDateListBox>`
  height: 100%;
  width: 300%;

  display: flex;

  position: absolute;
  top: 0;
  left: ${({ action }) =>
    action === EAction.prev
      ? "0"
      : action === EAction.next
      ? "-200%"
      : "-100%"};
  transition: ${({ action }) =>
    action === null ? "none" : "all 0.3s ease-in-out"};
`;

export default memo(
  Calendar,
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);
