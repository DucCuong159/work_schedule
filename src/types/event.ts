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

export type DialogState =
  | {
      isOpen: false;
      mode: 'view';
      event: null;
      prefill?: undefined;
    }
  | {
      isOpen: true;
      mode: 'create';
      event: null;
      prefill?: { startTime: Date; endTime: Date };
    }
  | {
      isOpen: true;
      mode: 'view';
      event: CalendarEvent;
      prefill?: undefined;
    }
  | {
      isOpen: true;
      mode: 'edit';
      event: CalendarEvent;
      prefill?: undefined;
    };

export type ContextMenuState =
  | {
      isOpen: false;
      x: number;
      y: number;
      event: null;
    }
  | {
      isOpen: true;
      x: number;
      y: number;
      event: CalendarEvent;
    };

export const MINUTE_HEIGHT = 1;
export const HOURS_IN_DAY = 24;
export const DAYS_IN_WEEK = 7;
export const MAX_DAY_END_MINUTES = HOURS_IN_DAY * 60;
export const MAX_TITLE_LENGTH = 256;
export const MAX_DESCRIPTION_LENGTH = 10000;
export const SNAP_INTERVAL_MINUTES = 15;

