import { useCallback, useState } from "react";
import type { CalendarEvent, ContextMenuState } from "../types/event";

const CLOSED_CONTEXT_MENU: ContextMenuState = {
  isOpen: false,
  x: 0,
  y: 0,
  event: null,
};

const useContextMenu = () => {
  const [contextMenu, setContextMenu] =
    useState<ContextMenuState>(CLOSED_CONTEXT_MENU);

  const openContextMenu = useCallback(
    (x: number, y: number, event: CalendarEvent) => {
      setContextMenu({ isOpen: true, x, y, event });
    },
    [],
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(CLOSED_CONTEXT_MENU);
  }, []);

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
  };
};

export default useContextMenu;
