export const timeStringToNumber = (time: string) => {
  const [hour, minute, second] = time.split(':');
  const numHour = +hour * 60 * 60;
  const numMinute = +minute * 60;
  const numSecond = +second;
  return numHour + numMinute + numSecond;
};

export const timeNumberToString = (time: number) => {
  const second = time % 60;
  const minute = Math.floor((time / 60) % 60);
  const hour = Math.floor(time / (60 * 60));
  return `${formatNum(hour)}:${formatNum(minute)}:${formatNum(second)}`;
};

const formatNum = (num: number) => (num > 9 ? num : `0${num}`);
