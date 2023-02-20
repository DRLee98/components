const formatValue = (v: number) => Math.round(Math.ceil(v * 10) / 10);

const getMinMax = (type: "min" | "max", white: number, black: number) => {
  if (white + black > 100) {
    return (255 / (white + black)) * white;
  }
  if (type === "min") return 0 + (white > 0 ? 255 * (white / 100) : 0);
  return 255 - (black > 0 ? 255 * (black / 100) : 0);
};

export function hwbaToRgba(hwba: string) {
  const [h, w, b, a] = hwba
    .replace("hwb(", "")
    .replace(")", "")
    .replace("/", "")
    .split(/\s+/);

  const hue = +h.replace("deg", "");
  const white = +w.replace("%", "");
  const black = +b.replace("%", "");
  const opacity = +a.replace("%", "");

  const min = getMinMax("min", white, black);
  const max = getMinMax("max", white, black);
  const step = (max - min) / 60;

  const value = (hue % 60) * step;
  const dividedValue = Math.floor(hue / 60) % 6;

  const red =
    dividedValue === 0 || dividedValue === 5
      ? max
      : dividedValue === 4
      ? min + value
      : dividedValue === 1
      ? max - value
      : min;
  const green =
    dividedValue === 1 || dividedValue === 2
      ? max
      : dividedValue === 0
      ? min + value
      : dividedValue === 3
      ? max - value
      : min;
  const blue =
    dividedValue === 3 || dividedValue === 4
      ? max
      : dividedValue === 2
      ? min + value
      : dividedValue === 5
      ? max - value
      : min;

  return `rgba(${formatValue(red)}, ${formatValue(green)}, ${formatValue(
    blue
  )}, ${opacity / 100})`;
}

const formatHexCode = (string: string) => {
  const value = (+string).toString(16);
  return value.length < 2 ? `0${value}` : value;
};

export function hwbaToHex(hwba: string) {
  const [r, g, b, a] = hwbaToRgba(hwba)
    .replace("rgba(", "")
    .replace(")", "")
    .split(",");

  const numA = +a;

  return `#${formatHexCode(r)}${formatHexCode(g)}${formatHexCode(b)}${
    numA < 1 ? formatHexCode(`${numA > 0 ? 255 * numA : 0}`) : ""
  }`;
}
