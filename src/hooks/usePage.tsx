import React, { useEffect, useState } from "react";
import styled from "styled-components";

import FlexBox from "components/FlexBox";
import { ReactComponent as Arrow } from "images/arrow.svg";

interface IAbsoluteButton {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  rotate?: number;
}

interface IUsePage<T> {
  viewNum: number;
  data: T[];
}

function usePage<T>({ viewNum, data }: IUsePage<T>) {
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(0);
  const [viewList, setViewList] = useState<T[]>([]);

  const nextPage = () => {
    if (page < lastPage) {
      const vList = data.slice(page * viewNum, (page + 1) * viewNum);
      setViewList(vList);
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      const vList = data.slice((page - 2) * viewNum, (page - 1) * viewNum);
      setViewList(vList);
      setPage(page - 1);
    }
  };

  const NextButton = (props: IAbsoluteButton) => {
    return (
      <AbsoluteButton onClick={nextPage} {...props}>
        <Arrow />
      </AbsoluteButton>
    );
  };

  const PrevButton = (props: IAbsoluteButton) => {
    return (
      <AbsoluteButton onClick={prevPage} rotate={180} {...props}>
        <Arrow />
      </AbsoluteButton>
    );
  };

  useEffect(() => {
    if (data.length > 0) {
      const lPage = Math.ceil(data.length / viewNum);
      setLastPage(lPage);
      setPage(1);

      const vList = data.slice(0, viewNum);
      setViewList(vList);
    }
  }, [data]);

  return { viewList, page, lastPage, NextButton, PrevButton };
}

const AbsoluteButton = styled(FlexBox).attrs({ as: "button" })<IAbsoluteButton>`
  position: absolute;
  top: ${({ top }) => (top ? `${top}px` : "unset")};
  bottom: ${({ bottom }) => (bottom ? `${bottom}px` : "unset")};
  left: ${({ left }) => (left ? `${left}px` : "unset")};
  right: ${({ right }) => (right ? `${right}px` : "unset")};

  transform: rotate(${({ rotate }) => rotate || 0}deg);
`;

export default usePage;
