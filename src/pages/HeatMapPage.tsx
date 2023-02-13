import React from "react";
import styled from "styled-components";
import HeatMap from "components/HeatMap";

const randomNum = (max: number) => Math.ceil(Math.random() * max);

const getData = (length: number) => {
  const data: number[][] = [];
  for (let i = 0; i < length; i++) {
    const list: number[] = [];
    for (let j = 0; j < length; j++) {
      let num = randomNum(100) / 100;
      if (randomNum(2) === 1) num = num * -1;
      list.push(num);
    }
    data.push(list);
  }
  return data;
};

const getTicks = (length: number) => {
  const data: string[] = [];
  for (let i = 0; i < length; i++) {
    data.push(Math.random().toString(36).substring(2, 6));
  }
  return data;
};

function HeatMapPage() {
  return (
    <Container>
      <HeatMap data={getData(20)} ticks={getTicks(20)} />
    </Container>
  );
}

const Container = styled.div`
  height: 100%;

  margin: 40px 0;
  padding: 40px;
`;

export default HeatMapPage;
