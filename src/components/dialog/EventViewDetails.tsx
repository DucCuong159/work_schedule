import type { CalendarEvent } from "../../types/event";
import { formatTimeRange } from "../../utils/date";

interface EventViewDetailsProps {
  event: CalendarEvent;
}

const EventViewDetails = ({ event }: Readonly<EventViewDetailsProps>) => {
  return (
    <div className="p-6 flex-1 overflow-y-auto overflow-x-hidden space-y-4">
      <div>
        <span className="block text-xs text-gray-500 font-medium">Title</span>
        <p className="text-gray-800 font-semibold wrap-anywhere mt-0.5 text-base">
          {event.title}
        </p>
      </div>
      <div>
        <span className="block text-xs text-gray-500 font-medium">Time</span>
        <p className="text-gray-700 mt-0.5 text-sm">
          {formatTimeRange(event.startTime, event.endTime)}
        </p>
      </div>
      {event.description && (
        <div>
          <span className="block text-xs text-gray-500 font-medium">
            Description
          </span>
          <p className="text-gray-700 whitespace-pre-wrap wrap-anywhere mt-0.5 text-sm">
            {event.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventViewDetails;
