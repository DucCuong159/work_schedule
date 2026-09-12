import { DAYS_IN_WEEK, SNAP_INTERVAL_MINUTES } from "../types/event";

export const snapToInterval = (
  minutes: number,
  interval: number = SNAP_INTERVAL_MINUTES,
): number => {
  return Math.round(minutes / interval) * interval;
};

export const INITIAL_NOW = new Date();
export const MS_PER_MINUTE = 60 * 1000;
export const MS_PER_DAY = 24 * 60 * MS_PER_MINUTE;

export const getStartOfDay = (date: Date): Date => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate;
};

export const getSevenDays = (startDate: Date = INITIAL_NOW): Date[] => {
  const startOfDay = getStartOfDay(startDate);
  return Array.from({ length: DAYS_IN_WEEK }, (_, dayOffset) => {
    const currentDay = new Date(startOfDay);
    currentDay.setDate(currentDay.getDate() + dayOffset);
    return currentDay;
  });
};

export const formatDayHeader = (
  date: Date,
): {
  dayName: string;
  dayNumber: number;
} => {
  const dayName = date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const dayNumber = date.getDate();
  return { dayName, dayNumber };
};

const formatTime = (date: Date): string => {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

const formatEndTime = (start: Date, end: Date): string => {
  const nextDayMidnight = new Date(start);
  nextDayMidnight.setDate(nextDayMidnight.getDate() + 1);
  nextDayMidnight.setHours(0, 0, 0, 0);

  if (end.getTime() === nextDayMidnight.getTime()) {
    return "24:00";
  }

  const formatted = formatTime(end);
  if (isSameDay(start, end)) {
    return formatted;
  }

  const dayDiff = Math.round(
    (getStartOfDay(end).getTime() - getStartOfDay(start).getTime()) /
      MS_PER_DAY,
  );

  return dayDiff > 0 ? `${formatted} (+${dayDiff})` : formatted;
};

export const formatTimeRange = (start: Date, end: Date): string => {
  return `${formatTime(start)} – ${formatEndTime(start, end)}`;
};

export const isSameDay = (firstDate: Date, secondDate: Date): boolean => {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
};

export const getMinutesFromMidnight = (date: Date): number => {
  return date.getHours() * 60 + date.getMinutes();
};

export const dateFromMinutes = (baseDay: Date, minutes: number): Date => {
  const d = getStartOfDay(baseDay);
  d.setMinutes(minutes);
  return d;
};

export const toLocalDateTimeString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
};

export const getDurationInMinutes = (start: Date, end: Date): number => {
  return Math.round((end.getTime() - start.getTime()) / MS_PER_MINUTE);
};

export const hasTimeOverlap = (
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean => {
  return startA.getTime() < endB.getTime() && endA.getTime() > startB.getTime();
};
