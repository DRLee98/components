import React, { forwardRef, memo } from "react";
import styled from "styled-components";
import FlexBox from "components/FlexBox";
import transparentBg from "./assets/transparent.png";

export enum EType {
  BLACK,
  OPACITY,
}

interface IOnChangeFn {
  x: number;
  offsetLeft: number;
  width: number;
  complete: boolean;
}

interface IPaletteSlider {
  value: number;
  type: EType;
  onChange: (value: number, complete: boolean) => void;
}

const PaletteSlider = forwardRef<HTMLDivElement, IPaletteSlider>(
  ({ value, type, onChange }, ref) => {
    const formatValue = (num: number) => Math.ceil(num * 100);

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const {
        nativeEvent: { offsetX },
        currentTarget: { clientWidth },
      } = e;
      onChange(formatValue(offsetX / clientWidth), true);
    };

    const onChangeFn = ({ x, offsetLeft, width, complete }: IOnChangeFn) => {
      const v = (x - offsetLeft) / width;
      const num = formatValue(v);
      if (v > 1) return onChange(formatValue(1), complete);
      if (v < 0) return onChange(formatValue(0), complete);
      return onChange(num, complete);
    };

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      const { currentTarget } = e;
      const onMouseMoveWindow = (event: MouseEvent) => {
        onChangeFn({
          x: event.clientX,
          offsetLeft: currentTarget.offsetLeft,
          width: currentTarget.clientWidth,
          complete: false,
        });
      };

      const onMouseUp = (event: MouseEvent) => {
        window.removeEventListener("mousemove", onMouseMoveWindow);
        window.removeEventListener("mouseup", onMouseUp);

        onChangeFn({
          x: event.clientX,
          offsetLeft: currentTarget.offsetLeft,
          width: currentTarget.clientWidth,
          complete: true,
        });
      };

      window.addEventListener("mousemove", onMouseMoveWindow);
      window.addEventListener("mouseup", onMouseUp);
    };

    return (
      <Container>
        <Track
          type={type}
          image={transparentBg}
          onClick={onClick}
          onMouseDown={onMouseDown}
        >
          <Bg ref={ref} type={type} />
          <Pointer rangeValue={value} />
        </Track>
      </Container>
    );
  }
);

const Container = styled(FlexBox)`
  width: 100%;
  height: 20px;

  border: 2px solid #e1e5e9;
  border-radius: 999px;
`;

interface ITrack {
  image?: string;
  type: EType;
}

const Track = styled.div<ITrack>`
  position: relative;

  width: calc(100% - 18px);
  height: 100%;

  cursor: pointer;

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

interface IBg {
  type: EType;
}

const Bg = styled.div<IBg>`
  position: absolute;
  left: -9px;

  width: calc(100% + 18px);
  height: 100%;

  border-radius: 999px;
  background: ${({ type }) => `linear-gradient(
    to left,
     #ffffff,
    ${type === EType.BLACK ? "#000000" : "rgba(255, 255, 255, 0)"}
  )`};

  pointer-events: none;
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

export default memo(
  PaletteSlider,
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);
