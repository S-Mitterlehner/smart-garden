export const getTimeString = (date: Date | undefined) => {
  if (date) {
    date = new Date(date);
    const format = (t: number) => `00${t}`.slice(-2);

    return `${format(date.getHours())}:${format(date.getMinutes())}:${format(date.getSeconds())}`;
  } else {
    return "not available";
  }
};
