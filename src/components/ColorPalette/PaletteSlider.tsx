import React from "react";
import styled from "styled-components";
import FlexBox from "components/FlexBox";
import transparentBg from "./assets/transparent.png";

export enum EType {
  BLACK,
  OPACITY,
}

interface IPaletteSlider {
  value: number;
  type: EType;
  color: string;
  onChange: (value: number) => void;
}

function PaletteSlider({ value, type, color, onChange }: IPaletteSlider) {
  const formatValue = (num: number) => Math.ceil(num * 100);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      nativeEvent: { offsetX },
      currentTarget: { clientWidth },
    } = e;
    onChange(formatValue(offsetX / clientWidth));
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget } = e;
    const onMouseMoveWindow = (event: MouseEvent) => {
      const v =
        (event.clientX - currentTarget.offsetLeft) / currentTarget.clientWidth;
      const num = formatValue(v);
      if (v > 1) return onChange(formatValue(1));
      if (v < 0) return onChange(formatValue(0));
      return onChange(num);
    };
    window.addEventListener("mousemove", onMouseMoveWindow);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", onMouseMoveWindow);
    });
  };

  return (
    <Container>
      <Track
        color={color}
        type={type}
        image={transparentBg}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        <Pointer rangeValue={value} />
      </Track>
    </Container>
  );
}

const Container = styled(FlexBox)`
  width: 100%;
  height: 20px;

  border: 2px solid #e1e5e9;
  border-radius: 999px;
`;

interface ITrack {
  type: EType;
  image?: string;
}

const Track = styled.div<ITrack>`
  position: relative;

  width: calc(100% - 18px);
  height: 100%;

  cursor: pointer;

  &:after {
    content: "";

    position: absolute;
    left: -9px;

    width: calc(100% + 18px);
    height: 100%;

    border-radius: 999px;
    background: ${({ color, type }) => `linear-gradient(
    to left,
     ${color || "#ffffff"},
    ${type === EType.BLACK ? "#000000" : color?.replace(")", "/ 0%)")}
  )`};
  }

  ${({ type, image }) =>
    type === EType.OPACITY &&
    `
    &:before {
    content: "";

      position: absolute;
      left: -9px;

      width: calc(100% + 18px);
      height: 100%;

      border-radius: 999px;
      background: url(${image});
    }
  `}

  z-index: 1;
`;

interface IPointer {
  rangeValue: number;
}

const Pointer = styled.div<IPointer>`
  position: absolute;
  top: 50%;
  left: ${({ rangeValue }) => rangeValue}%;

  transform: translate(-50%, -50%);

  width: 15px;
  height: 15px;

  border: 2px solid #ffffff;
  border-radius: 999px;
  box-shadow: 0px 0px 2px 2px rgb(72 72 72 / 60%);

  pointer-events: none;
  z-index: 1;
`;

export default PaletteSlider;
