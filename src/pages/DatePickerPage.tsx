import React, { ChangeEvent, useState } from "react";
import DatePicker from "../components/DatePicker/DatePicker";
import styled from "styled-components";

function DatePickerPage() {
  const [aDate, setADate] = useState<Date | string>();
  const [bDate, setBDate] = useState<Date | string>();

  const onAChange = (date: string | Date) => {
    setADate(date);
  };
  const onBChange = (date: string | Date) => {
    setBDate(date);
  };

  return (
    <Container>
      <div>
        <DatePicker onChange={onAChange} returnType="string" max={bDate} />
      </div>
      <div>
        <DatePicker onChange={onBChange} returnType="date" min={aDate} />
      </div>
    </Container>
  );
}

const Container = styled.div`
  margin: 40px 0;
  padding: 40px;

  background: #f5f5f5;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default DatePickerPage;
