import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Hue from "./Hue";
import PaletteSlider, { EType } from "./PaletteSlider";
import FlexBox from "components/FlexBox";

interface IColorPalette {
  onChange: (color: string) => void;
}

function ColorPalette({ onChange }: IColorPalette) {
  const [color, setColor] = useState<string | null>(null);
  const [blackSlider, setBlackSlider] = useState(100);
  const [opacitySlider, setOpacitySlider] = useState(100);

  const onChangeColor = (value: string) => {
    setColor(value);
  };

  const onChangeBlackSlider = (value: number, complete: boolean) => {
    setBlackSlider(value);
    if (color && complete)
      onChange(`${color} ${100 - value}% / ${opacitySlider}%)`);
  };

  const onChangeOpacitySlider = (value: number, complete: boolean) => {
    setOpacitySlider(value);
    if (color && complete)
      onChange(`${color} ${100 - blackSlider}% / ${value}%)`);
  };

  useEffect(() => {
    if (color) onChange(`${color} ${100 - blackSlider}% / ${opacitySlider}%)`);
  }, [color]);

  return (
    <Container>
      <Hue onChangeColor={onChangeColor} />
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

export default ColorPalette;
