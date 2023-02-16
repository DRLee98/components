import React from "react";
import styled from "styled-components";

export interface ITooltipData<T> {
  key: keyof T;
  value: number | [number, number];
}

interface ITooltip<T> {
  x: number;
  y: number;
  name: string;
  data: ITooltipData<T>[];
}

function Tooltip<T>({ x, y, name, data }: ITooltip<T>) {
  return (
    <Container x={x} y={y} show={data.length > 0}>
      <Name>{name}</Name>
      <DataBox>
        {data.map((d) => (
          <DataItem key={`_${d.key as string}`}>
            <DataLabel>{d.key as string}</DataLabel>
            <DataValue>
              {Array.isArray(d.value) ? d.value.join("~") : d.value}
            </DataValue>
          </DataItem>
        ))}
      </DataBox>
    </Container>
  );
}

interface IContainer {
  x: number;
  y: number;
  show: boolean;
}

const Container = styled.div<IContainer>`
  position: absolute;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;

  min-width: 150px;

  padding: 16px 24px;

  background-color: #ffffff;
  border: 2px solid #f0f2f4;
  border-radius: 4px;

  transform: translate(20px, -50%);

  opacity: ${({ show }) => (show ? 1 : 0)};
  filter: drop-shadow(-7px 8px 16px rgba(58, 70, 93, 0.07));
`;

const Name = styled.b`
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 160%;

  color: #304156;
`;

const DataBox = styled.ul`
  padding-top: 10px;
  margin-top: 10px;

  border-top: 1px solid #e1e5e9;
`;

const DataItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const DataLabel = styled.span`
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;

  color: #828d99;
`;

const DataValue = styled.span`
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;

  color: #304156;
`;

export default Tooltip;
