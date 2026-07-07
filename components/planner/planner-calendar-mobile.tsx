"use client";

import { PlannerCalendarMobileHeader } from "@/components/planner/planner-calendar-mobile-header";
import { PlannerCalendarMonthGridMobile } from "@/components/planner/planner-calendar-month-grid-mobile";
import {
  APPLE_CALENDAR_ROOT,
  APPLE_CALENDAR_TODAY_BUTTON,
} from "@/config/payplan-apple-calendar";
import type { PlannedOccurrence } from "@/types/planner";

interface PlannerCalendarMobileProps {
  monthKey: string;
  year: number;
  month: number;
  gridDays: Date[];
  itemsByDay: Map<string, PlannedOccurrence[]>;
  selectedDayKey: string;
  onSelectDay: (dayKey: string) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function PlannerCalendarMobile({
  monthKey,
  year,
  month,
  gridDays,
  itemsByDay,
  selectedDayKey,
  onSelectDay,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: PlannerCalendarMobileProps) {
  return (
    <div className={APPLE_CALENDAR_ROOT}>
      <PlannerCalendarMobileHeader
        monthKey={monthKey}
        year={year}
        onPrevious={onPreviousMonth}
        onNext={onNextMonth}
      />

      <PlannerCalendarMonthGridMobile
        gridDays={gridDays}
        itemsByDay={itemsByDay}
        month={month}
        onSelectDay={onSelectDay}
        selectedDayKey={selectedDayKey}
        year={year}
      />

      <button
        type="button"
        onClick={onToday}
        className={APPLE_CALENDAR_TODAY_BUTTON}
      >
        Hari ini
      </button>
    </div>
  );
}
