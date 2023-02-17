import React from "react";
import styled from "styled-components";
import FlexBox from "components/FlexBox";

interface ISlider {
  value: number;
  onChange: (value: number) => void;
}

function Slider({ value, onChange }: ISlider) {
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      nativeEvent: { offsetX },
      currentTarget: { clientWidth },
    } = e;
    onChange((offsetX / clientWidth) * 100);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget } = e;
    const onMouseMoveWindow = (event: MouseEvent) => {
      const v =
        ((event.clientX - currentTarget.offsetLeft) /
          currentTarget.clientWidth) *
        100;
      if (v > 100 || v < 0) return;
      onChange(v);
    };
    window.addEventListener("mousemove", onMouseMoveWindow);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", onMouseMoveWindow);
    });
  };

  return (
    <Container>
      <Track rangeValue={value} onClick={onClick} onMouseDown={onMouseDown}>
        <Pointer />
        <RunnableTrack />
      </Track>
      <Value>{value.toFixed(0)}%</Value>
    </Container>
  );
}

interface ITrack {
  rangeValue: number;
}

const Container = styled(FlexBox).attrs({ gap: 15 })`
  width: 100%;
`;

const Track = styled.div<ITrack>`
  position: relative;

  width: 100%;
  height: 6px;

  background-color: ${({ theme }) => theme.gray040};
  border-radius: 999px;

  cursor: pointer;
  & > div {
    left: ${({ rangeValue }) => rangeValue}%;
    pointer-events: none;
  }
`;

const Pointer = styled.div`
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translateY(-50%) translateX(-8px);

  width: 16px;
  height: 16px;

  border: 4px solid ${({ theme }) => theme.surfacePrimary};
  border-radius: 999px;
  background-color: ${({ theme }) => theme.red};
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1);

  z-index: 1;
`;

const RunnableTrack = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0%;

  border-radius: 999px;
  background-color: ${({ theme }) => theme.red};
`;

const Value = styled.span`
  min-width: 40px;

  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;

  letter-spacing: -0.0857143px;

  color: ${({ theme }) => theme.red};
`;

export default Slider;
