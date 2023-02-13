import { IColor } from ".";

export const getDayCount = (startDate: Date, endDate: Date) => {
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();

  return (endTime - startTime) / (1000 * 60 * 60 * 24) + 1;
};

export const getYMD = (date: Date) => {
  const newDate = new Date(date);
  return {
    year: newDate.getFullYear(),
    month: newDate.getMonth(),
    date: newDate.getDate(),
  };
};

export const getDateText = (date: Date) => {
  const newDate = new Date(date);
  const offset = newDate.getTimezoneOffset() * 60000;
  const dateOffset = new Date(newDate.getTime() - offset);
  return dateOffset.toISOString().split("T")[0] as unknown as Date;
};

export const getDateRange = (
  endYear: number,
  endMonth: number,
  diffMonth: number
) => {
  const startDate = getDateText(
    new Date(endYear, endMonth - diffMonth, 1)
  ) as unknown as Date;
  const endDate = getDateText(
    new Date(endYear, endMonth + 1, 0)
  ) as unknown as Date;
  return { startDate, endDate };
};

export const getMonthList = (startDate: Date, endDate: Date) => {
  const list = [];

  const { month: startMonth } = getYMD(startDate);
  const { month: endMonth } = getYMD(endDate);

  let month = startMonth;
  const condition = true;
  while (condition) {
    list.push(month + 1);
    if (month === endMonth) {
      break;
    }
    if (month === 11) {
      month = 0;
    } else {
      month += 1;
    }
  }
  return list;
};

export const getKORDateString = (target: Date) => {
  const { year, month, date } = getYMD(target);
  return `${year}년 ${month + 1}월 ${date}일`;
};

export const getColor = (
  colors: IColor[],
  value: number,
  defaultColor: string
) => {
  const sortArray = colors.sort((a, b) => b.value - a.value);
  let color = defaultColor;
  for (let i = 0; i < sortArray.length; i = +1) {
    if (value > sortArray[i].value) {
      const targetColor = sortArray[i].color;
      color = targetColor;
      break;
    }
  }
  return color;
};
