import React, { useState } from "react";
import styled from "styled-components";
import TimeLine, { IEvent, IPointEvent } from "components/TimeLine";

const randomNum = (max: number) => Math.ceil(Math.random() * max);

const getData = (length: number) => {
  const categoryList = [
    { category: "업무 프로젝트", color: "#02E7AC" },
    { category: "교육 및 행사", color: "#C27AEB" },
    { category: "징계", color: "#FF0D64" },
    { category: "수상 및 보상", color: "#FFD300" },
  ];
  const data: IEvent[] = [];
  for (let i = 0; i < length; i++) {
    const targetCategory = categoryList[randomNum(categoryList.length) - 1];
    const yearPlus = randomNum(2) - 1;
    const startMonth = randomNum(12);
    const startDay = randomNum(30);
    data.push({
      ...targetCategory,
      text: `${targetCategory.category} ${i}`,
      start: new Date(2022 + yearPlus, startMonth - 1, startDay),
      end: new Date(2022 + yearPlus, startMonth - 1, startDay + randomNum(50)),
    });
  }
  return data;
};

const getPointData = (length: number) => {
  const colorList = ["#02E7AC", "#C27AEB", "#FF0D64", "#FFD300"];
  const textList = ["승진", "부서이동", "입사"];
  const data: IPointEvent[] = [];
  for (let i = 0; i < length; i++) {
    const yearPlus = randomNum(2) - 1;
    const startMonth = randomNum(12);
    const startDay = randomNum(30);
    data.push({
      color: colorList[randomNum(colorList.length) - 1],
      text: textList[randomNum(textList.length) - 1],
      date: new Date(2022 + yearPlus, startMonth - 1, startDay),
    });
  }
  return data;
};

function TimeLinePage() {
  return (
    <Container>
      <TimeLine events={getData(80)} pointEvents={getPointData(10)} />
    </Container>
  );
}

const Container = styled.div`
  height: 100%;

  margin: 40px 0;
  padding: 40px;
`;

export default TimeLinePage;
