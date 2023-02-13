import React from "react";
import { ThemeProvider } from "styled-components";
import { createGlobalStyle, DefaultTheme } from "styled-components";
import reset from "styled-reset";

const theme: DefaultTheme = {
  fontColor: "#2e2e2e",
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    *{
      box-sizing: border-box;
    }
    body {
        font-family: 'Josefin Sans', sans-serif;
    }
    button, input, a{
        all: unset;
        cursor: pointer;
    }
`;

interface IStyleProvider {
  children: React.ReactNode;
}

function StyleProvider({ children }: IStyleProvider) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}

export default StyleProvider;
