import FlexBox from "components/FlexBox";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PaletteSlider, { EType } from "./PaletteSlider";

interface IGetColor {
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  top: number;
}

interface IColorPalette {
  onChange: (color: string) => void;
}

function ColorPalette({ onChange }: IColorPalette) {
  const pointerRef = useRef<HTMLDivElement>(null);

  const [blackSlider, setBlackSlider] = useState(100);
  const [opacitySlider, setOpacitySlider] = useState(100);
  const [color, setColor] = useState("");

  const getColor = useCallback(
    ({ x, y, width, height, left, top }: IGetColor) => {
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);

      const distance = Math.sqrt(dx * dx + dy * dy) / (width / 2);
      const rad = Math.atan2(x - centerX, centerY - y);
      const deg = (rad * 180) / Math.PI;
      const circleDeg = deg < 0 ? deg + 360 : deg;

      setColor(
        `hwb(${Math.floor(circleDeg)}deg ${
          distance > 1 ? 1 : Math.ceil((1 - distance) * 100)
        }%`
      );

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

  const onMouseDownPalette = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
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
        });
      };
      window.addEventListener("mousemove", getColorFn);
      window.addEventListener("mouseup", () => {
        window.removeEventListener("mousemove", getColorFn);
      });
    },
    []
  );

  const onChangeBlackSlider = useCallback(
    (value: number) => {
      setBlackSlider(value);
      onChange(`${color} ${100 - value}% / ${opacitySlider}%)`);
    },
    [color, opacitySlider]
  );

  const onChangeOpacitySlider = useCallback(
    (value: number) => {
      setOpacitySlider(value);
      onChange(`${color} ${100 - blackSlider}% / ${value}%)`);
    },
    [color, blackSlider]
  );

  useEffect(() => {
    color && onChange(`${color} ${100 - blackSlider}% / ${opacitySlider}%)`);
  }, [color]);

  return (
    <Container>
      <Palette onMouseDown={onMouseDownPalette}>
        <WihteCircle />
        <Pointer ref={pointerRef} />
      </Palette>
      <PaletteSlider
        color={color ? `${color} 0%)` : "hwb(0deg 100% 0%)"}
        value={blackSlider}
        onChange={onChangeBlackSlider}
        type={EType.BLACK}
      />
      <PaletteSlider
        color={
          color
            ? `${color} ${100 - blackSlider}%)`
            : `hwb(0deg 100% ${100 - blackSlider}%)`
        }
        value={opacitySlider}
        onChange={onChangeOpacitySlider}
        type={EType.OPACITY}
      />
    </Container>
  );
}

const Container = styled(FlexBox).attrs({ direction: "column", gap: 15 })``;

const Palette = styled.div`
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

export default ColorPalette;
