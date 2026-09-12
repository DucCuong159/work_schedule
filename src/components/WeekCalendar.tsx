import { useCallback, useEffect, useMemo, useState } from "react";
import useCalendarEvents from "../hooks/useCalendarEvents";
import useCalendarScroll from "../hooks/useCalendarScroll";
import useContextMenu from "../hooks/useContextMenu";
import useEventDialog from "../hooks/useEventDialog";
import type { CalendarEvent, EventFormData } from "../types/event";
import { HOURS_IN_DAY, MINUTE_HEIGHT } from "../types/event";
import { MS_PER_MINUTE, getSevenDays, getStartOfDay } from "../utils/date";
import EventDialog from "./dialog/EventDialog";
import DayColumn from "./grid/DayColumn";
import TimeColumn from "./grid/TimeColumn";
import CalendarHeader from "./header/CalendarHeader";
import ContextMenu from "./menu/ContextMenu";
import Toast from "./Toast";

const WeekCalendar = () => {
  const [now, setNow] = useState(() => new Date());
  const [toast, setToast] = useState<string | null>(null);
  const { events, addEvent, updateEvent, moveEvent, deleteEvent } =
    useCalendarEvents(setToast);
  const { dialog, openDialog, closeDialog } = useEventDialog();
  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    const scheduleNextTick = () => {
      const msToNextMinute = MS_PER_MINUTE - (Date.now() % MS_PER_MINUTE);
      return setTimeout(() => {
        setNow(new Date());
        timerId = scheduleNextTick();
      }, msToNextMinute);
    };

    timerId = scheduleNextTick();

    return () => clearTimeout(timerId);
  }, []);

  const startOfDayTime = getStartOfDay(now).getTime();
  const days = useMemo(
    () => getSevenDays(new Date(startOfDayTime)),
    [startOfDayTime],
  );

  const { headerRef, gridRef, scrollbarW, handleGridScroll } =
    useCalendarScroll();

  const handleEventClick = useCallback(
    (event: CalendarEvent) => openDialog("view", event),
    [openDialog],
  );

  const handleEventContextMenu = useCallback(
    (e: React.MouseEvent, event: CalendarEvent) =>
      openContextMenu(e.clientX, e.clientY, event),
    [openContextMenu],
  );

  const handleCreateEvent = useCallback(
    (start: Date, end: Date) =>
      openDialog("create", undefined, { startTime: start, endTime: end }),
    [openDialog],
  );

  const clearToast = useCallback(() => setToast(null), []);

  const handleCloseDialog = useCallback(() => {
    clearToast();
    closeDialog();
  }, [clearToast, closeDialog]);

  const handleDialogSave = useCallback(
    (data: EventFormData) => {
      if (!dialog.isOpen) return;

      let success = false;
      if (dialog.mode === "create") {
        success = addEvent(data);
      } else if (dialog.mode === "edit" && dialog.event) {
        success = updateEvent(dialog.event.id, data);
      }

      if (success) {
        clearToast();
        closeDialog();
      }
    },
    [dialog, addEvent, updateEvent, closeDialog, clearToast],
  );

  const handleContextEdit = useCallback(() => {
    if (contextMenu.isOpen && contextMenu.event) {
      openDialog("edit", contextMenu.event);
      closeContextMenu();
    }
  }, [contextMenu, openDialog, closeContextMenu]);

  const handleContextDelete = useCallback(() => {
    if (contextMenu.isOpen && contextMenu.event) {
      deleteEvent(contextMenu.event.id);
      closeContextMenu();
    }
  }, [contextMenu, deleteEvent, closeContextMenu]);
  const totalGridHeight = HOURS_IN_DAY * 60 * MINUTE_HEIGHT;

  return (
    <div className="flex flex-col h-screen bg-white">
      <CalendarHeader
        ref={headerRef}
        days={days}
        now={now}
        scrollbarWidth={scrollbarW}
      />

      <div
        ref={gridRef}
        className="flex-1 overflow-x-auto overflow-y-scroll"
        onScroll={handleGridScroll}
      >
        <div className="flex" style={{ height: `${totalGridHeight}px` }}>
          <TimeColumn />
          <div className="flex flex-1 min-w-175">
            {days.map((day) => (
              <DayColumn
                key={day.toISOString()}
                day={day}
                now={now}
                events={events}
                onEventClick={handleEventClick}
                onEventContextMenu={handleEventContextMenu}
                onCreateEvent={handleCreateEvent}
                onDropEvent={moveEvent}
              />
            ))}
          </div>
        </div>
      </div>

      <EventDialog
        dialog={dialog}
        toast={toast}
        onClose={handleCloseDialog}
        onSave={handleDialogSave}
        onToastClose={clearToast}
      />

      <ContextMenu
        state={contextMenu}
        onEdit={handleContextEdit}
        onDelete={handleContextDelete}
        onClose={closeContextMenu}
      />

      {!dialog.isOpen && (
        <Toast message={toast} onClose={clearToast} />
      )}
    </div>
  );
};

export default WeekCalendar;
