import { useMemo, useRef } from "react";
import useDragToCreate from "../../hooks/useDragToCreate";
import useEventDropTarget from "../../hooks/useEventDropTarget";
import type { CalendarEvent } from "../../types/event";
import { HOURS_IN_DAY, MINUTE_HEIGHT } from "../../types/event";
import type { EventDaySegment } from "../../utils/date";
import {
  getEventDaySegment,
  getMinutesFromMidnight,
  isSameDay,
} from "../../utils/date";
import EventBlock from "./EventBlock";

const HOURS = Array.from({ length: HOURS_IN_DAY }, (_, hour) => hour);

const HourGridLines = () => (
  <>
    {HOURS.map((hour) => (
      <div
        key={hour}
        className="absolute w-full border-b border-gray-100"
        style={{ top: `${hour * 60}px`, height: "60px" }}
      />
    ))}
  </>
);

const CurrentTimeIndicator = ({ minutes }: Readonly<{ minutes: number }>) => (
  <div
    className="absolute left-0 right-0 z-30 pointer-events-none -translate-y-1/2"
    style={{ top: `${minutes * MINUTE_HEIGHT}px` }}
  >
    <div className="flex items-center">
      <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5 shrink-0" />
      <div className="flex-1 h-0.5 bg-red-500" />
    </div>
  </div>
);

const DragSelectionPreview = ({
  selection,
}: Readonly<{ selection: { startMin: number; endMin: number } }>) => (
  <div
    className="absolute left-0 right-0 bg-blue-200/50 border border-blue-400 rounded z-20 pointer-events-none"
    style={{
      top: `${selection.startMin * MINUTE_HEIGHT}px`,
      height: `${(selection.endMin - selection.startMin) * MINUTE_HEIGHT}px`,
    }}
  />
);

interface DayColumnProps {
  day: Date;
  now: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventContextMenu: (e: React.MouseEvent, event: CalendarEvent) => void;
  onCreateEvent: (start: Date, end: Date) => void;
  onDropEvent: (eventId: string, newDay: Date, minuteOffset: number) => void;
}

const DayColumn = ({
  day,
  now,
  events,
  onEventClick,
  onEventContextMenu,
  onCreateEvent,
  onDropEvent,
}: Readonly<DayColumnProps>) => {
  const colRef = useRef<HTMLDivElement>(null);

  const { dayEvents, daySegments } = useMemo(() => {
    const eventsList: CalendarEvent[] = [];
    const segmentsList: Array<{
      event: CalendarEvent;
      segment: EventDaySegment;
    }> = [];

    for (const event of events) {
      const segment = getEventDaySegment(event.startTime, event.endTime, day);
      if (segment) {
        eventsList.push(event);
        segmentsList.push({ event, segment });
      }
    }

    return { dayEvents: eventsList, daySegments: segmentsList };
  }, [events, day]);

  const { dragSelection } = useDragToCreate({
    colRef,
    day,
    dayEvents,
    onCreateEvent,
  });

  const { handleDragOver, handleDrop } = useEventDropTarget({
    colRef,
    day,
    onDropEvent,
  });

  const isToday = isSameDay(day, now);
  const currentMinutes = getMinutesFromMidnight(now);

  return (
    <div
      ref={colRef}
      className="flex-1 min-w-25 border-r border-gray-200 last:border-r-0 relative h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <HourGridLines />

      {isToday && <CurrentTimeIndicator minutes={currentMinutes} />}

      {dragSelection && <DragSelectionPreview selection={dragSelection} />}

      {daySegments.map(({ event, segment }) => (
        <EventBlock
          key={event.id}
          event={event}
          startMinutes={segment.startMinutes}
          durationMinutes={segment.durationMinutes}
          continuesFromPrev={segment.continuesFromPrev}
          continuesToNext={segment.continuesToNext}
          onClick={onEventClick}
          onContextMenu={onEventContextMenu}
        />
      ))}
    </div>
  );
};

export default DayColumn;
