import React, { memo, useCallback, useRef } from "react";
import styled from "styled-components";

interface IGetColor {
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  top: number;
  complete: boolean;
}

interface IHue {
  onChangeColor: (color: string, complete: boolean) => void;
}

function Hue({ onChangeColor }: IHue) {
  const pointerRef = useRef<HTMLDivElement>(null);

  const getColor = useCallback(
    ({ x, y, width, height, left, top, complete }: IGetColor) => {
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);

      const distance = Math.sqrt(dx * dx + dy * dy) / (width / 2);
      const rad = Math.atan2(x - centerX, centerY - y);
      const deg = (rad * 180) / Math.PI;
      const circleDeg = deg < 0 ? deg + 360 : deg;

      const color = `hwb(${Math.floor(circleDeg)}deg ${
        distance > 1 ? 1 : Math.ceil((1 - distance) * 100)
      }%`;
      onChangeColor(color, complete);

      const positionX =
        distance > 0.95
          ? centerX +
            ((x - centerX) / (distance * (width / 2 + 10))) * (width / 2)
          : x;
      const positionY =
        distance > 0.95
          ? centerY +
            ((y - centerY) / (distance * (width / 2 + 10))) * (width / 2)
          : y;

      if (pointerRef.current) {
        pointerRef.current.style.top = `${positionY - top}px`;
        pointerRef.current.style.left = `${positionX - left}px`;
      }
    },
    [pointerRef]
  );

  const onMouseClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const {
      clientX,
      clientY,
      currentTarget: { offsetLeft, offsetWidth, offsetTop, offsetHeight },
    } = e;
    getColor({
      x: clientX,
      y: clientY,
      width: offsetWidth,
      height: offsetHeight,
      left: offsetLeft,
      top: offsetTop,
      complete: true,
    });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const {
      currentTarget: { offsetLeft, offsetWidth, offsetTop, offsetHeight },
    } = e;

    const getColorFn = (event: MouseEvent) => {
      getColor({
        x: event.clientX,
        y: event.clientY,
        width: offsetWidth,
        height: offsetHeight,
        left: offsetLeft,
        top: offsetTop,
        complete: false,
      });
    };

    const onMouseUp = (event: MouseEvent) => {
      window.removeEventListener("mousemove", getColorFn);
      window.removeEventListener("mouseup", onMouseUp);

      getColor({
        x: event.clientX,
        y: event.clientY,
        width: offsetWidth,
        height: offsetHeight,
        left: offsetLeft,
        top: offsetTop,
        complete: true,
      });
    };

    window.addEventListener("mousemove", getColorFn);
    window.addEventListener("mouseup", onMouseUp);
  }, []);

  return (
    <Circle onMouseDown={onMouseDown} onClick={onMouseClick}>
      <WihteCircle />
      <Pointer ref={pointerRef} />
    </Circle>
  );
}

const Circle = styled.div`
  position: relative;

  width: 200px;
  height: 200px;

  border-radius: 999px;
  border: 2px solid #e1e5e9;
  background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
`;

const WihteCircle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: radial-gradient(
    circle closest-side,
    rgb(255, 255, 255),
    transparent
  );
`;

const Pointer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;

  width: 15px;
  height: 15px;

  border: 2px solid #ffffff;
  border-radius: 999px;
  box-shadow: 0px 0px 2px 2px rgb(72 72 72 / 60%);

  transform: translate(-50%, -50%);
`;

export default memo(
  Hue,
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);
