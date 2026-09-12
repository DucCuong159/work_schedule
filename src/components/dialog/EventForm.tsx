import { useEffect, useRef, useState } from "react";
import {
  type CalendarEvent,
  type DialogMode,
  type EventFormData,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
} from "../../types/event";
import { toLocalDateTimeString } from "../../utils/date";

interface EventFormProps {
  mode: DialogMode;
  event: CalendarEvent | null;
  prefill?: { startTime: Date; endTime: Date };
  onClose: () => void;
  onSave: (data: EventFormData) => void;
}

const EventForm = ({
  mode,
  event,
  prefill,
  onClose,
  onSave,
}: Readonly<EventFormProps>) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");

  useEffect(() => {
    const timer = setTimeout(() => titleRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      titleRef.current?.focus();
    }

    const formData = new FormData(e.currentTarget);
    onSave({
      title: title.trim(),
      description: description.trim(),
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
    });
  };

  const initialTime = event ?? prefill;
  const defaultStart = initialTime
    ? toLocalDateTimeString(initialTime.startTime)
    : "";
  const defaultEnd = initialTime
    ? toLocalDateTimeString(initialTime.endTime)
    : "";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="p-6 flex-1 overflow-y-auto overflow-x-hidden space-y-2.5"
    >
      <div>
        <label
          htmlFor="event-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title *
        </label>
        <input
          ref={titleRef}
          id="event-title"
          name="title"
          type="text"
          maxLength={MAX_TITLE_LENGTH}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <div className="flex justify-end mt-0.5">
          <span className="text-[11px] text-gray-400 leading-tight">
            {title.length}/{MAX_TITLE_LENGTH}
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="event-desc"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="event-desc"
          name="description"
          rows={3}
          maxLength={MAX_DESCRIPTION_LENGTH}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
        <div className="flex justify-end mt-0.5">
          <span className="text-[11px] text-gray-400 leading-tight">
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="event-start"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start *
          </label>
          <input
            id="event-start"
            name="startTime"
            type="datetime-local"
            defaultValue={defaultStart}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="event-end"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End *
          </label>
          <input
            id="event-end"
            name="endTime"
            type="datetime-local"
            defaultValue={defaultEnd}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors cursor-pointer"
        >
          {mode === "create" ? "Create" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
