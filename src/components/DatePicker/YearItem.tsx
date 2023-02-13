import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

interface IYearItem {
  year: number;
  targetYear: number;
  topSet: (topNum: number) => void;
  setFn: (y: number, m: number) => void;
}

function YearItem({ year, targetYear, topSet, setFn }: IYearItem) {
  const [open, setOpen] = useState<boolean>(year === targetYear);
  const targetRef = useRef<HTMLLIElement>(null);

  const monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const toggleMonthOpen = useCallback(() => {
    setOpen((prev) => !prev);
    if (targetRef.current && !open) {
      const top = targetRef.current.offsetTop;
      topSet(top);
    }
  }, [open]);

  useLayoutEffect(() => {
    if (targetRef.current && year === targetYear) {
      const top = targetRef.current.offsetTop;
      topSet(top);
    }
  }, [targetRef]);

  return (
    <Container id={`year_${year}`} ref={targetRef}>
      <Year onClick={toggleMonthOpen}>
        <YearText>{year}</YearText>
      </Year>
      <MonthList open={open}>
        {monthList.map((month) => (
          <Month
            key={`yaer_${year}_month_${month}`}
            onClick={() => {
              setFn(year, month);
            }}
          >
            {month}
          </Month>
        ))}
      </MonthList>
    </Container>
  );
}

const Container = styled.li`
  padding: 5px 0;
  & + & {
    border-top: 1px solid #c4c4c4;
  }
`;

const Year = styled.div`
  cursor: pointer;
`;

const YearText = styled.span`
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;

  color: #828282;
`;

interface IMonthList {
  open: boolean;
}

const MonthList = styled.ul<IMonthList>`
  display: flex;
  flex-wrap: wrap;
  height: ${(props) => (props.open ? "120px" : "0")};
  overflow: hidden;
  transition: height 0.3s ease-in-out;
`;

const Month = styled.li`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 154.52%;

  color: #828282;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 25%;
  padding: 10px 0;
  &:hover {
    background: #f1f1f1;
    border-radius: 5px;
  }
  cursor: pointer;
`;

export default YearItem;
