import { useEffect, useRef } from "react";
import type { DialogMode, DialogState, EventFormData } from "../../types/event";
import Toast from "../Toast";
import EventForm from "./EventForm";
import EventViewDetails from "./EventViewDetails";

interface EventDialogProps {
  dialog: DialogState;
  toast?: string | null;
  onClose: () => void;
  onSave: (data: EventFormData) => void;
  onToastClose?: () => void;
}

const DIALOG_TITLES: Record<DialogMode, string> = {
  view: "Event Details",
  create: "Create New Event",
  edit: "Edit Event",
};

const EventDialog = ({
  dialog,
  toast,
  onClose,
  onSave,
  onToastClose,
}: Readonly<EventDialogProps>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el || !dialog.isOpen) return;

    el.showModal();

    return () => {
      if (el.open) el.close();
    };
  }, [dialog.isOpen]);

  if (!dialog.isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="backdrop:bg-black/40 rounded-2xl shadow-2xl p-0 w-full max-w-md border border-gray-200 bg-white m-auto fixed inset-0 max-h-[85vh] overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100 shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">
          {DIALOG_TITLES[dialog.mode]}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-lg cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {dialog.mode === "view" && dialog.event && (
        <EventViewDetails event={dialog.event} />
      )}

      {dialog.mode === "edit" && dialog.event && (
        <EventForm
          key={`edit-${dialog.event.id}`}
          mode="edit"
          event={dialog.event}
          onClose={onClose}
          onSave={onSave}
        />
      )}

      {dialog.mode === "create" && (
        <EventForm
          key="create-new"
          mode="create"
          event={null}
          prefill={dialog.prefill}
          onClose={onClose}
          onSave={onSave}
        />
      )}

      {toast && onToastClose && (
        <Toast message={toast} onClose={onToastClose} />
      )}
    </dialog>
  );
};

export default EventDialog;
