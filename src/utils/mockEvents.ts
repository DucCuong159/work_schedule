import type { CalendarEvent } from "../types/event";
import { dateFromMinutes, getSevenDays } from "./date";

export const getInitialMockEvents = (
  referenceDate: Date = new Date(),
): CalendarEvent[] => {
  const days = getSevenDays(referenceDate);
  if (days.length < 3) return [];

  const day0 = days[0];
  const day1 = days[1];
  const day2 = days[2];

  return [
    {
      id: "mock-1",
      title: "Team Daily Standup",
      description: "Quick daily sync on project progress and potential blockers.",
      startTime: dateFromMinutes(day0, 9 * 60),
      endTime: dateFromMinutes(day0, 10 * 60),
    },
    {
      id: "mock-2",
      title: "Sprint Planning & Backlog",
      description: "Review backlog items and prioritize tasks for the current sprint.",
      startTime: dateFromMinutes(day0, 14 * 60),
      endTime: dateFromMinutes(day0, 15 * 60 + 30),
    },
    {
      id: "mock-3",
      title: "Code Review & Refactoring",
      description: "Pair programming session on calendar component optimization.",
      startTime: dateFromMinutes(day1, 10 * 60 + 30),
      endTime: dateFromMinutes(day1, 12 * 60),
    },
    {
      id: "mock-4",
      title: "Design System Workshop",
      description: "Align on Tailwind CSS tokens and accessible component design.",
      startTime: dateFromMinutes(day2, 15 * 60),
      endTime: dateFromMinutes(day2, 16 * 60 + 30),
    },
    {
      id: "mock-5",
      title: "Late Night Release & Deployment",
      description: "Production release window and post-deployment sanity checks.",
      startTime: dateFromMinutes(day1, 23 * 60),
      endTime: dateFromMinutes(day2, 1 * 60),
    },
  ];
};
