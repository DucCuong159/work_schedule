import { useCallback, useEffect, useState } from "react";
import type { CalendarEvent, EventFormData } from "../types/event";
import { MAX_DAY_END_MINUTES, SNAP_INTERVAL_MINUTES } from "../types/event";
import {
  MS_PER_MINUTE,
  dateFromMinutes,
  getDurationInMinutes,
  hasTimeOverlap,
} from "../utils/date";
import { getInitialMockEvents } from "../utils/mockEvents";

const STORAGE_KEY = "work_schedule_events";

const loadStoredEvents = (): CalendarEvent[] => {
  const requestDate = new Date();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return getInitialMockEvents(requestDate);

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((item: CalendarEvent) => ({
          ...item,
          startTime: new Date(item.startTime),
          endTime: new Date(item.endTime),
        }))
      : getInitialMockEvents(requestDate);
  } catch {
    return getInitialMockEvents(requestDate);
  }
};

const hasConflictWithEvents = (
  events: CalendarEvent[],
  start: Date,
  end: Date,
  excludeId?: string,
): boolean => {
  return events.some(
    (other) =>
      other.id !== excludeId &&
      hasTimeOverlap(start, end, other.startTime, other.endTime),
  );
};

const validateEventInput = (
  data: EventFormData,
  events: CalendarEvent[],
  notify: (msg: string) => void,
  excludeId?: string,
): { valid: boolean; start?: Date; end?: Date } => {
  if (!data.title.trim()) {
    notify("Please enter an event title.");
    return { valid: false };
  }

  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    notify("Please select both start and end times.");
    return { valid: false };
  }

  if (end.getTime() <= start.getTime()) {
    notify("End time must be after start time.");
    return { valid: false };
  }

  if (hasConflictWithEvents(events, start, end, excludeId)) {
    notify("Cannot save event: time conflicts with an existing event.");
    return { valid: false };
  }

  return { valid: true, start, end };
};

const useCalendarEvents = (onNotify?: (message: string) => void) => {
  const [events, setEvents] = useState<CalendarEvent[]>(loadStoredEvents);

  const notify = useCallback(
    (msg: string) => {
      if (onNotify) onNotify(msg);
      else alert(msg);
    },
    [onNotify],
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error("Failed to save events to localStorage:", error);
      notify("Failed to save changes: local storage is full or disabled.");
    }
  }, [events, notify]);

  const addEvent = useCallback(
    (data: EventFormData): boolean => {
      const { valid, start, end } = validateEventInput(data, events, notify);
      if (!valid || !start || !end) return false;

      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        title: data.title.trim(),
        description: data.description.trim(),
        startTime: start,
        endTime: end,
      };
      setEvents((prev) => [...prev, newEvent]);
      return true;
    },
    [events, notify],
  );

  const updateEvent = useCallback(
    (id: string, data: EventFormData): boolean => {
      if (!events.some((ev) => ev.id === id)) return false;

      const { valid, start, end } = validateEventInput(
        data,
        events,
        notify,
        id,
      );
      if (!valid || !start || !end) return false;

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === id
            ? {
                ...ev,
                title: data.title.trim(),
                description: data.description.trim(),
                startTime: start,
                endTime: end,
              }
            : ev,
        ),
      );
      return true;
    },
    [events, notify],
  );

  const moveEvent = useCallback(
    (eventId: string, newDay: Date, minuteOffset: number): boolean => {
      const ev = events.find((e) => e.id === eventId);
      if (!ev) return false;

      const durationMinutes = getDurationInMinutes(ev.startTime, ev.endTime);
      const safeStartMinutes = Math.max(
        0,
        Math.min(minuteOffset, MAX_DAY_END_MINUTES - SNAP_INTERVAL_MINUTES),
      );
      const newStart = dateFromMinutes(newDay, safeStartMinutes);
      const newEnd = new Date(
        newStart.getTime() + durationMinutes * MS_PER_MINUTE,
      );

      if (hasConflictWithEvents(events, newStart, newEnd, eventId)) {
        notify("Cannot move event: time conflicts with an existing event.");
        return false;
      }

      setEvents((prev) =>
        prev.map((item) =>
          item.id === eventId
            ? { ...item, startTime: newStart, endTime: newEnd }
            : item,
        ),
      );
      return true;
    },
    [events, notify],
  );

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  }, []);

  return {
    events,
    addEvent,
    updateEvent,
    moveEvent,
    deleteEvent,
  };
};

export default useCalendarEvents;
