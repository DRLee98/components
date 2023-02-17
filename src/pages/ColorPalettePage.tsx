import React, { useState } from "react";
import styled from "styled-components";
import ColorPalette from "components/ColorPalette";
import transparentBg from "components/ColorPalette/assets/transparent.png";
import FlexBox from "components/FlexBox";

interface IColorList {
  [key: string]: string;
}

function ColorPalettePage() {
  const [colorList, setColorList] = useState<IColorList>({});
  const [selectedKey, setSelectedKey] = useState("");

  const addColor = () => {
    const key = new Date().getTime() + "-color";
    setColorList((prev) => ({ ...prev, [key]: "hwb(0deg 100% 0%)" }));
  };

  const onChangePalette = (color: string) => {
    setColorList((prev) => ({
      ...prev,
      [selectedKey]: color,
    }));
  };
  return (
    <FlexBox height="100%" direction="column" gap={20}>
      <ColorBlockList>
        {Object.entries(colorList).map(([key, color]) => (
          <ColorBlock
            key={`color_block_${key}`}
            color={color}
            image={transparentBg}
            selected={selectedKey === key}
            onClick={() => setSelectedKey(key)}
          />
        ))}
        <AddButton onClick={addColor}>+</AddButton>
      </ColorBlockList>
      <ColorPalette onChange={onChangePalette} />
    </FlexBox>
  );
}

const ColorBlockList = styled(FlexBox).attrs({
  as: "ul",
  width: "100%",
  justifyContent: "flex-start",
  gap: 5,
})`
  flex-wrap: wrap;
  max-width: 200px;
`;

interface IColorBlock {
  image: string;
  selected: boolean;
}

const ColorBlock = styled.li<IColorBlock>`
  position: relative;

  width: 30px;
  height: 30px;

  border-radius: 8px;
  border: 2px solid ${({ selected }) => (!selected ? "#e1e5e9" : "#475F7B")};
  background: url(${({ image }) => image});

  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    background-color: ${({ color }) => color};
  }

  overflow: hidden;
  cursor: pointer;
`;

const AddButton = styled(FlexBox).attrs({ as: "button" })`
  width: 30px;
  height: 30px;

  border-radius: 8px;
  background-color: #e1e5e9;

  color: #666666;
  font-size: 20px;
  font-weight: bolder;

  &:hover {
    background-color: #ebf0f6;
  }
`;

export default ColorPalettePage;
