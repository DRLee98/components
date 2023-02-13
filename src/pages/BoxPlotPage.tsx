import React from "react";
import BoxPlot, { IData } from "components/BoxPlot";
import styled from "styled-components";

const sampleData: IData[] = [
  {
    name: "wheel-base",
    maximum: 108,
    Q3: 102,
    Q2: 97,
    Q1: 94.5,
    minimum: 86.6,
    IQR: 7.9,
  },
  {
    name: "length",
    maximum: 197,
    Q3: 183,
    Q2: 173,
    Q1: 166,
    minimum: 150,
    IQR: 16.8,
  },
  {
    name: "width",
    maximum: 69.6,
    Q3: 66.9,
    Q2: 65.5,
    Q1: 64.1,
    minimum: 61.8,
    IQR: 2.8,
  },
  {
    name: "engine-size",
    maximum: 183,
    Q3: 141,
    Q2: 120,
    Q1: 97,
    minimum: 61,
    IQR: 44,
  },
];

function BoxPlotPage() {
  return (
    <Container>
      <BoxPlot
        data={sampleData}
        yDomain={[0, 400]}
        yTicks={[0, 100, 200, 300, 400]}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 80%;

  margin: 40px 0;
  padding: 40px;

  & > div {
    width: 800px;
    height: 800px;
  }
`;

export default BoxPlotPage;
