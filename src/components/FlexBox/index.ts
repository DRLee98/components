import styled from "styled-components";
import cursor from "app/pages/App/asset/cursor.svg";

interface IFlexBox {
  direction?: "row" | "column";
  alignItems?: "flex-start" | "flex-end" | "stretch" | "baseline";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  gap?: number;
}

const FlexBox = styled.div<IFlexBox>`
  display: flex;
  flex-direction: ${(props) => (props.direction ? props.direction : "row")};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "center")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "center"};
  gap: ${(props) => (props.gap ? props.gap : 0)}px;

  cursor: ${(props) => (props.onClick ? "pointer" : `${cursor}, auto`)};
`;

export default FlexBox;
