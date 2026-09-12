import { formatDayHeader, isSameDay } from "../../utils/date";

interface DayHeaderCellProps {
  day: Date;
  now: Date;
}

const DayHeaderCell = ({ day, now }: Readonly<DayHeaderCellProps>) => {
  const { dayName, dayNumber } = formatDayHeader(day);
  const today = isSameDay(day, now);

  return (
    <div className="flex-1 min-w-25 text-center py-2 border-r border-gray-200 last:border-r-0">
      <span
        className={`text-xs font-medium ${today ? "text-blue-600" : "text-gray-500"}`}
      >
        {dayName}
      </span>
      <div
        className={`text-2xl font-medium mt-0.5 leading-tight ${today ? "bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto" : "text-gray-800"}`}
      >
        {dayNumber}
      </div>
    </div>
  );
};

export default DayHeaderCell;
