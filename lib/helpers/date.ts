import { addHours } from "date-fns";

export const getPHTodayUTC = () => addHours(new Date(), 8);

export const getPHTodayString = () => new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().split("T")[0];

export const getPHDateRange = (date: string) => {
  const nextDay = new Date(`${date}T08:00:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().split("T")[0];

  return {
    gte: new Date(`${date}T08:00:00`),
    lte: new Date(`${nextDayStr}T07:59:59`),
  };
};