import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import YearItem from "./YearItem";

interface IYearList {
  year: number;
  setFn: (y: number, m: number) => void;
}

function YearList({ year, setFn }: IYearList) {
  const listRef = useRef<HTMLUListElement>(null);

  const [min, setMin] = useState(year - 50);
  const [max, setMax] = useState(year + 50);
  const [yearList, setYearList] = useState<number[]>([]);
  const [targetTop, setTargetTop] = useState<number>();

  const handleScroll = useCallback(() => {
    const current = listRef.current;
    const scrollTop = current?.scrollTop;
    const scrollHeight = current?.scrollHeight;
    const clientHeight = current?.clientHeight;
    if (scrollTop && scrollHeight && clientHeight) {
      if (scrollHeight - (scrollTop + clientHeight) < 300) {
        for (let i = max, length = max + 50; i < length; i++) {
          setYearList((prev) => [...prev, i]);
        }
        setMax((prev) => prev + 50);
      }
      if (scrollTop < 300 && min > 0) {
        for (let i = min - 1, length = min - 50; i >= length; i--) {
          setYearList((prev) => [i, ...prev]);
          if (i === 1) {
            break;
          }
        }
        setMin((prev) => (prev - 50 < 0 ? 0 : prev - 50));
      }
    }
  }, [max, min]);

  const targetTopSet = useCallback((topNum: number) => {
    setTargetTop(topNum);
  }, []);

  useEffect(() => {
    for (let i = min, length = max; i < length; i++) {
      setYearList((prev) => [...prev, i]);
    }
  }, []);

  useLayoutEffect(() => {
    if (listRef) {
      const listTop = listRef.current?.offsetTop;
      const scrollTop = listRef.current?.scrollTop;
      if (listTop && targetTop) {
        listRef.current?.scrollTo({
          top: targetTop - listTop,
          ...(scrollTop && scrollTop > 100 && { behavior: "smooth" }),
        });
      }
    }
  }, [listRef, targetTop]);

  return (
    <Container>
      <List ref={listRef} onScroll={handleScroll}>
        {yearList.map((y) => {
          return (
            <YearItem
              key={`year_${y}`}
              year={y}
              targetYear={year}
              topSet={targetTopSet}
              setFn={setFn}
            />
          );
        })}
      </List>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background-color: white;
  padding: 15px;
`;

const List = styled.ul`
  width: 100%;
  height: 100%;
  overflow: scroll;
`;

export default YearList;
