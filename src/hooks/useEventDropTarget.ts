import { useCallback } from "react";
import {
  MAX_DAY_END_MINUTES,
  MINUTE_HEIGHT,
  SNAP_INTERVAL_MINUTES,
} from "../types/event";
import { snapToInterval } from "../utils/date";

interface UseEventDropTargetProps {
  colRef: React.RefObject<HTMLDivElement | null>;
  day: Date;
  onDropEvent: (eventId: string, newDay: Date, minuteOffset: number) => void;
}

const useEventDropTarget = ({
  colRef,
  day,
  onDropEvent,
}: UseEventDropTargetProps) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const rawData = e.dataTransfer.getData("text/plain");
      if (!rawData) return;

      let eventId = rawData;
      let grabOffsetY = 0;

      try {
        const parsed = JSON.parse(rawData);
        if (parsed?.id) {
          eventId = parsed.id;
          grabOffsetY = Number(parsed.grabOffsetY) || 0;
        }
      } catch {
        eventId = rawData;
      }

      if (!colRef.current) return;
      const rect = colRef.current.getBoundingClientRect();
      const rawTargetMinutes =
        (e.clientY - rect.top - grabOffsetY) / MINUTE_HEIGHT;
      const clampedMinutes = Math.max(
        0,
        Math.min(rawTargetMinutes, MAX_DAY_END_MINUTES - SNAP_INTERVAL_MINUTES),
      );
      const minuteOffset = snapToInterval(clampedMinutes);

      onDropEvent(eventId, day, minuteOffset);
    },
    [colRef, day, onDropEvent],
  );

  return { handleDragOver, handleDrop };
};

export default useEventDropTarget;
