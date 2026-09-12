import { forwardRef } from "react";
import DayHeaderCell from "./DayHeaderCell";

interface CalendarHeaderProps {
  days: Date[];
  now: Date;
  scrollbarWidth?: number;
}

const getGmtOffsetString = (date: Date): string => {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMinutes);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  return `GMT${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ days, now, scrollbarWidth = 0 }, ref) => {
    const gmtLabel = getGmtOffsetString(now);

    return (
      <div className="flex border-b border-gray-200 bg-white shrink-0">
        <div ref={ref} className="flex flex-1 overflow-x-hidden">
          <div className="w-16 shrink-0 border-r border-gray-200 flex items-end justify-center pb-2 text-[10px] text-gray-400 font-medium select-none">
            {gmtLabel}
          </div>
          <div className="flex flex-1 min-w-175">
            {days.map((d) => (
              <DayHeaderCell key={d.toISOString()} day={d} now={now} />
            ))}
          </div>
        </div>
        {scrollbarWidth > 0 && (
          <div
            style={{ width: scrollbarWidth }}
            className="shrink-0 bg-white"
          />
        )}
      </div>
    );
  },
);

CalendarHeader.displayName = "CalendarHeader";

export default CalendarHeader;
