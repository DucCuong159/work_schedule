import { useCallback, useEffect, useRef } from "react";
import type { ContextMenuState } from "../../types/event";

interface ContextMenuProps {
  state: ContextMenuState;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const MENU_WIDTH = 144;
const MENU_HEIGHT = 96;
const PADDING = 8;

const ContextMenu = ({
  state,
  onEdit,
  onDelete,
  onClose,
}: Readonly<ContextMenuProps>) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLButtonElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!state.isOpen) return;

    triggerRef.current = document.activeElement as HTMLElement | null;
    const timer = setTimeout(() => editRef.current?.focus(), 0);

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [state.isOpen, onClose]);

  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (document.activeElement === editRef.current) {
          deleteRef.current?.focus();
        } else {
          editRef.current?.focus();
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        editRef.current?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        deleteRef.current?.focus();
      } else if (e.key === "Tab") {
        onClose();
      }
    },
    [onClose],
  );

  if (!state.isOpen) return null;

  const posX = Math.max(
    PADDING,
    Math.min(state.x, window.innerWidth - MENU_WIDTH),
  );
  const posY = Math.max(
    PADDING,
    Math.min(state.y, window.innerHeight - MENU_HEIGHT),
  );

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Event actions"
      tabIndex={-1}
      onKeyDown={handleMenuKeyDown}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-32 text-sm focus:outline-none"
      style={{ top: posY, left: posX }}
    >
      <button
        ref={editRef}
        role="menuitem"
        type="button"
        tabIndex={-1}
        onClick={onEdit}
        className="w-full px-4 py-1.5 text-left text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 focus:outline-none flex items-center gap-2 cursor-pointer"
      >
        <span aria-hidden="true">✏️</span> Edit
      </button>
      <button
        ref={deleteRef}
        role="menuitem"
        type="button"
        tabIndex={-1}
        onClick={onDelete}
        className="w-full px-4 py-1.5 text-left text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 focus:outline-none flex items-center gap-2 cursor-pointer"
      >
        <span aria-hidden="true">🗑️</span> Delete
      </button>
    </div>
  );
};

export default ContextMenu;
