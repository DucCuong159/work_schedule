import { HOURS_IN_DAY } from "../../types/event";

const HOURS = Array.from({ length: HOURS_IN_DAY }, (_, hour) => hour);

const TimeColumn = () => {
  return (
    <div className="w-16 shrink-0 border-r border-gray-200 relative bg-white select-none">
      {HOURS.map((hour) => (
        <div key={hour} className="h-15 relative">
          {hour > 0 && (
            <span className="absolute top-0 -translate-y-1/2 right-2 text-xs font-medium text-gray-600 leading-none pointer-events-none bg-white px-0.5 z-10">
              {String(hour).padStart(2, "0")}:00
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
