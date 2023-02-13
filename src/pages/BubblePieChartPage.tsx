import React, { useState } from "react";
import { useEffect } from "react";
import BubblePieChart, { IDataSet } from "../components/BubblePieChart";

const randomNum = (max: number) => Math.ceil(Math.random() * max);

const getData = (length: number) => {
  const data: IDataSet[] = [];
  for (let i = 0; i < length; i++) {
    const randomNumA = randomNum(100);
    const randomNumB = randomNum(100);
    const newData: IDataSet = {
      key: i,
      label: String.fromCharCode((i % 26) + 65) + Math.ceil(i / 26),
      value: randomNumA + randomNumB,
      ...(randomNum(2) === 2 && { pieData: [randomNumA, randomNumB] }),
    };
    data.push(newData);
  }
  return data;
};

function BubblePieChartPage() {
  const colors = ["#BBC0C5", "#2EB7FF"];
  const [data, setData] = useState<IDataSet[]>([]);

  const onClick = () => {
    setData((prev) => {
      const [_, ...array] = prev;
      return array;
    });
  };

  const chartClick = (key: number | string) => {
    console.log(key);
  };

  useEffect(() => {
    setData(getData(30));
  }, []);

  return (
    <>
      <button onClick={onClick}> -1 </button>
      <BubblePieChart dataSet={data} colors={colors} onClick={chartClick} />
    </>
  );
}

export default BubblePieChartPage;
