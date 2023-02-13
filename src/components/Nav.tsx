import React, { memo } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "router";
import styled from "styled-components";

interface INavItem {
  path: string;
  text: string;
}

function Nav() {
  const [underBarPosition, setUnderBarPosition] = useState({
    left: 0,
    width: 0,
  });

  const navItems: INavItem[] = routes.map(({ path }) => ({
    path,
    text:
      path === "/"
        ? "Home"
        : path.slice(1, 2).toUpperCase() + path.slice(2).replaceAll("-", " "),
  }));

  const onClickNav = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      currentTarget: { offsetLeft, offsetWidth },
    } = e;
    console.log(e);
    setUnderBarPosition({ left: offsetLeft, width: offsetWidth });
  };

  return (
    <NavContainer>
      {navItems.map((item) => (
        <NavItem key={`nav_${item.path}`} onClick={onClickNav}>
          <Link to={item.path}>{item.text}</Link>
        </NavItem>
      ))}
      <UnderBar {...underBarPosition} />
    </NavContainer>
  );
}

const NavContainer = styled.nav`
  position: relative;

  display: flex;
  padding: 10px 20px;
`;

const NavItem = styled.div`
  text-transform: capitalize;

  & + & {
    margin-left: 15px;
  }
`;

interface IUnderBar {
  width: number;
  left: number;
}

const UnderBar = styled.div<IUnderBar>`
  position: absolute;
  bottom: 0;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width}px;
  height: 2px;

  background-color: #2e2e2e;
  transition: all 0.3s ease;
`;

export default memo(Nav);
