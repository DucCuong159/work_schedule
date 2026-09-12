import { useCallback, useState } from "react";
import type { CalendarEvent, DialogMode, DialogState } from "../types/event";

const CLOSED_DIALOG_STATE: DialogState = {
  isOpen: false,
  mode: "view",
  event: null,
};

const useEventDialog = () => {
  const [dialog, setDialog] = useState<DialogState>(CLOSED_DIALOG_STATE);

  const openDialog = useCallback(
    (
      mode: DialogMode,
      event?: CalendarEvent | null,
      prefill?: { startTime: Date; endTime: Date },
    ) => {
      if (mode === "create") {
        setDialog({ isOpen: true, mode: "create", event: null, prefill });
      } else if (event) {
        setDialog({ isOpen: true, mode, event, prefill: undefined });
      }
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setDialog(CLOSED_DIALOG_STATE);
  }, []);

  return {
    dialog,
    openDialog,
    closeDialog,
  };
};

export default useEventDialog;
