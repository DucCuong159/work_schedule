export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export interface EventFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export type DialogMode = 'view' | 'create' | 'edit';

export interface DialogState {
  isOpen: boolean;
  mode: DialogMode;
  event: CalendarEvent | null;
  prefill?: { startTime: Date; endTime: Date };
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  event: CalendarEvent | null;
}

export const MINUTE_HEIGHT = 1;
export const HOURS_IN_DAY = 24;
export const DAYS_IN_WEEK = 7;
export const MAX_DAY_END_MINUTES = HOURS_IN_DAY * 60;
export const MAX_TITLE_LENGTH = 256;
export const MAX_DESCRIPTION_LENGTH = 10000;
export const SNAP_INTERVAL_MINUTES = 15;

