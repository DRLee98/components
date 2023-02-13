import { arc as Arclayout, PieArcDatum, Arc } from "d3-shape";
import { interpolate } from "d3-interpolate";

export const getArcLayout = (radius: number) =>
  Arclayout<PieArcDatum<number | { valueOf(): number }>>()
    .innerRadius(0)
    .outerRadius(radius);

export const getArcTween =
  (
    arc_layout: Arc<any, PieArcDatum<number | { valueOf(): number }>>,
    _current: PieArcDatum<number> | number
  ) =>
  (b: PieArcDatum<number>) => {
    let i = interpolate(_current, b);
    _current = i(0);
    return (t: number) => {
      return arc_layout(i(t)) ?? "";
    };
  };
