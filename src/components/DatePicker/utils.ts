export function getToday() {
  const newDate = new Date();
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const date = newDate.getDate();
  return { year, month, date };
}

export const formatNum = (num: number) => (num < 10 ? `0${num}` : num);
