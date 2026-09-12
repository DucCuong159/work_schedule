# Time Blocking Calendar (Work Schedule)

A modern, responsive, Google Calendar-style **Time Blocking Calendar** built with **React 19**, **TypeScript**, and **Tailwind CSS v4** with **Zero External Libraries** (no date-fns, moment, lodash, or UI component packages).

---

## ✨ Features & Requirements Mapping

1. **Event Information**:
   - Each event contains `title`, `description`, `startTime` (Date), and `endTime` (Date).
   - No all-day events — every event is precisely scheduled by date and time.
   - Character counters with strict limits (`title`: 256 characters, `description`: 10,000 characters).
2. **7-Day Display**:
   - Renders 7 consecutive days starting from the current date (`new Date()`).
   - Dynamic time zone indicator (`GMT+XX`) computed from the user's system timezone.
   - Current time indicator line on today's column.
3. **Drag-to-Create**:
   - Click and drag over empty time slots to create a new event with live visual selection preview.
   - Snaps to 15-minute intervals.
   - Automatically opens dialog with pre-filled start and end times.
4. **Drag-and-Drop Reschedule**:
   - Drag existing events to any day or time slot to reschedule.
   - Keeps grab offset intact for smooth, natural movement.
   - Prevents overlapping/conflicting schedules.
5. **Event Details View**:
   - Left-click on any event to open the detail view modal.
   - Dismissible via `✕` button or `Escape` key.
6. **Context Menu Actions**:
   - Right-click on any event to trigger custom context menu:
     - **Edit**: Opens edit form dialog with existing data.
     - **Delete**: Removes the event immediately.
   - Auto-clamps coordinates within viewport to prevent offscreen overflow.

---

## 🛠️ Tech Stack & Constraints

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Language**: [TypeScript 6](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Code Quality**: [Oxlint](https://oxc.rs/)
- **Zero External Libraries**: 100% native JavaScript Date manipulation, native HTML `<dialog>` with full accessibility, native HTML5 Drag and Drop API.
- **Clean Architecture**: Follows Single Responsibility Principle (SRP) with modular components, dedicated custom hooks, and 100% arrow functions.

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── WeekCalendar.tsx            # Main calendar container
│   ├── header/
│   │   ├── CalendarHeader.tsx      # Top header with dynamic timezone & scrollbar sync
│   │   └── DayHeaderCell.tsx       # Individual day header (weekday & date badge)
│   ├── grid/
│   │   ├── DayColumn.tsx           # Day grid column (hour lines, red indicator, drop target)
│   │   ├── EventBlock.tsx          # Rendered draggable event item
│   │   └── TimeColumn.tsx          # Left-side 24-hour time labels
│   ├── dialog/
│   │   ├── EventDialog.tsx         # Modal wrapper using native HTML <dialog>
│   │   ├── EventForm.tsx           # Create / Edit event form with character counters
│   │   └── EventViewDetails.tsx    # Read-only event inspection modal
│   ├── menu/
│   │   └── ContextMenu.tsx         # Right-click contextual action menu
│   └── Toast.tsx                   # Simple, non-blocking toast notification banner
├── hooks/
│   ├── useCalendarEvents.ts        # Event CRUD, conflict prevention & localStorage sync
│   ├── useCalendarScroll.ts        # Auto-scroll to current time & scrollbar measurement
│   ├── useContextMenu.ts           # Context menu visibility & target event state
│   ├── useDragToCreate.ts          # Mouse drag selection with leak-safe cleanup
│   ├── useEventDialog.ts           # Dialog mode (view/create/edit) controller
│   └── useEventDropTarget.ts       # HTML5 drop calculation & minute snapping
├── types/
│   └── event.ts                    # Core TypeScript interfaces and constants
└── utils/
    ├── date.ts                     # Deterministic, high-performance date utilities
    └── mockEvents.ts               # Dynamic initial mock events for immediate review
```

---

## 🚀 Getting Started

### 1. Installation

```bash
yarn install
```

### 2. Development Server

```bash
yarn dev
```

### 3. Production Build

```bash
yarn build
```

### 4. Code Quality & Linting

```bash
yarn lint
``` 
