import type { CalendarEvent } from "../../types/event";
import { MAX_DAY_END_MINUTES, MINUTE_HEIGHT } from "../../types/event";
import { formatTimeRange } from "../../utils/date";

interface EventBlockProps {
  event: CalendarEvent;
  startMinutes: number;
  durationMinutes: number;
  continuesFromPrev?: boolean;
  continuesToNext?: boolean;
  onClick: (event: CalendarEvent) => void;
  onContextMenu: (e: React.MouseEvent, event: CalendarEvent) => void;
}

const getRoundedClass = (
  continuesFromPrev: boolean,
  continuesToNext: boolean,
): string => {
  if (continuesFromPrev && continuesToNext) return "rounded-none";
  if (continuesFromPrev) return "rounded-b rounded-t-none";
  if (continuesToNext) return "rounded-t rounded-b-none";
  return "rounded";
};

const EventBlock = ({
  event,
  startMinutes,
  durationMinutes,
  continuesFromPrev = false,
  continuesToNext = false,
  onClick,
  onContextMenu,
}: Readonly<EventBlockProps>) => {
  const top = startMinutes * MINUTE_HEIGHT;
  const height = Math.min(
    Math.max(durationMinutes * MINUTE_HEIGHT, 20),
    MAX_DAY_END_MINUTES - top,
  );
  const timeRange = formatTimeRange(event.startTime, event.endTime);
  const roundedClass = getRoundedClass(continuesFromPrev, continuesToNext);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, event);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
      e.preventDefault();
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(rect.left + Math.min(rect.width / 2, 60));
      const y = Math.round(rect.top + Math.min(rect.height / 2, 20));
      onContextMenu({ clientX: x, clientY: y } as React.MouseEvent, event);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const grabOffsetY = e.clientY - rect.top;
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ id: event.id, grabOffsetY }),
    );
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <button
      type="button"
      draggable
      aria-haspopup="menu"
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      className={`absolute left-0 right-0 ${roundedClass} px-2 py-1 cursor-pointer bg-amber-300 hover:bg-amber-400 border-l-4 border-amber-500 text-xs text-left overflow-hidden shadow-sm transition-colors select-none z-10 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:z-20`}
      style={{ top: `${top}px`, height: `${height}px` }}
      title={`${event.title}\n${timeRange}`}
      aria-label={`${event.title}, ${timeRange}`}
    >
      <span className="font-semibold text-gray-800 truncate leading-tight block">
        {event.title}
      </span>
      <span className="text-gray-600 leading-tight block">{timeRange}</span>
    </button>
  );
};

export default EventBlock;
