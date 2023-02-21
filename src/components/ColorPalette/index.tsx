import React, { useRef, useState } from "react";
import styled from "styled-components";
import Hue from "./Hue";
import PaletteSlider, { EType } from "./PaletteSlider";
import FlexBox from "components/FlexBox";

interface IColorPalette {
  onChange: (color: string, complete: boolean) => void;
}

function ColorPalette({ onChange }: IColorPalette) {
  const colorRef = useRef<string>();
  const blackSliderRef = useRef<HTMLDivElement>(null);
  const opacitySliderRef = useRef<HTMLDivElement>(null);

  const [blackSlider, setBlackSlider] = useState(100);
  const [opacitySlider, setOpacitySlider] = useState(100);

  const onChangeColor = (value: string, complete: boolean) => {
    sliderColorSet(value);
    onChange(`${value} ${100 - blackSlider}% / ${opacitySlider}%)`, complete);
  };

  const onChangeBlackSlider = (value: number, complete: boolean) => {
    setBlackSlider(value);
    if (colorRef.current) {
      onChange(
        `${colorRef.current} ${100 - value}% / ${opacitySlider}%)`,
        complete
      );
      if (opacitySliderRef.current) {
        opacitySliderRef.current.style.background = `linear-gradient(
          to left,
          ${colorRef.current} ${100 - value}% / 100%),
          ${colorRef.current} ${100 - value}% / 0%)
        )`;
      }
    }
  };

  const onChangeOpacitySlider = (value: number, complete: boolean) => {
    setOpacitySlider(value);
    if (colorRef.current) {
      onChange(
        `${colorRef.current} ${100 - blackSlider}% / ${value}%)`,
        complete
      );
    }
  };

  const sliderColorSet = (color: string) => {
    colorRef.current = color;
    if (blackSliderRef.current) {
      blackSliderRef.current.style.background = `linear-gradient(
        to left,
         ${color} 0% / 100%),
        #000000
      )`;
    }
    if (opacitySliderRef.current) {
      opacitySliderRef.current.style.background = `linear-gradient(
        to left,
        ${color} ${100 - blackSlider}% / 100%),
        ${color} ${100 - blackSlider}% / 0%)
      )`;
    }
  };

  return (
    <Container>
      <Hue onChangeColor={onChangeColor} />
      <PaletteSlider
        ref={blackSliderRef}
        value={blackSlider}
        onChange={onChangeBlackSlider}
        type={EType.BLACK}
      />
      <PaletteSlider
        ref={opacitySliderRef}
        value={opacitySlider}
        onChange={onChangeOpacitySlider}
        type={EType.OPACITY}
      />
    </Container>
  );
}

const Container = styled(FlexBox).attrs({ direction: "column", gap: 15 })``;

export default ColorPalette;
