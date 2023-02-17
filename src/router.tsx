import React, { ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "components/Layout";

import HeatMapPage from "pages/HeatMapPage";
import TimeLinePage from "pages/TimeLinePage";
import CalendarHeatMapPage from "pages/CalendarHeatMapPage";
import BubblePieChartPage from "pages/BubblePieChartPage";
import DatePickerPage from "pages/DatePickerPage";
import ViolinPlotPage from "pages/ViolinPlotPage";
import BoxPlotPage from "pages/BoxPlotPage";
import ColorPalettePage from "pages/ColorPalettePage";

interface IRoute {
  path: string;
  element: ReactElement;
}

export const routes: IRoute[] = [
  { path: "/", element: <div /> },
  { path: "/date-picker", element: <DatePickerPage /> },
  { path: "/bubble-pie-chart", element: <BubblePieChartPage /> },
  { path: "/violin-plot", element: <ViolinPlotPage /> },
  { path: "/box-plot", element: <BoxPlotPage /> },
  { path: "/heat-map", element: <HeatMapPage /> },
  { path: "/calendar-heat-map", element: <CalendarHeatMapPage /> },
  { path: "/time-line", element: <TimeLinePage /> },
  { path: "/color-palette", element: <ColorPalettePage /> },
];

function Router() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {routes.map((route) => (
            <Route
              key={`route_${route.path}`}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default Router;
