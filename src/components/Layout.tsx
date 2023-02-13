import React from "react";
import styled from "styled-components";
import Nav from "./Nav";

interface ILayout {
  children: React.ReactNode;
}

function Layout({ children }: ILayout) {
  return (
    <LayoutContainer>
      <Nav />
      {children}
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;

  height: 100vh;
`;

export default Layout;
