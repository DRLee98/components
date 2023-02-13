import React from "react";
import Router from "./router";
import StyleProvider from "./styled";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <StyleProvider>
        <Router />
      </StyleProvider>
    </DndProvider>
  );
}

export default App;
