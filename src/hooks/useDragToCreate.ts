import { useCallback, useEffect, useState } from "react";
import type { CalendarEvent } from "../types/event";
import {
  MAX_DAY_END_MINUTES,
  MINUTE_HEIGHT,
  SNAP_INTERVAL_MINUTES,
} from "../types/event";
import { dateFromMinutes, hasTimeOverlap, snapToInterval } from "../utils/date";

interface UseDragToCreateProps {
  colRef: React.RefObject<HTMLDivElement | null>;
  day: Date;
  dayEvents: CalendarEvent[];
  onCreateEvent: (start: Date, end: Date) => void;
}

const useDragToCreate = ({
  colRef,
  day,
  dayEvents,
  onCreateEvent,
}: UseDragToCreateProps) => {
  const [dragSelection, setDragSelection] = useState<{
    startMin: number;
    endMin: number;
  } | null>(null);

  const getMinutesFromPointer = useCallback(
    (clientY: number): number => {
      if (!colRef.current) return 0;
      const rect = colRef.current.getBoundingClientRect();
      const minutes = Math.max(
        0,
        Math.min((clientY - rect.top) / MINUTE_HEIGHT, MAX_DAY_END_MINUTES),
      );
      return Math.min(snapToInterval(minutes), MAX_DAY_END_MINUTES);
    },
    [colRef],
  );

  useEffect(() => {
    const colEl = colRef.current;
    if (!colEl) return;

    let cleanupDrag: (() => void) | null = null;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('[draggable="true"]') || target.closest("button"))
        return;

      const min = getMinutesFromPointer(e.clientY);
      const hourStart = Math.min(
        Math.floor(min / 60) * 60,
        MAX_DAY_END_MINUTES - SNAP_INTERVAL_MINUTES,
      );

      let sel = {
        startMin: hourStart,
        endMin: Math.min(hourStart + 60, MAX_DAY_END_MINUTES),
      };
      setDragSelection(sel);

      const onMouseMove = (moveEvent: MouseEvent) => {
        const currentMin = getMinutesFromPointer(moveEvent.clientY);
        const start = Math.min(hourStart, currentMin);
        const end = Math.max(hourStart, currentMin);
        sel = {
          startMin: start,
          endMin: Math.min(
            MAX_DAY_END_MINUTES,
            Math.max(end, start + SNAP_INTERVAL_MINUTES),
          ),
        };
        setDragSelection(sel);
      };

      const removeDragListeners = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        cleanupDrag = null;
      };

      const onMouseUp = () => {
        removeDragListeners();

        if (sel.endMin - sel.startMin >= SNAP_INTERVAL_MINUTES) {
          const start = dateFromMinutes(day, sel.startMin);
          const end = dateFromMinutes(day, sel.endMin);

          const hasConflict = dayEvents.some((ev) =>
            hasTimeOverlap(start, end, ev.startTime, ev.endTime),
          );

          if (!hasConflict) {
            onCreateEvent(start, end);
          }
        }
        setDragSelection(null);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      cleanupDrag = removeDragListeners;
    };

    colEl.addEventListener("mousedown", onMouseDown);
    return () => {
      colEl.removeEventListener("mousedown", onMouseDown);
      cleanupDrag?.();
    };
  }, [day, dayEvents, getMinutesFromPointer, onCreateEvent, colRef]);

  return { dragSelection };
};

export default useDragToCreate;
